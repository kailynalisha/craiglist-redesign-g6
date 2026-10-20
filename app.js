/* =========================================================
   craigslist redesign — shared behavior for every page
   ========================================================= */

/* ---------- DATA ---------- */
const CATEGORIES = {
  "for-sale": { label: "For Sale", icon: "assets/icon-for-sale.svg" },
  services: { label: "Services", icon: "assets/icon-for-sale.svg" },
  jobs: { label: "Jobs", icon: "assets/icon-jobs.svg" },
  community: { label: "Community", icon: "assets/icon-people.svg" },
  discussion: { label: "Discussion", icon: "assets/icon-people.svg" },
  events: { label: "Events", icon: "assets/icon-people.svg" },
};

const LOREM = [
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.",
];

// Listings come straight from the Figma search-result frames.
const LISTINGS = [
  { id: 1, title: "Scooter in progress!", heading: "Scooter", price: 120, category: "for-sale", area: "NoDa", posted: "2d ago", postedLong: "4 days ago", miles: 1, keywords: "scooter" },
  { id: 2, title: "Bike", price: 350, category: "for-sale", area: "Plaza Midwood", posted: "10h ago", postedLong: "10 hours ago", miles: 3, keywords: "scooter bike bicycle" },
  { id: 3, title: "Chair", price: 5, category: "for-sale", area: "NoDa", posted: "11h ago", postedLong: "11 hours ago", miles: 1, keywords: "scooter chair furniture" },
  { id: 4, title: "Snowboard", price: 500, category: "for-sale", area: "Uptown", posted: "2h ago", postedLong: "2 hours ago", miles: 4, keywords: "scooter snowboard" },
  { id: 5, title: "Vintage Film Camera", price: 100, category: "for-sale", area: "Fort Mill", posted: "1h ago", postedLong: "1 hour ago", miles: 18, keywords: "scooter camera film" },
  { id: 6, title: "Casio Keyboard", price: 65, category: "for-sale", area: "NoDa", posted: "1d ago", postedLong: "1 day ago", miles: 1, keywords: "scooter keyboard piano music" },
  { id: 7, title: "Golden puppy", price: 120, category: "for-sale", area: "NoDa", posted: "2d ago", postedLong: "2 days ago", miles: 1, keywords: "golden retriever dog puppy" },
  { id: 8, title: "golden retriever", price: 143.08, category: "for-sale", area: "Plaza Midwood", posted: "10h ago", postedLong: "4 days ago", miles: 3, keywords: "golden retriever dog" },
  { id: 9, title: "golden retriever discussion", price: 5, category: "discussion", area: "NoDa", posted: "11h ago", postedLong: "11 hours ago", miles: 1, keywords: "golden retriever dog" },
  { id: 10, title: "looking for puppy sitter", price: 500, category: "jobs", area: "Uptown", posted: "2h ago", postedLong: "2 hours ago", miles: 4, keywords: "golden retriever dog puppy sitter" },
  { id: 11, title: "lightly used dog bowl", price: 100, category: "for-sale", area: "Fort Mill", posted: "1h ago", postedLong: "1 hour ago", miles: 18, keywords: "golden retriever dog bowl" },
  { id: 12, title: "lost golden retriever at noda?", price: 65, category: "community", area: "NoDa", posted: "1d ago", postedLong: "1 day ago", miles: 1, keywords: "golden retriever dog lost" },
];

const SUGGESTIONS = ["scooter", "golden retriever"];

const params = new URLSearchParams(location.search);

/* ---------- HELPERS ---------- */
function formatPrice(price) {
  return "$" + (Number.isInteger(price) ? price : price.toFixed(2));
}

function findListing(id) {
  return LISTINGS.find((item) => item.id === Number(id));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function img(src, className = "") {
  const node = document.createElement("img");
  node.src = src;
  node.alt = "";
  node.className = className;
  return node;
}

/* ---------- THEME ---------- */
function getTheme() {
  try {
    return localStorage.getItem("theme") || "light";
  } catch {
    return "light";
  }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* private mode — theme just won't persist */
  }
  document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
    toggle.setAttribute("aria-checked", String(theme === "dark"));
  });
  document.querySelectorAll("[data-theme-label]").forEach((label) => {
    label.textContent = theme === "dark" ? "Dark theme is on" : "Light theme is on";
  });
}

function toggleMarkup() {
  return '<button class="toggle" type="button" role="switch" aria-label="Dark mode" data-theme-toggle><span class="toggle__knob"></span></button>';
}

