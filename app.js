/* =========================================================
   دوروسي — منطق الموقع (هيدر، فوتر، عرض البيانات، تفاعلات)
   ========================================================= */
(function () {
  "use strict";

  const D = window.DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const params = new URLSearchParams(location.search);

  const subjectOf = (id) => D.subjects.find((s) => s.id === id) || D.subjects[0];
  const teacherOf = (id) => D.teachers.find((t) => t.id === id) || D.teachers[0];
  const courseOf = (slug) => D.courses.find((c) => c.slug === slug) || D.courses[0];

  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const money = (n) => (n === 0 ? "مجانًا" : fmt(n) + " دج");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.6V12l3.2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8.4" r="3.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2.9 19.4c.5-3.2 3-5.1 6.1-5.1s5.6 1.9 6.1 5.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 5.4a3.4 3.4 0 010 6.4M18.3 14.7c2 .6 3.6 2.2 4 4.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9L12 3.6z" fill="currentColor"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.6" y="10.4" width="14.8" height="10" rx="2.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.3 10.4V8a3.7 3.7 0 117.4 0v2.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.6" y="5.4" width="16.8" height="15" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.8 10h16.4M8.2 3.4v3.6M15.8 3.4v3.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M16 16l4.4 4.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 3.4h7.2l4 4v13.2H6.4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13.4 3.6v4h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 13h1.6a1.4 1.4 0 010 2.8H9V13zm0 2.8v2.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.6c3.2-1.2 5.3-.6 8 1v13c-2.7-1.6-4.8-2.2-8-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M20 5.6c-3.2-1.2-5.3-.6-8 1v13c2.7-1.6 4.8-2.2 8-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    live: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M7.4 7.4a6.5 6.5 0 000 9.2M16.6 16.6a6.5 6.5 0 000-9.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M4.4 4.4a10.8 10.8 0 000 15.2M19.6 19.6a10.8 10.8 0 000-15.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" opacity=".55"/></svg>',
    award: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9.4" r="5.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.2 14.4L7.8 21l4.2-2.2 4.2 2.2-1.4-6.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
    fire: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s5.6 4.4 5.6 9.2A5.6 5.6 0 0112 18a5.6 5.6 0 01-5.6-5.8C6.4 9 9 6.6 9 6.6s.2 2.6 1.6 3.4C11.4 8.4 12 3 12 3z" fill="currentColor"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    googleplay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.6 2.3z" fill="#00d3ff"/><path d="M16.2 15.7l-3.2-3.2v-.2l3.2-3.2.1.1 3.8 2.2c1.1.6 1.1 1.6 0 2.2l-3.9 2.1z" fill="#ffd400"/><path d="M16.3 15.6L13 12.4 3.6 21.7c.4.3 1 .3 1.6 0l11.1-6.1" fill="#ff3a44"/><path d="M16.3 8.9L5.2 2.8c-.6-.3-1.2-.3-1.6 0L13 12.1l3.3-3.2z" fill="#00e07a"/></svg>'
  };

  const LOGO = `<span class="logo__mark" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M32 14l20 9-20 9-20-9 20-9z" fill="currentColor" opacity=".95"/><path d="M17.5 29.5v11.2c0 5.6 6.5 9.1 14.5 9.1s14.5-3.5 14.5-9.1V29.5" fill="none" stroke="currentColor" stroke-width="4.6" stroke-linecap="round"/></svg></span>`;

  /* ============================ Header / footer ============================ */

  const NAV = [
    { href: "index.html", label: "الرئيسية", key: "home" },
    { href: "courses.html", label: "المواد والدروس", key: "courses" },
    { href: "exams.html", label: "الاختبارات", key: "exams" },
    { href: "dashboard.html", label: "لوحتي", key: "dashboard" }
  ];

  function renderHeader() {
    const host = $("#site-header");
    if (!host) return;
    const page = document.body.dataset.page || "";
    const user = window.Auth ? window.Auth.getUser() : null;
    host.innerHTML = `
      <header class="site-header" id="site-header-bar">
        <div class="container header__inner">
          <a class="logo" href="index.html" aria-label="دوروسي — الصفحة الرئيسية">
            ${LOGO}
            <span class="logo__text"><strong>دوروسي</strong><small>منصة التعليم عن بعد</small></span>
          </a>

          <nav class="nav" id="main-nav" aria-label="التنقل الرئيسي">
            ${NAV.map((n) => `<a href="${n.href}" class="${page === n.key ? "is-active" : ""}">${n.label}</a>`).join("")}
            <a class="nav__auth" href="sign-in.html">تسجيل الدخول</a>
          </nav>

          <div class="header__actions">
            ${user ? `
              <div class="user-menu" id="user-menu">
                <button class="user-menu__btn" id="user-btn" type="button" aria-expanded="false" aria-haspopup="true">
                  <span class="avatar avatar--sm" style="--a1:#0e7490;--a2:#0d9488">${esc(user.initials)}</span>
                  <span class="user-menu__name">${esc(user.name.split(" ")[0])}</span>
                  ${ICONS.chevron}
                </button>
                <div class="user-menu__drop" id="user-drop" hidden>
                  <div class="user-menu__head">
                    <b>${esc(user.name)}</b>
                    <small>${esc(user.email)}</small>
                  </div>
                  <a href="dashboard.html">لوحتي</a>
                  <a href="courses.html">الدورات</a>
                  <a href="exams.html">الاختبارات</a>
                  <button type="button" id="logout-btn">تسجيل الخروج</button>
                </div>
              </div>`
            : `<a class="btn btn--ghost btn--sm hide-sm" href="sign-in.html">تسجيل الدخول</a>
               <a class="btn btn--primary btn--sm" href="sign-up.html">ابدأ مجانًا</a>`}
            <button class="burger" id="burger" type="button" aria-label="القائمة" aria-expanded="false" aria-controls="main-nav">${ICONS.menu}</button>
          </div>
        </div>
      </header>`;

    const userBtn = $("#user-btn");
    const userMenu = $("#user-menu");
    const userDrop = $("#user-drop");
    if (userBtn && userDrop && userMenu) {
      userBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = userDrop.hidden;
        userDrop.hidden = !open;
        userMenu.classList.toggle("is-open", open);
        userBtn.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", () => {
        if (userDrop.hidden) return;
        userDrop.hidden = true;
        userMenu.classList.remove("is-open");
        userBtn.setAttribute("aria-expanded", "false");
      });
    }

    const logout = $("#logout-btn");
    if (logout) {
      logout.addEventListener("click", () => {
        if (window.Auth) window.Auth.signOut();
        toast("تم تسجيل الخروج. إلى اللقاء!");
        setTimeout(() => { location.href = "index.html"; }, 700);
      });
    }

    const burger = $("#burger");
    const bar = $("#site-header-bar");
    if (burger) {
      burger.addEventListener("click", () => {
        const open = bar.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", String(open));
        burger.innerHTML = open ? ICONS.close : ICONS.menu;
      });
    }
  }

  function renderFooter() {
    const host = $("#site-footer");
    if (!host) return;
    host.innerHTML = `
      <footer class="site-footer">
        <div class="container footer__grid">
          <div class="footer__brand">
            <a class="logo logo--light" href="index.html">${LOGO}
              <span class="logo__text"><strong>دوروسي</strong><small>منصة التعليم عن بعد</small></span>
            </a>
            <p>المنصة الجزائرية للتعليم التفاعلي عن بُعد. تعلّم اليوم، وابنِ مستقبلك — دروس مباشرة، مسجّلة، واختبارات مع متابعة مستمرة.</p>
            <a class="play-btn play-btn--glass" href="https://play.google.com/store/apps/details?id=com.mycompany.douroussi&amp;hl=en" target="_blank" rel="noopener">
              ${ICONS.googleplay}
              <span class="play-btn__text"><small>متوفر الآن على</small><strong>Google Play</strong></span>
            </a>
          </div>

          <div class="footer__col">
            <h3>المنصة</h3>
            <a href="courses.html">المواد والدروس</a>
            <a href="exams.html">الاختبارات</a>
            <a href="dashboard.html">لوحة المتعلّم</a>
            <a href="sign-up.html">إنشاء حساب</a>
          </div>

          <div class="footer__col">
            <h3>المواد</h3>
            <a href="courses.html?subject=math">الرياضيات</a>
            <a href="courses.html?subject=physics">الفيزياء</a>
            <a href="courses.html?subject=science">علوم الطبيعة</a>
            <a href="courses.html?subject=arabic">اللغة العربية</a>
          </div>

          <div class="footer__col">
            <h3>المساعدة</h3>
            <a href="sign-in.html">تسجيل الدخول</a>
            <a href="#faq">الأسئلة الشائعة</a>
            <a href="#contact">اتصل بنا</a>
            <a href="#terms">شروط الاستخدام</a>
          </div>
        </div>
        <div class="container footer__bottom">
          <span>© <span data-year>2026</span> دوروسي — نسخة تجريبية للعرض.</span>
          <span>صُنعت بحب للتعليم · الجزائر</span>
        </div>
      </footer>`;

    const y = new Date().getFullYear();
    $$("[data-year]").forEach((el) => { if (y > 2026) el.textContent = String(y); });
  }

  /* ============================ Components ============================ */

  function courseCard(c) {
    const s = subjectOf(c.subject);
    const t = teacherOf(c.teacher);
    const pct = c.progress || 0;
    return `
      <article class="course-card">
        <a class="course-card__cover" href="course.html?course=${c.slug}" style="--g1:${c.gradient[0]};--g2:${c.gradient[1]}">
          <span class="course-card__glyph" aria-hidden="true">${esc(s.glyph)}</span>
          <span class="course-card__badge">${c.badge || esc(s.name)}</span>
          <span class="course-card__cover-title">${esc(c.title.split("—")[0].trim())}</span>
        </a>
        <div class="course-card__body">
          <div class="course-card__meta">
            <span class="pill pill--soft">${esc(c.level)}</span>
            <span class="rating">${ICONS.star}<b>${c.rating}</b><span>(${fmt(c.reviews)})</span></span>
          </div>
          <h3 class="course-card__title"><a href="course.html?course=${c.slug}">${esc(c.title)}</a></h3>
          <p class="course-card__desc">${esc(c.desc)}</p>
          <div class="course-card__teacher">
            <span class="avatar avatar--sm" style="--a1:${t.gradient[0]};--a2:${t.gradient[1]}">${esc(t.initials)}</span>
            <span>${esc(t.name)}</span>
          </div>
          ${pct ? `<div class="progress progress--sm"><span style="width:${pct}%"></span></div>` : ""}
          <div class="course-card__foot">
            <span class="course-card__stats">${ICONS.clock} ${c.hours} س ${ICONS.users} ${fmt(c.students)}</span>
            <span class="course-card__price ${c.price === 0 ? "is-free" : ""}">${money(c.price)}</span>
          </div>
        </div>
      </article>`;
  }

  function sessionRow(s) {
    const sub = subjectOf(s.subject);
    const d = new Date(s.day + "T" + s.time);
    const dayName = d.toLocaleDateString("ar", { weekday: "long" });
    return `
      <li class="session">
        <span class="session__date">
          <b>${d.getDate()}</b>
          <small>${d.toLocaleDateString("ar", { month: "short" })}</small>
        </span>
        <span class="session__body">
          <strong>${esc(s.title)}</strong>
          <small>${esc(s.teacher)} · ${dayName} ${s.time}</small>
        </span>
        <span class="session__tag" style="--c:${sub.color};--t:${sub.tint}">${esc(sub.name)}</span>
        <a class="btn btn--ghost btn--xs" href="#live">تذكير</a>
      </li>`;
  }

  function ring(pct, label) {
    const offset = Math.round(326.7 - (326.7 * pct) / 100);
    return `<div class="ring" style="--pct:${pct};--offset:${offset}">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="52" class="ring__track"/>
        <circle cx="60" cy="60" r="52" class="ring__bar"/>
      </svg>
      <span class="ring__label"><b>${pct}%</b><small>${label}</small></span>
    </div>`;
  }

  /* ============================ Pages ============================ */

  const pages = {
    /* ---------------- HOME ---------------- */
    home() {
      const subjectsHost = $("#subjects-grid");
      if (subjectsHost) {
        subjectsHost.innerHTML = D.subjects.map((s) => `
          <a class="subject" href="courses.html?subject=${s.id}" style="--c:${s.color};--t:${s.tint}">
            <span class="subject__icon">${esc(s.glyph)}</span>
            <span class="subject__name">${esc(s.name)}</span>
            <span class="subject__count">${D.courses.filter((c) => c.subject === s.id).length} دورة</span>
            ${ICONS.arrow}
          </a>`).join("");
      }

      const featured = $("#featured-courses");
      if (featured) {
        featured.innerHTML = D.courses.slice(0, 3).map(courseCard).join("");
      }

      const freeHost = $("#free-courses");
      if (freeHost) {
        freeHost.innerHTML = D.courses.filter((c) => c.free).map(courseCard).join("");
      }

      const sessionsHost = $("#sessions-list");
      if (sessionsHost) sessionsHost.innerHTML = D.sessions.slice(0, 3).map(sessionRow).join("");

      const teachersHost = $("#teachers-grid");
      if (teachersHost) {
        teachersHost.innerHTML = D.teachers.slice(0, 4).map((t) => `
          <article class="teacher">
            <span class="avatar avatar--lg" style="--a1:${t.gradient[0]};--a2:${t.gradient[1]}">${esc(t.initials)}</span>
            <h3>${esc(t.name)}</h3>
            <p>${esc(t.subject)} · ${t.years} سنة خبرة</p>
            <div class="teacher__meta"><span class="rating">${ICONS.star}<b>${t.rating}</b></span><span>${fmt(t.students)} متعلّم</span></div>
            <a class="link-arrow" href="courses.html?subject=${subjectOf(D.subjects.find((s) => s.name === t.subject)?.id || "math").id}">دوراته ${ICONS.arrow}</a>
          </article>`).join("");
      }

      const tHost = $("#testimonials");
      if (tHost) {
        tHost.innerHTML = D.testimonials.map((t) => `
          <figure class="quote">
            <div class="quote__stars">${ICONS.star.repeat(5)}</div>
            <blockquote>${esc(t.text)}</blockquote>
            <figcaption>
              <span class="avatar avatar--sm" style="--a1:${t.gradient[0]};--a2:${t.gradient[1]}">${esc(t.initials)}</span>
              <span><b>${esc(t.name)}</b><small>${esc(t.role)}</small></span>
            </figcaption>
          </figure>`).join("");
      }

      const heroSearch = $("#hero-search");
      if (heroSearch) {
        heroSearch.addEventListener("submit", (e) => {
          e.preventDefault();
          const q = heroSearch.querySelector("input").value.trim();
          location.href = "courses.html" + (q ? "?q=" + encodeURIComponent(q) : "");
        });
      }
    },

    /* ---------------- COURSES ---------------- */
    courses() {
      const grid = $("#courses-grid");
      if (!grid) return;

      const chipsHost = $("#filter-chips");
      const levelSel = $("#filter-level");
      const searchInput = $("#filter-search");
      const countEl = $("#courses-count");

      const state = {
        subject: params.get("subject") || "all",
        level: params.get("level") || "all",
        q: params.get("q") || ""
      };

      if (searchInput) searchInput.value = state.q;

      const levels = [...new Set(D.courses.map((c) => c.level))];

      if (chipsHost) {
        chipsHost.innerHTML = [{ id: "all", name: "كل المواد" }, ...D.subjects]
          .map((s) => `<button type="button" class="chip ${state.subject === s.id ? "is-active" : ""}" data-subject="${s.id}">${esc(s.name)}</button>`)
          .join("");
      }

      if (levelSel) {
        levelSel.innerHTML = `<option value="all">كل المستويات</option>` +
          levels.map((l) => `<option value="${esc(l)}">${esc(l)}</option>`).join("");
      }

      function apply() {
        const list = D.courses.filter((c) => {
          const okSubject = state.subject === "all" || c.subject === state.subject;
          const okLevel = state.level === "all" || c.level === state.level;
          const q = state.q.trim().toLowerCase();
          const okQ = !q || (c.title + " " + c.desc + " " + subjectOf(c.subject).name).toLowerCase().includes(q);
          return okSubject && okLevel && okQ;
        });

        grid.innerHTML = list.length
          ? list.map(courseCard).join("")
          : `<div class="empty"><span>${ICONS.search}</span><h3>لا توجد نتائج مطابقة</h3><p>جرّب تغيير المادة أو المستوى أو كلمة البحث.</p></div>`;

        if (countEl) countEl.textContent = `${list.length} دورة متاحة`;
      }

      if (chipsHost) {
        chipsHost.addEventListener("click", (e) => {
          const btn = e.target.closest("[data-subject]");
          if (!btn) return;
          state.subject = btn.dataset.subject;
          $$(".chip", chipsHost).forEach((c) => c.classList.toggle("is-active", c === btn));
          apply();
        });
      }

      if (levelSel) {
        levelSel.value = state.level;
        levelSel.addEventListener("change", () => { state.level = levelSel.value; apply(); });
      }

      if (searchInput) {
        searchInput.addEventListener("input", () => { state.q = searchInput.value; apply(); });
      }

      apply();
    },

    /* ---------------- COURSE DETAIL ---------------- */
    course() {
      const c = courseOf(params.get("course"));
      const s = subjectOf(c.subject);
      const t = teacherOf(c.teacher);
      const host = $("#course-root");
      if (!host) return;

      document.title = c.title + " | دوروسي";

      const freeCount = c.lessons.filter((l) => l.free).length;

      host.innerHTML = `
        <section class="course-hero" style="--g1:${c.gradient[0]};--g2:${c.gradient[1]}">
          <div class="container course-hero__inner">
            <nav class="breadcrumb"><a href="index.html">الرئيسية</a>${ICONS.chevron}<a href="courses.html">المواد</a>${ICONS.chevron}<span>${esc(s.name)}</span></nav>
            <div class="course-hero__main">
              <div class="course-hero__text">
                <span class="pill pill--glass">${esc(c.level)}</span>
                <h1>${esc(c.title)}</h1>
                <p>${esc(c.desc)}</p>
                <div class="course-hero__stats">
                  <span class="rating rating--light">${ICONS.star}<b>${c.rating}</b><span>(${fmt(c.reviews)} تقييم)</span></span>
                  <span class="dot">·</span><span>${fmt(c.students)} متعلّم</span>
                  <span class="dot">·</span><span>${c.lessons.length} درسًا · ${c.hours} ساعة</span>
                </div>
                <div class="course-hero__teacher">
                  <span class="avatar avatar--sm" style="--a1:${t.gradient[0]};--a2:${t.gradient[1]}">${esc(t.initials)}</span>
                  <span><b>${esc(t.name)}</b><small>أستاذ ${esc(t.subject)} · ${t.years} سنة خبرة</small></span>
                </div>
              </div>
              <div class="course-hero__glyph" aria-hidden="true">${esc(s.glyph)}</div>
            </div>
          </div>
        </section>

        <div class="container course-layout">
          <div class="course-main">
            <section class="card-panel">
              <h2 class="panel-title">محتوى الدورة</h2>
              <p class="panel-sub">${c.lessons.length} درسًا · ${freeCount} دروس مجانية للمعاينة</p>
              <ol class="lesson-list" id="lesson-list">
                ${c.lessons.map((l, i) => `
                  <li class="lesson-row ${l.free ? "" : "is-locked"}">
                    <span class="lesson-row__num">${String(i + 1).padStart(2, "0")}</span>
                    <span class="lesson-row__type">${l.type === "pdf" ? ICONS.pdf : ICONS.play}</span>
                    <span class="lesson-row__title">
                      <a href="lesson.html?course=${c.slug}&lesson=${i}" ${l.free ? "" : 'data-locked="1"'}>${esc(l.title)}</a>
                      <small>${l.type === "pdf" ? "ملف PDF" : "درس مسجّل"} · ${l.duration}</small>
                    </span>
                    ${l.free ? `<span class="pill pill--free">معاينة مجانية</span>` : `<span class="lesson-row__lock">${ICONS.lock}</span>`}
                  </li>`).join("")}
              </ol>
            </section>

            <section class="card-panel">
              <h2 class="panel-title">ماذا ستتعلم؟</h2>
              <ul class="check-grid">
                ${c.chapters.map((ch) => `<li>${ICONS.check}<span>${esc(ch)}</span></li>`).join("")}
                <li>${ICONS.check}<span>منهجية الإجابة على مواضيع البكالوريا</span></li>
                <li>${ICONS.check}<span>تمارين وحلول مفصّلة خطوة بخطوة</span></li>
              </ul>
            </section>

            <section class="card-panel">
              <h2 class="panel-title">عن الأستاذ</h2>
              <div class="teacher-inline">
                <span class="avatar avatar--lg" style="--a1:${t.gradient[0]};--a2:${t.gradient[1]}">${esc(t.initials)}</span>
                <div>
                  <h3>${esc(t.name)}</h3>
                  <p>أستاذ ${esc(t.subject)} بخبرة ${t.years} سنة في تحضير التلاميذ للامتحانات الرسمية، مع أكثر من ${fmt(t.students)} متعلّم على المنصة.</p>
                  <div class="teacher-inline__meta">
                    <span class="rating">${ICONS.star}<b>${t.rating}</b></span>
                    <span>${ICONS.users} ${fmt(t.students)} متعلّم</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside class="course-aside">
            <div class="buy-card">
              <div class="buy-card__price">
                <strong>${money(c.price)}</strong>
                ${c.oldPrice ? `<s>${money(c.oldPrice)}</s>` : ""}
              </div>
              <p class="buy-card__note">${c.price === 0 ? "دورة مجانية بالكامل — سجّل وابدأ الآن." : "وصول غير محدود لمدة سنة كاملة."}</p>
              <button class="btn btn--primary btn--block" type="button" id="enroll-btn">${c.price === 0 ? "ابدأ الدورة مجانًا" : "اشترك في الدورة"}</button>
              <a class="btn btn--ghost btn--block" href="lesson.html?course=${c.slug}&lesson=0">مشاهدة درس مجاني</a>

              <ul class="buy-card__list">
                <li>${ICONS.play}<span>${c.lessons.length} درسًا مسجّلًا</span></li>
                <li>${ICONS.clock}<span>${c.hours} ساعة من المحتوى</span></li>
                <li>${ICONS.live}<span>حصص مباشرة شهرية</span></li>
                <li>${ICONS.pdf}<span>ملخصات وتمارين PDF</span></li>
                <li>${ICONS.award}<span>شهادة إتمام</span></li>
              </ul>

              <div class="buy-card__support">
                <strong>هل تحتاج مساعدة؟</strong>
                <a href="#contact">تواصل مع الدعم</a>
              </div>
            </div>
          </aside>
        </div>`;

      $$('[data-locked]').forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          toast("هذا الدرس متاح للمشتركين — اشترك للمتابعة.");
        });
      });

      const enroll = $("#enroll-btn");
      if (enroll) {
        enroll.addEventListener("click", () => {
          enroll.disabled = true;
          enroll.textContent = "جارٍ التسجيل…";
          setTimeout(() => {
            enroll.textContent = "أنت مشترك ✓";
            toast("تم تسجيلك في الدورة — نسخة تجريبية");
          }, 900);
        });
      }
    },

    /* ---------------- LESSON ---------------- */
    lesson() {
      const c = courseOf(params.get("course"));
      const idx = Math.max(0, Math.min(Number(params.get("lesson")) || 0, c.lessons.length - 1));
      const current = c.lessons[idx];
      const host = $("#lesson-root");
      if (!host) return;

      document.title = current.title + " | " + c.title;

      host.innerHTML = `
        <div class="container lesson-layout">
          <div class="lesson-main">
            <nav class="breadcrumb breadcrumb--dark">
              <a href="course.html?course=${c.slug}">${esc(c.title)}</a>${ICONS.chevron}<span>الدرس ${idx + 1}</span>
            </nav>

            <div class="player" id="player">
              <div class="player__art">
                <span class="player__glyph">${esc(subjectOf(c.subject).glyph)}</span>
                <button class="player__play" type="button" aria-label="تشغيل الدرس">${ICONS.play}</button>
                <span class="player__badge">${ICONS.live} تسجيل الدرس</span>
              </div>
              <div class="player__bar">
                <span class="player__time" id="player-time">00:00 / ${current.duration}</span>
                <span class="player__track"><i id="player-progress"></i></span>
                <button class="player__ctrl" type="button" id="player-speed">1x</button>
              </div>
            </div>

            <div class="lesson-head">
              <div>
                <p class="eyebrow">الدرس ${idx + 1} من ${c.lessons.length}</p>
                <h1>${esc(current.title)}</h1>
              </div>
              <button class="btn btn--primary btn--sm" type="button" id="complete-btn">${ICONS.check} إتمام الدرس</button>
            </div>

            <div class="tabs" role="tablist">
              <button class="tab is-active" role="tab" data-tab="overview">نظرة عامة</button>
              <button class="tab" role="tab" data-tab="files">الملفات (2)</button>
              <button class="tab" role="tab" data-tab="notes">ملاحظاتي</button>
            </div>

            <div class="tab-panel is-active" data-panel="overview">
              <p>في هذا الدرس نتناول <b>${esc(current.title)}</b> بطريقة مبسّطة: نشأة المفهوم، ثم القواعد الأساسية، ثم تطبيقات مباشرة على نماذج من مواضيع الامتحانات الرسمية.</p>
              <h3>محاور الدرس</h3>
              <ul class="bullet">
                <li>تعريف وتذكير بالمكتسبات القبلية.</li>
                <li>القواعد الأساسية مع أمثلة محلولة على السبورة.</li>
                <li>تمارين متدرجة الصعوبة مع التصحيح.</li>
                <li>خلاصة + أخطاء شائعة يجب تجنّبها.</li>
              </ul>
            </div>

            <div class="tab-panel" data-panel="files">
              <div class="file-row">
                <span class="file-row__icon">${ICONS.pdf}</span>
                <span><b>ملخص الدرس</b><small>PDF · 1.2 MB</small></span>
                <a class="btn btn--ghost btn--xs" href="#download">تحميل</a>
              </div>
              <div class="file-row">
                <span class="file-row__icon">${ICONS.pdf}</span>
                <span><b>سلسلة تمارين + الحل</b><small>PDF · 2.4 MB</small></span>
                <a class="btn btn--ghost btn--xs" href="#download">تحميل</a>
              </div>
            </div>

            <div class="tab-panel" data-panel="notes">
              <textarea class="notes" placeholder="اكتب ملاحظاتك هنا…" rows="6"></textarea>
              <button class="btn btn--ghost btn--sm" type="button" id="save-notes">حفظ الملاحظات</button>
            </div>
          </div>

          <aside class="lesson-aside">
            <div class="aside-card">
              <div class="aside-card__head">
                <span class="pill pill--soft">محتوى الدورة</span>
                <strong>${c.lessons.length} درسًا</strong>
              </div>
              <ol class="lesson-list lesson-list--compact">
                ${c.lessons.map((l, i) => `
                  <li class="lesson-row ${i === idx ? "is-current" : ""} ${l.free || i <= idx ? "" : "is-locked"}">
                    <span class="lesson-row__num">${String(i + 1).padStart(2, "0")}</span>
                    <span class="lesson-row__title">
                      <a href="${l.free || i <= idx ? `lesson.html?course=${c.slug}&lesson=${i}` : "#locked"}">${esc(l.title)}</a>
                      <small>${l.duration}</small>
                    </span>
                    ${l.free || i <= idx ? "" : `<span class="lesson-row__lock">${ICONS.lock}</span>`}
                  </li>`).join("")}
              </ol>
            </div>
          </aside>
        </div>`;

      // fake playback progress
      const prog = $("#player-progress");
      let pct = 0;
      let timer = null;
      const play = $(".player__play");
      const timeEl = $("#player-time");

      function stop() { if (timer) { clearInterval(timer); timer = null; } }

      if (play) {
        play.addEventListener("click", () => {
          if (timer) {
            stop();
            play.classList.remove("is-playing");
            play.innerHTML = ICONS.play;
            return;
          }
          play.classList.add("is-playing");
          play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor"/></svg>';
          timer = setInterval(() => {
            pct = Math.min(100, pct + 1.4);
            if (prog) prog.style.width = pct + "%";
            if (timeEl) {
              const total = pct >= 100 ? 100 : Math.round(pct);
              timeEl.textContent = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")} / ${current.duration}`;
            }
            if (pct >= 100) { stop(); play.classList.remove("is-playing"); play.innerHTML = ICONS.play; }
          }, 220);
        });
      }

      const speed = $("#player-speed");
      if (speed) {
        let s = 1;
        speed.addEventListener("click", () => {
          s = s === 1 ? 1.5 : s === 1.5 ? 2 : 1;
          speed.textContent = s + "x";
        });
      }

      const complete = $("#complete-btn");
      if (complete) {
        complete.addEventListener("click", () => {
          complete.classList.toggle("is-done");
          const done = complete.classList.contains("is-done");
          complete.innerHTML = done ? ICONS.check + " تم إتمام الدرس" : ICONS.check + " إتمام الدرس";
          toast(done ? "أحسنت! سجّلنا هذا الدرس كمكتمل." : "أُلغي تسجيل الإتمام.");
        });
      }

      $$(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          $$(".tab").forEach((t) => t.classList.toggle("is-active", t === tab));
          $$(".tab-panel").forEach((p) => p.classList.toggle("is-active", p.dataset.panel === tab.dataset.tab));
        });
      });

      const saveNotes = $("#save-notes");
      if (saveNotes) saveNotes.addEventListener("click", () => toast("تم حفظ ملاحظاتك في هذا المتصفح."));

      $$('.lesson-aside a[href="#locked"]').forEach((a) =>
        a.addEventListener("click", (e) => { e.preventDefault(); toast("الدرس مقفل — اشترك في الدورة للوصول إلى كل الدروس."); })
      );
    },

    /* ---------------- EXAMS ---------------- */
    exams() {
      const host = $("#exams-grid");
      if (!host) return;
      const state = { subject: params.get("subject") || "all" };

      const chips = $("#exam-chips");
      if (chips) {
        chips.innerHTML = [{ id: "all", name: "الكل" }, ...D.subjects]
          .map((s) => `<button type="button" class="chip ${state.subject === s.id ? "is-active" : ""}" data-subject="${s.id}">${esc(s.name)}</button>`)
          .join("");
        chips.addEventListener("click", (e) => {
          const b = e.target.closest("[data-subject]");
          if (!b) return;
          state.subject = b.dataset.subject;
          $$(".chip", chips).forEach((c) => c.classList.toggle("is-active", c === b));
          draw();
        });
      }

      function draw() {
        const list = D.exams.filter((e) => state.subject === "all" || e.subject === state.subject);
        host.innerHTML = list.map((e) => {
          const s = subjectOf(e.subject);
          return `
            <article class="exam-card">
              <div class="exam-card__top">
                <span class="subject__icon subject__icon--sm" style="--c:${s.color};--t:${s.tint}">${esc(s.glyph)}</span>
                <span class="pill pill--soft">${esc(e.level)}</span>
              </div>
              <h3>${esc(e.title)}</h3>
              <p>${esc(s.name)} · ${e.questions} سؤالًا · ${e.duration} دقيقة</p>
              <div class="exam-card__meta">
                <span class="diff diff--${e.difficulty === "صعب" ? "hard" : e.difficulty === "سهل" ? "easy" : "mid"}">${esc(e.difficulty)}</span>
                <span>${ICONS.users} ${fmt(e.attempts)} محاولة</span>
              </div>
              <button class="btn btn--primary btn--block btn--sm" type="button" data-exam="${e.id}">ابدأ الاختبار</button>
            </article>`;
        }).join("");

        $$("[data-exam]").forEach((b) =>
          b.addEventListener("click", () => {
            b.disabled = true;
            b.textContent = "جارٍ التحضير…";
            setTimeout(() => {
              b.disabled = false;
              b.textContent = "ابدأ الاختبار";
              toast("سيُفتح الاختبار في نافذة جديدة — نسخة تجريبية.");
            }, 800);
          })
        );
      }

      draw();
    },

    /* ---------------- DASHBOARD ---------------- */
    dashboard() {
      const host = $("#dash-root");
      if (!host) return;
      const user = window.Auth ? window.Auth.getUser() : null;
      const st = {
        ...D.student,
        name: user ? user.name.split(" ")[0] : "زائر",
        fullName: user ? user.name : "زائر",
        initials: user ? user.initials : "ز",
        level: user ? user.level : "لم تسجّل الدخول بعد"
      };
      const active = D.courses.filter((c) => c.progress > 0);
      const overall = Math.round(active.reduce((a, c) => a + c.progress, 0) / (active.length || 1));
      const goalPct = Math.round((st.weeklyDone / st.weeklyGoal) * 100);

      host.innerHTML = `
        ${user ? "" : `
        <div class="notice">
          <span>أنت تتصفّح لوحة تجريبية كزائر. لتجربة الدخول الكاملة استعمل الحساب التجريبي:</span>
          <code dir="ltr">demo@douroussi.dz / demo1234</code>
          <a href="sign-in.html">سجّل الدخول الآن</a>
        </div>`}
        <div class="dash-top">
          <div class="dash-hello">
            <span class="eyebrow">لوحة المتعلّم</span>
            <h1>أهلًا ${esc(st.name)} 👋</h1>
            <p>${esc(st.level)} · واصل التقدّم، باقي ${st.weeklyGoal - st.weeklyDone} دروس لتحقيق هدف هذا الأسبوع.</p>
          </div>
          <div class="dash-badges">
            <span class="streak">${ICONS.fire}<b>${st.streak}</b> يوم متتالي</span>
            <span class="streak streak--gold">${ICONS.award}<b>${fmt(st.points)}</b> نقطة</span>
          </div>
        </div>

        <div class="dash-stats">
          <div class="stat-card">
            ${ring(overall, "من الدورة")}
            <div><strong>التقدّم العام</strong><span>${active.length} دورات نشطة · ${st.rank} في الترتيب</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon">${ICONS.book}</div>
            <div><strong>${D.courses.length} دورات</strong><span>${D.courses.reduce((a, c) => a + c.lessons.length, 0)} درسًا في مكتبتك</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon">${ICONS.target}</div>
            <div class="stat-card__goal">
              <strong>هدف الأسبوع ${st.weeklyDone}/${st.weeklyGoal}</strong>
              <span class="progress progress--sm"><i style="width:${goalPct}%"></i></span>
            </div>
          </div>
        </div>

        <section class="dash-section">
          <div class="dash-section__head"><h2>واصل من حيث توقفت</h2><a class="link-arrow" href="courses.html">كل الدورات ${ICONS.arrow}</a></div>
          <div class="continue-grid">
            ${active.map((c) => {
              const t = teacherOf(c.teacher);
              return `<a class="continue" href="course.html?course=${c.slug}">
                <span class="continue__cover" style="--g1:${c.gradient[0]};--g2:${c.gradient[1]}">${esc(subjectOf(c.subject).glyph)}</span>
                <span class="continue__body">
                  <strong>${esc(c.title)}</strong>
                  <small>${esc(t.name)} · ${c.progress}% مكتمل</small>
                  <span class="progress progress--sm"><i style="width:${c.progress}%"></i></span>
                </span>
                <span class="continue__go">${ICONS.arrow}</span>
              </a>`;
            }).join("")}
          </div>
        </section>

        <div class="dash-columns">
          <section class="dash-section">
            <div class="dash-section__head"><h2>حصص مباشرة قادمة</h2><span class="pill pill--live">${ICONS.live} مباشر</span></div>
            <ul class="sessions sessions--stack" id="dash-sessions"></ul>
          </section>

          <section class="dash-section">
            <div class="dash-section__head"><h2>الإنجازات</h2></div>
            <ul class="badges">
              <li class="badge-item is-earned">${ICONS.fire}<span><b>14 يومًا</b><small>سلسلة المثابرة</small></span></li>
              <li class="badge-item is-earned">${ICONS.check}<span><b>25 درسًا</b><small>دروس مكتملة</small></span></li>
              <li class="badge-item is-earned">${ICONS.star}<span><b>معدل 16+</b><small>في الاختبارات</small></span></li>
              <li class="badge-item">${ICONS.award}<span><b>شارة بكالوريا</b><small>أكمل 90% للمزيد</small></span></li>
            </ul>
          </section>
        </div>`;

      const sess = $("#dash-sessions");
      if (sess) sess.innerHTML = D.sessions.map(sessionRow).join("");
    }
  };

  /* ============================ Toast ============================ */

  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    const msg = $(".toast__msg", el);
    if (msg) msg.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3400);
  }

  /* ============================ Boot ============================ */

  renderHeader();
  renderFooter();

  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();

  // reveal on scroll
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 })
    : null;
  if (io) $$(".reveal").forEach((el) => io.observe(el));

  // quick demo login (landing page)
  $$("[data-quick-demo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!window.Auth) return;
      const res = window.Auth.signIn(window.Auth.DEMO.email, window.Auth.DEMO.password);
      if (!res.ok) return;
      btn.disabled = true;
      btn.textContent = "جارٍ الدخول…";
      toast("مرحبًا " + res.user.name.split(" ")[0] + "! جارٍ فتح لوحتك…");
      setTimeout(() => { location.href = "dashboard.html"; }, 750);
    });
  });

  // smooth in-page links
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1 && $(id)) {
        e.preventDefault();
        $(id).scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  window.douroussi = { toast, ICONS };
})();
