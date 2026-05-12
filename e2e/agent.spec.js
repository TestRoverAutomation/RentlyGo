import { test, expect } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Intercepts POST /api/agent and streams back a fake SSE response.
 * This lets tests run offline without hitting the real Anthropic API.
 */
async function mockAgentSSE(page, chunks) {
  await page.route("**/api/agent", async (route) => {
    const body = chunks
      .map((c) => `data: ${JSON.stringify(c)}\n\n`)
      .join("");
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
      body,
    });
  });
}

const FOLLOW_UP_RESPONSE = [
  { type: "tool_start", name: "search_rentals", input: { keywords: "apartment Albania Saranda", category: "properties" } },
  { type: "tool_result", name: "search_rentals", result: { count: 3, listings: [] } },
  { type: "tool_start", name: "build_rental_plan", input: {} },
  {
    type: "tool_result",
    name: "build_rental_plan",
    result: {
      plan: {
        title: "Albania Riviera Getaway",
        totalCost: 420,
        dates: { start: "2026-06-10", end: "2026-06-15", days: 5 },
        items: [
          {
            id: "apt-1",
            name: "Beachfront Apartment Saranda",
            emoji: "🏖️",
            host: "Artan",
            hostRating: 4.9,
            location: "Saranda",
            description: "Sea view, AC, pool",
            price: 84,
            totalForTrip: 420,
          },
        ],
        notes: "Book early — Saranda fills up in June.",
      },
    },
  },
  { type: "text", content: "Great choice! I found a beachfront apartment in Saranda for your June trip." },
  { type: "done" },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe("RentlyGo AI Agent — conversation flow", () => {

  test("idle state shows headline and initial input", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Rent anything/i })).toBeVisible();
    await expect(page.getByLabel("Describe your rental needs")).toBeVisible();
    await expect(page.getByRole("button", { name: /Find rentals/i })).toBeVisible();
    // Sticky reply bar should NOT be visible yet
    await expect(page.getByLabel("Reply to assistant")).not.toBeVisible();
  });

  test("example chip submits and starts conversation", async ({ page }) => {
    await mockAgentSSE(page, [
      { type: "text", content: "I can help with that camping trip! What dates work for you?" },
      { type: "done" },
    ]);
    await page.goto("/");
    // Click the camping example chip
    await page.getByRole("listitem").filter({ hasText: "camping" }).first().click();
    // Initial input disappears
    await expect(page.getByLabel("Describe your rental needs")).not.toBeVisible();
    // AI message arrives
    await expect(page.getByText("I can help with that camping trip!")).toBeVisible();
    // Sticky reply bar appears
    await expect(page.getByLabel("Reply to assistant")).toBeVisible();
  });

  test("AI follow-up question → reply bar is visible without scrolling", async ({ page }) => {
    await mockAgentSSE(page, [
      {
        type: "text",
        content:
          "I'd love to help plan your Albania holiday! When are you travelling? Where in Albania? How many guests?",
      },
      { type: "done" },
    ]);

    await page.goto("/");
    await page.getByLabel("Describe your rental needs").fill("I need to plan a holiday to Albania, need Airbnb help");
    await page.getByRole("button", { name: /Find rentals/i }).click();

    // Wait for AI response
    await expect(page.getByText("I'd love to help plan your Albania holiday!")).toBeVisible();

    // ── The key UX check ──────────────────────────────────────────────────────
    // The reply bar must be visible in the viewport WITHOUT the user scrolling.
    const replyBar = page.getByLabel("Reply to assistant");
    await expect(replyBar).toBeVisible();
    await expect(replyBar).toBeInViewport();

    // The AI response must also be visible (not hidden behind the sticky footer)
    const aiMessage = page.getByText("I'd love to help plan your Albania holiday!");
    await expect(aiMessage).toBeInViewport();
  });

  test("user can type follow-up and AI responds with rental plan", async ({ page }) => {
    // First turn: AI asks for details
    await mockAgentSSE(page, [
      { type: "text", content: "When are you travelling and how many guests?" },
      { type: "done" },
    ]);
    await page.goto("/");
    await page.getByLabel("Describe your rental needs").fill("Albania holiday Airbnb help");
    await page.getByRole("button", { name: /Find rentals/i }).click();
    await expect(page.getByText("When are you travelling")).toBeVisible();

    // Second turn: user provides details → AI returns rental plan
    await page.unroute("**/api/agent");
    await mockAgentSSE(page, FOLLOW_UP_RESPONSE);

    const replyInput = page.getByLabel("Reply to assistant");
    await expect(replyInput).toBeVisible();
    await replyInput.fill("June 10-15, Saranda, 2 guests");
    await page.getByRole("button", { name: /Send/i }).click();

    // User bubble visible
    await expect(page.getByText("June 10-15, Saranda, 2 guests")).toBeVisible();
    // Tool activity visible
    await expect(page.getByText("Searching listings")).toBeVisible();
    // Final plan visible
    await expect(page.getByText("Albania Riviera Getaway")).toBeVisible();
    await expect(page.getByText("Beachfront Apartment Saranda")).toBeVisible();
  });

  test("reply bar stays in viewport while user types follow-up", async ({ page }) => {
    await mockAgentSSE(page, [
      { type: "text", content: "What dates and how many guests?" },
      { type: "done" },
    ]);
    await page.goto("/");
    await page.getByLabel("Describe your rental needs").fill("Albania trip");
    await page.getByRole("button", { name: /Find rentals/i }).click();
    await expect(page.getByText("What dates and how many guests?")).toBeVisible();

    const replyInput = page.getByLabel("Reply to assistant");
    await replyInput.click();
    await replyInput.type("June 10-15, Saranda");

    // Reply bar must remain in viewport while typing
    await expect(replyInput).toBeInViewport();
    // AI message must still be visible above (not scrolled out of view)
    await expect(page.getByText("What dates and how many guests?")).toBeInViewport();
  });

  test("New search resets to idle state", async ({ page }) => {
    await mockAgentSSE(page, [
      { type: "text", content: "How many guests?" },
      { type: "done" },
    ]);
    await page.goto("/");
    await page.getByLabel("Describe your rental needs").fill("Albania trip");
    await page.getByRole("button", { name: /Find rentals/i }).click();
    await expect(page.getByLabel("Reply to assistant")).toBeVisible();

    await page.getByRole("button", { name: /New search/i }).click();

    // Back to idle
    await expect(page.getByRole("heading", { name: /Rent anything/i })).toBeVisible();
    await expect(page.getByLabel("Describe your rental needs")).toBeVisible();
    await expect(page.getByLabel("Reply to assistant")).not.toBeVisible();
  });

  test("pressing Enter in reply bar sends the message", async ({ page }) => {
    await mockAgentSSE(page, [
      { type: "text", content: "Tell me more details." },
      { type: "done" },
    ]);
    await page.goto("/");
    await page.getByLabel("Describe your rental needs").fill("Albania trip");
    await page.getByRole("button", { name: /Find rentals/i }).click();
    await expect(page.getByText("Tell me more details.")).toBeVisible();

    await page.unroute("**/api/agent");
    await mockAgentSSE(page, [
      { type: "text", content: "Perfect, searching now!" },
      { type: "done" },
    ]);

    const replyInput = page.getByLabel("Reply to assistant");
    await replyInput.fill("June 10-15, 2 guests");
    await replyInput.press("Enter");

    await expect(page.getByText("Perfect, searching now!")).toBeVisible();
  });

});