/* ---------- MENU DRAWER ---------- */
function buildDrawer() {
  const page = document.body.dataset.page;
  const drawer = el("div", "drawer");
  drawer.id = "menu";
  drawer.innerHTML = `
    <button class="drawer__scrim" type="button" aria-label="Close menu" data-close-menu></button>
    <nav class="drawer__panel" aria-label="Main menu" role="dialog" aria-modal="true">
      <p class="drawer__title">Menu</p>
      <a class="drawer__link" href="index.html" ${page === "home" ? 'aria-current="page"' : ""}>Home</a>
      <a class="drawer__link" href="search.html?category=for-sale">For Sale</a>
      <a class="drawer__link" href="contact.html" ${page === "contact" ? 'aria-current="page"' : ""}>Contact Seller</a>
      <hr class="drawer__divider" />
      <p class="drawer__section">SETTINGS</p>
      <div class="drawer__row">
        <div>
          <strong>Dark mode</strong>
          <small data-theme-label>Light theme is on</small>
        </div>
        ${toggleMarkup()}
      </div>
    </nav>`;
  document.body.append(drawer);

  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    drawer.classList.add("is-open");
    document.querySelectorAll("[data-open-menu]").forEach((b) => b.setAttribute("aria-expanded", "true"));
    drawer.querySelector(".drawer__link").focus();
  }

  function close() {
    drawer.classList.remove("is-open");
    document.querySelectorAll("[data-open-menu]").forEach((b) => b.setAttribute("aria-expanded", "false"));
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll("[data-open-menu]").forEach((button) => {
    button.setAttribute("aria-controls", "menu");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", open);
  });
  drawer.querySelector("[data-close-menu]").addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) close();
  });
}

/* ---------- SEARCH FIELD + SUGGESTIONS ---------- */
function setupSearch(form) {
  const input = form.querySelector(".search__input");
  const clear = form.querySelector(".search__clear");
  const list = el("ul", "suggestions");
  list.hidden = true;
  list.id = "suggestions-" + Math.random().toString(36).slice(2, 7);
  list.append(el("li", "suggestions__label", "Popular searches"));
  SUGGESTIONS.forEach((term) => {
    const li = el("li");
    const link = el("a", "", term);
    link.href = "search.html?q=" + encodeURIComponent(term);
    li.append(link);
    list.append(li);
  });
  form.append(list);
  input.setAttribute("aria-controls", list.id);

  const current = params.get("q");
  if (current && document.body.dataset.page === "search") input.value = current;

  function sync() {
    form.classList.toggle("has-text", input.value.length > 0);
  }
  sync();

  input.addEventListener("input", sync);
  input.addEventListener("focus", () => {
    list.hidden = false;
  });
  clear.addEventListener("click", () => {
    input.value = "";
    sync();
    input.focus();
  });
  // close when focus or clicks leave the form
  form.addEventListener("focusout", (event) => {
    if (!form.contains(event.relatedTarget)) list.hidden = true;
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      list.hidden = true;
    }
  });
  form.addEventListener("submit", (event) => {
    if (!input.value.trim()) {
      event.preventDefault();
      input.focus();
    }
  });
}

/* ---------- BACK BUTTONS ---------- */
function setupBackButtons() {
  document.querySelectorAll("[data-back]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const cameFromSite = document.referrer && new URL(document.referrer).origin === location.origin;
      if (cameFromSite && history.length > 1) {
        event.preventDefault();
        history.back();
      }
    });
  });
}

/* ---------- LISTING CARD ---------- */
function listingCard(item) {
  const li = el("li");
  const link = el("a", "listing-card");
  link.href = "listing.html?id=" + item.id;

  const thumb = el("div", "listing-card__thumb");
  thumb.append(img(CATEGORIES[item.category].icon, "icon"));

  const body = el("div", "listing-card__body");
  const meta = el("p", "listing-card__meta");
  meta.append(img("assets/icon-location.svg", "icon-muted"), document.createTextNode(`${item.area} · ${item.posted}`));
  body.append(el("p", "listing-card__price", formatPrice(item.price)), el("h2", "listing-card__title", item.title), meta);

  link.append(thumb, body);
  li.append(link);
  return li;
}

