import React from "react";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Card: React.FC<CardProps> = ({ children, style, className, onClick }) => (
  <div className={`card ${className || ""}`} style={style} onClick={onClick}>
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <label className={`label ${className || ""}`}>{children}</label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`input-field ${props.className || ""}`} />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className={`input-field textarea-field ${props.className || ""}`} />
);

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button {...props} className={`primary-button ${props.className || ""}`} />
);

