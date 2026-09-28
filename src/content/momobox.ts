import type { Localized, MediaAsset } from './types'

/**
 * MOMO Box — coffre tunnel de volet roulant (« rideau ») en polystyrène
 * haute densité, posé PENDANT LE GROS ŒUVRE au-dessus des ouvertures.
 *
 * Contenu basé sur les supports de communication Cristalu Nord.
 * Les valeurs non communiquées sont explicitement renvoyées vers l'entreprise
 * (« nous consulter ») : rien n'est inventé.
 */

export type MomoBenefit = {
  id: string
  icon: string
  title: Localized
  description: Localized
}

export type MomoStep = {
  index: string
  title: Localized
  description: Localized
}

export type MomoComparison = {
  criterion: Localized
  momo: Localized
  concrete: Localized
  wood: Localized
}

export const momoBox = {
  slug: 'momo-box',
  name: 'MOMO Box',
  category: {
    fr: 'Coffre tunnel de rideau / volet roulant',
    ar: 'صندوق الريدو (الستارة المعدنية)',
  },
  tagline: {
    fr: 'Le coffre du rideau, posé dès le gros œuvre',
    ar: 'صندوق الريدو، يُركَّب منذ مرحلة البناء',
  },
  lead: {
    fr: "Un coffre en polystyrène haute densité qui se monte avec la maçonnerie, au-dessus de l'ouverture. Il loge le tablier du rideau, s'enduit comme le mur et supprime le pont thermique du coffre en béton.",
    ar: 'صندوق من البوليستيرين عالي الكثافة يُركَّب مع البناء فوق الفتحة. يحتضن جسم الريدو، ويُطلى كالجدار، ويُلغي الجسر الحراري للصندوق الخرساني.',
  },
  intro: {
    fr: "Le MOMO Box se pose pendant la construction : il prend la place du coffre traditionnel au-dessus de la fenêtre, avant l'enduit. Une fois le mur fini, le coffre est invisible — seul le rideau apparaît, parfaitement aligné avec la menuiserie.",
    ar: 'يُركَّب MOMO Box أثناء البناء: يأخذ مكان الصندوق التقليدي فوق النافذة قبل الطلاء. وبعد إتمام الجدار يصبح الصندوق غير مرئي — يظهر الريدو وحده في محاذاة تامة مع النجارة.',
  },
  media: {
    hero: {
      src: 'momobox-chantier',
      alt: {
        fr: 'Villa en construction avec coffres MOMO Box en polystyrène posés au-dessus des ouvertures',
        ar: 'فيلا في طور البناء مع صناديق MOMO Box موضوعة فوق الفتحات',
      },
    } as MediaAsset,
    product: {
      src: 'momobox-bloc',
      alt: {
        fr: 'Coffre MOMO Box en polystyrène haute densité, coupe montrant le logement du tablier',
        ar: 'صندوق MOMO Box من البوليستيرين عالي الكثافة، مقطع يُظهر مكان جسم الريدو',
      },
    } as MediaAsset,
    real: {
      src: 'momobox-reel',
      alt: {
        fr: 'Coffre MOMO Box Cristalu en cours de livraison devant un stock de coffres',
        ar: 'صندوق MOMO Box من كريستالو أثناء التسليم أمام مخزون من الصناديق',
      },
    } as MediaAsset,
    install: {
      src: 'momobox-pose-chantier',
      alt: {
        fr: 'Pose du coffre MOMO Box sur la maçonnerie au-dessus d’une ouverture, contrôle au niveau',
        ar: 'تركيب صندوق MOMO Box على البناء فوق فتحة مع المراقبة بميزان الماء',
      },
    } as MediaAsset,
    render: {
      src: 'momobox-enduit',
      alt: {
        fr: 'Application de l’enduit avec treillis sur le coffre MOMO Box',
        ar: 'وضع الطلاء مع الشبكة على صندوق MOMO Box',
      },
    } as MediaAsset,
    finished: {
      src: 'momobox-fini',
      alt: {
        fr: 'Façade terminée : coffre invisible, rideau aluminium en place au-dessus de la baie',
        ar: 'واجهة نهائية: الصندوق غير مرئي والريدو من الألمنيوم في مكانه فوق الفتحة',
      },
    } as MediaAsset,
  },
  benefits: [
    {
      id: 'b-1',
      icon: 'HardHat',
      title: { fr: 'Posé pendant la construction', ar: 'يُركَّب أثناء البناء' },
      description: {
        fr: "Il s'intègre à la maçonnerie au-dessus de l'ouverture, avant l'enduit : plus besoin de coffrage ni de reprise après coup.",
        ar: 'يندمج مع البناء فوق الفتحة قبل الطلاء: دون قوالب ودون إصلاحات لاحقة.',
      },
    },
    {
      id: 'b-2',
      icon: 'Thermometer',
      title: { fr: 'Isolation thermique', ar: 'العزل الحراري' },
      description: {
        fr: 'Le polystyrène haute densité limite le pont thermique du coffre traditionnel en béton, au point le plus sensible de la façade.',
        ar: 'البوليستيرين عالي الكثافة يحدّ من الجسر الحراري للصندوق الخرساني في أكثر نقطة حساسة بالواجهة.',
      },
    },
    {
      id: 'b-3',
      icon: 'Feather',
      title: { fr: 'Léger et résistant', ar: 'خفيف ومقاوم' },
      description: {
        fr: 'Environ 3× plus léger que le bois : il se manipule et se pose à la main, sans engin de levage.',
        ar: 'أخف بحوالي 3 مرات من الخشب: يُحمل ويُركَّب يدوياً دون آليات رفع.',
      },
    },
    {
      id: 'b-4',
      icon: 'Trowel',
      title: { fr: 'Prêt à enduire', ar: 'جاهز للطلاء' },
      description: {
        fr: "Sa surface accroche l'enduit : avec un treillis, la finition est continue avec le mur — et sans fissures comme le plâtre.",
        ar: 'سطحه يتشبث بالطلاء: مع الشبكة يصبح التشطيب متواصلاً مع الجدار — دون تشققات كالجبس.',
      },
    },
    {
      id: 'b-5',
      icon: 'Timer',
      title: { fr: 'Chantier plus rapide', ar: 'ورش أسرع' },
      description: {
        fr: 'Pose en quelques minutes par ouverture, sans temps de séchage de coffrage : le chantier avance.',
        ar: 'تركيب في دقائق لكل فتحة، دون انتظار جفاف القوالب: الورش يتقدم.',
      },
    },
    {
      id: 'b-6',
      icon: 'Wallet',
      title: { fr: 'Prix attractif', ar: 'ثمن مناسب' },
      description: {
        fr: 'Une solution économique pour un rendu professionnel, sur une villa comme sur un immeuble entier.',
        ar: 'حل اقتصادي بنتيجة احترافية، سواء في فيلا أو في عمارة كاملة.',
      },
    },
  ] as MomoBenefit[],
  steps: [
    {
      index: '01',
      title: { fr: 'Mesurez l’ouverture', ar: 'قِس الفتحة' },
      description: {
        fr: "Largeur de la baie, épaisseur du mur et hauteur disponible au-dessus du linteau : ces trois cotes déterminent la référence.",
        ar: 'عرض الفتحة، سُمك الجدار، والارتفاع المتاح فوق العتبة: هذه الأبعاد الثلاثة تحدد المرجع المناسب.',
      },
    },
    {
      index: '02',
      title: { fr: 'Posez sur la maçonnerie', ar: 'ركّبه على البناء' },
      description: {
        fr: 'Le coffre se pose sur un bain de mortier au-dessus de l’ouverture, d’aplomb et de niveau, puis se cale avec la maçonnerie.',
        ar: 'يوضع الصندوق على طبقة من الملاط فوق الفتحة، مستوياً وعمودياً، ثم يُثبَّت مع البناء.',
      },
    },
    {
      index: '03',
      title: { fr: 'Enduisez', ar: 'اطْلِه' },
      description: {
        fr: 'Treillis puis enduit, en continuité avec le mur : le coffre disparaît complètement dans la façade.',
        ar: 'شبكة ثم طلاء في استمرارية مع الجدار: يختفي الصندوق تماماً داخل الواجهة.',
      },
    },
    {
      index: '04',
      title: { fr: 'Installez le rideau', ar: 'ركّب الريدو' },
      description: {
        fr: 'Tablier, coulisses et manœuvre (manuelle ou motorisée) prennent place dans le coffre, alignés avec la menuiserie.',
        ar: 'جسم الريدو والمجاري وطريقة التشغيل (يدوية أو بمحرك) تأخذ مكانها داخل الصندوق في محاذاة النجارة.',
      },
    },
  ] as MomoStep[],
  comparison: [
    {
      criterion: { fr: 'Poids', ar: 'الوزن' },
      momo: { fr: '≈ 3× plus léger que le bois', ar: 'أخف بـ 3 مرات من الخشب' },
      concrete: { fr: 'Très lourd, levage nécessaire', ar: 'ثقيل جداً، يتطلب رفعاً' },
      wood: { fr: 'Lourd, pose à deux', ar: 'ثقيل، يتطلب شخصين' },
    },
    {
      criterion: { fr: 'Pont thermique', ar: 'الجسر الحراري' },
      momo: { fr: 'Fortement réduit', ar: 'مُقلَّص بشكل كبير' },
      concrete: { fr: 'Point faible de la façade', ar: 'نقطة ضعف الواجهة' },
      wood: { fr: 'Variable, sensible à l’humidité', ar: 'متغير، حساس للرطوبة' },
    },
    {
      criterion: { fr: 'Mise en œuvre', ar: 'التنفيذ' },
      momo: { fr: 'Pose directe, sans coffrage', ar: 'تركيب مباشر دون قوالب' },
      concrete: { fr: 'Coffrage, coulage, séchage', ar: 'قوالب، صب، تجفيف' },
      wood: { fr: 'Fixation lourde, ajustements', ar: 'تثبيت ثقيل وتعديلات' },
    },
    {
      criterion: { fr: 'Finition', ar: 'التشطيب' },
      momo: { fr: 'Enduisable, sans fissures', ar: 'قابل للطلاء، دون تشققات' },
      concrete: { fr: 'Reprises fréquentes', ar: 'إصلاحات متكررة' },
      wood: { fr: 'Traitement nécessaire', ar: 'يحتاج معالجة' },
    },
    {
      criterion: { fr: 'Budget', ar: 'الميزانية' },
      momo: { fr: 'Le plus économique', ar: 'الأكثر اقتصاداً' },
      concrete: { fr: 'Main d’œuvre importante', ar: 'يد عاملة كثيرة' },
      wood: { fr: 'Élevé', ar: 'مرتفع' },
    },
  ] as MomoComparison[],
  specs: [
    {
      label: { fr: 'Matériau', ar: 'المادة' },
      value: { fr: 'Polystyrène expansé haute densité', ar: 'بوليستيرين مُمدد عالي الكثافة' },
    },
    {
      label: { fr: 'Fonction', ar: 'الوظيفة' },
      value: { fr: 'Coffre tunnel de rideau / volet roulant', ar: 'صندوق نفقي للريدو' },
    },
    {
      label: { fr: 'Mise en œuvre', ar: 'التنفيذ' },
      value: { fr: 'Pendant le gros œuvre, avant enduit', ar: 'أثناء البناء وقبل الطلاء' },
    },
    { label: { fr: 'Finition', ar: 'التشطيب' }, value: { fr: 'Treillis + enduit, peinture', ar: 'شبكة + طلاء ودهان' } },
    {
      label: { fr: 'Manœuvre du rideau', ar: 'تشغيل الريدو' },
      value: { fr: 'Manuelle ou motorisée', ar: 'يدوي أو بمحرك' },
    },
    {
      label: { fr: 'Dimensions', ar: 'الأبعاد' },
      value: { fr: 'Plusieurs sections et longueurs — nous consulter', ar: 'عدة مقاطع وأطوال — اتصلوا بنا' },
    },
  ],
  faq: [
    {
      q: { fr: 'À quel moment faut-il le poser ?', ar: 'متى يجب تركيبه؟' },
      a: {
        fr: "Pendant le gros œuvre, au moment où l'on monte les murs : le coffre est posé au-dessus de l'ouverture avant l'enduit.",
        ar: 'أثناء البناء عند رفع الجدران: يوضع الصندوق فوق الفتحة قبل الطلاء.',
      },
    },
    {
      q: { fr: 'Remplace-t-il le linteau ?', ar: 'هل يعوّض العتبة الحاملة؟' },
      a: {
        fr: "Non. Le MOMO Box est un coffre, pas un élément porteur : la structure (linteau / chaînage) reste calculée par votre BET selon la portée. Demandez-nous la référence adaptée à votre configuration.",
        ar: 'لا. MOMO Box صندوق وليس عنصراً حاملاً: البنية (العتبة/الحزام) تبقى من اختصاص مكتب الدراسات حسب البحر. اسألونا عن المرجع المناسب لحالتكم.',
      },
    },
    {
      q: { fr: 'Le coffre est-il visible après finition ?', ar: 'هل يظهر الصندوق بعد التشطيب؟' },
      a: {
        fr: 'Non : après treillis, enduit et peinture, il fait corps avec le mur. Seul le rideau reste apparent.',
        ar: 'لا: بعد الشبكة والطلاء والدهان يصبح جزءاً من الجدار. يبقى الريدو وحده ظاهراً.',
      },
    },
    {
      q: { fr: 'Compatible avec un rideau motorisé ?', ar: 'هل يتوافق مع ريدو بمحرك؟' },
      a: {
        fr: 'Oui, à condition de prévoir le passage de l’alimentation avant enduit. Précisez-le lors de la commande.',
        ar: 'نعم، بشرط توقّع ممر التغذية الكهربائية قبل الطلاء. يُرجى ذكر ذلك عند الطلب.',
      },
    },
    {
      q: { fr: 'Livrez-vous les chantiers en quantité ?', ar: 'هل تزوّدون الأوراش بكميات؟' },
      a: {
        fr: 'Oui : villas, immeubles et promotions. Envoyez le tableau des ouvertures, nous chiffrons l’ensemble.',
        ar: 'نعم: فيلات وعمارات ومشاريع عقارية. أرسلوا جدول الفتحات ونقوم بتسعير المجموع.',
      },
    },
  ],
  /** Bandeau promotionnel — passer `active` à false pour le masquer. */
  promo: {
    active: true,
    label: { fr: 'Offre en cours', ar: 'عرض ساري' },
    text: {
      fr: 'Remise sur le coffre MOMO Box — stocks limités.',
      ar: 'تخفيض على صندوق MOMO Box — الكميات محدودة.',
    },
  },
}
