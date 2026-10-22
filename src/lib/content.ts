// Barcha matnlar "Yoshlar Biznes Maktabi" prezentatsiyasidan olingan.

export const site = {
  name: "Yoshlar Biznes Maktabi",
  tagline: "Biznesingizni keyingi bosqichga olib chiqish imkoniyati",
  description:
    "Yoshlar ishlari agentligi qoshidagi Yoshlar tadbirkorligini rivojlantirish jamg‘armasi hamda FAZZA Management School hamkorligida tashkil etilgan, yosh tadbirkorlar uchun amaliy biznes ta’lim dasturi.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.uz",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  telegram: process.env.NEXT_PUBLIC_CONTACT_TELEGRAM || "",
};

export const partners = [
  { name: "Yoshlar ishlari agentligi", src: "/images/partners/agentlik.png", w: 900, h: 252 },
  { name: "Yoshlar tadbirkorligini rivojlantirish jamg‘armasi", src: "/images/partners/jamgarma.png", w: 1287, h: 411 },
  { name: "FAZZA Management School", src: "/images/partners/fazza.png", w: 1310, h: 267 },
];

// Maktabni bitirgan asoschilarning brendlari (karusel). fit: "contain" — keng, oq fonli logolar kesilmasligi uchun
export const alumniBrands = [
  { name: "PIPLS", src: "/images/alumni/pipls.jpg", fit: "cover" },
  { name: "YESS!", src: "/images/alumni/yess.jpg", fit: "cover" },
  { name: "q.watt", src: "/images/alumni/qwatt.jpg", fit: "cover" },
  { name: "SAN SEB", src: "/images/alumni/sanseb.jpg", fit: "cover" },
  { name: "DATA ta’lim stansiyasi", src: "/images/alumni/data.jpg", fit: "contain" },
] as const;

export const painPoints = [
  { title: "Tizim yo‘q, hammasini o‘zim qilaman", icon: "system" },
  { title: "Sotuv past, mijoz oqimi barqaror emas", icon: "sales" },
  { title: "Lid qimmat, reklama ishlamaydi", icon: "ads" },
  { title: "Kassa uzilishlar, nasiya, qarzdorlik, “raqamlar aniq emas”", icon: "cash" },
  { title: "“Qanday kengayishni bilmayman”", icon: "scale" },
  { title: "Yangi bilim va ustoz yetishmasligi", icon: "mentor" },
  { title: "O‘sish to‘xtab qolgan, keyingi bosqichga chiqa olmayapsiz", icon: "growth" },
] as const;

export const audience = [
  "18–30 yoshdagi tadbirkorlar",
  "Kamida 6 oy faol biznesi mavjud tadbirkorlar",
  "Kuchli g‘oya va Visionga ega yosh tadbirkorlar",
  "Biznesni o‘stirish va professional boshqarishga o‘tish istagidagilar",
  "Mahalliy va xalqaro bozorda yetakchi brend bo‘lishni maqsad qilganlar",
];

export const format = [
  { label: "Format", value: "Oflayn" },
  { label: "Davomiylik", value: "12 kun (2 oy)" },
  { label: "Ishtirokchilar", value: "70 nafar" },
  { label: "Nazariya vs amaliyot", value: "30–70%" },
];

export const uniques = [
  { title: "70% amaliyot", text: "Mashg‘ulotlar amaliy mashg‘ulot va keyslar asosida o‘tadi", icon: "tool" },
  { title: "Praktik ekspertlar", text: "Har bir yo‘nalishda o‘z sohasining tajribali praktik ekspertlari dars beradi", icon: "cap" },
  { title: "70% grant", text: "Yoshlar tadbirkorligini qo‘llab-quvvatlash jamg‘armasi tomonidan 70% grant", icon: "star" },
  { title: "Imtiyozli moliyalashtirish", text: "Dasturdan keyin imtiyozli moliyalashtirish va amaliy qo‘llab-quvvatlov", icon: "key" },
  { title: "Mentorlar va kuratorlar", text: "Butun dastur davomida mentorlar va kuratorlar bilan ishlash", icon: "users" },
];

