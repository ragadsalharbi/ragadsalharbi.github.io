/* ============================================================
   Raghad Alharbi — Portfolio
   Everything is declared before boot() runs at the bottom.
   Optional browser APIs are feature-detected, never assumed.
   ============================================================ */

const ME = {
  firstName: 'Raghad',
  lastName:  'Alharbi',
  fullName:  'Raghad Sultan Alharbi',
  title:     'Data Analyst & Data Engineer',
  phone:     '+966557820184',
  email:     'ragadsalharbi@gmail.com',
  website:   'https://ragadsalharbi.github.io',
  github:    'https://github.com/ragadsalharbi',
  linkedin:  'https://www.linkedin.com/in/raghad-alharbi-38a61b326/',
  city:      'Riyadh',
  country:   'Saudi Arabia'
};

const root = document.documentElement;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.prototype.slice.call(r.querySelectorAll(s));
const wait = ms => new Promise(r => setTimeout(r, ms));

const calm = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

let lang = 'en';

/* ============ QUERIES ============ */
const QUERIES = [
  {
    sql: {
      en: "SELECT field, value\n  FROM raghad\n WHERE public = true;",
      ar: "SELECT field, value\n  FROM raghad\n WHERE public = true;"
    },
    head: { en: ['field', 'value'], ar: ['الحقل', 'القيمة'] },
    rows: {
      en: [
        ['role',        'Data Analyst & Data Engineer'],
        ['based_in',    'Riyadh, Saudi Arabia'],
        ['degree',      'BSc Computer Science — Umm Al-Qura'],
        ['experience',  '5-month enterprise data governance co-op'],
        ['core_stack',  'SQL, Python, Power BI, Informatica CDGC'],
        ['status',      'open to opportunities']
      ],
      ar: [
        ['الدور',       'محلّلة بيانات ومهندسة بيانات'],
        ['المقر',       'الرياض، السعودية'],
        ['الشهادة',     'بكالوريوس علوم حاسب — أم القرى'],
        ['الخبرة',      'تدريب تعاوني ٥ أشهر في حوكمة بيانات مؤسسية'],
        ['الأدوات',     'SQL، Python، Power BI، Informatica CDGC'],
        ['الحالة',      'متاحة للفرص']
      ]
    }
  },
  {
    sql: {
      en: "SELECT name, domain, year\n  FROM projects\n ORDER BY year DESC\n LIMIT 7;",
      ar: "SELECT name, domain, year\n  FROM projects\n ORDER BY year DESC\n LIMIT 7;"
    },
    head: { en: ['name', 'domain', 'year'], ar: ['المشروع', 'المجال', 'السنة'] },
    rows: {
      en: [
        ['ubar',                'realtime / firebase', '2026'],
        ['sentiment-classification', 'nlp / transformers', '2026'],
        ['aljamoum-campus-network',  'networking',        '2025'],
        ['spam-detection',      'nlp / classification', '2025'],
        ['video-game-sales',    'regression / bi',      '2025'],
        ['smartsaver',          'backend / mysql',      '2025'],
        ['hospital-database',   'data modelling',       '2023']
      ],
      ar: [
        ['ubar',                'زمن حقيقي / Firebase', '2026'],
        ['sentiment-classification', 'معالجة لغة',      '2026'],
        ['aljamoum-campus-network',  'شبكات',           '2025'],
        ['spam-detection',      'تصنيف نصوص',           '2025'],
        ['video-game-sales',    'انحدار / تقارير',      '2025'],
        ['smartsaver',          'واجهة خلفية / MySQL',  '2025'],
        ['hospital-database',   'نمذجة بيانات',         '2023']
      ]
    },
    numCol: 2
  },
  {
    sql: {
      en: "SELECT area, count(tool) AS tools\n  FROM skills\n GROUP BY area\n ORDER BY tools DESC;",
      ar: "SELECT area, count(tool) AS tools\n  FROM skills\n GROUP BY area\n ORDER BY tools DESC;"
    },
    head: { en: ['area', 'tools'], ar: ['المجال', 'الأدوات'] },
    rows: {
      en: [
        ['data governance',        '6'],
        ['data engineering',       '6'],
        ['analysis & bi',          '7'],
        ['programming & tools',    '7'],
        ['coursework exposure',    '5']
      ],
      ar: [
        ['حوكمة البيانات',   '٦'],
        ['هندسة البيانات',   '٦'],
        ['التحليل والتقارير', '٧'],
        ['البرمجة والأدوات',  '٧'],
        ['مواد دراسية',      '٥']
      ]
    },
    numCol: 1
  },
  {
    sql: {
      en: "SELECT channel, handle\n  FROM contact\n WHERE reachable = true;",
      ar: "SELECT channel, handle\n  FROM contact\n WHERE reachable = true;"
    },
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
        ['البريد',    'ragadsalharbi@gmail.com'],
        ['قتهب',      'github.com/ragadsalharbi'],
        ['لينكدإن',   'in/raghad-alharbi-38a61b326'],
        ['واتساب',    '+966 55 782 0184'],
        ['الموقع',    'الرياض، السعودية']
      ]
    }
  }
];

