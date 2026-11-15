/* Саморазвитие v1.2 · независимый модуль обучения; без API, секретов и передачи заметок */
(function () {
  'use strict';
  const root = document.getElementById('main');
  const site = window.SITE_DATA;
  if (!root || !site) return;
  const lessons = site.LESSONS;
  const KEY = 'samorazvitie_learning_v12';
  const SOURCE_DATE = '15.11.2026';
  const prompts = {
    trust: {
      question: 'Представь, что знакомый рекомендует партнёра. Объясни своими словами разницу между симпатией, репутацией и проверяемым обязательством. Назови три первых проверки.',
      criteria: ['Отделил отношение к человеку от проверки конкретной сделки', 'Указал роль, сроки, условия и способ фиксации договорённостей', 'Назвал хотя бы один риск, который письменный договор сам по себе не устраняет']
    },
    network: {
      question: 'Составь план развития профессиональных контактов на месяц без манипуляций и навязчивых просьб. Чем будешь измерять ценность, кроме количества знакомств?',
      criteria: ['Есть понятная цель и релевантная среда для знакомств', 'Есть взаимная польза и уважение права отказать', 'Предусмотрен способ поддерживать отношения без спама']
    },
    boundaries: {
      question: 'Друг регулярно срывает сроки в твоей команде. Как поговоришь с ним и чем проверишь, что договорённость сработала?',
      criteria: ['Привёл конкретные наблюдаемые факты, а не ярлык личности', 'Согласовал ожидания, поддержку, сроки и последствия', 'Оставил дружбе место, не делая исключений из правил для команды']
    }
  };
  const labCases = [
    {
      id:'partner', title:'Партнёрство на 300 000 ₽', tag:'Инвестиции и риск',
      situation:'Проверенный знакомый рекомендует партнёра. Просят перевести 300 000 ₽ уже сегодня. Договор и экономика проекта пока не готовы.',
      answers:['Перевести деньги: рекомендация гарантирует честность.','Потребовать модель проекта, подтверждение обязательств, распределение рисков и проверку контрагента.','Отказаться от любых партнёрств: риска не должно быть вовсе.'],
      recommended:1,
      reasons:['Рекомендация помогает начать разговор, но не защищает капитал и не подтверждает исполнение.','Разумная последовательность снижает неопределённость. Если деталей нет, переводить деньги преждевременно.','Полный отказ иногда оправдан, но сам по себе не развивает умение оценивать риск.']
    },
    {
      id:'hire', title:'Друг в команде', tag:'Управление',
      situation:'Друг работает в твоей команде. Он в третий раз пропускает срок, а остальные сотрудники замечают двойные стандарты.',
      answers:['Ничего не делать ради дружбы.','Обсудить факты, ожидания, причины, согласовать срок улучшения и одинаковые правила.','Сразу уволить без разговора, чтобы показать строгость.'],
      recommended:1,
      reasons:['Молчание делает систему правил непредсказуемой и несправедливой.','Это сочетает уважение с управляемостью. Если прогресса нет, следуют прозрачные действия.','Резкое решение без фактов и процедуры может усугубить конфликт.']
    },
    {
      id:'supplier', title:'Поставщик с громким именем', tag:'Переговоры',
      situation:'Новый поставщик показывает дорогой офис и известных клиентов, но просит предоплату без документов и отказывается от пробной партии.',
      answers:['Оплатить: внешние сигналы успеха сильнее документов.','Проверить юридические данные, запросить проверяемые условия и начать с ограниченного этапа.','Назвать человека мошенником без доказательств.'],
      recommended:1,
      reasons:['Офис и фотографии не подтверждают выполнение конкретных обязательств.','Небольшой проверяемый шаг ограничивает ущерб и создаёт данные для решения.','Обвинение без доказательств не заменяет проверку и может быть несправедливым.']
    }
  ];
  const debates = [
    {id:'trust',title:'«Если человек проверенный, договор не нужен»',position:'Долгая история сотрудничества действительно может снижать часть рисков.',opposition:'Но обстоятельства меняются. Письменные роли и условия помогают избежать ошибок памяти и несбывшихся ожиданий.',check:'Различай доверие к человеку и риск конкретной сделки; изучай документы и историю выполнения обязательств.',source:'Модель организационного доверия Mayer–Davis–Schoorman',url:'https://doi.org/10.5465/amr.1995.9508080335',status:'Теоретическая модель; конкретная сделка не проверена'},
    {id:'network',title:'«Чем больше знакомств, тем сильнее сеть»',position:'Большой охват иногда создаёт больше каналов информации.',opposition:'Важны структура связей, доверие и общие действия. Слабые связи могут соединять разные круги, но это не рецепт «копить контакты».',check:'Сравни число полезных сотрудничеств с простым количеством сохранённых контактов.',source:'Granovetter, The Strength of Weak Ties (1973)',url:'https://doi.org/10.1086/225469',status:'Социологическая теория и исследования; не универсальное правило'},
    {id:'boundaries',title:'«Строгая субординация всегда улучшает команду»',position:'Ясность ответственности снижает путаницу в ролях.',opposition:'Чрезмерная дистанция может затруднить обратную связь и раннее обсуждение проблем.',check:'Оцени фактические сроки, психологическую безопасность, качество решений и прозрачность правил.',source:'Конспект книги, главы 6, 16–17',url:'',status:'Авторский тезис, независимая проверка пока не выполнена'}
  ];
  const sources = [
    {name:'Mayer, Davis & Schoorman (1995): организационное доверие',url:'https://doi.org/10.5465/amr.1995.9508080335',scope:'Модель доверия, способностей и риска; не доказательство надёжности отдельного партнёра.',lesson:'trust'},
    {name:'Granovetter (1973): сила слабых связей',url:'https://doi.org/10.1086/225469',scope:'Связи между социальными кругами и передача информации; не инструкция манипулировать людьми.',lesson:'network'},
    {name:'Dunlosky и соавторы (2013): методы обучения',url:'https://pubmed.ncbi.nlm.nih.gov/26173288/',scope:'Обзор стратегий обучения; не тест нашего приложения.',lesson:'all'},
    {name:'Cepeda и соавторы (2006): интервальные повторения',url:'https://pubmed.ncbi.nlm.nih.gov/16719566/',scope:'Метаанализ распределённой практики; конкретные интервалы на сайте выбраны как простая эвристика.',lesson:'all'}
  ];
  function initial(){return {responses:{},checked:{},lab:{},reviewHistory:{},arguments:{},audio:{name:'',position:0,speed:1}};}
  let memory=initial();
  try { const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw&&typeof raw==='object'&&!Array.isArray(raw))memory=Object.assign(initial(),raw); } catch(_) {}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(memory));return true;}catch(_){return false;}}
  function safe(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function pageHead(kicker,title,description){return '<div class="page-heading"><div class="eyebrow">'+kicker+'</div><h1>'+title+'</h1><p>'+description+'</p></div>';}
  function sourcesHtml(lessonId){
    const items=sources.filter(function(s){return s.lesson==='all'||s.lesson===lessonId;});
    return '<section class="panel v12-extra v12-card v12-sources" id="v12-sources"><h3>Независимые источники и границы выводов</h3><p class="v12-status">Проверены библиографические данные и аннотации, '+SOURCE_DATE+'. Содержание книги сверено только с конспектом. Ни один источник не подтверждает автоматически все тезисы урока.</p><ul>'+
      items.map(function(s){return '<li><a href="'+safe(s.url)+'" target="_blank" rel="noopener noreferrer">'+safe(s.name)+'</a><br><small>'+safe(s.scope)+'</small></li>';}).join('')+
      '</ul><p class="v12-status">Статус: библиография проверена; перенос общих выводов на российские деловые отношения требует отдельного исследования.</p></section>';
  }
  function selfStatus(id){
    if(memory.checked[id]) return '<span class="v12-tag">✓ Самопроверка выполнена, не автоматическая оценка</span>';
    if(memory.responses[id])return '<span class="v12-tag">Ответ сохранён, проверь критерии</span>';
    return '<span class="v12-tag">Нет самостоятельного ответа</span>';
  }
  function selfHtml(l){
    const p=prompts[l.id];if(!p)return '';
    const val=(memory.responses[l.id]||'').slice(0,2000);
    const marked=!!memory.checked[l.id];
    return '<section class="panel v12-extra v12-card" id="v12-self"><div class="eyebrow">АКТИВНОЕ ВОСПРОИЗВЕДЕНИЕ</div><h3>Объясни без подсказок</h3><p>'+safe(p.question)+'</p>'+
      '<form data-v12-recall="'+safe(l.id)+'"><label class="small" for="v12-answer">Твой ответ (минимум 80 символов)</label><textarea id="v12-answer" name="answer" minlength="80" maxlength="2000" required placeholder="Напиши своими словами. Только потом посмотри критерии.">'+safe(val)+'</textarea><div class="button-row"><button class="btn primary" type="submit">Сохранить ответ и открыть критерии</button></div></form>'+
      '<div class="v12-status" role="status">'+selfStatus(l.id)+'</div>'+
      '<div id="v12-criteria" class="note-strip" '+(!val?'hidden':'')+'><strong>Критерии самостоятельной проверки:</strong><ol>'+p.criteria.map(function(x){return '<li>'+safe(x)+'</li>';}).join('')+'</ol><p class="small">Оцени себя по критериям. Сайт не умеет проверять смысл произвольного ответа без ИИ и не выдаёт оценку за знание.</p><button type="button" class="btn" data-v12-selfcheck="'+safe(l.id)+'" '+(marked?'disabled':'')+'>'+(marked?'✓ Самопроверка отмечена':'Я сверил ответ с критериями')+'</button></div>'+
      '<p class="small">Чтобы пройти полную практику урока, нужно верно решить кейс выше и самостоятельно проверить свободный ответ. Это всё ещё самопроверка, а не независимый экзамен.</p></section>';
  }
  function addLesson(){
    const m=(location.hash||'').match(/^#\/learn\/([a-z]+)/);if(!m)return;
    const l=lessons.find(function(x){return x.id===m[1];});if(!l)return;
    const quiz=document.getElementById('quiz');
    if(quiz&&!document.getElementById('v12-self'))quiz.insertAdjacentHTML('afterend',selfHtml(l));
    const existing=root.querySelector('.source-list');
    if(existing&&!document.getElementById('v12-sources'))existing.insertAdjacentHTML('afterend',sourcesHtml(l.id));
  }
  function nav(){
    const el=document.querySelector('.side nav a[href="#/practice"]');
    if(el&&!document.querySelector('.side a[href="#/lab"]'))el.insertAdjacentHTML('afterend','<a class="nav-item" href="#/lab" data-nav="lab"><span class="nav-ico">▧</span> Бизнес-лаборатория</a><a class="nav-item" href="#/arguments" data-nav="arguments"><span class="nav-ico">⚖</span> Проверка аргументов</a><a class="nav-item" href="#/map" data-nav="map"><span class="nav-ico">⋈</span> Карта знаний</a>');
  }
  function labHtml(){
    return pageHead('ЛАБОРАТОРИЯ РЕШЕНИЙ','Решай, а не угадывай','Три придуманных бизнес-ситуации. Здесь нет универсального алгоритма: разбираем причины, альтернативы и риски. Ответы сохраняются только в твоём браузере.')+
      '<div class="v12-grid">'+labCases.map(function(c){
        const selected=memory.lab[c.id];return '<article class="panel v12-card"><div class="eyebrow">'+safe(c.tag)+'</div><h3>'+safe(c.title)+'</h3><p>'+safe(c.situation)+'</p>'+
          c.answers.map(function(a,i){return '<button class="answer-option" type="button" data-v12-lab="'+safe(c.id)+'" data-v12-choice="'+i+'" aria-pressed="'+(selected===i)+'"><span class="answer-letter">'+('АБВ'[i])+'</span><span>'+safe(a)+'</span></button>';}).join('')+
          (Number.isInteger(selected)?'<div class="feedback '+(selected===c.recommended?'good':'')+'"><strong>'+(selected===c.recommended?'Разумный старт':'Есть риск в этом решении')+'</strong><p>'+safe(c.reasons[selected])+'</p><p class="small">Ориентир для обсуждения, а не юридическая или инвестиционная рекомендация.</p></div>':'')+
          '</article>';}).join('')+'</div>'+
      '<div class="note-strip"><strong>Как применить:</strong> перед реальной сделкой выпиши цель, альтернативы, цену ошибки и данные, которые ещё нужны. Не размещай здесь конфиденциальную информацию о других людях.</div>';
  }
  function argumentHtml(){
    return pageHead('КРИТИЧЕСКОЕ МЫШЛЕНИЕ','Проверка аргументов','Сильный тезис → обоснованное возражение → что проверить. Не делаем вид, что каждый спор имеет две равно убедительные стороны.')+
      '<div class="v12-grid">'+debates.map(function(d){return '<article class="panel v12-card"><div class="eyebrow">ИНТЕЛЛЕКТУАЛЬНАЯ ДИСКУССИЯ</div><h3>'+safe(d.title)+'</h3><p><strong>Аргумент:</strong> '+safe(d.position)+'</p><details><summary>Посмотреть сильное возражение</summary><p>'+safe(d.opposition)+'</p><p><strong>Что проверить:</strong> '+safe(d.check)+'</p></details><p class="v12-status">Источник: '+(d.url?'<a href="'+safe(d.url)+'" target="_blank" rel="noopener noreferrer">'+safe(d.source)+'</a>':safe(d.source))+'</p><p class="v12-status">Статус: '+safe(d.status)+'</p></article>';}).join('')+'</div>';
  }
  function mapHtml(){
    const nodes=[
      {title:'Доверие',descr:'От репутации к проверяемым обещаниям',link:'#/learn/trust',next:'Риск · договорённости'},
      {title:'Социальные связи',descr:'Контакты и разные профессиональные круги',link:'#/learn/network',next:'Обмен информацией · сотрудничество'},
      {title:'Границы',descr:'Роли и справедливые правила',link:'#/learn/boundaries',next:'Конфликт · лидерство'},
      {title:'Риск',descr:'Вероятность потери и цена ошибки',link:'#/lab',next:'Доверие · решения'},
      {title:'Репутация',descr:'История поступков, а не внешний статус',link:'#/arguments',next:'Доверие · деловые сети'},
      {title:'Переговоры',descr:'Интересы, условия, альтернативы',link:'#/lab',next:'Границы · риск'},
      {title:'Критическое мышление',descr:'Проверка источника и контраргументы',link:'#/arguments',next:'Все направления'},
      {title:'Повторение',descr:'Память, проверка и возврат к ошибкам',link:'#/reviews',next:'Любой урок'}
    ];
    return pageHead('КАРТА ЗНАНИЙ','Как связаны идеи','Первая интерактивная текстовая карта: каждая связь ведёт к существующему уроку или практике. Полноценная графовая карта знаний будет на следующем этапе.')+
      '<div class="v12-grid">'+nodes.map(function(n){return '<a href="'+n.link+'" class="panel v12-card"><h3>'+safe(n.title)+' ↗</h3><p>'+safe(n.descr)+'</p><small>Связано: '+safe(n.next)+'</small></a>';}).join('')+'</div>';
  }
  function reviewDue(){
    const d=Object.entries(memory.reviewHistory||{}).filter(function(entry){return entry[1]&&entry[1].next;});
    return '<section class="panel v12-extra v12-card" id="v12-reviews"><h3>Самостоятельное повторение</h3><p class="small">После ответа оцени память: «Помню» увеличит интервал, «Забыл» вернёт к ближайшему повторению. Интервалы 1, 3, 7, 14, 30 дней — учебная эвристика.</p>'+
      (d.length?d.map(function(entry){const l=lessons.find(function(x){return x.id===entry[0];});if(!l)return '';const h=entry[1];return '<div class="review-row"><div><strong>'+safe(l.title)+'</strong><p>Следующее: '+safe(new Date(h.next).toLocaleDateString('ru-RU'))+' · '+(h.streak||0)+' успешных подряд</p></div><div class="button-row"><button type="button" class="btn smallbtn" data-v12-review="'+l.id+'" data-grade="forgot">Забыл</button><button type="button" class="btn smallbtn primary" data-v12-review="'+l.id+'" data-grade="remember">Помню</button></div></div>';}).join(''):'<p class="small">Пока нет выполненных самостоятельных проверок. Вернись к одному из уроков.</p>')+'</section>';
  }
  function paint(){
    const hash=(location.hash||'#/').split('?')[0];
    if(hash==='#/lab'||hash==='#/arguments'||hash==='#/map'){
      root.innerHTML=hash==='#/lab'?labHtml():hash==='#/arguments'?argumentHtml():mapHtml();
      const bc=document.getElementById('breadcrumb');if(bc)bc.textContent=hash==='#/lab'?'Бизнес-лаборатория':hash==='#/arguments'?'Проверка аргументов':'Карта знаний';
      document.querySelectorAll('.side [data-nav]').forEach(function(a){a.classList.toggle('active',a.getAttribute('href')===hash);});
    }else if(hash.indexOf('#/learn/')===0){addLesson();}
    else if(hash==='#/reviews'){if(!document.getElementById('v12-reviews'))root.insertAdjacentHTML('beforeend',reviewDue());}
    else if(hash==='#/practice'){if(!document.getElementById('v12-practice-links'))root.insertAdjacentHTML('beforeend','<section id="v12-practice-links" class="panel v12-extra v12-card"><h3>Следующий уровень практики</h3><p>После вариантов ответа попробуй объяснить решение самому. Дополнительные кейсы открой в лаборатории.</p><a class="btn primary" href="#/lab">Перейти в бизнес-лабораторию →</a></section>');}
    else if(hash==='#/'||hash===''){if(!document.getElementById('v12-home'))root.insertAdjacentHTML('beforeend','<section id="v12-home" class="panel v12-extra v12-card"><div class="eyebrow">НОВЫЕ ИНСТРУМЕНТЫ · V1.2</div><h2>Развивай мышление на практике</h2><p>Свободный ответ, бизнес-лаборатория, проверка аргументов и карта связей между знаниями.</p><div class="button-row"><a class="btn primary" href="#/lab">Бизнес-лаборатория</a><a class="btn" href="#/arguments">Проверка аргументов</a><a class="btn" href="#/map">Карта знаний</a></div></section>');}
  }
  function grade(id,quality){
    const h=memory.reviewHistory[id]||{streak:0,next:null};
    h.streak=quality==='remember'?Math.min(5,(h.streak||0)+1):0;
    const days=quality==='remember'?([1,3,7,14,30][Math.max(0,h.streak-1)]):1;
    const dt=new Date();dt.setDate(dt.getDate()+days);
    h.next=dt.toISOString();h.at=new Date().toISOString();
    memory.reviewHistory[id]=h;save();
  }
  document.addEventListener('submit',function(e){
    const f=e.target.closest('form[data-v12-recall]');if(!f)return;
    e.preventDefault();const id=f.dataset.v12Recall;
    const text=f.querySelector('[name="answer"]').value.trim();
    if(text.length<80){alert('Напиши минимум 80 символов своими словами.');return;}
    memory.responses[id]=text.slice(0,2000);memory.checked[id]=false;save();
    const box=document.getElementById('v12-self');if(box){box.outerHTML=selfHtml(lessons.find(function(l){return l.id===id;}));}
  });
  document.addEventListener('click',function(e){
    const t=e.target.closest('button');if(!t)return;
    if(t.dataset.v12Selfcheck){
      const id=t.dataset.v12Selfcheck;
      if((memory.responses[id]||'').trim().length<80)return;
      if(memory.checked[id])return;
      let basic={};try{basic=JSON.parse(localStorage.getItem('samorazvitie_site_v1')||'{}');}catch(_){}
      if(!basic.quiz||!basic.quiz[id]||basic.quiz[id].correct!==true){alert('Сначала правильно реши практический кейс выше, затем вернись к самопроверке.');return;}
      memory.checked[id]=true;grade(id,'remember');save();
      const box=document.getElementById('v12-self');if(box){const l=lessons.find(function(x){return x.id===id;});if(l)box.outerHTML=selfHtml(l);}
      return;
    }
    if(t.dataset.v12Lab){
      memory.lab[t.dataset.v12Lab]=Number(t.dataset.v12Choice);save();paint();return;
    }
    if(t.dataset.v12Review){
      grade(t.dataset.v12Review,t.dataset.grade);paint();return;
    }
  });
  let lastPositionSaved=0;
  const audio=document.getElementById('audio-player');
  if(audio){
    audio.playbackRate=[0.75,1,1.25,1.5,2].includes(+memory.audio?.speed)?+memory.audio.speed:1;
    document.addEventListener('change',function(e){
      if(e.target.id==='audio-input'){
        const f=e.target.files&&e.target.files[0];if(!f)return;
        const previous=memory.audio||{name:'',position:0,speed:1};
        const position=previous.name===f.name?(Number(previous.position)||0):0;
        const rate=Number(previous.speed)||1;
        memory.audio={name:f.name,position:position,speed:rate};save();
        audio.addEventListener('loadedmetadata',function(){
          audio.playbackRate=rate;
          if(Number.isFinite(audio.duration)&&position>0)audio.currentTime=Math.min(position,Math.max(0,audio.duration-1));
        },{once:true});
        document.getElementById('audio-dock').classList.add('is-ready');
        document.getElementById('audio-title').textContent=f.name;
      }else if(e.target.id==='audio-speed'){
        memory.audio.speed=+e.target.value;audio.playbackRate=memory.audio.speed;save();
      }
    });
    audio.addEventListener('timeupdate',function(){
      memory.audio.position=audio.currentTime;
      const clock=document.getElementById('audio-dock-clock');if(clock)clock.textContent=[Math.floor(audio.currentTime/3600),Math.floor(audio.currentTime/60)%60,Math.floor(audio.currentTime)%60].map(function(x){return String(x).padStart(2,'0');}).join(':');
      if(Date.now()-lastPositionSaved>=4000){save();lastPositionSaved=Date.now();}
    });
    audio.addEventListener('pause',save);
  }
  nav();
  window.addEventListener('hashchange',paint);
  paint();
})();