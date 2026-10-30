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
const servicesPosition = document.querySelector("#services-position");
const servicesControl = document.querySelector(".services-scroll-control");
let servicesAnimation = 0;
let servicesTarget = 0;

function syncServicesPosition() {
  const maximum = servicesTrack.scrollWidth - servicesTrack.clientWidth;
  servicesControl.hidden = maximum <= 1;
  servicesTrack.classList.toggle("has-scroll-control", maximum > 1);
  const visiblePart = Math.min(
    100,
    (servicesTrack.clientWidth / servicesTrack.scrollWidth) * 100,
  );
  servicesPosition.style.setProperty(
    "--services-thumb-width",
    `${visiblePart}%`,
  );
  const value =
    maximum > 0
      ? Math.round((servicesTrack.scrollLeft / maximum) * 1000) / 10
      : 0;
  if (!servicesAnimation) servicesPosition.value = String(value);
  servicesPosition.setAttribute(
    "aria-valuetext",
    value <= 0
      ? "Début de la liste des services"
      : value >= 100
        ? "Fin de la liste des services"
        : `Position dans les services : ${value} %`,
  );
}
function stopServicesAnimation() {
  cancelAnimationFrame(servicesAnimation);
  servicesAnimation = 0;
}

servicesPosition.addEventListener("input", () => {
  stopServicesAnimation();
  const maximum = servicesTrack.scrollWidth - servicesTrack.clientWidth;
  servicesTarget = (maximum * Number(servicesPosition.value)) / 100;
  if (reducedMotion.matches) {
    servicesTrack.scrollLeft = servicesTarget;
    syncServicesPosition();
    return;
  }

  const start = servicesTrack.scrollLeft;
  const startedAt = performance.now();
  const duration = 220;
  function advance(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    servicesTrack.scrollLeft = start + (servicesTarget - start) * eased;
    if (progress < 1) {
      servicesAnimation = requestAnimationFrame(advance);
    } else {
      servicesAnimation = 0;
      syncServicesPosition();
    }
  }
  servicesAnimation = requestAnimationFrame(advance);
});

// Le geste direct sur les cartes reprend la main sur la barre animée.
for (const event of ["pointerdown", "touchstart", "wheel", "keydown"]) {
  servicesTrack.addEventListener(
    event,
    () => {
      stopServicesAnimation();
      syncServicesPosition();
    },
    { passive: true },
  );
}
servicesTrack.addEventListener("scroll", syncServicesPosition, {
  passive: true,
});
function resizeServices() {
  stopServicesAnimation();
  syncServicesPosition();
}
window.addEventListener("resize", resizeServices, { passive: true });
if ("ResizeObserver" in window)
  new ResizeObserver(resizeServices).observe(servicesTrack);
reducedMotion.addEventListener("change", (event) => {
  if (event.matches && servicesAnimation) {
    stopServicesAnimation();
    servicesTrack.scrollLeft = servicesTarget;
    syncServicesPosition();
  }
});
syncServicesPosition();
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
