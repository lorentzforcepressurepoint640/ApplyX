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

const LinkedInSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [extensionKey, setExtensionKey] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [authorInput, setAuthorInput] = useState("");
  const [postInput, setPostInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    storage.get("extensionKey").then(val => {
      setExtensionKey(val as string || "");
      if (!val) setIsConfiguring(true);
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
    if (!extensionKey) {
      alert("Extension Key is required.");
      return;
    }
    await storage.set("extensionKey", extensionKey);
    setIsConfiguring(false);
  };

  const startAIGeneration = async () => {
    if (!postInput || !authorInput) {
      setError("Please provide all fields.");
      return;
    }
    if (!extensionKey) {
      setIsConfiguring(true);
      return;
    }

    setLoading(true);
    setError("");
    setShowReview(false);

    try {
      if (!extensionKey) {
        setIsConfiguring(true);
        return;
      }
      // Use backend generation with stored resume
      const { data } = await axios.post("http://localhost:3000/api/generate-email", {
        postText: postInput,
        authorName: authorInput,
        company: ""
      }, {
        headers: { 'x-api-key': extensionKey }
      });
      setEmailSubject(data.subject || "Re: Job Inquiry");
      setEmailText(data.body || "");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${emailSubject}\n\n${emailText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (!emailInput) return;
    setSending(true);
    try {
      await axios.post("http://localhost:3000/api/send-email", {
        to: emailInput,
        subject: emailSubject,
        body: emailText
      }, {
        headers: { 'x-api-key': extensionKey }
      });
      alert("Email sent successfully via ApplyX!");
      setIsOpen(false);
    } catch (err: any) {
      alert("Failed to send: " + (err.response?.data?.error || err.message));
    } finally {
      setSending(false);
    }
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
                  <Label>ApplyX Extension Key</Label>
                  <Input
                    placeholder="ext_..."
                    value={extensionKey}
                    onChange={e => setExtensionKey(e.target.value)}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '5px' }}>
                    Copy your unique key from the ApplyX dashboard to connect your account.
                  </p>

                  <PrimaryButton style={{ marginTop: '20px' }} onClick={handleSaveConfig}>
                    Save Extension Key
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