const KW = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|AS|DESC|true)\b/g;

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

function highlight(sql) {
  return esc(sql)
    .replace(KW, '<span class="kw">$1</span>')
    .replace(/\bcount\b/g, '<span class="fn">count</span>');
}

/* ============ ELEMENTS ============ */
const mark      = $('#mark');
const sqlEl     = $('#sql');
const caretEl   = $('#caret');
const resultEl  = $('#result');
const theadEl   = $('#thead');
const tbodyEl   = $('#tbody');
const metaEl    = $('#meta');
const rerunBtn  = $('#rerun');
const tabBtns   = $$('.tab');

const themeBtn  = $('#themeBtn');
const themeLbl  = $('#themeLabel');
const langBtns  = $$('.lang-btn');
const sidebar   = $('#sidebar');
const menuBtn   = $('#menuBtn');
const scrim     = $('#scrim');
const navLinks  = $$('.nav-link');
const filters   = $$('.filter');
const cards     = $$('.card');
const toast     = $('#toast');
const saveBtn   = $('#saveContact');
const yearEl    = $('#year');

/* ============ CONSOLE ============ */
let active = 0;
let runId  = 0;

async function runQuery() {
  const id = ++runId;
  const q  = QUERIES[active];
  const sql  = q.sql[lang]  || q.sql.en;
  const head = q.head[lang] || q.head.en;
  const rows = q.rows[lang] || q.rows.en;

  resultEl.hidden = true;
  metaEl.classList.remove('is-in');
  theadEl.innerHTML = '';
  tbodyEl.innerHTML = '';
  sqlEl.textContent = '';
  caretEl.hidden = false;

  /* type the statement */
  if (calm) {
    sqlEl.innerHTML = highlight(sql);
  } else {
    for (let i = 1; i <= sql.length; i++) {
      if (id !== runId) return;
      sqlEl.textContent = sql.slice(0, i);
      await wait(sql[i - 1] === '\n' ? 90 : 26);
    }
    sqlEl.innerHTML = highlight(sql);
    await wait(260);
  }
  if (id !== runId) return;
  caretEl.hidden = true;

  /* header */
  const hr = document.createElement('tr');
  head.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    hr.appendChild(th);
  });
  theadEl.appendChild(hr);

  /* body */
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

  const trs = $$('tr', tbodyEl);
  for (const tr of trs) {
    if (id !== runId) return;
    tr.classList.add('is-in');
    await wait(calm ? 0 : 70);
  }

  if (id !== runId) return;
  const ms = 2 + Math.round(rows.length * 0.7);
  metaEl.textContent = lang === 'ar'
    ? `(${rows.length} صفوف) · ${ms} مللي ثانية`
    : `(${rows.length} rows) · ${ms} ms`;
  metaEl.classList.add('is-in');
}

function selectTab(i) {
  active = i;
  tabBtns.forEach((b, n) => b.classList.toggle('is-active', n === i));
  runQuery();
}

