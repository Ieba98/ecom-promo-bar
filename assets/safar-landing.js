(function(){
  if (typeof document === 'undefined') return;

  function initSection(section){
    if (!section || section._sfrInit) return; section._sfrInit = true;
    var sectionId = section.getAttribute('data-section-id');

    // Mobile menu toggle
    var menuBtn = document.getElementById('sfr-menuBtn-' + sectionId);
    var mMenu = document.getElementById('sfr-mMenu-' + sectionId);
    if (menuBtn && mMenu) {
      menuBtn.addEventListener('click', function(){
        var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (mMenu.hasAttribute('hidden')) mMenu.removeAttribute('hidden'); else mMenu.setAttribute('hidden','');
      });
    }

    // Year
    var yearEl = document.getElementById('sfr-year-' + sectionId);
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Reveal pop
    var popEls = section.querySelectorAll('.sfr-reveal-pop');
    if (popEls.length) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.55 });
      popEls.forEach(function(el){ io.observe(el); });
    }

    // iPhone deck interactions
    var deck = section.querySelector('[id^="sfr-iphoneDeck-"]');
    if (deck) {
      var cards = Array.prototype.slice.call(deck.querySelectorAll('.sfr-iphone-card'));
      var stepsRoot = section.querySelector('[id^="sfr-how-steps-"]');
      var steps = stepsRoot ? Array.prototype.slice.call(stepsRoot.querySelectorAll('[role="tab"]')) : [];
      var active = 0;

      function layout(){
        cards.forEach(function(card,i){
          var rel = i - active;
          var x = rel * 140;
          var rot = rel * 10;
          var y = Math.abs(rel) * 8;
          var scale = (i===active) ? 1 : 0.9;
          var z = 10 - Math.abs(rel);
          card.style.zIndex = String(z);
          card.classList.toggle('active', i===active);
          card.classList.toggle('dim', i!==active);
          card.setAttribute('aria-hidden', i===active ? 'false' : 'true');
          card.style.transform = 'translate(-50%, ' + y + 'px) translateX(' + x + 'px) rotate(' + rot + 'deg) scale(' + scale + ')';
        });
        steps.forEach(function(btn,i){
          var sel = i===active; btn.setAttribute('aria-selected', sel ? 'true' : 'false'); btn.tabIndex = sel ? 0 : -1;
        });
      }

      function setActive(idx){ if (idx < 0 || idx > cards.length - 1) return; active = idx; layout(); }

      steps.forEach(function(btn){
        btn.addEventListener('click', function(){ var i = Number(btn.getAttribute('data-idx') || '0'); setActive(i); });
        btn.addEventListener('keydown', function(e){
          if (e.key === 'ArrowRight'){ e.preventDefault(); setActive(Math.min(active+1, cards.length-1)); (steps[Math.min(active, cards.length-1)]||btn).focus(); }
          if (e.key === 'ArrowLeft'){ e.preventDefault(); setActive(Math.max(active-1, 0)); (steps[Math.max(active, 0)]||btn).focus(); }
        });
      });

      var startX=0, startY=0, isTouch=false;
      function onStart(x,y){ startX=x; startY=y; isTouch=true; }
      function onEnd(x,y){ if(!isTouch) return; isTouch=false; var dx=x-startX, dy=y-startY; if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)){ if(dx<0) setActive(Math.min(active+1,cards.length-1)); else setActive(Math.max(active-1,0)); } }
      deck.addEventListener('touchstart', function(e){ onStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive:true });
      deck.addEventListener('touchend', function(e){ onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY); });
      var mouseDown=false, mStart=[0,0];
      deck.addEventListener('mousedown', function(e){ mouseDown=true; mStart=[e.clientX, e.clientY]; });
      deck.addEventListener('mouseup', function(e){ if(!mouseDown) return; mouseDown=false; onEnd(e.clientX, e.clientY); });

      layout();
    }
  }

  function initAll(){
    var sections = document.querySelectorAll('.sfr-landing');
    sections.forEach(initSection);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll, { once: true });
  else initAll();
})(); 