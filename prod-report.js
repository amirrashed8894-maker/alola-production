/* Production report PDF v14 — Alola letterhead */
(function(){
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const r1=x=>Math.round(x*10)/10, nf=x=>Number(r1(x)).toLocaleString('en-US');
const VORDER=['أبو سرة','صيفي','موركيت كيني','موركيت إسباني','ليمون'];
const CSS=`@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-arabic.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200E}
@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-latin.woff2) format('woff2')}#prstage .page{width:794px;height:1123px;background:#fff;color:#1c241c;font-family:Cairo,Tahoma,Arial,sans-serif;direction:rtl;position:relative;overflow:hidden;box-sizing:border-box}#prstage .chromeTop{background:#fff}#prstage .mast{display:flex;align-items:center;justify-content:space-between;padding:12px 22px 8px;min-height:78px;box-sizing:border-box}#prstage .mast .nm{font-size:18px;font-weight:800;color:#1f8a12;line-height:1.25}#prstage .mast .sub{font-size:11px;color:#3e6434;font-weight:600;margin-top:1px;direction:ltr;text-align:right}#prstage .mast img{height:62px;width:auto;display:block}#prstage .rule1{height:6px;background:#1f8a12}#prstage .rulegap{height:3px;background:#fff}#prstage .rule2{height:2px;background:#16700c}#prstage .body{box-sizing:border-box;padding:8px 16px 0}#prstage .meta{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin:2px 2px 2px;font-size:12.5px}#prstage .ref b{font-weight:800}#prstage .edt b{border-bottom:2px solid #1f8a12;padding:0 8px 1px;font-weight:800;letter-spacing:.4px}#prstage .ttl{display:flex;justify-content:space-between;align-items:flex-end;margin:6px 2px 8px}#prstage .tt{text-align:center}#prstage .tt h1{margin:0;font-size:22px;line-height:1.15;color:#1f8a12;font-weight:800}#prstage .tt .en{direction:ltr;font-size:8.5px;letter-spacing:.3px;color:#1f8a12;font-weight:700;margin-top:1px}#prstage .pill{border:1.5px solid #1f8a12;color:#1f8a12;border-radius:999px;padding:4px 12px;font-weight:800;font-size:12px;white-space:nowrap}#prstage .inf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid #d5ddd4;border-radius:8px;overflow:hidden;margin-bottom:8px}#prstage .inf>div{padding:5px 6px 4px;border-left:1px solid #e3ece2;text-align:center}#prstage .inf>div:last-child{border-left:0}#prstage .inf small{display:block;color:#6a7b68;font-size:9px}#prstage .inf b{font-size:12.5px;font-weight:800}#prstage .k{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 8px}#prstage .k>div{background:#f3f8f1;border:1px solid #c9e2c4;border-radius:10px;padding:6px 8px 5px;text-align:center}#prstage .k small{display:block;color:#245c28;font-size:11px;font-weight:800}#prstage .k b{display:block;font-size:26px;color:#16700c;font-weight:800;line-height:1.1;margin:1px 0}#prstage .k .ex{font-size:8px;color:#5c735b;line-height:1.35}#prstage h4{display:flex;align-items:baseline;gap:5px;font-size:12.5px;margin:7px 0 3px;color:#16331a;font-weight:800}#prstage h4 i{width:8px;height:8px;background:#1f8a12;display:inline-block;flex:none;transform:translateY(1px)}#prstage h4 small{font-weight:600;color:#66786a;font-size:10px}#prstage table{width:100%;border-collapse:collapse;font-size:10px;margin:0 0 3px}#prstage th{background:#1f8a12;color:#fff;padding:3px 3px;font-weight:700;border:1px solid #18740f;text-align:center}#prstage td{border:1px solid #d5e6d1;padding:2px 3px;text-align:center;vertical-align:middle;background:#fff}#prstage td.r{text-align:right}#prstage td.pid{color:#17810f;font-weight:800}#prstage td.sz{font-weight:700;line-height:1.25}#prstage td.sz .mx{display:block;font-size:8px;font-weight:700;color:#14580e;line-height:1.35;margin-top:1px}#prstage td.sz .ml{white-space:nowrap}#prstage td.sz .ml{white-space:nowrap}#prstage tr.sub td{background:#e5f4e0;font-weight:800;color:#12480d;border-color:#c5e0be}#prstage tr.gt td{background:#14690c;color:#fff;font-weight:800;border-color:#14690c}#prstage tr.gh td{background:#fff;color:#1f8a12;font-weight:800;text-align:right;border-color:#d5e6d1}#prstage .note{font-size:8.5px;color:#66786a;margin:1px 2px 6px;line-height:1.4}#prstage .vc{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 4px}#prstage .vc>div{flex:1 1 30%;border:1px solid #d3e6ce;border-radius:10px;padding:6px 8px;text-align:center;box-sizing:border-box}#prstage .vc .vn{color:#1f8a12;font-weight:800;font-size:13px}#prstage .vc .vs{font-size:10.5px;line-height:1.4;margin-top:2px}#prstage .vc .vp{color:#16700c;font-weight:800}#prstage .two{display:flex;gap:10px;margin-top:4px}#prstage .two>div{flex:1;min-width:0}#prstage .sg{display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px;padding:4px 8px 0}#prstage .role{color:#1f8a12;font-weight:800;font-size:13px}#prstage .name{font-weight:800;font-size:15px;margin:3px 0 8px}#prstage .sigl{color:#333;font-size:12px}#prstage .dep{text-align:center}#prstage .dep img{height:48px;width:auto;display:block;margin:0 auto 2px}#prstage .dep span{font-size:11.5px;font-weight:800}#prstage .foot{position:absolute;left:0;right:0;bottom:0;background:#fff}#prstage .pmeta{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;padding:4px 14px 5px;font-size:9px;color:#243024}#prstage .pmeta span:nth-child(1){justify-self:start}#prstage .pmeta span:nth-child(2){text-align:center}#prstage .pmeta span:nth-child(3){justify-self:end}#prstage .co{background:#1f8a12;color:#fff;min-height:92px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;padding:8px 16px;font-size:9.5px;line-height:1.45}#prstage .co .r{display:flex;justify-content:space-between;gap:12px;align-items:center}#prstage .co .ln{height:1px;background:rgba(255,255,255,.8);margin:4px 0}#prstage .blk{width:762px}`;
function grp(rows,key){const m={};rows.forEach(r=>{const k=r[key]||'غير محدد';m[k]=m[k]||{p:0,n:0,kg:0};m[k].p++;m[k].n+=r._n;m[k].kg+=r._kg});return m}
function pct(n,tot){if(!tot)return '0%';const v=Math.round(n*1000/tot)/10;return (v%1?v.toFixed(1):String(v))+'%'}
function parts(iso){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||'');if(!m)return {iso:iso||'—',dmy:iso||'—',slash:iso||'—'};return {iso,dmy:m[3]+'-'+m[2]+'-'+m[1],slash:m[3]+' / '+m[2]+' / '+m[1]}}
function mixParts(r){return (Array.isArray(r.mix)?r.mix:[]).map(x=>{const s=String(x&&x.s||'').trim();const n=parseInt(x&&x.n,10);if(!s||s==='MIX'||!(n>0))return null;return {s,n}}).filter(Boolean)}
function sizeCell(r){if(r.s==='MIX'){const p=mixParts(r);const br=p.map(x=>`<div class="ml"><span dir="ltr">${e(x.s)} × ${x.n.toLocaleString('en-US')}</span> كرتونة</div>`).join('');return 'MIX'+(br?`<div class="mx">${br}</div>`:'')}return e(r.s||'')}
function vRank(v){const i=VORDER.indexOf(v);return i<0?50:i}
function sRank(s){if(s==='MIX')return 10000;const n=parseFloat(s);return isNaN(n)?9999:n}
function varietiesOf(rows){const map=new Map();rows.forEach(r=>{const v=r.v||'غير محدد';if(!map.has(v))map.set(v,[]);map.get(v).push(r)});const list=[...map.entries()].map(([v,rs])=>({v,rows:rs}));list.sort((a,b)=>vRank(a.v)-vRank(b.v)||a.v.localeCompare(b.v,'ar'));list.forEach(g=>g.rows.sort((a,b)=>sRank(a.s)-sRank(b.s)||String(a.p).localeCompare(String(b.p),'en')));return list}
function byExp(rows,dexp){const map=new Map();rows.forEach(r=>{const x=r.exp||dexp||'العلا';if(!map.has(x))map.set(x,[]);map.get(x).push(r)});return [...map.entries()]}
function mastHTML(){return `<div class="chromeTop"><div class="mast"><div><div class="nm">شركة العلا لفرز الحاصلات الزراعية</div><div class="sub">Al Ola for Agricultural Crops Sorting</div></div><img src="alola_logo_green.png" alt=""></div><div class="rule1"></div><div class="rulegap"></div><div class="rule2"></div></div>`}
function footHTML(n,pages,d,dt){const center='تقرير الإنتاج اليومي — <span dir="ltr">'+e(dt.dmy)+'</span> — وردية '+e(d.shift||'—');return `<div class="foot"><div class="pmeta"><span dir="ltr">${e(d.code||'')}</span><span>${center}</span><span>صفحة ${n} من ${pages}</span></div><div class="co"><div class="r"><span>العنوان: قطعة رقم ٢٠٦ ورقم ٢٠٨ - حوض البطن رقم ٥ - ترسا - طوخ - قليوبية</span><span dir="ltr">E-mail: alola.co2023@gmail.com</span></div><div class="ln"></div><div class="r"><span dir="ltr">Tel: 013/2604937 | Fax: 013/2604938</span><span>ب.ض 206232 · س.ت 798-899-781</span></div></div></div>`}
function introHTML(d,rows,dt){const N=rows.reduce((a,r)=>a+r._n,0),KG=rows.reduce((a,r)=>a+r._kg,0),P=rows.filter(r=>r.p).length,exp=e(d.exp||'العلا');
 return `<div class="meta"><div class="ref">الرقم المرجعي: <b dir="ltr">${e(d.code||'')}</b></div><div class="edt">تحريراً في: <b dir="ltr">${e(dt.slash)}</b></div></div>
 <div class="ttl"><div class="tt"><h1>تقرير الإنتاج اليومي</h1><div class="en">DAILY PRODUCTION REPORT · OPERATIONS</div></div><div class="pill">وردية ${e(d.shift||'—')} · <span dir="ltr">${e(dt.dmy)}</span></div></div>
 <div class="inf"><div><small>التاريخ</small><b dir="ltr">${e(dt.iso)}</b></div><div><small>الوردية</small><b>${e(d.shift||'—')}</b></div><div><small>مهندس التشغيل</small><b>${e(d.eng||'—')}</b></div><div><small>المصدر</small><b>${exp}</b></div><div><small>وقت الإصدار</small><b dir="ltr">${e(d.at||'—')}</b></div></div>
 <div class="k"><div><small>عدد الباليتات</small><b>${P}</b><div class="ex">كل الباليتات المسجلة في الوردية – مصدر ${exp}</div></div>
 <div><small>إجمالي الكراتين</small><b>${N.toLocaleString('en-US')}</b><div class="ex">مجموع عدد الكراتين على كل الباليتات</div></div>
 <div><small>إجمالي الوزن (كجم)</small><b>${nf(KG)}</b><div class="ex">الوزن = عدد الكراتين × وزن الكرتونة لكل باليت</div></div></div>`}
function summaryTable(rows,dexp){const exps=byExp(rows,dexp);const multi=exps.length>1;let body='',P=0,N=0,KG=0;
 exps.forEach(([x,rs])=>{const vs=varietiesOf(rs);if(multi)body+=`<tr class="gh"><td colspan="7">المصدر: ${e(x)}</td></tr>`;
  vs.forEach(g=>{let n=0,kg=0;g.rows.forEach(r=>{n+=r._n;kg+=r._kg;body+=`<tr><td class="r">${e(r.v)}</td><td class="sz">${sizeCell(r)}</td><td>1</td><td class="pid" dir="ltr">${e(r.p)}</td><td>${e(r.g)}</td><td>${r._n||''}</td><td>${nf(r._kg)||''}</td></tr>`});
   body+=`<tr class="sub"><td class="r">إجمالي ${e(g.v)}</td><td></td><td>${g.rows.length}</td><td></td><td></td><td>${n}</td><td>${nf(kg)}</td></tr>`});
  const tn=rs.reduce((a,r)=>a+r._n,0),tkg=rs.reduce((a,r)=>a+r._kg,0);P+=rs.filter(r=>r.p).length;N+=tn;KG+=tkg;
  body+=`<tr class="gt"><td class="r" colspan="2">إجمالي المصدر: ${e(x)}</td><td>${rs.filter(r=>r.p).length}</td><td></td><td></td><td>${tn}</td><td>${nf(tkg)}</td></tr>`});
 if(multi)body+=`<tr class="gt"><td class="r" colspan="2">الإجمالي العام</td><td>${P}</td><td></td><td></td><td>${N}</td><td>${nf(KG)}</td></tr>`;
 const head=`<thead><tr><th>الصنف</th><th>المقاس</th><th>باليتات</th><th>رقم الباليت</th><th>الدرجة</th><th>كراتين</th><th>الوزن (كجم)</th></tr></thead>`;
 return {head,body}}
function detailTable(rows){const vs=varietiesOf(rows);let body='',i=0,N=0,KG=0;
 vs.forEach(g=>{let n=0,kg=0;body+=`<tr class="gh"><td colspan="11">${e(g.v)} — ${g.rows.length} باليت</td></tr>`;
  g.rows.forEach(r=>{n+=r._n;kg+=r._kg;N+=r._n;KG+=r._kg;body+=`<tr><td>${++i}</td><td class="pid" dir="ltr">${e(r.p)}</td><td class="sz">${sizeCell(r)}</td><td>${e(r.g)}</td><td>${e(r.c)}</td><td>${e(r.b)}</td><td>${e(r.pk)}</td><td>${e(r.loc)}</td><td>${r._n||''}</td><td>${nf(r._kg)||''}</td><td>${e(r.note)}</td></tr>`});
  body+=`<tr class="sub"><td class="r" colspan="8">إجمالي ${e(g.v)}</td><td>${n}</td><td>${nf(kg)}</td><td></td></tr>`});
 body+=`<tr class="gt"><td class="r" colspan="8">الإجمالي العام</td><td>${N}</td><td>${nf(KG)}</td><td></td></tr>`;
 const head=`<thead><tr><th>#</th><th>رقم الباليت</th><th>المقاس</th><th>الدرجة</th><th>نوع الكرتون</th><th>اسم الكرتون</th><th>التعبئة</th><th>التخزين</th><th>كراتين</th><th>وزن كجم</th><th>ملاحظات</th></tr></thead>`;
 return {head,body,P:rows.filter(r=>r.p).length}}
function cardsHTML(rows){const KG=rows.reduce((a,r)=>a+r._kg,0)||0;const vs=varietiesOf(rows);
 return `<div class="vc">${vs.map(g=>{const n=g.rows.reduce((a,r)=>a+r._n,0),kg=g.rows.reduce((a,r)=>a+r._kg,0);const word=g.rows.length===1?'باليت':'باليتات';return `<div><div class="vn">${e(g.v)}</div><div class="vs">${g.rows.length} ${word} · ${n.toLocaleString('en-US')} كرتونة · ${nf(kg)} كجم</div><div class="vp">${pct(kg,KG)} من الوزن</div></div>`}).join('')}</div>`}
function brk(title,m,tot){const ks=Object.keys(m).sort((a,b)=>m[b].n-m[a].n);
 const rows=ks.map(k=>`<tr><td class="r">${e(k)}</td><td>${m[k].p}</td><td>${m[k].n}</td><td>${nf(m[k].kg)}</td><td>${pct(m[k].n,tot)}</td></tr>`).join('');
 return `<div><h4><i></i>${e(title)}</h4><table><thead><tr><th>${e(title.replace('حسب ',''))}</th><th>باليتات</th><th>كراتين</th><th>وزن كجم</th><th>% كراتين</th></tr></thead><tbody>${rows}</tbody></table></div>`}
function sigHTML(d){return `<div class="sg"><div><div class="role">مهندس التشغيل</div><div class="name">${e(d.eng||'....................')}</div><div class="sigl">التوقيع: ....................</div></div><div class="dep"><img src="rashed_logo_gray.png" alt=""><span>يعتمد: شركة الراشد للتجارة</span></div></div>`}
function splitRows(html){const m=html.match(/<tr[\s\S]*?<\/tr>/g);return m||[]}
function isKeep(html){return /class="gh"/.test(html)}
window.PR={CSS,
html(d){return ''},
async pdf(d){
 const rows=(d.rows||[]).map(r=>({...r,_n:parseInt(r.n,10)||0,_kg:(parseInt(r.n,10)||0)*(parseFloat(r.w)||0)}));
 const dt=parts(d.date), N=rows.reduce((a,r)=>a+r._n,0), hasMix=rows.some(r=>r.s==='MIX');
 let st=document.getElementById('prstage');
 if(!st){st=document.createElement('div');st.id='prstage';st.style.cssText='position:fixed;left:-12000px;top:0;width:794px';document.body.appendChild(st)}
 if(!document.getElementById('prcss')){const s=document.createElement('style');s.id='prcss';s.textContent=CSS;document.head.appendChild(s)}
 st.innerHTML=mastHTML()+footHTML(1,1,d,dt)+'<div class="blk" id="prmeas"></div>';
 await document.fonts.ready;
 const meas=st.querySelector('#prmeas');
 const topH=st.querySelector('.chromeTop').offsetHeight;
 const footH=(()=>{const f=st.querySelector('.foot');const prev=f.style.position;f.style.position='relative';const h=f.offsetHeight;f.style.position=prev;return h})();
 const maxH=1123-topH-footH-14;
 const measure=html=>{meas.innerHTML=`<div class="blk">${html}</div>`;return Math.ceil(meas.firstElementChild.offsetHeight)};
 const measureRows=html=>{meas.innerHTML=`<table>${html}</table>`;return [...meas.querySelectorAll('tr')].map(tr=>Math.ceil(tr.offsetHeight))};
 const sum=summaryTable(rows,d.exp), det=detailTable(rows);
 const blocks=[];
 const pushHtml=html=>blocks.push({type:'html',html,h:0});
 pushHtml(introHTML(d,rows,dt));
 pushHtml(`<h4><i></i><span>(1) ملخص الإنتاج حسب الصنف والمقاس</span><small>— مرتب حسب المصدر ثم الصنف والمقاس</small></h4>`);
 blocks.push({type:'table',head:sum.head,rows:splitRows(sum.body),repeat:true});
 pushHtml(`<div class="note">لكل صنف ومقاس: عدد الباليتات وأرقامها وعدد الكراتين والوزن. إذا اجتمع أكثر من درجة في المقاس نفسه يُذكر عدد كراتين كل درجة بين قوسين.${hasMix?' الباليت MIX يبيّن عدد الكراتين لكل مقاس داخل نفس الباليت.':''}</div>`);
 pushHtml(cardsHTML(rows));
 blocks.push({type:'table',before:`<h4><i></i>(2) تفاصيل الباليتات حسب الصنف</h4>`,head:det.head,rows:splitRows(det.body),repeat:false});
 pushHtml(`<div class="note">الإجمالي العام هو مجموع إجماليات الأصناف (${rows.filter(r=>r.p).length} باليت).</div>`);
 pushHtml(`<div class="two">${brk('حسب الدرجة',grp(rows,'g'),N)}${brk('حسب نوع الكرتون',grp(rows,'c'),N)}</div>`);
 pushHtml(`<div class="two">${brk('حسب نوع التعبئة',grp(rows,'pk'),N)}${brk('حسب مكان التخزين',grp(rows,'loc'),N)}</div>`);
 pushHtml(sigHTML(d));
 blocks.forEach(b=>{if(b.type==='html')b.h=measure(b.html);else{b.beforeH=b.before?measure(b.before):0;b.hs=measureRows((b.head||'')+b.rows.join(''))}});
 const pages=[];let cur=[],h=0;
 const flush=()=>{if(cur.length)pages.push(cur);cur=[];h=0};
 function place(html,bh){if(h&&h+bh>maxH)flush();cur.push(html);h+=bh}
 for(const b of blocks){
  if(b.type==='html'){place(b.html,b.h);continue}
  const headH=b.hs[0]||0;let i=0;const rhs=b.hs.slice(1);
  if(!b.rows.length){place((b.before||'')+`<table>${b.head}</table>`,(b.beforeH||0)+headH);continue}
  while(i<b.rows.length){
   const lead=i===0?(b.before||''):'';const leadH=i===0?(b.beforeH||0):0;const showHead=i===0||b.repeat;
   let used=leadH+(showHead?headH:0);const slice=[];let guard=0;
   while(i<b.rows.length&&guard<500){guard++;
    const need=b.hs[i+1]+(isKeep(b.rows[i])&&i+1<b.rows.length?b.hs[i+2]||0:0);
    if(slice.length&&h+used+need>maxH)break;
    if(!slice.length&&h>0&&h+used+need>maxH){flush();break}
    slice.push(b.rows[i]);used+=b.hs[i+1];i++;
    if(!slice.length)break;
   }
   if(!slice.length)continue;
   cur.push(lead+`<table>${showHead?b.head:''}<tbody>${slice.join('')}</tbody></table>`);
   h+=used;
   if(i<b.rows.length)flush();
  }
 }
 flush();
 const total=pages.length||1;
 const nodes=[];
 (pages.length?pages:[[]]).forEach((chunks,idx)=>{
  const page=document.createElement('div');page.className='page';
  page.innerHTML=mastHTML()+`<div class="body">${chunks.join('')}</div>`+footHTML(idx+1,total,d,dt);
  st.appendChild(page);nodes.push(page);
 });
 meas.remove();st.querySelectorAll('.chromeTop,.foot').forEach((el,i)=>{if(!el.closest('.page'))el.remove()});
 await document.fonts.ready;
 await Promise.all([...st.querySelectorAll('img')].map(img=>img.complete&&img.naturalWidth?1:new Promise(r=>{img.onload=img.onerror=r})));
 const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4',compress:true});const W=595.28,H=841.89;
 for(let i=0;i<nodes.length;i++){
  const cv=await html2canvas(nodes[i],{scale:2,backgroundColor:'#fff',logging:false,width:794,height:1123,windowWidth:794});
  if(i)pdf.addPage();
  const ih=cv.height*W/cv.width;
  pdf.addImage(cv.toDataURL('image/jpeg',.92),'JPEG',0,0,W,Math.min(H,ih));
 }
 let emb='';if(d.aoa){const CT=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;CT[n]=c}const u=new TextEncoder().encode(JSON.stringify({v:1,app:'alola',kind:'prod',rows:d.aoa}));let o='';for(let i=0;i<u.length;i+=32768)o+=String.fromCharCode.apply(null,u.subarray(i,i+32768));const b=btoa(o);let c=~0;for(let i=0;i<b.length;i++)c=CT[(c^b.charCodeAt(i))&255]^(c>>>8);emb='ALOLADATA1:'+b+':'+((~c)>>>0).toString(16).padStart(8,'0');
  pdf.setPage(1);pdf.setFont('helvetica');pdf.setFontSize(2);const ls=emb.match(/.{1,400}/g)||[];ls.forEach((l,i)=>pdf.text(l,2,3+i*2.2,{renderingMode:'invisible'}))}
 const day=d.date||new Date().toISOString().slice(0,10);const title='تقرير تشغيل يوم '+day;
 pdf.setProperties({title,subject:title,keywords:emb,creator:'Al-Ola Production'});
 st.innerHTML='';return pdf.output('blob')}};
})();
