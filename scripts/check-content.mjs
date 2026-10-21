#!/usr/bin/env node
/**
 * Content integrity checks (Phase 1 + Phase 6 landing acceptance idea).
 * Run: npm run check:content
 *
 * Checks:
 * 1. Duplicate finding IDs across experiments
 * 2. Finding IDs match <experimentId>-<n> when experimentId is set
 * 3. Unknown topic ids
 * 4. Published (status) experiments have report + ≥1 finding
 * 5. Superseded experiments have supersededBy pointing at a known experimentId
 * 6. Route baseline: every baseline path is still declared (page, Starlight doc, or redirect)
 * 7. Home / guide-landing HTML must not hard-code finding numbers absent from records
 * 8. News items: each needs https? sourceUrl, releasedOn, and non-empty body
 *
 * Practice citation rules are stubbed until practices exist (Phase later).
 *
 * Env:
 *   EXPERIMENTS_DIR — override experiments folder (fixtures)
 *   NEWS_DIR — override news folder (fixtures)
 *   SKIP_ROUTES=1 — skip route baseline (fixture unit tests)
 *   SKIP_LANDING=1 — skip home/guide-landing finding-number scan
 *   LANDING_HTML_DIR — optional dir of HTML fixtures for landing scan
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const EXPERIMENTS_DIR =
  process.env.EXPERIMENTS_DIR || join(ROOT, 'src/content/experiments');
const NEWS_DIR = process.env.NEWS_DIR || join(ROOT, 'src/content/news');
const BASELINE = join(ROOT, 'docs/route-baseline.txt');
const ASTRO_CONFIG = join(ROOT, 'astro.config.mjs');
const SKIP_ROUTES = process.env.SKIP_ROUTES === '1';
const SKIP_LANDING = process.env.SKIP_LANDING === '1';
const LANDING_HTML_DIR = process.env.LANDING_HTML_DIR || '';

const TOPIC_IDS = new Set([
  'context',
  'briefs',
  'verification',
  'harness',
  'parallel',
  'review',
  'measurement',
  'safety-cost',
]);

/** Minimal YAML-ish frontmatter parser for our experiment fields. */
export function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { data: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: raw };
  const fm = raw.slice(4, end).trimEnd();
  const body = raw.slice(end + 4);
  const data = {};
  const lines = fm.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^([A-Za-z][\w]*):\s*(.*)$/);
    if (!m) {
      i += 1;
      continue;
    }
    const key = m[1];
    let val = m[2];
    if (val === '|' || val === '>') {
      const { text: block, next } = readYamlBlock(lines, i + 1, 0);
      data[key] = block;
      i = next;
      continue;
    }
    if (val === '') {
      // nested block or list follows
      if (i + 1 < lines.length && /^\s+- /.test(lines[i + 1])) {
        const list = [];
        i += 1;
        while (i < lines.length && /^\s+- /.test(lines[i])) {
          const itemLine = lines[i];
          if (/^\s+- \w+:/.test(itemLine)) {
            // object list item (findings, agents, news items, …)
            const obj = {};
            const first = itemLine.match(/^\s+- (\w+):\s*(.*)$/);
            if (first) {
              if (first[2] === '|' || first[2] === '>') {
                const { text: block, next } = readYamlBlock(lines, i + 1, itemLine.match(/^(\s+)/)?.[1].length ?? 0);
                obj[first[1]] = block;
                i = next;
              } else {
                obj[first[1]] = unquote(first[2]);
                i += 1;
              }
            } else {
              i += 1;
            }
            while (i < lines.length && /^\s{2,}\w+:/.test(lines[i])) {
              const km = lines[i].match(/^(\s+)(\w+):\s*(.*)$/);
              if (km) {
                const indent = km[1].length;
                if (km[3] === '|' || km[3] === '>') {
                  const { text: block, next } = readYamlBlock(lines, i + 1, indent);
                  obj[km[2]] = block;
                  i = next;
                  continue;
                }
                if (km[3] === '' && i + 1 < lines.length && /^\s+- /.test(lines[i + 1])) {
                  // nested list e.g. limits:
                  const nested = [];
                  i += 1;
                  while (i < lines.length && /^\s+- /.test(lines[i])) {
                    nested.push(unquote(lines[i].replace(/^\s+- /, '')));
                    i += 1;
                  }
                  obj[km[2]] = nested;
                  continue;
                }
                if (
                  km[3] === '' &&
                  i + 1 < lines.length &&
                  new RegExp(`^\\s{${indent + 1},}\\w+:`).test(lines[i + 1])
                ) {
                  // nested object e.g. interval: { low, high, method }
                  const nestedObj = {};
                  i += 1;
                  while (i < lines.length) {
                    const nm = lines[i].match(/^(\s+)(\w+):\s*(.*)$/);
                    if (!nm || nm[1].length <= indent) break;
                    nestedObj[nm[2]] = unquote(nm[3]);
                    i += 1;
                  }
                  obj[km[2]] = nestedObj;
                  continue;
                }
                obj[km[2]] = unquote(km[3]);
              }
              i += 1;
            }
            list.push(obj);
            continue;
          }
          list.push(unquote(itemLine.replace(/^\s+- /, '')));
          i += 1;
        }
        data[key] = list;
        continue;
      }
      data[key] = val === '' ? true : val;
      i += 1;
      continue;
    }
    if (val === 'true') data[key] = true;
    else if (val === 'false') data[key] = false;
    else if (val === '[]') data[key] = [];
    else if (/^\d+$/.test(val)) data[key] = Number(val);
    else data[key] = unquote(val);
    i += 1;
  }
  return { data, body };
}

