const storageKey = "whitelister-theme";
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = themeToggle?.querySelector(".theme-toggle__icon");
const titleToggle = document.getElementById("titleToggle");
const year = document.getElementById("year");
const titleCycle = document.getElementById("titleCycle");
const titleTextEl = document.getElementById("titleText");
const titleText = "Whitelister";
const titleFonts = [
  "title-font-1",
  "title-font-2",
  "title-font-3",
  "title-font-4",
  "title-font-5",
  "title-font-6",
  "title-font-7"
];

let titlePaused = false;
let pauseResolve = null;

function getInitialTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(storageKey);
  } catch (error) {}
  if (saved === "day" || saved === "night") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "day" : "night";
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", theme === "day" ? "true" : "false");
  }
  if (themeToggleIcon) {
    themeToggleIcon.textContent = theme === "day" ? "☀" : "☾";
  }
  try {
    localStorage.setItem(storageKey, theme);
  } catch (error) {}
}

function animateThemeToggle() {
  if (!themeToggle) return;
  themeToggle.classList.remove("is-animating");
  void themeToggle.offsetWidth;
  themeToggle.classList.add("is-animating");
  window.setTimeout(() => themeToggle.classList.remove("is-animating"), 240);
}

function updateTitleToggle() {
  if (!titleToggle) return;
  titleToggle.textContent = titlePaused ? "▶" : "❚❚";
  titleToggle.setAttribute("aria-label", titlePaused ? "Play title animation" : "Pause title animation");
  titleToggle.setAttribute("aria-pressed", titlePaused ? "true" : "false");
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function waitWithPause(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    if (titlePaused) {
      await new Promise((resolve) => {
        pauseResolve = resolve;
      });
    }

    const remaining = ms - (Date.now() - start);
    if (remaining <= 0) break;
    await sleep(Math.min(remaining, 50));
  }
}

function setTitleState(paused) {
  titlePaused = paused;
  if (!paused && pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
  updateTitleToggle();
}

async function typeText(target, text) {
  target.textContent = "";
  for (let index = 0; index < text.length; index += 1) {
    await waitWithPause(120);
    target.textContent = text.slice(0, index + 1);
  }
}

async function eraseText(target) {
  for (let index = target.textContent.length; index >= 0; index -= 1) {
    await waitWithPause(70);
    target.textContent = target.textContent.slice(0, index);
  }
}

async function runTitleCycle(container, target) {
  let fontIndex = 0;

  while (true) {
    const fontClass = titleFonts[fontIndex % titleFonts.length];
    container.className = `section-heading title-cycle ${fontClass}`;

    await typeText(target, titleText);
    await waitWithPause(9000);
    await eraseText(target);
    await waitWithPause(200);

    fontIndex += 1;
  }
}

applyTheme(getInitialTheme());

if (year) {
  year.textContent = new Date().getFullYear();
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "day" ? "night" : "day";
    animateThemeToggle();
    applyTheme(nextTheme);
  });
}

if (titleToggle) {
  titleToggle.addEventListener("click", () => {
    setTitleState(!titlePaused);
  });
}

if (titleCycle) {
  updateTitleToggle();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    titleCycle.className = "section-heading title-cycle title-font-1";
    if (titleTextEl) {
      titleTextEl.textContent = titleText;
    }
    if (titleToggle) {
      titleToggle.hidden = true;
    }
  } else {
    if (titleTextEl) {
      runTitleCycle(titleCycle, titleTextEl);
    }
  }
}
