/**
 * Connects to /api/agent via SSE and calls onEvent for each streamed event.
 * Returns a promise that resolves when the stream ends.
 */
export async function runMission({ conversationHistory, location, onEvent }) {
  const response = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationHistory, location }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep incomplete last line

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          onEvent(data);
        } catch {
          // skip malformed lines
        }
      }
    }
  }
}
