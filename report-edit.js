/* report-edit.js v1 — تعديل تقرير إنتاج اتصدر قبل كده (بنفس تاريخه ووردِيته) + تحويل النواقص لباليتات MIX كاملة.
   - التقرير المعدّل بيطلع بنفس الرقم المرجعي + ‎-R1 / -R2 … ومكتوب عليه «معدّل بتاريخ …» في الـ PDF والإكسل.
   - مصادر الفتح: الأيام المحفوظة على الموبايل (كل البيانات) أو ملف PDF اتصدر من البرنامج (البيانات المدمجة جواه). */
(function(){'use strict';
const pad=x=>String(x).padStart(2,'0');
const stamp=t=>{const d=new Date(t);return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()+' '+pad(d.getHours())+':'+pad(d.getMinutes())};
const slash=s=>{const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?m[3]+'/'+m[2]+'/'+m[1]:String(s||'—')};
const baseCode=c=>String(c||'').replace(/-R\d+$/,'');
const isIssued=x=>!!(x&&x.h&&(x.h.issuedAt||x.h.code));
const revNote=()=>S.h.rev?'معدّل بتاريخ '+stamp(S.h.revAt)+' — مراجعة '+S.h.rev+' للتقرير '+(S.h.revOf||baseCode(S.h.code)):'';
const redraw=()=>{try{loadRawRows()}catch(e){}initHeader();renderRows();renderLeft();upd()};
const toast=m=>{try{ptoast(m)}catch(e){}};
/* ---------- 1) مين اتصدر: أي PDF/إكسل اتعمل بيتسجل ---------- */
const sig=()=>{try{return JSON.stringify([S.rows.filter(filled),(S.left||[]).filter(lfilled),S.h.raw||{},S.h.date,S.h.shift,S.h.eng,S.h.sup||'',S.h.exp])}catch(e){return ''}};
/* اتصدر، واتغيّر بعدها، وهيتصدر تاني ← يبقى «معدّل» أوتوماتيك (مهما كان اتفتح منين) */
function autoRev(){if(S&&S.h&&S.h.issuedSig&&sig()!==S.h.issuedSig&&(!S.h.rev||S.h.revIssued===S.h.rev))startRevision()}
function markIssued(){if(!S||!S.h)return;const now=Date.now();S.h.issuedSig=sig();if(!S.h.issuedAt)S.h.issuedAt=now;S.h.lastIssuedAt=now;if(S.h.rev)S.h.revIssued=S.h.rev;save()}
const _rd=repData;repData=function(){autoRev();const d=_rd.apply(this,arguments);if(S.h.rev){d.rev=S.h.rev;d.revNote=revNote()}
 const mh=JSON.parse(JSON.stringify(S.h));mh.issuedAt=mh.issuedAt||Date.now();if(mh.rev)mh.revIssued=mh.rev;/* الملف ده نفسه هو النسخة اللي اتصدرت */
 d.meta={v:1,h:mh,rows:S.rows.filter(filled),left:(S.left||[]).filter(lfilled),revLog:S.revLog||[]};return d};
const _eh=extraHead;extraHead=function(){const o=_eh.apply(this,arguments);if(S.h.rev)o.push(['ملاحظة التعديل',revNote()]);return o};
const _mx=makeXlsx;makeXlsx=function(){autoRev();const b=_mx.apply(this,arguments);markIssued();return b};
function hookPdf(){if(!window.PR||!PR.pdf||PR.pdf.__re)return;const _p=PR.pdf;PR.pdf=async function(d){const b=await _p.apply(this,arguments);markIssued();return b};PR.pdf.__re=1}
hookPdf();window.addEventListener('load',hookPdf);
/* ---------- 2) فتح تقرير قديم للتعديل ---------- */
function startRevision(){const h=S.h;const base=baseCode(h.code)||prCode(h.date);
 /* مراجعة جديدة بس لو المراجعة اللي قبلها اتصدرت (أو دي أول مرة) */
 if(!h.rev||h.revIssued===h.rev){h.rev=(h.rev||0)+1;h.revOf=base;h.code=base+'-R'+h.rev;h.revAt=Date.now();S.revLog=Array.isArray(S.revLog)?S.revLog:[];S.revLog.push({rev:h.rev,at:h.revAt,pal:S.rows.filter(r=>r&&r.p).length,left:(S.left||[]).filter(lfilled).length})}}
function confirmText(x,src){const h=x.h||{};const base=baseCode(h.code);const n=(h.rev&&h.revIssued!==h.rev)?h.rev:(h.rev||0)+1;
 return 'هتفتح تقرير يوم '+slash(h.date)+(h.shift?' ('+h.shift+')':'')+' للتعديل'+(src?' من '+src:'')+'.\n\n'+
 '• التاريخ والوردية هيفضلوا زي ما هم.\n• التقرير هيطلع برقم '+(base?base+'-R'+n:'جديد')+' ومكتوب عليه «معدّل».\n'+
 '• لو التقرير القديم اتسجل في برنامج المحطة: احذف تشغيله هناك الأول من «التشغيل والإنتاج» ← حذف التشغيل، وبعدين سجّل المعدّل — المحطة بترفض الملف المعدّل لو باليتاته متسجلة.\n\nتكمل؟'}
async function openForEdit(x,src){if(isIssued(x)&&!confirm(confirmText(x,src)))return false;
 await save();S=JSON.parse(JSON.stringify(x));if(!Array.isArray(S.left))S.left=[];if(!Array.isArray(S.rows)||!S.rows.length)S.rows=[er()];
 if(isIssued(S))startRevision();await save();closeSheet();redraw();scrollTo(0,0);
 showBanner('✏️ بتعدّل تقرير يوم <b>'+esc(slash(S.h.date))+'</b> — رقم <b dir="ltr">'+esc(S.h.code)+'</b>. لما تخلّص طلّع PDF / Excel من جديد.');return true}
function showBanner(t){let b=document.getElementById('revBanner');if(!b){b=document.createElement('div');b.id='revBanner';b.className='noprint';b.style.cssText='background:#fdf2e9;border:1px solid #f0b37e;border-radius:10px;padding:10px;margin:8px;font-size:14px;line-height:1.5';document.body.insertBefore(b,document.body.children[1]||null)}b.innerHTML=t}
function paintRevBanner(){const b=document.getElementById('revBanner');if(S&&S.h&&S.h.rev)showBanner('✏️ تقرير معدّل — يوم <b>'+esc(slash(S.h.date))+'</b> · رقم <b dir="ltr">'+esc(S.h.code)+'</b>'+(S.h.revIssued===S.h.rev?' · اتصدر ✓':' · <b>لسه ما اتصدرش</b>'));else if(b)b.remove()}
/* ---------- PDF → بيانات ---------- */
let pdfP=null;function pdfLib(){if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);if(pdfP)return pdfP;pdfP=new Promise((res,rej)=>{const s=document.createElement('script');s.src='pdfjs/pdf.min.js?v=3.11.174';s.onload=()=>{const L=window.pdfjsLib||window['pdfjs-dist/build/pdf'];if(!L){pdfP=null;return rej(new Error('pdfjs'))}L.GlobalWorkerOptions.workerSrc='pdfjs/pdf.worker.min.js?v=3.11.174';res(L)};s.onerror=()=>{pdfP=null;rej(new Error('pdfjs load'))};document.head.appendChild(s)});return pdfP}
const CT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c}return t})();
function decEmb(txt){const s=String(txt||'').replace(/\s+/g,'');const m=s.match(/ALOLADATA1:([A-Za-z0-9+/=]+):([0-9a-f]{8})/);if(!m)return null;let c=~0;for(let i=0;i<m[1].length;i++)c=CT[(c^m[1].charCodeAt(i))&255]^(c>>>8);if(((~c)>>>0).toString(16).padStart(8,'0')!==m[2])throw new Error('البيانات جوه الـ PDF تالفة');
 const bin=atob(m[1]);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return JSON.parse(new TextDecoder().decode(u))}
