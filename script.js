/* ============================================================
   Raghad Alharbi — Portfolio
   Everything is declared before boot() runs at the bottom.
   Optional browser APIs are feature-detected, never assumed.
   ============================================================ */

const ME = {
  firstName: 'Raghad', lastName: 'Alharbi', fullName: 'Raghad Sultan Alharbi',
  title: 'Data Analyst & Data Engineer',
  phone: '+966557820184', email: 'ragadsalharbi@gmail.com',
  website: 'https://ragadsalharbi.github.io',
  github: 'https://github.com/ragadsalharbi',
  linkedin: 'https://www.linkedin.com/in/raghad-alharbi-38a61b326/',
  city: 'Riyadh', country: 'Saudi Arabia'
};

const root = document.documentElement;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.prototype.slice.call(r.querySelectorAll(s));
const wait = ms => new Promise(r => setTimeout(r, ms));
const mq = q => (typeof window.matchMedia === 'function' ? window.matchMedia(q) : { matches: false });
const calm = mq('(prefers-reduced-motion: reduce)').matches;

let lang = 'en';

/* ============================================================
   HERO — "messy data in, answers out"
   Dots enter from the left in disorder, pass through a gate,
   and stack into ordered columns on the right.
   ============================================================ */
const COLS = 13;

function startFlow(canvas) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W = 0, H = 0, dots = [], gateX = 0, baseY = 0, colW = 0, chartX = 0;
  const heights = [];
  const stacks = [];

  function readVar(name, fallback) {
    const v = getComputedStyle(root).getPropertyValue(name).trim();
    return v || fallback;
  }

  function measure() {
    const host = canvas.parentElement || canvas;
    const r = host.getBoundingClientRect();
    return {
      w: Math.round(r.width  || host.offsetWidth  || window.innerWidth  || 0),
      h: Math.round(r.height || host.offsetHeight || window.innerHeight || 0)
    };
  }

  function layout() {
    const m = measure();
    if (m.w < 40 || m.h < 40) return false;   // layout not ready — try again next frame
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = m.w; H = m.h;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    gateX  = W * 0.50;
    chartX = W * 0.58;
    colW   = (W * 0.40) / COLS;
    baseY  = H * 0.80;

    heights.length = 0;
    for (let i = 0; i < COLS; i++) {
      // a stable, pleasant profile — rises then tapers
      const t = i / (COLS - 1);
      heights.push(Math.round(4 + 13 * Math.sin(t * Math.PI * 0.92) + (i % 3)));
    }
    stacks.length = 0;
    for (let i = 0; i < COLS; i++) stacks.push(0);
    return true;
  }

  function spawn(i, total) {
    return {
      x: -Math.random() * W * 0.5,
      y: H * (0.12 + Math.random() * 0.72),
      vx: 0.7 + Math.random() * 1.5,
      seed: Math.random() * 1000,
      amp: 10 + Math.random() * 42,
      col: -1, tx: 0, ty: 0,
      state: 'flow',
      r: 1.3 + Math.random() * 1.5,
      delay: (i / total) * 900
    };
  }

  function reset() {
    if (!layout()) return false;
    const total = heights.reduce((a, b) => a + b, 0);
    dots = [];
    for (let i = 0; i < total; i++) dots.push(spawn(i, total));
    for (let i = 0; i < COLS; i++) stacks[i] = 0;
    return true;
  }

  let t0 = performance.now();
  let raf = 0;

  function frame(now) {
    if (!dots.length) {                       // never got a size — keep trying
      if (reset()) t0 = now;
      raf = requestAnimationFrame(frame);
      return;
    }
    const m = measure();                      // box changed (fonts, rotate, svh) — relay out
    if (Math.abs(m.w - W) > 2 || Math.abs(m.h - H) > 2) {
      if (reset()) t0 = now;
      raf = requestAnimationFrame(frame);
      return;
    }
    const elapsed = now - t0;
    ctx.clearRect(0, 0, W, H);

    const teal  = readVar('--teal', '#2DD4BF');
    const ice   = readVar('--ice', '#A5F3FC');
    const alpha = parseFloat(readVar('--flow-a', '0.45')) || 0.45;

    // baseline
    ctx.strokeStyle = readVar('--flow-line', 'rgba(45,212,191,0.22)');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartX - colW * 0.4, baseY + 4);
    ctx.lineTo(chartX + colW * COLS, baseY + 4);
    ctx.stroke();

    let settled = 0;

    for (const d of dots) {
      if (elapsed < d.delay) continue;

      if (d.state === 'flow') {
        d.x += d.vx;
        d.y += Math.sin((d.x + d.seed) * 0.012) * (d.amp * 0.022);

        // funnel toward the gate
        if (d.x > gateX * 0.55) {
          const pull = (d.x - gateX * 0.55) / (gateX * 0.45);
          d.y += (H * 0.5 - d.y) * 0.035 * pull;
        }

        if (d.x >= gateX) {
          // assign the emptiest column that still needs dots
          let best = -1, bestFill = 2;
          for (let i = 0; i < COLS; i++) {
            if (stacks[i] >= heights[i]) continue;
            const fill = stacks[i] / heights[i];
            if (fill < bestFill) { bestFill = fill; best = i; }
          }
          if (best === -1) { d.x = -20; d.y = H * (0.12 + Math.random() * 0.72); continue; }
          d.col = best;
          d.tx = chartX + best * colW + colW * 0.5;
          d.ty = baseY - stacks[best] * 5.2 - 3;
          stacks[best]++;
          d.state = 'settle';
        }

        ctx.globalAlpha = alpha * 0.8;
        ctx.fillStyle = teal;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

      } else {
        d.x += (d.tx - d.x) * 0.10;
        d.y += (d.ty - d.y) * 0.10;
        const near = Math.abs(d.x - d.tx) < 0.8 && Math.abs(d.y - d.ty) < 0.8;
        if (near) settled++;

        ctx.globalAlpha = near ? Math.min(alpha + 0.42, 1) : alpha;
        ctx.fillStyle = near && d.col % 3 === 0 ? ice : teal;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;

    // gate marker
    ctx.strokeStyle = readVar('--flow-line', 'rgba(45,212,191,0.22)');
    ctx.setLineDash([3, 7]);
    ctx.beginPath();
    ctx.moveTo(gateX, H * 0.18);
    ctx.lineTo(gateX, H * 0.82);
    ctx.stroke();
    ctx.setLineDash([]);

    if (settled === dots.length && elapsed > 4000) {
      t0 = now + 2600;
      reset();
    }

    raf = requestAnimationFrame(frame);
  }

  function drawStatic() {
    if (!layout()) { setTimeout(drawStatic, 120); return; }
    ctx.clearRect(0, 0, W, H);
    const teal = readVar('--teal', '#2DD4BF');
    const ice  = readVar('--ice', '#A5F3FC');
    ctx.strokeStyle = readVar('--flow-line', 'rgba(45,212,191,0.22)');
    ctx.beginPath();
    ctx.moveTo(chartX - colW * 0.4, baseY + 4);
    ctx.lineTo(chartX + colW * COLS, baseY + 4);
    ctx.stroke();
    for (let i = 0; i < COLS; i++) {
      for (let n = 0; n < heights[i]; n++) {
        ctx.globalAlpha = parseFloat(readVar('--flow-a','0.45')) * 1.7;
        ctx.fillStyle = i % 3 === 0 ? ice : teal;
        ctx.beginPath();
        ctx.arc(chartX + i * colW + colW * 0.5, baseY - n * 5.2 - 3, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  if (calm || typeof requestAnimationFrame !== 'function' || typeof performance === 'undefined') {
    layout();
    drawStatic();
    window.addEventListener('resize', drawStatic);
    return;
  }

  reset();
  raf = requestAnimationFrame(frame);
  window.addEventListener('load', () => { if (!dots.length) reset(); });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { t0 = performance.now(); reset(); }, 220);
  });

  // pause when the tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else { t0 = performance.now(); reset(); raf = requestAnimationFrame(frame); }
  });
}