function unquote(s) {
  const t = String(s).trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/** Read a YAML `|` / `>` indented block; returns text and next line index. */
function readYamlBlock(lines, start, parentIndent) {
  const parts = [];
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      parts.push('');
      i += 1;
      continue;
    }
    const m = line.match(/^(\s*)(.*)$/);
    const indent = m ? m[1].length : 0;
    if (indent <= parentIndent) break;
    parts.push(m[2]);
    i += 1;
  }
  return { text: parts.join('\n').replace(/\s+$/, ''), next: i };
}

function listMarkdownFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...listMarkdownFiles(p));
    else if (/\.(md|mdx)$/.test(name) && !name.startsWith('.')) out.push(p);
  }
  return out;
}

export function loadExperiments(dir = EXPERIMENTS_DIR) {
  return listMarkdownFiles(dir).map((file) => {
    const raw = readFileSync(file, 'utf8');
    const { data } = parseFrontmatter(raw);
    return { file: relative(ROOT, file), data };
  });
}

export function loadNews(dir = NEWS_DIR) {
  return listMarkdownFiles(dir).map((file) => {
    const raw = readFileSync(file, 'utf8');
    const { data } = parseFrontmatter(raw);
    return { file: relative(ROOT, file), data };
  });
}

/**
 * News integrity: every non-draft post's items need sourceUrl (http/https),
 * releasedOn, and a non-empty body.
 */
export function checkNews(posts) {
  const errors = [];
  const warnings = [];

  for (const post of posts) {
    const { file, data } = post;
    if (data.draft === true) continue;
    if (!data.title) errors.push(`News post ${file} needs a title`);
    if (!data.date) errors.push(`News post ${file} needs a date`);
    if (!data.summary) errors.push(`News post ${file} needs a summary`);

    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length < 1) {
      errors.push(`News post ${file} needs ≥1 item`);
      continue;
    }
    items.forEach((item, idx) => {
      if (!item || typeof item !== 'object') {
        errors.push(`News post ${file} item ${idx + 1} is not an object`);
        return;
      }
      const label = item.title || item.vendor || `#${idx + 1}`;
      if (!item.sourceUrl || !/^https?:\/\//i.test(String(item.sourceUrl))) {
        errors.push(
          `News post ${file} item "${label}" needs an http(s) sourceUrl`,
        );
      }
      if (!item.releasedOn || !String(item.releasedOn).trim()) {
        errors.push(`News post ${file} item "${label}" needs releasedOn`);
      }
      if (!item.body || !String(item.body).trim()) {
        errors.push(`News post ${file} item "${label}" needs a non-empty body`);
      }
      if (!item.vendor || !String(item.vendor).trim()) {
        errors.push(`News post ${file} item "${label}" needs a vendor`);
      }
      if (!item.title || !String(item.title).trim()) {
        errors.push(`News post ${file} item ${idx + 1} needs a title`);
      }
      if (!item.sourceLabel || !String(item.sourceLabel).trim()) {
        errors.push(`News post ${file} item "${label}" needs a sourceLabel`);
      }
    });
  }

  return { errors, warnings };
}

