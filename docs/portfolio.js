function openLinkedCase() {
  const id = window.location.hash.slice(1);
  if (!id.startsWith("case-")) return;

  const details = document.getElementById(id)?.querySelector("details");
  if (details) {
    details.open = true;
    const summary = details.querySelector("summary");
    requestAnimationFrame(() => {
      summary?.focus({ preventScroll: true });
      document.getElementById(id).scrollIntoView({ block: "start" });
    });
  }
}

window.addEventListener("hashchange", openLinkedCase);
document.querySelectorAll('a[href^="#case-"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const details = document.getElementById(link.hash.slice(1))?.querySelector("details");
    if (details) details.open = true;
    if (window.location.hash === link.hash) {
      event.preventDefault();
      openLinkedCase();
    }
  });
});

openLinkedCase();

const navigationLinks = [...document.querySelectorAll('header nav a[href^="#"]')];
const navigationSections = navigationLinks.map((link) => document.querySelector(link.hash));
function updateNavigation() {
  const marker = Math.max(
    document.querySelector("header").getBoundingClientRect().bottom + 32,
    parseFloat(getComputedStyle(navigationSections[0]).scrollMarginTop) + 1
  );
  let active = navigationSections[0];
  for (const section of navigationSections) {
    if (section.getBoundingClientRect().top <= marker) active = section;
  }
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    active = navigationSections[navigationSections.length - 1];
  }
  navigationLinks.forEach((link) => {
    if (link.hash === `#${active.id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  document.querySelector(".site-header").classList.toggle("scrolled", window.scrollY > 8);
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) backToTop.hidden = window.scrollY < 400;
}
let navigationFrame;
window.addEventListener("scroll", () => {
  if (navigationFrame) return;
  navigationFrame = requestAnimationFrame(() => {
    updateNavigation();
    navigationFrame = null;
  });
}, { passive: true });
window.addEventListener("resize", updateNavigation);
window.addEventListener("portfolio:languagechange", updateNavigation);
updateNavigation();
