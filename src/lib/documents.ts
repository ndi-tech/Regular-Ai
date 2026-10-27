import "server-only";

export async function extractText(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt") || name.endsWith(".csv")) {
    return buf.toString("utf-8").slice(0, 200_000);
  }
  if (name.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse")).default as any;
    const parsed = await pdfParse(buf);
    return (parsed.text ?? "").slice(0, 200_000);
  }
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const out = await mammoth.extractRawText({ buffer: buf });
    return (out.value ?? "").slice(0, 200_000);
  }
  throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
}

export const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
]);

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB