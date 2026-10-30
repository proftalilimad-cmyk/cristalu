/* =========================================================
   دوروسي — بيانات تجريبية للموقع (أقسام، دورات، دروس، أساتذة)
   محتوى نموذجي مكتوب خصيصًا لهذه النسخة — ليس منقولًا من أي منصة.
   ========================================================= */
window.DATA = (function () {
  "use strict";

  const subjects = [
    { id: "math",       name: "الرياضيات",          glyph: "∑",  color: "#2f6df6", tint: "#e9f0ff" },
    { id: "physics",    name: "الفيزياء",            glyph: "⚛",  color: "#7b5cf0", tint: "#efeaff" },
    { id: "science",    name: "علوم الطبيعة والحياة", glyph: "⚗",  color: "#12a07a", tint: "#e6f7f1" },
    { id: "arabic",     name: "اللغة العربية",        glyph: "ض",  color: "#c96a1b", tint: "#fdf0e3" },
    { id: "french",     name: "اللغة الفرنسية",       glyph: "Fr", color: "#2b7fbf", tint: "#e8f3fb" },
    { id: "english",    name: "اللغة الإنجليزية",     glyph: "En", color: "#0f8b8d", tint: "#e4f6f6" },
    { id: "history",    name: "التاريخ والجغرافيا",   glyph: "⌛", color: "#a4552f", tint: "#fbece5" },
    { id: "philosophy", name: "الفلسفة",             glyph: "φ",  color: "#6b4fa8", tint: "#efeafb" }
  ];

  const teachers = [
    { id: "t1", name: "أ. سمير بن عيسى",  subject: "الرياضيات",        initials: "س ع", gradient: ["#1d4ed8", "#0e9488"], rating: 4.9, students: 12800, years: 14 },
    { id: "t2", name: "أ. نبيل حمداوي",   subject: "الفيزياء",          initials: "ن ح", gradient: ["#6d28d9", "#4338ca"], rating: 4.8, students: 9400,  years: 11 },
    { id: "t3", name: "أ. سعاد مرزوق",    subject: "علوم الطبيعة",      initials: "س م", gradient: ["#0f766e", "#16a34a"], rating: 4.9, students: 7600,  years: 9  },
    { id: "t4", name: "أ. كريم بلحاج",    subject: "اللغة العربية",     initials: "ك ب", gradient: ["#b45309", "#dc2626"], rating: 4.7, students: 10250, years: 16 },
    { id: "t5", name: "أ. ليلى سعدي",     subject: "اللغة الفرنسية",    initials: "ل س", gradient: ["#0369a1", "#0891b2"], rating: 4.8, students: 5300,  years: 8  },
    { id: "t6", name: "أ. يوسف قاسمي",    subject: "الفلسفة",           initials: "ي ق", gradient: ["#6d28d9", "#a21caf"], rating: 4.7, students: 6100,  years: 12 }
  ];

  const courses = [
    {
      slug: "math-3as",
      title: "الرياضيات — الثالثة ثانوي (بكالوريا)",
      subject: "math",
      teacher: "t1",
      level: "3 ثانوي · بكالوريا",
      badge: "الأكثر طلبًا",
      desc: "برنامج كامل للبكالوريا: الدوال، النهايات، الاشتقاق، الأعداد المركبة، الاحتمالات… مع تمارين وحلول مفصّلة بكالوريا من 2016 إلى 2025.",
      price: 3500, oldPrice: 5000, free: false,
      rating: 4.9, reviews: 1284, students: 8640, hours: 46,
      gradient: ["#1e3a8a", "#0e7490"],
      progress: 42,
      chapters: ["الدوال والنهايات", "الاشتقاق", "الدوال الأسية واللوغاريتمية", "المتتاليات", "الأعداد المركبة", "الاحتمالات"],
      lessons: [
        { title: "تمهيد: خريطة برنامج البكالوريا في الرياضيات", duration: "06:20", free: true,  type: "video" },
        { title: "الدوال العددية: مفاهيم أساسية وحالات الدراسة", duration: "24:15", free: true,  type: "video" },
        { title: "النهايات والاستمرارية", duration: "31:40", free: false, type: "video" },
        { title: "الاشتقاق وتطبيقاته في دراسة الدوال", duration: "28:05", free: false, type: "video" },
        { title: "الدوال الأسية واللوغاريتمية", duration: "35:12", free: false, type: "video" },
        { title: "المتتاليات العددية", duration: "26:48", free: false, type: "video" },
        { title: "الحسابيات في Z", duration: "22:30", free: false, type: "video" },
        { title: "الأعداد المركبة (الجزء الأول)", duration: "33:20", free: false, type: "video" },
        { title: "الأعداد المركبة (الجزء الثاني) + تمارين", duration: "29:10", free: false, type: "video" },
        { title: "الاحتمالات", duration: "19:55", free: false, type: "video" },
        { title: "ملخص الدرس + تمارين محلة (PDF)", duration: "—", free: false, type: "pdf" },
        { title: "حل بكالوريا 2024 — رياضيات", duration: "55:00", free: false, type: "video" }
      ]
    },
    {
      slug: "physics-3as",
      title: "الفيزياء — الثالثة ثانوي (بكالوريا)",
      subject: "physics",
      teacher: "t2",
      level: "3 ثانوي · بكالوريا",
      badge: "جديد",
      desc: "الميكانيك، الكهرباء، التحولات النووية والنواسات… شرح مبسّط مع تمارين تطبيقية وتسجيلات للتجارب.",
      price: 3200, oldPrice: 4200, free: false,
      rating: 4.8, reviews: 932, students: 6120, hours: 38,
      gradient: ["#4c1d95", "#1d4ed8"],
      progress: 18,
      chapters: ["المتابعة الزمنية", "التحولات النووية", "الميكانيك", "الكهرباء"],
      lessons: [
        { title: "تمهيد: كيف تدرس الفيزياء للبكالوريا؟", duration: "08:10", free: true,  type: "video" },
        { title: "المتابعة الزمنية لتحول كيميائي", duration: "27:30", free: false, type: "video" },
        { title: "التحولات النووية والتفتت الإشعاعي", duration: "30:05", free: false, type: "video" },
        { title: "الميكانيك: قوانين نيوتن", duration: "34:20", free: false, type: "video" },
        { title: "النواس المرن والنواس البسيط", duration: "25:15", free: false, type: "video" },
        { title: "الكهرباء: RC و RL", duration: "29:40", free: false, type: "video" },
        { title: "ملخصات وتمارين محلولة (PDF)", duration: "—", free: false, type: "pdf" }
      ]
    },
    {
      slug: "science-3as",
      title: "علوم الطبيعة والحياة — بكالوريا",
      subject: "science",
      teacher: "t3",
      level: "3 ثانوي · بكالوريا",
      badge: "",
      desc: "التركيب الضوئي، التنفس، المناعة، الاتصال العصبي والهرموني، مع رسومات وخرائط ذهنية للحفظ السريع.",
      price: 3000, oldPrice: 4000, free: false,
      rating: 4.9, reviews: 1105, students: 7310, hours: 34,
      gradient: ["#065f46", "#0d9488"],
      progress: 67,
      chapters: ["التركيب الضوئي", "المناعة", "الاتصال العصبي", "التنظيم الهرموني"],
      lessons: [
        { title: "تمهيد: منهجية الإجابة في العلوم", duration: "07:45", free: true,  type: "video" },
        { title: "التركيب الضوئي: المرحلتان الكيميائيتان", duration: "32:10", free: false, type: "video" },
        { title: "التنفس والتخمر", duration: "21:25", free: false, type: "video" },
        { title: "المناعة الخلطية والخلوية", duration: "36:00", free: false, type: "video" },
        { title: "الاتصال العصبي", duration: "28:35", free: false, type: "video" },
        { title: "الخرائط الذهنية (PDF)", duration: "—", free: false, type: "pdf" }
      ]
    },
    {
      slug: "arabic-3as",
      title: "اللغة العربية وآدابها — بكالوريا",
      subject: "arabic",
      teacher: "t4",
      level: "3 ثانوي · بكالوريا",
      badge: "",
      desc: "الشعر الحديث، القصة، المقال، النصوص الفلسفية… مع تقنيات تحليل النص وبناء المقالة الأدبية.",
      price: 2500, oldPrice: 3500, free: false,
      rating: 4.7, reviews: 764, students: 5480, hours: 28,
      gradient: ["#9a3412", "#b91c1c"],
      progress: 25,
      chapters: ["الشعر", "النثر", "المقال", "تقنيات التحرير"],
      lessons: [
        { title: "منهجية تحليل النص الأدبي", duration: "18:40", free: true,  type: "video" },
        { title: "الشعر السياسي في العصر الحديث", duration: "24:10", free: false, type: "video" },
        { title: "المقالة الأدبية", duration: "20:55", free: false, type: "video" },
        { title: "بناء المقالة: خطة ونماذج", duration: "26:30", free: false, type: "video" },
        { title: "نماذج مواضيع بكالوريا محلولة (PDF)", duration: "—", free: false, type: "pdf" }
      ]
    },
    {
      slug: "math-4am",
      title: "الرياضيات — الرابعة متوسط (BEM)",
      subject: "math",
      teacher: "t1",
      level: "4 متوسط · BEM",
      badge: "مجانية",
      desc: "تحضير كامل لشهادة التعليم المتوسط: الحساب الحرفي، المعادلات، الدوال، الهندسة والأحصاء.",
      price: 0, oldPrice: 0, free: true,
      rating: 4.8, reviews: 2310, students: 15300, hours: 22,
      gradient: ["#1d4ed8", "#7c3aed"],
      progress: 88,
      chapters: ["الحساب الحرفي", "المعادلات", "الدوال", "الهندسة", "الأحصاء"],
      lessons: [
        { title: "الحساب الحرفي: القواعد الأساسية", duration: "16:20", free: true, type: "video" },
        { title: "المعادلات والمتراجحات", duration: "19:05", free: true, type: "video" },
        { title: "الدوال الخطية والتآلفية", duration: "22:15", free: true, type: "video" },
        { title: "نظرية طاليس وفيثاغورس", duration: "18:40", free: true, type: "video" },
        { title: "الأحصاء والمتوسطات", duration: "14:50", free: true, type: "video" },
        { title: "ملخص BEM + مواضيع سابقة (PDF)", duration: "—", free: true, type: "pdf" }
      ]
    },
    {
      slug: "english-2as",
      title: "اللغة الإنجليزية — الثانية ثانوي",
      subject: "english",
      teacher: "t5",
      level: "2 ثانوي",
      badge: "",
      desc: "Grammar, writing and comprehension عبر وحدات مبرمجة مع تمارين تصحيحية وملفات صوتية للاستماع.",
      price: 2200, oldPrice: 2800, free: false,
      rating: 4.6, reviews: 512, students: 3210, hours: 18,
      gradient: ["#0f766e", "#0ea5e9"],
      progress: 0,
      chapters: ["Grammar", "Writing", "Listening", "Vocabulary"],
      lessons: [
        { title: "Unit 1: Getting through — Grammar", duration: "21:10", free: true,  type: "video" },
        { title: "Writing a paragraph: structure", duration: "17:35", free: false, type: "video" },
        { title: "Reported speech & conditionals", duration: "23:05", free: false, type: "video" },
        { title: "Listening practice + transcript", duration: "15:40", free: false, type: "video" }
      ]
    },
    {
      slug: "philo-3as",
      title: "الفلسفة — الثالثة ثانوي",
      subject: "philosophy",
      teacher: "t6",
      level: "3 ثانوي · بكالوريا",
      badge: "",
      desc: "المشكلات الفلسفية الكبرى، منهجية المقالة الجدلية والاستقصائية، ونماذج محلولة لمواضيع البكالوريا.",
      price: 2400, oldPrice: 3000, free: false,
      rating: 4.7, reviews: 431, students: 2870, hours: 16,
      gradient: ["#5b21b6", "#be185d"],
      progress: 0,
      chapters: ["المقالة", "المشكلات", "النماذج"],
      lessons: [
        { title: "منهجية المقالة الجدلية", duration: "20:00", free: true,  type: "video" },
        { title: "المقالة الاستقصائية", duration: "18:25", free: false, type: "video" },
        { title: "العقل والواقع", duration: "22:40", free: false, type: "video" },
        { title: "نماذج مواضيع محلولة (PDF)", duration: "—", free: false, type: "pdf" }
      ]
    },
    {
      slug: "history-3as",
      title: "التاريخ والجغرافيا — الثالثة ثانوي",
      subject: "history",
      teacher: "t4",
      level: "3 ثانوي · بكالوريا",
      badge: "",
      desc: "مفاصل التاريخ المعاصر وخرائط الجغرافيا، مع تقنيات التعامل مع السندات والوثائق التاريخية.",
      price: 2000, oldPrice: 2600, free: false,
      rating: 4.5, reviews: 298, students: 1990, hours: 14,
      gradient: ["#92400e", "#b45309"],
      progress: 0,
      chapters: ["التاريخ", "الجغرافيا", "السندات"],
      lessons: [
        { title: "منهجية تحليل الوثيقة التاريخية", duration: "16:15", free: true,  type: "video" },
        { title: "العلاقات الدولية بعد 1945", duration: "24:50", free: false, type: "video" },
        { title: "المبادلات والتنقلات", duration: "19:30", free: false, type: "video" }
      ]
    }
  ];

  const exams = [
    { id: "e1", title: "اختبار شامل: الدوال والنهايات", subject: "math",       level: "3 ثانوي", questions: 20, duration: 45, difficulty: "صعب",     attempts: 3120 },
    { id: "e2", title: "التمارين التطبيقية: الاشتقاق",  subject: "math",       level: "3 ثانوي", questions: 12, duration: 30, difficulty: "متوسط",   attempts: 5210 },
    { id: "e3", title: "التحولات النووية",              subject: "physics",    level: "3 ثانوي", questions: 15, duration: 25, difficulty: "متوسط",   attempts: 2740 },
    { id: "e4", title: "المناعة: اختبار سريع",          subject: "science",    level: "3 ثانوي", questions: 10, duration: 15, difficulty: "سهل",     attempts: 4310 },
    { id: "e5", title: "BEM تجريبي — رياضيات",          subject: "math",       level: "4 متوسط", questions: 18, duration: 60, difficulty: "صعب",     attempts: 8900 },
    { id: "e6", title: "English check-up",              subject: "english",    level: "2 ثانوي", questions: 25, duration: 30, difficulty: "سهل",     attempts: 1620 },
    { id: "e7", title: "منهجية المقالة الفلسفية",       subject: "philosophy", level: "3 ثانوي", questions: 8,  duration: 20, difficulty: "متوسط",   attempts: 980  },
    { id: "e8", title: "التاريخ: تحليل الوثائق",        subject: "history",    level: "3 ثانوي", questions: 14, duration: 25, difficulty: "متوسط",   attempts: 745  }
  ];

  const sessions = [
    { id: "s1", title: "حصة مباشرة: تطبيقات الاشتقاق",       subject: "math",    teacher: "أ. سمير بن عيسى", day: "2026-11-02", time: "18:00", seats: 120, joined: 96 },
    { id: "s2", title: "مراجعة: الكهرباء RC و RL",           subject: "physics", teacher: "أ. نبيل حمداوي",  day: "2026-11-03", time: "19:30", seats: 100, joined: 74 },
    { id: "s3", title: "حل موضوع بكالوريا: علوم الطبيعة",    subject: "science", teacher: "أ. سعاد مرزوق",    day: "2026-11-05", time: "17:00", seats: 150, joined: 58 },
    { id: "s4", title: "ورشة: المقالة الأدبية",               subject: "arabic",  teacher: "أ. كريم بلحاج",    day: "2026-11-06", time: "20:00", seats: 80,  joined: 41 }
  ];

  const testimonials = [
    { name: "أمينة ب.", role: "باكالوريا 2025 — معدل 17.85", text: "الدروس مرتبة جدًا والتطبيقات ساعدوني نراجع بسرعة. النتيجة: معدل فاق توقعاتي.", initials: "أ ب", gradient: ["#0e7490", "#0d9488"] },
    { name: "إلياس م.", role: "باكالوريا 2025 — معدل 16.40", text: "الحصص المباشرة كانت الفرق بالنسبة لي، نطرح السؤال ويجاوبوني في نفس اللحظة.", initials: "إ م", gradient: ["#1d4ed8", "#4f46e5"] },
    { name: "نور الهدى ع.", role: "BEM 2025 — معدل 18.10",   text: "الرياضيات كانت صعبة عليا، ومن بعد الدروس المجانية بديت نفهم ونحب المادة.", initials: "ن ع", gradient: ["#b45309", "#dc2626"] }
  ];

  const student = {
    name: "أمين",
    fullName: "أمين بلقاسم",
    initials: "أ ب",
    level: "3 ثانوي · بكالوريا",
    streak: 12,
    points: 1840,
    rank: 37,
    weeklyGoal: 10,
    weeklyDone: 7
  };

  return { subjects, teachers, courses, exams, sessions, testimonials, student };
})();
