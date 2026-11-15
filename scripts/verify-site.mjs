import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html = fs.readFileSync('index.html','utf8');
assert.match(html,/<!doctype html>/i);
assert.match(html,/<html[^>]+lang="ru"/i);
assert.match(html,/<meta name="robots" content="noindex,nofollow,noarchive">/);
assert.match(html,/<title>Саморазвитие/);
assert.ok(!/<script[^>]+src=/.test(html),'No external scripts');
assert.ok(!/<link[^>]+rel="stylesheet"/.test(html),'CSS is bundled');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert.equal(scripts.length,2,'Two inline JS bundles');
for(const js of scripts) new vm.Script(js);
const sandbox={window:{}}; vm.runInNewContext(scripts[0],sandbox);
const {BOOK,CHAPTERS,LESSONS}=sandbox.window.SITE_DATA;
assert.equal(CHAPTERS.length,18,'18 book sections');
assert.equal(LESSONS.length,3,'3 complete lessons');
assert.match(BOOK.sourceStatus,/не расшифрован/,'Do not misrepresent audiobook as transcript');
for (const lesson of LESSONS) {
  assert.ok(lesson.id && lesson.title && lesson.duration>0);
  assert.ok(lesson.quick.length>400 && lesson.understand.length>600 && lesson.deep.length>500);
  assert.equal(lesson.exercise.options.length,3);
  assert.equal(lesson.exercise.feedback.length,3);
  assert.ok(lesson.chapterIds.every(id=>CHAPTERS.some(c=>c.n===id)));
}
for(const pattern of ['#/learn','#/books','#/practice','#/reviews','#/notes','#/settings']) assert.ok(html.includes(pattern),pattern);
assert.ok(html.includes('localStorage') && html.includes('audio-player'),'Local learning workspace');
console.log('PASS: сайт, 18 разделов книги, 3 урока, 3 режима, практика, локальные данные.');
