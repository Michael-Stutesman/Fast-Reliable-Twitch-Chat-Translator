let l=null,v=null,u=location.href;
let uid=0;
let chatEl=null;
let currentLanguage = "en";

const SEL = ".text-token,.text-fragment";
const BASE_URL =
  "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&dt=t&tl=";

// 🧭 STATE
let followBottom = true;
let lastAnchor = null;
let tailNode = null;
let anchorDirty = false;

// 🧠 VIEW CACHE
let WIN_H = window.innerHeight;
window.addEventListener("resize", () => WIN_H = window.innerHeight);

// 🧠 pending map
const pending = new Map();

// 🧠 identity system
const messageIdentity = new WeakMap();
let stableId = 0;

// -------------------------
// BATCH SYSTEM
// -------------------------

let batchBuffer = [];
let batchQueue = [];
let activeBatches = 0;

const MAX_BATCH_SIZE = 12;
const MAX_PARALLEL_BATCHES = 6;
const BATCH_WINDOW_MS = 50;

let batchTimer = null;

// -------------------------
// VIEW INTELLIGENCE (IMPROVED)
// -------------------------

const VIEW_TOP_PAD = -60;     // allow slight overscroll above
const VIEW_BOTTOM_PAD = 220;  // look-ahead window

const V = (e) => {
  const r = e.getBoundingClientRect();

  // visible OR about-to-be-visible only
  const inView =
    r.bottom >= VIEW_TOP_PAD &&
    r.top <= WIN_H + VIEW_BOTTOM_PAD;

  return inView;
};

// -------------------------
// STORAGE INIT
// -------------------------

chrome.storage.local.get("isEnabled",e =>
  e.isEnabled ?? chrome.storage.local.set({isEnabled:1})
);

// -------------------------
// IDENTITY
// -------------------------

const getMessageId = (node, text) => {
  let id = messageIdentity.get(node);
  if (id) return id;

  id = text.slice(0,40) + "::" + stableId++;
  messageIdentity.set(node, id);
  return id;
};

// -------------------------
// QUEUE
// -------------------------

const q = (n,t) => {
  const x = n.textContent?.trim();
  if (!x) return;

  const id = getMessageId(n, x);
  if (n.dataset.translatedId === id) return;

  n.dataset.translatedId = id;
  n.dataset.originalText = x;

  pending.set(id, n);

  batchBuffer.push({ id, text: x });

  scheduleBatchFlush();
};

// -------------------------
// FLUSH TIMER
// -------------------------

const scheduleBatchFlush = () => {
  if (batchTimer) return;

  batchTimer = setTimeout(() => {
    flushBatch();
  }, BATCH_WINDOW_MS);
};

// -------------------------
// BUFFER → QUEUE
// -------------------------

const flushBatch = () => {
  batchTimer = null;

  if (!batchBuffer.length) return;

  while (batchBuffer.length) {
    batchQueue.push(batchBuffer.splice(0, MAX_BATCH_SIZE));
  }

  pumpBatches();
};

// -------------------------
// BATCH EXECUTOR
// -------------------------

const pumpBatches = () => {
  while (activeBatches < MAX_PARALLEL_BATCHES && batchQueue.length) {
    runBatch(batchQueue.shift());
  }
};

// -------------------------
// RUN BATCH (with abort-on-out-of-view)
// -------------------------

const runBatch = async (batch) => {
  activeBatches++;

  try {
    for (let i = 0; i < batch.length; i++) {
      const item = batch[i];
      const node = pending.get(item.id);

      // 🔥 ABORT IF NO LONGER EXISTS OR NOT RELEVANT
      if (!node || !document.contains(node)) continue;
      if (!V(node)) continue;

      const wrapped = `⟦${item.id}⟧ ${item.text}`;

      const res = await fetch(
        BASE_URL +
        currentLanguage +
        "&q=" +
        encodeURIComponent(wrapped)
      );

      const d = await res.json();
      const text = (d[0] || []).map(x => x[0]).join("");

      const start = text.indexOf("⟦");
      const end = text.indexOf("⟧");

      if (start !== -1 && end !== -1) {
        const translated = text.slice(end + 1).trim();

        // 🔥 SECOND SAFETY CHECK (mid-flight discard protection)
        if (!V(node)) continue;

        if (node.dataset.translatedId === item.id) {
          node.textContent = translated;

          requestAnimationFrame(() => {
            lastAnchor = getLastMessage();
            applyAnchor();
          });

          tailNode = node;
        }
      }

      anchorDirty = true;
    }
  } catch (e) {
    console.error(e);
  } finally {
    activeBatches--;
    pumpBatches();
  }
};

