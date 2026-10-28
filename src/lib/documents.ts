import "server-only";

export async function extractText(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  // 1. Handle TXT and CSV
  if (name.endsWith(".txt") || name.endsWith(".csv")) {
    return buf.toString("utf-8").slice(0, 200_000);
  }

  // 2. Handle PDF (using pdfjs-dist for maximum compatibility)
  if (name.endsWith(".pdf")) {
    try {
      // Import the legacy build which works in Node.js/serverless environments
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      
      // Load the document
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buf) });
      const pdf = await loadingTask.promise;
      
      let fullText = "";
      
      // Extract text page by page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }
      
      if (!fullText.trim()) {
        throw new Error("The PDF has no readable text. It might be a scanned image.");
      }
      
      return fullText.slice(0, 200_000);
    } catch (e: any) {
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