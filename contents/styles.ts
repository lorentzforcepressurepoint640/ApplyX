export const baseStyles = `
  :host {
    all: initial;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

export const animationStyles = `
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;

export const commonComponentStyles = `
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

  .primary-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const sidebarSpecificStyles = `
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
`;

export const outreachButtonStyles = `
  .outreach-btn-container {
    display: inline-flex;
    align-items: center;
    padding: 0 4px;
    margin: 4px 0;
  }
  .outreach-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #0077b5;
    background: linear-gradient(135deg, #0077b5 0%, #005a87 100%);
    color: white !important;
    border: none;
    border-radius: 24px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 119, 181, 0.25);
    white-space: nowrap;
    text-decoration: none !important;
  }
  .outreach-btn:hover {
    background: #0087cb;
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 119, 181, 0.35);
  }
  .outreach-btn svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

export const allSidebarStyles = `
  ${baseStyles}
  ${animationStyles}
  ${commonComponentStyles}
  ${sidebarSpecificStyles}
`;