async function readPdf(file){const L=await pdfLib();const doc=await L.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;let d=null;
 try{const md=await doc.getMetadata();d=decEmb(md&&md.info&&md.info.Keywords)}catch(e){if(/تالفة/.test(e.message))throw e}
 if(!d){const pg=await doc.getPage(1);const tc=await pg.getTextContent();d=decEmb(tc.items.map(i=>i.str).join(''))}
 if(!d||d.app!=='alola'||d.kind!=='prod'||!Array.isArray(d.rows))throw new Error('الملف ده مش تقرير إنتاج طالع من البرنامج (مفيش بيانات مدمجة جواه)');return d}
const MIXRE=/^MIX\s*\((.*)\)$/;
function fromEmb(d){if(d.meta&&d.meta.h&&Array.isArray(d.meta.rows)){const m=d.meta;return {h:m.h,rows:m.rows.length?m.rows:[er()],left:Array.isArray(m.left)?m.left:[],revLog:m.revLog||[]}}
 /* تقارير قديمة (قبل v1): من جدول الإكسل المدمج */
 const A=d.rows;const hi=A.findIndex(r=>Array.isArray(r)&&r[1]==='رقم الباليت');const H={};A.slice(0,hi<0?A.length:hi).forEach(r=>{if(Array.isArray(r)&&r.length>=2&&r[0])H[r[0]]=r[1]});
 const h={date:String(H['تاريخ الإنتاج']||''),eng:String(H['مهندس التشغيل']||''),exp:String(H['المُصدر']||'العلا'),shift:String(H['الوردية']||''),code:String(H['كود التقرير']||'')};if(H['اسم المورد'])h.sup=String(H['اسم المورد']);
 const rows=[];if(hi>=0)for(const r of A.slice(hi+1)){if(!Array.isArray(r)||!r[1])continue;const s=String(r[3]??'');const o={p:String(r[1]),v:String(r[2]||''),s,pk:String(r[4]||''),c:String(r[5]||''),b:String(r[6]||''),g:String(r[7]||''),loc:String(r[8]||''),n:String(r[9]??''),w:String(r[10]??''),note:String(r[11]||'')};
  const mm=s.match(MIXRE);if(mm){o.s='MIX';o.mix=mm[1].split(/[،,]/).map(x=>x.trim()).filter(Boolean).map(x=>{const q=x.split(/[×x*]/);return {s:String(q[0]||'').trim(),n:String(q[1]||'').trim()}})}rows.push(o)}
 const left=(Array.isArray(d.left)?d.left:[]).map(x=>({v:x.v||'',pk:x.pk||'',c:x.c||'',s:String(x.s??''),b:x.b||'',g:x.g||'',n:String(x.n||''),w:x.w?String(x.w):'',note:x.note||''}));
 const raw=Number(H['الخام الداخل كجم'])||0;const vs=[...new Set(rows.map(r=>r.v).concat(left.map(r=>r.v)).filter(Boolean))];if(raw>0){h.raw={};if(vs.length===1)h.raw[vs[0]]=raw;else h.rawTotal=raw}
 return {h,rows:rows.length?rows:[er()],left}}
