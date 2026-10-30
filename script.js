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

  function setLoading(isLoading, doneText) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("is-loading", isLoading);
    if (doneText) {
      submitBtn.classList.add("is-done");
      if (labelEl) labelEl.textContent = doneText;
    } else if (isLoading) {
      submitBtn.classList.remove("is-done");
      if (labelEl) labelEl.textContent = "جارٍ المعالجة…";
    }
  }

  function resetButton() {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.classList.remove("is-loading", "is-done");
    if (labelEl) labelEl.textContent = defaultLabel;
  }

  function fail(fieldName, message) {
    resetButton();
    const input = fieldName ? form.querySelector("#" + fieldName) : null;
    const field = input ? input.closest(".field") : null;
    if (field) showError(field, message);
    toast(message);
  }

  function succeed(user) {
    setLoading(false, "تم بنجاح ✓");
    toast(mode === "signup"
      ? `مرحبًا ${user.name.split(" ")[0]}! تم إنشاء حسابك.`
      : `مرحبًا ${user.name.split(" ")[0]}! جارٍ فتح لوحتك…`);

    setTimeout(() => {
      location.href = "dashboard.html";
    }, 850);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;

    const emailEl = form.querySelector("#email");
    const passEl = form.querySelector("#password");
    const nameEl = form.querySelector("#fullname");

    setLoading(true);

    // محاكاة طلب شبكة — استبدلها بـ fetch('/api/auth/...') في الإنتاج
    setTimeout(() => {
      const res = mode === "signup"
        ? window.Auth.signUp({
            name: nameEl ? nameEl.value : "متعلّم جديد",
            email: emailEl.value,
            password: passEl.value
          })
        : window.Auth.signIn(emailEl.value, passEl.value);

      if (!res.ok) {
        fail(res.field, res.message);
        return;
      }
      succeed(res.user);
    }, 750);
  });

  /* ---------- quick demo login ---------- */
  const fillDemo = document.querySelector("[data-demo-login]");
  if (fillDemo) {
    fillDemo.addEventListener("click", () => {
      const emailEl = form.querySelector("#email");
      const passEl = form.querySelector("#password");
      if (!emailEl || !passEl) return;
      emailEl.value = window.Auth.DEMO.email;
      passEl.value = window.Auth.DEMO.password;
      [emailEl, passEl].forEach((el) => {
        const field = el.closest(".field");
        if (field) clearError(field);
      });
      if (typeof form.requestSubmit === "function") form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    });
  }

  /* ---------- already signed in? ---------- */
  const already = document.querySelector("[data-already]");
  const current = window.Auth.getUser();
  if (already && current) {
    already.hidden = false;
    const alreadyName = already.querySelector("[data-already-name]");
    if (alreadyName) alreadyName.textContent = current.name;
  }

  /* ---------- current year ---------- */
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => {
    if (year > 2026) el.textContent = String(year);
  });
})();
