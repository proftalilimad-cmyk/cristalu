/* =========================================================
   دوروسي — التفاعلات (تسجيل الدخول / إنشاء حساب)
   ========================================================= */
(function () {
  "use strict";

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  /* ---------- helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);

  function showError(field, message) {
    const box = $(".error", field);
    field.classList.add("has-error");
    const input = $("input", field);
    if (input) input.setAttribute("aria-invalid", "true");
    if (box) {
      box.textContent = message;
      box.classList.add("is-visible");
    }
  }

  function clearError(field) {
    const box = $(".error", field);
    field.classList.remove("has-error");
    const input = $("input", field);
    if (input) input.removeAttribute("aria-invalid");
    if (box) {
      box.textContent = "";
      box.classList.remove("is-visible");
    }
  }

  /* ---------- password visibility ---------- */
  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    const wrap = btn.closest(".control");
    const input = wrap ? $("input", wrap) : null;
    if (!input) return;

    btn.addEventListener("click", () => {
      const revealed = input.type === "text";
      input.type = revealed ? "password" : "text";
      btn.setAttribute("aria-pressed", String(!revealed));
      btn.setAttribute("aria-label", revealed ? "إظهار كلمة المرور" : "إخفاء كلمة المرور");
      input.focus({ preventScroll: true });
      // keep the caret at the end after switching type
      const end = input.value.length;
      try { input.setSelectionRange(end, end); } catch (_) {}
    });
  });

  /* ---------- live clearing of errors ---------- */
  document.querySelectorAll(".field input").forEach((input) => {
    input.addEventListener("input", () => {
      const field = input.closest(".field");
      if (field && field.classList.contains("has-error")) clearError(field);
    });
  });

  /* ---------- toast ---------- */
  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    const msg = $(".toast__msg", el);
    if (msg && message) msg.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3600);
  }

  /* ---------- forgot password ---------- */
  const forgot = document.querySelector("[data-forgot]");
  if (forgot) {
    forgot.addEventListener("click", (event) => {
      event.preventDefault();
      const email = document.querySelector("#email");
      if (email && EMAIL_RE.test(email.value.trim())) {
        toast("أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
      } else {
        toast("أدخل بريدك الإلكتروني أولًا لإعادة تعيين كلمة المرور.");
        if (email) email.focus();
      }
    });
  }

  /* ---------- forms ---------- */
  const form = $("form[data-auth]");
  if (!form) return;

  const mode = form.dataset.auth; // "login" | "signup"
  const submitBtn = $("#submit-btn", form);
  const labelEl = submitBtn ? $(".btn__label", submitBtn) : null;
  const defaultLabel = labelEl ? labelEl.textContent : "";

  function validate() {
    let ok = true;
    let firstInvalid = null;

    form.querySelectorAll(".field").forEach((field) => {
      clearError(field);
      const input = $("input", field);
      if (!input) return;

      const value = input.value.trim();

      if (!value) {
        showError(field, "هذا الحقل مطلوب.");
        ok = false;
      } else if (input.type === "email" && !EMAIL_RE.test(value)) {
        showError(field, "يرجى إدخال بريد إلكتروني صحيح.");
        ok = false;
      } else if (input.dataset.minlength && value.length < Number(input.dataset.minlength)) {
        showError(field, `يجب أن تكون كلمة المرور ${input.dataset.minlength} أحرف على الأقل.`);
        ok = false;
      } else if (input.dataset.match) {
        const other = form.querySelector(`#${input.dataset.match}`);
        if (other && value !== other.value) {
          showError(field, "كلمتا المرور غير متطابقتين.");
          ok = false;
        }
      } else if (input.type === "text" && input.dataset.minlength && value.length < 3) {
        showError(field, "يرجى إدخال الاسم الكامل.");
        ok = false;
      }

      if (!ok && !firstInvalid) firstInvalid = input;
    });

    const terms = $('input[name="terms"]', form);
    if (terms && !terms.checked) {
      ok = false;
      toast("يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية.");
    }

    if (firstInvalid) firstInvalid.focus({ preventScroll: false });
    return ok;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      if (labelEl) labelEl.textContent = "جارٍ المعالجة…";
    }

    // نسخة تجريبية: لا يوجد اتصال بخادم، نحاكي طلبًا ناجحًا
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.classList.remove("is-loading");
        submitBtn.classList.add("is-done");
        if (labelEl) labelEl.textContent = "تم بنجاح ✓";
      }
      toast(mode === "signup"
        ? "تم إنشاء الحساب بنجاح — نسخة تجريبية"
        : "تم تسجيل الدخول بنجاح — نسخة تجريبية");

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-done");
          if (labelEl) labelEl.textContent = defaultLabel;
        }
      }, 2200);
    }, 1100);
  });

  /* ---------- current year ---------- */
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => {
    if (year > 2026) el.textContent = String(year);
  });
})();
