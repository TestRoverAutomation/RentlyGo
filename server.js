import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { searchRentals, checkAvailability, buildRentalPlan } from "./src/data/agentTools.js";

dotenv.config();

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are RentlyGo's AI Rental Concierge — the world's first agentic P2P rental planner.

When a user describes their mission (an event, project, trip, or occasion), you:
1. Think about EVERYTHING they'll need — including things they haven't thought of
2. Call search_rentals multiple times — one call per equipment type needed
3. Call check_availability with all found listing IDs for the user's dates
4. Call build_rental_plan with the best available items and a clear mission title
5. Write a brief, warm summary of the plan you've built

Examples:
- "garden party for 50 people" → search: marquee, chairs, tables, BBQ, sound system, outdoor lighting
- "weekend filming project" → search: DSLR camera, gimbal, lighting rig, audio recorder
- "camping trip" → search: campervan or tent, sleeping bags, camping gear
- "kitchen renovation" → search: power tools, scaffolding, cement mixer

Rules:
- Always search first — never invent listings
- Be comprehensive — users rely on you not to miss things
- After build_rental_plan, write a 2-3 sentence friendly summary
- If location is provided, filter searches by that location
- Extract dates from the mission if mentioned (format as YYYY-MM-DD)`;

const TOOLS = [
  {
    name: "search_rentals",
    description:
      "Search available rental listings by keywords, category, and location. Call this once per equipment type needed.",
    input_schema: {
      type: "object",
      properties: {
        keywords: {
          type: "string",
          description: 'What to search for (e.g. "marquee", "DSLR camera", "BBQ grill")',
        },
        category: {
          type: "string",
          enum: ["outdoor", "electronics", "vehicles", "properties", "tools", "furniture", "clothing", "misc"],
          description: "Optional category filter",
        },
        location: {
          type: "string",
          description: "City to search in",
        },
        max_price_per_day: {
          type: "number",
          description: "Max price per day in GBP",
        },
      },
      required: ["keywords"],
    },
  },
  {
    name: "check_availability",
    description: "Check if specific listings are available for the requested dates.",
    input_schema: {
      type: "object",
      properties: {
        listing_ids: {
          type: "array",
          items: { type: "string" },
          description: "Array of listing IDs to check",
        },
        start_date: { type: "string", description: "Start date (YYYY-MM-DD)" },
        end_date: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
      required: ["listing_ids"],
    },
  },
  {
    name: "build_rental_plan",
    description:
      "Build the final rental plan. Call this after searching and checking availability.",
    input_schema: {
      type: "object",
      properties: {
        listing_ids: {
          type: "array",
          items: { type: "string" },
          description: "IDs of listings to include in the plan",
        },
        start_date: { type: "string", description: "Start date (YYYY-MM-DD)" },
        end_date: { type: "string", description: "End date (YYYY-MM-DD)" },
        mission_title: {
          type: "string",
          description: "Short title for this rental mission (e.g. 'Garden Party for 50')",
        },
        notes: {
          type: "string",
          description: "Optional tips or notes for the user about this plan",
        },
      },
      required: ["listing_ids", "mission_title"],
    },
  },
];

async function executeTool(name, input) {
  switch (name) {
    case "search_rentals":
      return searchRentals(input);
    case "check_availability":
      return checkAvailability(input);
    case "build_rental_plan":
      return buildRentalPlan(input);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

app.post("/api/agent", async (req, res) => {
  const { mission, location } = req.body;

  if (!mission?.trim()) {
    return res.status(400).json({ error: "Mission is required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (type, data = {}) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  const userMessage = mission + (location ? `. Location: ${location}` : "");
  const messages = [{ role: "user", content: userMessage }];

  try {
    let iterations = 0;

    while (iterations < 10) {
      iterations++;

      const stream = client.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages,
      });

      stream.on("text", (text) => {
        send("text", { content: text });
      });

      const finalMsg = await stream.finalMessage();
      messages.push({ role: "assistant", content: finalMsg.content });

      if (finalMsg.stop_reason === "end_turn") {
        send("done", {});
        break;
      }

      if (finalMsg.stop_reason === "tool_use") {
        const toolResults = [];

        for (const block of finalMsg.content) {
          if (block.type === "tool_use") {
            send("tool_start", { name: block.name, input: block.input });

            const result = await executeTool(block.name, block.input);

            send("tool_result", { name: block.name, result });

            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify(result),
            });
          }
        }

        messages.push({ role: "user", content: toolResults });
      }
    }
  } catch (err) {
    console.error("Agent error:", err.message);
    send("error", { message: err.message });
  }

  res.end();
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`RentlyGo Agent API running on http://localhost:${PORT}`);
});