export function checkExperiments(experiments) {
  const errors = [];
  const warnings = [];
  const findingIds = new Map(); // id -> file
  const experimentIds = new Map(); // experimentId -> file

  for (const exp of experiments) {
    const { file, data } = exp;
    if (data.draft === true) {
      // Still validate finding id uniqueness and topics for drafts
    }

    if (data.experimentId) {
      if (experimentIds.has(data.experimentId)) {
        errors.push(
          `Duplicate experimentId "${data.experimentId}" in ${file} and ${experimentIds.get(data.experimentId)}`,
        );
      } else {
        experimentIds.set(data.experimentId, file);
      }
    }

    if (Array.isArray(data.topics)) {
      for (const t of data.topics) {
        if (!TOPIC_IDS.has(t)) {
          errors.push(`Unknown topic id "${t}" in ${file}`);
        }
      }
    }

    const findings = Array.isArray(data.findings) ? data.findings : [];
    for (const f of findings) {
      if (!f || typeof f !== 'object') continue;
      const id = f.id;
      if (!id) {
        errors.push(`Finding without id in ${file}`);
        continue;
      }
      if (findingIds.has(id)) {
        errors.push(
          `Duplicate finding id "${id}" in ${file} and ${findingIds.get(id)}`,
        );
      } else {
        findingIds.set(id, file);
      }
      if (data.experimentId && !id.startsWith(`${data.experimentId}-`)) {
        errors.push(
          `Finding id "${id}" in ${file} must start with experimentId "${data.experimentId}-"`,
        );
      }
      if (!Array.isArray(f.limits) || f.limits.length < 1) {
        errors.push(`Finding "${id}" in ${file} needs ≥1 limit`);
      }
      if (!f.source) {
        errors.push(`Finding "${id}" in ${file} needs a source URL`);
      }
      if (!f.statement) {
        errors.push(`Finding "${id}" in ${file} needs a statement`);
      }
    }

    // Structured status rules (only when status is opted-in)
    if (data.status === 'published') {
      if (!data.report) {
        errors.push(`Published experiment ${file} needs report URL`);
      }
      if (findings.length < 1) {
        errors.push(`Published experiment ${file} needs ≥1 finding`);
      }
      if (!data.experimentId) {
        errors.push(`Published experiment ${file} needs experimentId`);
      }
    }
    if (data.status === 'superseded') {
      if (!data.supersededBy) {
        errors.push(`Superseded experiment ${file} needs supersededBy`);
      }
    }
  }

  // Resolve supersededBy after all ids known
  for (const exp of experiments) {
    const { file, data } = exp;
    if (data.status === 'superseded' && data.supersededBy) {
      if (!experimentIds.has(data.supersededBy)) {
        errors.push(
          `Superseded experiment ${file} supersededBy "${data.supersededBy}" not found`,
        );
      }
    }
  }

  return { errors, warnings, findingIds, experimentIds };
}