async function openPdfFile(file){let d;try{d=await readPdf(file)}catch(e){alert('مش قادر أفتح الملف: '+e.message);return}
 const x=fromEmb(d);x._id='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);x.h.issuedAt=x.h.issuedAt||Date.now();
 const days=await (window.prodDays?prodDays():Promise.resolve([])).catch(()=>[]);const same=days.concat([S]).find(y=>y&&y.h&&y.h.code&&baseCode(y.h.code)===baseCode(x.h.code));
 if(same&&confirm('التقرير ده ('+baseCode(x.h.code)+') محفوظ على الموبايل ده كمان. أفتح النسخة اللي على الموبايل بدل الملف؟\n(«إلغاء» = افتح نسخة الملف)'))return openForEdit(same,'الأيام المحفوظة');
 const ok=await openForEdit(x,'ملف PDF');if(ok&&x.h.rawTotal&&!Object.keys(S.h.raw||{}).length)alert('التقرير القديم كان فيه إجمالي الخام '+x.h.rawTotal+' كجم من غير توزيع على الأصناف — اكتب الخام لكل صنف في خانة الخام فوق.')}
/* ---------- الشاشة ---------- */
function closeSheet(){const w=document.getElementById('reSheet');if(w)w.remove()}
function sheet(title,body){closeSheet();const w=document.createElement('div');w.id='reSheet';w.className='noprint';w.style.cssText='position:fixed;inset:0;background:#0007;z-index:10001;display:flex;align-items:flex-end;justify-content:center';
 w.innerHTML='<div class="re-box"><div class="re-hd"><b>'+title+'</b><button type="button" class="re-x" data-re="x">إغلاق</button></div>'+body+'</div>';
 w.addEventListener('click',e=>{if(e.target===w||e.target.closest('[data-re="x"]'))closeSheet()});document.body.appendChild(w);return w}