export const locations = [
  { city: "Andijon", date: "2026-11-07", label: "07.11.2026" },
  { city: "Samarqand", date: "2026-11-16", label: "16.11.2026" },
  { city: "Nukus", date: "2026-11-21", label: "21.11.2026" },
];

export const modules = [
  {
    n: 1,
    days: 2,
    title: "Biznesning o‘zgarishlarni boshqarish va strategik boshqaruv",
    items: [
      "Biznesni keyingi bosqichga olib chiqish bo‘yicha transformatsiya jarayonlarini samarali tashkil etish",
      "Adizes PAEI modeli asosida samarali jamoa shakllantirish va transformatsion liderga aylanish",
      "Kompaniyaning missiyasi, vizioni va asosiy qadriyatlarini shakllantirish",
      "Biznesning joriy holatini tahlil qilish va rivojlanish imkoniyatlarini aniqlash",
      "SWOT, PESTEL kabi tahlil instrumentlari orqali biznesni har tomonlama baholash",
      "Strategik maqsadlar va ustuvor yo‘nalishlarni belgilash",
      "Kompaniyaning o‘sish strategiyasini ishlab chiqish",
      "Strategik tashabbuslar uchun KPI ko‘rsatkichlarini belgilash",
    ],
  },
  {
    n: 2,
    days: 3,
    title: "Marketing va mijoz jalb qilish",
    items: [
      "Asosiy mahsulot va qiymat taklifini shakllantirish",
      "Ideal mijoz profilini aniqlash",
      "Mijoz yo‘l xaritasini (Customer Journey Map) ishlab chiqish",
      "Marketing samaradorligini o‘lchash tizimini yaratish",
      "Marketing dashboard va analitika vositalarini joriy qilish",
      "Marketingni doimiy takomillashtirish tizimini shakllantirish",
    ],
  },
  {
    n: 3,
    days: 1,
    title: "Brend strategiyasi",
    items: [
      "Brending va Marketing farqi",
      "Brend strategiyasi",
      "Kuchli brendni shakllantirish",
      "Noyob brend identikasini yaratish",
      "Brend platformasi",
      "Brend pozitsiyasi",
      "Brendni iste’molchi tasavvuriga joylashtirish",
      "Brend shaxsiyati, vizual identika va kommunikatsiyasi",
    ],
  },
  {
    n: 4,
    days: 2,
    title: "Sotuv orqali biznesni o‘stirish",
    items: [
      "Savdo bo‘limining tashkiliy strukturasi. Sotuv jamoasini boshqarish va ideal savdo sistemasini qurish",
      "E’tirozlar bilan amaliy ishlash, ularni yengish bo‘yicha ekspert strategiyalar",
      "Samarali sotuv instrumentlari",
      "Deal closing va muzokara texnikalari",
      "Mijoz psixologiyasi, xarid motivlari va ta’sir texnikalari",
      "Mijoz bilan munosabat qurish (relationship selling)",
      "Sotuv prezentatsiyasi yaratish",
      "Sotuvchilar uchun KPI tuzish",
      "Savdo analitikasi: voronkasi va konversiyalarni hisoblash",
      "Qayta sotuv strategiyasi",
      "Retention: mijozlar bilan uzoq muddatli munosabat orqali LTV ni oshirish",
    ],
  },
  {
    n: 5,
    days: 3,
    title: "Moliya boshqaruvi, raqamli transformatsiya",
    items: [
      "Biznesda moliya funksiyasi roli va vazifalari",
      "Pul va foyda o‘rtasidagi farqni anglash",
      "Byudjet va reja-fakt tahlili",
      "Zararsizlik nuqtasini aniqlash va hisoblash",
      "ABC va XYZ tahlilini qo‘llash",
      "SKU boshqaruvi va assortiment optimallashtirish",
      "ROI orqali investitsiya samaradorligini o‘lchash",
      "To‘lov kalendarini tuzish va yangilash",
      "Kassa uzilishlarini bartaraf etish",
      "Debitor va kreditor qarzdorlikni boshqarish",
      "Aylanma kapital va ishchi kapital boshqaruvi",
      "Boshqaruv hisobotlari: BS (Balans), P&L (Daromad-xarajat), CF (Pul oqimi) hisobotlarini o‘qish",
      "Biznes operatsiyalarini raqamlarda aks ettirish",
      "Moliyaviy nazorat tizimini o‘rnatish",
    ],
  },
  {
    n: 6,
    days: 1,
    title: "Soliq, yuridik va eksport bo‘yicha trening",
    items: [
      "Soliq bo‘yicha yangilik va imtiyozlar",
      "Yuridik masalalar bo‘yicha seminar",
      "Mahsulot va xizmatlarni eksportga olib chiqish yo‘llari",
    ],
  },
];

