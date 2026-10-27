import { AIProvider, ChatMessage } from "./provider";

export class GroqProvider implements AIProvider {
  constructor(
    private apiKey = process.env.GROQ_API_KEY,
    private url = process.env.GROQ_API_URL ?? "https://api.groq.com/openai/v1/chat/completions",
    private model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile"
  ) {
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured");
  }

  async complete(messages: ChatMessage[], opts?: { json?: boolean }): Promise<string> {
    const res = await fetch(this.url!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.2,
        response_format: opts?.json ? { type: "json_object" } : undefined,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Groq API error ${res.status}: ${text.slice(0, 300)}`);
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("AI provider returned no content");
    return content;
  }
}

export const getAIProvider = (): AIProvider => new GroqProvider();