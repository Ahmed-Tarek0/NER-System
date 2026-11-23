const COLORS = { PER: "var(--per)", ORG: "var(--org)", LOC: "var(--loc)", MISC: "var(--misc)" };

const EXAMPLES = [
  "Barack Obama visited Microsoft headquarters in Seattle last Monday, then flew to Cairo with Google executives.",
  "Cristiano Ronaldo signed with Al Nassr in Riyadh before the World Cup in Qatar.",
  "Marie Curie won the Nobel Prize while working at the Sorbonne in Paris.",
  "Amazon and the United Nations opened a new office in Geneva on Friday.",
  "Lionel Messi joined Inter Miami after years playing for Barcelona in Spain.",
];

const input = document.getElementById("input-text");
const analyzeBtn = document.getElementById("analyze-btn");
const clearBtn = document.getElementById("clear-btn");
const tryBtn = document.getElementById("try-btn");
const status = document.getElementById("status");
const output = document.getElementById("output");

let lastExampleIndex = -1;

function pickExample() {
  let idx;
  do {
    idx = Math.floor(Math.random() * EXAMPLES.length);
  } while (idx === lastExampleIndex && EXAMPLES.length > 1);
  lastExampleIndex = idx;
  return EXAMPLES[idx];
}

function autoGrow() {
  input.style.height = "auto";
  input.style.height = `${input.scrollHeight}px`;
}

function syncButtonState() {
  analyzeBtn.disabled = input.value.trim().length === 0;
}

async function analyze() {
  const text = input.value.trim();
  if (!text) {
    setStatus("Type a sentence first.", true);
    return;
  }

  setStatus("Analyzing…", false);
  analyzeBtn.disabled = true;
  output.innerHTML = "";

  try {
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);

    const data = await res.json();
    render(data.text, data.entities);
    setStatus(
      data.entities.length
        ? `${data.entities.length} ${data.entities.length === 1 ? "entity" : "entities"} found`
        : "No entities found",
      false
    );
  } catch (err) {
    setStatus("Couldn't reach the server. Make sure the API is running.", true);
    console.error(err);
  } finally {
    syncButtonState();
  }
}

function clearAll() {
  input.value = "";
  autoGrow();
  output.innerHTML = "";
  output.classList.remove("show");
  setStatus("", false);
  syncButtonState();
  input.focus();
}

function setStatus(text, isError) {
  status.textContent = text;
  status.classList.toggle("error", isError);
}

function render(text, entities) {
  let html = "";
  let last = 0;
  const sorted = [...entities].sort((a, b) => a.start - b.start);

  for (const e of sorted) {
    html += escapeHtml(text.slice(last, e.start));
    const color = COLORS[e.label] || "var(--muted)";
    html += `<span class="entity" style="--c:${color}">${escapeHtml(text.slice(e.start, e.end))}<sup class="tag">${e.label}</sup></span>`;
    last = e.end;
  }
  html += escapeHtml(text.slice(last));

  output.classList.remove("show");
  output.innerHTML = html;
  void output.offsetWidth; // restart the reveal animation
  output.classList.add("show");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

analyzeBtn.addEventListener("click", analyze);
clearBtn.addEventListener("click", clearAll);
tryBtn.addEventListener("click", () => {
  input.value = pickExample();
  autoGrow();
  syncButtonState();
  analyze();
});
input.addEventListener("input", () => {
  autoGrow();
  syncButtonState();
});
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (!analyzeBtn.disabled) analyze();
  }
});

autoGrow();
syncButtonState();
