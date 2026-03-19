import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Loader2, Send, Copy, Check, X } from "lucide-react";
import { Storage } from "@plasmohq/storage";
import { allSidebarStyles as styles } from "./styles";
import { Card, Label, Input, TextArea, PrimaryButton } from "./UIComponents";

export const config: any = {
  matches: ["https://www.linkedin.com/*"]
};

const storage = new Storage();

// Direct OpenAI generation logic for simplified setup
import OpenAI from "openai";

const LinkedInSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [resumeInput, setResumeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [authorInput, setAuthorInput] = useState("");
  const [postInput, setPostInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    storage.get("apiKey").then(val => {
      setApiKey(val as string);
      if (!val) setIsConfiguring(true);
      setKeyInput(val as string || "");
    });

    storage.get("resumeText").then(val => {
      setResumeText(val as string || "");
      setResumeInput(val as string || "");
    });

    storage.watch({
      "triggerSidebar": (c) => {
        if (c.newValue) {
          const { author, postText, email } = c.newValue;
          setAuthorInput(author || "Author");
          setPostInput(postText || "");
          setEmailInput(email || "");
          setIsOpen(true);
          setShowReview(true);
          setError("");
          storage.set("triggerSidebar", null);
        }
      }
    });
  }, []);

  const handleSaveConfig = async () => {
    if (!keyInput) {
      alert("OpenAI API Key is required.");
      return;
    }
    await storage.set("apiKey", keyInput);
    await storage.set("resumeText", resumeInput);
    setApiKey(keyInput);
    setResumeText(resumeInput);
    setIsConfiguring(false);
  };

  const startAIGeneration = async () => {
    if (!postInput || !authorInput) {
      setError("Please provide all fields.");
      return;
    }
    if (!apiKey) {
      setIsConfiguring(true);
      return;
    }

    setLoading(true);
    setError("");
    setShowReview(false);

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = `
        You are an AI assistant helping a user write a personalized job outreach email on LinkedIn.
        
        USER RESUME CONTEXT:
        ${resumeText}

        LINKEDIN POST CONTEXT:
        Author: ${authorInput}
        Post Content: ${postInput}

        TASK:
        Generate a professional, concise, and personalized outreach email or message. 
        Focus on how the user's background (from resume) aligns with the post context.
        Keep it under 150 words.

        Return the response in JSON format:
        {
          "subject": "Clear, catchy subject line",
          "body": "The message body"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = JSON.parse(response.choices[0].message.content || "{}");
      setEmailSubject(content.subject || "Re: Job Inquiry");
      setEmailText(content.body || "");
    } catch (err: any) {
      setError(err.message || "Generation failed. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${emailSubject}\n\n${emailText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    alert("Sending via backend is disabled in local mode. Please use Copy and paste into your email client.");
  };

  return (
    <>
      <style>{styles}</style>
      
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="floating-toggle">
          <Mail size={28} />
        </button>
      )}

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}>
          <div className="sidebar-container" onClick={e => e.stopPropagation()}>
            <div className="sidebar-header">
              <div className="header-content">
                <h3>ApplyX</h3>
                <p>1-Click AI Job Outreach</p>
              </div>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="sidebar-content">
              {isConfiguring ? (
                <Card>
                  <Label>OpenAI API Key</Label>
                  <Input 
                    type="password" 
                    placeholder="sk-..." 
                    value={keyInput}
                    onChange={e => setKeyInput(e.target.value)}
                  />
                  <div style={{ height: '15px' }} />
                  <Label>Your Resume / Bio (Context)</Label>
                  <TextArea 
                    placeholder="Paste your resume or a brief bio here..." 
                    value={resumeInput}
                    onChange={e => setResumeInput(e.target.value)}
                    style={{ height: '150px' }}
                  />
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                    💡 Tip: Paste your full resume or a brief bio so the AI knows your experience.
                  </p>
                  <PrimaryButton style={{ marginTop: '15px' }} onClick={handleSaveConfig}>
                    Save Config
                  </PrimaryButton>
                </Card>
              ) : showReview ? (
                <Card style={{ background: '#f0f9ff', border: 'none' }}>
                  <Label>Recipient Email</Label>
                  <Input value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Email extracted if available..." />
                  <div style={{ height: '15px' }} />
                  <Label>Author Name</Label>
                  <Input value={authorInput} onChange={e => setAuthorInput(e.target.value)} />
                  <div style={{ height: '15px' }} />
                  <Label>Context</Label>
                  <TextArea value={postInput} onChange={e => setPostInput(e.target.value)} />
                  <PrimaryButton style={{ marginTop: '20px' }} onClick={startAIGeneration}>
                    Generate <Send size={20} />
                  </PrimaryButton>
                </Card>
              ) : loading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <Loader2 size={56} color="#2563eb" className="animate-spin" />
                  <h4 style={{ margin: '24px 0 8px', fontSize: '1.4rem' }}>Writing...</h4>
                  <p style={{ fontSize: '1rem', color: '#64748b' }}>Crafting your personalized message.</p>
                </div>
              ) : error ? (
                <Card style={{ color: '#b91c1c', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.1rem' }}>{error}</p>
                  <button className="dashboard-link" onClick={() => setShowReview(true)}>Retry</button>
                </Card>
              ) : (
                <>
                  <Card>
                    <Label>Sending To</Label>
                    <Input value={emailInput} onChange={e => setEmailInput(e.target.value)} style={{ fontWeight: 600 }} />
                  </Card>
                  <Card>
                    <Label>Subject</Label>
                    <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} style={{ fontWeight: 700 }} />
                  </Card>
                  <Card>
                    <Label>Message</Label>
                    <TextArea value={emailText} onChange={e => setEmailText(e.target.value)} />
                  </Card>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <PrimaryButton style={{ background: '#f1f5f9', color: '#475569', boxShadow: 'none' }} onClick={handleCopy}>
                      {copied ? <Check size={20} color="#10b981" /> : <Copy size={20} />} Copy
                    </PrimaryButton>
                    <PrimaryButton onClick={handleSend} disabled={sending}>
                      {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />} Send
                    </PrimaryButton>
                  </div>
                </>
              )}
            </div>

            <div className="sidebar-footer">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="footer-text">ApplyX v1.0 • Local Mode</span>
                <button 
                  onClick={() => setIsConfiguring(true)} 
                  className="dashboard-link" 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  ⚙️ Settings
                </button>
              </div>
              <a href="https://github.com/kiet7uke/ApplyX" target="_blank" className="dashboard-link">GitHub ↗</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkedInSidebar;