/* ============================================================
   SQL CONSOLE
   ============================================================ */
const QUERIES = [
  {
    sql: "SELECT field, value\n  FROM raghad\n WHERE public = true;",
    head: { en: ['field', 'value'], ar: ['الحقل', 'القيمة'] },
    rows: {
      en: [
        ['role',       'Data Analyst & Data Engineer'],
        ['based_in',   'Riyadh, Saudi Arabia'],
        ['degree',     'BSc Computer Science — Umm Al-Qura'],
        ['experience', '5-month enterprise data governance co-op'],
        ['core_stack', 'SQL, Python, Power BI, Informatica CDGC'],
        ['status',     'open to opportunities']
      ],
      ar: [
        ['الدور',   'محلّلة بيانات ومهندسة بيانات'],
        ['المقر',   'الرياض، السعودية'],
        ['الشهادة', 'بكالوريوس علوم حاسب — أم القرى'],
        ['الخبرة',  'تدريب تعاوني ٥ أشهر في حوكمة بيانات مؤسسية'],
        ['الأدوات', 'SQL، Python، Power BI، Informatica CDGC'],
        ['الحالة',  'متاحة للفرص']
      ]
    }
  },
  {
    sql: "SELECT name, domain, year\n  FROM projects\n ORDER BY year DESC\n LIMIT 7;",
    head: { en: ['name', 'domain', 'year'], ar: ['المشروع', 'المجال', 'السنة'] },
    numCol: 2,
    rows: {
      en: [
        ['ubar',                     'realtime / firebase',  '2026'],
        ['sentiment-classification', 'nlp / transformers',   '2026'],
        ['aljamoum-campus-network',  'networking',           '2025'],
        ['spam-detection',           'nlp / classification', '2025'],
        ['video-game-sales',         'regression / bi',      '2025'],
        ['smartsaver',               'backend / mysql',      '2025'],
        ['hospital-database',        'data modelling',       '2023']
      ],
      ar: [
        ['ubar',                     'زمن حقيقي / Firebase', '٢٠٢٦'],
        ['sentiment-classification', 'معالجة لغة',           '٢٠٢٦'],
        ['aljamoum-campus-network',  'شبكات',                '٢٠٢٥'],
        ['spam-detection',           'تصنيف نصوص',           '٢٠٢٥'],
        ['video-game-sales',         'انحدار / تقارير',      '٢٠٢٥'],
        ['smartsaver',               'واجهة خلفية / MySQL',  '٢٠٢٥'],
        ['hospital-database',        'نمذجة بيانات',         '٢٠٢٣']
      ]
    }
  },
  {
    sql: "SELECT area, count(tool) AS tools\n  FROM skills\n GROUP BY area\n ORDER BY tools DESC;",
    head: { en: ['area', 'tools'], ar: ['المجال', 'الأدوات'] },
    numCol: 1,
    rows: {
      en: [
        ['analysis & bi',       '7'],
        ['programming & tools', '7'],
        ['data governance',     '6'],
        ['data engineering',    '6'],
        ['coursework exposure', '5']
      ],
      ar: [
        ['التحليل والتقارير', '٧'],
        ['البرمجة والأدوات',  '٧'],
        ['حوكمة البيانات',    '٦'],
        ['هندسة البيانات',    '٦'],
        ['مواد دراسية',       '٥']
      ]
    }
  },
  {
    sql: "SELECT channel, handle\n  FROM contact\n WHERE reachable = true;",
    head: { en: ['channel', 'handle'], ar: ['القناة', 'المعرّف'] },
    rows: {
      en: [
        ['email',    'ragadsalharbi@gmail.com'],
        ['github',   'github.com/ragadsalharbi'],
        ['linkedin', 'in/raghad-alharbi-38a61b326'],
        ['whatsapp', '+966 55 782 0184'],
        ['location', 'Riyadh, Saudi Arabia']
      ],
      ar: [
        ['البريد',  'ragadsalharbi@gmail.com'],
        ['قتهب',    'github.com/ragadsalharbi'],
        ['لينكدإن', 'in/raghad-alharbi-38a61b326'],
        ['واتساب',  '+966 55 782 0184'],
        ['الموقع',  'الرياض، السعودية']
      ]
    }
  }
];

