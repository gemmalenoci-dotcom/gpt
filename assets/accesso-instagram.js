/* Anteprima e poi «lascia la mail» per chi arriva dai DM di Instagram (20/11/2026, TEST su gpt)
   La pagina si apre normale: appena si scorre un poco (60 px) tutto si sfoca e compare la richiesta della mail, la pagina resta ferma finché non la si lascia.
   Si vede SOLO con ?utm_source=instagram&utm_medium=dm (il pulsante del DM di ManyChat porta lì): chi arriva da altrove, dal sito o da TikTok (ha la sua finestra) non vede niente.
   La mail va nello stesso modulo MailerLite del cancello TikTok (gruppo «TikTok · risorse», campo Fonte = data-fonte): per ora è un test, se funziona si crea un gruppo a parte per Instagram.
   Tag nella pagina (prima di </body>):
   <script src="assets/accesso-instagram.js?v=1" data-risorsa="gpt" data-fonte="GPT" data-endpoint="https://assets.mailerlite.com/jsonp/2697895/forms/<ID modulo>/subscribe"></script>
   Opzioni: data-em (parte corsiva del titolo) · data-promessa (frase sotto il titolo) · data-bottone · data-logo (se la risorsa non ha assets/logo/logo.webp) · data-soglia (pixel di scorrimento, 60) */
