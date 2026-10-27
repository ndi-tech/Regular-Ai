export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export interface AIProvider {
  complete(messages: ChatMessage[], opts?: { json?: boolean }): Promise<string>;
}