/* ============ THEME ============ */
function applyTheme(t) {
  root.setAttribute('data-theme', t);
  if (themeLbl) {
    themeLbl.textContent = t === 'dark'
      ? (lang === 'ar' ? 'فاتح' : 'Light')
      : (lang === 'ar' ? 'داكن' : 'Dark');
  }
  try { localStorage.setItem('theme', t); } catch (e) {}
}

/* ============ LANGUAGE ============ */
function applyLang(next) {
  lang = next === 'ar' ? 'ar' : 'en';
  const ar = lang === 'ar';

  root.setAttribute('lang', ar ? 'ar' : 'en');
  root.setAttribute('dir',  ar ? 'rtl' : 'ltr');

  $$('[data-en]').forEach(el => {
    const v = ar ? el.dataset.ar : el.dataset.en;
    if (v !== undefined) el.innerHTML = v;
  });

  langBtns.forEach(b => b.classList.toggle('is-active', b.dataset.lang === lang));
  document.title = ar
    ? 'رغد الحربي — محلّلة بيانات ومهندسة بيانات'
    : 'Raghad Alharbi — Data Analyst & Data Engineer';

  applyTheme(root.getAttribute('data-theme') || 'dark');
  try { localStorage.setItem('lang', lang); } catch (e) {}
  runQuery();
}

/* ============ MENU ============ */
function setMenu(open) {
  sidebar.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  scrim.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
}

/* ============ TOAST ============ */
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
    `N:${ME.lastName};${ME.firstName};;;`,
    `FN:${ME.fullName}`,
    `TITLE:${ME.title}`,
    `TEL;TYPE=CELL:${ME.phone}`,
    `EMAIL;TYPE=INTERNET:${ME.email}`,
    `URL:${ME.website}`,
    `URL;TYPE=GitHub:${ME.github}`,
    `URL;TYPE=LinkedIn:${ME.linkedin}`,
    `ADR;TYPE=HOME:;;;${ME.city};;;${ME.country}`,
    'END:VCARD'
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([card], { type: 'text/vcard;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Raghad-Alharbi.vcf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(lang === 'ar' ? 'تم حفظ جهة الاتصال' : 'Contact saved');
}

/* ============ BOOT ============ */
function boot() {

  /* monogram: measure real path lengths, then release the animation */
  if (mark && typeof SVGPathElement !== 'undefined') {
    $$('path', mark).forEach(p => {
      if (typeof p.getTotalLength === 'function') {
        p.style.setProperty('--len', Math.ceil(p.getTotalLength()));
      }
    });
    mark.classList.add('ready');
  }

  /* theme */
  let savedTheme = null, savedLang = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  try { savedLang  = localStorage.getItem('lang');  } catch (e) {}

  const prefersLight = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

  themeBtn.addEventListener('click', () =>
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  /* console */
  tabBtns.forEach((b, i) => b.addEventListener('click', () => selectTab(i)));
  rerunBtn.addEventListener('click', runQuery);

  /* language buttons */
  langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

  /* menu */
  menuBtn.addEventListener('click', () => setMenu(!sidebar.classList.contains('is-open')));
  scrim.addEventListener('click', () => setMenu(false));
  navLinks.forEach(l => l.addEventListener('click', () => {
    if (window.innerWidth <= 900) setMenu(false);
  }));

  /* active nav on scroll — only if the browser supports it */
  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(l =>
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean).forEach(s => io.observe(s));
  }

  /* project filters */
  filters.forEach(btn => btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filters.forEach(f => f.classList.toggle('is-active', f === btn));
    cards.forEach(c => c.classList.toggle('hide', cat !== 'all' && c.dataset.cat !== cat));
  }));

  /* contact */
  saveBtn.addEventListener('click', saveContact);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) setMenu(false);
  });

  yearEl.textContent = new Date().getFullYear();

  /* language last — it kicks off the first query */
  applyLang(savedLang === 'ar' ? 'ar' : 'en');
}

boot();
