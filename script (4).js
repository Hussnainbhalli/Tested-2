// Lightweight flow controller
(function(){
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

  const intro = $('#intro');
  const comeBtn = $('#comeBtn');
  const feelings = $('#feelings');
  const feelingsOptions = $('#feelingOptions');
  const feelingResponse = $('#feelingResponse');
  const askHelp = $('#askHelp');
  const helpOptions = $('#helpOptions');
  const message = $('#message');
  const bouquetBtn = $('#bouquetBtn');
  const bouquet = $('#bouquet');
  const bouquetStage = $('#bouquetStage');
  const final = $('#final');

  function showScreen(el){
    // hide all screens
    $$('.screen').forEach(s=>s.classList.remove('active'));
    el.classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
  }

  // Opening
  comeBtn.addEventListener('click', () => {
    showScreen(feelings);
    // small entrance animation
    feelings.querySelector('.card').style.transform = 'translateY(6px)';
    setTimeout(()=> feelings.querySelector('.card').style.transform = '', 260);
  });

  // mapping friendly responses
  const responses = {
    not_ok: "I’m here for you, even if it’s just tiny little company right now 🤍",
    a_little_down: "I’m sorry you’re feeling down — I wish I could bring you a warm drink and a cozy blanket ☁️",
    really_tired: "Then you really need some rest, missy 😭🌷",
    not_feeling_good: "That sounds tough. Do you want a little distraction or a soft chat? 🫂",
    okay_ish: "Okay-ish is still something — you’re doing your best and that’s enough 💗",
    little_better: "That’s nice to hear. I’m quietly cheering for you 🌸"
  };

  // When a feeling is chosen
  feelingsOptions.addEventListener('click', (e)=>{
    const btn = e.target.closest('button.opt');
    if(!btn) return;
    // select visual
    $$('.opt', feelingsOptions).forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');

    // micro animation
    btn.style.transform = 'translateY(-6px) scale(1.02)';
    setTimeout(()=> btn.style.transform = '', 220);

    const key = btn.dataset.key;
    const text = responses[key] || "Thanks for telling me, I’ve got you 🌷";

    // show gentle response
    feelingResponse.textContent = text;

    // reveal the next question after a short pause
    setTimeout(()=> {
      askHelp.classList.remove('hidden');
      askHelp.scrollIntoView({behavior:'smooth', block:'center'});
    }, 600);

    // small decorative sparkles near selected button
    createSparkles(btn, 6);
  });

  // Help options interactions
  helpOptions.addEventListener('click', (e)=>{
    const btn = e.target.closest('button.opt');
    if(!btn) return;

    $$('.opt', helpOptions).forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');

    // small reaction depending on choice
    const kind = btn.dataset.help;
    triggerHelpReaction(kind, btn);

    // after brief moment, reveal personal message section
    setTimeout(()=> {
      showScreen(message);
    }, 700);
  });

  function triggerHelpReaction(kind, btn){
    // create lightweight visuals
    if(kind === 'comfort' || kind === 'talk'){
      // hearts float
      floatEmojis(btn, ['💗','🤍'], 6);
    } else if(kind === 'laugh'){
      floatEmojis(btn, ['✨','😂'], 6);
    } else if(kind === 'music'){
      floatEmojis(btn, ['🎵','✨'], 6);
    } else if(kind === 'sweets'){
      floatEmojis(btn, ['🍫','🌸'], 6);
    } else {
      floatEmojis(btn, ['🌷','✨'], 6);
    }
    // tiny message
    const short = {
      comfort: "A hug from afar, always 🫂",
      laugh: "I’ll find you a silly meme in a sec 😂",
      music: "Something soft and warm, on loop 🎵",
      sweets: "Chocolate is a valid plan 🍫",
      talk: "I’m here whenever you want to talk 💬",
      nice_things: "Just little lovely things, coming up 🌸"
    };
    feelingResponse.textContent = short[kind] || "Sending something cozy your way 🌷";
  }

  // Personal message screen: bouquet button
  bouquetBtn.addEventListener('click', ()=> {
    showScreen(bouquet);
    // generate bouquet gradually
    createBouquet();
  });

  // After bouquet complete, show final
  function endSequence(){
    setTimeout(()=> {
      showScreen(final);
    }, 1200);
  }

  // Utilities for light animations
  function createSparkles(root, count=6){
    if(reducedMotion()) return;
    const rect = root.getBoundingClientRect();
    for(let i=0;i<count;i++){
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.textContent = (Math.random()>0.5) ? '✨' : '✦';
      document.body.appendChild(s);
      const left = rect.left + (rect.width * Math.random());
      const top = rect.top + (rect.height * Math.random());
      s.style.left = (left)+'px';
      s.style.top = (top)+'px';
      requestAnimationFrame(()=> {
        s.style.opacity = '1';
        s.style.transform = `translateY(-18px) scale(1.1)`;
      });
      setTimeout(()=> {
        s.style.opacity = '0';
        s.style.transform = `translateY(-34px) scale(.8)`;
      }, 420 + Math.random()*300);
      setTimeout(()=> s.remove(), 900);
    }
  }

  function floatEmojis(root, list, total=6){
    if(reducedMotion()) return;
    const rect = root.getBoundingClientRect();
    for(let i=0;i<total;i++){
      const el = document.createElement('div');
      el.className = 'sparkle';
      el.textContent = list[Math.floor(Math.random()*list.length)];
      document.body.appendChild(el);
      const left = rect.left + rect.width/2 + (Math.random()-0.5)*60;
      const top = rect.top + rect.height/2 + (Math.random()-0.5)*20;
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      requestAnimationFrame(()=>{
        el.style.opacity = '1';
        el.style.transform = `translateY(-46px) scale(1.08)`;
      });
      setTimeout(()=> {
        el.style.opacity = '0';
        el.style.transform = `translateY(-84px) scale(.9)`;
      }, 420 + Math.random()*400);
      setTimeout(()=> el.remove(), 1100);
    }
  }

  // Bouquet generation: add 6-8 items one by one
  function createBouquet(){
    bouquetStage.innerHTML = '';
    const items = ['🌷','🌸','🌼','💗','✨','🦋','🌺'];
    const count = 7; // keep small for performance
    let idx = 0;
    function addOne(){
      if(idx >= count){
        // small finishing flutter
        setTimeout(()=> endSequence(), 900);
        return;
      }
      const el = document.createElement('div');
      el.className = 'bouquet-item';
      // choose flower-ish emoji but keep some hearts/sparkles
      const pick = items[Math.floor(Math.random()*items.length)];
      el.textContent = pick;
      bouquetStage.appendChild(el);

      // position a bit differently each time
      el.style.marginLeft = ((idx - count/2) * 6 ) + 'px';
      // reveal transition
      requestAnimationFrame(()=> {
        el.style.opacity = '1';
        el.style.transform = `translateY(${ -6 - idx*2 }px) scale(1)`;
      });

      // little wobble/sway after appearing using setTimeout loops (lightweight)
      setTimeout(()=> {
        el.style.transition = 'transform .6s ease';
        el.style.transform += ' rotate(' + ((idx%2?1:-1)*6) + 'deg)';
      }, 420 + idx*80);

      idx++;
      setTimeout(addOne, 220 + Math.random()*120);
    }
    addOne();
  }

  // minimal reduced motion check
  function reducedMotion(){
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // small accessibility: keyboard and tap focus styles already native
  // Start on intro (already set in HTML)
})();