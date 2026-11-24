/* أرقام الباليتات من القايمة (P0001…P0200 ثم P0201…P0400 …) — كل رقم يتاخد مرة واحدة بس على كل الموبايلات.
   الأرقام المستخدمة بتتحفظ على الموبايل وبتتزامن مع سيرفر الدخول (لو متاح). الرقم اللي يتحذف من التقرير يرجع للقايمة. */
(function(){
const PK='alola_pallet_pool',BLOCK=200,RE=/^P\d{4,6}$/;
const fmt=n=>'P'+String(n).padStart(4,'0');
const numOf=p=>RE.test(p)?parseInt(p.slice(1),10):0;
function dec(list){const o=new Set();(list||[]).forEach(x=>{const m=String(x).match(/^(P\d+)(?:-(P\d+))?$/);if(!m)return;if(!m[2]){o.add(m[1]);return}const w=m[1].length-1,a=parseInt(m[1].slice(1),10),b=parseInt(m[2].slice(1),10);if(b-a>20000)return;for(let i=a;i<=b;i++)o.add('P'+String(i).padStart(w,'0'))});return o}
function enc(set){const n=[...set].filter(x=>RE.test(x)).map(x=>[x.length-1,parseInt(x.slice(1),10)]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);const out=[];let s=null,p=null,w=0;const f=(v,ww)=>'P'+String(v).padStart(ww,'0');
 for(const [ww,v] of n){if(s!==null&&v===p+1&&ww===w){p=v;continue}if(s!==null)out.push(s===p?f(s,w):f(s,w)+'-'+f(p,w));s=p=v;w=ww}if(s!==null)out.push(s===p?f(s,w):f(s,w)+'-'+f(p,w));return out}
let P={mine:new Set(),srv:new Set(),gen:'',pc:new Set(),pr:new Set(),conf:new Set(),at:0,on:null};
try{const x=JSON.parse(localStorage.getItem(PK)||'null');if(x){P.mine=dec(x.mine);P.srv=dec(x.srv);P.gen=x.gen||'';P.pc=new Set(x.pc||[]);P.pr=new Set(x.pr||[]);P.conf=new Set(x.conf||[]);P.at=x.at||0}}catch(e){}
function persist(){try{localStorage.setItem(PK,JSON.stringify({mine:enc(P.mine),srv:enc(P.srv),gen:P.gen,pc:[...P.pc],pr:[...P.pr],conf:[...P.conf],at:P.at}))}catch(e){}}
const present=()=>{const s=new Set();(S.rows||[]).forEach(r=>{if(r&&RE.test(r.p||''))s.add(r.p)});return s};
function used(){const u=new Set([...P.srv,...P.mine,...present()]);P.pr.forEach(x=>{if(!P.mine.has(x)&&!present().has(x))u.delete(x)});return u}
const takenByOther=p=>RE.test(p||'')&&(P.conf.has(p)||(P.srv.has(p)&&!P.mine.has(p)&&!P.pr.has(p)));
/* ---------- server ---------- */
const tok=()=>{try{return localStorage.getItem('alola_auth_token')||''}catch(e){return ''}};
const api=()=>(window.AlolaAuth&&AlolaAuth.apiBase)||window.ALOLA_AUTH_API||'https://alola-maggi-auth.onrender.com';
async function call(path,body){const t=tok();if(!t)throw new Error('no-login');const r=await fetch(api()+path,{method:body?'POST':'GET',headers:Object.assign({'Content-Type':'application/json',Authorization:'Bearer '+t}),body:body?JSON.stringify(body):undefined});if(r.status===404)throw new Error('old-server');const d=await r.json().catch(()=>null);if(!r.ok||!d||!d.ok)throw new Error('http-'+r.status);return d}
function take(d){P.srv=dec(d.used);const m=dec(d.mine);P.pc.forEach(x=>m.add(x));((S&&S.poolNums)||[]).forEach(x=>{if(!P.conf.has(x))m.add(x)});P.pr.forEach(x=>m.delete(x));P.mine=m;P.gen=d.gen||P.gen;P.at=Date.now();P.on=true}
let busy=false,again=false;
async function flush(){if(busy){again=true;return}busy=true;try{
  let d=await call('/api/pallets');
  if(P.gen&&d.gen!==P.gen&&P.mine.size){const all=[...P.mine];for(let i=0;i<all.length;i+=1000){const x=await call('/api/pallets/claim',{nums:all.slice(i,i+1000)});x.taken.forEach(n=>{P.conf.add(n);P.mine.delete(n)});d=x}}
  take(d);
  if(P.pr.size){const nums=[...P.pr].filter(x=>!present().has(x));const x=await call('/api/pallets/release',{nums});nums.forEach(n=>P.pr.delete(n));take(x)}
  if(P.pc.size){const nums=[...P.pc];const x=await call('/api/pallets/claim',{nums});nums.forEach(n=>P.pc.delete(n));x.taken.forEach(n=>{P.conf.add(n);P.mine.delete(n);if(S.poolNums)S.poolNums=S.poolNums.filter(y=>y!==n)});take(x);if(x.taken.length){try{ptoast('⚠ الرقم '+x.taken.join('، ')+' اتاخد من موبايل تاني — غيّر رقم الباليت ده')}catch(e){}}}
  persist();
  /* v4: a number on this report that was another phone's (flagged) and has since been freed is claimed now — before, it was never claimed and the pool could hand it to a third phone */
  if(S&&Array.isArray(S.poolNums)){const pr=present();let need=false;P.conf.forEach(n=>{if(!P.srv.has(n)){P.conf.delete(n);need=true}});pr.forEach(n=>{if(!S.poolNums.includes(n)&&!takenByOther(n))need=true});if(need){persist();changed()}}
 }catch(e){P.on=false}finally{busy=false;paint();if(typeof upd==='function'&&P.conf.size)upd();if(again){again=false;setTimeout(flush,50)}}}
/* ---------- reconcile the report with the pool (claim new numbers, free removed ones) ---------- */
let rt=null;
function reconcile(){if(!S)return;if(!Array.isArray(S.poolNums))S.poolNums=[];const pr=present();let ch=false;
 pr.forEach(n=>{if(S.poolNums.includes(n))return;if(takenByOther(n))return;S.poolNums.push(n);if(!P.mine.has(n)){P.mine.add(n);P.pc.add(n)}P.pr.delete(n);ch=true});
 S.poolNums=S.poolNums.filter(n=>{if(pr.has(n))return true;P.mine.delete(n);P.pc.delete(n);P.pr.add(n);ch=true;return false});
 P.conf.forEach(n=>{if(!pr.has(n))P.conf.delete(n)});
 if(ch){persist();try{save()}catch(e){}flush()}}
function changed(){clearTimeout(rt);rt=setTimeout(reconcile,700)}
/* ---------- spec completeness of a card ---------- */
function specOk(r){if(!r||!r.v)return false;if(['v','s','pk','c','b','g','loc','n'].some(k=>!String(r[k]||'').trim()))return false;if(!/^[1-9]\d*$/.test(String(r.n).trim()))return false;if(r.s==='MIX'){const L=mixLines(r);if(L.length<2||new Set(L.map(x=>x.s)).size!==L.length||(parseInt(r.n)||0)!==mixSum(r))return false}return true}
function rowHook(i){const b=document.getElementById('pk'+i);if(!b)return;const r=S.rows[i];const ok=specOk(r);b.disabled=!ok;b.textContent=ok?(r.p?'🔢 باليتات تانية بنفس المواصفة':'🔢 اختار أرقام الباليتات'):'🔢 أرقام الباليتات — كمّل المواصفة الأول'}
/* ---------- v2 entry: one sheet → «المواصفة» (big chips, last spec prefilled, recent specs) → «الأرقام» (big buttons, range, +N) → «تأكيد» ---------- */
let cur=null;
const RK='alola_pallet_specs',SK=['v','pk','c','s','mix','b','g','loc','n','w'];
const specOf=r=>{const o={};SK.forEach(k=>{o[k]=k==='mix'?(r.s==='MIX'&&Array.isArray(r.mix)?JSON.parse(JSON.stringify(r.mix)):[]):String(r[k]??'')});return o};
const specKey=o=>JSON.stringify(SK.map(k=>k==='mix'?(o.s==='MIX'?mixLines(o).map(x=>x.s+':'+x.n).join(','):''):o[k]));
function recent(){let L=[];try{L=JSON.parse(localStorage.getItem(RK)||'[]')}catch(e){}if(!L.length){const cnt={};(S.rows||[]).forEach(r=>{if(r.p&&specOk(r)){const o=specOf(r),k=specKey(o);cnt[k]=cnt[k]||{o,n:0};cnt[k].n++}});L=Object.values(cnt).sort((a,b)=>b.n-a.n).map(x=>x.o)}const seen=new Set(),out=[];L.forEach(o=>{if(!specOk(o))return;const k=specKey(o);if(seen.has(k))return;seen.add(k);out.push(o)});return out.slice(0,6)}
function remember(o){let L=[];try{L=JSON.parse(localStorage.getItem(RK)||'[]')}catch(e){}const k=specKey(o);L=[specOf(o)].concat(L.filter(x=>specKey(x)!==k)).slice(0,8);try{localStorage.setItem(RK,JSON.stringify(L))}catch(e){}}
const css=`#pp{position:fixed;inset:0;z-index:300;background:#f4f6f4;display:flex;flex-direction:column}
#pp .h{background:var(--g);color:#fff;padding:8px 12px;padding-top:max(8px,env(safe-area-inset-top));display:flex;align-items:center;gap:8px}
#pp .h b{flex:1;font-size:17px}#pp .h button{background:#ffffff26;color:#fff;min-height:40px;padding:4px 12px;font-size:15px}
#pp .steps{display:flex;gap:6px;padding:8px 12px 0}#pp .steps span{flex:1;text-align:center;font-size:12.5px;padding:5px 0;border-radius:20px;background:#e3e8e3;color:#667}#pp .steps span.on{background:var(--g);color:#fff;font-weight:700}#pp .steps span.done{background:#cfe3d0;color:var(--g)}
#pp .body{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:6px 12px 14px}
#pp .grp{background:#fff;border-radius:14px;padding:8px 10px 10px;margin-top:8px;box-shadow:0 1px 3px #0001}
#pp .grp.need{box-shadow:0 0 0 2px var(--warn)}
#pp .gt{font-size:13px;color:#555;margin-bottom:6px;display:flex;justify-content:space-between}#pp .gt b{color:var(--g)}
#pp .chips{display:flex;flex-wrap:wrap;gap:7px}
#pp .ch{min-height:46px;padding:6px 14px;border-radius:24px;background:#f1f4f1;border:1.5px solid #d6dcd6;color:#222;font-size:16px;font-weight:600}
#pp .ch.on{background:var(--g);border-color:var(--g);color:#fff}#pp .ch.add{background:#fff;border-style:dashed;color:#666;font-weight:400}
#pp .rec{display:flex;flex-direction:column;gap:7px}
#pp .rc{text-align:right;background:#fff;border:1.5px solid #cfe0d0;border-radius:14px;padding:9px 12px;font-size:14.5px;line-height:1.5;color:#1d3b22;min-height:56px}
#pp .rc b{font-size:16px}#pp .rc small{display:block;color:#666;font-size:12.5px}
#pp .num{display:flex;align-items:center;gap:8px}#pp .num input{flex:1;text-align:center;font-size:22px;font-weight:700;min-height:54px}
#pp .num button{width:56px;min-height:54px;font-size:24px;background:#e8efe8;color:var(--g);padding:0}
#pp .mixl{display:flex;align-items:center;gap:8px;margin-top:6px}#pp .mixl b{min-width:60px;text-align:center;background:var(--g);color:#fff;border-radius:10px;padding:10px 4px}#pp .mixl input{flex:1;min-height:48px;font-size:18px;text-align:center}
#pp .sum{background:#fff;margin:8px 12px 0;border-radius:12px;padding:7px 10px;font-size:13px;line-height:1.7;box-shadow:0 1px 3px #0002;display:flex;gap:8px;align-items:flex-start}
#pp .sum .t{flex:1}#pp .sum span{display:inline-block;background:#e8efe8;color:var(--g);border-radius:8px;padding:0 7px;margin:1px 0 1px 4px;font-weight:600}
#pp .sum button{min-height:34px;padding:2px 10px;font-size:13px;background:#fff;border:1.5px solid var(--g2);color:var(--g)}
#pp .nav{display:flex;align-items:center;gap:6px;margin:8px 12px 0}
#pp .nav .rg{flex:1;text-align:center;font-weight:700;direction:ltr;font-size:15px}#pp .nav .rg small{display:block;font-weight:400;color:#666;font-size:12px;direction:rtl}
#pp .nav button{min-height:42px;padding:4px 12px;background:#e8efe8;color:var(--g)}#pp .nav button:disabled{opacity:.35}
#pp .tools{display:flex;gap:6px;margin:8px 12px 0;flex-wrap:wrap}
#pp .tools button{flex:1;min-height:46px;padding:4px 6px;background:#fff;border:1.5px solid var(--g2);color:var(--g);font-size:15px;font-weight:700}
#pp .tools button:first-child{flex:1.7}#pp .tools button.on{background:#fff6dc;border-color:#d39e00;color:#7a5a00}
#pp .hint2{margin:6px 12px 0;font-size:13px;color:#7a5a00;background:#fff6dc;border-radius:10px;padding:6px 10px}
#pp .grid{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:8px 12px 12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;align-content:start}
#pp .c{min-height:58px;border-radius:12px;background:#fff;border:1.5px solid #d6dcd6;color:#222;font-weight:700;font-size:17px;direction:ltr;padding:0}
#pp .c.on{background:var(--g);border-color:var(--g);color:#fff}#pp .c.anc{box-shadow:0 0 0 3px #d39e00}
#pp .none{grid-column:1/-1;text-align:center;color:#666;padding:20px;font-size:14px}
#pp .ft{background:#fff;box-shadow:0 -2px 8px #0002;padding:8px 12px;padding-bottom:max(8px,env(safe-area-inset-bottom))}
#pp .cnt{display:flex;align-items:center;gap:8px;margin-bottom:6px}#pp .cnt b{font-size:22px;color:var(--g);min-width:34px;text-align:center}#pp .cnt .rgs{flex:1;font-size:13px;color:#444;direction:ltr;text-align:right;max-height:36px;overflow:hidden}
#pp .cnt button{min-height:34px;padding:2px 10px;font-size:13px;background:#fdecea;color:var(--bad)}
#pp .sync{font-size:11.5px;color:#666;margin-bottom:6px}#pp .sync.off{color:#b45309}
#pp .ft .go{width:100%;min-height:54px;font-size:17px;font-weight:700}#pp .ft .go:disabled{background:#9db59f}
#pp .mk{background:none;color:#666;font-size:12px;min-height:30px;padding:2px;text-decoration:underline;width:100%}
#pp .cf{position:absolute;inset:0;background:#0007;display:flex;align-items:flex-end}
#pp .cfb{background:#fff;width:100%;border-radius:18px 18px 0 0;padding:16px 14px;padding-bottom:max(14px,env(safe-area-inset-bottom))}
#pp .cfb h3{margin:0 0 8px;font-size:20px;color:var(--g)}#pp .cfb .big{font-size:15px;line-height:1.8}#pp .cfb .big span{display:inline-block;background:#e8efe8;color:var(--g);border-radius:8px;padding:0 8px;margin:2px 0 2px 4px;font-weight:600}
#pp .cfb .nums{direction:ltr;text-align:right;font-weight:700;font-size:17px;margin:8px 0 12px;color:#111}
#pp .cfb .row2{display:grid;grid-template-columns:1fr 2fr;gap:8px}#pp .cfb .row2 button{min-height:56px;font-size:17px;font-weight:700}
.pkb{width:100%;margin-top:8px;background:#e8efe8;color:var(--g);font-weight:700}.pkb:disabled{background:#f1f1f1;color:#9a9a9a;font-weight:400;font-size:14px}
.prm{background:#fdecea;color:var(--bad);min-height:34px;padding:4px 10px;font-size:13px}
.pbar{display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:10px}.pbar.two{grid-template-columns:3fr 2fr}.pbar button{min-height:56px;font-size:16px;font-weight:700}
.pbar .pl{background:#fff;border:2px solid var(--g);color:var(--g);font-size:14px;line-height:1.3}
@keyframes ppf{0%{box-shadow:0 0 0 3px #4a7c50}100%{box-shadow:none}}.row.flash{animation:ppf 1.6s ease-out}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function firstFreeBlock(u){let b=0;for(;b<500;b++){let free=false;for(let n=b*BLOCK+1;n<=(b+1)*BLOCK;n++)if(!u.has(fmt(n))){free=true;break}if(free)break}return b}
function specText(r){const sz=r.s==='MIX'?sizeLabel(r):r.s;return [r.v,'مقاس '+sz,r.c,r.b,'درجة '+r.g,r.loc,r.n+' كرتونة'].filter(x=>x&&!/undefined/.test(x)).map(x=>'<span>'+esc(x)+'</span>').join('')}
function rangesOf(list){const a=list.slice().sort((x,y)=>numOf(x)-numOf(y));const out=[];let s=null,p=null;a.forEach(x=>{const n=numOf(x);if(s!==null&&n===numOf(p)+1){p=x;return}if(s!==null)out.push(s===p?s:s+' → '+p);s=p=x});if(s!==null)out.push(s===p?s:s+' → '+p);return out.join('، ')}
function mount(){let el=document.getElementById('pp');if(el)el.remove();el=document.createElement('div');el.id='pp';document.body.appendChild(el);const tt=document.getElementById('ptoast');if(tt)tt.style.display='none';return el}
function startNums(spec,i){const u=used();const f=firstFreeBlock(u);cur={spec,i,step:'nums',sel:[],block:f,first:f,anchor:null,range:false,confirm:false};mount();draw();flush()}
function openRow(i){const r=S.rows[i];if(!specOk(r)){ptoast('كمّل مواصفة الباليت الأول (الصنف، المقاس، الكرتون، الدرجة، التخزين، عدد الكراتين)');return}startNums(specOf(r),i)}
function openNew(){const R=recent();const base=R[0]?JSON.parse(JSON.stringify(R[0])):{v:'',pk:'',c:'',s:'',mix:[],b:'',g:'',loc:'',n:'',w:''};cur={spec:base,i:null,step:'spec',sel:[],block:0,first:0,anchor:null,range:false,confirm:false};mount();draw()}
function close(){const el=document.getElementById('pp');if(el)el.remove();cur=null}
function syncText(){if(P.on===true)return '<div class="sync">✓ الأرقام متزامنة مع كل الموبايلات'+(P.at?' — آخر تحديث '+new Date(P.at).toTimeString().slice(0,5):'')+'</div>';if(P.on===false)return '<div class="sync off">⚠ مفيش اتصال بالسيرفر دلوقتي — الأرقام محفوظة على الموبايل ده وهتتزامن أول ما النت يرجع</div>';return '<div class="sync">… بيتأكد من الأرقام المستخدمة</div>'}
const steps=s=>`<div class="steps"><span class="${s==='spec'?'on':'done'}">١ المواصفة</span><span class="${s==='nums'?'on':s==='spec'?'':'done'}">٢ الأرقام</span><span class="${s==='ok'?'on':''}">٣ تأكيد</span></div>`;
const chip=(f,v,on,lab)=>`<button type="button" class="ch${on?' on':''}" data-sf="${f}" data-sv="${esc(v)}">${esc(lab||v)}</button>`;
function grp(title,f,list,val,extra){const need=!String(val||'').trim();return `<div class="grp${need&&cur.tried?' need':''}" id="g_${f}"><div class="gt"><span>${title}</span><b>${esc(val||'')}</b></div><div class="chips">${list.map(x=>chip(f,x,x===val)).join('')}${extra||''}</div></div>`}
function drawSpec(el){const W=cur.spec;const R=recent();const g=GOF(W.v);
 const packs=L.pack;const cts=W.v?CTg(W):[];const sz=W.v?rowSizes(W):[];
 let sizeHTML='';
 if(!W.v)sizeHTML=`<div class="grp" id="g_s"><div class="gt"><span>المقاس</span></div><div class="hint">اختار الصنف الأول</div></div>`;
 else if(sz===null)sizeHTML=`<div class="grp" id="g_s"><div class="gt"><span>عدد الحبات بالصندوق</span><b>${esc(W.s)}</b></div><div class="num"><input id="pps" type="number" inputmode="numeric" value="${esc(W.s)}" placeholder="العدد"></div></div>`;
 else if(g&&!sz.length)sizeHTML=`<div class="grp" id="g_s"><div class="gt"><span>المقاس</span></div><div class="hint">اختار نوع الكرتون الأول</div></div>`;
 else{const L2=sz.length?sz:SZ();sizeHTML=grp('المقاس','s',L2,W.s==='MIX'?'':W.s,chip('s','MIX',W.s==='MIX','MIX أكتر من مقاس')+'<button type="button" class="ch add" data-sadd="s">+ مقاس</button>');
  if(W.s==='MIX'){const picked=(W.mix||[]).map(x=>x.s);sizeHTML=sizeHTML.replace(/<\/div><\/div>$/,'')+`</div><div class="gt" style="margin-top:8px"><span>دوس على المقاسات اللي في الباليت واكتب كراتين كل مقاس</span></div><div class="chips">${L2.map(x=>`<button type="button" class="ch${picked.includes(x)?' on':''}" data-mixs="${esc(x)}">${esc(x)}</button>`).join('')}</div>${(W.mix||[]).map((m,j)=>`<div class="mixl"><b>${esc(m.s)}</b><input type="number" inputmode="numeric" data-mixn="${j}" value="${esc(m.n)}" placeholder="كراتين"></div>`).join('')}<div class="hint" style="margin-top:6px">المجموع: ${mixSum(W)} كرتونة</div></div>`}}
 const nIsMix=W.s==='MIX';
 el.innerHTML=`<div class="h"><button type="button" data-pp="x">✕ إلغاء</button><b>باليتات جديدة</b></div>${steps('spec')}
 <div class="body">
 ${R.length?`<div class="grp"><div class="gt"><span>⚡ مواصفة استخدمتها قبل كده — دوسة واحدة وتروح للأرقام</span></div><div class="rec">${R.map((o,j)=>`<button type="button" class="rc" data-rec="${j}"><b>${esc(o.v)} · مقاس ${esc(o.s==='MIX'?sizeLabel(o):o.s)}</b><small>${esc([o.c,o.b,'درجة '+o.g,o.loc,o.n+' كرتونة/باليت'].join(' · '))}</small></button>`).join('')}</div></div><div class="gt" style="margin:12px 2px 0"><span>أو اختار / غيّر المواصفة:</span><button type="button" class="ch add" style="min-height:34px;padding:2px 10px;font-size:13px" data-pp="clear">مسح المواصفة</button></div>`:''}
 ${grp('الصنف','v',L.variety,W.v)}
 ${grp('نوع التعبئة','pk',packs,W.pk)}
 ${W.v?grp('نوع الكرتون','c',cts,W.c,'<button type="button" class="ch add" data-sadd="c">+ نوع</button>'):''}
 ${sizeHTML}
 ${grp('اسم الكرتون','b',BR(),W.b,'<button type="button" class="ch add" data-sadd="b">+ اسم</button>')}
 ${grp('الدرجة','g',L.grade,W.g)}
 ${grp('مكان التخزين','loc',L.loc,W.loc)}
 <div class="grp${!/^[1-9]\d*$/.test(String(W.n||'').trim())&&cur.tried?' need':''}" id="g_n"><div class="gt"><span>عدد الكراتين في الباليت</span>${nIsMix?'<b>من تفصيل MIX</b>':''}</div><div class="num"><button type="button" data-nd="-1">−</button><input id="ppnn" type="number" inputmode="numeric" value="${esc(W.n)}" ${nIsMix?'disabled':''} placeholder="العدد"><button type="button" data-nd="1">+</button></div>
 <div class="gt" style="margin-top:8px"><span>وزن الكرتونة (كجم)</span></div><div class="num"><input id="ppw" type="number" inputmode="decimal" step="0.1" value="${esc(W.w)}" style="font-size:18px;min-height:46px"></div></div>
 </div>
 <div class="ft"><button type="button" class="btn go" data-pp="tonums" ${specOk(W)?'':'style="background:#9db59f"'}>${specOk(W)?'التالي: اختار الأرقام ←':'كمّل: '+missing(W).join('، ')}</button></div>`}
function missing(W){const N={v:'الصنف',pk:'التعبئة',c:'الكرتون',s:'المقاس',b:'اسم الكرتون',g:'الدرجة',loc:'التخزين',n:'عدد الكراتين'};const m=Object.keys(N).filter(k=>!String(W[k]||'').trim()).map(k=>N[k]);if(String(W.n||'').trim()&&!/^[1-9]\d*$/.test(String(W.n).trim()))m.push('عدد الكراتين (رقم صحيح أكبر من صفر)');if(W.s==='MIX'&&(mixLines(W).length<2))m.push('مقاسين MIX على الأقل');return m}
function setField(f,v){const W=cur.spec;
 if((f==='v'||f==='pk'||f==='c')&&window.ALS){W[f]=v;if(f==='v'){const g=GOF(v);if(g==='mand'&&!W.pk)W.pk='صندوق بلاستيك';if(g==='lemon'&&!W.pk)W.pk='كرتون'}
  if(W.c&&!CTg(W).includes(W.c))W.c='';
  if(f==='c'){const w=wOf(v);const pk=rowPack(W);W.w=w||(pk&&pk.kg?String(pk.kg):W.w)}
  const sz=rowSizes(W);if(W.s&&W.s!=='MIX'&&sz&&sz.length&&!sz.includes(W.s)&&!(XL.size||[]).includes(W.s))W.s='';if(W.s==='MIX')W.mix=(W.mix||[]).filter(x=>!sz||sz.includes(x.s))}
 else W[f]=v;
 if(f==='s'&&v==='MIX'){W.mix=W.mix||[];W.n=String(mixSum(W)||'')}
 if(f==='s'&&v!=='MIX')W.mix=[]}
function nextNeed(){const W=cur.spec;const order=['v','pk','c','s','b','g','loc','n'];const k=order.find(k=>!String(W[k]||'').trim()||(k==='n'&&!/^[1-9]\d*$/.test(String(W.n).trim())));return k?document.getElementById('g_'+k):null}
function drawNums(el){const W=cur.spec;const u=used();const f0=firstFreeBlock(u);if(f0!==cur.first){if(cur.block===cur.first||cur.block<f0)cur.block=f0;cur.first=f0}
 cur.sel=cur.sel.filter(x=>!u.has(x));const a=cur.block*BLOCK+1,b=a+BLOCK-1;const free=[];for(let n=a;n<=b;n++){const p=fmt(n);if(!u.has(p))free.push(p)}
 const isAmir=(()=>{try{const x=window.AlolaAuth&&AlolaAuth.user&&AlolaAuth.user();return x&&x.username==='amir'}catch(e){return false}})();
 const k=cur.sel.length;
 el.innerHTML=`<div class="h"><button type="button" data-pp="x">✕ إلغاء</button><b>أرقام الباليتات</b></div>${steps('nums')}
 <div class="sum"><div class="t">${specText(W)}</div>${cur.i==null?'<button type="button" data-pp="tospec">تعديل</button>':''}</div>
 <div class="nav"><button type="button" data-pp="prev" ${cur.block<=cur.first?'disabled':''}>‹ السابق</button><div class="rg">${fmt(a)} – ${fmt(b)}<small>متاح ${free.length} من ${BLOCK}</small></div><button type="button" data-pp="next" ${cur.block>=cur.first+1&&free.length?'disabled':''}>التالي ›</button></div>
 <div class="tools"><button type="button" data-pp="range" class="${cur.range?'on':''}">↔ من رقم لرقم</button><button type="button" data-addn="1">+1</button><button type="button" data-addn="5">+5</button><button type="button" data-addn="10">+10</button></div>
 ${cur.range?`<div class="hint2">${cur.anchor?'دلوقتي دوس على <b>آخر</b> رقم — هيتعلّم كل اللي بينهم من '+cur.anchor:'دوس على <b>أول</b> رقم، وبعدين على آخر رقم'}</div>`:''}
 <div class="grid">${free.length?free.map(p=>`<button type="button" class="c${cur.sel.includes(p)?' on':''}${cur.anchor===p?' anc':''}" data-pc="${p}">${p}</button>`).join(''):'<div class="none">كل أرقام المجموعة دي اتاخدت — دوس «التالي»</div>'}</div>
 <div class="ft">${syncText()}<div class="cnt"><b>${k}</b><div class="rgs">${k?rangesOf(cur.sel):'<span style="direction:rtl;display:block;color:#666">دوس على أرقام استيكرات الباليتات</span>'}</div>${k?'<button type="button" data-pp="clr">مسح</button>':''}</div>
 <button type="button" class="btn go" data-pp="review" ${k?'':'disabled'}>${k?'مراجعة وتأكيد '+k+' باليت ←':'اختار رقم واحد على الأقل'}</button>
 ${isAmir?'<button type="button" class="mk" data-pp="mark">أرقام اتسجلت قبل كده بره البرنامج؟ علّمها مستخدمة</button>':''}</div>
 ${cur.confirm?`<div class="cf" data-pp="noconf"><div class="cfb" data-pp="none"><h3>هيتعمل ${k} باليت</h3><div class="big">${specText(W)}</div><div class="nums">${rangesOf(cur.sel)}</div><div class="row2"><button type="button" class="btn2" data-pp="noconf">رجوع</button><button type="button" class="btn" data-pp="go">✓ تأكيد</button></div></div></div>`:''}`}
function draw(){const el=document.getElementById('pp');if(!el||!cur)return;const y=(el.querySelector('.body')||el.querySelector('.grid')||{}).scrollTop||0;if(cur.step==='spec')drawSpec(el);else drawNums(el);const sc=el.querySelector('.body')||el.querySelector('.grid');if(sc&&cur.keep)sc.scrollTop=y;cur.keep=false}
function addNext(n){const u=used();let start=cur.sel.length?Math.max(...cur.sel.map(numOf))+1:cur.block*BLOCK+1;let c=0;for(let x=start;c<n&&x<start+BLOCK*4;x++){const p=fmt(x);if(!u.has(p)&&!cur.sel.includes(p)){cur.sel.push(p);c++}}const last=cur.sel.length?Math.max(...cur.sel.map(numOf)):0;if(last>cur.block*BLOCK+BLOCK)cur.block=Math.floor((last-1)/BLOCK)}
document.addEventListener('input',e=>{if(!cur||cur.step!=='spec')return;const t=e.target;const W=cur.spec;
 if(t.id==='ppnn'){W.n=t.value}else if(t.id==='ppw'){W.w=t.value}else if(t.id==='pps'){W.s=t.value}else if(t.dataset.mixn!==undefined){const m=W.mix[+t.dataset.mixn];if(m)m.n=t.value;W.n=String(mixSum(W)||'');const nn=document.getElementById('ppnn');if(nn)nn.value=W.n}else return;
 const go=document.querySelector('#pp [data-pp="tonums"]');if(go){const ok=specOk(W);go.style.background=ok?'':'#9db59f';go.textContent=ok?'التالي: اختار الأرقام ←':'كمّل: '+missing(W).join('، ')}});
document.addEventListener('click',e=>{const t=e.target.closest('[data-pp],[data-pc],[data-pick],[data-prm],[data-sf],[data-sadd],[data-rec],[data-mixs],[data-nd],[data-addn],#pAdd,#pLast');if(!t)return;
 if(t.id==='pAdd'){openNew();return}
 if(t.id==='pLast'){const R=recent();if(R[0]){if(window.askRawIfMissing&&!askRawIfMissing(R[0].v))return;startNums(JSON.parse(JSON.stringify(R[0])),null)}return}
 if(t.dataset.pick!==undefined){openRow(+t.dataset.pick);return}
 if(t.dataset.prm!==undefined){const i=+t.dataset.prm,r=S.rows[i];if(!r)return;if(filled(r)&&!confirm('حذف الباليت'+(r.p?' '+r.p:' رقم '+(i+1))+'؟'+(RE.test(r.p||'')?'\nالرقم هيرجع لقايمة الأرقام.':'')))return;S.rows.splice(i,1);if(!S.rows.length)S.rows.push(er());save();renderRows();upd();reconcile();return}
 if(!cur)return;
 if(t.dataset.rec!==undefined){const o=recent()[+t.dataset.rec];if(o){if(window.askRawIfMissing&&!askRawIfMissing(o.v))return;cur.spec=JSON.parse(JSON.stringify(o));startNums(cur.spec,null)}return}
 if(t.dataset.sf){setField(t.dataset.sf,t.dataset.sv);cur.keep=true;draw();const nx=nextNeed();if(nx&&t.dataset.sf!=='s')nx.scrollIntoView({block:'center',behavior:'smooth'});return}
 if(t.dataset.sadd){const f=t.dataset.sadd;let x='';if(f==='s')x=addCustomSize();else{x=(prompt(f==='b'?'اسم الكرتون الجديد:':'اسم نوع الكرتون الجديد (مثال: مقفول 10 ك):')||'').trim();if(x&&!isMaggiName(x)){const arr=f==='b'?XL.brand:XL.carton;if(!(f==='b'?BR():CT()).includes(x)){arr.push(x);saveXL()}}else x=''}if(x)setField(f,x);cur.keep=true;draw();return}
 if(t.dataset.mixs){const W=cur.spec;W.mix=W.mix||[];const j=W.mix.findIndex(m=>m.s===t.dataset.mixs);if(j<0)W.mix.push({s:t.dataset.mixs,n:''});else W.mix.splice(j,1);W.n=String(mixSum(W)||'');cur.keep=true;draw();return}
 if(t.dataset.nd){const W=cur.spec;if(W.s==='MIX')return;W.n=String(Math.max(1,(parseInt(W.n)||0)+(+t.dataset.nd)));const nn=document.getElementById('ppnn');if(nn)nn.value=W.n;nn&&nn.dispatchEvent(new Event('input',{bubbles:true}));return}
 if(t.dataset.addn){addNext(+t.dataset.addn);cur.keep=true;draw();return}
 if(t.dataset.pc){const p=t.dataset.pc;
  if(cur.range){if(!cur.anchor){cur.anchor=p;if(!cur.sel.includes(p))cur.sel.push(p)}else{const a=Math.min(numOf(cur.anchor),numOf(p)),b=Math.max(numOf(cur.anchor),numOf(p));const u=used();for(let n=a;n<=b;n++){const q=fmt(n);if(!u.has(q)&&!cur.sel.includes(q))cur.sel.push(q)}cur.anchor=null;cur.range=false}}
  else{const j=cur.sel.indexOf(p);if(j<0)cur.sel.push(p);else cur.sel.splice(j,1)}
  cur.keep=true;draw();return}
 const a=t.dataset.pp;
 if(a==='x'){close();return}
 if(a==='clear'){cur.spec={v:'',pk:'',c:'',s:'',mix:[],b:'',g:'',loc:'',n:'',w:''};draw();return}
 if(a==='tonums'){if(!specOk(cur.spec)){cur.tried=true;cur.keep=true;draw();const nx=nextNeed();if(nx)nx.scrollIntoView({block:'center'});return}if(window.askRawIfMissing&&!askRawIfMissing(cur.spec.v))return;const u=used();cur.first=cur.block=firstFreeBlock(u);cur.step='nums';draw();flush();return}
 if(a==='tospec'){cur.step='spec';cur.confirm=false;draw();return}
 if(a==='prev'){cur.block=Math.max(cur.first,cur.block-1);draw();return}
 if(a==='next'){cur.block++;draw();return}
 if(a==='clr'){cur.sel=[];cur.anchor=null;draw();return}
 if(a==='range'){cur.range=!cur.range;cur.anchor=null;cur.keep=true;draw();return}
 if(a==='review'){if(cur.sel.length){cur.confirm=true;cur.keep=true;draw()}return}
 if(a==='noconf'){cur.confirm=false;cur.keep=true;draw();return}
 if(a==='mark'){const x=(prompt('اكتب الأرقام اللي اتسجلت قبل كده (مثال: P0001-P0150 أو P0007,P0009):')||'').toUpperCase().replace(/\s/g,'');if(!x)return;const set=dec(x.split(/[,،]/));if(!set.size||set.size>2000)return alert('الصيغة مش مفهومة');call('/api/pallets/claim',{nums:[...set],manual:true}).then(d=>{take(d);persist();draw();ptoast('اتعلّم '+set.size+' رقم مستخدم')}).catch(()=>alert('محتاج إنترنت علشان تعلّم الأرقام'));return}
 if(a==='go'){create();return}});
function create(){const nums=cur.sel.slice().sort((x,y)=>numOf(x)-numOf(y));if(!nums.length)return;const before=JSON.stringify(S.rows);const made=[];let first,at;
 const mk=p=>{const o=Object.assign(er(),JSON.parse(JSON.stringify(cur.spec)));if(o.s!=='MIX')delete o.mix;o.p=p;return o};
 if(cur.i!=null){const r=S.rows[cur.i];first=at=cur.i;let rest=nums;if(!r.p){r.p=nums[0];made.push(r.p);rest=nums.slice(1)}const tpl=JSON.parse(JSON.stringify(r));rest.forEach(p=>{const c=JSON.parse(JSON.stringify(tpl));c.p=p;S.rows.splice(++at,0,c);made.push(p)})}
 else{let lastF=-1;S.rows.forEach((r,j)=>{if(filled(r))lastF=j});first=lastF+1;at=lastF;nums.forEach(p=>{S.rows.splice(++at,0,mk(p));made.push(p)})}
 let drop=made.length;for(let j=S.rows.length-1;j>at&&drop>0;j--){if(!filled(S.rows[j])){S.rows.splice(j,1);drop--}}
 if(!S.rows.some(x=>!filled(x)))S.rows.push(er());
 remember(cur.i!=null?S.rows[cur.i]:cur.spec);
 close();save();renderRows();upd();reconcile();
 const row=document.getElementById('r'+first);if(row){row.scrollIntoView({block:'start'});for(let j=first;j<=at;j++){const x=document.getElementById('r'+j);if(x)x.classList.add('flash')}}
 undoToast(made,before);paintBar()}
function undoToast(made,before){let el=document.getElementById('pundo');if(!el){el=document.createElement('div');el.id='pundo';el.style.cssText='position:fixed;left:10px;right:10px;bottom:calc(76px + env(safe-area-inset-bottom));background:#0f172a;color:#fff;padding:10px 12px;border-radius:12px;font-size:14px;z-index:250;display:flex;align-items:center;gap:10px';document.body.appendChild(el)}
 el.innerHTML=`<span style="flex:1">✓ اتعمل ${made.length} باليت: ${rangesOf(made)}</span><button type="button" style="min-height:40px;padding:4px 16px;background:#fff;color:#0f172a;font-weight:700">تراجع</button>`;el.style.display='flex';
 el.querySelector('button').onclick=()=>{S.rows=JSON.parse(before);el.style.display='none';save();renderRows();upd();reconcile();ptoast('اتلغى — الأرقام رجعت للقايمة')};
 clearTimeout(undoToast.t);undoToast.t=setTimeout(()=>{el.style.display='none'},15000)}
function paintBar(){const bar=document.getElementById('pBar');if(!bar)return;const R=recent();bar.className='pbar'+(R[0]?' two':'');bar.innerHTML=`<button class="btn" id="pAdd" type="button">+ باليتات جديدة</button>${R[0]?`<button class="pl" id="pLast" type="button">↺ نفس آخر مواصفة<br><small>${esc(R[0].v)} · ${esc(R[0].s==='MIX'?'MIX':R[0].s)}</small></button>`:''}`}
function paint(){if(cur){cur.keep=true;draw()}}
paintBar();

window.POOL={changed,reconcile,flush,rowHook,takenByOther,specOk,used,_P:P,dec,enc};
window.addEventListener('online',flush);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')flush()});
setInterval(()=>{if(cur||Date.now()-P.at>5*60e3)flush()},60e3);
setTimeout(()=>{reconcile();flush()},1200);
try{upd()}catch(e){}
})();
