/* ------------------------------------------
MENU HAMBURGUER (mobile)
------------------------------------------ */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.querySelectorAll("span")[0].style.transform = isOpen
    ? "rotate(45deg) translate(5px,5px)"
    : "";
  menuToggle.querySelectorAll("span")[1].style.opacity = isOpen ? "0" : "1";
  menuToggle.querySelectorAll("span")[2].style.transform = isOpen
    ? "rotate(-45deg) translate(5px,-5px)"
    : "";
});

// Fecha o menu ao clicar em qualquer link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.querySelectorAll("span").forEach((s) => {
      s.style.transform = "";
      s.style.opacity = "1";
    });
  });
});

/* ------------------------------------------
DESTAQUE DO LINK ATIVO NA NAVEGAÇÃO
Lê o hash da URL (ex: #sobre) e marca o link correspondente como ativo.
Atualiza tanto ao carregar a página quanto ao clicar em qualquer âncora.
------------------------------------------ */
const navAnchors = document.querySelectorAll(".nav-links a");

function updateActiveLink() {
  const hash = location.hash || "#sobre";
  navAnchors.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === hash);
  });
}

updateActiveLink();

window.addEventListener("hashchange", updateActiveLink);

/* ------------------------------------------
BARRAS DE IDIOMA (animadas ao entrar na viewport)
------------------------------------------ */
const langFills = document.querySelectorAll(".lang-fill");

const langObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        langFills.forEach((fill) => {
          const pct = fill.getAttribute("data-pct");
          fill.style.transform = `scaleX(${pct / 100})`;
        });
        langObserver.disconnect(); // anima só uma vez
      }
    });
  },
  { threshold: 0.5 },
);

const langCard = document.getElementById("lang-card");
if (langCard) langObserver.observe(langCard);

/* ------------------------------------------
VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
------------------------------------------ */
const form = document.getElementById("contact-form");
const modal = document.getElementById("modal");
const modalNome = document.getElementById("modal-nome");
const closeBtn = document.getElementById("modal-close-btn");

/**
 * Valida um campo e exibe/esconde mensagem de erro.
 * @param {string} fieldId  - id do input
 * @param {string} errorId  - id do div de erro
 * @param {Function} check  - função que retorna true se válido
 * @returns {boolean}
 */
function validateField(fieldId, errorId, check) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errorId);
  const valid = check(field.value.trim());
  err.classList.toggle("show", !valid);
  field.style.borderColor = valid ? "" : "#ff5f5f";
  return valid;
}

/** Verifica formato de e-mail com regex simples */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("submit", function (e) {
  e.preventDefault(); // evita recarregar a página

  // Validação individual de cada campo
  const nomeOk = validateField("nome", "err-nome", (v) => v.length > 0);
  const emailOk = validateField("email", "err-email", (v) => isValidEmail(v));
  const msgOk = validateField("mensagem", "err-mensagem", (v) => v.length > 0);

  if (!nomeOk || !emailOk || !msgOk) return;

  // Tudo válido: guarda o nome para exibir no modal
  modalNome.textContent = document.getElementById("nome").value.trim();

  // Limpa o formulário
  form.reset();
  // Remove cores de erro
  ["nome", "email", "mensagem"].forEach((id) => {
    document.getElementById(id).style.borderColor = "";
  });

  // Exibe modal de confirmação
  modal.classList.add("show");
});

// Fecha o modal ao clicar no botão
closeBtn.addEventListener("click", () => modal.classList.remove("show"));

// Fecha o modal ao clicar fora da caixa
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});

// Fecha o modal com tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.classList.remove("show");
});