// -------------------------
// LAST MESSAGE
// -------------------------

const getLastMessage = () => {
  if (!chatEl) return null;
  if (tailNode && document.contains(tailNode)) return tailNode;

  const nodes = chatEl.querySelectorAll(SEL);
  return nodes.length ? nodes[nodes.length - 1] : null;
};

// -------------------------
const isAtBottom = () =>
  chatEl &&
  (chatEl.scrollHeight - chatEl.scrollTop - chatEl.clientHeight < 80);

// -------------------------
const applyAnchor = () => {
  if (!chatEl || !followBottom) return;

  const anchor = lastAnchor || getLastMessage();
  if (!anchor) return;

  anchor.scrollIntoView({ block: "end", behavior: "auto" });

  requestAnimationFrame(() => {
    anchor.scrollIntoView({ block: "end" });
  });
};

// -------------------------
const attachScrollListeners = () => {
  if (!chatEl) return;

  let t;

  const pause = () => {
    followBottom = false;

    clearTimeout(t);
    t = setTimeout(() => {
      followBottom = true;
      applyAnchor();
    }, 250);
  };

  chatEl.addEventListener("wheel", pause, { passive:true });
  chatEl.addEventListener("touchstart", pause, { passive:true });

  chatEl.addEventListener("scroll", () => {
    if (isAtBottom()) followBottom = true;
  }, { passive:true });
};

// -------------------------
M = (c) => {
  if (!c) return null;

  chatEl = c;
  attachScrollListeners();

  const added = [];

  const o = new MutationObserver(m => {
    added.length = 0;

    for (let i = 0; i < m.length; i++) {
      const nodes = m[i].addedNodes;

      for (let j = 0; j < nodes.length; j++) {
        const n = nodes[j];
        if (n.nodeType !== 1) continue;

        if (n.matches(SEL)) added.push(n);
        else {
          const found = n.querySelectorAll(SEL);
          for (let k = 0; k < found.length; k++) {
            added.push(found[k]);
          }
        }
      }
    }

    for (let i = 0; i < added.length; i++) {
      const e = added[i];
      if (V(e)) q(e, currentLanguage);
    }

    anchorDirty = true;
  });

  o.observe(c, { childList:true, subtree:true });
  return o;
};

// -------------------------
S = () =>
  chrome.storage.local.get(["targetLanguage","isEnabled"], d => {
    if (!d.isEnabled) return;

    currentLanguage = d.targetLanguage || "en";

    const el =
      document.querySelector(".sevent7-chat-scroller") ||
      document.querySelector(".chat-scrollable-area__message-container") ||
      document.querySelector(".video-chat__message-list-wrapper");

    if (el) M(el);
  });

// -------------------------
const X = () => {
  l?.disconnect();
  v?.disconnect();

  l = v = null;

  chatEl = null;
  followBottom = true;
  lastAnchor = null;
  tailNode = null;
  anchorDirty = false;

  pending.clear();
  batchBuffer = [];
  batchQueue = [];
  activeBatches = 0;
};

// -------------------------
chrome.runtime.onMessage.addListener(e => {
  if (e.action === "updateState") {
    chrome.storage.local.set({ isEnabled: e.isEnabled }, () =>
      e.isEnabled ? S() : X()
    );
  }

  if (e.action === "updateLanguage") {
    currentLanguage = e.language;
    chrome.storage.local.set({ targetLanguage: e.language });
  }
});

// -------------------------
new MutationObserver(() => {
  if (location.href !== u) {
    u = location.href;
    X();
    S();
  }
}).observe(document, { childList:true, subtree:true });

S();