/** Extract redirect keys and targets from astro.config.mjs (source-level). */
export function loadRedirects(configPath = ASTRO_CONFIG) {
  const text = readFileSync(configPath, 'utf8');
  const redirects = {};
  const guideBaseMatch = text.match(/const guideBase\s*=\s*['"]([^'"]+)['"]/);
  const guideBase = guideBaseMatch ? guideBaseMatch[1] : '/guides/programming-the-loop';
  const block = text.match(/redirects:\s*\{([\s\S]*?)\n\s*\},/);
  if (!block) return redirects;
  for (const m of block[1].matchAll(/['"]([^'"]+)['"]\s*:\s*([^\n,]+)/g)) {
    let to = m[2].trim().replace(/,$/, '').trim();
    // Resolve template literals like `${guideBase}/` or `${guideBase}/start/`
    to = to.replace(/\$\{guideBase\}/g, guideBase);
    to = to.replace(/^`([\s\S]*)`$/, '$1');
    to = to.replace(/^['"]|['"]$/g, '');
    redirects[m[1]] = to;
  }
  return redirects;
}

/** Paths that exist as built pages from source (approx). */
export function declaredSourceRoutes() {
  const routes = new Set();
  // Static pages
  function walkPages(dir, prefix = '') {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) {
        if (name.startsWith('[')) continue; // dynamic — handle known ones below
        walkPages(p, `${prefix}/${name}`);
      } else if (name === 'index.astro') {
        routes.add(`${prefix}/` || '/');
      } else if (name.endsWith('.astro') && !name.startsWith('[')) {
        routes.add(`${prefix}/${name.replace(/\.astro$/, '')}/`);
      }
    }
  }
  walkPages(join(ROOT, 'src/pages'));

  // Known dynamic experiment/article/news routes from content (drafts are not public routes)
  for (const f of listMarkdownFiles(join(ROOT, 'src/content/experiments'))) {
    const id = relative(join(ROOT, 'src/content/experiments'), f).replace(/\.(md|mdx)$/, '');
    if (id.includes('do-not-publish') || id.startsWith('.')) continue;
    const raw = readFileSync(f, 'utf8');
    const { data } = parseFrontmatter(raw);
    if (data.draft === true) continue;
    routes.add(`/experiments/${id}/`);
  }
  routes.add('/experiments/');
  routes.add('/articles/');
  for (const f of listMarkdownFiles(join(ROOT, 'src/content/articles'))) {
    const id = relative(join(ROOT, 'src/content/articles'), f).replace(/\.(md|mdx)$/, '');
    if (!id.includes('do-not-publish')) routes.add(`/articles/${id}/`);
  }
  routes.add('/news/');
  routes.add('/news/rss.xml');
  for (const f of listMarkdownFiles(join(ROOT, 'src/content/news'))) {
    const id = relative(join(ROOT, 'src/content/news'), f).replace(/\.(md|mdx)$/, '');
    if (id.includes('do-not-publish') || id.startsWith('.')) continue;
    const raw = readFileSync(f, 'utf8');
    const { data } = parseFrontmatter(raw);
    if (data.draft === true) continue;
    routes.add(`/news/${id}/`);
  }

  // Starlight docs
  const docsRoot = join(ROOT, 'src/content/docs');
  function walkDocs(dir, prefix = '') {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walkDocs(p, `${prefix}/${name}`);
      else if (/\.(md|mdx)$/.test(name)) {
        const base = name.replace(/\.(md|mdx)$/, '');
        if (base === 'index') routes.add(`${prefix}/`);
        else routes.add(`${prefix}/${base}/`);
      }
    }
  }
  walkDocs(docsRoot);

  // Custom start page
  routes.add('/guides/programming-the-loop/start/');

  // Redirects count as resolving the old URL
  const redirects = loadRedirects();
  for (const from of Object.keys(redirects)) {
    const norm = from.endsWith('/') || from === '/guide' || !from.includes('.', 1)
      ? from.endsWith('/') ? from : `${from}/`
      : from;
    // also add without trailing slash variants from baseline
    routes.add(from.endsWith('/') ? from : `${from}/`);
    routes.add(from.replace(/\/$/, '') === from ? from : from);
    if (!from.endsWith('/')) routes.add(`${from}/`);
    else routes.add(from.slice(0, -1));
  }

  // guide/[...slug] generates /guide/ and /guide/<rest>/ for each programming-the-loop doc
  routes.add('/guide/');
  routes.add('/guide/start/');
  for (const r of [...routes]) {
    if (r.startsWith('/guides/programming-the-loop/') && r !== '/guides/programming-the-loop/') {
      const rest = r.slice('/guides/programming-the-loop'.length);
      routes.add(`/guide${rest}`);
    }
  }

  routes.add('/404.html');
  routes.add('/');
  return { routes, redirects };
}

