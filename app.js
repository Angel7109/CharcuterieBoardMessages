let ALL_QUOTES = [];
let activeQuotes = [];
let pool = []; // shuffled indexes (no-repeat until cycle ends)
let quoteDisplayed = false;

const btn = document.getElementById("getMsgBtn");
const quoteBox = document.getElementById("quoteBox");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

function shuffle(array) {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function resetPool() {
  activeQuotes = [...ALL_QUOTES];
  pool = shuffle(activeQuotes.map((_, idx) => idx));
}

function lockButton() {
  btn.disabled = true;
  btn.setAttribute("aria-disabled", "true");
  btn.removeEventListener("click", showNextQuote);
  btn.hidden = true;
}

function showNextQuote() {
  if (quoteDisplayed) return;
  quoteDisplayed = true;

  if (activeQuotes.length === 0) {
    quoteText.textContent =
      "No quotes found. Make sure quotes.json has at least 1 quote.";
    quoteAuthor.textContent = "";
    quoteBox.hidden = false;
    lockButton();
    return;
  }

  if (pool.length === 0) {
    resetPool();
  }

  const idx = pool.pop();
  const q = activeQuotes[idx];

  quoteText.textContent = q.text;
  quoteAuthor.textContent = q.author ? `- ${q.author}` : "- Unknown";

  quoteBox.hidden = false;
  lockButton();
}

async function init() {
  try {
    const res = await fetch("./quotes.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Could not load quotes.json (${res.status})`);

    ALL_QUOTES = await res.json();

    // basic validation
    ALL_QUOTES = ALL_QUOTES.filter(
      (q) => q && typeof q.text === "string" && q.text.trim().length > 0
    );

    resetPool();
  } catch (err) {
    quoteText.textContent =
      "Error loading quotes. Ensure quotes.json is in the same folder as index.html.";
    quoteAuthor.textContent = "";
    quoteBox.hidden = false;
  }
}

btn.addEventListener("click", showNextQuote);

init();
