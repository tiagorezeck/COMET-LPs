import { LandingPage, LeadSubmission, DEFAULT_HEADER_NAV } from "../types/landingPage";
import { PRESET_TEMPLATES } from "../data/templates";

const STORAGE_KEY = "people_cro_landing_pages_v1";
const LEADS_STORAGE_KEY = "people_cro_leads_v1";

function normalizePage(page: LandingPage): LandingPage {
  return {
    ...page,
    headerNav: page.headerNav
      ? {
          ...DEFAULT_HEADER_NAV,
          ...page.headerNav,
          links: page.headerNav.links && page.headerNav.links.length > 0
            ? page.headerNav.links
            : DEFAULT_HEADER_NAV.links,
        }
      : { ...DEFAULT_HEADER_NAV, logoText: page.title ? page.title.split(" ")[0].toUpperCase() : "COMET.LP" },
  };
}

export function loadSavedLandingPages(): LandingPage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with preset templates
      const normalized = PRESET_TEMPLATES.map(normalizePage);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(normalizePage);
    }
    return PRESET_TEMPLATES.map(normalizePage);
  } catch (err) {
    console.error("Failed to load landing pages from storage:", err);
    return PRESET_TEMPLATES.map(normalizePage);
  }
}

export function saveLandingPages(pages: LandingPage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch (err) {
    console.error("Failed to save landing pages to storage:", err);
  }
}

export function saveSingleLandingPage(page: LandingPage): LandingPage[] {
  const pages = loadSavedLandingPages();
  const index = pages.findIndex((p) => p.id === page.id);
  let updated: LandingPage[];
  const pageWithUpdatedTimestamp = {
    ...page,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    updated = [...pages];
    updated[index] = pageWithUpdatedTimestamp;
  } else {
    updated = [pageWithUpdatedTimestamp, ...pages];
  }

  saveLandingPages(updated);

  try {
    localStorage.setItem("active_preview_page", JSON.stringify(pageWithUpdatedTimestamp));
  } catch {}

  // Async sync to server for cross-device & cross-tab preview
  syncPageWithServerPreview(pageWithUpdatedTimestamp).catch(() => {});

  return updated;
}

export async function syncPageWithServerPreview(page: LandingPage): Promise<boolean> {
  try {
    const res = await fetch("/api/pages/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchPageFromServerPreview(tokenOrId: string): Promise<LandingPage | null> {
  try {
    const res = await fetch(`/api/pages/preview/${encodeURIComponent(tokenOrId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.page) {
      return normalizePage(data.page);
    }
    return null;
  } catch {
    return null;
  }
}

export const saveLandingPageToStorage = saveSingleLandingPage;

export function deleteLandingPage(id: string): LandingPage[] {
  const pages = loadSavedLandingPages();
  const updated = pages.filter((p) => p.id !== id);
  saveLandingPages(updated);
  return updated;
}

export const deleteLandingPageFromStorage = deleteLandingPage;

export function duplicateLandingPage(page: LandingPage): LandingPage {
  const newPage: LandingPage = {
    ...JSON.parse(JSON.stringify(page)),
    id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: `${page.title} (Cópia)`,
    slug: `${page.slug}-copia`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 0,
    leadsCount: 0,
  };
  saveSingleLandingPage(newPage);
  return newPage;
}

export function loadStoredLeads(): LeadSubmission[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordLocalLead(lead: LeadSubmission): void {
  try {
    const leads = loadStoredLeads();
    leads.unshift(lead);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads.slice(0, 300)));
  } catch (err) {
    console.error("Error storing local lead:", err);
  }
}
