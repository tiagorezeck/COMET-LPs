import React, { useState, useEffect } from "react";
import { LandingPage } from "./types/landingPage";
import {
  loadSavedLandingPages,
  saveLandingPageToStorage,
  deleteLandingPageFromStorage,
  duplicateLandingPage,
} from "./utils/storage";
import { Dashboard } from "./components/Dashboard";
import { Editor } from "./components/Editor";
import { AIModalGenerator } from "./components/AIModalGenerator";

export default function App() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [activePage, setActivePage] = useState<LandingPage | null>(null);
  const [currentView, setCurrentView] = useState<"dashboard" | "editor">("dashboard");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Initialize and load saved pages
  useEffect(() => {
    const loaded = loadSavedLandingPages();
    setPages(loaded);
  }, []);

  const handleOpenEditor = (page: LandingPage) => {
    setActivePage(page);
    setCurrentView("editor");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setActivePage(null);
  };

  const handleSavePage = (updatedPage: LandingPage) => {
    saveLandingPageToStorage(updatedPage);
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === updatedPage.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedPage;
        return next;
      }
      return [updatedPage, ...prev];
    });
    setActivePage(updatedPage);
  };

  const handleDeletePage = (id: string) => {
    deleteLandingPageFromStorage(id);
    setPages((prev) => prev.filter((p) => p.id !== id));
    if (activePage?.id === id) {
      setCurrentView("dashboard");
      setActivePage(null);
    }
  };

  const handleDuplicatePage = (page: LandingPage) => {
    const duplicated = duplicateLandingPage(page);
    setPages((prev) => [duplicated, ...prev]);
    handleOpenEditor(duplicated);
  };

  const handlePageGeneratedByAi = (newPage: LandingPage) => {
    saveLandingPageToStorage(newPage);
    setPages((prev) => [newPage, ...prev]);
    setActivePage(newPage);
    setCurrentView("editor");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {currentView === "dashboard" && (
        <Dashboard
          pages={pages}
          onSelectPage={handleOpenEditor}
          onOpenAiGenerator={() => setIsAiModalOpen(true)}
          onDeletePage={handleDeletePage}
          onDuplicatePage={handleDuplicatePage}
        />
      )}

      {currentView === "editor" && activePage && (
        <Editor
          page={activePage}
          onSave={handleSavePage}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {/* AI Generation Prompt Modal */}
      <AIModalGenerator
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onPageGenerated={handlePageGeneratedByAi}
      />
    </div>
  );
}
