import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';

const PORT = 8653;
const url='http://127.0.0.1:'+PORT+'/index.html';
const server=spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true});
const errors=[];
function wav(){
  const frames=44100*3, buf=Buffer.alloc(44+frames*2), rate=44100;
  buf.write('RIFF',0);buf.writeUInt32LE(buf.length-8,4);buf.write('WAVE',8);buf.write('fmt ',12);
  buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(1,22);buf.writeUInt32LE(rate,24);
  buf.writeUInt32LE(rate*2,28);buf.writeUInt16LE(2,32);buf.writeUInt16LE(16,34);
  buf.write('data',36);buf.writeUInt32LE(frames*2,40);return buf;
}
try{
  await new Promise(r=>setTimeout(r,500));
  for (const width of [320,390,768,1440]){
    const page=await browser.newPage({viewport:{width,height:810}});
    page.on('pageerror',e=>errors.push(String(e)));
    await page.goto(url+'#/books',{waitUntil:'load'});
    await assert.doesNotReject(()=>page.locator('.book-banner h1').waitFor());
    const dimensions=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:innerWidth}));
    assert.ok(dimensions.w<=width, 'Books overflow at '+width+': '+JSON.stringify(dimensions));
    await page.goto(url+'#/learn/trust');
    await page.locator('#v12-self textarea').waitFor();
    assert.equal(await page.locator('#v12-sources a').count()>=2,true,'source links');
    await page.goto(url+'#/lab');
    await page.locator('[data-v12-lab]').first().waitFor();
    await page.goto(url+'#/arguments');
    await page.getByRole('heading',{name:'Проверка аргументов'}).waitFor();
    await page.goto(url+'#/map');
    await page.getByRole('heading',{name:'Как связаны идеи'}).waitFor();
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:850}});
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(url+'#/learn/trust');
  await page.locator('[data-done="trust"]').click();
  assert.match(await page.locator('[data-done="trust"]').innerText(),/Прочитано/);
  assert.match(await page.locator('#v12-self').innerText(),/Нет самостоятельного ответа/);
  await page.goto(url+'#/books');
  await page.locator('#audio-input').setInputFiles({name:'book-demo.wav',mimeType:'audio/wav',buffer:wav()});
  await page.waitForFunction(()=>document.getElementById('audio-player').duration>2);
  await page.evaluate(()=>{document.getElementById('audio-player').currentTime=0.85;});
  const before=await page.evaluate(()=>document.getElementById('audio-player').currentTime);
  await page.goto(url+'#/learn/trust');
  const after=await page.evaluate(()=>document.getElementById('audio-player').currentTime);
  assert.ok(after>=before-0.2,'Audio position reset after navigation: '+before+' -> '+after);
  assert.equal(await page.locator('#audio-player').count(),1,'Audio node must be persistent and unique');
  assert.equal(await page.locator('#audio-dock').isVisible(),true);
  await page.locator('#v12-answer').fill('Прежде чем доверять конкретной сделке, нужно проверить роли сторон, письменные условия, финансовую модель, сроки и ответственность. Хорошая рекомендация не заменяет проверку.');
  await page.locator('form[data-v12-recall] button[type=submit]').click();
  assert.match(await page.locator('#v12-self').innerText(),/Критерии самостоятельной проверки/);
  page.on('dialog',d=>d.accept());
  await page.locator('[data-v12-selfcheck]').click();
  assert.equal(await page.locator('[data-v12-selfcheck]').isDisabled(),false,'Should refuse self-check before solving case');
  const correct=await page.evaluate(()=>window.SITE_DATA.LESSONS.find(x=>x.id==='trust').exercise.correct);
  await page.locator('[data-quiz="trust"][data-answer="'+correct+'"]').click();
  await page.locator('[data-v12-selfcheck]').click();
  assert.equal(await page.locator('[data-v12-selfcheck]').isDisabled(),true,'Self-check should lock after checking');
  await page.goto(url+'#/lab');
  await page.locator('[data-v12-lab="partner"][data-v12-choice="1"]').click();
  assert.match(await page.locator('[data-v12-lab="partner"]').first().locator('..').innerText(),/Разумный старт/);
  await page.reload();
  assert.match(await page.locator('.v12-grid').innerText(),/Разумный старт/);
  await page.goto(url+'#/reviews');
  assert.match(await page.locator('#v12-reviews').innerText(),/Самостоятельное повторение/);
  assert.deepEqual(errors,[],'JS page errors');
  console.log('PASS: 320/390/768/1440 layout, routes, recall, case answers, audio continuity, practice status, persistence.');
}finally{await browser.close();server.kill();}
