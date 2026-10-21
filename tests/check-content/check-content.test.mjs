import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  runChecks,
  checkExperiments,
  checkNews,
  checkLandingFindingNumbers,
  checkPinnedLinks,
  findUnpinnedGithubLinks,
  loadExperiments,
  loadNews,
} from '../../scripts/check-content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = join(here, 'fixtures');

describe('check:content pinned evidence links', () => {
  it('flags frontmatter and body links that follow a branch', () => {
    const experiments = loadExperiments(join(fixtures, 'unpinned-link'));
    const { errors } = checkPinnedLinks(experiments);
    assert.equal(errors.length, 3, errors.join('\n'));
    assert.ok(errors.some((e) => /OKFExperiment\/blob\/main\/README\.md/.test(e)), 'report link');
    assert.ok(errors.some((e) => /OKFExperiment\/tree\/main\/results/.test(e)), 'finding source');
    assert.ok(errors.some((e) => /AgentTrialRig\/blob\/master\/README\.md/.test(e)), 'body link');
  });

  it('accepts commit-pinned links, repo roots, the site repo and code fences', () => {
    const experiments = loadExperiments(join(fixtures, 'pinned-link'));
    const { errors } = checkPinnedLinks(experiments);
    assert.deepEqual(errors, []);
  });

  it('treats tags and short non-hex refs as unpinned', () => {
    assert.deepEqual(
      findUnpinnedGithubLinks('https://github.com/a/b/blob/v1.0/x.md https://github.com/a/b/blob/abc12/x.md'),
      ['https://github.com/a/b/blob/v1.0/x.md', 'https://github.com/a/b/blob/abc12/x.md'],
    );
    assert.deepEqual(findUnpinnedGithubLinks('https://github.com/a/b/blob/abcdef1/x.md'), []);
  });
});

describe('check:content guide chapters', () => {
  it('flags an unpinned link in a guide chapter', () => {
    const { errors } = runChecks({
      skipRoutes: true,
      skipLanding: true,
      guidesDir: join(fixtures, 'unpinned-link'),
    });
    assert.ok(errors.some((e) => /blob\/main/.test(e)), errors.join('\n'));
  });
});

describe('check:content fixtures', () => {
  it('clean set passes experiment rules', () => {
    const experiments = loadExperiments(join(fixtures, 'clean'));
    const { errors } = checkExperiments(experiments);
    assert.deepEqual(errors, []);
  });

  it('catches duplicate finding ids', () => {
    const experiments = loadExperiments(join(fixtures, 'dup-finding'));
    const { errors } = checkExperiments(experiments);
    assert.ok(errors.some((e) => /Duplicate finding id/.test(e)), errors.join('\n'));
  });

  it('catches published experiment with no findings', () => {
    const experiments = loadExperiments(join(fixtures, 'published-no-findings'));
    const { errors } = checkExperiments(experiments);
    assert.ok(errors.some((e) => /needs ≥1 finding/.test(e)), errors.join('\n'));
  });

  it('catches published experiment with no report', () => {
    const experiments = loadExperiments(join(fixtures, 'published-no-report'));
    const { errors } = checkExperiments(experiments);
    assert.ok(errors.some((e) => /needs report URL/.test(e)), errors.join('\n'));
  });

  it('catches supersededBy pointing at missing id', () => {
    const experiments = loadExperiments(join(fixtures, 'superseded-no-target'));
    const { errors } = checkExperiments(experiments);
    assert.ok(errors.some((e) => /supersededBy.*not found/.test(e)), errors.join('\n'));
  });

  it('catches unknown topic ids', () => {
    const experiments = loadExperiments(join(fixtures, 'bad-topic'));
    const { errors } = checkExperiments(experiments);
    assert.ok(errors.some((e) => /Unknown topic id/.test(e)), errors.join('\n'));
  });

  it('real content tree passes (skip routes in unit isolation optional)', () => {
    const { errors } = runChecks({ skipRoutes: false });
    assert.deepEqual(errors, [], errors.join('\n'));
  });

  it('catches hard-coded finding number on landing HTML not in records', () => {
    const experiments = loadExperiments(join(fixtures, 'clean'));
    const { errors } = checkLandingFindingNumbers({
      experiments,
      landingHtmlDir: join(fixtures, 'landing-hardcoded'),
    });
    assert.ok(
      errors.some((e) => /Hard-coded finding number "\+99/.test(e)),
      errors.join('\n'),
    );
    assert.ok(
      errors.some((e) => /Hard-coded finding number "44 \/ 44"/.test(e)),
      errors.join('\n'),
    );
  });

  it('valid news post passes news rules', () => {
    const posts = loadNews(join(fixtures, 'news-valid'));
    const { errors } = checkNews(posts);
    assert.deepEqual(errors, []);
  });

  it('catches news item missing sourceUrl', () => {
    const posts = loadNews(join(fixtures, 'news-missing-source'));
    const { errors } = checkNews(posts);
    assert.ok(errors.some((e) => /sourceUrl/.test(e)), errors.join('\n'));
  });
});
