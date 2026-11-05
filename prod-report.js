/* Production report PDF v9 — A4, black & grey, matches quality report style */
(function(){
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const r1=x=>Math.round(x*10)/10, nf=x=>Number(r1(x)).toLocaleString('en-US');
const CSS=`@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-arabic.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200E}
@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-latin.woff2) format('woff2')}
#pr{width:794px;background:#fff;color:#111;font-family:Cairo,Tahoma,Arial,sans-serif;direction:rtl;padding:26px 30px 22px;box-sizing:border-box;font-size:11px;line-height:1.45;position:relative}
#pr .cd{position:absolute;top:6px;left:10px;font-size:8px;color:#bbb;direction:ltr;font-family:monospace}
#pr .hd{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #222;padding-bottom:6px}
#pr .hd .st{font-size:17px;font-weight:700}#pr .hd .sub{font-size:10px;color:#666}
#pr .hd img{height:44px;filter:grayscale(1)}
#pr h1{font-size:19px;text-align:center;margin:8px 0 6px;font-weight:700}
#pr .inf{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #999;margin-bottom:8px}
#pr .inf>div{padding:3px 7px;border-left:1px solid #ccc}#pr .inf>div:last-child{border-left:0}
#pr .inf small{display:block;color:#777;font-size:9px}#pr .inf b{font-size:12px}
#pr .k{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px}
#pr .k>div{border:1px solid #999;padding:5px 8px}#pr .k small{color:#666;font-size:9.5px}#pr .k b{display:block;font-size:20px}
#pr .ex{font-size:8.5px;color:#888;line-height:1.3}
#pr h4{font-size:12.5px;margin:9px 0 3px;border-bottom:1px solid #bbb;padding-bottom:1px}
#pr table{width:100%;border-collapse:collapse;font-size:10px}
#pr th{background:#e6e6e6;border:1px solid #888;padding:2px 3px;font-weight:700}
#pr td{border:1px solid #aaa;padding:1.5px 3px;text-align:center}
#pr tr.vh td{background:#f2f2f2;font-weight:700;text-align:right}
#pr tr.sb td{background:#fafafa;font-weight:700;color:#333}
#pr tr.gt td{background:#d9d9d9;font-weight:700}
#pr .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#pr .sg{display:flex;justify-content:space-between;margin-top:16px;font-size:11px}
#pr .ft{display:flex;justify-content:flex-end;align-items:center;gap:6px;margin-top:14px;font-size:10.5px;color:#333}#pr .ft img{height:22px;filter:grayscale(1)}`;
function grp(rows,key){const m={};rows.forEach(r=>{const k=r[key]||'غير محدد';m[k]=m[k]||{p:0,n:0,kg:0};m[k].p++;m[k].n+=r._n;m[k].kg+=r._kg});return m}
function brk(title,m,tot){const ks=Object.keys(m).sort((a,b)=>m[b].n-m[a].n);
 return `<div><h4>${title}</h4><table><tr><th>${title.replace('حسب ','')}</th><th>باليتات</th><th>كراتين</th><th>وزن كجم</th><th>% كراتين</th></tr>${ks.map(k=>`<tr><td>${e(k)}</td><td>${m[k].p}</td><td>${m[k].n}</td><td>${nf(m[k].kg)}</td><td>${tot?Math.round(m[k].n*1000/tot)/10:0}%</td></tr>`).join('')}</table></div>`}
function daySum(rows,dexp){const E={};rows.forEach(r=>{const x=r.exp||dexp||'العلا',v=r.v||'غير محدد',z=r.s||'—';((E[x]=E[x]||{})[v]=E[x][v]||{})[z]=(E[x][v][z]||[]);E[x][v][z].push(r)});
 const T=a=>({p:a.length,n:a.reduce((q,r)=>q+r._n,0),kg:a.reduce((q,r)=>q+r._kg,0)});let h='';
 Object.keys(E).forEach(x=>{const all=[];h+=`<tr class="gt"><td colspan="7" style="text-align:right">المُصدّر: ${e(x)}</td></tr>`;
  Object.keys(E[x]).sort((a,b)=>a.localeCompare(b,'ar')).forEach(v=>{const va=[];Object.keys(E[x][v]).sort((a,b)=>(parseFloat(a)||0)-(parseFloat(b)||0)).forEach(z=>{const g=E[x][v][z],t=T(g);va.push(...g);
   const gr={};g.forEach(r=>{const k=r.g||'—';gr[k]=(gr[k]||0)+r._n});
   h+=`<tr><td>${e(v)}</td><td>${e(z)}</td><td>${t.p}</td><td dir="ltr" style="font-size:8.5px;text-align:center">${g.map(r=>e(r.p)).join(' · ')}</td><td>${t.n}</td><td>${nf(t.kg)}</td><td>${Object.keys(gr).map(k=>e(k)+(Object.keys(gr).length>1?' ('+gr[k]+')':'')).join('، ')}</td></tr>`});
   const t=T(va);all.push(...va);h+=`<tr class="sb"><td colspan="2">إجمالي ${e(v)}</td><td>${t.p}</td><td></td><td>${t.n}</td><td>${nf(t.kg)}</td><td></td></tr>`});
  const t=T(all);h+=`<tr class="gt"><td colspan="2">إجمالي المُصدّر ${e(x)}</td><td>${t.p}</td><td></td><td>${t.n}</td><td>${nf(t.kg)}</td><td></td></tr>`});
 return `<h4>ملخص إنتاج اليوم — حسب المُصدّر ثم الصنف والمقاس</h4><table><tr><th style="width:12%">الصنف</th><th style="width:7%">المقاس</th><th style="width:7%">باليتات</th><th>أرقام الباليتات</th><th style="width:8%">كراتين</th><th style="width:10%">وزن كجم</th><th style="width:14%">الدرجة</th></tr>${h}</table><div class="ex">لكل صنف ومقاس: عدد الباليتات وأرقامها وعدد الكراتين والوزن؛ الدرجة بين قوسين = عدد كراتينها لو المقاس فيه أكتر من درجة.</div>`}
window.PR={CSS,html(d){
 const rows=d.rows.map(r=>({...r,_n:parseInt(r.n)||0,_kg:(parseInt(r.n)||0)*(parseFloat(r.w)||0)}));
 const N=rows.reduce((a,r)=>a+r._n,0),KG=rows.reduce((a,r)=>a+r._kg,0),P=rows.filter(r=>r.p).length;
 const vs={};rows.forEach(r=>{(vs[r.v||'غير محدد']=vs[r.v||'غير محدد']||[]).push(r)});
 let i=0;const body=Object.keys(vs).sort((a,b)=>a.localeCompare(b,'ar')).map(v=>{const g=vs[v];const n=g.reduce((a,r)=>a+r._n,0),kg=g.reduce((a,r)=>a+r._kg,0);
  return `<tr class="vh"><td colspan="11">${e(v)} — ${g.length} باليت</td></tr>`+g.map(r=>`<tr><td>${++i}</td><td dir="ltr">${e(r.p)}</td><td>${e(r.s)}</td><td>${e(r.g)}</td><td>${e(r.c)}</td><td>${e(r.b)}</td><td>${e(r.pk)}</td><td>${e(r.loc)}</td><td>${r._n||''}</td><td>${nf(r._kg)||''}</td><td>${e(r.note)}</td></tr>`).join('')+
  `<tr class="sb"><td colspan="8">إجمالي ${e(v)}</td><td>${n}</td><td>${nf(kg)}</td><td></td></tr>`}).join('');
 return `<div id="pr"><div class="cd">${e(d.code)}</div>
 <div class="hd"><div><div class="st">شركة العلا لفرز الحاصلات الزراعية</div><div class="sub">إدارة التشغيل — Al-Ola Agricultural Crops Sorting</div></div><img src="alola_logo.png"></div>
 <h1>تقرير الإنتاج اليومي</h1>
 <div class="inf"><div><small>التاريخ</small><b>${e(d.date)}</b></div><div><small>الوردية</small><b>${e(d.shift||'—')}</b></div>
 <div><small>مهندس التشغيل</small><b>${e(d.eng||'—')}</b><small style="margin-top:2px">المُصدّر: <b style="font-size:11px;color:#111">${e(d.exp||'العلا')}</b></small></div><div><small>وقت الإصدار</small><b>${e(d.at)}</b></div></div>
 <div class="k"><div><small>عدد الباليتات</small><b>${P}</b><div class="ex">كل الباليتات المسجلة في الوردية للمُصدّر ${e(d.exp||'العلا')}</div></div>
 <div><small>إجمالي الكراتين</small><b>${N.toLocaleString('en-US')}</b><div class="ex">مجموع عدد الكراتين على كل الباليتات</div></div>
 <div><small>إجمالي الوزن (كجم)</small><b>${nf(KG)}</b><div class="ex">الوزن = عدد الكراتين × وزن الكرتونة لكل باليت</div></div></div>
${daySum(rows,d.exp)}
 <h4>تفاصيل الباليتات حسب الصنف</h4>
 <table><tr><th>#</th><th>رقم الباليت</th><th>المقاس</th><th>الدرجة</th><th>نوع الكرتون</th><th>اسم الكرتون</th><th>التعبئة</th><th>التخزين</th><th>كراتين</th><th>وزن كجم</th><th>ملاحظات</th></tr>${body}
 <tr class="gt"><td colspan="8">الإجمالي العام</td><td>${N}</td><td>${nf(KG)}</td><td></td></tr></table>
 <div class="ex">الإجمالي العام = مجموع إجماليات الأصناف (${P} باليت).</div>
 <div class="two">${brk('حسب الدرجة',grp(rows,'g'),N)}${brk('حسب نوع الكرتون',grp(rows,'c'),N)}</div>
 <div class="two">${brk('حسب نوع التعبئة',grp(rows,'pk'),N)}${brk('حسب مكان التخزين',grp(rows,'loc'),N)}</div>
 <div class="sg"><span>مهندس التشغيل: ${e(d.eng||'....................')}</span><span>التوقيع: ....................</span></div>
 <div class="ft"><img src="rashed_logo_gray.png"><span>يعتمد: شركة الراشد للتجارة</span></div></div>`},
async pdf(d){let st=document.getElementById('prstage');if(!st){st=document.createElement('div');st.id='prstage';st.style.cssText='position:fixed;left:-10000px;top:0';document.body.appendChild(st);const s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s)}
 st.innerHTML=PR.html(d);await document.fonts.ready;await Promise.all([...st.querySelectorAll('img')].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r})));
 const node=st.firstElementChild,nr=node.getBoundingClientRect();const cuts=[...node.querySelectorAll('tr,h4,.two,.k,.inf,.sg,.ft,.ex')].map(el=>Math.round((el.getBoundingClientRect().bottom-nr.top+2)*2)).sort((x,y)=>x-y);
 const cv=await html2canvas(node,{scale:2,backgroundColor:'#fff',logging:false,windowWidth:794});
 const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4',compress:true});const W=595.28,H=841.89,pxH=Math.floor(cv.width*H/W);
 for(let y=0,pg=0,h;y<cv.height;y+=h,pg++){h=Math.min(pxH,cv.height-y);if(y+h<cv.height){const c2=cuts.filter(c=>c>y+pxH*0.5&&c<=y+pxH).pop();if(c2)h=c2-y}const c=document.createElement('canvas');c.width=cv.width;c.height=h;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,h);x.drawImage(cv,0,y,cv.width,h,0,0,cv.width,h);if(pg)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',.85),'JPEG',0,0,W,h*W/cv.width)}
 let emb='';if(d.aoa){const CT=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;CT[n]=c}const u=new TextEncoder().encode(JSON.stringify({v:1,app:'alola',kind:'prod',rows:d.aoa}));let o='';for(let i=0;i<u.length;i+=32768)o+=String.fromCharCode.apply(null,u.subarray(i,i+32768));const b=btoa(o);let c=~0;for(let i=0;i<b.length;i++)c=CT[(c^b.charCodeAt(i))&255]^(c>>>8);emb='ALOLADATA1:'+b+':'+((~c)>>>0).toString(16).padStart(8,'0');
  pdf.setPage(1);pdf.setFont('helvetica');pdf.setFontSize(2);const ls=emb.match(/.{1,400}/g);ls.forEach((l,i)=>pdf.text(l,2,3+i*2.2,{renderingMode:'invisible'}))}
 pdf.setProperties({title:'تقرير تشغيل يوم '+(d.date||''),subject:'تقرير تشغيل يوم '+(d.date||''),keywords:emb,creator:'Al-Ola Production'});st.innerHTML='';return pdf.output('blob')}};
})();
