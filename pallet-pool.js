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
function specOk(r){if(!r||!r.v)return false;if(['v','s','pk','c','b','g','loc','n'].some(k=>!String(r[k]||'').trim()))return false;if(r.s==='MIX'){const L=mixLines(r);if(L.length<2||new Set(L.map(x=>x.s)).size!==L.length||(parseInt(r.n)||0)!==mixSum(r))return false}return true}
function rowHook(i){const b=document.getElementById('pk'+i);if(!b)return;const r=S.rows[i];const ok=specOk(r);b.disabled=!ok;b.textContent=ok?(r.p?'🔢 باليتات تانية بنفس المواصفة':'🔢 اختار أرقام الباليتات'):'🔢 أرقام الباليتات — كمّل المواصفة الأول'}
/* ---------- the picker ---------- */
let cur=null;
const css=`#pp{position:fixed;inset:0;z-index:300;background:#f4f6f4;display:flex;flex-direction:column}
#pp .h{background:var(--g);color:#fff;padding:10px 14px;padding-top:max(10px,env(safe-area-inset-top));display:flex;align-items:center;gap:8px}
#pp .h b{flex:1;font-size:17px}#pp .h button{background:#ffffff26;color:#fff;min-height:38px;padding:4px 12px}
#pp .spec{background:#fff;margin:8px 10px 0;border-radius:12px;padding:8px 10px;font-size:13px;line-height:1.6;box-shadow:0 1px 3px #0002}
#pp .spec span{display:inline-block;background:#e8efe8;color:var(--g);border-radius:8px;padding:1px 8px;margin:2px 0 2px 4px;font-weight:600}
#pp .nav{display:flex;align-items:center;gap:6px;margin:8px 10px 0}
#pp .nav .rg{flex:1;text-align:center;font-weight:700;direction:ltr;font-size:15px}#pp .nav .rg small{display:block;font-weight:400;color:#666;font-size:12px;direction:rtl}
#pp .nav button{min-height:40px;padding:4px 12px;background:#e8efe8;color:var(--g)}#pp .nav button:disabled{opacity:.35}
#pp .quick{display:flex;gap:6px;margin:8px 10px 0;align-items:center;font-size:14px}#pp .quick input{width:72px;min-height:40px;text-align:center}#pp .quick button{min-height:40px;padding:4px 10px;background:#fff;border:1.5px solid var(--g2);color:var(--g);font-size:14px}
#pp .grid{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:8px 10px 10px;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;align-content:start}
#pp .c{min-height:44px;border-radius:10px;background:#fff;border:1.5px solid #d6dcd6;color:#222;font-weight:600;font-size:14px;direction:ltr;padding:0}
#pp .c.on{background:var(--g);border-color:var(--g);color:#fff}
#pp .none{grid-column:1/-1;text-align:center;color:#666;padding:20px;font-size:14px}
#pp .ft{background:#fff;box-shadow:0 -2px 8px #0002;padding:8px 10px;padding-bottom:max(8px,env(safe-area-inset-bottom))}
#pp .sel{font-size:12.5px;color:#444;margin-bottom:6px;max-height:38px;overflow:hidden;direction:ltr;text-align:right}
#pp .sync{font-size:11.5px;color:#666;margin-bottom:6px}#pp .sync.off{color:#b45309}
#pp .ft .go{width:100%}#pp .ft .go:disabled{background:#9db59f}
#pp .mk{background:none;color:#666;font-size:12px;min-height:30px;padding:2px;text-decoration:underline}
.pkb{width:100%;margin-top:8px;background:#e8efe8;color:var(--g);font-weight:700}.pkb:disabled{background:#f1f1f1;color:#9a9a9a;font-weight:400;font-size:14px}
.prm{background:#fdecea;color:var(--bad);min-height:34px;padding:4px 10px;font-size:13px}
.ptop{width:100%;margin-bottom:10px}
@keyframes ppf{0%{box-shadow:0 0 0 3px #4a7c50}100%{box-shadow:none}}.row.flash{animation:ppf 1.6s ease-out}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function firstFreeBlock(u){let b=0;for(;b<500;b++){let free=false;for(let n=b*BLOCK+1;n<=(b+1)*BLOCK;n++)if(!u.has(fmt(n))){free=true;break}if(free)break}return b}
function specText(r){const sz=r.s==='MIX'?sizeLabel(r):r.s;return [r.v,'مقاس '+sz,r.pk,r.c,r.b,'درجة '+r.g,r.loc,r.n+' كرتونة/باليت',r.w?r.w+' كجم/كرتونة':''].filter(Boolean).map(x=>'<span>'+esc(x)+'</span>').join('')}
function open(i){const r=S.rows[i];if(!specOk(r)){ptoast('كمّل مواصفة الباليت الأول (الصنف، المقاس، الكرتون، الدرجة، التخزين، عدد الكراتين)');return}
 const u=used();cur={i,sel:[],block:firstFreeBlock(u),first:firstFreeBlock(u)};
 let el=document.getElementById('pp');if(el)el.remove();el=document.createElement('div');el.id='pp';document.body.appendChild(el);
 const tt=document.getElementById('ptoast');if(tt)tt.style.display='none';draw();flush()}
function close(){const el=document.getElementById('pp');if(el)el.remove();cur=null}
function syncText(){if(P.on===true)return '<div class="sync">✓ الأرقام متزامنة مع كل الموبايلات'+(P.at?' — آخر تحديث '+new Date(P.at).toTimeString().slice(0,5):'')+'</div>';if(P.on===false)return '<div class="sync off">⚠ مفيش اتصال بالسيرفر دلوقتي — الأرقام محفوظة على الموبايل ده وهتتزامن أول ما النت يرجع</div>';return '<div class="sync">… بيتأكد من الأرقام المستخدمة</div>'}
function draw(){const el=document.getElementById('pp');if(!el||!cur)return;const r=S.rows[cur.i];const u=used();const f0=firstFreeBlock(u);if(f0!==cur.first){if(cur.block===cur.first||cur.block<f0)cur.block=f0;cur.first=f0}const a=cur.block*BLOCK+1,b=a+BLOCK-1;
 cur.sel=cur.sel.filter(x=>!u.has(x));
 const free=[];for(let n=a;n<=b;n++){const p=fmt(n);if(!u.has(p))free.push(p)}
 const isAmir=(()=>{try{const x=window.AlolaAuth&&AlolaAuth.user&&AlolaAuth.user();return x&&x.username==='amir'}catch(e){return false}})();
 const k=cur.sel.length;
 el.innerHTML=`<div class="h"><button type="button" data-pp="x">✕ إلغاء</button><b>أرقام الباليتات</b></div>
 <div class="spec">${specText(r)}</div>
 <div class="nav"><button type="button" data-pp="prev" ${cur.block<=cur.first?'disabled':''}>‹ السابق</button><div class="rg">${fmt(a)} – ${fmt(b)}<small>متاح ${free.length} من ${BLOCK}</small></div><button type="button" data-pp="next" ${cur.block>=cur.first+1&&free.length?'disabled':''}>التالي ›</button></div>
 <div class="quick">اختار أول <input id="ppn" type="number" inputmode="numeric" min="1" max="${BLOCK}" value="${k||''}" placeholder="عدد"> رقم متاح <button type="button" data-pp="q">اختار</button>${k?'<button type="button" data-pp="clr">مسح</button>':''}</div>
 <div class="grid">${free.length?free.map(p=>`<button type="button" class="c${cur.sel.includes(p)?' on':''}" data-pc="${p}">${p}</button>`).join(''):'<div class="none">كل أرقام المجموعة دي اتاخدت — دوس «التالي»</div>'}</div>
 <div class="ft">${syncText()}<div class="sel">${k?cur.sel.slice().sort((x,y)=>numOf(x)-numOf(y)).join('، '):'<span style="direction:rtl;display:block">دوس على الأرقام اللي على استيكرات الباليتات</span>'}</div>
 <button type="button" class="btn go" data-pp="go" ${k?'':'disabled'}>${k?'إنشاء '+k+' باليت بنفس المواصفة':'اختار رقم واحد على الأقل'}</button>
 ${isAmir?'<button type="button" class="mk" data-pp="mark">أرقام اتسجلت قبل كده بره البرنامج؟ علّمها مستخدمة</button>':''}</div>`}
document.addEventListener('click',e=>{const t=e.target.closest('[data-pp],[data-pc],[data-pick],[data-prm],#pAdd');if(!t)return;
 if(t.id==='pAdd'){let i=S.rows.findIndex(r=>!filled(r));if(i<0){S.rows.push(er());i=S.rows.length-1}renderRows();upd();const row=document.getElementById('r'+i);if(row){row.scrollIntoView({block:'start'});row.classList.add('flash')}ptoast('اختار الصنف والمقاس وكل البيانات، وبعدين دوس «🔢 اختار أرقام الباليتات» تحت');return}
 if(t.dataset.pick!==undefined){open(+t.dataset.pick);return}
 if(t.dataset.prm!==undefined){const i=+t.dataset.prm,r=S.rows[i];if(!r)return;if(filled(r)&&!confirm('حذف الباليت'+(r.p?' '+r.p:' رقم '+(i+1))+'؟'+(RE.test(r.p||'')?'\nالرقم هيرجع لقايمة الأرقام.':'')))return;S.rows.splice(i,1);if(!S.rows.length)S.rows.push(er());save();renderRows();upd();reconcile();return}
 if(!cur)return;
 if(t.dataset.pc){const p=t.dataset.pc;const j=cur.sel.indexOf(p);if(j<0)cur.sel.push(p);else cur.sel.splice(j,1);draw();return}
 const a=t.dataset.pp;
 if(a==='x'){close();return}
 if(a==='prev'){cur.block=Math.max(cur.first,cur.block-1);draw();return}
 if(a==='next'){cur.block++;draw();return}
 if(a==='clr'){cur.sel=[];draw();return}
 if(a==='q'){const want=Math.max(0,Math.min(BLOCK*3,parseInt(document.getElementById('ppn').value)||0));const u=used();cur.sel=[];for(let n=cur.block*BLOCK+1;cur.sel.length<want&&n<cur.block*BLOCK+BLOCK*4;n++){const p=fmt(n);if(!u.has(p))cur.sel.push(p)}draw();return}
 if(a==='mark'){const x=(prompt('اكتب الأرقام اللي اتسجلت قبل كده (مثال: P0001-P0150 أو P0007,P0009):')||'').toUpperCase().replace(/\s/g,'');if(!x)return;const set=dec(x.split(/[,،]/));if(!set.size||set.size>2000)return alert('الصيغة مش مفهومة');call('/api/pallets/claim',{nums:[...set],manual:true}).then(d=>{take(d);persist();draw();ptoast('اتعلّم '+set.size+' رقم مستخدم')}).catch(()=>alert('محتاج إنترنت علشان تعلّم الأرقام'));return}
 if(a==='go'){create();return}});
function create(){const i=cur.i,r=S.rows[i];const nums=cur.sel.slice().sort((x,y)=>numOf(x)-numOf(y));if(!nums.length)return;const before=JSON.stringify(S.rows);
 const made=[];let at=i;
 if(!r.p){r.p=nums.shift();made.push(r.p)}
 const tpl=JSON.parse(JSON.stringify(r));
 nums.forEach(p=>{const c=JSON.parse(JSON.stringify(tpl));c.p=p;S.rows.splice(++at,0,c);made.push(p)});
 let drop=nums.length;for(let j=S.rows.length-1;j>at&&drop>0;j--){if(!filled(S.rows[j])){S.rows.splice(j,1);drop--}}
 if(!S.rows.some(x=>!filled(x)))S.rows.push(er());
 close();save();renderRows();upd();reconcile();
 const row=document.getElementById('r'+i);if(row){row.scrollIntoView({block:'start'});for(let j=i;j<=at;j++){const x=document.getElementById('r'+j);if(x)x.classList.add('flash')}}
 undoToast(made,before)}
function undoToast(made,before){let el=document.getElementById('pundo');if(!el){el=document.createElement('div');el.id='pundo';el.style.cssText='position:fixed;left:10px;right:10px;bottom:calc(76px + env(safe-area-inset-bottom));background:#0f172a;color:#fff;padding:10px 12px;border-radius:12px;font-size:14px;z-index:250;display:flex;align-items:center;gap:10px';document.body.appendChild(el)}
 el.innerHTML=`<span style="flex:1">اتعمل ${made.length} باليت: ${made.length>3?made[0]+' … '+made[made.length-1]:made.join('، ')}</span><button type="button" style="min-height:36px;padding:4px 14px;background:#fff;color:#0f172a;font-weight:700">تراجع</button>`;el.style.display='flex';
 el.querySelector('button').onclick=()=>{S.rows=JSON.parse(before);el.style.display='none';save();renderRows();upd();reconcile();ptoast('اتلغى — الأرقام رجعت للقايمة')};
 clearTimeout(undoToast.t);undoToast.t=setTimeout(()=>{el.style.display='none'},12000)}
function paint(){if(cur)draw()}
window.POOL={changed,reconcile,flush,rowHook,takenByOther,specOk,used,_P:P,dec,enc};
window.addEventListener('online',flush);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')flush()});
setInterval(()=>{if(cur||Date.now()-P.at>5*60e3)flush()},60e3);
setTimeout(()=>{reconcile();flush()},1200);
try{upd()}catch(e){}
})();
