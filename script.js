const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".global-nav");

function closeMenu() {
  nav?.classList.remove("is-open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", "メニューを開く");
}
toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
});
nav?.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav?.classList.contains("is-open")) {
    closeMenu();
    toggle?.focus();
  }
});
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && !event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);

const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");
const contactEmail = "nomuraena@e-na.jp";
const categories = { service: "サービスのご相談", student: "学生の参加について", partnership: "大学・地域との連携" };
const requestedCategory = categories[new URLSearchParams(window.location.search).get("category")];
if (contactForm instanceof HTMLFormElement && requestedCategory) {
  const select = contactForm.elements.namedItem("category");
  if (select instanceof HTMLSelectElement) select.value = requestedCategory;
}
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!(contactForm instanceof HTMLFormElement) || !contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  const lines = [
    `会社名・学校名: ${data.get("company") || ""}`,
    `お名前: ${data.get("name") || ""}`,
    `メールアドレス: ${data.get("email") || ""}`,
    `電話番号: ${data.get("tel") || ""}`,
    `お問い合わせ種別: ${data.get("category") || ""}`,
    "", "お問い合わせ内容:", `${data.get("message") || ""}`,
  ];
  const subject = encodeURIComponent("Enaサイトからのお問い合わせ");
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  if (formMessage) formMessage.textContent = "メールアプリで内容をご確認のうえ、送信してください。開かない場合は nomuraena@e-na.jp へ直接お送りください。この画面ではまだ送信されていません。";
});
