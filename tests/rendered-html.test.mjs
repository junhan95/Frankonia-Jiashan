import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { stagingEnv } from '../scripts/staging-env.mjs';
import { closingLines } from '../app/page-closing.ts';

const OUT = fileURLToPath(new URL('../out/', import.meta.url));
const BASE = stagingEnv.NEXT_PUBLIC_BASE_PATH;
const ORIGIN = stagingEnv.NEXT_PUBLIC_SITE_ORIGIN;
async function collect(dir = OUT, route = '/') {
  const result = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === '_next' || e.name === '_not-found' || e.name === '404') continue;
    if (e.isDirectory()) result.push(...await collect(path.join(dir,e.name), `${route}${e.name}/`));
    else if (e.name === 'index.html') result.push({route,html:await readFile(path.join(dir,e.name),'utf8')});
  }
  return result;
}
const pages = await collect();
const locale = r => r.startsWith('/en/') ? 'en' : 'zh';
const shared = r => r.startsWith('/en/') ? r.slice(3) : r;
const counterpart = r => locale(r) === 'en' ? shared(r) : `/en${r}`;
const absolute = r => `${ORIGIN}${BASE}${r}`;
const visible = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'').replace(/<[^>]*>/g,'');
const escape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');

test('all 69 source pages exist in both languages', () => {
  assert.equal(pages.length,138);
  const zh = pages.filter(p=>locale(p.route)==='zh').map(p=>p.route).sort();
  const en = pages.filter(p=>locale(p.route)==='en').map(p=>shared(p.route)).sort();
  assert.deepEqual(en,zh);
  for (const required of ['/', '/contact/', '/downloads/', '/mychamber/', '/myenquiry/', '/chambers/model/sac-3-plus/', '/test-systems/product/system/', '/cybershield/']) assert.ok(zh.includes(required),required);
  assert.ok(!pages.some(p=>/^\/(ko|zh|de)\//.test(p.route)));
});

test('Chinese is the default and document language is correct on every page', () => {
  for (const {route,html} of pages) {
    assert.ok(html.includes(`<html lang="${locale(route)==='zh'?'zh-CN':'en'}"`),route);
    assert.doesNotMatch(visible(html), /[가-힣]/,`${route}: Korean text remains`);
    if (locale(route)==='zh') assert.match(visible(html),/[\u4e00-\u9fff]/,route);
  }
});

test('language switches preserve the current page', () => {
  for (const {route,html} of pages) {
    const switcher = html.match(/<div class="lang">([\s\S]*?)<\/div>/)?.[1];
    assert.ok(switcher,route);
    assert.ok(switcher.includes(`href="${BASE}${counterpart(route)}"`),route);
    assert.ok(switcher.includes('中文') && switcher.includes('EN'),route);
  }
});

test('canonical, hreflang and x-default match Chinese-root routing', () => {
  for (const {route,html} of pages) {
    assert.ok(html.includes(`rel="canonical" href="${absolute(route)}"`),route);
    assert.ok(html.includes(`hrefLang="zh-CN" href="${absolute(shared(route))}"`),route);
    assert.ok(html.includes(`hrefLang="en" href="${absolute('/en'+shared(route))}"`),route);
    assert.ok(html.includes(`hrefLang="x-default" href="${absolute(shared(route))}"`),route);
    assert.match(html, /<meta name="robots" content="[^"]*noindex/,route);
  }
});

test('all internal links, images, downloads and scripts resolve within this export', async () => {
  const references = new Map();
  for (const {route,html} of pages) for (const m of html.matchAll(/\b(?:href|src)="([^"#]+)"/g)) {
    const value = m[1].replace(/&amp;/g,'&');
    if (!value.startsWith('/')) continue;
    assert.ok(value.startsWith(BASE+'/'),`${route}: missing Jiashan base path: ${value}`);
    const raw = decodeURIComponent(value.slice(BASE.length).split(/[?#]/)[0]);
    const target = path.join(OUT,raw.endsWith('/')?raw+'index.html':raw);
    references.set(target,`${route}: ${value}`);
  }
  for (const [target,context] of references) assert.ok((await stat(target).catch(()=>null))?.isFile(), context);
});

test('metadata and structured data identify the current language', () => {
  for (const {route,html} of pages) {
    assert.ok(html.includes(`content="${locale(route)==='zh'?'zh_CN':'en_US'}"`),route);
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(scripts.length,route);
    const graph = scripts.flatMap(m=>JSON.parse(m[1])['@graph']??[]);
    const page = graph.find(n=>n['@type']==='WebPage');
    assert.equal(page?.url,absolute(route));
    assert.equal(page?.inLanguage,locale(route)==='zh'?'zh-CN':'en');
  }
});

test('every content page retains its localized closing statement', () => {
  for (const {route,html} of pages) {
    const key = shared(route).replace(/\/$/,'') || '/';
    if (key==='/mycart') continue;
    const line = closingLines[locale(route)][key];
    assert.ok(line,route);
    assert.ok(html.includes(escape(line)),route);
  }
});

test('sitemap entries resolve and never advertise Korean or a Chinese prefix', async () => {
  const xml = await readFile(path.join(OUT,'sitemap.xml'),'utf8');
  assert.doesNotMatch(xml,/\/(ko|zh)\//);
  assert.match(xml,/hreflang="zh-CN"/);
  for (const [,url] of xml.matchAll(/<loc>(.*?)<\/loc>/g)) assert.ok(pages.some(p=>absolute(p.route)===url),url);
});

test('technical catalogue identifiers survive in both languages', () => {
  for (const prefix of ['', '/en']) {
    const page = pages.find(p=>p.route===`${prefix}/chambers/model/sac-3-plus/`);
    assert.match(visible(page.html),/SAC-3/);
    const systems = pages.find(p=>p.route===`${prefix}/test-systems/product/system/`);
    assert.match(visible(systems.html),/CIT-100/);
  }
});
