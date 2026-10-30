"use strict";

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#mobile-menu");
const compactNavigation = window.matchMedia("(max-width: 1399px)");
let menuExit = null;
function closeMenu() {
  menuExit?.cancel();
  menuExit = null;
  if (menu.open) menu.close();
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-is-open");
  if (compactNavigation.matches) menuButton.focus({ preventScroll: true });
}
function dismissMenu() {
  if (!menu.open || menuExit) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    closeMenu();
    return;
  }
  menuExit = menu.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }],
    { duration: 240, easing: "ease-in", fill: "forwards" },
  );
  menuExit.onfinish = closeMenu;
}
menuButton.addEventListener("click", () => {
  if (!compactNavigation.matches) return;
  menu.showModal();
  menuButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-is-open");
  document.querySelector(".mobile-menu-close").focus();
});
// Fermer avant l'ouverture éventuelle du dialogue d'abonnement/devis.
menu.addEventListener(
  "click",
  (event) => {
    if (event.target.closest(".mobile-menu-close")) dismissMenu();
    else if (event.target.closest("a, button")) closeMenu();
  },
  true,
);
menu.addEventListener("close", () => {
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-is-open");
});
menu.addEventListener("cancel", (event) => {
  event.preventDefault();
  dismissMenu();
});
compactNavigation.addEventListener("change", (event) => {
  if (!event.matches && menu.open) {
    closeMenu();
    document.querySelector("#navigation-links a").focus();
  }
});
