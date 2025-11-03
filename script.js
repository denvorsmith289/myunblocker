// === Configuration ===
const WORKER_URL = "https://denvorsmith289myunblocker.denvorsmith289.workers.dev"; // replace with your Worker URL
const TOKEN = "YOUR_SECRET_TOKEN"; // same token used in Worker

const input = document.getElementById("urlInput");
const btn = document.getElementById("goBtn");
const frame = document.getElementById("frame");

// --- derive target from URL path ---
function getTargetFromPath() {
  // Example: /repo/www.google.com
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  return "https://" + parts.slice(1).join("/");
}

async function loadSite(target) {
  const encoded = encodeURIComponent(target);
  const proxied = `${WORKER_URL}?url=${encoded}`;
  try {
    const resp = await fetch(proxied, { headers: { "x-proxy-token": TOKEN } });
    const html = await resp.text();
    frame.srcdoc = html;
  } catch (err) {
    frame.srcdoc = `<h2 style="color:red">Error loading ${target}</h2><p>${err}</p>`;
  }
}

// --- handle "Go" button ---
btn.addEventListener("click", () => {
  let t = input.value.trim();
  if (!t) return alert("Enter a URL");
  if (!/^https?:\/\//i.test(t)) t = "https://" + t;
  history.pushState({}, "", "/" + t.replace(/^https?:\/\//, ""));
  loadSite(t);
});

// --- auto-load on page open ---
window.addEventListener("DOMContentLoaded", () => {
  const t = getTargetFromPath();
  if (t) {
    input.value = t;
    loadSite(t);
  }
});
