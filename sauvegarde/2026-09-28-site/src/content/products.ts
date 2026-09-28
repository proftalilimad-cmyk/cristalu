import type { Product } from './types'

export const products: Product[] = [
  {
    id: 'p-01',
    slug: 'fenetres-aluminium',
    category: 'aluminium',
    name: { fr: 'Fenêtres aluminium', ar: 'نوافذ الألمنيوم' },
    tagline: {
      fr: 'Profilés fins, lumière maximale',
      ar: 'قطاعات رفيعة، إضاءة قصوى',
    },
    description: {
      fr: "Des fenêtres à frappe ou oscillo-battantes en aluminium à rupture de pont thermique. Des masses vues réduites pour laisser entrer la lumière, une tenue mécanique durable et un large choix de finitions thermolaquées.",
      ar: 'نوافذ ألمنيوم بمفصلات أو نظام قلاب مع فاصل حراري. قطاعات ظاهرة رفيعة لإدخال أكبر قدر من الضوء، متانة ميكانيكية عالية وتشكيلة واسعة من التشطيبات المطلية حرارياً.',
    },
    features: [
      { fr: 'Rupture de pont thermique', ar: 'فاصل حراري' },
      { fr: 'Double ou triple vitrage', ar: 'زجاج مزدوج أو ثلاثي' },
      { fr: 'Finitions thermolaquées', ar: 'تشطيبات مطلية حرارياً' },
      { fr: 'Quincaillerie renforcée', ar: 'إكسسوارات معززة' },
    ],
    specs: [
      { label: { fr: 'Matériau', ar: 'المادة' }, value: { fr: 'Aluminium', ar: 'ألمنيوم' } },
      {
        label: { fr: 'Ouverture', ar: 'نوع الفتح' },
        value: { fr: 'Frappe / oscillo-battant', ar: 'مفصلي / قلاب' },
      },
      {
        label: { fr: 'Vitrage', ar: 'الزجاج' },
        value: { fr: 'Double, triple, feuilleté', ar: 'مزدوج، ثلاثي، مصفح' },
      },
    ],
    media: {
      src: 'produit-fenetre-aluminium',
      alt: {
        fr: "Fenêtre aluminium anthracite à profilé fin dans un mur blanc contemporain",
        ar: 'نافذة ألمنيوم رمادية داكنة بقطاع رفيع في جدار أبيض عصري',
      },
    },
  },
  {
    id: 'p-02',
    slug: 'fenetres-pvc',
    category: 'pvc',
    name: { fr: 'Fenêtres PVC', ar: 'نوافذ PVC' },
    tagline: { fr: 'Isolation et confort au quotidien', ar: 'عزل وراحة يومية' },
    description: {
      fr: "Des menuiseries PVC multi-chambres offrant un excellent rapport performance/prix : isolation thermique et acoustique, étanchéité durable et entretien minimal, en blanc ou en finition plaxée.",
      ar: 'نجارة PVC متعددة الغرف بأفضل نسبة أداء/سعر: عزل حراري وصوتي، إحكام دائم وصيانة بسيطة، باللون الأبيض أو بتشطيب ملوّن.',
    },
    features: [
      { fr: 'Profilé multi-chambres', ar: 'قطاع متعدد الغرف' },
      { fr: 'Joints d’étanchéité doubles', ar: 'حشوات إحكام مزدوجة' },
      { fr: 'Entretien minimal', ar: 'صيانة بسيطة' },
      { fr: 'Finitions plaxées bois', ar: 'تشطيبات بمظهر الخشب' },
    ],
    specs: [
      { label: { fr: 'Matériau', ar: 'المادة' }, value: { fr: 'PVC', ar: 'PVC' } },
      { label: { fr: 'Chambres', ar: 'الغرف' }, value: { fr: '5 à 6 chambres', ar: '5 إلى 6 غرف' } },
      {
        label: { fr: 'Renforts', ar: 'التقوية' },
        value: { fr: 'Acier galvanisé', ar: 'فولاذ مجلفن' },
      },
    ],
    media: {
      src: 'produit-fenetre-pvc',
      alt: {
        fr: 'Fenêtre PVC blanche à profilé moderne dans un intérieur lumineux',
        ar: 'نافذة PVC بيضاء بقطاع عصري في فضاء داخلي مضيء',
      },
    },
  },
  {
    id: 'p-03',
    slug: 'portes-aluminium',
    category: 'aluminium',
    name: { fr: 'Portes aluminium', ar: 'أبواب الألمنيوم' },
    tagline: { fr: 'La première ligne de votre architecture', ar: 'الواجهة الأولى لعمارتك' },
    description: {
      fr: "Portes d'entrée et portes de service en aluminium : panneaux pleins, vitrages latéraux, poignées barre inox et serrures multipoints. Une entrée qui résiste au temps et au climat marocain.",
      ar: 'أبواب مدخل وأبواب خدمة من الألمنيوم: ألواح كاملة، زجاج جانبي، مقابض من الستانلس وأقفال متعددة النقاط. مدخل يقاوم الزمن والمناخ المغربي.',
    },
    features: [
      { fr: 'Serrure multipoints', ar: 'قفل متعدد النقاط' },
      { fr: 'Panneaux sur mesure', ar: 'ألواح حسب الطلب' },
      { fr: 'Seuil PMR possible', ar: 'عتبة منخفضة عند الطلب' },
      { fr: 'Traitement anticorrosion', ar: 'معالجة ضد التآكل' },
    ],
    specs: [
      {
        label: { fr: 'Usage', ar: 'الاستعمال' },
        value: { fr: 'Entrée, service, local', ar: 'مدخل، خدمة، محل' },
      },
      {
        label: { fr: 'Sécurité', ar: 'الأمان' },
        value: { fr: 'Multipoints, cylindre renforcé', ar: 'متعدد النقاط، أسطوانة معززة' },
      },
    ],
    media: {
      src: 'produit-porte-entree',
      alt: {
        fr: "Porte d'entrée aluminium anthracite d'une villa contemporaine",
        ar: 'باب مدخل من الألمنيوم الرمادي الداكن لفيلا عصرية',
      },
    },
  },
  {
    id: 'p-04',
    slug: 'baies-coulissantes',
    category: 'aluminium',
    name: { fr: 'Baies vitrées coulissantes', ar: 'واجهات زجاجية منزلقة' },
    tagline: { fr: 'Effacer la limite intérieur / extérieur', ar: 'إزالة الحدود بين الداخل والخارج' },
    description: {
      fr: "Coulissants et galandages de grandes dimensions, à seuil encastré et montants centraux réduits. Idéals pour ouvrir un séjour sur une terrasse, un patio ou un jardin.",
      ar: 'أنظمة انزلاقية بأحجام كبيرة، بعتبة مدمجة وقوائم مركزية رفيعة. مثالية لفتح الصالون على الشرفة أو الفناء أو الحديقة.',
    },
    features: [
      { fr: 'Seuil plat encastré', ar: 'عتبة مسطحة مدمجة' },
      { fr: 'Grandes dimensions', ar: 'مقاسات كبيرة' },
      { fr: 'Roulements à charge élevée', ar: 'بكرات تتحمل أوزاناً كبيرة' },
      { fr: 'Version galandage', ar: 'نسخة مخفية داخل الجدار' },
    ],
    specs: [
      {
        label: { fr: 'Configuration', ar: 'التكوين' },
        value: { fr: '2 à 6 vantaux', ar: 'من 2 إلى 6 مصاريع' },
      },
      {
        label: { fr: 'Vitrage', ar: 'الزجاج' },
        value: { fr: 'Feuilleté / contrôle solaire', ar: 'مصفح / عاكس للحرارة' },
      },
    ],
    media: {
      src: 'produit-coulissant',
      alt: {
        fr: 'Grande baie coulissante aluminium ouverte sur une terrasse ensoleillée',
        ar: 'واجهة منزلقة كبيرة من الألمنيوم مفتوحة على شرفة مشمسة',
      },
    },
  },
  {
    id: 'p-05',
    slug: 'portes-fenetres',
    category: 'mixte',
    name: { fr: 'Portes-fenêtres', ar: 'أبواب-نوافذ' },
    tagline: { fr: 'Le passage quotidien vers l’extérieur', ar: 'ممر يومي نحو الخارج' },
    description: {
      fr: "Portes-fenêtres aluminium ou PVC à un ou deux vantaux, avec vitrage isolant et seuil adapté. La solution simple pour les balcons, terrasses et jardins.",
      ar: 'أبواب-نوافذ من الألمنيوم أو PVC بمصراع أو مصراعين، بزجاج عازل وعتبة مناسبة. الحل العملي للشرفات والحدائق.',
    },
    features: [
      { fr: 'Aluminium ou PVC', ar: 'ألمنيوم أو PVC' },
      { fr: 'Vitrage isolant', ar: 'زجاج عازل' },
      { fr: 'Volet roulant intégrable', ar: 'إمكانية دمج ستارة دوارة' },
    ],
    specs: [
      {
        label: { fr: 'Ouverture', ar: 'نوع الفتح' },
        value: { fr: 'Frappe, oscillo-battant', ar: 'مفصلي، قلاب' },
      },
    ],
    media: {
      src: 'hero-option-2',
      alt: {
        fr: 'Porte-fenêtre aluminium donnant sur une terrasse',
        ar: 'باب-نافذة من الألمنيوم يطل على شرفة',
      },
    },
  },
  {
    id: 'p-06',
    slug: 'facades-vitrees',
    category: 'aluminium',
    name: { fr: 'Façades vitrées', ar: 'واجهات زجاجية' },
    tagline: { fr: 'Murs-rideaux et verrières', ar: 'جدران ستائرية وأسقف زجاجية' },
    description: {
      fr: "Murs-rideaux, façades VEC et verrières pour projets tertiaires, hôteliers et résidentiels. Étude technique, calepinage et pose coordonnée avec les autres corps d'état.",
      ar: 'جدران ستائرية وواجهات زجاجية وأسقف زجاجية للمشاريع المكتبية والفندقية والسكنية. دراسة تقنية وتوزيع دقيق وتركيب منسق مع باقي الحرف.',
    },
    features: [
      { fr: 'Trame sur mesure', ar: 'شبكة حسب الطلب' },
      { fr: 'Vitrage contrôle solaire', ar: 'زجاج عاكس للحرارة' },
      { fr: 'Étude technique', ar: 'دراسة تقنية' },
    ],
    specs: [
      {
        label: { fr: 'Systèmes', ar: 'الأنظمة' },
        value: { fr: 'Grille, VEC, verrière', ar: 'شبكي، VEC، سقف زجاجي' },
      },
    ],
    media: {
      src: 'produit-facade',
      alt: {
        fr: 'Façade mur-rideau aluminium et verre reflétant le ciel',
        ar: 'واجهة جدار ستائري من الألمنيوم والزجاج تعكس السماء',
      },
    },
  },
  {
    id: 'p-07',
    slug: 'verandas',
    category: 'aluminium',
    name: { fr: 'Vérandas & pergolas', ar: 'شرفات زجاجية وبرغولات' },
    tagline: { fr: 'Une pièce en plus, toute l’année', ar: 'فضاء إضافي طوال السنة' },
    description: {
      fr: "Vérandas, pergolas bioclimatiques et abris en aluminium : structure calculée, évacuation des eaux intégrée et vitrage adapté à l'ensoleillement marocain.",
      ar: 'شرفات زجاجية وبرغولات بيومناخية ومظلات من الألمنيوم: هيكل محسوب، تصريف مياه مدمج وزجاج مناسب لأشعة الشمس بالمغرب.',
    },
    features: [
      { fr: 'Lames orientables', ar: 'شرائح قابلة للتوجيه' },
      { fr: 'Évacuation intégrée', ar: 'تصريف مدمج' },
      { fr: 'Éclairage en option', ar: 'إنارة اختيارية' },
    ],
    specs: [
      {
        label: { fr: 'Structure', ar: 'الهيكل' },
        value: { fr: 'Aluminium thermolaqué', ar: 'ألمنيوم مطلي حرارياً' },
      },
    ],
    media: {
      src: 'produit-veranda',
      alt: {
        fr: 'Pergola et véranda aluminium anthracite sur une terrasse en pierre',
        ar: 'برغولا وشرفة زجاجية من الألمنيوم على تراس حجري',
      },
    },
  },
  {
    id: 'p-08',
    slug: 'sur-mesure',
    category: 'mixte',
    name: { fr: 'Solutions sur mesure', ar: 'حلول حسب الطلب' },
    tagline: { fr: 'Garde-corps, claustras, pièces spéciales', ar: 'درابزين، حواجز، قطع خاصة' },
    description: {
      fr: "Garde-corps en verre, claustras, brise-soleil, habillages et pièces spéciales dessinées avec l'architecte ou le maître d'ouvrage, puis fabriquées à la cote.",
      ar: 'درابزين زجاجي، حواجز، كاسرات شمس، تلبيسات وقطع خاصة تُصمَّم مع المهندس أو صاحب المشروع ثم تُصنَّع بالمقاس.',
    },
    features: [
      { fr: 'Dessin technique', ar: 'رسم تقني' },
      { fr: 'Prototype possible', ar: 'إمكانية نموذج أولي' },
      { fr: 'Fabrication à la cote', ar: 'تصنيع بالمقاس' },
    ],
    specs: [
      {
        label: { fr: 'Typologies', ar: 'الأنواع' },
        value: { fr: 'Garde-corps, claustra, brise-soleil', ar: 'درابزين، حاجز، كاسر شمس' },
      },
    ],
    media: {
      src: 'produit-garde-corps',
      alt: {
        fr: 'Garde-corps en verre et aluminium sur une terrasse moderne',
        ar: 'درابزين من الزجاج والألمنيوم على شرفة عصرية',
      },
    },
  },
]
