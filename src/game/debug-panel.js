// Debug panel — togglable GUI for playtesting
// Press ` (backtick) to show/hide

const debugState = {
  noFail: true,
  showLogs: true,
  unlimitedShots: true,
  maxAvgDisplacement: 1.5,
  heavyImpulse: 5.0,
  heavyMaxDisplacement: 8.0,
};

let panel = null;
let visible = false;

let shotNumber = 0;

export function getDebugState() {
  return debugState;
}

export function logShot(outcome, avgDisplacement, precariousness) {
  shotNumber++;
  const el = document.getElementById('dbg-shot-entries');
  if (!el) return;

  const stability = Math.round((1 - precariousness) * 100);
  const color = stability >= 70 ? '#5cb85c' : stability >= 40 ? '#f0ad4e' : '#d9534f';
  const tag = outcome === 'landed' ? '<span style="color:#5cb85c">landed</span>'
    : outcome === 'miss' ? '<span style="color:#888">miss</span>'
    : outcome === 'topple' ? '<span style="color:#d9534f">topple</span>'
    : '<span style="color:#d9534f">knockoff</span>';

  const entry = document.createElement('div');
  entry.style.marginBottom = '2px';
  entry.innerHTML = `#${shotNumber} ${tag} — <span style="color:${color}">${stability}%</span> <span style="color:#666">(avg ${avgDisplacement.toFixed(2)}m)</span>`;
  el.appendChild(entry);
  el.scrollTop = el.scrollHeight;
}

export function resetShotLog() {
  shotNumber = 0;
  const el = document.getElementById('dbg-shot-entries');
  if (el) el.innerHTML = '';
}

export function initDebugPanel() {
  panel = document.createElement('div');
  panel.id = 'debug-panel';
  panel.innerHTML = `
    <style>
      #debug-panel {
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.85);
        color: #ccc;
        font: 12px monospace;
        padding: 12px;
        border-radius: 6px;
        border: 1px solid #444;
        z-index: 1000;
        min-width: 220px;
      }
      #debug-panel.hidden { display: none; }
      #debug-panel h3 {
        margin: 0 0 8px 0;
        color: #f0ad4e;
        font-size: 13px;
      }
      #debug-panel label {
        display: block;
        margin: 6px 0;
        cursor: pointer;
      }
      #debug-panel label:hover { color: #fff; }
      #debug-panel input[type="checkbox"] {
        margin-right: 6px;
        accent-color: #f0ad4e;
      }
      #debug-panel .slider-row {
        margin: 8px 0;
      }
      #debug-panel .slider-row span {
        display: block;
        margin-bottom: 2px;
        color: #999;
        font-size: 11px;
      }
      #debug-panel input[type="range"] {
        width: 100%;
        accent-color: #f0ad4e;
      }
      #debug-panel .slider-value {
        color: #f0ad4e;
        float: right;
      }
      #debug-panel .hint {
        margin-top: 10px;
        color: #666;
        font-size: 10px;
        border-top: 1px solid #333;
        padding-top: 6px;
      }
    </style>
    <h3>DEBUG</h3>

    <label>
      <input type="checkbox" id="dbg-no-fail" checked>
      No fail (skip miss/topple)
    </label>
    <label>
      <input type="checkbox" id="dbg-unlimited" checked>
      Unlimited shots
    </label>
    <label>
      <input type="checkbox" id="dbg-logs" checked>
      Console logging
    </label>

    <div class="slider-row">
      <span>Stability sensitivity <span class="slider-value" id="dbg-max-disp-val">1.5</span></span>
      <input type="range" id="dbg-max-disp" min="0.5" max="5.0" step="0.1" value="1.5">
    </div>

    <div class="slider-row">
      <span>Integrity impulse <span class="slider-value" id="dbg-impulse-val">5.0</span></span>
      <input type="range" id="dbg-impulse" min="1.0" max="15.0" step="0.5" value="5.0">
    </div>

    <div class="slider-row">
      <span>Integrity max disp <span class="slider-value" id="dbg-heavy-disp-val">8.0</span></span>
      <input type="range" id="dbg-heavy-disp" min="2.0" max="20.0" step="0.5" value="8.0">
    </div>

    <div id="dbg-shot-log" style="margin-top: 10px; border-top: 1px solid #333; padding-top: 6px;">
      <div style="color: #999; font-size: 11px; margin-bottom: 4px;">Shot log</div>
      <div id="dbg-shot-entries" style="font-size: 11px; max-height: 120px; overflow-y: auto;"></div>
    </div>

    <div class="hint">Press \` to toggle this panel</div>
  `;
  document.body.appendChild(panel);

  // Checkbox bindings
  bind('dbg-no-fail', 'noFail');
  bind('dbg-unlimited', 'unlimitedShots');
  bind('dbg-logs', 'showLogs');

  // Slider bindings
  bindSlider('dbg-max-disp', 'maxAvgDisplacement', 'dbg-max-disp-val');
  bindSlider('dbg-impulse', 'heavyImpulse', 'dbg-impulse-val');
  bindSlider('dbg-heavy-disp', 'heavyMaxDisplacement', 'dbg-heavy-disp-val');

  // Toggle with backtick
  document.addEventListener('keydown', (e) => {
    if (e.key === '`') {
      visible = !visible;
      panel.classList.toggle('hidden', !visible);
    }
  });

  // Start visible
  visible = true;
}

function bind(id, key) {
  const el = document.getElementById(id);
  el.addEventListener('change', () => { debugState[key] = el.checked; });
}

function bindSlider(id, key, valId) {
  const el = document.getElementById(id);
  const valEl = document.getElementById(valId);
  el.addEventListener('input', () => {
    debugState[key] = parseFloat(el.value);
    valEl.textContent = el.value;
  });
}
