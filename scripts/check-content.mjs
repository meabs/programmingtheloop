#!/usr/bin/env node
/**
 * Content integrity checks (Phase 1).
 * Run: npm run check:content
 *
 * Checks:
 * 1. Duplicate finding IDs across experiments
 * 2. Finding IDs match <experimentId>-<n> when experimentId is set
 * 3. Unknown topic ids
 * 4. Published (status) experiments have report + ≥1 finding
 * 5. Superseded experiments have supersededBy pointing at a known experimentId
 * 6. Route baseline: every baseline path is still declared (page, Starlight doc, or redirect)
 *
 * Practice citation rules are stubbed until practices exist (Phase later).
 *
 * Env:
 *   EXPERIMENTS_DIR — override experiments folder (fixtures)
 *   SKIP_ROUTES=1 — skip route baseline (fixture unit tests)
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const EXPERIMENTS_DIR =
  process.env.EXPERIMENTS_DIR || join(ROOT, 'src/content/experiments');
const BASELINE = join(ROOT, 'docs/route-baseline.txt');
const ASTRO_CONFIG = join(ROOT, 'astro.config.mjs');
const SKIP_ROUTES = process.env.SKIP_ROUTES === '1';

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
    if (val === '' || val === '|' || val === '>') {
      // nested block or list follows
      if (i + 1 < lines.length && /^\s+- /.test(lines[i + 1])) {
        const list = [];
        i += 1;
        while (i < lines.length && /^\s+- /.test(lines[i])) {
          const itemLine = lines[i];
          if (/^\s+- id:/.test(itemLine) || /^\s+- name:/.test(itemLine) || /^\s+- label:/.test(itemLine)) {
            // object list item
            const obj = {};
            const first = itemLine.match(/^\s+- (\w+):\s*(.*)$/);
            if (first) obj[first[1]] = unquote(first[2]);
            i += 1;
            while (i < lines.length && /^\s{2,}\w+:/.test(lines[i])) {
              const km = lines[i].match(/^\s+(\w+):\s*(.*)$/);
              if (km) {
                if (km[2] === '' && i + 1 < lines.length && /^\s+- /.test(lines[i + 1])) {
                  // nested list e.g. limits:
                  const nested = [];
                  i += 1;
                  while (i < lines.length && /^\s+- /.test(lines[i])) {
                    nested.push(unquote(lines[i].replace(/^\s+- /, '')));
                    i += 1;
                  }
                  obj[km[1]] = nested;
                  continue;
                }
                obj[km[1]] = unquote(km[2]);
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

  // Known dynamic experiment/article routes from content
  for (const f of listMarkdownFiles(join(ROOT, 'src/content/experiments'))) {
    const id = relative(join(ROOT, 'src/content/experiments'), f).replace(/\.(md|mdx)$/, '');
    if (!id.includes('do-not-publish') && !id.startsWith('.')) {
      // include drafts too for route presence of slug pattern — actual HTML only for non-draft at build
      routes.add(`/experiments/${id}/`);
    }
  }
  routes.add('/experiments/');
  routes.add('/articles/');
  for (const f of listMarkdownFiles(join(ROOT, 'src/content/articles'))) {
    const id = relative(join(ROOT, 'src/content/articles'), f).replace(/\.(md|mdx)$/, '');
    if (!id.includes('do-not-publish')) routes.add(`/articles/${id}/`);
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

export function runChecks({ experimentsDir = EXPERIMENTS_DIR, skipRoutes = SKIP_ROUTES } = {}) {
  const experiments = loadExperiments(experimentsDir);
  const expResult = checkExperiments(experiments);
  const errors = [...expResult.errors];
  const warnings = [...expResult.warnings];

  if (!skipRoutes) {
    const routeResult = checkRouteBaseline();
    errors.push(...routeResult.errors);
  }

  return { errors, warnings, experimentCount: experiments.length };
}

function main() {
  const { errors, warnings, experimentCount } = runChecks();
  if (warnings.length) {
    console.warn('Warnings:');
    for (const w of warnings) console.warn(' -', w);
  }
  if (errors.length) {
    console.error(`check:content failed (${errors.length} error(s), ${experimentCount} experiment file(s)):`);
    for (const e of errors) console.error(' -', e);
    process.exit(1);
  }
  console.log(`check:content ok (${experimentCount} experiment file(s))`);
}

const isDirect =
  process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirect) main();