async function openEditList(){const L=(await (window.prodDays?prodDays():Promise.resolve([])).catch(()=>[])).filter(x=>x&&x.h);const cur=S&&S.h&&isIssued(S)?[S]:[];
 const card=(x,i,isCur)=>{const h=x.h||{};const pal=(x.rows||[]).filter(r=>r&&r.p).length,lf=(x.left||[]).filter(lfilled).length;
  return '<div class="re-day"><div><b>'+esc(slash(h.date))+'</b>'+(h.shift?' · '+esc(h.shift):'')+(h.eng?' · '+esc(h.eng):'')+'<div class="re-sub">'+pal+' باليت · '+lf+' سطر نواقص'+(()=>{const t=netOfDay(x);return t!=null&&t>0?' · صافي '+t.toLocaleString('en-US',{maximumFractionDigits:1})+' كجم':''})()+(h.code?' · <span dir="ltr">'+esc(h.code)+'</span>':'')+'</div><div class="re-sub">'+(isIssued(x)?'<span class="re-ok">اتصدر'+(h.lastIssuedAt?' '+esc(stamp(h.lastIssuedAt)):'')+'</span>':'<span>لسه ما اتصدرش</span>')+(h.rev?' · <span class="re-rev">معدّل R'+h.rev+'</span>':'')+(isCur?' · <b>مفتوح دلوقتي</b>':'')+'</div></div><button type="button" class="btn re-go" data-reo="'+(isCur?'cur':i)+'">✏️ تعديل</button></div>'};
 const w=sheet('✏️ تعديل تقرير اتصدر قبل كده','<div class="re-hint">اختار التقرير (مثلاً تقرير امبارح). هيتفتح بنفس تاريخه ووردِيته، وتقدر تشيل النواقص وتحوّلها لباليتات MIX، وبعدين تطلّع PDF / Excel معدّل.</div>'+
  (cur.length?card(S,0,true):'')+(L.length?L.map((x,i)=>card(x,i,false)).join(''):'<div class="re-empty">مفيش أيام تانية محفوظة على الموبايل ده</div>')+
  '<label class="btn2 re-file">📄 افتح تقرير من ملف PDF (من الواتساب أو من موبايل تاني)<input type="file" accept="application/pdf,.pdf" id="rePdf" hidden></label>');
 w.addEventListener('click',async e=>{const t=e.target.closest('[data-reo]');if(!t)return;if(t.dataset.reo==='cur'){if(!confirm(confirmText(S,'')))return;startRevision();await save();closeSheet();redraw();paintRevBanner();return}const x=L[+t.dataset.reo];if(x)await openForEdit(x,'الأيام المحفوظة');paintRevBanner()});
 w.querySelector('#rePdf').addEventListener('change',async e=>{const f=e.target.files&&e.target.files[0];if(f){await openPdfFile(f);paintRevBanner()}})}
/* ---------- الوزن الصافي: نفس دالة التقرير (PR.netG / PR.netTotals) — خصم الكراتين الفاضية بس (من غير باليت) ---------- */
const nrm=r=>Object.assign({},r,{n:String(parseInt(AD(String(r&&r.n||'')).trim(),10)||0),w:String(wNum(r&&r.w)||0)});
const kg1=g=>(Math.round(g/100)/10).toLocaleString('en-US',{maximumFractionDigits:1});
function netOfDay(x){try{if(!window.PR||!PR.netTotals)return null;const P=PR.prepYield((x.rows||[]).filter(filled).map(nrm),(x.left||[]).filter(lfilled).map(nrm));return PR.netTotals(P.rows,P.left).tt/10}catch(e){return null}}
function netOfRow(r,isLeft){try{if(!window.PR||!PR.netG)return null;const P=PR.prepYield(isLeft?[]:[nrm(r)],isLeft?[nrm(r)]:[]);return PR.netG(isLeft?P.left[0]:P.rows[0],isLeft)}catch(e){return null}}
/* ---------- 3) النواقص ← باليتات MIX ---------- */
const gk=r=>[r.v,r.pk,r.c,r.b,r.g].map(x=>String(x||'').trim()).join('|');
const lc=r=>{const s=AD(String(r.n||'')).trim();return /^[1-9]\d*$/.test(s)?parseInt(s,10):0};
function groups(){const G=new Map();(S.left||[]).forEach((r,i)=>{if(!lfilled(r))return;const k=gk(r);if(!G.has(k))G.set(k,{k,v:r.v,pk:r.pk,c:r.c,b:r.b,g:r.g,idx:[]});G.get(k).idx.push(i)});
 return [...G.values()].map(g=>{const sz=new Map();g.idx.forEach(i=>{const r=S.left[i];const s=String(r.s||'').trim();if(!sz.has(s))sz.set(s,{s,n:0,idx:[],w:{}});const o=sz.get(s);o.n+=lc(r);o.idx.push(i);const w=wStr(r.w);if(w)o.w[w]=(o.w[w]||0)+lc(r)});g.sizes=[...sz.values()];return g})}
