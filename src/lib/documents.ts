import "server-only";

export async function extractText(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  // 1. Handle TXT and CSV (Instant)
  if (name.endsWith(".txt") || name.endsWith(".csv")) {
    return buf.toString("utf-8").slice(0, 200_000);
  }

  // 2. Handle PDF
  if (name.endsWith(".pdf")) {
    try {
      const pdfParse = (await import("pdf-parse")).default as any;
      const parsed = await pdfParse(buf);
      if (!parsed.text || parsed.text.trim() === "") {
        throw new Error("The PDF has no readable text. It might be a scanned image.");
      }
      return parsed.text.slice(0, 200_000);
    } catch (e: any) {
      // If pdf-parse fails (e.g., bad XRef entry), throw a user-friendly error
      console.error("PDF Parsing Error:", e);
      throw new Error("This PDF is corrupted or uses an unsupported format. Please try exporting it again, or upload a DOCX/TXT version.");
    }
  }

  // 3. Handle DOCX
  if (name.endsWith(".docx")) {
    try {
      const mammoth = await import("mammoth");
      const out = await mammoth.extractRawText({ buffer: buf });
      if (!out.value || out.value.trim() === "") {
        throw new Error("The DOCX has no readable text.");
      }
      return out.value.slice(0, 200_000);
    } catch (e: any) {
      console.error("DOCX Parsing Error:", e);
      throw new Error("Could not read this DOCX file. Please try re-saving it or upload a TXT version.");
    }
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