let ALL_QUOTES = [];
let activeQuotes = [];
let pool = []; // shuffled indexes (no-repeat until cycle ends)

const btn = document.getElementById("getMsgBtn");
const quoteBox = document.getElementById("quoteBox");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteMeta = document.getElementById("quoteMeta");

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

function showNextQuote() {
  if (activeQuotes.length === 0) {
    quoteText.textContent =
      "No quotes found. Make sure quotes.json has at least 1 quote.";
    quoteAuthor.textContent = "";
    quoteMeta.textContent = "";
    quoteBox.hidden = false;
    return;
  }

  if (pool.length === 0) {
    resetPool();
  }

  const idx = pool.pop();
  const q = activeQuotes[idx];

  quoteText.textContent = q.text;
  quoteAuthor.textContent = q.author ? `— ${q.author}` : "— Unknown";

  const cat = q.category ? `Category: ${q.category}` : "Category: (none)";
  const remaining = pool.length;
  quoteMeta.textContent = `${cat} • Remaining in cycle: ${remaining}`;

  quoteBox.hidden = false;
  btn.textContent = "Get another motivational message";
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

    // Auto-show for QR scans if URL has ?auto=1
    const params = new URLSearchParams(window.location.search);
    if (params.get("auto") === "1") showNextQuote();
  } catch (err) {
    quoteText.textContent =
      "Error loading quotes. Ensure quotes.json is in the same folder as index.html.";
    quoteAuthor.textContent = "";
    quoteMeta.textContent = String(err);
    quoteBox.hidden = false;
  }
}

btn.addEventListener("click", showNextQuote);

init();
