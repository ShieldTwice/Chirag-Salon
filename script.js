/* ────────────────────────────────────────────────
   CHIRAG SALON — script.js
──────────────────────────────────────────────── */

"use strict";

/* ── 1. NAV: scroll + burger ── */
const nav    = document.getElementById("nav");
const burger = document.getElementById("burger");
const links  = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  links.classList.toggle("open");
  document.body.style.overflow = links.classList.contains("open") ? "hidden" : "";
});

// Close menu on link click
links.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    links.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* ── 2. REVEAL on scroll ── */
const reveals = document.querySelectorAll(".reveal");

const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

reveals.forEach(el => revealObs.observe(el));

/* ── 3. ACTIVE NAV LINK on scroll ── */
const sections  = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav__links a[href^='#']");

const sectionObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove("active-nav"));
        const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active-nav");
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);
sections.forEach(s => sectionObs.observe(s));

/* ── 4. TIME SLOT SELECTION ── */
const slots     = document.querySelectorAll(".slot");
const slotInput = document.getElementById("timeSlot");

slots.forEach(btn => {
  btn.addEventListener("click", () => {
    slots.forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    slotInput.value = btn.dataset.time;
    // clear error
    document.getElementById("slotErr").classList.remove("visible");
  });
});

/* ── 5. SET MIN DATE TO TODAY ── */
const dateInput = document.getElementById("date");
const today = new Date();
const yyyy  = today.getFullYear();
const mm    = String(today.getMonth() + 1).padStart(2, "0");
const dd    = String(today.getDate()).padStart(2, "0");
dateInput.setAttribute("min", `${yyyy}-${mm}-${dd}`);

/* ── 6. BOOKING FORM VALIDATION + SUBMIT ── */
const form         = document.getElementById("bookingForm");
const successModal = document.getElementById("successModal");
const modalClose   = document.getElementById("modalClose");
const modalMessage = document.getElementById("modalMessage");

function showError(inputEl, errId) {
  inputEl.classList.add("error");
  document.getElementById(errId).classList.add("visible");
}
function clearError(inputEl, errId) {
  inputEl.classList.remove("error");
  document.getElementById(errId).classList.remove("visible");
}

function validatePhone(value) {
  return /^[+]?[\d\s\-().]{10,15}$/.test(value.trim());
}

// Live validation
const nameEl    = document.getElementById("name");
const phoneEl   = document.getElementById("phone");
const serviceEl = document.getElementById("service");

nameEl.addEventListener("input", () => {
  nameEl.value.trim().length >= 2
    ? clearError(nameEl, "nameErr")
    : showError(nameEl, "nameErr");
});
phoneEl.addEventListener("input", () => {
  validatePhone(phoneEl.value)
    ? clearError(phoneEl, "phoneErr")
    : showError(phoneEl, "phoneErr");
});
serviceEl.addEventListener("change", () => {
  serviceEl.value
    ? clearError(serviceEl, "serviceErr")
    : showError(serviceEl, "serviceErr");
});
dateInput.addEventListener("change", () => {
  dateInput.value
    ? clearError(dateInput, "dateErr")
    : showError(dateInput, "dateErr");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  // Name
  if (nameEl.value.trim().length < 2) {
    showError(nameEl, "nameErr"); valid = false;
  } else { clearError(nameEl, "nameErr"); }

  // Phone
  if (!validatePhone(phoneEl.value)) {
    showError(phoneEl, "phoneErr"); valid = false;
  } else { clearError(phoneEl, "phoneErr"); }

  // Service
  if (!serviceEl.value) {
    showError(serviceEl, "serviceErr"); valid = false;
  } else { clearError(serviceEl, "serviceErr"); }

  // Date
  if (!dateInput.value) {
    showError(dateInput, "dateErr"); valid = false;
  } else { clearError(dateInput, "dateErr"); }

  // Time slot
  if (!slotInput.value) {
    document.getElementById("slotErr").classList.add("visible");
    valid = false;
  } else {
    document.getElementById("slotErr").classList.remove("visible");
  }

  if (!valid) return;

  // Build confirmation message
  const serviceLabel = serviceEl.options[serviceEl.selectedIndex].text;
  const dateStr      = new Date(dateInput.value).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  modalMessage.textContent =
    `${nameEl.value.trim()}, your ${serviceLabel} is booked for ${dateStr} at ${slotInput.value}. We'll confirm on ${phoneEl.value.trim()}.`;

  // Show modal
  successModal.classList.add("show");

  // Reset form
  form.reset();
  slots.forEach(s => s.classList.remove("active"));
  slotInput.value = "";
});

modalClose.addEventListener("click", () => {
  successModal.classList.remove("show");
});
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) successModal.classList.remove("show");
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") successModal.classList.remove("show");
});

/* ── 7. PARALLAX HERO ORBS (subtle) ── */
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const orb1 = document.querySelector(".hero__orb--1");
      const orb2 = document.querySelector(".hero__orb--2");
      if (orb1) orb1.style.transform = `translateX(-50%) translateY(${y * .18}px)`;
      if (orb2) orb2.style.transform = `translateY(${-y * .1}px)`;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ── 8. STAGGER SERVICE CARDS ── */
document.querySelectorAll(".service-card.reveal").forEach((card, i) => {
  card.style.setProperty("--delay", `${i * 0.08}s`);
});

/* ── 9. SMOOTH ANCHOR OFFSET (for fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  });
});
