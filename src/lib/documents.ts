import "server-only";

export async function extractText(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt") || name.endsWith(".csv")) {
    return buf.toString("utf-8").slice(0, 200_000);
  }

  if (name.endsWith(".pdf")) {
    if (buf.length < 5 || buf.slice(0, 4).toString() !== "%PDF") {
      throw new Error("This is not a valid PDF file.");
    }

    try {
      const { extractText: unpdfExtract } = await import("unpdf");
      const result = await unpdfExtract(new Uint8Array(buf), { mergePages: true });
      const text = result.text;
      
      if (!text || !text.trim()) {
        throw new Error("This PDF has no extractable text. It is likely a scanned image.");
      }
      return text.slice(0, 200_000);
    } catch (e: any) {
      if (e.message && (e.message.includes("scanned") || e.message.includes("no extractable"))) throw e;
      console.error("PDF Parsing Error:", e);
      throw new Error("We could not read this PDF. Try opening it in Chrome, then Ctrl+P, then Save as PDF.");
    }
  }

  if (name.endsWith(".docx")) {
    try {
      const mammoth = await import("mammoth");
      const out = await mammoth.extractRawText({ buffer: buf });
      if (!out.value?.trim()) throw new Error("empty");
      return out.value.slice(0, 200_000);
    } catch {
      throw new Error("We could not read this DOCX. Try a TXT version.");
    }
  }

  throw new Error("Unsupported file type.");
}

export const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
]);

export const MAX_FILE_SIZE = 15 * 1024 * 1024;