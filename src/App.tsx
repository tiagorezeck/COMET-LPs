import React, { useState, useEffect } from "react";
import { LandingPage } from "./types/landingPage";
import {
  loadSavedLandingPages,
  saveLandingPageToStorage,
  deleteLandingPageFromStorage,
  duplicateLandingPage,
  fetchPageFromServerPreview,
} from "./utils/storage";
import { Dashboard } from "./components/Dashboard";
import { Editor } from "./components/Editor";
import { AIModalGenerator } from "./components/AIModalGenerator";
import { LandingPageRenderer } from "./components/LandingPageRenderer";
import { ArrowLeft, Edit3, RefreshCw } from "lucide-react";

export default function App() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [activePage, setActivePage] = useState<LandingPage | null>(null);
  const [currentView, setCurrentView] = useState<"dashboard" | "editor" | "preview">("dashboard");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Initialize and load saved pages + check preview URL params
  const refreshPageFromStorage = async () => {
    const freshPages = loadSavedLandingPages();
    setPages(freshPages);

    const urlParams = new URLSearchParams(window.location.search);
    const isPreviewPath = window.location.pathname.startsWith("/preview");
    const isPreviewParam = urlParams.get("preview") === "true";
    const pageId = urlParams.get("pageId");
    const token = urlParams.get("token") || urlParams.get("previewToken");

    if (isPreviewPath || isPreviewParam || pageId || token) {
      let target: LandingPage | null = null;

      // 1. First try fetching real-time version from server preview store
      const queryToken = token || pageId;
      if (queryToken) {
        const serverPage = await fetchPageFromServerPreview(queryToken);
        if (serverPage) {
          target = serverPage;
        }
      }

      // 2. If not on server, search local saved pages by token or pageId
      if (!target) {
        target =
          freshPages.find(
            (p) =>
              (token && (p.previewToken === token || p.id === token)) ||
              (pageId && p.id === pageId)
          ) || null;
      }

      // 3. Fallback to active_preview_page in localStorage if available
      if (!target) {
        try {
          const rawActive = localStorage.getItem("active_preview_page");
          if (rawActive) {
            target = JSON.parse(rawActive);
          }
        } catch {}
      }

      // 4. Default fallback to first saved page
      if (!target) {
        target = freshPages[0];
      }

      if (target) {
        setActivePage(target);
        if (currentView !== "editor") {
          setCurrentView("preview");
        }
      }
    }
  };

  useEffect(() => {
    refreshPageFromStorage();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key === "people_cro_landing_pages_v1") {
        refreshPageFromStorage();
      }
    };

    // Re-sync when switching back to this window/tab
    const handleFocus = () => {
      refreshPageFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleOpenEditor = (page: LandingPage) => {
    setActivePage(page);
    setCurrentView("editor");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setActivePage(null);
    // Clean URL query
    if (window.location.search || window.location.pathname.startsWith("/preview")) {
      window.history.pushState({}, "", "/");
    }
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
      {/* 1. Dashboard View */}
      {currentView === "dashboard" && (
        <Dashboard
          pages={pages}
          onSelectPage={handleOpenEditor}
          onOpenAiGenerator={() => setIsAiModalOpen(true)}
          onDeletePage={handleDeletePage}
          onDuplicatePage={handleDuplicatePage}
        />
      )}

      {/* 2. Editor View */}
      {currentView === "editor" && activePage && (
        <Editor
          page={activePage}
          onSave={handleSavePage}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {/* 3. Standalone Live / Network Fullscreen Preview */}
      {currentView === "preview" && activePage && (
        <div className="min-h-screen relative bg-zinc-950">
          <LandingPageRenderer
            page={activePage}
            isEditorPreview={false}
          />

          {/* Floating Back-to-Editor Pill */}
          <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-2">
            <button
              onClick={refreshPageFromStorage}
              className="px-3.5 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-purple-300 hover:text-white font-bold text-xs shadow-2xl border border-purple-500/40 backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
              title="Atualizar com a versão mais recente salva no editor"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Atualizar Versão</span>
            </button>
            <button
              onClick={() => handleOpenEditor(activePage)}
              className="px-4 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-xs shadow-2xl border border-zinc-700 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-purple-400" />
              <span>Abrir no Editor</span>
            </button>
            <button
              onClick={handleBackToDashboard}
              className="p-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white shadow-2xl border border-zinc-700 backdrop-blur-md transition-all cursor-pointer"
              title="Voltar ao Painel"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
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
