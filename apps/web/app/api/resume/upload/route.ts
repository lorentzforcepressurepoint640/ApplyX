export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Resume from "@/models/Resume"
import { parsePdf } from "@/lib/resume-parser"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const resumeText = await parsePdf(buffer)

    await dbConnect()

    // Store Or Update
    await Resume.findOneAndUpdate(
      { userId: session.user.email },
      {
        resumeText,
        fileName: file.name,
        content: buffer,
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      success: true,
      message: "Resume parsed and stored successfully",
      fileName: file.name,
    })
  } catch (error: any) {
    console.error("Error in resume upload:", error)
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
