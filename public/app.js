"use strict";

const communeSelect = document.querySelector("#commune");
const communeMap = document.querySelector("#commune-map");
const communeMapLink = document.querySelector("#commune-map-link");
const communes = new Set(
  Array.from(communeSelect.options, (option) => option.value),
);
communeSelect.addEventListener("change", () => {
  const commune = communeSelect.value;
  if (!communes.has(commune)) return;
  const query = `${commune}, Guinée`;
  document.querySelector("#commune-name").textContent = commune;
  communeMap.title = `Localisation indicative de ${commune} sur Google Maps`;
  communeMap.src = `https://maps.google.com/maps?${new URLSearchParams({ q: query, output: "embed", hl: "fr" })}`;
  communeMapLink.href = `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query })}`;
});

const prices = {
  menage: ["100 000", "200 000", "500 000"],
  etablissement: ["500 000", "1 000 000", "1 500 000"],
};
document.querySelectorAll("[data-client]").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.client;
    if (!Object.hasOwn(prices, selected)) return;
    document.querySelectorAll("[data-client]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll("[data-price]").forEach((item) => {
      item.textContent = prices[selected][Number(item.dataset.price)];
    });
  });
});

// Aucun bloc n'est caché en attente du JavaScript ou du défilement.
// Les animations ne jouent qu'une fois, quand un bloc entre dans l'écran.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const servicesTrack = document.querySelector("#services-track");
const mobileServices = window.matchMedia("(max-width: 767px)");
let servicesFrame = 0;
let servicesDirection = 1;
let servicesPosition = 0;
let servicesPreviousTime = 0;
let servicesWaitUntil = 0;
let servicesHovered = false;
let servicesVisible = false;

function canMoveServices() {
  return (
    !reducedMotion.matches &&
    !mobileServices.matches &&
    !servicesHovered &&
    servicesVisible &&
    !document.hidden &&
    !servicesTrack.contains(document.activeElement) &&
    servicesTrack.scrollWidth > servicesTrack.clientWidth + 1
  );
}

function animateServices(now) {
  servicesFrame = 0;
  if (!canMoveServices()) return;
  const elapsed = servicesPreviousTime
    ? Math.min(now - servicesPreviousTime, 48)
    : 0;
  servicesPreviousTime = now;
  const maximum = servicesTrack.scrollWidth - servicesTrack.clientWidth;
  if (now >= servicesWaitUntil) {
    servicesPosition = Math.max(
      0,
      Math.min(maximum, servicesPosition + servicesDirection * elapsed * 0.032),
    );
    servicesTrack.scrollLeft = servicesPosition;
    if (
      (servicesDirection > 0 && servicesPosition === maximum) ||
      (servicesDirection < 0 && servicesPosition === 0)
    ) {
      servicesDirection *= -1;
      servicesWaitUntil = now + 1400;
    }
  }
  servicesFrame = requestAnimationFrame(animateServices);
}

function updateServicesPlayback() {
  cancelAnimationFrame(servicesFrame);
  servicesFrame = 0;
  servicesPreviousTime = 0;
  servicesPosition = servicesTrack.scrollLeft;
  if (mobileServices.matches) servicesTrack.scrollLeft = 0;
  const enabled =
    !reducedMotion.matches &&
    !mobileServices.matches &&
    servicesTrack.scrollWidth > servicesTrack.clientWidth + 1;
  servicesTrack.classList.toggle("auto-scroll", enabled);
  if (canMoveServices()) servicesFrame = requestAnimationFrame(animateServices);
}

servicesTrack.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "touch") return;
  servicesHovered = true;
  updateServicesPlayback();
});
servicesTrack.addEventListener("pointerleave", () => {
  servicesHovered = false;
  updateServicesPlayback();
});
servicesTrack.addEventListener("focusin", updateServicesPlayback);
servicesTrack.addEventListener("focusout", () =>
  queueMicrotask(updateServicesPlayback),
);
servicesTrack.addEventListener("dragstart", (event) => event.preventDefault());
document.addEventListener("visibilitychange", updateServicesPlayback);
reducedMotion.addEventListener("change", updateServicesPlayback);
window.addEventListener("resize", updateServicesPlayback, { passive: true });
if ("ResizeObserver" in window)
  new ResizeObserver(updateServicesPlayback).observe(servicesTrack);
if ("IntersectionObserver" in window) {
  new IntersectionObserver(
    (entries) => {
      servicesVisible = entries[0].isIntersecting;
      updateServicesPlayback();
    },
    { threshold: 0.1 },
  ).observe(servicesTrack);
} else {
  servicesVisible = true;
}
updateServicesPlayback();
if (
  "IntersectionObserver" in window &&
  typeof Element.prototype.animate === "function"
) {
  const runningAnimations = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (reducedMotion.matches) return;
        const animation = entry.target.animate(
          [
            { opacity: 0.35, transform: "translateY(26px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" },
        );
        runningAnimations.add(animation);
        animation.onfinish = () => runningAnimations.delete(animation);
        animation.oncancel = () => runningAnimations.delete(animation);
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(
      ".intro, .section-heading, .about-grid>div, .demo-photo, .process-grid article, .stat, .price-card, .faq-section>div, .closing .container",
    )
    .forEach((element) => observer.observe(element));
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches)
      runningAnimations.forEach((animation) => animation.cancel());
  });
}
