// Cristalu — interactions : menu mobile, année, validation du formulaire.
(function () {
  "use strict";

  // Année courante dans le pied de page
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Menu mobile
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    menu.classList.toggle("open", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Ferme le menu après un clic sur un lien
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setMenu(false);
    });

    // Ferme le menu avec la touche Échap
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  // Validation du formulaire de contact
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var rules = {
    name: function (v) {
      if (!v.trim()) return "Veuillez indiquer votre nom.";
      if (v.trim().length < 2) return "Le nom doit contenir au moins 2 caractères.";
      return "";
    },
    email: function (v) {
      if (!v.trim()) return "Veuillez indiquer votre e-mail.";
      if (!EMAIL_RE.test(v.trim())) return "Adresse e-mail invalide.";
      return "";
    },
    message: function (v) {
      if (!v.trim()) return "Veuillez écrire un message.";
      if (v.trim().length < 10) return "Le message doit contenir au moins 10 caractères.";
      return "";
    }
  };

  function validateField(name) {
    var input = form.elements[name];
    var field = input.closest(".field");
    var error = form.querySelector('.error[data-for="' + name + '"]');
    var msg = rules[name](input.value);
    field.classList.toggle("invalid", Boolean(msg));
    input.setAttribute("aria-invalid", String(Boolean(msg)));
    error.textContent = msg;
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener("blur", function () {
      validateField(name);
    });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("invalid")) {
        validateField(name);
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) {
      status.textContent = "Merci de corriger les champs indiqués.";
      status.className = "form-status error-msg";
      var firstInvalid = form.querySelector(".field.invalid input, .field.invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Démo : pas d'envoi réel. Branchez ici votre service (API, Formspree, etc.).
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = "Envoi en cours…";
    status.className = "form-status";

    setTimeout(function () {
      button.disabled = false;
      form.reset();
      status.textContent = "Merci ! Votre message a bien été envoyé.";
      status.className = "form-status success";
    }, 800);
  });
})();
