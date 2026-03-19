export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
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
    const base64Content = buffer.toString('base64')
    const resume_text = await parsePdf(buffer)
    const portfolioUrl = formData.get("portfolioUrl") as string || ""
    const fullName = formData.get("fullName") as string || ""

    // 1. Update/Upsert Resume in Supabase 'resumes'
    const { error: resumeError } = await supabase
      .from('resumes')
      .upsert({
        user_id: session.user.email,
        resume_text,
        file_name: file.name,
        file_content: base64Content, // Store base64 for email attachments
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (resumeError) throw resumeError;

    // 2. Update Profile (Optional Portfolio & Name)
    const profileUpdate: any = {};
    if (portfolioUrl) profileUpdate.portfolio_url = portfolioUrl;
    if (fullName) profileUpdate.name = fullName;

    if (Object.keys(profileUpdate).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('email', session.user.email);
      
      if (profileError) console.error("Profile update error:", profileError);
    }

    return NextResponse.json({
      success: true,
      message: "Resume & Portfolio updated successfully",
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