export const mentors = [
  {
    name: "Jamoliddin Shodiev",
    title: "MBA · FAZZA Management School asoschisi",
    photo: "/images/mentors/jamoliddin-shodiev.jpg",
    highlight: "16 yil boshqaruv tajribasi",
    bio: "Biznesning strategik va moliyaviy boshqaruvi bo‘yicha ekspert, Koreyaning Sejong universiteti MBA darajasiga ega, FAZZA Management School asoschisi, O‘zbekistonda o‘zbek tilida tadbirkorlar uchun birinchi FAZZA TOP CEO amaliy MBA dasturi asoschisi. Boshqaruv sohasida 16 yillik amaliy tajribaga ega. Moliya vazirligi tizimida, xalqaro va mahalliy kompaniyalarda, jumladan EVO, EMU, SOF GROUP kompaniyalarida TOP lavozimlarida faoliyat olib borgan. Bulut, Cambridge LC, Najot ta’lim, Mars IT kompaniyalarida uzoq muddatli strategiyani ishlab chiqish bo‘yicha strategik sessiyalarni tashkil qilgan.",
  },
  {
    name: "Otabek Umarov",
    title: "Head of Business Transformation, Veolia Energy Tashkent",
    photo: "/images/mentors/otabek-umarov.jpg",
    highlight: "28 yil tajriba",
    bio: "Veolia Energy Tashkent kompaniyasida “Head of Business Transformation” lavozimida faoliyat yuritadi. Strategik boshqaruv va moliyaviy boshqaruv sohasida 28 yillik tajribaga ega. Professional karyerasi davomida O‘zbekistonda UZBAT, UzCaseMash, IFODA, Rozmetov va Rossiyada Skolkovo Biznes Maktabi, SIBUR kompaniyalar guruhi, ACNielsen Cyprus, “Bazoviy element” kompaniyalar guruhida TOP lavozimlarda ishlagan. Strategik va operatsion boshqaruv, moliya, biznesni tizimlashtirish, investitsiyalarni baholash, qo‘shimcha moliyaviy resurslarni jalb qilish, risklarni boshqarish bo‘yicha professional mutaxassis.",
  },
  {
    name: "Habibullo Sadulloev",
    title: "Marketing strategi, Proactive marketing agentligi",
    photo: "/images/mentors/habibullo-sadulloev.jpg",
    highlight: "10+ yil marketing",
    bio: "10 yildan buyon yirik korxonalarning marketing va boshqaruv yo‘nalishida, xususan Chortoq mineral water, Samsung Electronics Uzbekistan kabi korxonalarda faoliyat yuritgan. Ahmad Tea Uzbekistan, Impuls tibbiyot instituti, Zahratun supermarketlar tarmog‘i, Najot Nur, Gekto, Tashkent Metal, Mfaktor kabi loyihalarda marketing strategiyalarini tuzgan. Cubic — top menejerlar va biznes egalari hamjamiyati hammuassisi. “Marketing maximum” o‘quv kursi muallifi va mentori. Ayni damda Proactive marketing agentligida kichik va o‘rta bizneslar uchun marketing strategiyalari bilan shug‘ullanadi.",
  },
  {
    name: "Nodirbek Kuzdekov",
    title: "Biznes-trener, konsultant va mentor",
    photo: "/images/mentors/nodirbek-kuzdekov.jpg",
    highlight: "20+ yil tajriba",
    bio: "Ta’lim, savdo, marketing va tizimli boshqaruv sohalarida 20 yildan ortiq tajribaga ega biznes-trener, konsultant va mentor. 6 yildan ortiq Toshkentdagi UNESCO vakolatxonasi ta’lim dasturlarida, 11 yildan ortiq COSCOM (TM “Ucell”) kompaniyasida treyd marketing, korporativ sotuvlar, B2B marketing, xalqaro aloqa va rouming yo‘nalishlarida rahbarlik lavozimlarida ishlagan. 4 yildan ortiq savdo va ishlab chiqarish korxonalari guruhida Tijorat direktori va Ijrochi direktor bo‘lgan. British Embassy, Nestlé, Cisco, Dell, UzAuto, NBU, Hamkorbank, AKFA, Safia, Beeline, Click, Payme, Texnomart va boshqa ko‘plab kompaniyalar bilan hamkorlik qilgan.",
  },
];

