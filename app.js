// Minimal Pomodoro (same behavior, leaner style)
const minsEl = document.querySelector('.minutes');
const secsEl = document.querySelector('.seconds');
const msgEl  = document.querySelector('.app-message');
const label  = document.querySelector('.mode-label');
const ring   = document.querySelector('.progress-ring__circle');

const r = 94, circ = 2 * Math.PI * r;
ring.style.strokeDasharray = `${circ} ${circ}`;
ring.style.strokeDashoffset = `${circ}`;

const durations = { session: 25*60, shortBreak: 5*60, longBreak: 15*60 };
const longBreakEvery = 4;

let mode = 'session';
let sessionsDone = 0;
let remaining = durations.session;
let timer = null;

function pad(n){ return String(n).padStart(2,'0'); }
function updateUI() {
  minsEl.textContent = pad(Math.floor(remaining/60));
  secsEl.textContent = pad(remaining%60);
  label.textContent = mode === 'session' ? 'Session' : (mode === 'shortBreak' ? 'Short Break' : 'Long Break');
  document.body.classList.toggle('break-mode', mode !== 'session');
  document.body.classList.toggle('session-mode', mode === 'session');
  const offset = circ * (remaining / durations[mode]);
  ring.style.strokeDashoffset = `${offset}`;
  ring.classList.toggle('pulse', remaining <= 10 && remaining > 0);
}

function next() {
  if (mode === 'session') {
    sessionsDone++;
    const longBreak = sessionsDone % longBreakEvery === 0;
    mode = longBreak ? 'longBreak' : 'shortBreak';
  } else {
    mode = 'session';
  }
  remaining = durations[mode];
  updateUI();
  msgEl.textContent = mode === 'session' ? '' : '';
}

function start() {
  if (timer) return;
  msgEl.textContent = '';
  timer = setInterval(() => {
    remaining = Math.max(remaining - 1, 0);
    updateUI();
    if (remaining === 0) {
      clearInterval(timer); timer = null;
      setTimeout(() => { next(); start(); }, 800); // auto-advance
    }
  }, 1000);
}

function pause(){ if (timer) { clearInterval(timer); timer = null; msgEl.textContent = 'paused'; } }
function reset(){ clearInterval(timer); timer = null; sessionsDone = 0; mode = 'session'; remaining = durations.session; msgEl.textContent='press start to begin'; updateUI(); }

document.querySelector('.btn-start').addEventListener('click', start);
document.querySelector('.btn-pause').addEventListener('click', pause);
document.querySelector('.btn-next') .addEventListener('click', () => { pause(); next(); });
document.querySelector('.btn-reset').addEventListener('click', reset);

updateUI();
msgEl.textContent = 'press start to begin';
