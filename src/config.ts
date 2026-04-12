export const config = {
  title: "Cursor Saudi",
  description: "Cursor Saudi Community",
  author: "Cursor Saudi",
  /**
   * Speaker profiles. Each speaker is rendered at /speakers/{slug}/. Names that
   * appear in event frontmatter are matched against `name` and `aliases` to
   * derive talk lists. `bio`/`bioAr` are placeholders the maintainer can fill
   * in directly here. `photo` should live under /public/images/speakers/.
   */
  speakers: [
    {
      slug: "abdullah-mosaibah",
      name: "Abdullah Mosaibah",
      nameAr: "عبدالله المصيباح",
      initials: "AM",
      bio: "",
      bioAr: "",
      photo: "/images/speakers/abdullah-mosaibah.jpg",
      twitter: "https://x.com/AbdoMosaibah",
      twitterHandle: "AbdoMosaibah",
      aliases: [],
    },
    {
      slug: "dan-perks",
      name: "Dan Perks",
      nameAr: "دان بيركس",
      initials: "DP",
      bio: "",
      bioAr: "",
      photo: "/images/speakers/dan-perks.jpg",
      twitter: "https://x.com/danperks",
      twitterHandle: "danperks",
      aliases: ["Dan (Cursor)", "Dan"],
    },
    {
      slug: "faris-hijazi",
      name: "Faris Hijazi",
      nameAr: "فارس حجازي",
      initials: "FH",
      bio: "",
      bioAr: "",
      photo: "/images/speakers/faris-hijazi.jpg",
      twitter: "https://x.com/theefaris",
      twitterHandle: "theefaris",
      aliases: [],
    },
    {
      slug: "usman-siddique",
      name: "Usman Siddique",
      nameAr: "عثمان صديق",
      initials: "US",
      bio: "",
      bioAr: "",
      photo: "/images/speakers/usman-siddique.jpg",
      linkedin: "https://www.linkedin.com/in/muhammmadosman/",
      aliases: [],
    },
    {
      slug: "nick-miller",
      name: "Nick Miller",
      nameAr: "نيك ميلر",
      initials: "NM",
      bio: "",
      bioAr: "",
      photo: "/images/speakers/nick-miller.jpg",
      twitter: "https://x.com/nickwm",
      twitterHandle: "nickwm",
      aliases: [],
    },
  ],
  ambassadors: [
    {
      name: "Mazen Alotaibi",
      nameAr: "مازن العتيبي",
      role: "Saudi Arabia Leader",
      roleAr: "قائد المجتمع في السعودية",
      city: "Riyadh",
      cityAr: "الرياض",
      photo: "/images/team/mazen.jpg",
      description: "Software engineer and Cursor ambassador leading the Saudi community. Organizing meetups, workshops, and hackathons across the Kingdom.",
      descriptionAr: "مهندس برمجيات وسفير كيرسر يقود المجتمع السعودي. ينظم اللقاءات وورش العمل والهاكاثونات في أنحاء المملكة.",
      email: "hello@cursorsaudi.com",
      twitter: "https://x.com/ma7dev",
      twitterHandle: "ma7dev",
      linkedin: "https://www.linkedin.com/in/ma7dev/",
    },
    {
      name: "Abdulhakeem Almidan",
      nameAr: "عبدالحكيم الميدان",
      role: "Ambassador",
      roleAr: "سفير",
      city: "Khobar",
      cityAr: "الخبر",
      photo: "/images/team/abdulhakeem.jpg",
      description: "Former Khobar chapter ambassador who helped bring Cursor events to the Eastern Province.",
      descriptionAr: "سفير فرع الخبر السابق الذي ساهم في إقامة فعاليات كيرسر في المنطقة الشرقية.",
      twitter: "https://x.com/abdulhakeem_mdn",
      linkedin: "https://www.linkedin.com/in/abdulhakeem-almidan/",
      status: "retired",
    },
  ],
  social: {
    luma: "https://lu.ma/cursor-saudi",
    discord: "https://discord.gg/KpsKtegvz4",
    twitter: "https://x.com/cursorsaudi",
    /** Community X handle without @ (for display copy). */
    twitterHandle: "cursorsaudi",
    email: "hello@cursorsaudi.com",
    github: "https://github.com/cursorsaudi",
  },
  /**
   * Partner profiles. Each partner is rendered at /partners/{slug}/. The set of
   * events a partner was part of is the union of:
   *   - events whose `venue` frontmatter matches any string in `eventVenues`
   *   - events whose ID is listed in `events`
   * Use `eventVenues` for venue hosts and `events` for community partners.
   */
  partners: [
    {
      slug: "cursor",
      name: "Cursor",
      nameAr: "كيرسر",
      role: "official",
      logo: "/logos/cursor.svg",
      url: "https://cursor.com",
      description:
        "The AI-native code editor built on VS Code. Ship faster with intelligent autocomplete, chat, and agentic coding.",
      descriptionAr:
        "محرر الأكواد المدعوم بالذكاء الاصطناعي المبني على VS Code. طوّر أسرع مع الإكمال الذكي والدردشة والبرمجة الوكيلية.",
      cities: [],
      eventVenues: [],
      events: [],
    },
    {
      slug: "dal",
      name: "Dal",
      nameAr: "دال",
      role: "community-partner",
      logo: "/logos/dal.png",
      url: "https://x.com/DalData_sa",
      description:
        "A Saudi nonprofit empowering data science & AI enthusiasts through hands-on programs, datathons, and job-shadowing. Supported and funded by Misk Foundation and SDAIA.",
      descriptionAr:
        "جمعية غير ربحية سعودية تمكّن المهتمين بعلوم البيانات والذكاء الاصطناعي من خلال برامج عملية وداتاثونات. مدعومة وممولة من مؤسسة مسك وسدايا.",
      cities: ["Riyadh"],
      eventVenues: [],
      events: [
        "2025-12-25-contributing-to-open-source-with-cursor",
        "2026-01-10-the-ai-dev-stack-with-cursor",
        "2026-03-07-cursor-workshop-ship-in-3-hours",
      ],
    },
    {
      slug: "mozn",
      name: "Mozn",
      nameAr: "مزن",
      role: "venue-host",
      logo: "/logos/mozn.svg",
      url: "https://mozn.ai",
      description:
        "Saudi AI company building enterprise AI products for the Arabic-first market, including NLP, risk, and compliance solutions.",
      descriptionAr:
        "شركة ذكاء اصطناعي سعودية تبني منتجات ذكاء اصطناعي للمؤسسات في السوق العربي، تشمل حلول معالجة اللغة والمخاطر والامتثال.",
      cities: ["Riyadh"],
      eventVenues: ["Mozn Office"],
      events: [],
    },
    {
      slug: "code",
      name: "CODE",
      nameAr: "مركز ريادة الأعمال الرقمية",
      role: "venue-host",
      logo: "/logos/code.svg",
      url: "https://code.mcit.gov.sa/en",
      description:
        "Center of Digital Entrepreneurship by MCIT — coworking spaces, business services, and acceleration programs supporting digital startups.",
      descriptionAr:
        "مركز ريادة الأعمال الرقمية التابع لوزارة الاتصالات — مساحات عمل مشتركة وخدمات أعمال وبرامج تسريع لدعم الشركات الرقمية الناشئة.",
      cities: ["Riyadh"],
      eventVenues: ["CODE"],
      events: [],
    },
    {
      slug: "monshaat",
      name: "Monshaat",
      nameAr: "منشآت",
      role: "venue-host",
      logo: "/logos/monshaat-dark.svg",
      url: "https://www.monshaat.gov.sa/ar/ssc",
      description:
        "SME support centers by Monshaat — providing training, mentorship, consulting, and coworking spaces for entrepreneurs across Saudi Arabia.",
      descriptionAr:
        "مراكز دعم المنشآت — تقدم التدريب والإرشاد والاستشارات ومساحات العمل المشتركة لرواد الأعمال في السعودية.",
      cities: ["Khobar"],
      eventVenues: ["Khobar Tech Hub"],
      events: [],
    },
    {
      slug: "nauatech",
      name: "Nauatech",
      nameAr: "نواتك",
      role: "past-community-partner",
      logo: "/logos/nauatech.svg",
      url: "https://naua.tech/",
      description:
        "A Saudi tech community that partnered with Cursor Saudi for early events in Riyadh.",
      descriptionAr:
        "مجتمع تقني سعودي شارك في دعم فعاليات Cursor السعودية المبكرة في الرياض.",
      cities: ["Riyadh"],
      eventVenues: [],
      events: ["2025-05-28-kickoff", "2025-07-30-build-your-mvp-with-ai"],
    },
  ],
} as const;