export const results = [
  "Keyingi bosqichga chiqish va o‘sish strategiyasi",
  "Aniq mijoz + ishlaydigan marketing",
  "Unikal brend platformasi va pozitsiyasi",
  "Barqaror va prognozli sotuv",
  "Biznesda aniqlik va pul nazorati",
  "Soliq optimallashtirish, yuridik risklar kamayishi, eksportga chiqish",
];

export const nextStage = [
  { text: "Individual Brand akseleratsiya dasturi (1–6 oy)", icon: "bolt" },
  { text: "Invest arena loyihasida qatnashib, investitsiya va imtiyozli moliyalashtirish imkoniyatlari", icon: "key" },
  { text: "Yangi avlod tadbirkorlari loyihasi doirasida Yale, Harvard, London School of Economics kabi top universitetlar dasturida qatnashish imkoniyati", icon: "cap" },
  { text: "Yangi avlod tadbirkorlari hamjamiyatiga qo‘shilish, o‘sish ekotizimiga kirish", icon: "users" },
];

export const pricing = {
  full: 16_000_000,
  grant: 4_800_000,
  grantPercent: 70,
  grantsTotal: 100,
};

export const faq = [
  {
    q: "Dasturda kimlar qatnasha oladi?",
    a: "18–30 yoshdagi, kamida 6 oy faol biznesi mavjud, biznesini o‘stirish va professional boshqarishga o‘tishni istagan tadbirkorlar.",
  },
  {
    q: "Grant qanday beriladi?",
    a: "Saralashdan o‘tgan 30 yoshgacha bo‘lgan tadbirkorlarga Yoshlar tadbirkorligini rivojlantirish jamg‘armasi tomonidan 70% grant beriladi. Grant bilan dastur narxi 4 800 000 so‘m. Grantlar soni cheklangan — 100 ta.",
  },
  {
    q: "Dastur qancha davom etadi va qayerda o‘tadi?",
    a: "Dastur oflayn formatda, 12 kun (2 oy) davom etadi. Andijon — 07.11.2026, Samarqand — 16.11.2026, Nukus — 21.11.2026 dan boshlanadi.",
  },
  {
    q: "Darslar qanday o‘tadi?",
    a: "Mashg‘ulotlarning 70% amaliyotga asoslangan: amaliy mashg‘ulotlar va keyslar. Har bir yo‘nalishda tajribali praktik ekspertlar dars beradi, mentorlar va kuratorlar bilan ishlaysiz.",
  },
  {
    q: "Dasturdan keyin nima bo‘ladi?",
    a: "Eng faol bitiruvchilar Individual Brand akseleratsiya dasturi, Invest arena, imtiyozli moliyalashtirish va Yangi avlod tadbirkorlari loyihasi imkoniyatlaridan foydalanishi mumkin.",
  },
  {
    q: "Ariza qoldirgandan keyin nima bo‘ladi?",
    a: "Mutaxassisimiz siz bilan bog‘lanib, saralash bosqichlari va grant shartlari haqida batafsil ma’lumot beradi.",
  },
];

export const regions = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Buxoro",
  "Farg‘ona",
  "Jizzax",
  "Xorazm",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Qoraqalpog‘iston Respublikasi",
  "Samarqand",
  "Sirdaryo",
  "Surxondaryo",
] as const;

export const turnoverOptions = ["0 – 10 000 $", "10 000 $ – 50 000 $", "50 000 $+"] as const;

export const formatSum = (n: number) => n.toLocaleString("ru-RU").replace(/,/g, " ").replace(/ /g, " ");