(function(){
  var tag=document.currentScript;
  if(!tag)return;
  var RISORSA=tag.getAttribute('data-risorsa')||'risorsa';
  var ENDPOINT=tag.getAttribute('data-endpoint')||'';
  var BOTTONE=tag.getAttribute('data-bottone')||'Continua';
  var FONTE=tag.getAttribute('data-fonte')||'';
  var EM=tag.getAttribute('data-em')||'continua con i comandi';
  var PROMESSA=tag.getAttribute('data-promessa')||'Ti mandiamo i comandi anche per email, con l\'invito al Club gratuito di Unlike Academy e le novità';
  var LOGO=tag.getAttribute('data-logo')||'assets/logo/logo.webp';
  var SOGLIA=parseInt(tag.getAttribute('data-soglia')||'60',10);
  var PRIVACY='https://www.iubenda.com/privacy-policy/15204920';
  var CHIAVE=RISORSA+'-instagram-mail-ok';
  if(!ENDPOINT)return;

  var p=null;
  try{p=new URLSearchParams(location.search)}catch(e){return}
  if((p.get('utm_source')||'').toLowerCase()!=='instagram'||(p.get('utm_medium')||'').toLowerCase()!=='dm')return;
  try{if(localStorage.getItem(CHIAVE)==='1')return}catch(e){}

  var accento='#CD2471',blu='#227CC0';
  var ombra='rgba(34,124,192,.38)';

  var css=document.createElement('style');
  css.textContent=
    '#accesso-ig{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto;background:rgba(243,242,238,.45);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);opacity:0;transition:opacity .4s ease;font-family:"Open Sauce Sans",system-ui,sans-serif;color:#3B3638}'+
    '#accesso-ig.on{opacity:1}'+
    '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){#accesso-ig{background:rgba(243,242,238,.95)}}'+
    '@media(prefers-reduced-motion:reduce){#accesso-ig{transition:none}}'+
    '#accesso-ig .ac-box{width:100%;max-width:480px;background:#fff;border:2px solid #3B3638;border-radius:22px;padding:34px 28px;display:block;grid-template-columns:none;box-shadow:6px 8px 0 '+ombra+'}'+
    '#accesso-ig .ac-bollino{display:inline-block;font-weight:800;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:'+accento+';margin-bottom:12px}'+
    '#accesso-ig .ac-logo{display:block;width:210px;max-width:72%;height:auto;margin:0 0 22px}'+
    '#accesso-ig h2{font-family:"Open Sauce Sans",system-ui,sans-serif;font-weight:900;font-size:30px;line-height:1.08;letter-spacing:-.045em;margin:0 0 12px;color:#3B3638}'+
    '#accesso-ig h2 em{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-weight:700;letter-spacing:-.03em;color:'+accento+'}'+
    '#accesso-ig input:focus{outline:none;border-color:'+accento+'}'+
    '#accesso-ig p{font-size:16px;line-height:1.5;margin:0 0 14px;color:#5A5456}'+
    '#accesso-ig input[type=text],#accesso-ig input[type=email]{width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:15px 18px;border:2px solid #3B3638;border-radius:14px;margin:6px 0 14px;background:#fff;color:#3B3638}'+
    '#accesso-ig label.ac-spunta{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.45;color:#665E61;margin-bottom:18px;cursor:pointer}'+
    '#accesso-ig label.ac-spunta input{margin-top:3px;width:18px;height:18px;flex:none;accent-color:'+accento+'}'+
    '#accesso-ig a{color:'+blu+'}'+
    '#accesso-ig button{width:100%;font:inherit;font-weight:800;font-size:18px;border:0;border-radius:100px;padding:17px 24px;background:'+accento+';color:#fff;cursor:pointer;box-shadow:4px 5px 0 '+ombra+'}'+
    '#accesso-ig button[disabled]{opacity:.6;cursor:wait}'+
    '#accesso-ig .ac-errore{color:#B3261E;font-size:14px;min-height:18px;margin:0 0 10px}'+
    '#accesso-ig .ac-piccolo{font-size:13px;margin:14px 0 0;color:#665E61}'+
    '@media(max-width:600px){#accesso-ig{padding-bottom:200px}}'+
    'body.accesso-aperto{overflow:hidden}';
  document.head.appendChild(css);

  var box=document.createElement('div');
  box.id='accesso-ig';
  box.setAttribute('role','dialog');
  box.setAttribute('aria-modal','true');
  box.setAttribute('aria-labelledby','accesso-ig-titolo');
  box.innerHTML=
    '<form class="ac-box" novalidate>'+
      '<img class="ac-logo" src="'+LOGO+'" alt="Unlike Academy" width="768" height="158">'+
      '<span class="ac-bollino">Gratis</span>'+
      '<h2 id="accesso-ig-titolo">Lascia la tua email e <em>'+EM+'</em></h2>'+
      '<p>'+PROMESSA+'</p>'+
      '<input type="text" name="nome" placeholder="Il tuo nome" autocomplete="given-name" required aria-label="Il tuo nome">'+
      '<input type="email" name="email" placeholder="La tua email" autocomplete="email" required aria-label="La tua email">'+
      '<label class="ac-spunta"><input type="checkbox" name="consenso" required><span>Accetto di ricevere email di Unlike Academy, mi disiscrivo quando voglio · <a href="'+PRIVACY+'" target="_blank" rel="noopener">Informativa privacy</a></span></label>'+
      '<p class="ac-errore" role="alert"></p>'+
      '<button type="submit">'+BOTTONE+'</button>'+
      '<p class="ac-piccolo">Se non vedi le nostre mail, guarda in Promozioni e in Spam</p>'+
    '</form>';

  /* si apre al primo scorrimento oltre la soglia (o subito, se la pagina arriva già scesa, per esempio da un'àncora) */
  var aperto=false;
  function posizione(){return window.pageYOffset||document.documentElement.scrollTop||0}
  function apri(){
    if(aperto||!document.body)return;
    aperto=true;
    window.removeEventListener('scroll',alScorrimento);
    document.body.appendChild(box);
    document.body.classList.add('accesso-aperto');
    box.offsetWidth;
    box.classList.add('on');
    var i=box.querySelector('input[name=nome]');
    if(i)try{i.focus({preventScroll:true})}catch(e){}
  }
  function alScorrimento(){if(posizione()>SOGLIA)apri()}
  window.addEventListener('scroll',alScorrimento,{passive:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',alScorrimento);else alScorrimento();

  var form=box.querySelector('form');
  var errore=box.querySelector('.ac-errore');
  var bottone=box.querySelector('button');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var nome=(form.nome.value||'').trim();
    var email=(form.email.value||'').trim();
    if(!nome){errore.textContent='Scrivi il tuo nome';form.nome.focus();return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){errore.textContent='Controlla l\'indirizzo email';form.email.focus();return}
    if(!form.consenso.checked){errore.textContent='Per continuare serve la spunta';return}
    errore.textContent='';
    bottone.disabled=true;bottone.textContent='Un attimo';
    var dati=new FormData();
    dati.append('fields[email]',email);
    dati.append('fields[name]',nome);
    if(FONTE){dati.append('fields[fonte]',FONTE);dati.append('fields[risorsa_link]',location.origin+'/?utm_source=email&utm_medium=mailerlite&utm_campaign='+RISORSA+'&utm_content=instagram')}
    dati.append('ml-submit','1');
    dati.append('anticsrf','true');
    var chiudi=function(){
      try{localStorage.setItem(CHIAVE,'1')}catch(x){}
      box.classList.remove('on');
      setTimeout(function(){box.remove()},400);
      document.body.classList.remove('accesso-aperto');
    };
    fetch(ENDPOINT,{method:'POST',body:dati,mode:'no-cors'}).then(chiudi).catch(function(){
      bottone.disabled=false;bottone.textContent=BOTTONE;errore.textContent='Non è partito, riprova tra un attimo';
    });
  });
})();
