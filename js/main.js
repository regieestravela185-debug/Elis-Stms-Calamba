const nav = document.querySelector(".nav");
const links = document.querySelector(".nav-links");
const menuBtn = document.querySelector(".menu-btn");

menuBtn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

links.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    links.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 8);
}, { passive: true });

const sections = [...document.querySelectorAll("main section[id]")];
const navAnchors = [...links.querySelectorAll("a[href^='#']")];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach((anchor) => {
      anchor.classList.toggle("active", anchor.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((section) => spy.observe(section));

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (motionOk) {
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        seen.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll(".observe").forEach((node) => seen.observe(node));
} else {
  document.querySelectorAll(".observe").forEach((node) => node.classList.add("in"));
}

const counters = document.querySelectorAll("[data-count]");
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || "";
    if (!motionOk) {
      el.textContent = target.toFixed(decimals) + suffix;
      countObserver.unobserve(el);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach((node) => countObserver.observe(node));

const shots = [
  {
    src: "assets/img/home-listing.jpg",
    title: "Public homepage and unit listing",
    text: "Prospective tenants browse Elis Business Center and its residential buildings from the public site, then register or sign in. This is the deployed homepage."
  },
  {
    src: "assets/img/tenant-dashboard.jpg",
    title: "Tenant dashboard",
    text: "A registered tenant sees contract status, lease progress, open concerns, and the next payment from the tenant portal."
  },
  {
    src: "assets/img/tenant-payments.jpg",
    title: "Tenant payments",
    text: "The tenant payment page shows the monthly bill, rent and utility breakdown, and payment history. Collection still happens outside the system."
  },
  {
    src: "assets/img/admin-dashboard.jpg",
    title: "Administrator dashboard",
    text: "The administrator dashboard reports occupancy, recorded rent, and outstanding accounts, and lists concerns that need attention."
  },
  {
    src: "assets/img/admin-payments.jpg",
    title: "Payments management",
    text: "Confirmed payments are checked against the hash-chained ledger. The page also lists tenants without a recorded payment for the current cycle and proofs waiting for review."
  },
  {
    src: "assets/img/floor-plan.jpg",
    title: "Interactive floor plan",
    text: "Units across the five buildings are shown by status: available, occupied, reserved, or unpaid. Live updates refresh open pages when a status changes."
  }
];

const shotButtons = document.querySelectorAll(".shot-list button");
const shotImage = document.querySelector("#shot-image");
const shotCaption = document.querySelector("#shot-caption");

function showShot(index) {
  const shot = shots[index];
  shotImage.src = shot.src;
  shotImage.alt = shot.title;
  shotCaption.textContent = shot.text;
  shotButtons.forEach((button, i) => {
    button.classList.toggle("active", i === index);
    button.setAttribute("aria-selected", String(i === index));
  });
}

shotButtons.forEach((button) => {
  button.addEventListener("click", () => showShot(Number(button.dataset.index)));
});

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
shotImage.addEventListener("click", () => {
  lightboxImage.src = shotImage.src;
  lightboxImage.alt = shotImage.alt;
  lightbox.classList.add("open");
});
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.closest("button")) lightbox.classList.remove("open");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") lightbox.classList.remove("open");
});
