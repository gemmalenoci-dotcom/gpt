/* gpt.unlikeacademy.it · ogni comando copia la frase intera (frase di base + comando), ricette, prove prima e dopo da prove/prove.json */
(function(){
  var BASI=window.BASI||{};
  var toastEl,toastT;

  function toast(msg){
    if(!toastEl){toastEl=document.createElement('div');toastEl.className='toast';toastEl.setAttribute('role','status');toastEl.setAttribute('aria-live','polite');document.body.appendChild(toastEl)}
    toastEl.textContent=msg;toastEl.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('on')},2200);
  }
  function riserva(t,fatto){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(a);fatto()}
  function copia(t,fatto){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(fatto).catch(function(){riserva(t,fatto)})}else{riserva(t,fatto)}
  }
  function frase(base,cmd){return (BASI[base]||'').split('[COMANDO]').join(cmd)}

  /* anteprima: la frase con il comando evidenziato */
  function disegna(pre,base,cmd){
    var pezzi=(BASI[base]||'').split('[COMANDO]');
    while(pre.firstChild)pre.removeChild(pre.firstChild);
    pezzi.forEach(function(p,i){
      pre.appendChild(document.createTextNode(p));
      if(i<pezzi.length-1){var s=document.createElement('span');s.className='cm';s.textContent=cmd;pre.appendChild(s)}
    });
  }

  /* i riquadri dei comandi */
  var NOTE={tema:'Prima di incollare, scrivi il tuo tema al posto di [IL TUO TEMA]'};
  document.querySelectorAll('.cmdbox').forEach(function(box){
    var base=box.dataset.base;
    var chips=[].slice.call(box.querySelectorAll('.chip'));
    var cur=chips[0]?chips[0].dataset.c:'';
    var pre=box.querySelector('.pv'),agg=box.querySelector('.agg');
    function agg_(){if(!agg)return;if(NOTE[base]){agg.textContent=NOTE[base];agg.hidden=false}else{agg.hidden=true}}
    function mostra(){disegna(pre,base,cur);agg_()}
    box.querySelectorAll('.bases button').forEach(function(b){
      b.addEventListener('click',function(){
        base=b.dataset.base;
        box.querySelectorAll('.bases button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
        mostra();
      });
    });
    chips.forEach(function(c){
      c.addEventListener('click',function(){
        cur=c.dataset.c;
        chips.forEach(function(x){x.classList.toggle('on',x===c)});
        mostra();
        var t=frase(base,cur);
        copia(t,function(){
          var cp=c.querySelector('.cp'),o=cp.textContent;
          cp.textContent='Copiato ✓';c.classList.add('done');
          toast('Copiata la frase con '+cur);
          setTimeout(function(){cp.textContent=o;c.classList.remove('done')},1700);
        });
      });
    });
    var bp=box.querySelector('.cp-prev');
    if(bp)bp.addEventListener('click',function(){
      copia(frase(base,cur),function(){var o=bp.textContent;bp.textContent='Copiata ✓';bp.classList.add('done');toast('Copiata la frase con '+cur);setTimeout(function(){bp.textContent=o;bp.classList.remove('done')},1700)});
    });
    box._stato=function(){return {base:base,cur:cur}};
  });

  /* ricette: più comandi nella stessa frase */
  document.querySelectorAll('.ricetta').forEach(function(r){
    var b=r.querySelector('.cp-ric');
    b.addEventListener('click',function(){
      copia(frase(r.dataset.base,r.dataset.c),function(){var o=b.textContent;b.textContent='Copiata ✓';b.classList.add('done');toast('Copiata la ricetta');setTimeout(function(){b.textContent=o;b.classList.remove('done')},1700)});
    });
  });

  /* frasi intere (home e riquadri «da aggiungere») */
  document.querySelectorAll('.copy[data-target]').forEach(function(b){
    b.addEventListener('click',function(e){
      e.preventDefault();
      var p=document.getElementById(b.dataset.target);if(!p)return;
      copia(p.innerText,function(){var o=b.textContent;b.textContent='Copiata ✓';b.classList.add('done');toast('Frase copiata');setTimeout(function(){b.textContent=o;b.classList.remove('done')},1700)});
    });
  });

  /* ingrandire un'immagine di prova */
  function ingrandisci(src,alt){
    var o=document.createElement('div');o.className='lb';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
    var im=document.createElement('img');im.src=src;im.alt=alt;
    var b=document.createElement('button');b.type='button';b.className='lb-x';b.setAttribute('aria-label','Chiudi');b.textContent='×';
    o.appendChild(im);o.appendChild(b);
    function chiudi(){document.removeEventListener('keydown',tasto);if(o.parentNode)o.parentNode.removeChild(o)}
    function tasto(e){if(e.key==='Escape')chiudi()}
    o.addEventListener('click',chiudi);document.addEventListener('keydown',tasto);document.body.appendChild(o);b.focus();
  }

  /* prove prima e dopo: compaiono da sole se in prove/prove.json c'è il file (vedi _sorgente-gpt/prove.py) */
  function coppia(p,part,etichetta,copiaFn){
    var fig=document.createElement('figure'),due=document.createElement('div');
    fig.className='pd';due.className='due';
    function im(file,et,alt){
      var w=document.createElement('button');w.type='button';w.className='im';w.setAttribute('aria-label','Ingrandisci: '+alt);
      var s=document.createElement('span');s.className='et';s.textContent=et;
      var i=document.createElement('img');i.src='prove/'+file;i.alt=alt;i.loading='lazy';
      w.appendChild(s);w.appendChild(i);w.addEventListener('click',function(){ingrandisci(i.src,alt)});return w;
    }
    var pr=p.prima||part;
    if(pr)due.appendChild(im(pr,'Prima','La foto di partenza'));else fig.classList.add('solo');
    due.appendChild(im(p.dopo,'Dopo','Il risultato con '+etichetta));
    fig.appendChild(due);
    if(copiaFn){
      var cap=document.createElement('figcaption'),cd=document.createElement('code');cd.textContent=etichetta;
      var bt=document.createElement('button');bt.type='button';bt.className='copy-s';bt.textContent='Copia la frase';
      bt.addEventListener('click',function(){copiaFn(function(){bt.textContent='Copiata ✓';setTimeout(function(){bt.textContent='Copia la frase'},1700)})});
      cap.appendChild(cd);cap.appendChild(bt);fig.appendChild(cap);
    }
    return fig;
  }
  var boxes=document.querySelectorAll('.cmdbox'),ric=document.querySelectorAll('.ricetta[data-id]');
  if(!(boxes.length||ric.length)||!window.fetch)return;
  fetch('prove/prove.json').then(function(r){return r.ok?r.json():null}).then(function(d){
    if(!d||!d.prove)return;
    boxes.forEach(function(box){
      var gr=box.querySelector('.pdg'),wrap=box.querySelector('.pdbox');if(!gr)return;
      var part=d.partenza&&d.partenza[box.dataset.partenza];
      box.querySelectorAll('.chip').forEach(function(c){
        var p=d.prove[c.dataset.id];if(!p||!p.dopo)return;
        gr.appendChild(coppia(p,part,c.dataset.c,function(ok){var st=box._stato();copia(frase(st.base,c.dataset.c),function(){toast('Copiata la frase con '+c.dataset.c);ok()})}));
      });
      if(gr.children.length)wrap.hidden=false;
    });
    ric.forEach(function(r){
      var p=d.prove[r.dataset.id];if(!p||!p.dopo)return;
      var part=d.partenza&&d.partenza[r.dataset.partenza];
      var rp=document.createElement('div');rp.className='rp';rp.appendChild(coppia(p,part,'la ricetta',null));r.appendChild(rp);
    });
  }).catch(function(){});
})();
