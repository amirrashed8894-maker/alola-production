/* أرقام باليتات صن فروت SF-00001… — عداد لوحده (مستقل عن أرقام العلا P0001…).
   الأرقام بتتاخد بالترتيب من الاستيكرات المطبوعة (SF-00001 … SF-00800 مطبوعة)، كل رقم مرة واحدة بس على كل الموبايلات (سيرفر الدخول).
   الرقم اللي يتلغي (حذف باليت / تراجع) بيفضل مستخدم ومش بيتكرر أبدًا. من غير نت: الموبايل بياخد الرقم اللي بعد آخر رقم يعرفه ويتأكد أول ما النت يرجع. */
(function(){
const SFX='صن فروت',RE=/^SF-\d{5}$/,PK='alola_sf_pool';
const fmt=n=>'SF-'+String(n).padStart(5,'0'),num=x=>RE.test(x)?parseInt(x.slice(3),10):0;
const isSF=e=>{const s=String(e||'').trim();return s===SFX||/^صن\s*فروت$|^sun\s*fruit$/i.test(s)};
function dec(list){const o=new Set();(list||[]).forEach(x=>{const m=String(x).match(/^(SF-\d{5})(?:-(SF-\d{5}))?$/);if(!m)return;if(!m[2]){o.add(m[1]);return}const a=num(m[1]),b=num(m[2]);if(b-a>20000)return;for(let i=a;i<=b;i++)o.add(fmt(i))});return o}
function enc(set){const a=[...set].map(num).filter(n=>n>0).sort((x,y)=>x-y);const out=[];let s=null,p=null;for(const n of a){if(s!==null&&n===p+1){p=n;continue}if(s!==null)out.push(s===p?fmt(s):fmt(s)+'-'+fmt(p));s=p=n}if(s!==null)out.push(s===p?fmt(s):fmt(s)+'-'+fmt(p));return out}
const ranges=list=>enc(new Set(list)).map(x=>x.replace('-SF-',' → SF-')).join('، ');
const rangesH=list=>enc(new Set(list)).map(x=>'<bdi dir="ltr" style="white-space:nowrap">'+x.replace('-SF-',' → SF-')+'</bdi>').join('، ');
/* Q.used = كل الأرقام المستخدمة على السيرفر (ومنها الملغية)، mine = بتاعة الموبايل ده، voided = ملغية، pend = اتاخدت من غير نت ولسه ما اتأكدتش، pv = إلغاء لسه ما اتبعتش، conf = طلعت بتاعة موبايل تاني */
let Q={used:new Set(),mine:new Set(),voided:new Set(),pend:new Set(),pv:new Set(),conf:new Set(),hwm:0,printedTo:800,gen:'',at:0,on:null,old:false};
try{const x=JSON.parse(localStorage.getItem(PK)||'null');if(x){['used','mine','voided','pend','pv'].forEach(k=>Q[k]=dec(x[k]));Q.conf=new Set(x.conf||[]);Q.hwm=x.hwm||0;Q.printedTo=x.printedTo||800;Q.gen=x.gen||'';Q.at=x.at||0}}catch(e){}
function persist(){try{localStorage.setItem(PK,JSON.stringify({used:enc(Q.used),mine:enc(Q.mine),voided:enc(Q.voided),pend:enc(Q.pend),pv:enc(Q.pv),conf:[...Q.conf],hwm:Q.hwm,printedTo:Q.printedTo,gen:Q.gen,at:Q.at}))}catch(e){}}
const present=()=>{const s=new Set();((typeof S!=='undefined'&&S&&S.rows)||[]).forEach(r=>{if(r&&RE.test(r.p||''))s.add(r.p)});return s};
function maxKnown(){let m=Q.hwm;[Q.used,Q.mine,Q.voided,Q.pend,present()].forEach(s=>s.forEach(x=>{const n=num(x);if(n>m)m=n}));return m}
const nextNum=()=>fmt(maxKnown()+1);
const takenByOther=p=>RE.test(p||'')&&(Q.conf.has(p)||(Q.used.has(p)&&!Q.mine.has(p)));
const isVoided=p=>RE.test(p||'')&&Q.voided.has(p);
/* ---------- server ---------- */
const tok=()=>{try{return localStorage.getItem('alola_auth_token')||''}catch(e){return ''}};
const api=()=>(window.AlolaAuth&&AlolaAuth.apiBase)||window.ALOLA_AUTH_API||'https://alola-maggi-auth.onrender.com';
async function call(path,body){const t=tok();if(!t)throw new Error('no-login');const r=await fetch(api()+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:body?JSON.stringify(body):undefined});if(r.status===404){Q.old=true;throw new Error('old-server')}const d=await r.json().catch(()=>null);if(!r.ok||!d||!d.ok)throw new Error('http-'+r.status);Q.old=false;return d}
function take(d){Q.used=dec(d.used);const m=dec(d.mine);Q.pend.forEach(x=>m.add(x));Q.mine.forEach(x=>{if(Q.pend.has(x)||present().has(x))m.add(x)});Q.conf.forEach(x=>m.delete(x));Q.mine=m;Q.voided=new Set([...dec(d.voided),...Q.pv]);Q.hwm=Math.max(d.hwm||0,Q.hwm);if(d.printedTo!=null)Q.printedTo=d.printedTo;Q.gen=d.gen||Q.gen;Q.at=Date.now();Q.on=true}
let busy=false,again=false;
async function flush(){if(busy){again=true;return}busy=true;try{
  let d=await call('/api/sfpallets');
  /* Key Value اتمسح على السيرفر (gen اتغير): الموبايل يرجّع أرقامه */
  if(Q.gen&&d.gen!==Q.gen&&(Q.mine.size||Q.voided.size)){Q.mine.forEach(x=>Q.pend.add(x));Q.voided.forEach(x=>Q.pv.add(x))}
  if(Q.pend.size){const nums=[...Q.pend];const x=await call('/api/sfpallets/claim',{nums});const tk=new Set(x.taken||[]);nums.forEach(n=>{Q.pend.delete(n);if(tk.has(n)){Q.conf.add(n);Q.mine.delete(n)}});d=x}
  if(Q.pv.size){const nums=[...Q.pv];const x=await call('/api/sfpallets/void',{nums});nums.forEach(n=>Q.pv.delete(n));d=x}
  take(d);persist();
}catch(e){Q.on=false}finally{busy=false;persist();try{if(window.POOL&&POOL._paint)POOL._paint()}catch(e){}try{if(typeof upd==='function')upd()}catch(e){}if(again){again=false;setTimeout(flush,50)}}}
/* ياخد N رقم بالترتيب — من السيرفر لو فيه نت، وإلا من الموبايل (ويتأكد بعدين) */
async function takeNums(k){k=Math.max(1,Math.min(200,parseInt(k,10)||1));
 try{const d=await call('/api/sfpallets/take',{count:k});take(d);(d.nums||[]).forEach(n=>Q.mine.add(n));persist();return {nums:d.nums||[],offline:false}}
 catch(e){Q.on=false;const out=[];let n=maxKnown();while(out.length<k){n++;const p=fmt(n);if(Q.used.has(p)||Q.voided.has(p))continue;out.push(p);Q.mine.add(p);Q.pend.add(p)}Q.hwm=Math.max(Q.hwm,n);persist();return {nums:out,offline:true}}}
/* حذف باليت صن فروت / تراجع = الرقم يتلغي نهائي (مش بيرجع للعداد) */
function voidNums(list){const all=(list||[]).filter(x=>RE.test(x||''));/* رقم طلع بتاع موبايل تاني (تعارض) مش بيتلغي — ده رقم الموبايل التاني */all.filter(x=>Q.conf.has(x)).forEach(x=>{Q.conf.delete(x);Q.mine.delete(x)});const L=all.filter(x=>!Q.used.has(x)||Q.mine.has(x));if(typeof S!=='undefined'&&S)S.sfNums=(S.sfNums||[]).filter(n=>!all.includes(n));if(!L.length){persist();return}L.forEach(n=>{Q.voided.add(n);Q.pv.add(n)});persist();try{save()}catch(e){}flush()}
/* أرقام SF اتكتبت في التقرير (يدوي أو من يوم محفوظ) ومش من العداد على الموبايل ده → تتسجل */
let rt=null;
function reconcile(){if(typeof S==='undefined'||!S)return;if(!Array.isArray(S.sfNums))S.sfNums=[];let ch=false;present().forEach(n=>{if(S.sfNums.includes(n)||takenByOther(n))return;S.sfNums.push(n);if(!Q.mine.has(n)){Q.mine.add(n);Q.pend.add(n)}ch=true});if(ch){persist();try{save()}catch(e){}flush()}}
function changed(){clearTimeout(rt);rt=setTimeout(reconcile,700)}
/* ---------- شاشة «أرقام صن فروت» جوه «باليتات جديدة» ---------- */
const css=`#pp .sfc{background:#fff;border-radius:14px;margin:10px 12px 0;padding:12px;box-shadow:0 1px 3px #0002;text-align:center}
#pp .sfc .lb{font-size:13px;color:#555}#pp .sfc .nx{font-size:34px;font-weight:800;direction:ltr;color:#7a3e00;letter-spacing:.5px;margin:2px 0}
#pp .sfc .rg{direction:ltr;font-weight:700;font-size:17px;color:#111;margin-top:8px}#pp .sfc .rg small{display:block;direction:rtl;font-weight:400;font-size:12.5px;color:#666}
#pp .sfw{margin:8px 12px 0;font-size:13px;border-radius:10px;padding:7px 10px;background:#fdecea;color:#9b1c1c}#pp .sfo{margin:8px 12px 0;font-size:13px;border-radius:10px;padding:7px 10px;background:#fff6dc;color:#7a5a00}
#pp .sfnum{display:flex;align-items:center;gap:8px;margin-top:4px}#pp .sfnum input{flex:1;min-width:0;text-align:center;font-size:24px;font-weight:800;min-height:54px}#pp .sfnum button{width:56px;min-height:54px;font-size:24px;background:#e8efe8;color:var(--g);padding:0}
#pp .sfk{display:flex;gap:6px;justify-content:center;margin-top:8px}#pp .sfk button{min-height:44px;padding:4px 14px;background:#e8efe8;color:var(--g);font-weight:700}
.expl{display:flex;align-items:center;gap:8px;margin:6px 0 2px}.expl .sfpr{margin-inline-start:auto}
#exp.lk{background:#f3efe8 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Ctext y='12' font-size='12'%3E%F0%9F%94%92%3C/text%3E%3C/svg%3E") no-repeat 28px center;border-color:#d8c3a5}
.expfix{display:flex;flex-direction:column;gap:2px;background:#fff8ef;border:1px solid #f0c48a;border-radius:12px;padding:8px 12px;margin:10px 0 4px;color:#5a3300}.expfix b{color:#7a3e00}.expfix small{color:#7a5a3a;font-size:12.5px}
.expb{display:inline-block;background:#fff1e0;color:#7a3e00;border:1px solid #f0c48a;border-radius:8px;padding:1px 8px;font-size:12.5px;font-weight:700;white-space:nowrap}
.sfpr{background:#fff;border:1.5px solid #7a3e00;color:#7a3e00;min-height:34px;padding:2px 10px;font-size:13px;font-weight:700}
#sfprint{position:fixed;inset:0;z-index:320;background:#0007;display:flex;align-items:flex-end}#sfprint .b{background:#fff;width:100%;border-radius:18px 18px 0 0;padding:14px;padding-bottom:max(14px,env(safe-area-inset-bottom))}
#sfprint h3{margin:0 0 6px;color:#7a3e00}#sfprint .cp{display:flex;gap:6px;margin:8px 0}#sfprint .cp button{flex:1;min-height:46px;background:#f1f4f1;border:1.5px solid #d6dcd6;font-weight:700}#sfprint .cp button.on{background:#7a3e00;color:#fff;border-color:#7a3e00}
#sfprint img{width:100%;border:1px solid #ccc;border-radius:6px;margin:6px 0}#sfprint .r2{display:grid;grid-template-columns:1fr 2fr;gap:8px}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const esc2=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function syncText(){if(Q.old)return '<div class="sync off">⚠ سيرفر الأرقام لسه مش متحدّث لعداد صن فروت — الأرقام بتتاخد من الموبايل ده بس. استخدم موبايل واحد لصن فروت لحد التحديث.</div>';if(Q.on===true)return '<div class="sync">✓ عداد صن فروت متزامن مع كل الموبايلات'+(Q.at?' — آخر تحديث '+new Date(Q.at).toTimeString().slice(0,5):'')+'</div>';if(Q.on===false)return '<div class="sync off">⚠ مفيش اتصال بالسيرفر — الأرقام هتتاخد من الموبايل ده وتتأكد أول ما النت يرجع</div>';return '<div class="sync">… بيتأكد من آخر رقم صن فروت</div>'}
function draw(el,cur,specHTML,stepsHTML){const k=Math.max(1,Math.min(200,parseInt(cur.sfn,10)||1));cur.sfn=k;const a=maxKnown()+1,b=a+k-1;const over=b>Q.printedTo;
 el.innerHTML=`<div class="h"><button type="button" data-pp="x">✕ إلغاء</button><b>أرقام صن فروت</b></div>${stepsHTML}
 <div class="sum"><div class="t">${specHTML}</div>${cur.i==null?'<button type="button" data-pp="tospec">تعديل</button>':''}</div>
 <div class="body"><div class="sfc"><div class="lb">الاستيكر اللي عليه الدور في رول صن فروت</div><div class="nx" id="sfnext">${fmt(a)}</div>
 <div class="lb" style="margin-top:8px">عدد الباليتات</div><div class="sfnum"><button type="button" data-sfa="dec">−</button><input id="sfn" type="number" inputmode="numeric" min="1" max="200" value="${k}"><button type="button" data-sfa="inc">+</button></div>
 <div class="sfk"><button type="button" data-sfa="set" data-v="1">1</button><button type="button" data-sfa="set" data-v="5">5</button><button type="button" data-sfa="set" data-v="10">10</button><button type="button" data-sfa="set" data-v="20">20</button></div>
 <div class="rg" id="sfrg">${k>1?fmt(a)+' → '+fmt(b):fmt(a)}<small>الأرقام بتتاخد بالترتيب — مفيش اختيار يدوي، ومفيش رقم بيتكرر</small></div></div>
 ${over?`<div class="sfw">⚠ الأرقام دي بعد ${fmt(Q.printedTo)} — الاستيكرات المطبوعة (SF-00001 … ${fmt(Q.printedTo)}) خلصت. اطبع دفعة جديدة تبدأ من ${fmt(Math.max(a,Q.printedTo+1))}.</div>`:''}
 ${Q.on===false||Q.old?'<div class="sfo">من غير نت: الأرقام هتتحجز على الموبايل ده وتتأكد مع باقي الموبايلات أول ما النت يرجع. لو موبايل تاني أخد نفس الرقم هيظهر تحذير أحمر على الباليت.</div>':''}</div>
 <div class="ft">${syncText()}<button type="button" class="btn go" data-sfa="review">مراجعة وتأكيد ${k} باليت صن فروت ←</button></div>
 ${cur.confirm?`<div class="cf" data-sfa="noconf"><div class="cfb" data-sfa="none"><h3>هيتعمل ${k} باليت صن فروت</h3><div class="big">${specHTML}</div><div class="nums">${k>1?fmt(a)+' → '+fmt(b):fmt(a)}</div><div style="font-size:12.5px;color:#666;margin:-6px 0 10px">لو موبايل تاني أخد أرقام في نفس اللحظة، الأرقام اللي بعدها هي اللي هتتاخد وهتظهر بعد التأكيد.</div><div class="row2"><button type="button" class="btn2" data-sfa="noconf">رجوع</button><button type="button" class="btn" data-sfa="go">✓ تأكيد</button></div></div></div>`:''}`}
document.addEventListener('input',e=>{if(e.target.id!=='sfn')return;const cur=window.POOL&&POOL._cur&&POOL._cur();if(!cur)return;const v=parseInt(String(e.target.value).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)),10);if(v>0){cur.sfn=Math.min(200,v);const a=maxKnown()+1,b=a+cur.sfn-1;const rg=document.getElementById('sfrg');if(rg)rg.firstChild.textContent=cur.sfn>1?fmt(a)+' → '+fmt(b):fmt(a);const go=document.querySelector('#pp [data-sfa="review"]');if(go)go.textContent='مراجعة وتأكيد '+cur.sfn+' باليت صن فروت ←'}});
let going=false;
document.addEventListener('click',async e=>{const t=e.target.closest('[data-sfa],[data-sfprint]');if(!t)return;
 if(t.dataset.sfprint!==undefined){const r=S.rows[+t.dataset.sfprint];if(r&&RE.test(r.p||''))openPrint([r]);return}
 const cur=window.POOL&&POOL._cur&&POOL._cur();const a=t.dataset.sfa;if(!cur||cur.step!=='sf')return;
 if(a==='none'){return}
 if(a==='inc'||a==='dec'){cur.sfn=Math.max(1,Math.min(200,(parseInt(cur.sfn,10)||1)+(a==='inc'?1:-1)));cur.keep=true;POOL._draw();return}
 if(a==='set'){cur.sfn=+t.dataset.v;cur.keep=true;POOL._draw();return}
 if(a==='review'){cur.confirm=true;cur.keep=true;POOL._draw();return}
 if(a==='noconf'){if(e.target!==t)return;cur.confirm=false;cur.keep=true;POOL._draw();return}
 if(a==='go'){if(going)return;going=true;t.disabled=true;t.textContent='… بياخد الأرقام';try{const r=await takeNums(cur.sfn);cur.sel=r.nums;cur.sfOffline=r.offline;POOL._create()}finally{going=false}return}});
/* ---------- طباعة الاستيكر من البرنامج (نفس شكل ملف الـ PDF 100×50 مم) ---------- */
let pr=null;
function openPrint(rows){pr={rows:rows.filter(r=>RE.test(r.p||'')),copies:pr?pr.copies:4,fill:pr?pr.fill:true};if(!pr.rows.length)return;drawPrint()}
async function drawPrint(){let el=document.getElementById('sfprint');if(!el){el=document.createElement('div');el.id='sfprint';document.body.appendChild(el)}
 const nums=pr.rows.map(r=>r.p);let img='';try{img=(await SFSTK.canvas(SFSTK.fields(pr.rows[0],pr.fill))).toDataURL('image/png')}catch(e){}
 el.innerHTML=`<div class="b"><h3>🖨 استيكرات صن فروت — ${pr.rows.length} باليت</h3><div style="direction:ltr;text-align:right;font-weight:700">${rangesH(nums)}</div>
 ${img?`<img src="${img}" alt="الاستيكر">`:''}<div style="font-size:13px;color:#555">مقاس 100×50 مم، استيكر في كل صفحة — لطابعة الاستيكرات (TSC). عدد النسخ من كل رقم:</div>
 <div class="cp">${[1,2,3,4].map(c=>`<button type="button" class="${pr.copies===c?'on':''}" data-sfp="c${c}">${c}</button>`).join('')}</div>
 <label style="display:flex;gap:8px;align-items:center;font-size:14px;margin:4px 0 10px"><input type="checkbox" data-sfp="fill" ${pr.fill?'checked':''} style="width:auto;min-height:0"> اكتب بيانات الباليت على الاستيكر (الصنف، المقاس، الكراتين، التاريخ، الدرجة) — الوزن بيفضل فاضي يتكتب باليد</label>
 <div class="r2"><button type="button" class="btn2" data-sfp="x">إغلاق</button><button type="button" class="btn" data-sfp="go">PDF للطابعة (${pr.rows.length*pr.copies} استيكر)</button></div></div>`}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-sfp]');if(!t||!pr)return;const a=t.dataset.sfp;
 if(a==='x'){const el=document.getElementById('sfprint');if(el)el.remove();pr=null;return}
 if(a[0]==='c'){pr.copies=+a.slice(1);drawPrint();return}
 if(a==='go'){t.disabled=true;t.textContent='… بيجهز الـ PDF';try{const blob=await SFSTK.pdf(pr.rows.map(r=>SFSTK.fields(r,pr.fill)),pr.copies);const nums=pr.rows.map(r=>r.p).sort();const name='SunFruit_'+nums[0]+(nums.length>1?'-'+nums[nums.length-1].slice(3):'')+'.pdf';const f=new File([blob],name,{type:'application/pdf'});window.__sfLast={name,size:blob.size,pages:pr.rows.length*pr.copies};
   let shared=false;try{if(navigator.canShare&&navigator.canShare({files:[f]})&&!window.__noShare){await navigator.share({files:[f]});shared=true}}catch(x){if(x&&x.name==='AbortError')shared=true}
   if(!shared)download(blob,name)}catch(x){alert('مقدرتش أعمل ملف الاستيكرات: '+(x&&x.message||x))}finally{t.disabled=false;drawPrint()}}});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset&&t.dataset.sfp==='fill'&&pr){pr.fill=t.checked;drawPrint()}});
window.SFP={isSF,RE,SFX,fmt,num,draw,takeNums,voidNums,flush,reconcile,changed,takenByOther,isVoided,nextNum,openPrint,ranges,rangesH,_Q:Q,printedTo:()=>Q.printedTo};
window.addEventListener('online',flush);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')flush()});
setInterval(()=>{if(Date.now()-Q.at>5*60e3)flush()},60e3);
setTimeout(()=>{reconcile();flush()},1300);
})();
