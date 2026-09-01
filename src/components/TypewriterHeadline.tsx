import React, { useState, useEffect } from "react";

interface TypewriterHeadlineProps {
  prefix?: string;
  words: string[];
  suffix?: string;
  accentClass?: string;
  accentHex?: string;
  cursorColorHex?: string;
  showCursor?: boolean;
  speedMs?: number;
  deleteSpeedMs?: number;
  delayMs?: number;
  className?: string;
  isEditorPreview?: boolean;
}

export const TypewriterHeadline: React.FC<TypewriterHeadlineProps> = ({
  prefix = "",
  words = ["Curso", "Carreira", "Vida", "Profissão", "Competência"],
  suffix = "",
  accentClass = "text-purple-400",
  accentHex,
  cursorColorHex,
  showCursor = true,
  speedMs = 90,
  deleteSpeedMs = 45,
  delayMs = 1800,
  className = "",
  isEditorPreview = false,
}) => {
  const safeWords = words && words.length > 0 ? words : ["Curso", "Carreira"];
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const targetWord = safeWords[wordIndex % safeWords.length] || "";

    if (!isDeleting) {
      if (currentText.length < targetWord.length) {
        timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length + 1));
        }, speedMs);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayMs);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length - 1));
        }, deleteSpeedMs);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % safeWords.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, safeWords, speedMs, deleteSpeedMs, delayMs]);

  const highlightStyle: React.CSSProperties = accentHex ? { color: accentHex } : {};
  const cursorStyle: React.CSSProperties = {
    backgroundColor: cursorColorHex || accentHex || "#a855f7",
  };

  return (
    <span className={`inline ${className}`}>
      {prefix && <span className="mr-1.5">{prefix}</span>}
      <span
        className={`relative inline-block font-extrabold transition-colors ${!accentHex ? accentClass : ""}`}
        style={highlightStyle}
      >
        <span>{currentText}</span>
      </span>
      {showCursor && (
        <span 
          className="inline-block w-[3px] h-[0.85em] ml-1 animate-pulse align-middle font-normal"
          style={cursorStyle}
        />
      )}
      {suffix && <span className="ml-1.5">{suffix}</span>}
    </span>
  );
};
