import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Loader2, Send, Copy, Check, X } from "lucide-react";
import { Storage } from "@plasmohq/storage";

export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*"]
};

const storage = new Storage();
const API_BASE = "https://linkedin-bot-omega.vercel.app";

const styles = `
  :host {
    all: initial;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: flex-end;
    animation: fadeIn 0.4s ease-out;
  }

  .sidebar-container {
    width: 500px;
    height: 100vh;
    background: #ffffff;
    box-shadow: -20px 0 50px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    border-left: 1px solid #e2e8f0;
  }

  .sidebar-header {
    background: #2563eb;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    padding: 32px 28px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-content h3 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .header-content p {
    margin: 6px 0 0;
    font-size: 0.85rem;
    font-weight: 600;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .close-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg) scale(1.1);
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: #f8fafc;
  }

  .card {
    background: white;
    padding: 24px;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
    transition: all 0.2s;
  }

  .label {
    display: block;
    font-size: 0.85rem;
    font-weight: 800;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 10px;
    padding-left: 2px;
  }

  .input-field {
    width: 100%;
    padding: 16px 18px;
    border-radius: 14px;
    border: 2.5px solid #f1f5f9;
    background: #ffffff;
    font-size: 1.05rem;
    color: #0f172a;
    transition: all 0.3s ease;
    font-family: inherit;
    line-height: 1.6;
  }

  .input-field:focus {
    outline: none;
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.1);
  }

  .textarea-field {
    resize: none;
    min-height: 220px;
  }

  .primary-button {
    width: 100%;
    padding: 18px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 16px;
    font-weight: 800;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.3);
  }

  .primary-button:hover {
    background: #1d4ed8;
    box-shadow: 0 12px 28px -6px rgba(37, 99, 235, 0.45);
    transform: translateY(-2px);
  }

  .primary-button:active {
    transform: translateY(0);
  }

  .floating-toggle {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2147483646;
    background: #2563eb;
    color: white;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 18px;
    border-radius: 16px 0 0 16px;
    cursor: pointer;
    box-shadow: -6px 0 25px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-toggle:hover {
    padding-right: 28px;
    background: #1d4ed8;
  }

  .sidebar-footer {
    padding: 20px 28px;
    border-top: 1px solid #e2e8f0;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-text {
    font-size: 0.8rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .dashboard-link {
    font-size: 0.8rem;
    font-weight: 800;
    color: #2563eb;
    text-decoration: none;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .dashboard-link:hover {
    background: #eff6ff;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LinkedInSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [keyInput, setKeyInput] = useState("");
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
      setApiKey(val);
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

  const handleSaveKey = async () => {
    if (!keyInput.startsWith("ext_")) {
      alert("Invalid format.");
      return;
    }
    await storage.set("apiKey", keyInput);
    setApiKey(keyInput);
    setIsConfiguring(false);
  };

  const startAIGeneration = async () => {
    if (!postInput || !authorInput) {
      setError("Please provide all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setShowReview(false);

    try {
      const { data } = await axios.post(`${API_BASE}/api/generate-email`, {
        postText: postInput,
        authorName: authorInput
      }, {
        headers: { "x-api-key": apiKey },
        withCredentials: true
      });
      setEmailSubject(data.subject);
      setEmailText(data.body);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setApiKey(null);
        await storage.remove("apiKey");
        setError("Invalid Key.");
      } else {
        setError("Generation failed.");
      }
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
    if (!emailInput) {
      alert("Please provide a recipient email address.");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API_BASE}/api/send-email`, {
        to: emailInput,
        subject: emailSubject,
        body: emailText
      }, {
        headers: { "x-api-key": apiKey },
        withCredentials: true
      });
      alert("Sent!");
      setIsOpen(false);
    } catch (err) {
      alert("Error.");
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
                <h3>Job AI Assistant</h3>
                <p>Intelligent Outreach</p>
              </div>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="sidebar-content">
              {isConfiguring ? (
                <div className="card">
                  <label className="label">Configuration</label>
                  <input 
                    type="password" 
                    placeholder="ext_..." 
                    className="input-field"
                    value={keyInput}
                    onChange={e => setKeyInput(e.target.value)}
                  />
                  <button className="primary-button" style={{ marginTop: '15px' }} onClick={handleSaveKey}>
                    Save Connection
                  </button>
                </div>
              ) : showReview ? (
                <div className="card" style={{ background: '#f0f9ff', border: 'none' }}>
                  <label className="label">Recipient Email</label>
                  <input className="input-field" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Email extracted if available..." />
                  <div style={{ height: '15px' }} />
                  <label className="label">Author Name</label>
                  <input className="input-field" value={authorInput} onChange={e => setAuthorInput(e.target.value)} />
                  <div style={{ height: '15px' }} />
                  <label className="label">Context</label>
                  <textarea className="input-field textarea-field" value={postInput} onChange={e => setPostInput(e.target.value)} />
                  <button className="primary-button" style={{ marginTop: '20px' }} onClick={startAIGeneration}>
                    Generate <Send size={20} />
                  </button>
                </div>
              ) : loading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <Loader2 size={56} color="#2563eb" className="animate-spin" />
                  <h4 style={{ margin: '24px 0 8px', fontSize: '1.4rem' }}>Writing...</h4>
                  <p style={{ fontSize: '1rem', color: '#64748b' }}>Crafting your personalized message.</p>
                </div>
              ) : error ? (
                <div className="card" style={{ color: '#b91c1c', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.1rem' }}>{error}</p>
                  <button className="dashboard-link" onClick={() => setShowReview(true)}>Retry</button>
                </div>
              ) : (
                <>
                  <div className="card">
                    <label className="label">Sending To</label>
                    <input className="input-field" value={emailInput} onChange={e => setEmailInput(e.target.value)} style={{ fontWeight: 600 }} />
                  </div>
                  <div className="card">
                    <label className="label">Subject</label>
                    <input className="input-field" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} style={{ fontWeight: 700 }} />
                  </div>
                  <div className="card">
                    <label className="label">Message</label>
                    <textarea className="input-field textarea-field" value={emailText} onChange={e => setEmailText(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="primary-button" style={{ background: '#f1f5f9', color: '#475569', boxShadow: 'none' }} onClick={handleCopy}>
                      {copied ? <Check size={20} color="#10b981" /> : <Copy size={20} />} Copy
                    </button>
                    <button className="primary-button" onClick={handleSend} disabled={sending}>
                      {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />} Send
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="sidebar-footer">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="footer-text">v1.3 ACTIVE</span>
                <button 
                  onClick={() => setIsConfiguring(true)} 
                  className="dashboard-link" 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  ⚙️ Settings
                </button>
              </div>
              <a href={`${API_BASE}/dashboard`} target="_blank" className="dashboard-link">Account ↗</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkedInSidebar;
