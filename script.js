const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".global-nav");
const siteHeader = document.querySelector(".site-header");

if (document.body.classList.contains("home-page") && siteHeader) {
  const updateHeader = () => {
    const shouldShow = window.scrollY > 72;
    siteHeader.classList.toggle("is-visible", shouldShow);

    if (!shouldShow) {
      nav?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

toggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "メニューを開く");
  }
});

const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");
const contactEmail = "info@example.com";

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!(contactForm instanceof HTMLFormElement) || !contactForm.reportValidity()) {
    return;
  }

  const data = new FormData(contactForm);
  const lines = [
    `会社名: ${data.get("company") || ""}`,
    `お名前: ${data.get("name") || ""}`,
    `メールアドレス: ${data.get("email") || ""}`,
    `電話番号: ${data.get("tel") || ""}`,
    `お問い合わせ種別: ${data.get("category") || ""}`,
    "",
    "お問い合わせ内容:",
    `${data.get("message") || ""}`,
  ];

  const subject = encodeURIComponent("Enaサイトからのお問い合わせ");
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

  if (formMessage) {
    formMessage.textContent = "メール作成画面を開きました。";
  }
});