const KW = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|AS|DESC|true)\b/g;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const highlight = s => esc(s).replace(KW, '<span class="kw">$1</span>')
                             .replace(/\bcount\b/g, '<span class="fn">count</span>');

/* ---------- elements ---------- */
const markBig  = $('#markBig');
const flowEl   = $('#flow');
const sqlEl    = $('#sql');
const caretEl  = $('#caret');
const resultEl = $('#result');
const theadEl  = $('#thead');
const tbodyEl  = $('#tbody');
const metaEl   = $('#meta');
const rerunBtn = $('#rerun');
const tabBtns  = $$('.tab');

const rail      = $('#rail');
const navLinks  = $$('.nav-link');
const themeBtn  = $('#themeBtn');
const langBtn   = $('#langBtn');
const langLabel = $('#langLabel');
const burger    = $('#burger');
const sheet     = $('#sheet');
const filters   = $$('.filter');
const cards     = $$('.card');
const toast     = $('#toast');
const saveBtn   = $('#saveContact');
const yearEl    = $('#year');

let active = 0, runId = 0;

async function runQuery() {
  const id = ++runId;
  const q = QUERIES[active];
  const head = q.head[lang] || q.head.en;
  const rows = q.rows[lang] || q.rows.en;

  resultEl.hidden = true;
  metaEl.classList.remove('is-in');
  theadEl.innerHTML = '';
  tbodyEl.innerHTML = '';
  sqlEl.textContent = '';
  caretEl.hidden = false;

  if (calm) {
    sqlEl.innerHTML = highlight(q.sql);
  } else {
    for (let i = 1; i <= q.sql.length; i++) {
      if (id !== runId) return;
      sqlEl.textContent = q.sql.slice(0, i);
      await wait(q.sql[i - 1] === '\n' ? 85 : 24);
    }
    sqlEl.innerHTML = highlight(q.sql);
    await wait(240);
  }
  if (id !== runId) return;
  caretEl.hidden = true;

  const hr = document.createElement('tr');
  head.forEach(h => { const th = document.createElement('th'); th.textContent = h; hr.appendChild(th); });
  theadEl.appendChild(hr);

  rows.forEach(cells => {
    const tr = document.createElement('tr');
    cells.forEach((c, i) => {
      const td = document.createElement('td');
      td.textContent = c;
      if (q.numCol === i) td.className = 'num';
      tr.appendChild(td);
    });
    tbodyEl.appendChild(tr);
  });

  resultEl.hidden = false;

  for (const tr of $$('tr', tbodyEl)) {
    if (id !== runId) return;
    tr.classList.add('is-in');
    await wait(calm ? 0 : 65);
  }
  if (id !== runId) return;

  const ms = 2 + Math.round(rows.length * 0.7);
  metaEl.textContent = lang === 'ar'
    ? `(${rows.length} صفوف) · ${ms} مللي ثانية`
    : `(${rows.length} rows) · ${ms} ms`;
  metaEl.classList.add('is-in');
}

