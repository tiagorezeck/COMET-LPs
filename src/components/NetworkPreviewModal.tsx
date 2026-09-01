import React, { useState, useEffect } from "react";
import { LandingPage } from "../types/landingPage";
import { saveLandingPageToStorage, syncPageWithServerPreview } from "../utils/storage";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Wifi,
  QrCode,
  Sparkles,
  RefreshCw,
  Zap,
  CheckCircle2,
} from "lucide-react";
import QRCode from "qrcode";

interface NetworkPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: LandingPage;
  onUpdatePage?: (page: LandingPage) => void;
}

export const NetworkPreviewModal: React.FC<NetworkPreviewModalProps> = ({
  isOpen,
  onClose,
  page,
  onUpdatePage,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Construct origin and preview token URL
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const tokenToUse = page.previewToken || page.id;
  const versionParam = new Date(page.updatedAt || Date.now()).getTime();
  
  const previewUrl = `${origin}/preview?pageId=${page.id}&token=${tokenToUse}&v=${versionParam}`;

  // Always persist latest page state to storage & server preview when opening modal
  useEffect(() => {
    if (isOpen && page) {
      saveLandingPageToStorage(page);
      syncPageWithServerPreview(page).catch(() => {});
    }
  }, [isOpen, page]);

  // Generate QR Code dynamically
  useEffect(() => {
    if (isOpen && previewUrl) {
      QRCode.toDataURL(previewUrl, {
        width: 320,
        margin: 1.5,
        color: {
          dark: "#09090b",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("Error generating QR code:", err));
    }
  }, [isOpen, previewUrl]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Link copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenNewTab = () => {
    // Ensure storage and server preview are written first
    saveLandingPageToStorage(page);
    syncPageWithServerPreview(page).catch(() => {});
    window.open(previewUrl, "_blank");
  };

  // Generate a brand-new unique test link
  const handleGenerateNewLink = () => {
    const newToken = `lnk_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const updatedPage: LandingPage = {
      ...page,
      previewToken: newToken,
      updatedAt: new Date().toISOString(),
    };

    saveLandingPageToStorage(updatedPage);
    syncPageWithServerPreview(updatedPage).catch(() => {});
    if (onUpdatePage) {
      onUpdatePage(updatedPage);
    }
    showToast("⚡ Novo link e QR Code gerados com a última versão salva!");
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Link de Teste (Preview Standalone)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Acesse a landing page em tela cheia no Chrome, Safari, celular ou outros PCs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Notification toast inside modal */}
          {notificationMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
          )}

          {/* Main Action Bar: URL, Copy, New Link, Open */}
          <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Link Direto da Última Versão Salva
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Sincronizado
              </span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-2 font-mono text-xs text-zinc-300 overflow-x-auto">
              <span className="truncate flex-1 px-2 select-all">{previewUrl}</span>
              <button
                type="button"
                onClick={() => handleCopy(previewUrl)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-sans text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copiado!" : "Copiar"}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir em Nova Aba Agora</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateNewLink}
                className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-purple-500/40 text-purple-300 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                title="Gerar um novo token de preview caso ocorra algum problema no link atual"
              >
                <RefreshCw className="w-4 h-4 text-purple-400" />
                <span>Gerar Novo Link</span>
              </button>
            </div>
          </div>

          {/* QR Code & Mobile Testing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: QR Code */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <QrCode className="w-4 h-4 text-purple-400" />
                <span>Escanear no Smartphone</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white shadow-xl">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code Preview"
                    className="w-40 h-40 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-zinc-400 text-xs">
                    Gerando QR Code...
                  </div>
                )}
              </div>

              <p className="text-[11px] text-zinc-400 leading-tight">
                Aponte a câmera do seu celular para abrir e testar a versão mais recente em tempo real.
              </p>
            </div>

            {/* Right: Auto-Sync Instructions */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 mb-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Sincronização & Atualizações</span>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-600/30 text-purple-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      <strong>Sempre a Última Versão:</strong> O link carrega os dados salvos mais recentes da sua página.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-600/30 text-purple-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      <strong>Atualizou algo no editor?</strong> Ao atualizar a aba do teste (F5/Reload), as novas edições são exibidas automaticamente.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-600/30 text-purple-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      <strong>Link com problemas?</strong> Clique em <em>"Gerar Novo Link"</em> acima para criar um novo endereço de acesso instantaneamente.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Status da Página:</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sincronizado</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
