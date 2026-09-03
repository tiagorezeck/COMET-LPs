// Thematic Image Resolver for LAN AI Agent Landing Page Generation
// Provides high-resolution, topic-aligned Unsplash images per niche & copy context

export interface ThematicImageBundle {
  heroImage: string;
  videoThumbnail: string;
  bentoImages: string[];
  avatars: string[];
}

// Curated high-conversion Unsplash photo collections organized by domain
const DOMAIN_IMAGE_COLLECTIONS: Record<string, ThematicImageBundle> = {
  consultoria: {
    heroImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80", // Modern glass office executive
    videoThumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80", // Executive woman consulting
    bentoImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", // Analytics & growth chart
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80", // Boardroom strategic meeting
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80", // Deal handshake and contracts
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80", // Strategic planning on tablet
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80", // Leader presenting metrics
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", // Financial analytics dashboard
    ],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    ],
  },
  mentoria: {
    heroImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=80", // Mentor presenting to group
    videoThumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80", // High ticket mastermind group
    bentoImages: [
      "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80", // 1-on-1 mentoring session
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80", // Mastermind workshop team
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80", // High ticket sales dashboard
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80", // Students learning together
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", // Executive suit leader
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", // High performance workshop
    ],
    avatars: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    ],
  },
  treinamento: {
    heroImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1600&q=80", // Speaker stage live event
    videoThumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80", // Interactive classroom training
    bentoImages: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80", // Immersive workshop auditorium
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=800&q=80", // Group collaboration exercise
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", // Digital certificate and laptop
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80", // Happy trained professionals
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80", // Study guide and certification
      "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=800&q=80", // Keynote speaker presentation
    ],
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    ],
  },
  saas: {
    heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80", // Futuristic AI neon interface
    videoThumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80", // Software engineering workstation
    bentoImages: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", // Clean programming code screen
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", // Real-time SaaS analytics dashboard
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80", // Automation node matrix & AI
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80", // UI/UX design wireframe tablet
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", // Cloud server network infrastructure
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80", // Dark mode dashboard graphs
    ],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    ],
  },
  estetica_saude: {
    heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80", // High end aesthetic clinic
    videoThumbnail: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80", // Doctor consulting female patient
    bentoImages: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80", // Luxury medical & dental treatment room
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", // Female specialist with tablet
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80", // Professional doctor smile
      "https://images.unsplash.com/photo-1512290900673-700200832328?auto=format&fit=crop&w=800&q=80", // Wellness & glowing skin treatment
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80", // Modern clinic lounge reception
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80", // High tech medical diagnostic
    ],
    avatars: [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80", // Female doctor
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80", // Male doctor
      "https://images.unsplash.com/photo-1594824813570-08927054f0a2?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    ],
  },
  construcao_solar: {
    heroImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80", // Solar farm and clean energy
    videoThumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", // Engineer architect blueprint
    bentoImages: [
      "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80", // Solar panel roof installation
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", // Luxury modern house architecture
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80", // Industrial engineer hardhat inspection
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", // Glass skyscraper development
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", // Architectural 3D design office
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", // Project contract approval
    ],
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    ],
  },
  advocacia: {
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80", // Legal gavel and law books
    videoThumbnail: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80", // High level legal office desk
    bentoImages: [
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80", // Legal contract review & signing
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80", // Confidential client handshake
      "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?auto=format&fit=crop&w=800&q=80", // Supreme court architecture
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80", // Senior attorney team
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", // Compliance auditing sheet
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", // Executive suit lawyer
    ],
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    ],
  },
  gastronomia_comercio: {
    heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80", // Luxury restaurant atmosphere
    videoThumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80", // Chef plating gourmet food
    bentoImages: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80", // Fine dining dish presentation
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80", // Boutique retail store display
      "https://images.unsplash.com/photo-1556742049-0a67568d04e3?auto=format&fit=crop&w=800&q=80", // Customer POS checkout
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80", // VIP reservation table
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80", // Commercial kitchen excellence
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80", // E-commerce packaging delivery
    ],
    avatars: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    ],
  },
};

/**
 * Resolves the primary category key based on keywords found in niche, prompt, or headline
 */