function locOpts(){const seen={};S.rows.forEach(r=>{if(r&&r.loc)seen[r.loc]=(seen[r.loc]||0)+1});const best=Object.keys(seen).sort((a,b)=>seen[b]-seen[a])[0]||'';return {list:[...new Set([...(L.loc||[]),...Object.keys(seen)])],best}}
function wPick(ch){const W={};ch.forEach(z=>Object.entries(z.w).forEach(([k,c])=>W[k]=(W[k]||0)+c));return Object.keys(W).sort((a,b)=>W[b]-W[a])}
/* مفيش وزن في النواقص ← وزن باليت من نفس التعبئة والكرتون في التقرير */
function fallbackW(g){const C={};S.rows.forEach(r=>{if(r&&filled(r)&&r.pk===g.pk&&r.c===g.c){const w=wStr(r.w);if(w)C[w]=(C[w]||0)+1}});return Object.keys(C).sort((a,b)=>C[b]-C[a])[0]||''}
function netPal(g,ch){const n=ch.reduce((a,z)=>a+z.n,0);const ws=wPick(ch);if(!ws.length){const f=fallbackW(g);if(f)ws.push(f)}if(!ws.length)return null;const pal=netOfRow({p:'P?',v:g.v,c:g.c,n:String(n),w:ws[0]},false);let left=0;ch.forEach(z=>z.idx.forEach(i=>{const v=netOfRow(S.left[i],true);left+=v||0}));return pal==null?null:{pal,left}}
function openConvert(){const G=groups();if(!G.length){alert('مفيش نواقص في التقرير ده');return}const LO=locOpts();const SZL=SZ();
 const body='<div class="re-hint">كل مجموعة = نفس الصنف والتعبئة والكرتون والاسم والدرجة. علّم المقاسات اللي هتدخل الباليت (من 2 لـ 5 مقاسات للـ MIX، أو مقاس واحد لباليت عادي). عدد كراتين الباليت = مجموع المقاسات (مقفول). السطور اللي هتتحول بتتشال من النواقص.</div>'+
  G.map((g,gi)=>'<div class="re-grp" data-g="'+gi+'"><div class="re-gt">'+esc([g.v,g.pk,g.c,g.b,g.g].filter(Boolean).join(' · '))+'</div>'+
   g.sizes.map((z,zi)=>{const bad=!z.n||!SZL.includes(z.s);return '<label class="re-sz'+(bad?' bad':'')+'"><input type="checkbox" data-zg="'+gi+'" data-z="'+zi+'"'+(bad||zi>=5?'':' checked')+(bad?' disabled':'')+'><span class="re-szs" dir="ltr">'+esc(z.s||'؟')+'</span><span>'+z.n+' كرتونة</span>'+(bad?'<small>'+(z.n?'مقاس مش في القايمة':'عدد ناقص')+' — يفضل نواقص</small>':'')+'</label>'}).join('')+
   '<div class="re-row"><label class="re-l">مكان التخزين<select data-gloc="'+gi+'">'+['<option value="">— اختار —</option>'].concat(LO.list.map(x=>'<option'+(x===LO.best?' selected':'')+'>'+esc(x)+'</option>')).join('')+'</select></label></div>'+
   '<div class="re-sum" id="reSum'+gi+'"></div><button type="button" class="btn re-mk" data-mk="'+gi+'">🔀 اعمل الباليت</button></div>').join('');
 const w=sheet('🔀 تحويل النواقص لباليتات MIX',body);
 const paint=gi=>{const g=G[gi];const ch=[...w.querySelectorAll('[data-zg="'+gi+'"]:checked')].map(x=>g.sizes[+x.dataset.z]);const n=ch.reduce((a,z)=>a+z.n,0);const el=w.querySelector('#reSum'+gi);const b=w.querySelector('[data-mk="'+gi+'"]');
  const ok=ch.length>=1&&ch.length<=5;const nt=ch.length?netPal(g,ch):null;el.innerHTML=ch.length?(ch.length>1?'باليت <b>MIX</b> ('+ch.length+' مقاسات) = <b>'+n+'</b> كرتونة':'باليت عادي مقاس <b dir="ltr">'+esc(ch[0].s)+'</b> = <b>'+n+'</b> كرتونة')+(nt?'<div class="re-net">صافي الباليت ≈ <b dir="ltr">'+kg1(nt.pal)+'</b> كجم (كانت '+kg1(nt.left)+' كجم صافي في النواقص — الفرق '+kg1(nt.left-nt.pal)+' كجم = وزن الباليت الخشب)</div>':''):'علّم مقاس واحد على الأقل';if(ch.length>5)el.innerHTML='⚠ الـ MIX لحد 5 مقاسات بس';el.classList.toggle('bad',!ok);b.disabled=!ok;
  w.querySelectorAll('[data-zg="'+gi+'"]:not(:disabled)').forEach(x=>{x.closest('label').classList.toggle('on',x.checked)})};
 G.forEach((g,gi)=>paint(gi));
 w.addEventListener('change',e=>{const t=e.target;if(t.dataset.zg!==undefined)paint(+t.dataset.zg)});
 w.addEventListener('click',e=>{const t=e.target.closest('[data-mk]');if(!t||t.disabled)return;const gi=+t.dataset.mk,g=G[gi];const ch=[...w.querySelectorAll('[data-zg="'+gi+'"]:checked')].map(x=>g.sizes[+x.dataset.z]);if(!ch.length||ch.length>5)return;
  const loc=w.querySelector('[data-gloc="'+gi+'"]').value;if(!loc){alert('اختار مكان التخزين للباليت');return}
  const n=ch.reduce((a,z)=>a+z.n,0);const ws=wPick(ch);if(!ws.length){const f=fallbackW(g);if(f)ws.push(f);else{alert('سطور النواقص دي مفيهاش وزن الكرتونة — اكتب الوزن في النواقص الأول، وبعدين حوّلها لباليت.');return}}
  if(!confirm('هتشيل '+ch.reduce((a,z)=>a+z.idx.length,0)+' سطر من النواقص ('+n+' كرتونة) وتعمل '+(ch.length>1?'باليت MIX بـ '+ch.length+' مقاسات':'باليت مقاس '+ch[0].s)+' = '+n+' كرتونة.'+(ws.length>1?'\n⚠ أوزان الكرتونة مختلفة ('+ws.join(' / ')+' كجم) — هيتاخد '+ws[0]+' كجم، راجعه.':'')+'\nبعدها اختار رقم الباليت. تمام؟'))return;
  const row=Object.assign(er(),{v:g.v||'',pk:g.pk||'',c:g.c||'',b:g.b||'',g:g.g||'',loc,n:String(n),w:ws[0]||'',note:'اتحول من النواقص'});
  if(ch.length>1){row.s='MIX';row.mix=ch.map(z=>({s:z.s,n:String(z.n)}))}else row.s=ch[0].s;
  const drop=new Set(ch.flatMap(z=>z.idx));S.left=(S.left||[]).filter((r,i)=>!drop.has(i));
  let i=S.rows.findIndex(r=>!filled(r));if(i<0){S.rows.push(row);i=S.rows.length-1}else S.rows[i]=row;
  S.revLog=Array.isArray(S.revLog)?S.revLog:[];S.revLog.push({conv:1,at:Date.now(),n,sizes:ch.map(z=>z.s+'×'+z.n).join('، ')});
  save();closeSheet();renderRows();renderLeft();upd();try{POOL.reconcile()}catch(_){}
  const el=document.getElementById('r'+i);if(el)el.scrollIntoView({block:'center'});toast('اتعمل الباليت ('+n+' كرتونة) — اختار رقم الباليت');
  const pk=document.getElementById('pk'+i);if(pk&&!pk.disabled)setTimeout(()=>pk.click(),350)})}
