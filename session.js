/* =========================================================
   دوروسي — جلسة تجريبية (Demo Auth) عبر localStorage
   ملاحظة: هذه نسخة عرض فقط — كلمات المرور تُخزَّن محليًا في المتصفح.
   في الإنتاج استبدلها بواجهة API حقيقية (JWT / session cookies).
   ========================================================= */
window.Auth = (function () {
  "use strict";

  const SESSION_KEY = "douroussi.session";
  const USERS_KEY = "douroussi.users";

  // الحساب التجريبي الجاهز
  const DEMO = {
    email: "demo@douroussi.dz",
    password: "demo1234",
    name: "أمين بلقاسم",
    initials: "أ ب",
    level: "3 ثانوي · بكالوريا"
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* التخزين غير متاح (وضع خاص) — نتجاهل بهدوء */
    }
  }

  function initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    return (parts[0] ? parts[0][0] : "؟") + " " + (parts[1] ? parts[1][0] : "");
  }

  function users() {
    const custom = read(USERS_KEY, []);
    const rest = Array.isArray(custom) ? custom.filter((u) => u.email !== DEMO.email) : [];
    return [DEMO, ...rest];
  }

  function getUser() {
    return read(SESSION_KEY, null);
  }

  function isIn() {
    return !!getUser();
  }

  function startSession(user) {
    const session = {
      name: user.name,
      email: user.email,
      initials: user.initials || initials(user.name),
      level: user.level || "3 ثانوي · بكالوريا",
      at: Date.now()
    };
    write(SESSION_KEY, session);
    return session;
  }

  function signIn(email, password) {
    const mail = String(email || "").trim().toLowerCase();
    const user = users().find((u) => String(u.email).toLowerCase() === mail);

    if (!user) {
      return { ok: false, field: "email", message: "لا يوجد حساب بهذا البريد الإلكتروني." };
    }
    if (user.password !== password) {
      return { ok: false, field: "password", message: "كلمة المرور غير صحيحة. جرّب الحساب التجريبي." };
    }
    return { ok: true, user: startSession(user) };
  }

  function signUp(data) {
    const mail = String(data.email || "").trim().toLowerCase();
    if (users().some((u) => String(u.email).toLowerCase() === mail)) {
      return { ok: false, field: "email", message: "هذا البريد مستعمل بالفعل — سجّل الدخول بدلًا من ذلك." };
    }
    const user = {
      name: String(data.name || "").trim() || "متعلّم جديد",
      email: mail,
      password: data.password,
      level: data.level || "3 ثانوي · بكالوريا"
    };
    user.initials = initials(user.name);
    const list = read(USERS_KEY, []);
    list.push(user);
    write(USERS_KEY, list);
    return { ok: true, user: startSession(user) };
  }

  function signOut() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  return { DEMO, getUser, isIn, signIn, signUp, signOut, users };
})();