/* ---------- PAGE: SEARCH RESULTS ---------- */
function initSearchPage() {
  const query = (params.get("q") || "").trim();
  const startCategory = params.get("category");
  const heading = document.getElementById("results-heading");
  const grid = document.getElementById("results-grid");
  const count = document.getElementById("results-count");
  const loading = document.getElementById("loading");
  const results = document.getElementById("results-page");
  const sortButton = document.getElementById("sort");

  const state = {
    category: CATEGORIES[startCategory] ? startCategory : null,
    distance: null,
    price: null,
    sort: null,
  };

  const PRICE_RANGES = {
    under50: (p) => p < 50,
    "50to200": (p) => p >= 50 && p <= 200,
    over200: (p) => p > 200,
  };

  if (query) {
    heading.textContent = `Search Results for: ${query}`;
    document.title = `${query} — craigslist`;
    document.getElementById("loading-query").textContent = query;
  } else if (state.category) {
    heading.textContent = CATEGORIES[state.category].label;
    document.title = `${CATEGORIES[state.category].label} — craigslist`;
    document.getElementById("loading-query").textContent = CATEGORIES[state.category].label;
  } else {
    heading.textContent = "All listings";
  }

  function matches(item) {
    if (query) {
      const words = query.toLowerCase().split(/\s+/);
      const haystack = `${item.title} ${item.keywords}`.toLowerCase();
      if (!words.every((word) => haystack.includes(word))) return false;
    }
    if (state.category && item.category !== state.category) return false;
    if (state.distance && item.miles > Number(state.distance)) return false;
    if (state.price && !PRICE_RANGES[state.price](item.price)) return false;
    return true;
  }

  function render() {
    let items = LISTINGS.filter(matches);
    if (state.sort === "asc") items = [...items].sort((a, b) => a.price - b.price);
    if (state.sort === "desc") items = [...items].sort((a, b) => b.price - a.price);

    grid.replaceChildren(...items.map(listingCard));
    count.textContent = `${items.length} result${items.length === 1 ? "" : "s"}`;

    if (items.length === 0) {
      const empty = el("li", "empty-state");
      empty.style.gridColumn = "1 / -1";
      empty.append(el("strong", "", "No listings found"), document.createTextNode("Try a different search or clear a filter."));
      grid.append(empty);
    }
  }

  // filter chips: one choice per group, click again to clear
  document.querySelectorAll("[data-filter]").forEach((chip) => {
    const group = chip.dataset.filter;
    if (state[group] === chip.dataset.value) chip.setAttribute("aria-pressed", "true");
    chip.addEventListener("click", () => {
      const isOn = chip.getAttribute("aria-pressed") === "true";
      document.querySelectorAll(`[data-filter="${group}"]`).forEach((c) => c.setAttribute("aria-pressed", "false"));
      state[group] = isOn ? null : chip.dataset.value;
      if (!isOn) chip.setAttribute("aria-pressed", "true");
      render();
    });
  });

  // filter group headers expand / collapse
  document.querySelectorAll(".filter-group__header").forEach((header) => {
    const panel = document.getElementById(header.getAttribute("aria-controls"));
    header.addEventListener("click", () => {
      const expanded = header.getAttribute("aria-expanded") === "true";
      header.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });

  // sort cycles: none → low to high → high to low
  sortButton.addEventListener("click", () => {
    state.sort = state.sort === null ? "asc" : state.sort === "asc" ? "desc" : null;
    sortButton.textContent = state.sort === "asc" ? "Price: Low → High" : state.sort === "desc" ? "Price: High → Low" : "Sort";
    render();
  });

  // brief loading state, like the "Mobile - Loading" frame
  setTimeout(() => {
    loading.hidden = true;
    results.hidden = false;
    render();
  }, 700);
}

/* ---------- PAGE: LISTING DETAILS ---------- */
function initListingPage() {
  const item = findListing(params.get("id")) || LISTINGS[0];
  const category = CATEGORIES[item.category];
  const heading = item.heading || item.title;

  document.title = `${heading} — craigslist`;
  document.getElementById("listing-title").textContent = heading;
  document.getElementById("listing-price").textContent = formatPrice(item.price);
  document.getElementById("listing-meta").textContent = `${category.label} · Condition: n/a · Posted ${item.postedLong}`;
  document.getElementById("listing-tag").textContent = category.label;
  document.getElementById("listing-posted").textContent = item.postedLong;
  document.getElementById("listing-icon").src = category.icon.replace("icon-for-sale.svg", "icon-for-sale-lg.svg");
  document.getElementById("listing-desc").replaceChildren(...LOREM.map((text) => el("p", "", text)));

  document.querySelectorAll("[data-contact-link]").forEach((link) => {
    link.href = "contact.html?id=" + item.id;
  });
}

/* ---------- PAGE: CONTACT SELLER ---------- */
function initContactPage() {
  const item = findListing(params.get("id"));
  const form = document.getElementById("message-form");
  const field = document.getElementById("message");
  const counter = document.getElementById("message-count");
  const error = document.getElementById("message-error");
  const dialog = document.getElementById("sent-dialog");
  const max = Number(field.getAttribute("maxlength"));

  if (item) {
    const about = document.getElementById("contact-about");
    const link = el("a", "", item.heading || item.title);
    link.href = "listing.html?id=" + item.id;
    about.append("About: ", link, ` · ${formatPrice(item.price)}`);
    about.hidden = false;
  }

  function updateCount() {
    counter.textContent = `${field.value.length}/${max} characters`;
  }
  updateCount();

  field.addEventListener("input", () => {
    updateCount();
    if (field.value.trim()) {
      form.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
      error.hidden = true;
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!field.value.trim()) {
      form.classList.add("has-error");
      field.setAttribute("aria-invalid", "true");
      error.hidden = false;
      field.focus();
      return;
    }
    field.value = "";
    updateCount();
    dialog.showModal();
  });

  dialog.querySelector("[data-done]").addEventListener("click", () => {
    location.href = item ? "listing.html?id=" + item.id : "index.html";
  });
}

/* ---------- START ---------- */
document.querySelectorAll("[data-theme-slot]").forEach((slot) => {
  slot.innerHTML = toggleMarkup();
});
buildDrawer();
setTheme(getTheme());
document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
});
document.querySelectorAll(".search").forEach(setupSearch);
setupBackButtons();

const pageInit = {
  search: initSearchPage,
  listing: initListingPage,
  contact: initContactPage,
};
pageInit[document.body.dataset.page]?.();