export function checkRouteBaseline(baselinePath = BASELINE) {
  const errors = [];
  if (!existsSync(baselinePath)) {
    errors.push(`Missing route baseline: ${baselinePath}`);
    return { errors };
  }
  const baseline = readFileSync(baselinePath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const { routes, redirects } = declaredSourceRoutes();

  const redirectKeys = new Set();
  for (const k of Object.keys(redirects)) {
    redirectKeys.add(k);
    redirectKeys.add(k.endsWith('/') ? k : `${k}/`);
    redirectKeys.add(k.replace(/\/$/, ''));
  }

  for (const path of baseline) {
    if (path === '/404.html') continue;
    const covered =
      routes.has(path) ||
      redirectKeys.has(path) ||
      redirectKeys.has(path.replace(/\/$/, '')) ||
      redirectKeys.has(`${path.replace(/\/$/, '')}/`);
    if (!covered) {
      // Dynamic catch-alls: /guide/* covered if /guide/ in redirects or pages
      if (path.startsWith('/guide/') && (redirectKeys.has('/guide') || redirectKeys.has('/guide/') || routes.has('/guide/'))) {
        continue;
      }
      if (path === '/book/' || path === '/contents/' || path === '/start/' || path === '/views/') {
        if (redirectKeys.has(path) || redirectKeys.has(path.slice(0, -1))) continue;
      }
      errors.push(`Baseline route not declared in source/redirects: ${path}`);
    }
  }

  // Redirect targets should look like real destinations
  for (const [from, to] of Object.entries(redirects)) {
    if (!to.startsWith('/')) {
      errors.push(`Redirect ${from} → ${to} is not a site path`);
    }
  }

  return { errors, baselineCount: baseline.length, declaredCount: routes.size };
}

/**
 * Finding-shaped number tokens that belong on home / guide landing only when
 * they appear in a finding record (or as computed structural counts / runs).
 */
const FINDING_SHAPED = [
  /\+\d+[–—-]\d+%/g, // +35–48%
  /\d+\s*\/\s*\d+/g, // 14 / 16
  /\d+\s*[→⟶]\s*\d+[–—-]\d+/g, // 3 → 18–19
  /\d+\s*[→⟶]\s*\d+/g, // 3 → 18
  /~\d{1,3}(?:,\d{3})+/g, // ~1,650
  /\b\d+\s+runs\b/gi, // 12 runs
];

function normalizeFindingToken(s) {
  return String(s)
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Collect tokens that may appear in landing chrome because they come from records/counts. */
export function sourcedLandingTokens(experiments) {
  const tokens = new Set();
  const add = (v) => {
    if (v === undefined || v === null || v === '') return;
    tokens.add(normalizeFindingToken(v));
  };

  for (const exp of experiments) {
    add(exp.data.runs);
    for (const f of exp.data.findings || []) {
      add(f.value);
      add(f.n);
      if (f.interval) {
        add(f.interval.low);
        add(f.interval.high);
        add(`${f.interval.low}-${f.interval.high}`);
      }
      // Pull finding-shaped spans out of value + statement (covers partial regex hits)
      for (const blob of [f.value, f.statement, f.n !== undefined ? String(f.n) : '']) {
        if (!blob) continue;
        for (const re of FINDING_SHAPED) {
          re.lastIndex = 0;
          for (const m of String(blob).matchAll(re)) add(m[0]);
        }
      }
    }
  }

  // Structural Guide counts (same rules as src/lib/guide-counts.ts)
  const guideDocs = join(ROOT, 'src/content/docs/guides/programming-the-loop');
  const guideImages = join(ROOT, 'public/guide-images');
  if (existsSync(guideDocs)) {
    let checklistItems = 0;
    let chapterFiles = 0;
    for (const name of readdirSync(guideDocs)) {
      if (!/\.(md|mdx)$/.test(name)) continue;
      const text = readFileSync(join(guideDocs, name), 'utf8');
      if (/^## Checklist\s*$/m.test(text)) chapterFiles += 1;
      for (const line of text.split('\n')) {
        if (/^- \[ \]\s+/.test(line)) checklistItems += 1;
      }
    }
    // CHAPTERS in site.ts is the authoritative chapter count (11)
    add('11');
    add(String(checklistItems));
    add(String(chapterFiles));
  }
  if (existsSync(guideImages)) {
    const figures = readdirSync(guideImages).filter(
      (n) => /\.(png|svg|webp|jpe?g)$/i.test(n) && !n.startsWith('.'),
    ).length;
    add(String(figures));
  }
  const featured = experiments
    .flatMap((e) => e.data.findings || [])
    .filter((f) => f.featured && f.status !== 'superseded');
  add(String(featured.length));

  return tokens;
}

function extractFindingShaped(text) {
  const found = [];
  for (const re of FINDING_SHAPED) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) found.push(m[0]);
  }
  return found;
}

function collectLandingTexts({ landingHtmlDir = LANDING_HTML_DIR } = {}) {
  const files = [];
  const addIf = (p) => {
    if (existsSync(p) && statSync(p).isFile()) files.push(p);
  };

  if (landingHtmlDir) {
    if (existsSync(landingHtmlDir)) {
      for (const name of readdirSync(landingHtmlDir)) {
        if (/\.html?$/i.test(name)) addIf(join(landingHtmlDir, name));
      }
    }
    return files.map((file) => ({ file: relative(ROOT, file), text: readFileSync(file, 'utf8') }));
  }

  // Source that renders home + guide landing chrome (not site.ts — START_ROUTES
  // chips may cite finding numbers in prose elsewhere; landing must not hard-code them).
  addIf(join(ROOT, 'src/pages/index.astro'));
  addIf(join(ROOT, 'src/content/docs/guides/programming-the-loop/index.mdx'));
  addIf(join(ROOT, 'src/content/docs/guides/programming-the-loop/index.md'));
  addIf(join(ROOT, 'src/components/guide/GuideAtAGlance.astro'));
  addIf(join(ROOT, 'src/components/guide/GuideForewordFindings.astro'));
  // Built HTML when present (post-build). Stale dist from before findings
  // attach will fail until rebuilt — that is intentional.
  addIf(join(ROOT, 'dist/index.html'));
  addIf(join(ROOT, 'dist/guides/programming-the-loop/index.html'));

  return files.map((file) => ({ file: relative(ROOT, file), text: readFileSync(file, 'utf8') }));
}

/**
 * Fail if home / guide-landing HTML (or its source) hard-codes a finding-shaped
 * number that is not present on any finding / runs / structural count record.
 */
export function checkLandingFindingNumbers({
  experiments,
  landingHtmlDir = LANDING_HTML_DIR,
} = {}) {
  const errors = [];
  const allowed = sourcedLandingTokens(experiments);
  const texts = collectLandingTexts({ landingHtmlDir });

  for (const { file, text } of texts) {
    // Strip component/script import noise somewhat; keep string literals + HTML text
    const shaped = extractFindingShaped(text);
    for (const raw of shaped) {
      const norm = normalizeFindingToken(raw);
      if (allowed.has(norm)) continue;
      // Allow "N runs" when N matches a finding n / value
      const runsMatch = norm.match(/^(\d+) runs$/);
      if (runsMatch && [...allowed].some((t) => t.includes(runsMatch[1]))) continue;
      errors.push(
        `Hard-coded finding number "${raw}" in ${file} is not sourced from a finding record (or structural/runs count)`,
      );
    }
  }

  return { errors, scanned: texts.map((t) => t.file), allowed: [...allowed] };
}

export function runChecks({
  experimentsDir = EXPERIMENTS_DIR,
  newsDir = NEWS_DIR,
  skipRoutes = SKIP_ROUTES,
  skipLanding = SKIP_LANDING,
  landingHtmlDir = LANDING_HTML_DIR,
} = {}) {
  const experiments = loadExperiments(experimentsDir);
  const expResult = checkExperiments(experiments);
  const news = loadNews(newsDir);
  const newsResult = checkNews(news);
  const errors = [...expResult.errors, ...newsResult.errors];
  const warnings = [...expResult.warnings, ...newsResult.warnings];

  if (!skipRoutes) {
    const routeResult = checkRouteBaseline();
    errors.push(...routeResult.errors);
  }

  if (!skipLanding) {
    const landingResult = checkLandingFindingNumbers({ experiments, landingHtmlDir });
    errors.push(...landingResult.errors);
  }

  return {
    errors,
    warnings,
    experimentCount: experiments.length,
    newsCount: news.length,
  };
}

function main() {
  const { errors, warnings, experimentCount, newsCount } = runChecks();
  if (warnings.length) {
    console.warn('Warnings:');
    for (const w of warnings) console.warn(' -', w);
  }
  if (errors.length) {
    console.error(
      `check:content failed (${errors.length} error(s), ${experimentCount} experiment file(s), ${newsCount} news file(s)):`,
    );
    for (const e of errors) console.error(' -', e);
    process.exit(1);
  }
  console.log(
    `check:content ok (${experimentCount} experiment file(s), ${newsCount} news file(s))`,
  );
}

const isDirect =
  process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirect) main();
