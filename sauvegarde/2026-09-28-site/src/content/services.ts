import type { Material, ProcessStep, Service } from './types'

export const qualities: Service[] = [
  {
    id: 'q-01',
    icon: 'Gem',
    title: { fr: 'Qualité', ar: 'الجودة' },
    description: {
      fr: 'Des matériaux et finitions sélectionnés avec exigence.',
      ar: 'مواد وتشطيبات مختارة بدقة وصرامة.',
    },
  },
  {
    id: 'q-02',
    icon: 'Ruler',
    title: { fr: 'Précision', ar: 'الدقة' },
    description: {
      fr: 'Des installations réalisées avec soin et précision.',
      ar: 'تركيبات منجزة بعناية ودقة.',
    },
  },
  {
    id: 'q-03',
    icon: 'Thermometer',
    title: { fr: 'Performance', ar: 'الأداء' },
    description: {
      fr: 'Isolation thermique et acoustique adaptée aux besoins du projet.',
      ar: 'عزل حراري وصوتي يناسب حاجيات المشروع.',
    },
  },
  {
    id: 'q-04',
    icon: 'PencilRuler',
    title: { fr: 'Sur mesure', ar: 'حسب الطلب' },
    description: {
      fr: 'Des solutions adaptées aux dimensions et contraintes architecturales.',
      ar: 'حلول تتكيف مع الأبعاد والإكراهات المعمارية.',
    },
  },
]

export const services: Service[] = [
  {
    id: 's-01',
    icon: 'DraftingCompass',
    title: { fr: 'Étude & conception', ar: 'الدراسة والتصميم' },
    description: {
      fr: "Lecture des plans, choix des systèmes, calepinage et dessins techniques avant fabrication.",
      ar: 'قراءة التصاميم، اختيار الأنظمة، التوزيع والرسوم التقنية قبل التصنيع.',
    },
  },
  {
    id: 's-02',
    icon: 'Factory',
    title: { fr: 'Fabrication', ar: 'التصنيع' },
    description: {
      fr: "Coupe, usinage, assemblage et vitrage des menuiseries aux cotes relevées sur le chantier.",
      ar: 'القص والتشكيل والتركيب والتزجيج حسب المقاسات المأخوذة في الورش.',
    },
  },
  {
    id: 's-03',
    icon: 'Wrench',
    title: { fr: 'Pose & installation', ar: 'التركيب' },
    description: {
      fr: "Mise en œuvre, calfeutrement, réglages et contrôle du fonctionnement de chaque ouvrant.",
      ar: 'التنفيذ، الإحكام، الضبط ومراقبة اشتغال كل فتحة.',
    },
  },
  {
    id: 's-04',
    icon: 'LifeBuoy',
    title: { fr: 'Suivi & maintenance', ar: 'المتابعة والصيانة' },
    description: {
      fr: 'Réglages après livraison, remplacement de pièces et entretien des ouvrages posés.',
      ar: 'ضبط بعد التسليم، تعويض القطع وصيانة المنشآت المركبة.',
    },
  },
]

export const processSteps: ProcessStep[] = [
  {
    id: 'st-1',
    index: '01',
    title: { fr: 'Étude du projet', ar: 'دراسة المشروع' },
    description: {
      fr: "Analyse des plans, de l'orientation, des contraintes techniques et du budget.",
      ar: 'تحليل التصاميم والاتجاه والإكراهات التقنية والميزانية.',
    },
  },
  {
    id: 'st-2',
    index: '02',
    title: { fr: 'Conseil et conception', ar: 'الاستشارة والتصميم' },
    description: {
      fr: 'Choix des systèmes, des vitrages, des finitions et des options de manœuvre.',
      ar: 'اختيار الأنظمة والزجاج والتشطيبات وخيارات التشغيل.',
    },
  },
  {
    id: 'st-3',
    index: '03',
    title: { fr: 'Prise de mesures', ar: 'أخذ القياسات' },
    description: {
      fr: 'Relevé précis sur site, vérification des aplombs, des seuils et des réservations.',
      ar: 'قياس دقيق في الموقع، التحقق من الاستقامة والعتبات والفتحات.',
    },
  },
  {
    id: 'st-4',
    index: '04',
    title: { fr: 'Fabrication', ar: 'التصنيع' },
    description: {
      fr: 'Coupe, usinage, assemblage et vitrage en atelier, avec contrôle dimensionnel.',
      ar: 'القص والتشكيل والتركيب والتزجيج في الورشة مع مراقبة الأبعاد.',
    },
  },
  {
    id: 'st-5',
    index: '05',
    title: { fr: 'Installation', ar: 'التركيب' },
    description: {
      fr: 'Pose, fixation, étanchéité et raccords soignés avec le gros œuvre.',
      ar: 'التركيب والتثبيت والإحكام والوصلات المتقنة مع البناء.',
    },
  },
  {
    id: 'st-6',
    index: '06',
    title: { fr: 'Contrôle et finition', ar: 'المراقبة والتشطيب' },
    description: {
      fr: 'Réglages, essais d’ouverture, nettoyage et remise du dossier au client.',
      ar: 'الضبط واختبارات الفتح والتنظيف وتسليم الملف للزبون.',
    },
  },
]