export function resolveCategoryKey(niche?: string, prompt?: string, headline?: string): string {
  const text = `${niche || ""} ${prompt || ""} ${headline || ""}`.toLowerCase();

  if (/saas|software|tecnologia|ia|whatsapp|bot|crm|automação|app|plataforma/i.test(text)) {
    return "saas";
  }
  if (/clínica|estética|médic|harmonização|botox|saúde|odonto|dermato|paciente/i.test(text)) {
    return "estetica_saude";
  }
  if (/solar|construção|arquitetura|engenharia|obra|energia|imóvel|projeto/i.test(text)) {
    return "construcao_solar";
  }
  if (/mentoria|mastermind|coaching|liderança|high-ticket|infoprodut/i.test(text)) {
    return "mentoria";
  }
  if (/treinamento|curso|imersão|escola|palestra|workshop|formação/i.test(text)) {
    return "treinamento";
  }
  if (/advocacia|jurídic|direit|advogad|lei|processo/i.test(text)) {
    return "advocacia";
  }
  if (/restaurante|gastronomia|comércio|varejo|loja|venda|produto/i.test(text)) {
    return "gastronomia_comercio";
  }
  if (/consultoria|financeira|empresarial|comercial|gestão|processos/i.test(text)) {
    return "consultoria";
  }

  // Default fallback
  return "consultoria";
}

/**
 * Returns a thematic image set matching the domain
 */
export function getThematicImagesForNiche(niche?: string, prompt?: string, headline?: string): ThematicImageBundle {
  const key = resolveCategoryKey(niche, prompt, headline);
  return DOMAIN_IMAGE_COLLECTIONS[key] || DOMAIN_IMAGE_COLLECTIONS.consultoria;
}

/**
 * Enhances a generated Landing Page object by injecting relevant, non-duplicate
 * Unsplash images tailored to the niche, headline, and Bento Grid item titles.
 */
export function applyThematicImagesToPage<T extends Record<string, any>>(pageData: T): T {
  if (!pageData) return pageData;

  const bundle = getThematicImagesForNiche(
    pageData.niche,
    pageData.title,
    pageData.hero?.headline
  );

  const updated: any = { ...pageData };

  // 1. Hero Image & Thumbnail
  if (updated.hero) {
    updated.hero = {
      ...updated.hero,
      imageUrl: updated.hero.imageUrl || bundle.heroImage,
      videoThumbnail: updated.hero.videoThumbnail || bundle.videoThumbnail,
    };

    // Social Proof Avatars in Hero
    if (updated.hero.socialProofAvatars && Array.isArray(updated.hero.socialProofAvatars)) {
      updated.hero.socialProofAvatars = updated.hero.socialProofAvatars.map((av: any, i: number) => ({
        ...av,
        avatarUrl: av.avatarUrl || bundle.avatars[i % bundle.avatars.length],
      }));
    }
  }

  // 2. Bento Grid Items: Assign unique thematic images based on item title/description
  if (updated.bentoGrid && Array.isArray(updated.bentoGrid.items)) {
    const availableBentoImages = [...bundle.bentoImages];

    updated.bentoGrid.items = updated.bentoGrid.items.map((item: any, idx: number) => {
      // Pick image by keywords in item title or fall back to unique index in pool
      let chosenImage = availableBentoImages[idx % availableBentoImages.length];

      const itemText = `${item.title || ""} ${item.description || ""}`.toLowerCase();

      // Keyword matchers for finer image context
      if (/gráfico|metric|analytics|crescimento|resultado|conversão/i.test(itemText)) {
        chosenImage = bundle.bentoImages[0];
      } else if (/time|reunião|processo|estratégia|suporte|atendimento/i.test(itemText)) {
        chosenImage = bundle.bentoImages[1];
      } else if (/contrato|garantia|segurança|acordo|blindado/i.test(itemText)) {
        chosenImage = bundle.bentoImages[2];
      } else if (/plataforma|dashboard|tecnologia|ferramenta|sistema/i.test(itemText)) {
        chosenImage = bundle.bentoImages[3];
      }

      return {
        ...item,
        imageUrl: item.imageUrl || chosenImage,
      };
    });
  }

  // 3. Testimonial Avatars
  if (updated.testimonials && Array.isArray(updated.testimonials.items)) {
    updated.testimonials.items = updated.testimonials.items.map((t: any, idx: number) => ({
      ...t,
      avatarUrl: t.avatarUrl || bundle.avatars[idx % bundle.avatars.length],
    }));
  }

  return updated;
}
