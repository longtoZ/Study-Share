import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import env from 'dotenv';

env.config();

console.log(process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function processPdf() {
  const filePath = "2018_LNCS_GREC_ABaro.pdf";

  // Read the PDF file into a buffer
  const pdfBuffer = fs.readFileSync(filePath);

  // Convert the buffer to a Base64 string
  const base64Pdf = pdfBuffer.toString("base64");

  const contents = [
    { text: "Summarize the key findings from this document:" },
    {
      inlineData: {
        mimeType: 'application/pdf',
        data: base64Pdf
      }
    }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents
  });

  console.log(response.text);
}

processPdf();

// *   **Direct Image Processing:** The system processes raw image columns without prior staff line removal or explicit feature extraction, effectively preserving spatial information critical for pitch determination.
// *   **Competitive Performance Against Commercial Software:** In qualitative comparisons, the proposed method correctly recognized music symbols in a simple score where a commercial OMR software (PhotoScore) made errors, demonstrating its potential, despite the commercial system's use of additional syntactic rules not incorporated in this work.
// *   **Limitations and Future Work:** While highly effective for single-staff scores, the authors note limitations for more complex, polyphonic music. Future work includes incorporating musical rules/semantics, applying transfer learning for handwritten scores, and extending the approach to polyphonic scores using techniques like CNNs and attention mechanisms.     

// *   **Direct Image Processing:** The system processes raw image columns without prior staff line removal or explicit feature extraction, effectively preserving spatial information critical for pitch determination.
// *   **Competitive Performance Against Commercial Software:** In qualitative comparisons, the proposed method correctly recognized music symbols in a simple score where a commercial OMR software (PhotoScore) made errors, demonstrating its potential, despite the commercial system's use of additional syntactic rules not incorporated in this work.
// *   **Limitations and Future Work:** While highly effective for single-staff scores, the authors note limitations for more complex, polyphonic music. Future work includes incorporating musical rules/semantics, applying transfer learning for han*   **Direct Image Processing:** The system processes raw image columns without prior staff line removal or explicit feature extraction, effectively preserving spatial information critical for pitch determination.
// *   **Competitive Performance Against Commercial Software:** In qualitative comparisons, the proposed method correctly recognized music symbols in a simple score where a commercial OMR software (PhotoScore) made errors, demonstrating its potential, despite the commercial system's use of additional syntactic rules not incorporated in this work.
// *   **Direct Image Processing:** The system processes raw image columns without prior staff line removal or explicit feature extraction, effectively preserving spatial information critical for pitch determination.
// *   **Competitive Performance Against Commercial Software:** In qualitative comparisons, the proposed method correctly recognized music symbols in a simple score where a commercial OMR software (PhotoScore) made errors, demonstrating its potent*   **Direct Image Processing:** The system processes raw image columns without prior staff line removal or explicit feature extraction, effectively preserving spatial information critical for pitch determination.
// *   **Competitive Performance Against Commercial Software:** In qualitative comparisons, the proposed method correctly rec*   **Direct Image Processing:** The system processes raw image columns without prior staff line removal or explicit feature extraction, effectively preserving spatial information critical for pitch determination.
// *   **Direct Image Processing:** The system processes raw image columns without prior staff line removal or explicit featu*   **Direct Image Processing:** The system processes raw image columns without prior staff line removal or explicit feature extraction, effectively preserving spatial information critical for pitch determination.
// re extraction, effectively preserving spatial information critical for pitch determination.
// *   **Competitive Performance Against Commercial Software:** In qualitative comparisons, the proposed method correctly recognized music symbols in a simple score where a commercial OMR software (PhotoScore) made errors, demonstrating its potentognized music symbols in a simple score where a commercial OMR software (PhotoScore) made errors, demonstrating its potentognized music symbols in a simple score where a commercial OMR software (PhotoScore) made errors, demonstrating its potential, despite the commercial system's use of additional syntactic rules not incorporated in this work.
// ial, despite the commercial system's use of additional syntactic rules not incorporated in this work.
// *   **Limitations and Future Work:** While highly effective for single-staff scores, the authors note limitations for more complex, polyphonic music. Future work includes incorporating musical rules/semantics, applying transfer learning for handwritten scores, and extending the approach to polyphonic scores using techniques like CNNs and attention mechanisms.  