/* ============ THEME ============ */
function applyTheme(t) {
  root.setAttribute('data-theme', t);
  try { localStorage.setItem('theme', t); } catch (e) {}
}

/* ============ LANGUAGE ============ */
function applyLang(next) {
  lang = next === 'ar' ? 'ar' : 'en';
  const ar = lang === 'ar';

  root.setAttribute('lang', ar ? 'ar' : 'en');
  root.setAttribute('dir', ar ? 'rtl' : 'ltr');

  $$('[data-en]').forEach(el => {
    const v = ar ? el.dataset.ar : el.dataset.en;
    if (v !== undefined) el.innerHTML = v;
  });

  if (langLabel) langLabel.textContent = ar ? 'EN' : 'عربي';
  document.title = ar
    ? 'رغد الحربي — محلّلة بيانات ومهندسة بيانات'
    : 'Raghad Alharbi — Data Analyst & Data Engineer';

  try { localStorage.setItem('lang', lang); } catch (e) {}
  runQuery();
}

/* ============ MENU + TOAST ============ */
function setSheet(open) {
  sheet.hidden = !open;                       // keeps it out of the a11y tree
  sheet.classList.toggle('is-open', open);    // and out of the layout
  burger.setAttribute('aria-expanded', String(open));
}

let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function saveContact() {
  const card = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${ME.lastName};${ME.firstName};;;`, `FN:${ME.fullName}`, `TITLE:${ME.title}`,
    `TEL;TYPE=CELL:${ME.phone}`, `EMAIL;TYPE=INTERNET:${ME.email}`,
    `URL:${ME.website}`, `URL;TYPE=GitHub:${ME.github}`, `URL;TYPE=LinkedIn:${ME.linkedin}`,
    `ADR;TYPE=HOME:;;;${ME.city};;;${ME.country}`, 'END:VCARD'
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([card], { type: 'text/vcard;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'Raghad-Alharbi.vcf';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(lang === 'ar' ? 'تم حفظ جهة الاتصال' : 'Contact saved');
}

/* ============ BOOT ============ */
function boot() {

  if (markBig) {
    $$('path', markBig).forEach(p => {
      if (typeof p.getTotalLength === 'function') {
        p.style.setProperty('--len', Math.ceil(p.getTotalLength()));
      }
    });
    markBig.classList.add('ready');
  }

  let savedTheme = null, savedLang = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  try { savedLang  = localStorage.getItem('lang');  } catch (e) {}
  applyTheme(savedTheme || (mq('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));

  themeBtn.addEventListener('click', () =>
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  langBtn.addEventListener('click', () => applyLang(lang === 'ar' ? 'en' : 'ar'));

  tabBtns.forEach((b, i) => b.addEventListener('click', () => {
    active = i;
    tabBtns.forEach((x, n) => x.classList.toggle('is-active', n === i));
    runQuery();
  }));
  rerunBtn.addEventListener('click', runQuery);

  setSheet(false);
  burger.addEventListener('click', () => setSheet(sheet.hidden));
  window.addEventListener('resize', () => { if (window.innerWidth > 940) setSheet(false); });
  $$('.sheet-link').forEach(l => l.addEventListener('click', () => setSheet(false)));

  filters.forEach(btn => btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filters.forEach(f => f.classList.toggle('is-active', f === btn));
    cards.forEach(c => c.classList.toggle('hide', cat !== 'all' && c.dataset.cat !== cat));
  }));

  saveBtn.addEventListener('click', saveContact);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !sheet.hidden) setSheet(false);
  });

  window.addEventListener('scroll', () => {
    rail.classList.toggle('stuck', window.scrollY > 24);
  }, { passive: true });

  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(l =>
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean).forEach(s => io.observe(s));
  }

  yearEl.textContent = new Date().getFullYear();

  startFlow(flowEl);
  applyLang(savedLang === 'ar' ? 'ar' : 'en');
}

boot();