export const materials: Material[] = [
  {
    id: 'aluminium',
    name: { fr: 'Aluminium', ar: 'الألمنيوم' },
    intro: {
      fr: "Rigide et léger, l'aluminium autorise de grandes dimensions avec des profilés très fins. La rupture de pont thermique lui apporte la performance d'isolation.",
      ar: 'صلب وخفيف، يسمح الألمنيوم بمقاسات كبيرة مع قطاعات رفيعة جداً. ويمنحه الفاصل الحراري أداءً عالياً في العزل.',
    },
    points: [
      { fr: 'Grandes portées, masses vues réduites', ar: 'مسافات كبيرة وقطاعات ظاهرة رفيعة' },
      { fr: 'Rupture de pont thermique', ar: 'فاصل حراري' },
      { fr: 'Thermolaquage toutes teintes', ar: 'طلاء حراري بجميع الألوان' },
      { fr: 'Recyclable, durable', ar: 'قابل لإعادة التدوير ومعمّر' },
    ],
    metrics: [
      { label: { fr: 'Masse vue', ar: 'القطاع الظاهر' }, value: '≈ 55 mm' },
      { label: { fr: 'Teintes RAL', ar: 'ألوان RAL' }, value: '200+' },
      { label: { fr: 'Recyclabilité', ar: 'إعادة التدوير' }, value: '100%' },
    ],
    fallbackImage: {
      src: 'matiere-aluminium',
      alt: {
        fr: 'Profilés aluminium extrudés : barres longues et sections coupées',
        ar: 'قطاعات ألمنيوم مبثوقة: قضبان طويلة ومقاطع مقطوعة',
      },
    },
  },
  {
    id: 'pvc',
    name: { fr: 'PVC', ar: 'PVC' },
    intro: {
      fr: 'Le PVC multi-chambres isole naturellement, ne demande presque pas d’entretien et reste la solution la plus accessible pour les projets résidentiels.',
      ar: 'يوفر PVC متعدد الغرف عزلاً طبيعياً، ولا يتطلب صيانة تُذكر، ويبقى الحل الأكثر اقتصادية للمشاريع السكنية.',
    },
    points: [
      { fr: 'Isolation thermique naturelle', ar: 'عزل حراري طبيعي' },
      { fr: '5 à 6 chambres d’air', ar: '5 إلى 6 غرف هوائية' },
      { fr: 'Renforts acier intégrés', ar: 'تقوية فولاذية مدمجة' },
      { fr: 'Entretien minimal', ar: 'صيانة بسيطة' },
    ],
    metrics: [
      { label: { fr: 'Chambres', ar: 'الغرف' }, value: '5–6' },
      { label: { fr: 'Joints', ar: 'الحشوات' }, value: '2–3' },
      { label: { fr: 'Entretien', ar: 'الصيانة' }, value: 'Minimal' },
    ],
    fallbackImage: {
      src: 'matiere-pvc',
      alt: {
        fr: 'Profilés PVC multi-chambres avec renfort acier et joint EPDM',
        ar: 'قطاعات PVC متعددة الغرف مع تقوية فولاذية وحشية EPDM',
      },
    },
  },
  {
    id: 'verre',
    name: { fr: 'Verre', ar: 'الزجاج' },
    intro: {
      fr: "Le vitrage décide du confort réel : apports solaires, isolation acoustique, sécurité. Il se choisit façade par façade, selon l'orientation.",
      ar: 'الزجاج هو ما يحدد الراحة الفعلية: الحرارة الشمسية، العزل الصوتي، الأمان. ويُختار واجهة بواجهة حسب الاتجاه.',
    },
    points: [
      { fr: 'Double / triple vitrage', ar: 'زجاج مزدوج / ثلاثي' },
      { fr: 'Feuilleté de sécurité', ar: 'مصفح للأمان' },
      { fr: 'Contrôle solaire', ar: 'تحكم في الأشعة الشمسية' },
      { fr: 'Acoustique renforcée', ar: 'عزل صوتي معزز' },
    ],
    metrics: [
      { label: { fr: 'Épaisseurs', ar: 'السماكات' }, value: '4–44 mm' },
      { label: { fr: 'Lame d’air', ar: 'الفراغ الهوائي' }, value: '12–20 mm' },
      { label: { fr: 'Options', ar: 'الخيارات' }, value: '6+' },
    ],
    fallbackImage: {
      src: 'matiere-verre',
      alt: {
        fr: 'Vitrage isolant : deux verres, intercalaire et scellement',
        ar: 'زجاج عازل: لوحان، فاصل ومادة الإحكام',
      },
    },
  },
]
