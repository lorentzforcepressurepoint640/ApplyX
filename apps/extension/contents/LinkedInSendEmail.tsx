import React from "react";
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo";
import { Mail } from "lucide-react";
import { Storage } from "@plasmohq/storage";
import { outreachButtonStyles as styles } from "./styles";


export const config: PlasmoCSConfig = {
  matches: [
    "https://www.linkedin.com/feed*",
    "https://www.linkedin.com/posts/*",
    "https://www.linkedin.com/search/results/*"
  ]
};

const storage = new Storage();

// Target the social action bar for native placement
export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  return document.querySelectorAll([
    ".feed-shared-social-action-bar",
    ".artdeco-card .feed-shared-social-action-bar",
    ".entity-result__actions"
  ].join(","));
};

const LinkedInInlineButton = ({ anchor }) => {
  const handleGenerateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Find the closest post element to extract data
    const postElement = anchor.element.closest(".feed-shared-update-v2, .entity-result__item, [data-urn], .fixed-full");
    // Smarter author extraction to avoid duplicates and metadata like "• 3rd+Verified"
    const authorElement = postElement?.querySelector([
      ".update-components-actor__name [aria-hidden='true']",
      ".update-components-actor__name",
      ".feed-shared-update-v2__actor-link > span[aria-hidden='true']",
      ".update-components-actor__title [aria-hidden='true']",
      ".entity-result__title-text a [aria-hidden='true']",
      ".entity-result__title-text a",
      ".feed-shared-actor__title [aria-hidden='true']"
    ].join(","));
    
    let author = authorElement?.textContent?.trim() || "Author";
    // Clean up if it contains bullets or extra info
    if (author.includes("•")) {
      author = author.split("•")[0].trim();
    }
    // Remove potential duplicates (e.g., "NameName")
    const words = author.split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 2) {
      const half = Math.floor(words.length / 2);
      const firstHalf = words.slice(0, half).join(" ");
      const secondHalf = words.slice(half).join(" ");
      if (firstHalf.toLowerCase() === secondHalf.toLowerCase()) {
        author = words.slice(0, half).join(" ");
      }
    }

    const postText = postElement?.querySelector([
      ".feed-shared-update-v2__description",
      ".feed-shared-text",
      ".break-words",
      ".entity-result__summary",
      ".update-components-text",
      ".update-components-text-view"
    ].join(","))?.textContent?.trim() || "";

    // Extract email from post text with better regex boundaries
    const emailMatch = postText.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/);
    let email = emailMatch ? emailMatch[0] : "";
    
    // Manual cleanup for common text glued to emails by LinkedIn's text content (like .hashtag)
    if (email) {
      const commonTlds = [".com", ".in", ".co", ".io", ".net", ".org", ".me", ".ai", ".biz"];
      const lowerEmail = email.toLowerCase();
      for (const tld of commonTlds) {
        if (lowerEmail.includes(tld)) {
          const cutIndex = lowerEmail.indexOf(tld) + tld.length;
          // Only trim if there's actually something after it
          if (cutIndex < email.length) {
            email = email.substring(0, cutIndex);
          }
          break;
        }
      }
    }

    // Trigger the sidebar by setting storage
    storage.set("triggerSidebar", {
      author,
      postText,
      email,
      timestamp: Date.now()
    });
  };

  return (
    <div className="outreach-btn-container">
      <style>{styles}</style>
      <button
        onClick={handleGenerateClick}
        className="outreach-btn"
      >
        <Mail /> ApplyX Outreach
      </button>
    </div>
  );
};


export default LinkedInInlineButton;

