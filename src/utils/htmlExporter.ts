import { LandingPage, HeroModel, ButtonCustomStyle } from "../types/landingPage";
import { THEME_CONFIGS } from "./theme";

function escapeHtml(str: string = ""): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getButtonStylesAndClasses(style?: ButtonCustomStyle, defaultCtaBg?: string, customAccentHex?: string) {
  const styles: string[] = [];
  const classes: string[] = ["font-bold", "transition-all", "cursor-pointer", "inline-flex", "items-center", "justify-center", "gap-2"];

  if (style?.customGradient) {
    styles.push(`background: ${style.customGradient}`);
  } else if (style?.customBgColorHex) {
    styles.push(`background-color: ${style.customBgColorHex}`);
  } else if (customAccentHex) {
    styles.push(`background-color: ${customAccentHex}`);
    styles.push(`border-color: ${customAccentHex}`);
  } else if (defaultCtaBg) {
    classes.push(defaultCtaBg);
  }

  if (style?.customTextColorHex) {
    styles.push(`color: ${style.customTextColorHex}`);
  } else {
    classes.push("text-white");
  }

  if (style?.customPaddingYPx !== undefined) {
    styles.push(`padding-top: ${style.customPaddingYPx}px`);
    styles.push(`padding-bottom: ${style.customPaddingYPx}px`);
  } else {
    classes.push("py-4", "px-8");
  }

  if (style?.fontSizePx !== undefined) {
    styles.push(`font-size: ${style.fontSizePx}px`);
  } else {
    classes.push("text-base", "sm:text-lg");
  }

  if (style?.customWidthPx !== undefined) {
    styles.push(`width: ${style.customWidthPx}px`);
    styles.push(`max-width: 100%`);
  } else if (style?.widthMode === "full") {
    classes.push("w-full");
  } else if (style?.widthMode === "compact") {
    classes.push("w-full", "max-w-xs");
  } else if (style?.widthMode === "wide") {
    classes.push("w-full", "max-w-xl");
  } else if (style?.widthMode === "auto") {
    classes.push("w-auto");
  } else {
    classes.push("w-full", "sm:w-auto");
  }

  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };
  if (style?.borderRadius && radiusMap[style.borderRadius]) {
    classes.push(radiusMap[style.borderRadius]);
  } else {
    classes.push("rounded-xl");
  }

  return {
    styleAttr: styles.length ? `style="${styles.join("; ")}"` : "",
    className: classes.join(" "),
  };
}

function getCardStyleAttr(item: { customBgColorHex?: string; customGradient?: string; customTextColorHex?: string }, isLight?: boolean, customAccentHex?: string) {
  const styles: string[] = [];
  if (item.customGradient) {
    styles.push(`background: ${item.customGradient}`);
  } else if (item.customBgColorHex) {
    styles.push(`background-color: ${item.customBgColorHex}`);
  } else if (isLight && customAccentHex) {
    styles.push(`background-color: ${customAccentHex}10`);
    styles.push(`border-color: ${customAccentHex}35`);
  }
  if (item.customTextColorHex) {
    styles.push(`color: ${item.customTextColorHex}`);
  }
  return styles.length ? `style="${styles.join("; ")}"` : "";
}

function getAlignClass(align?: string) {
  if (align === "left") return "text-left";
  if (align === "right") return "text-right";
  if (align === "justify") return "text-justify";
  return "text-center";
}

function getContainerWidthClass(w?: string) {
  if (w === "narrow") return "max-w-4xl";
  if (w === "wide") return "max-w-7xl";
  if (w === "full") return "max-w-full px-4";
  return "max-w-6xl";
}

