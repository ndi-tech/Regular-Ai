import "server-only";

export async function extractText(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  // 1. Handle TXT and CSV
  if (name.endsWith(".txt") || name.endsWith(".csv")) {
    return buf.toString("utf-8").slice(0, 200_000);
  }

  // 2. Handle PDF via external API fallback
  if (name.endsWith(".pdf")) {
    if (buf.length < 5 || buf.slice(0, 4).toString() !== "%PDF") {
      throw new Error("This is not a valid PDF file.");
    }

    try {
      // Try unpdf first (fast, in-memory)
      const { extractText: unpdfExtract } = await import("unpdf");
      const result = await unpdfExtract(new Uint8Array(buf), { mergePages: true });
      
      if (result.text && result.text.trim().length > 0) {
        return result.text.slice(0, 200_000);
      }
    } catch (e) {
      console.warn("unpdf failed, falling back to external API", e);
    }

    // Fallback: Use a free API to extract text
    try {
      const formData = new FormData();
      formData.append("file", new Blob([buf], { type: "application/pdf" }), file.name);
      
      const response = await fetch("https://api.pdf.co/v1/pdf/convert/to/text", {
        method: "POST",
        headers: { "x-api-key": "YOUR_FREE_API_KEY_HERE" }, // Replace with a free key
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.body) return data.body.slice(0, 200_000);
      }
    } catch (apiError) {
      console.error("API fallback failed", apiError);
    }

    // Final fallback error
    throw new Error(
      "This PDF has no extractable text or uses an unsupported format. " +
      "Try opening it in Chrome, then Ctrl+P, then Save as PDF, or upload a DOCX/TXT version."
    );
  }

  // 3. Handle DOCX
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