/* ---------- الأزرار ---------- */
function mountButtons(){const hc=document.getElementById('date');const card=hc&&hc.closest('.card');if(card&&!document.getElementById('bEditOld')){const b=document.createElement('button');b.type='button';b.id='bEditOld';b.className='btn2 noprint re-open';b.textContent='✏️ تعديل تقرير اتصدر قبل كده (زي تقرير امبارح)';b.onclick=openEditList;card.appendChild(b)}
 const al=document.getElementById('addLeft');if(al&&!document.getElementById('bConv')){const b=document.createElement('button');b.type='button';b.id='bConv';b.className='btn2 noprint re-conv';b.textContent='🔀 حوّل النواقص لباليتات MIX كاملة';b.onclick=openConvert;al.insertAdjacentElement('afterend',b)}
 const c=document.getElementById('bConv');if(c)c.style.display=(S.left||[]).some(lfilled)?'':'none'}
const css=document.createElement('style');css.textContent=`
.re-box{background:#fff;width:100%;max-width:560px;max-height:86vh;overflow:auto;border-radius:16px 16px 0 0;padding:14px 14px max(14px,env(safe-area-inset-bottom))}
.re-hd{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}.re-hd b{font-size:17px}.re-x{min-height:44px;padding:6px 14px;font-size:15px}
.re-hint{font-size:13.5px;color:#475569;line-height:1.5;margin-bottom:8px}.re-empty{padding:14px;text-align:center;color:#64748b}
.re-day{border:1px solid #e2e8f0;border-radius:12px;padding:10px;margin:8px 0;display:flex;justify-content:space-between;align-items:center;gap:8px}.re-day>div{min-width:0}
.re-sub{font-size:12.5px;color:#64748b;margin-top:2px;overflow-wrap:anywhere}.re-ok{color:#1d6b35;font-weight:700}.re-rev{color:#b42318;font-weight:700}
.re-go{min-height:46px;padding:8px 14px;white-space:nowrap;flex:none}.re-file{display:flex;align-items:center;justify-content:center;text-align:center;min-height:50px;margin-top:10px;width:100%;cursor:pointer;line-height:1.35;padding:8px}
.re-open,.re-conv{width:100%;margin-top:10px;min-height:48px;font-weight:700}
.re-grp{border:1.5px solid #d6e3d7;border-radius:12px;padding:10px;margin:10px 0;background:#fbfdfb}.re-gt{font-weight:800;margin-bottom:6px;overflow-wrap:anywhere}
.re-sz{display:flex;align-items:center;gap:10px;min-height:46px;border:1px solid #e2e8f0;border-radius:10px;padding:4px 10px;margin:6px 0;background:#fff}.re-sz.on{border-color:#2e7d32;background:#eef7ee}.re-sz input{width:24px;height:24px;flex:none}
.re-sz.bad{opacity:.6}.re-sz small{color:#b42318}.re-szs{font-weight:800;min-width:34px}
.re-row{margin-top:6px}.re-l{display:block;font-size:13px;color:#555}.re-l select{width:100%;min-height:46px;margin-top:3px}
.re-sum{margin:8px 0;font-size:15px;color:#1d6b35}.re-net{font-size:12.5px;color:#475569;margin-top:3px;line-height:1.45}.re-sum.bad{color:#b42318}.re-mk{width:100%;min-height:48px}.re-mk:disabled{opacity:.45}`;
document.head.appendChild(css);
const _ul=upd;upd=function(){const r=_ul.apply(this,arguments);try{mountButtons();paintRevBanner()}catch(e){}return r};
mountButtons();paintRevBanner();
/* «📂 الأيام المحفوظة» القديمة: فتح يوم اتصدر = نفس التأكيد */
function guardOpen(x){return !isIssued(x)||confirm(confirmText(x,'الأيام المحفوظة'))}
function afterOpen(){if(isIssued(S)){startRevision();save()}paintRevBanner()}
window.RE={guardOpen,afterOpen,sig,openEditList,openConvert,openForEdit,openPdfFile,fromEmb,decEmb,startRevision,revNote};
})();