function renderMediaElement(hero: LandingPage["hero"]) {
  if (hero.mediaType === "video" && hero.videoUrl) {
    let embedUrl = hero.videoUrl;
    if (hero.videoUrl.includes("youtube.com/watch?v=")) {
      const id = hero.videoUrl.split("v=")[1]?.split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    } else if (hero.videoUrl.includes("youtu.be/")) {
      const id = hero.videoUrl.split("youtu.be/")[1]?.split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    } else if (hero.videoUrl.includes("vimeo.com/")) {
      const id = hero.videoUrl.split("vimeo.com/")[1]?.split("?")[0];
      embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    
    if (embedUrl.endsWith(".mp4")) {
      return `<video src="${embedUrl}" controls autoplay muted loop class="w-full h-full object-cover rounded-xl"></video>`;
    }
    return `<iframe src="${embedUrl}" class="w-full h-full border-0 rounded-xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }

  const img = hero.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
  const posX = hero.imagePositionX ?? 50;
  const posY = hero.imagePositionY ?? 50;
  const zoom = hero.imageZoom ?? 100;
  return `<img src="${img}" alt="Media" class="w-full h-full object-cover rounded-xl shadow-2xl" style="object-position: ${posX}% ${posY}%; transform: scale(${zoom / 100}); transform-origin: ${posX}% ${posY}%;" />`;
}

export function generateStandaloneHtml(page: LandingPage): string {
  const theme = THEME_CONFIGS[page.accentColor] || THEME_CONFIGS.purple;
  const primaryColor = page.customAccentHex || theme.primaryHex;
  const accent = page.accentColor || "purple";

  const isLight = page.theme === "light";
  const textTitleClass = isLight ? "text-zinc-950" : "text-white";
  const textBodyClass = isLight ? "text-zinc-800" : "text-zinc-400";
  const borderClass = isLight ? "border-zinc-200" : "border-zinc-800";
  
  let glassCardClass = "glass-card border border-zinc-800";
  if (isLight) {
    if (page.customAccentHex) {
      glassCardClass = "border shadow-sm shadow-black/5";
    } else {
      switch (accent) {
        case "purple": glassCardClass = "bg-purple-50/80 border border-purple-200/80 shadow-sm shadow-purple-950/5 hover:bg-purple-100/40"; break;
        case "emerald": glassCardClass = "bg-emerald-50/80 border border-emerald-200/80 shadow-sm shadow-emerald-950/5 hover:bg-emerald-100/40"; break;
        case "cyan": glassCardClass = "bg-cyan-50/80 border border-cyan-200/80 shadow-sm shadow-cyan-950/5 hover:bg-cyan-100/40"; break;
        case "amber": glassCardClass = "bg-amber-50/80 border border-amber-200/80 shadow-sm shadow-amber-950/5 hover:bg-amber-100/40"; break;
        case "rose": glassCardClass = "bg-rose-50/80 border border-rose-200/80 shadow-sm shadow-rose-950/5 hover:bg-rose-100/40"; break;
        case "orange": glassCardClass = "bg-orange-50/80 border border-orange-200/80 shadow-sm shadow-orange-950/5 hover:bg-orange-100/40"; break;
        case "blue": glassCardClass = "bg-blue-50/80 border border-blue-200/80 shadow-sm shadow-blue-950/5 hover:bg-blue-100/40"; break;
        case "indigo": glassCardClass = "bg-indigo-50/80 border border-indigo-200/80 shadow-sm shadow-indigo-950/5 hover:bg-indigo-100/40"; break;
        case "red": glassCardClass = "bg-red-50/80 border border-red-200/80 shadow-sm shadow-red-950/5 hover:bg-red-100/40"; break;
        case "teal": glassCardClass = "bg-teal-50/80 border border-teal-200/80 shadow-sm shadow-teal-950/5 hover:bg-teal-100/40"; break;
        case "gray": glassCardClass = "bg-zinc-100/80 border border-zinc-300/80 shadow-sm shadow-zinc-950/5 hover:bg-zinc-200/40"; break;
        default: glassCardClass = "bg-zinc-100/80 border border-zinc-300/80 shadow-sm";
      }
    }
  }

  const visibility = page.visibility || {
    hero: true,
    socialProof: true,
    quiz: true,
    bentoGrid: true,
    testimonials: true,
    formSection: true,
    faq: true,
    stickyMobileCta: true,
  };

  const sectionOrder = page.sectionOrder || [
    "hero",
    "socialProof",
    "quiz",
    "bentoGrid",
    "testimonials",
    "formSection",
    "faq",
  ];

  // Helper for rendering Primary CTA Button
  const primaryCtaBtn = getButtonStylesAndClasses(page.hero.ctaStyle, `bg-gradient-to-r ${theme.ctaBg} hover:opacity-95 shadow-xl shadow-${accent}-900/40`, page.customAccentHex);
  const formCtaBtn = getButtonStylesAndClasses(page.formSection.ctaStyle, `bg-gradient-to-r ${theme.ctaBg} hover:opacity-90 shadow-xl shadow-${accent}-900/50`, page.customAccentHex);
  const secondaryCtaBtn = page.hero.secondaryCtaText ? getButtonStylesAndClasses(page.hero.secondaryCtaStyle, "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700") : null;

  // Header Nav Config & Logic
  const headerNav = page.headerNav || { enabled: false, logoType: "text", logoText: "COMET.LP", links: [], ctaText: "Quero uma Bolsa" };

  let headerNavHtml = "";
  let bodyPtStyle = "";

  if (headerNav.enabled) {
    const pyClass =
      headerNav.height === "small"
        ? "py-2.5 sm:py-3.5"
        : headerNav.height === "large"
        ? "py-6 sm:py-8"
        : "py-4 sm:py-5"; // medium (default)

    const positioningClass = headerNav.fixed
      ? "fixed top-0 left-0 right-0"
      : headerNav.sticky !== false
      ? "sticky top-0"
      : "relative";

    if (headerNav.fixed) {
      const ptPx = headerNav.height === "small" ? "64px" : headerNav.height === "large" ? "96px" : "80px";
      bodyPtStyle = `style="padding-top: ${ptPx};"`;
    }

    // Header Background style
    const hexToRgba = (hex: string, alpha: number) => {
      const cleanHex = hex.replace("#", "");
      let r = 9, g = 9, b = 11; // dark fallback
      if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16) || 0;
        g = parseInt(cleanHex[1] + cleanHex[1], 16) || 0;
        b = parseInt(cleanHex[2] + cleanHex[2], 16) || 0;
      } else if (cleanHex.length === 6) {
        r = parseInt(cleanHex.substring(0, 2), 16) || 0;
        g = parseInt(cleanHex.substring(2, 4), 16) || 0;
        b = parseInt(cleanHex.substring(4, 6), 16) || 0;
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const opacityValue = headerNav.bgOpacity !== undefined ? headerNav.bgOpacity / 100 : 0.9;
    const defaultBgHex = isLight ? "#ffffff" : "#09090b";
    const bgStyle = headerNav.bgColorHex 
      ? `background-color: ${hexToRgba(headerNav.bgColorHex, opacityValue)};` 
      : `background-color: ${hexToRgba(defaultBgHex, opacityValue)};`;

    const defaultTextColor = isLight ? "#1f2937" : "#f4f4f5";
    const textStyle = `color: ${headerNav.textColorHex || defaultTextColor};`;
    const headerStyle = `style="${bgStyle} ${textStyle}"`;

    // CTA style
    let ctaStyle = "";
    if (headerNav.ctaBgColorHex || headerNav.ctaTextColorHex) {
      const parts: string[] = [];
      if (headerNav.ctaBgColorHex) {
        parts.push(`background-color: ${headerNav.ctaBgColorHex}`);
        parts.push(`border-color: ${headerNav.ctaBgColorHex}`);
      }
      if (headerNav.ctaTextColorHex) {
        parts.push(`color: ${headerNav.ctaTextColorHex}`);
      }
      ctaStyle = `style="${parts.join("; ")}"`;
    }

    const linksHtml = (headerNav.links || [])
      .map(
        (link) => `
      <a href="#${link.targetSectionId || "inscricao"}" class="hover:opacity-80 transition-opacity" ${textStyle ? `style="${textStyle}"` : ""}>
        ${escapeHtml(link.label)}
      </a>
    `
      )
      .join("");

    const mobileLinksHtml = (headerNav.links || [])
      .map(
        (link) => `
      <a href="#${link.targetSectionId || "inscricao"}" onclick="toggleMobileMenu()" class="block py-3 text-sm border-b border-zinc-800/40 hover:opacity-80 transition-opacity" ${textStyle ? `style="${textStyle}"` : ""}>
        ${escapeHtml(link.label)}
      </a>
    `
      )
      .join("");

    const logoIndicatorColor = headerNav.ctaBgColorHex || primaryColor;

    headerNavHtml = `
    <header ${headerStyle} class="w-full z-[100] transition-all backdrop-blur-md border-b ${isLight ? "border-zinc-200" : "border-zinc-850/30"} shadow-xl shadow-black/10 ${positioningClass}">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all ${pyClass}">
        <!-- LOGO -->
        <div class="flex items-center gap-3">
          ${
            headerNav.logoType === "image" && headerNav.logoImageUrl
              ? `<img src="${headerNav.logoImageUrl}" alt="Logo" class="h-8 sm:h-10 object-contain" />`
              : `<div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full" style="background-color: ${logoIndicatorColor}; shadow: 0 0 10px ${logoIndicatorColor}4d;"></span>
                  <span class="font-extrabold text-lg sm:text-xl tracking-tight" ${textStyle ? `style="${textStyle}"` : ""}>
                    ${escapeHtml(headerNav.logoText || "COMET.LP")}
                  </span>
                 </div>`
          }
        </div>

        <!-- DESKTOP NAV LINKS -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-semibold">
          ${linksHtml}
        </nav>

        <!-- RIGHT CTA -->
        <div class="flex items-center gap-3">
          <a href="#${headerNav.ctaTargetSectionId || "formSection"}" ${ctaStyle} class="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 inline-block text-center ${headerNav.ctaBgColorHex ? "" : `bg-${accent}-600 hover:bg-${accent}-500`}">
            ${escapeHtml(headerNav.ctaText || "Quero uma Bolsa")}
          </a>

          <!-- Mobile Hamburger Button -->
          <button type="button" onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-xl border border-zinc-800 text-zinc-300">
            <svg id="menu-icon-hamburger" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg id="menu-icon-close" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- MOBILE DRAWER -->
      <div id="mobile-menu-drawer" class="hidden md:hidden px-4 pt-3 pb-6 border-t ${isLight ? "border-zinc-200" : "border-zinc-800/40"} space-y-3" style="${bgStyle}">
        ${mobileLinksHtml}
      </div>
    </header>
    `;
  }

  // Render Section HTML generators
  const sectionRenderers: Record<string, () => string> = {
    hero: () => {
      if (!visibility.hero || !page.hero) return "";
      const hero = page.hero;
      const model: HeroModel = hero.model || "split_image";

      let badgeStyle = "";
      let badgeClass = isLight 
        ? `bg-${accent}-50 border border-${accent}-200 text-${accent}-700 shadow-sm shadow-${accent}-100`
        : `glass-card border border-${accent}-500/30 text-${accent}-300 shadow-${accent}-900/20`;
      if (page.customAccentHex) {
        badgeStyle = `style="color: ${page.customAccentHex}; border-color: ${page.customAccentHex}4d; ${isLight ? `background-color: ${page.customAccentHex}0d;` : ""}"`;
        badgeClass = isLight ? "border shadow-sm" : "glass-card border";
      }

      const badgeHtml = hero.badgeText ? `
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow-lg ${badgeClass}" ${badgeStyle}>
          <span>${escapeHtml(hero.badgeText)}</span>
        </div>
      ` : "";

      const headlineStyle = hero.headlineFontSizePx ? `style="font-size: ${hero.headlineFontSizePx}px; line-height: 1.1;"` : "";
      const subheadlineStyle = hero.subheadlineFontSizePx ? `style="font-size: ${hero.subheadlineFontSizePx}px;"` : "";

      let headlineHtml = "";
      if (hero.typewriterEnabled) {
        const words = hero.typewriterWords || ["Curso", "Carreira", "Vida", "Profissão", "Competência"];
        const prefix = hero.typewriterPrefix || "";
        const suffix = hero.typewriterSuffix || "";
        const showCursor = hero.typewriterShowCursor !== false;
        
        let accentStyle = "";
        let accentClass = "";
        if (page.customAccentHex) {
          accentStyle = `style="color: ${page.customAccentHex};"`;
        } else {
          accentClass = theme.gradientText ? `bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent` : theme.iconText;
        }
        
        const cursorColor = page.customAccentHex || theme.primaryHex;
        
        headlineHtml = `
          <h1 ${headlineStyle} class="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight ${textTitleClass} mb-6 ${getAlignClass(hero.headlineAlign || hero.align)}">
            ${escapeHtml(prefix)}
            <span class="typewriter-container inline relative font-extrabold transition-colors ${accentClass}" ${accentStyle} data-words='${JSON.stringify(words).replace(/'/g, "&#39;")}'>
              <span class="typewriter-text">${escapeHtml(words[0] || "")}</span>
            </span>
            ${showCursor ? `<span class="typewriter-cursor inline-block w-[3px] h-[0.85em] ml-1 animate-pulse align-middle font-normal" style="background-color: ${cursorColor};"></span>` : ""}
            ${escapeHtml(suffix)}
          </h1>
        `;
      } else {
        headlineHtml = `
          <h1 ${headlineStyle} class="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight ${textTitleClass} mb-6 ${getAlignClass(hero.headlineAlign || hero.align)}">
            ${escapeHtml(hero.headline)}
          </h1>
        `;
      }

      const subheadlineHtml = `
        <p ${subheadlineStyle} class="${textBodyClass} text-base sm:text-lg md:text-xl mb-8 leading-relaxed ${getAlignClass(hero.subheadlineAlign || hero.align)}">
          ${escapeHtml(hero.subheadline)}
        </p>
      `;

      const primaryBtnHtml = `
        <a href="#inscricao" ${primaryCtaBtn.styleAttr} class="${primaryCtaBtn.className}">
          <span>${escapeHtml(hero.ctaText)}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
        ${hero.ctaSubtext ? `<span class="text-xs text-zinc-500 font-medium block mt-2">${escapeHtml(hero.ctaSubtext)}</span>` : ""}
      `;

      const ratingAvatarsHtml = `
        <div class="flex items-center gap-3 mt-4">
          <div class="flex -space-x-2">
            ${(hero.socialProofAvatars || [
              { name: "Ana", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
              { name: "Carlos", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
              { name: "Mariana", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
            ]).map(a => `<img src="${a.avatarUrl}" alt="${a.name}" class="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover" />`).join("")}
          </div>
          <div class="text-left">
            <div class="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <span>★ ${hero.ratingScore || "4.9/5"}</span>
            </div>
            <div class="text-[11px] ${textBodyClass}">${escapeHtml(hero.ratingText || "+2.400 clientes satisfeitos")}</div>
          </div>
        </div>
      `;

      // Render based on model
      if (model === "split_image") {
        return `
          <section id="hero-section" class="pt-8 md:pt-14 pb-16 px-4 ${getContainerWidthClass(hero.containerWidth)} mx-auto">
            <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div class="lg:col-span-7 ${getAlignClass(hero.align)}">
                ${badgeHtml}
                ${headlineHtml}
                ${subheadlineHtml}
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  ${primaryBtnHtml}
                </div>
                ${ratingAvatarsHtml}
              </div>

              <div class="lg:col-span-5">
                <div class="${glassCardClass} p-2 sm:p-3 rounded-2xl shadow-2xl relative group aspect-[4/3] sm:aspect-video lg:aspect-square overflow-hidden">
                  ${renderMediaElement(hero)}
                </div>
              </div>
            </div>
          </section>
        `;
      }

      if (model === "split_video") {
        return `
          <section id="hero-section" class="pt-8 md:pt-14 pb-16 px-4 ${getContainerWidthClass(hero.containerWidth)} mx-auto">
            <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div class="lg:col-span-6 ${getAlignClass(hero.align)}">
                ${badgeHtml}
                ${headlineHtml}
                ${subheadlineHtml}
                <div class="mb-6">
                  ${primaryBtnHtml}
                </div>
                ${ratingAvatarsHtml}
              </div>

              <div class="lg:col-span-6">
                <div class="${glassCardClass} p-2 sm:p-3 rounded-3xl shadow-2xl relative overflow-hidden aspect-[4/5] max-w-md mx-auto" ${page.customAccentHex ? `style="border-color: ${page.customAccentHex}4d;"` : ""}>
                  ${renderMediaElement(hero)}
                </div>
              </div>
            </div>
          </section>
        `;
      }

      if (model === "centered_showcase") {
        const metrics = hero.showcaseMetrics || [
          { id: "1", value: "+310%", label: "Aumento em Conversão" },
          { id: "2", value: "3 seg", label: "Tempo de Resposta SLA" },
          { id: "3", value: "24/7", label: "Operação Automática" },
        ];

        return `
          <section id="hero-section" class="pt-12 pb-16 px-4 ${getContainerWidthClass(hero.containerWidth)} mx-auto text-center">
            ${badgeHtml}
            ${headlineHtml}
            ${subheadlineHtml}
            <div class="flex flex-col items-center justify-center gap-3 mb-12">
              ${primaryBtnHtml}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              ${metrics.map(m => `
                <div class="${glassCardClass} p-5 rounded-2xl text-center">
                  <div class="text-2xl sm:text-3xl font-extrabold mb-1" style="color: ${primaryColor};">${escapeHtml(m.value)}</div>
                  <div class="text-xs font-semibold ${isLight ? "text-zinc-800" : "text-zinc-300"}">${escapeHtml(m.label)}</div>
                  ${m.sublabel ? `<div class="text-[10px] text-zinc-500 mt-0.5">${escapeHtml(m.sublabel)}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </section>
        `;
      }

      if (model === "split_lead_form") {
        return `
          <section id="hero-section" class="pt-8 md:pt-14 pb-16 px-4 ${getContainerWidthClass(hero.containerWidth)} mx-auto">
            <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div class="lg:col-span-6 ${getAlignClass(hero.align)}">
                ${badgeHtml}
                ${headlineHtml}
                ${subheadlineHtml}
                <div class="${glassCardClass} p-3 rounded-2xl aspect-video mb-6">
                  ${renderMediaElement(hero)}
                </div>
                ${ratingAvatarsHtml}
              </div>

              <div class="lg:col-span-6">
                <div class="${glassCardClass} rounded-3xl p-6 sm:p-8 shadow-2xl" ${page.customAccentHex ? `style="border-color: ${page.customAccentHex}66;"` : ""}>
                  <h3 class="text-xl font-bold ${textTitleClass} mb-2">${escapeHtml(hero.leadFormTitle || "Garanta Seu Acesso Imediato")}</h3>
                  <p class="text-xs ${textBodyClass} mb-6">${escapeHtml(hero.leadFormSubtitle || "Preencha os dados abaixo para receber no seu WhatsApp.")}</p>
                  
                  <form onsubmit="handleLeadSubmit(event)" class="space-y-4">
                    <div>
                      <label class="block text-xs font-semibold ${isLight ? "text-zinc-700" : "text-zinc-300"} mb-1">Nome Completo</label>
                      <input type="text" required placeholder="Digite seu nome" class="w-full px-4 py-3 rounded-xl ${isLight ? "bg-white border-zinc-200 text-zinc-900" : "bg-zinc-900 border-zinc-800 text-white"} placeholder-zinc-500 focus:outline-none focus:border-${accent}-500" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold ${isLight ? "text-zinc-700" : "text-zinc-300"} mb-1">WhatsApp com DDD</label>
                      <input type="tel" oninput="maskPhone(this)" required placeholder="(11) 99999-9999" class="w-full px-4 py-3 rounded-xl ${isLight ? "bg-white border-zinc-200 text-zinc-900" : "bg-zinc-900 border-zinc-800 text-white"} placeholder-zinc-500 focus:outline-none focus:border-${accent}-500" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold ${isLight ? "text-zinc-700" : "text-zinc-300"} mb-1">E-mail</label>
                      <input type="email" required placeholder="seuemail@empresa.com" class="w-full px-4 py-3 rounded-xl ${isLight ? "bg-white border-zinc-200 text-zinc-900" : "bg-zinc-900 border-zinc-800 text-white"} placeholder-zinc-500 focus:outline-none focus:border-${accent}-500" />
                    </div>
                    <button type="submit" ${formCtaBtn.styleAttr} class="${formCtaBtn.className}">
                      ${escapeHtml(hero.leadFormButtonText || hero.ctaText || "Solicitar Contato Imediato")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        `;
      }

      if (model === "b2b_metrics") {
        const b2bMetrics = hero.b2bMetrics || [
          { id: "1", value: "+R$ 4.8M", label: "Faturamento Gerado aos Clientes" },
          { id: "2", value: "99.8%", label: "Satisfação & Retenção de Contratos" },
          { id: "3", value: "14 dias", label: "Prazo Médio de Implementação Total" },
        ];

        return `
          <section id="hero-section" class="pt-12 pb-16 px-4 ${getContainerWidthClass(hero.containerWidth)} mx-auto text-center">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${isLight ? "bg-amber-50 border border-amber-200 text-amber-800" : "bg-amber-950/70 border border-amber-500/40 text-amber-300"} text-xs font-bold mb-6">
              <span>🔥 ${escapeHtml(hero.scarcityLabel || `Restam apenas ${hero.scarcityRemainingSlots || 3} de ${hero.scarcityTotalSlots || 10} vagas disponíveis este mês`)}</span>
            </div>
            ${headlineHtml}
            ${subheadlineHtml}

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a href="#inscricao" ${primaryCtaBtn.styleAttr} class="${primaryCtaBtn.className}">
                <span>${escapeHtml(hero.ctaText)}</span>
              </a>
              ${secondaryCtaBtn ? `
                <a href="${hero.secondaryCtaUrl || '#diagnostico'}" ${secondaryCtaBtn.styleAttr} class="${secondaryCtaBtn.className}">
                  <span>${escapeHtml(hero.secondaryCtaText)}</span>
                </a>
              ` : ""}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto pt-6 border-t ${isLight ? "border-zinc-200" : "border-zinc-800/80"}">
              ${b2bMetrics.map(m => `
                <div class="p-4 ${glassCardClass} rounded-2xl">
                  <div class="text-2xl font-extrabold text-amber-400 mb-1">${escapeHtml(m.value)}</div>
                  <div class="text-xs font-medium ${isLight ? "text-zinc-800" : "text-zinc-300"}">${escapeHtml(m.label)}</div>
                </div>
              `).join("")}
            </div>
          </section>
        `;
      }

      if (model === "editorial_ebook") {
        return `
          <section id="hero-section" class="pt-12 pb-16 px-4 ${getContainerWidthClass(hero.containerWidth)} mx-auto">
            <div class="grid lg:grid-cols-12 gap-8 items-center">
              <div class="lg:col-span-7">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full ${isLight ? "bg-slate-100 border border-zinc-200 text-zinc-800" : `bg-${accent}-950/60 border border-${accent}-500/30 text-${accent}-300`} text-xs font-semibold mb-4" ${page.customAccentHex ? `style="background-color: ${page.customAccentHex}1a; border-color: ${page.customAccentHex}4d; color: ${page.customAccentHex};"` : ""}>
                  <span>Autor: ${escapeHtml(hero.authorName || "Especialista em IA & Automação")}</span>
                </div>
                ${headlineHtml}
                ${subheadlineHtml}
                <div class="inline-flex items-center gap-2 text-xs font-mono mb-6 px-3 py-1.5 rounded-lg ${isLight ? "text-zinc-700 bg-zinc-100 border-zinc-200" : "text-zinc-400 bg-zinc-900 border-zinc-800"} border">
                  <span>Formatos: ${escapeHtml(hero.availableFormats || "PDF • EPUB • KINDLE")}</span>
                </div>
                <div>
                  ${primaryBtnHtml}
                </div>
              </div>

              <div class="lg:col-span-5 text-center">
                <div class="${glassCardClass} p-3 rounded-2xl shadow-2xl max-w-sm mx-auto">
                  <img src="${hero.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}" alt="Ebook Cover" class="w-full h-auto rounded-xl object-cover shadow-2xl" />
                </div>
              </div>
            </div>
          </section>
        `;
      }

      return "";
    },

    socialProof: () => {
      if (!visibility.socialProof || !page.socialProof) return "";
      const sp = page.socialProof;
      const logoItems = sp.logoItems;
      let logosHtml = "";
      if (logoItems && logoItems.length) {
        logosHtml = logoItems.map(item => {
          const mode = item.colorMode || sp.logoColorMode || "accent";
          if (item.type === "image" && item.imageUrl) {
            let filterClass = "opacity-90";
            if (mode === "monochrome") filterClass = isLight ? "grayscale opacity-70" : "grayscale contrast-200 brightness-200 opacity-80";
            else if (mode === "accent") filterClass = isLight ? "contrast-125 opacity-90" : "brightness-200 contrast-125 opacity-90";
            return `<div class="px-6 py-2 ${glassCardClass} rounded-lg flex items-center justify-center"><img src="${item.imageUrl}" alt="${escapeHtml(item.text)}" class="h-8 w-auto object-contain ${filterClass}" /></div>`;
          }
          const textClass = mode === "accent" ? (isLight ? `text-${accent}-600` : `text-${accent}-400`) : mode === "monochrome" ? `text-zinc-500` : (isLight ? `text-zinc-800` : `text-zinc-200`);
          const customStyle = (mode === "accent" && page.customAccentHex) ? `style="color: ${page.customAccentHex};"` : "";
          return `<span class="px-6 py-2 ${glassCardClass} rounded-lg font-bold text-sm ${textClass}" ${customStyle}>${escapeHtml(item.text)}</span>`;
        }).join("");
      } else if (sp.marqueeLogos && sp.marqueeLogos.length) {
        logosHtml = sp.marqueeLogos.map(logo => `<span class="px-6 py-2 ${glassCardClass} rounded-lg font-bold text-sm ${isLight ? "text-zinc-700" : "text-zinc-300"}">${escapeHtml(logo)}</span>`).join("");
      }

      return `
        <section class="py-12 border-y ${isLight ? "border-zinc-200 bg-white" : "border-zinc-800/60 bg-zinc-900/30"}">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            ${sp.metrics.map(m => `
              <div class="p-4 rounded-xl ${glassCardClass}">
                <div class="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText} mb-1" ${page.customAccentHex ? `style="background: linear-gradient(to right, ${page.customAccentHex}, ${isLight ? "#1f2937" : "#ffffff"}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"` : ""}>${escapeHtml(m.value)}</div>
                <div class="text-xs sm:text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-200"}">${escapeHtml(m.label)}</div>
                ${m.sublabel ? `<div class="text-xs text-zinc-500 mt-1">${escapeHtml(m.sublabel)}</div>` : ""}
              </div>
            `).join("")}
          </div>

          ${logosHtml ? `
            <div class="mt-8 overflow-hidden relative">
              ${(sp.marqueeSpeed || "medium") === "stopped" ? `
                <div class="flex flex-wrap gap-4 sm:gap-8 items-center justify-center ${isLight ? "text-zinc-500" : "text-zinc-400"} font-semibold text-xs sm:text-sm tracking-wider uppercase opacity-85 py-2">
                  ${logosHtml}
                </div>
              ` : `
                <div class="${(sp.marqueeSpeed || "medium") === "slow" ? "animate-marquee-slow" : (sp.marqueeSpeed || "medium") === "fast" ? "animate-marquee-fast" : "animate-marquee"} whitespace-nowrap flex gap-6 items-center ${isLight ? "text-zinc-500" : "text-zinc-400"} font-semibold text-xs sm:text-sm tracking-wider uppercase opacity-85">
                  ${logosHtml + logosHtml}
                </div>
              `}
            </div>
          ` : ""}
        </section>
      `;
    },

    quiz: () => {
      if (!visibility.quiz || !page.quiz) return "";
      const q = page.quiz;
      const customStyle = page.customAccentHex ? `style="background-color: ${page.customAccentHex}1a; color: ${page.customAccentHex}; border-color: ${page.customAccentHex}33;"` : "";
      const customProgressStyle = page.customAccentHex ? `style="background-color: ${page.customAccentHex};"` : "";
      
      return `
        <section id="diagnostico" class="py-16 px-4 max-w-4xl mx-auto">
          <div class="text-center mb-10">
            <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${isLight ? `bg-${accent}-50 text-${accent}-700 border border-${accent}-200` : `bg-${accent}-500/10 text-${accent}-400 border border-${accent}-500/20`}" ${customStyle}>${escapeHtml(q.badge)}</span>
            <h2 class="font-display font-bold text-2xl sm:text-4xl ${textTitleClass} mt-3 mb-2">${escapeHtml(q.title)}</h2>
            <p class="${textBodyClass} text-xs sm:text-sm max-w-xl mx-auto">${escapeHtml(q.subtitle)}</p>
          </div>

          <div class="${glassCardClass} rounded-2xl p-6 sm:p-10" id="quiz-container">
            <div class="flex items-center justify-between mb-6">
              <span class="text-xs font-semibold ${isLight ? "text-zinc-600" : "text-zinc-400"}" id="quiz-step-indicator">Etapa 1 de ${q.questions.length}</span>
              <div class="w-36 ${isLight ? "bg-zinc-200" : "bg-zinc-800"} h-2 rounded-full overflow-hidden">
                <div class="bg-${accent}-500 h-full transition-all duration-300" id="quiz-progress-bar" ${customProgressStyle} style="width: ${Math.round((1 / q.questions.length) * 100)}%"></div>
              </div>
            </div>

            <div id="quiz-questions-wrap">
              ${q.questions.map((question, idx) => `
                <div class="quiz-step ${idx === 0 ? "" : "hidden"}" data-step="${idx}">
                  <h3 class="text-lg sm:text-xl font-bold ${textTitleClass} mb-2">${escapeHtml(question.question)}</h3>
                  ${question.description ? `<p class="text-xs ${textBodyClass} mb-6">${escapeHtml(question.description)}</p>` : ""}
                  <div class="grid sm:grid-cols-2 gap-3">
                    ${question.options.map(opt => `
                      <button type="button" onclick="selectQuizOption(${idx}, '${opt.id}', '${escapeHtml(opt.label)}')" class="quiz-option-btn text-left p-4 rounded-xl ${glassCardClass} hover:border-${accent}-500 transition-all flex items-center justify-between group cursor-pointer" ${page.customAccentHex ? `onmouseover="this.style.borderColor='${page.customAccentHex}'" onmouseout="this.style.borderColor=''` : ""}>
                        <span class="font-medium text-xs sm:text-sm ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-200 group-hover:text-white"}">${escapeHtml(opt.label)}</span>
                        <span class="text-xs ${isLight ? `text-${accent}-600` : `text-${accent}-400`} font-semibold opacity-0 group-hover:opacity-100 transition-opacity" ${page.customAccentHex ? `style="color: ${page.customAccentHex};"` : ""}>Selecionar →</span>
                      </button>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </div>

            <div id="quiz-result" class="hidden text-center py-6">
              <div class="w-14 h-14 bg-${accent}-500/20 text-${accent}-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-${accent}-500/40" ${page.customAccentHex ? `style="background-color: ${page.customAccentHex}33; color: ${page.customAccentHex}; border-color: ${page.customAccentHex}66;"` : ""}>
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h4 class="text-xl sm:text-2xl font-bold ${textTitleClass} mb-2">${escapeHtml(q.resultTitle)}</h4>
              <p class="text-xs sm:text-sm ${textBodyClass} mb-6 max-w-lg mx-auto">${escapeHtml(q.resultDescription)}</p>
              <a href="#inscricao" ${primaryCtaBtn.styleAttr} class="inline-block px-8 py-3.5 ${primaryCtaBtn.className} text-xs sm:text-sm">Continuar para Inscrição</a>
            </div>
          </div>
        </section>
      `;
    },

    bentoGrid: () => {
      if (!visibility.bentoGrid || !page.bentoGrid) return "";
      const bg = page.bentoGrid;
      const customStyle = page.customAccentHex ? `style="background-color: ${page.customAccentHex}1a; color: ${page.customAccentHex}; border-color: ${page.customAccentHex}33;"` : "";
      
      return `
        <section class="py-16 px-4 max-w-6xl mx-auto">
          <div class="text-center mb-10">
            <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${isLight ? `bg-${accent}-50 text-${accent}-700 border border-${accent}-200` : `bg-${accent}-500/10 text-${accent}-400 border border-${accent}-500/20`}" ${customStyle}>${escapeHtml(bg.badge)}</span>
            <h2 class="font-display font-bold text-2xl sm:text-4xl ${textTitleClass} mt-3 mb-2">${escapeHtml(bg.title)}</h2>
            <p class="${textBodyClass} text-xs sm:text-sm max-w-xl mx-auto">${escapeHtml(bg.subtitle)}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${bg.items.map(item => {
              const posX = item.imagePositionX ?? 50;
              const posY = item.imagePositionY ?? 50;
              const zoom = item.imageZoom ?? 100;
              const imgHtml = item.imageUrl ? `
                <div class="rounded-xl overflow-hidden my-3 aspect-video border ${isLight ? "border-zinc-200" : "border-zinc-800"} relative">
                  <img src="${item.imageUrl}" alt="${escapeHtml(item.title)}" class="w-full h-full object-cover" style="object-position: ${posX}% ${posY}%; transform: scale(${zoom / 100}); transform-origin: ${posX}% ${posY}%;" />
                </div>
              ` : "";
              
              let hoverBorderAttr = "";
              if (page.customAccentHex) {
                hoverBorderAttr = `onmouseover="this.style.borderColor='${page.customAccentHex}'" onmouseout="this.style.borderColor=''"`;
              }
              
              const btnHtml = item.buttonText ? `
                <div class="mt-4">
                  <a href="${item.buttonUrl || '#inscricao'}" class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer hover:scale-[1.02]" style="background-color: ${primaryColor}; color: #ffffff;">
                    <span>${escapeHtml(item.buttonText)}</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </a>
                </div>
              ` : "";
              
              return `
                <div ${getCardStyleAttr(item)} ${hoverBorderAttr} class="${glassCardClass} rounded-2xl p-6 hover:border-${accent}-500/40 transition-all ${
                  item.size === "large" || item.size === "wide" ? "md:col-span-2" : ""
                }">
                  ${item.tag ? `<span class="text-[11px] font-semibold ${isLight ? `text-${accent}-700 bg-${accent}-50/80 border border-${accent}-200` : `text-${accent}-400 bg-${accent}-950/60 border border-${accent}-500/20`}" ${page.customAccentHex ? `style="color: ${page.customAccentHex}; border-color: ${page.customAccentHex}33; background-color: ${page.customAccentHex}1a;"` : ""}>${escapeHtml(item.tag)}</span>` : ""}
                  <h3 class="text-lg font-bold ${textTitleClass} mt-3 mb-2">${escapeHtml(item.title)}</h3>
                  <p class="${textBodyClass} text-xs sm:text-sm leading-relaxed mb-3">${escapeHtml(item.description)}</p>
                  ${imgHtml}
                  ${item.metric ? `<div class="text-xs font-bold ${isLight ? `text-${accent}-600` : `text-${accent}-300`} mt-2" ${page.customAccentHex ? `style="color: ${page.customAccentHex};"` : ""}>${escapeHtml(item.metric)}</div>` : ""}
                  ${btnHtml}
                </div>
              `;
            }).join("")}
          </div>
        </section>
      `;
    },

    testimonials: () => {
      if (!visibility.testimonials || !page.testimonials) return "";
      const tm = page.testimonials;
      const customStyle = page.customAccentHex ? `style="background-color: ${page.customAccentHex}1a; color: ${page.customAccentHex}; border-color: ${page.customAccentHex}33;"` : "";
      
      return `
        <section class="py-16 px-4 max-w-6xl mx-auto">
          <div class="text-center mb-10">
            <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-${accent}-500/10 text-${accent}-400 border border-${accent}-500/20" ${customStyle}>${escapeHtml(tm.badge)}</span>
            <h2 class="font-display font-bold text-2xl sm:text-4xl text-white mt-3 mb-2">${escapeHtml(tm.title)}</h2>
            <p class="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">${escapeHtml(tm.subtitle)}</p>
          </div>

          <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            ${tm.items.map(t => {
              const posX = (t as any).imagePositionX ?? 50;
              const posY = (t as any).imagePositionY ?? 50;
              const zoom = (t as any).imageZoom ?? 100;
              return `
                <div ${getCardStyleAttr(t)} class="glass-card rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-1 text-amber-400 mb-3 text-xs sm:text-sm">
                      ${"★".repeat(t.rating || 5)}
                    </div>
                    <p class="text-xs sm:text-sm text-zinc-300 italic mb-6 leading-relaxed">"${escapeHtml(t.content)}"</p>
                  </div>
                  <div class="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                    <img src="${t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}" alt="${escapeHtml(t.name)}" class="w-10 h-10 rounded-full object-cover border border-${accent}-500/30" ${page.customAccentHex ? `style="border-color: ${page.customAccentHex}4d;"` : ""} style="object-position: ${posX}% ${posY}%; transform: scale(${zoom / 100}); transform-origin: ${posX}% ${posY}%;" />
                    <div>
                      <div class="font-bold text-xs sm:text-sm text-white">${escapeHtml(t.name)}</div>
                      <div class="text-[11px] text-zinc-400">${escapeHtml(t.role || 'Cliente')} • ${escapeHtml(t.companyOrCity || '')}</div>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </section>
      `;
    },

    formSection: () => {
      if (!visibility.formSection || !page.formSection) return "";
      const fs = page.formSection;
      
      const customFormBadgeStyle = page.customAccentHex ? `style="background-color: ${page.customAccentHex}33; color: ${page.customAccentHex}; border-color: ${page.customAccentHex}4d;"` : "";
      const customFormCardStyle = page.customAccentHex ? `style="border-color: ${page.customAccentHex}80;"` : "";

      return `
        <section id="inscricao" class="py-16 px-4 max-w-xl mx-auto">
          <div class="glass-card rounded-3xl p-6 sm:p-10 border border-${accent}-500/50 shadow-2xl relative overflow-hidden" ${customFormCardStyle}>
            <div class="text-center mb-6">
              <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-${accent}-500/20 text-${accent}-300 border border-${accent}-500/30" ${customFormBadgeStyle}>${escapeHtml(fs.badge)}</span>
              <h2 class="font-display font-bold text-xl sm:text-3xl text-white mt-3 mb-2">${escapeHtml(fs.title)}</h2>
              <p class="text-xs sm:text-sm text-zinc-400">${escapeHtml(fs.subtitle)}</p>
            </div>

            <form id="lead-capture-form" onsubmit="handleLeadSubmit(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Nome Completo</label>
                <input type="text" id="lead-name" required placeholder="Digite seu nome completo" class="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-${accent}-500" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">WhatsApp com DDD</label>
                <input type="tel" id="lead-phone" oninput="maskPhone(this)" required placeholder="(11) 99999-9999" class="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-${accent}-500" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Melhor E-mail</label>
                <input type="email" id="lead-email" required placeholder="seuemail@empresa.com" class="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-${accent}-500" />
              </div>

              <button type="submit" id="submit-btn" ${formCtaBtn.styleAttr} class="${formCtaBtn.className} mt-4">
                ${escapeHtml(fs.ctaButtonText || "Garantir Acesso Agora")}
              </button>
            </form>

            <div id="success-alert" class="hidden mt-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center">
              <div class="text-emerald-400 font-bold text-base sm:text-lg">Inscrição Confirmada! 🎉</div>
              <p class="text-xs text-zinc-300 mt-1">Nossa equipe entrará em contato via WhatsApp em instantes.</p>
            </div>

            <div class="mt-6 pt-6 border-t border-zinc-800/80 text-center">
              <div class="text-xs text-zinc-400 font-medium">${escapeHtml(fs.guaranteeText || "Garantia de Satisfação de 7 dias")}</div>
            </div>
          </div>
        </section>
      `;
    },

    faq: () => {
      if (!visibility.faq || !page.faq || !page.faq.length) return "";
      const customStyle = page.customAccentHex ? `style="background-color: ${page.customAccentHex}1a; color: ${page.customAccentHex}; border-color: ${page.customAccentHex}33;"` : "";

      return `
        <section class="py-16 px-4 max-w-4xl mx-auto">
          <div class="text-center mb-10">
            <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-${accent}-500/10 text-${accent}-400 border border-${accent}-500/20" ${customStyle}>Dúvidas Frequentes</span>
            <h2 class="font-display font-bold text-2xl sm:text-4xl text-white mt-3 mb-2">Perguntas Frequentes</h2>
            <p class="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">Tire todas as suas dúvidas antes de tomar sua decisão.</p>
          </div>

          <div class="space-y-3">
            ${page.faq.map((item, idx) => `
              <div class="glass-card rounded-2xl border border-zinc-800 overflow-hidden">
                <button type="button" onclick="toggleFaq(${idx})" class="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/40 transition-colors">
                  <span>${escapeHtml(item.question)}</span>
                  <span id="faq-icon-${idx}" class="text-${accent}-400 text-lg transition-transform" ${page.customAccentHex ? `style="color: ${page.customAccentHex};"` : ""}>+</span>
                </button>
                <div id="faq-answer-${idx}" class="hidden p-4 sm:p-5 pt-0 text-xs sm:text-sm text-zinc-400 border-t border-zinc-800/50 leading-relaxed">
                  ${escapeHtml(item.answer)}
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    },
  };

  // Render sections in sectionOrder
  const renderedSectionsHtml = sectionOrder
    .map(secKey => (sectionRenderers[secKey] ? sectionRenderers[secKey]() : ""))
    .join("\n");

  const stickyMobileCtaHtml = (visibility.stickyMobileCta !== false && page.hero?.ctaText) ? `
    <div class="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-zinc-950/95 border-t border-zinc-800/90 backdrop-blur-xl">
      <a href="#inscricao" ${primaryCtaBtn.styleAttr} class="${primaryCtaBtn.className}">
        <span>${escapeHtml(page.hero.ctaText)}</span>
      </a>
    </div>
  ` : "";

  return `<!DOCTYPE html>
<html lang="pt-BR" class="${isLight ? "" : "dark"} scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.hero?.subheadline || "").replace(/"/g, '&quot;')}" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'sans-serif'],
            display: ['Outfit', 'sans-serif'],
          },
          colors: {
            brand: '${primaryColor}',
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: ${isLight ? "#f8fafc" : "#09090b"};
      color: ${isLight ? "#0f172a" : "#f4f4f5"};
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .glow-bg {
      background: ${isLight ? "radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.03) 0%, transparent 65%)" : `radial-gradient(circle at 50% 0%, ${theme.neonGlow} 0%, transparent 65%)`};
    }
    .glass-card {
      background: ${isLight ? "#ffffff" : "rgba(24, 24, 27, 0.7)"};
      backdrop-filter: blur(16px);
      border: 1px solid ${isLight ? "#e4e4e7" : "rgba(63, 63, 70, 0.4)"};
      box-shadow: ${isLight ? "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" : "none"};
    }
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee, .animate-marquee-medium {
      display: flex;
      width: 200%;
      animation: marquee 50s linear infinite;
    }
    .animate-marquee-slow {
      display: flex;
      width: 200%;
      animation: marquee 80s linear infinite;
    }
    .animate-marquee-fast {
      display: flex;
      width: 200%;
      animation: marquee 30s linear infinite;
    }
    .animate-marquee:hover, .animate-marquee-slow:hover, .animate-marquee-fast:hover {
      animation-play-state: paused;
    }
    input:focus, textarea:focus, select:focus {
      border-color: ${primaryColor} !important;
      box-shadow: 0 0 0 2px ${primaryColor}33 !important;
    }
  </style>
</head>
<body class="${isLight ? "bg-slate-50 text-zinc-900" : "bg-zinc-950 text-zinc-100"} min-h-screen selection:bg-${accent}-500 selection:text-white relative overflow-x-hidden pb-16 sm:pb-0">

  <!-- Ambient Glow -->
  <div class="fixed inset-0 pointer-events-none z-0 glow-bg opacity-70"></div>
  <div class="fixed top-1/3 -left-48 w-96 h-96 rounded-full bg-${accent}-600/${isLight ? "5" : "10"} blur-3xl pointer-events-none"></div>
  <div class="fixed bottom-1/4 -right-48 w-96 h-96 rounded-full bg-blue-600/${isLight ? "5" : "10"} blur-3xl pointer-events-none"></div>

  <div class="relative z-10" ${bodyPtStyle}>

${headerNavHtml}

${renderedSectionsHtml}

    <!-- FOOTER -->
    <footer class="py-8 text-center text-xs text-zinc-600 border-t border-zinc-900">
      <p>© ${new Date().getFullYear()} ${escapeHtml(page.title)}. Todos os direitos reservados.</p>
    </footer>

  </div>

  ${stickyMobileCtaHtml}

  <script>
    function toggleMobileMenu() {
      const drawer = document.getElementById('mobile-menu-drawer');
      const hamburger = document.getElementById('menu-icon-hamburger');
      const closeIcon = document.getElementById('menu-icon-close');
      if (drawer) {
        if (drawer.classList.contains('hidden')) {
          drawer.classList.remove('hidden');
          if (hamburger) hamburger.classList.add('hidden');
          if (closeIcon) closeIcon.classList.remove('hidden');
        } else {
          drawer.classList.add('hidden');
          if (hamburger) hamburger.classList.remove('hidden');
          if (closeIcon) closeIcon.classList.add('hidden');
        }
      }
    }

    const quizState = { answers: {} };
    const totalQuestions = ${page.quiz?.questions?.length || 0};
    const webhookEndpoint = "${page.webhookUrl || ""}";

    function selectQuizOption(stepIdx, optionId, optionLabel) {
      quizState.answers['pergunta_' + (stepIdx + 1)] = optionLabel;
      const currentStep = document.querySelector('.quiz-step[data-step="' + stepIdx + '"]');
      const nextStep = document.querySelector('.quiz-step[data-step="' + (stepIdx + 1) + '"]');

      if (currentStep) currentStep.classList.add('hidden');

      if (nextStep) {
        nextStep.classList.remove('hidden');
        const indicator = document.getElementById('quiz-step-indicator');
        if (indicator) indicator.innerText = 'Etapa ' + (stepIdx + 2) + ' de ' + totalQuestions;
        const progress = document.getElementById('quiz-progress-bar');
        if (progress) progress.style.width = (((stepIdx + 2) / totalQuestions) * 100) + '%';
      } else {
        const wrap = document.getElementById('quiz-questions-wrap');
        if (wrap) wrap.classList.add('hidden');
        const res = document.getElementById('quiz-result');
        if (res) res.classList.remove('hidden');
        const progress = document.getElementById('quiz-progress-bar');
        if (progress) progress.style.width = '100%';
      }
    }

    function toggleFaq(idx) {
      const ans = document.getElementById('faq-answer-' + idx);
      const icon = document.getElementById('faq-icon-' + idx);
      if (ans) {
        if (ans.classList.contains('hidden')) {
          ans.classList.remove('hidden');
          if (icon) icon.innerText = '−';
        } else {
          ans.classList.add('hidden');
          if (icon) icon.innerText = '+';
        }
      }
    }

    function maskPhone(input) {
      let v = input.value.replace(/\\D/g, '').slice(0, 11);
      if (v.length > 10) {
        input.value = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7,11);
      } else if (v.length > 5) {
        input.value = '(' + v.slice(0,2) + ') ' + v.slice(2,6) + '-' + v.slice(6);
      } else if (v.length > 2) {
        input.value = '(' + v.slice(0,2) + ') ' + v.slice(2);
      } else {
        input.value = v;
      }
    }

    function getUtms() {
      const params = new URLSearchParams(window.location.search);
      const utms = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src'].forEach(function(k) {
        const val = params.get(k);
        if (val) utms[k] = val;
      });
      return utms;
    }

    async function handleLeadSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('submit-btn');
      if (btn) {
        btn.innerText = 'Processando...';
        btn.disabled = true;
      }

      const nameEl = document.getElementById('lead-name');
      const phoneEl = document.getElementById('lead-phone');
      const emailEl = document.getElementById('lead-email');

      const payload = {
        pageId: "${page.id}",
        pageTitle: "${escapeHtml(page.title)}",
        name: nameEl ? nameEl.value : '',
        whatsapp: phoneEl ? phoneEl.value : '',
        email: emailEl ? emailEl.value : '',
        quizAnswers: quizState.answers,
        utms: getUtms(),
        webhookUrl: webhookEndpoint
      };

      try {
        if (webhookEndpoint) {
          fetch(webhookEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(console.error);
        }
      } catch (err) {
        console.log('Webhook triggered', err);
      }

      if (window.confetti) {
        window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }

      const form = document.getElementById('lead-capture-form');
      if (form) form.classList.add('hidden');
      const alert = document.getElementById('success-alert');
      if (alert) alert.classList.remove('hidden');
    }

    // Typewriter effect initialization
    (function() {
      const container = document.querySelector('.typewriter-container');
      if (!container) return;
      const words = JSON.parse(container.getAttribute('data-words') || '[]');
      if (!words || words.length === 0) return;
      
      const textEl = container.querySelector('.typewriter-text');
      let wordIdx = 0;
      let currentText = words[0] || '';
      let isDeleting = false;
      
      function tick() {
        const targetWord = words[wordIdx % words.length] || '';
        
        if (!isDeleting) {
          if (currentText.length < targetWord.length) {
            currentText = targetWord.slice(0, currentText.length + 1);
            if (textEl) textEl.innerText = currentText;
            setTimeout(tick, 90);
          } else {
            setTimeout(function() {
              isDeleting = true;
              tick();
            }, 1800);
          }
        } else {
          if (currentText.length > 0) {
            currentText = targetWord.slice(0, currentText.length - 1);
            if (textEl) textEl.innerText = currentText;
            setTimeout(tick, 45);
          } else {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            setTimeout(tick, 300);
          }
        }
      }
      
      setTimeout(tick, 1000);
    })();
  </script>
</body>
</html>`;
}
