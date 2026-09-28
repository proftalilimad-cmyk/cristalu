import type { Project } from './types'

/**
 * ⚠️ Projets de démonstration.
 * Les visuels sont des rendus d'illustration et les références ne citent aucun
 * client réel : remplacez-les par les chantiers réellement livrés par Cristalu
 * Maroc (photos, lieu, année, description).
 */
export const projects: Project[] = [
  {
    id: 'pr-01',
    slug: 'villa-panoramique',
    title: { fr: 'Villa panoramique', ar: 'فيلا بانورامية' },
    location: { fr: 'Tanger (exemple)', ar: 'طنجة (مثال)' },
    category: 'villas',
    year: '2025',
    summary: {
      fr: "Ouverture complète du séjour sur le bassin par des coulissants aluminium de grande portée, à seuil encastré et montants réduits.",
      ar: 'فتح كامل للصالون على المسبح عبر أنظمة انزلاقية ألمنيوم كبيرة، بعتبة مدمجة وقوائم رفيعة.',
    },
    scope: [
      { fr: 'Coulissants grandes dimensions', ar: 'انزلاقية بمقاسات كبيرة' },
      { fr: 'Fenêtres aluminium RPT', ar: 'نوافذ ألمنيوم بفاصل حراري' },
      { fr: 'Garde-corps verre', ar: 'درابزين زجاجي' },
    ],
    media: {
      src: 'hero-option-1',
      alt: {
        fr: 'Villa contemporaine avec grande baie coulissante aluminium au bord d’un bassin',
        ar: 'فيلا عصرية بواجهة منزلقة كبيرة من الألمنيوم بجانب مسبح',
      },
    },
    gallery: [
      {
        src: 'hero-option-2',
        alt: { fr: 'Séjour lumineux avec menuiseries fines', ar: 'صالون مضيء بنجارة رفيعة' },
      },
      {
        src: 'produit-coulissant',
        alt: { fr: 'Détail du coulissant aluminium', ar: 'تفصيل النظام الانزلاقي' },
      },
    ],
  },
  {
    id: 'pr-02',
    slug: 'residence-contemporaine',
    title: { fr: 'Résidence contemporaine', ar: 'إقامة عصرية' },
    location: { fr: 'Casablanca (exemple)', ar: 'الدار البيضاء (مثال)' },
    category: 'residences',
    year: '2025',
    summary: {
      fr: "Programme résidentiel équipé en fenêtres PVC et aluminium : une trame homogène sur toute la façade, posée par tranches pour suivre le planning du chantier.",
      ar: 'برنامج سكني مجهز بنوافذ PVC وألمنيوم: شبكة متجانسة على كامل الواجهة، بتركيب على مراحل يواكب برنامج الورش.',
    },
    scope: [
      { fr: 'Fenêtres PVC', ar: 'نوافذ PVC' },
      { fr: 'Garde-corps verre', ar: 'درابزين زجاجي' },
      { fr: 'Pose par tranches', ar: 'تركيب على مراحل' },
    ],
    media: {
      src: 'realisation-immeuble',
      alt: {
        fr: 'Immeuble résidentiel moderne avec fenêtres aluminium anthracite',
        ar: 'عمارة سكنية عصرية بنوافذ ألمنيوم رمادية داكنة',
      },
    },
  },
  {
    id: 'pr-03',
    slug: 'facade-tertiaire',
    title: { fr: 'Façade tertiaire', ar: 'واجهة مكتبية' },
    location: { fr: 'Rabat (exemple)', ar: 'الرباط (مثال)' },
    category: 'bureaux',
    year: '2024',
    summary: {
      fr: "Mur-rideau aluminium et vitrage à contrôle solaire pour un immeuble de bureaux : calepinage étudié pour limiter les apports thermiques sans réduire la lumière.",
      ar: 'جدار ستائري من الألمنيوم وزجاج عاكس للحرارة لعمارة مكاتب: توزيع مدروس للحد من الحرارة دون تقليل الإضاءة.',
    },
    scope: [
      { fr: 'Mur-rideau', ar: 'جدار ستائري' },
      { fr: 'Vitrage contrôle solaire', ar: 'زجاج عاكس للحرارة' },
      { fr: 'Étude technique', ar: 'دراسة تقنية' },
    ],
    media: {
      src: 'produit-facade',
      alt: {
        fr: 'Mur-rideau vitré d’un immeuble de bureaux contemporain',
        ar: 'جدار ستائري زجاجي لعمارة مكاتب عصرية',
      },
    },
  },
  {
    id: 'pr-04',
    slug: 'hotel-bord-de-mer',
    title: { fr: 'Hôtel bord de mer', ar: 'فندق على البحر' },
    location: { fr: 'Tanger (exemple)', ar: 'طنجة (مثال)' },
    category: 'commerces',
    year: '2024',
    summary: {
      fr: "Menuiseries aluminium traitées pour l'ambiance saline : quincaillerie protégée, vitrage acoustique côté façade et garde-corps verre sur les balcons.",
      ar: 'نجارة ألمنيوم معالجة لمقاومة الأجواء الملحية: إكسسوارات محمية، زجاج عازل للصوت وواجهات وحواجز زجاجية للشرفات.',
    },
    scope: [
      { fr: 'Traitement bord de mer', ar: 'معالجة للأجواء البحرية' },
      { fr: 'Vitrage acoustique', ar: 'زجاج عازل للصوت' },
      { fr: 'Garde-corps verre', ar: 'درابزين زجاجي' },
    ],
    media: {
      src: 'realisation-hotel',
      alt: {
        fr: 'Façade d’hôtel avec grandes fenêtres aluminium et balcons vitrés',
        ar: 'واجهة فندق بنوافذ ألمنيوم كبيرة وشرفات زجاجية',
      },
    },
  },
  {
    id: 'pr-05',
    slug: 'maison-patio',
    title: { fr: 'Maison patio', ar: 'منزل بفناء' },
    location: { fr: 'Marrakech (exemple)', ar: 'مراكش (مثال)' },
    category: 'architecture',
    year: '2023',
    summary: {
      fr: "Galeries vitrées à profilés fins autour d'un patio : la lumière traverse la maison sans rompre la géométrie existante.",
      ar: 'أروقة زجاجية بقطاعات رفيعة حول فناء داخلي: الضوء يعبر المنزل دون كسر الهندسة القائمة.',
    },
    scope: [
      { fr: 'Profilés fins', ar: 'قطاعات رفيعة' },
      { fr: 'Pièces sur mesure', ar: 'قطع حسب الطلب' },
    ],
    media: {
      src: 'hero-option-2',
      alt: {
        fr: 'Séjour ouvert sur un patio par des menuiseries vitrées fines',
        ar: 'صالون مفتوح على فناء عبر نجارة زجاجية رفيعة',
      },
    },
  },
  {
    id: 'pr-06',
    slug: 'villa-terrasse',
    title: { fr: 'Villa terrasse', ar: 'فيلا بتراس' },
    location: { fr: 'Tétouan (exemple)', ar: 'تطوان (مثال)' },
    category: 'villas',
    year: '2023',
    summary: {
      fr: "Pergola bioclimatique et véranda aluminium pour prolonger la terrasse toute l'année, avec évacuation des eaux intégrée à la structure.",
      ar: 'برغولا بيومناخية وشرفة زجاجية من الألمنيوم لتمديد استعمال التراس طوال السنة، مع تصريف مياه مدمج في الهيكل.',
    },
    scope: [
      { fr: 'Pergola bioclimatique', ar: 'برغولا بيومناخية' },
      { fr: 'Véranda aluminium', ar: 'شرفة زجاجية من الألمنيوم' },
    ],
    media: {
      src: 'produit-veranda',
      alt: {
        fr: 'Pergola aluminium sur la terrasse d’une villa',
        ar: 'برغولا من الألمنيوم على تراس فيلا',
      },
    },
  },
]

export const projectCategories = [
  { id: 'all', label: { fr: 'Tous', ar: 'الكل' } },
  { id: 'villas', label: { fr: 'Villas', ar: 'فيلات' } },
  { id: 'residences', label: { fr: 'Résidences', ar: 'إقامات' } },
  { id: 'commerces', label: { fr: 'Commerces', ar: 'محلات تجارية' } },
  { id: 'bureaux', label: { fr: 'Bureaux', ar: 'مكاتب' } },
  { id: 'architecture', label: { fr: 'Projets architecturaux', ar: 'مشاريع معمارية' } },
] as const
