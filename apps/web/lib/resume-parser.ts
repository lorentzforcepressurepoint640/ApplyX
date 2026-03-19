// lib/resume-parser.ts

const pdf = require("pdf-parse")

export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer)
    return data.text || ""
  } catch (error) {
    console.error("PDF parse error:", error)
    throw new Error("Failed to parse PDF")
  }
}
