/* Production report PDF v16 / v28 — جدول نسبة الصنف يسار والصادر والفرزة يمين + تحقق الخام > الصادر · v22 مربع توزيع المقاسات (شامل النواقص في نفس المقاس) ·  قرار من نظرة: ألوان هادية + ملخص وتنبيهات في الأول + جداول مضغوطة · v15 · v15: قسم النواقص (بواقي التشغيل بدون رقم باليت) + إجمالي باليتات + نواقص */
(function(){
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const expDisplay=x=>{const s=String(x??'').trim();if(!s)return 'العلا';return /ماجي|maggi/i.test(s)?'مصدر محفوظ':s};
const r1=x=>Math.round(x*10)/10, nf=x=>Number(r1(x)).toLocaleString('en-US');
const VORDER=['أبو سرة','صيفي','بلدي','موركيت كيني','موركيت إسباني','ليمون','كلمنتينا','فريمونت'];
const CSS=`#prstage .top2{display:block;margin:0 0 8px}#prstage .top2 .tmain{width:100%;min-width:0}#prstage .szrow{display:flex;gap:8px;align-items:stretch;margin:0 0 8px}#prstage .szrow .yb,#prstage .szrow .szb{flex:1;min-width:0;width:auto;margin:0}#prstage .top2 .k{margin:0}#prstage .top2 .inf{margin-bottom:6px}#prstage .inf.inf6{grid-template-columns:1fr .7fr 1.2fr .9fr 1.1fr .7fr}#prstage .yb{width:100%;flex:none;border:1px solid #d9dedb;border-radius:6px;padding:3px 6px 3px;background:#fbfcfb;font-size:8.6px;line-height:1.35}#prstage .yb table{width:100%;border-collapse:collapse;margin:0}#prstage .yb caption{text-align:right;font-weight:800;font-size:9.5px;color:#1f5f14;padding:0 0 2px}#prstage .yb th,#prstage .yb td{border:0;border-bottom:1px solid #eceeed;padding:1.5px 0;background:none;font-size:8.6px;text-align:right;white-space:nowrap}#prstage .yb th{color:#4b5563;font-weight:700}#prstage .yb td{text-align:left;font-weight:800;color:#1d2420;direction:rtl}#prstage .yb tr:last-child th,#prstage .yb tr:last-child td{border-bottom:0}#prstage .yb u{text-decoration:none;color:#6b7280;font-weight:700;font-size:7.5px}#prstage .yb .pc td{color:#1f8a12;font-size:10px}#prstage .yb .ws th,#prstage .yb .ws td,#prstage .yb .ws u,#prstage .yb .wsv{color:#c1121f}#prstage .yb .vr th,#prstage .yb .vr td{font-size:7.8px;font-weight:600}#prstage .yb .na{color:#b42318;font-weight:700}#prstage .ybf{font-size:7px;color:#6b7280;line-height:1.3;margin-top:2px;white-space:normal}@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-arabic.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200E}@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-latin.woff2) format('woff2')}#prstage .page{width:794px;height:1123px;background:#fff;color:#1d2420;font-family:Cairo,Tahoma,Arial,sans-serif;direction:rtl;position:relative;overflow:hidden;box-sizing:border-box}#prstage .chromeTop{background:#fff}#prstage .mast{display:flex;align-items:center;justify-content:space-between;padding:10px 22px 6px;min-height:62px;box-sizing:border-box}#prstage .mast .nm{font-size:15.5px;font-weight:800;color:#1f8a12;line-height:1.25}#prstage .mast .sub{font-size:9.5px;color:#6b7280;font-weight:600;margin-top:1px;direction:ltr;text-align:right}#prstage .mast img{height:48px;width:auto;display:block}#prstage .rule1{height:2px;background:#1f8a12}#prstage .rulegap,#prstage .rule2{display:none}#prstage .body{box-sizing:border-box;padding:8px 18px 0}#prstage .hd{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin:0 0 6px}#prstage .hd h1{margin:0;font-size:17px;line-height:1.2;color:#1d2420;font-weight:800}#prstage .hd h1 small{font-size:9px;color:#6b7280;font-weight:700;letter-spacing:.3px;margin-right:6px;direction:ltr;display:inline-block}#prstage .hd .ref{font-size:10.5px;color:#4b5563;text-align:left}#prstage .hd .ref b{color:#1d2420;font-weight:800}#prstage .inf{display:grid;grid-template-columns:1.1fr .8fr 1.3fr 1fr .8fr;border-top:1px solid #d9dedb;border-bottom:1px solid #d9dedb;margin-bottom:8px}#prstage .inf>div{padding:3px 6px;border-left:1px solid #eceeed;text-align:center;line-height:1.35}#prstage .inf>div:last-child{border-left:0}#prstage .inf small{display:block;color:#6b7280;font-size:9px}#prstage .inf b{font-size:11px;font-weight:800}#prstage .k{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:0 0 8px}#prstage .k>div{border:1px solid #d9dedb;border-radius:6px;padding:4px 6px 4px;text-align:center;background:#fff}#prstage .k>div.main{border-color:#1f8a12;border-width:1.5px}#prstage .k small{display:block;color:#4b5563;font-size:9.5px;font-weight:700}#prstage .k b{display:block;font-size:19px;color:#1d2420;font-weight:800;line-height:1.15;margin:1px 0 0}#prstage .k b u{text-decoration:none;font-size:10px;color:#6b7280;font-weight:700;margin-right:2px}#prstage .k .ex{font-size:8.5px;color:#6b7280;line-height:1.3}#prstage .k .warn b{color:#b45309}#prstage .fl{border:1px solid #d9dedb;border-radius:6px;padding:4px 8px 5px;margin:0 0 8px}#prstage .fl .ft{font-size:10.5px;font-weight:800;color:#1d2420;margin-bottom:1px}#prstage .fl .ft small{font-weight:600;color:#6b7280;font-size:9px}#prstage .fl ul{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;column-gap:14px}#prstage .fl li{font-size:10px;line-height:1.5;display:flex;gap:5px;align-items:baseline}#prstage .fl li i{width:7px;height:7px;border-radius:50%;flex:none;display:inline-block;transform:translateY(-1px)}#prstage .fl li.r i{background:#b91c1c}#prstage .fl li.a i{background:#d97706}#prstage .fl li.n i{background:#9ca3af}#prstage .fl li.ok i{background:#1f8a12}#prstage .fl li b{font-weight:800}#prstage .fl li.r b{color:#b91c1c}#prstage .fl li.a b{color:#b45309}#prstage .fl li span.pl{color:#4b5563;direction:ltr;unicode-bidi:isolate}#prstage h4{display:flex;align-items:baseline;gap:5px;font-size:11.5px;margin:7px 0 3px;color:#1d2420;font-weight:800}#prstage h4 i{width:3px;height:11px;background:#1f8a12;display:inline-block;flex:none;transform:translateY(1px)}#prstage h4 small{font-weight:600;color:#6b7280;font-size:9px}#prstage table{width:100%;border-collapse:collapse;font-size:10px;margin:0 0 3px}#prstage th{background:#f1f3f2;color:#1d2420;padding:2px 3px;font-weight:800;border:1px solid #d9dedb;border-bottom:1.5px solid #9aa39e;text-align:center;font-size:9.5px}#prstage td{border:1px solid #e3e6e4;padding:1.5px 3px;text-align:center;vertical-align:middle;background:#fff;line-height:1.4}#prstage td.r{text-align:right}#prstage td.pid{font-weight:800;color:#1d2420}#prstage td.pls{font-size:9px;color:#4b5563;text-align:center;line-height:1.35;word-break:break-word}#prstage td.gr{font-size:9px;color:#374151;line-height:1.35}#prstage td.qn{font-weight:700}#prstage td.bar{padding:1px 4px;white-space:nowrap;text-align:left}#prstage td.bar .bt{display:inline-block;width:58px;height:6px;background:#eceeed;vertical-align:middle;position:relative;overflow:hidden}#prstage td.bar .bf{position:absolute;left:0;top:0;bottom:0;background:#5aa34f}#prstage td.bar em{font-style:normal;font-size:9px;font-weight:700;color:#374151;display:inline-block;width:32px;text-align:left;vertical-align:middle;margin-left:3px}#prstage td.sz{font-weight:800;line-height:1.3}#prstage td.sz .mxt{font-weight:800;letter-spacing:.3px}#prstage td.sz .mx{display:block;font-size:9.5px;font-weight:700;color:#374151;line-height:1.4;margin-top:1px}#prstage td.sz .ml{white-space:normal}#prstage td.sz .szd{display:block;font-size:8px;font-weight:400;color:#8a8f8c;line-height:1.2;letter-spacing:0}#prstage td.bad{background:#fef2f2;color:#b91c1c;font-weight:800}#prstage td.lo{background:#fff7ed;color:#b45309;font-weight:800}#prstage table.det{table-layout:fixed;width:100%}#prstage table.det th:nth-child(1),#prstage table.det td:nth-child(1){width:4%}#prstage table.det th:nth-child(2),#prstage table.det td:nth-child(2){width:8%}#prstage table.det th:nth-child(3),#prstage table.det td:nth-child(3){width:19%}#prstage table.det th:nth-child(4),#prstage table.det td:nth-child(4){width:7%}#prstage table.det th:nth-child(5),#prstage table.det td:nth-child(5){width:12%}#prstage table.det th:nth-child(6),#prstage table.det td:nth-child(6){width:8%}#prstage table.det th:nth-child(7),#prstage table.det td:nth-child(7){width:7%}#prstage table.det th:nth-child(8),#prstage table.det td:nth-child(8){width:7%}#prstage table.det th:nth-child(9),#prstage table.det td:nth-child(9){width:6%}#prstage table.det th:nth-child(10),#prstage table.det td:nth-child(10){width:7%}#prstage table.det td.sz .szd{display:inline;white-space:nowrap;margin-right:5px}#prstage table.det td.sz{line-height:1.35}#prstage table.det td.sz .mx{display:block}#prstage table.det td.sz .ml{white-space:normal}#prstage table.det td.sz .mx .szd{display:block;margin:0;white-space:normal}#prstage table.det tbody tr:nth-child(even):not(.sub):not(.gt):not(.gh):not(.ntrow) td:not(.bad):not(.lo){background:#fafbfa}#prstage td.nt{text-align:right;vertical-align:top;padding:2px 4px;white-space:normal}#prstage td.nt .ntx{display:block;white-space:normal;overflow-wrap:anywhere;word-break:break-word;line-height:1.45;font-size:9.5px;font-weight:700;text-align:right}#prstage tr.ntrow td{text-align:right;background:#fafbfa;color:#1d2420;font-size:10px;font-weight:700;line-height:1.5;padding:3px 8px;white-space:normal;overflow-wrap:anywhere;word-break:break-word;vertical-align:top}#prstage tr.ntrow .ntl{color:#4b5563;font-weight:800}#prstage tr.sub td{background:#f1f3f2;font-weight:800;color:#1d2420;border-color:#d9dedb}#prstage tr.gt td{background:#e6ebe8;color:#111;font-weight:800;border-color:#c9cfcb;border-top:1.5px solid #6b7280}#prstage tr.gt.lf td{background:#fff;font-weight:700;color:#374151;border-top:1px solid #d9dedb}#prstage tr.gh td{background:#fff;color:#1f8a12;font-weight:800;text-align:right;border-color:#e3e6e4;font-size:10.5px}#prstage .note{font-size:8.5px;color:#6b7280;margin:1px 2px 5px;line-height:1.4}#prstage .two{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:2px}#prstage .two>div{min-width:0}#prstage .two h4{margin-top:4px}#prstage .sg{display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;padding:2px 8px 0}#prstage .role{color:#4b5563;font-weight:800;font-size:11px}#prstage .name{font-weight:800;font-size:13px;margin:2px 0 6px}#prstage .sigl{color:#333;font-size:11px}#prstage .dep{text-align:center}#prstage .dep img{height:40px;width:auto;display:block;margin:0 auto 2px}#prstage .dep span{font-size:10.5px;font-weight:800}#prstage .foot{position:absolute;left:0;right:0;bottom:0;background:#fff}#prstage .pmeta{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;padding:3px 18px 3px;font-size:9px;color:#374151}#prstage .pmeta span:nth-child(1){justify-self:start}#prstage .pmeta span:nth-child(2){text-align:center}#prstage .pmeta span:nth-child(3){justify-self:end}#prstage .co{border-top:2px solid #1f8a12;color:#4b5563;box-sizing:border-box;padding:4px 18px 8px;font-size:8.5px;line-height:1.5}#prstage .co .r{display:flex;justify-content:space-between;gap:12px;align-items:center}#prstage .co .ln{display:none}#prstage .blk{width:758px;font-family:Cairo,Tahoma,Arial,sans-serif;direction:rtl;color:#1d2420}#prstage .szb{border:1px solid #d9dedb;border-radius:6px;background:#fbfcfb;padding:5px 6px 6px;margin:0;font-size:9px;line-height:1.3}#prstage .szb .szt{font-weight:800;font-size:11px;color:#1f5f14;margin:0 0 4px}#prstage .szb .szt small{display:block;font-weight:600;color:#6b7280;font-size:7.5px;margin:1px 0 0}#prstage .szb table.sztbl{width:100%;border-collapse:collapse;margin:0;table-layout:fixed}#prstage .szb table.sztbl th,#prstage .szb table.sztbl td{border:1px solid #d9dedb;padding:3px 4px;font-size:9.5px;line-height:1.3;vertical-align:middle}#prstage .szb table.sztbl thead th{background:#eef1ee;color:#1d2420;font-weight:800;text-align:center;font-size:8.5px}#prstage .szb table.sztbl td.pk{text-align:right;font-weight:600;color:#1d2420;word-break:break-word}#prstage .szb table.sztbl td.sz,#prstage .szb table.sztbl td.qn,#prstage .szb table.sztbl td.pc{text-align:center;font-weight:700;font-variant-numeric:tabular-nums;direction:ltr;unicode-bidi:isolate}#prstage .szb table.sztbl td.pc{font-weight:800;color:#1f5f14}#prstage .szb table.sztbl tr.z td{background:#f4f6f4}#prstage .szb table.sztbl tr.szvr td{background:#e8ece9;font-weight:800;text-align:right;padding:3px 4px;border-color:#d0d5d1}#prstage .szb table.sztbl tr.szvr b{font-weight:800;color:#1d2420}#prstage .szb table.sztbl tr.szvr i{font-style:normal;font-weight:700;color:#1f5f14;float:left;direction:rtl;text-align:left;max-width:62%}#prstage .szb table.sztbl tr.szvr .szvl{font-weight:600;color:#4b5563;font-size:7.5px}#prstage .szb table.sztbl tr.szvr .szvp{font-weight:800;color:#1f5f14;direction:ltr;unicode-bidi:isolate;margin-right:3px;font-size:9px}#prstage .szb table.sztbl tr.szvr .szvs{display:block;font-weight:600;color:#6b7280;font-size:7.5px;margin-top:1px}#prstage .szb table.sztbl tr.szvt td{background:#f3f5f3;font-weight:800;color:#1d2420}#prstage .szb table.sztbl tr.szvt td:first-child{text-align:right}#prstage .szb table.sztbl tr.szvt td.qn,#prstage .szb table.sztbl tr.szvt td.pc{text-align:center}#prstage .szb table.sztbl tr.szvt td.pc{color:#1f5f14}#prstage .szb table.sztbl tr.szgt td{background:#eef1ee;font-weight:800;color:#1d2420;border-top:1.5px solid #c5ccc7}#prstage .szb table.sztbl tr.szgt td:first-child{text-align:right}#prstage .szb table.sztbl tr.szgt td.qn,#prstage .szb table.sztbl tr.szgt td.pc{text-align:center}#prstage .szb table.sztbl small.szkg{display:block;font-weight:500;color:#8a929b;font-size:7.5px;line-height:1.15;margin-top:1px}#prstage .szb table.sztbl small.szkh{display:block;font-weight:600;color:#8a929b;font-size:7px}#prstage .szb table.sztbl col.c1{width:36%}#prstage .szb table.sztbl col.c2{width:16%}#prstage .szb table.sztbl col.c3{width:26%}#prstage .szb table.sztbl col.c4{width:22%}#prstage .ybal{border:1px solid #f1d0d0;background:#fef8f8;color:#b91c1c;border-radius:4px;padding:3px 5px;font-size:7.4px;line-height:1.35;font-weight:700;margin-top:3px;white-space:normal}`;
function grp(rows,key){const m={};rows.forEach(r=>{const k=r[key]||'غير محدد';m[k]=m[k]||{p:0,n:0,kg:0};m[k].p++;m[k].n+=r._n;m[k].kg+=r._kg});return m}
function pct(n,tot){if(!tot)return '0%';const v=Math.round(n*1000/tot)/10;return (v%1?v.toFixed(1):String(v))+'%'}
function parts(iso){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||'');if(!m)return {iso:iso||'—',dmy:iso||'—',slash:iso||'—'};return {iso,dmy:m[3]+'/'+m[2]+'/'+m[1],slash:m[3]+'/'+m[2]+'/'+m[1]}}
function mixParts(r){return (Array.isArray(r.mix)?r.mix:[]).map(x=>{const s=String(x&&x.s||'').trim();const n=parseInt(x&&x.n,10);if(!s||s==='MIX'||!(n>0))return null;return {s,n}}).filter(Boolean)}
function szd(r,s){const A=typeof window!=='undefined'&&window.ALS;if(!A||!s||s==='MIX')return '';const g=A.groupOf(r.v);if(!g)return '';const pk=A.packOf(g,r.c,r.pk);const w=parseFloat(r.w)||0;const t=A.text(A.info(g,pk,s,pk&&pk.kg?(w||pk.kg):w),{short:1});return t?`<span class="szd">${e(t)}</span>`:''}
function sizeCell(r){if(r.s==='MIX'){const p=mixParts(r);const br=p.map(x=>`<div class="ml"><b dir="ltr">${e(x.s)} × ${x.n.toLocaleString('en-US')}</b> كرتونة${szd(r,x.s)}</div>`).join('');return '<div class="mxt">MIX</div>'+(br?`<div class="mx">${br}</div>`:'')}return e(r.s||'')+szd(r,r.s)}
function vRank(v){const i=VORDER.indexOf(v);return i<0?50:i}
function sRank(s){if(s==='MIX')return 10000;const n=parseFloat(s);return isNaN(n)?9999:n}
function varietiesOf(rows){const map=new Map();rows.forEach(r=>{const v=r.v||'غير محدد';if(!map.has(v))map.set(v,[]);map.get(v).push(r)});const list=[...map.entries()].map(([v,rs])=>({v,rows:rs}));list.sort((a,b)=>vRank(a.v)-vRank(b.v)||a.v.localeCompare(b.v,'ar'));list.forEach(g=>g.rows.sort((a,b)=>sRank(a.s)-sRank(b.s)||String(a.p).localeCompare(String(b.p),'en')));return list}
function byExp(rows,dexp){const map=new Map();rows.forEach(r=>{const x=expDisplay(r.exp||dexp||'العلا');if(!map.has(x))map.set(x,[]);map.get(x).push(r)});return [...map.entries()]}
function mastHTML(){return `<div class="chromeTop"><div class="mast"><div><div class="nm">شركة العلا لفرز الحاصلات الزراعية</div><div class="sub">Al Ola for Agricultural Crops Sorting</div></div><img src="alola_logo_green.png" alt=""></div><div class="rule1"></div><div class="rulegap"></div><div class="rule2"></div></div>`}
function footHTML(n,pages,d,dt){const center='تقرير الإنتاج اليومي — <span dir="ltr">'+e(dt.dmy)+'</span> — وردية '+e(d.shift||'—');return `<div class="foot"><div class="pmeta"><span dir="ltr">${e(d.code||'')}</span><span>${center}</span><span>صفحة ${n} من ${pages}</span></div><div class="co"><div class="r"><span>العنوان: قطعة رقم ٢٠٦ ورقم ٢٠٨ - حوض البطن رقم ٥ - ترسا - طوخ - قليوبية</span><span dir="ltr">E-mail: alola.co2023@gmail.com</span></div><div class="ln"></div><div class="r"><span dir="ltr">Tel: 013/2604937 | Fax: 013/2604938</span><span>ب.ض 206232 · س.ت 798-899-781</span></div></div></div>`}
const fmt=n=>Number(n||0).toLocaleString('en-US');
function median(a){if(!a.length)return 0;const s=[...a].sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2}
function plist(rs,max){const ps=rs.map(r=>String(r.p||'').trim()).filter(Boolean);max=max||8;return ps.length>max?ps.slice(0,max).join('، ')+' … +'+(ps.length-max):ps.join('، ')}
/* v16: تنبيهات تحتاج قرار — محسوبة من بيانات اليوم نفسه بس */
function flagsOf(rows,left){const out=[];const N=rows.reduce((a,r)=>a+r._n,0),LN=left.reduce((a,r)=>a+r._n,0);
 const noW=rows.filter(r=>r._n>0&&!(parseFloat(r.w)>0)),noN=rows.filter(r=>!(r._n>0));
 const miss=rows.filter(r=>!(String(r.v||'').trim()&&String(r.s||'').trim()&&String(r.g||'').trim()&&String(r.c||'').trim()));
 if(noW.length)out.push({t:'r',h:`${noW.length} باليت من غير وزن كرتونة`,d:'الوزن محسوب صفر — راجع الوزن',p:noW});
 if(noN.length)out.push({t:'r',h:`${noN.length} باليت من غير عدد كراتين`,d:'',p:noN});
 if(miss.length)out.push({t:'r',h:`${miss.length} باليت بيانات ناقصة`,d:'(الصنف/المقاس/الدرجة/الكرتون)',p:miss});
 const mixU=rows.filter(r=>r.s==='MIX'&&!mixParts(r).length);if(mixU.length)out.push({t:'a',h:`${mixU.length} باليت MIX من غير تفصيل المقاسات`,d:'',p:mixU});
 const mixBad=rows.filter(r=>{if(r.s!=='MIX')return false;const p=mixParts(r);return p.length&&p.reduce((a,x)=>a+x.n,0)!==r._n});if(mixBad.length)out.push({t:'a',h:`${mixBad.length} باليت MIX مجموع مقاساته مش مساوي عدد الكراتين`,d:'',p:mixBad});
 const byC={};rows.forEach(r=>{if(r._n>0){const k=r.c||'—';(byC[k]=byC[k]||[]).push(r._n)}});
 const short=rows.filter(r=>{const a=byC[r.c||'—']||[];const m=median(a);return a.length>=3&&m>=20&&r._n>0&&r._n<m*0.75});
 if(short.length)out.push({t:'a',h:`${short.length} باليت عدده أقل من المعتاد`,d:'(أقل من ٧٥% من المعتاد لنفس الكرتون)',p:short});
 if(LN){const pc=LN*100/(N+LN);out.push({t:pc>=5?'a':'n',h:`النواقص ${fmt(LN)} كرتونة = ${pct(LN,N+LN)} من الكراتين`,d:pc>=5?'نسبة عالية':'',p:[]})}
 const g2=rows.filter(r=>/ثان|تان/.test(r.g||'')).reduce((a,r)=>a+r._n,0);if(g2&&N){const pc=g2*100/N;out.push({t:pc>=20?'a':'n',h:`الدرجة الثانية ${pct(g2,N)} من كراتين الباليتات`,d:`(${fmt(g2)} كرتونة)`,p:[]})}
 const hall=rows.filter(r=>/صال/.test(r.loc||''));if(hall.length)out.push({t:'n',h:`${hall.length} باليت لسه في الصالة`,d:'',p:hall});
 const nl=rows.filter(r=>String(r.note||'').trim());if(nl.length)out.push({t:'n',h:`${nl.length} باليت عليها ملاحظات`,d:'(في جدول التفاصيل)',p:nl});
 const ord={r:0,a:1,n:2};out.sort((a,b)=>ord[a.t]-ord[b.t]);return out}
function flagsHTML(fl){const prob=fl.filter(f=>f.t!=='n').length;
 const li=fl.length?fl.map(f=>`<li class="${f.t}"><i></i><span><b>${e(f.h)}</b>${f.d?' '+e(f.d):''}${f.p&&f.p.length?` — <span class="pl">${e(plist(f.p,6))}</span>`:''}</span></li>`).join(''):`<li class="ok"><i></i><span>كل البيانات كاملة — مفيش ملاحظات</span></li>`;
 return `<div class="fl"><div class="ft">تنبيهات تحتاج قرار <small>— ${prob?prob+' محتاجة مراجعة (الأحمر أولاً)':'مفيش مشاكل'}</small></div><ul>${li}</ul></div>`}
/* v21: الصادر والفرزة — أوزان الكرتون الفاضي من برنامج المحطة (بيان التكلفة → «أوزان المهمات»)، والباليت 20 كجم (خشب + زوايا + كلبس + شنمر) */
const EMPTY_KG={'أوبن توب 7 ك':0.35,'مقفول صغير 7 ك':0.45,'مقفول 14 ك':0.8,'مقفول 15 ك':0.85},PALLET_KG=20;
const nrm=s=>String(s||'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/\s+/g,'');
function emptyKg(c){c=String(c||'').trim();if(EMPTY_KG[c]!=null)return EMPTY_KG[c];const n=nrm(c);for(const k in EMPTY_KG)if(nrm(k)===n)return EMPTY_KG[k];
 if(/15/.test(c))return 0.85;if(/14/.test(c))return 0.8;if(/صندوق|بلاست/.test(c))return 0.35;if(/اوبن|أوبن|open/i.test(c))return 0.35;if(/مقفول/.test(c))return 0.45;return null}
function yieldOf(d,rows,left){const vs=[];const by={};const add=(v)=>{v=v||'غير محدد';if(!by[v]){by[v]={v,gross:0,pal:0,empty:0,cart:0,unk:new Set()};vs.push(v)}return by[v]};
 rows.forEach(r=>{const o=add(r.v);o.gross+=r._kg;if(r.p)o.pal++;const k=emptyKg(r.c);o.cart+=r._n;if(k==null){if(r._n)o.unk.add(r.c||'—')}else o.empty+=r._n*k});
 left.forEach(r=>{const o=add(r.v);o.gross+=r._kg;const k=emptyKg(r.c);o.cart+=r._n;if(k==null){if(r._n)o.unk.add(r.c||'—')}else o.empty+=r._n*k});
 const raw=d.raw||{};const L=vs.map(v=>{const o=by[v];const net=o.gross-o.pal*PALLET_KG-o.empty;const rw=Number(raw[v])||0;return Object.assign(o,{net,raw:rw,exp:rw?net/rw:null,waste:rw?rw-net:null})});
 const T=L.reduce((a,o)=>({gross:a.gross+o.gross,pal:a.pal+o.pal,empty:a.empty+o.empty,net:a.net+o.net,raw:a.raw+o.raw,cart:a.cart+o.cart}),{gross:0,pal:0,empty:0,net:0,raw:0,cart:0});
 const allRaw=L.every(o=>o.raw>0);T.exp=allRaw&&T.raw?T.net/T.raw:null;T.waste=allRaw&&T.raw?T.raw-T.net:null;T.unk=[...new Set(L.flatMap(o=>[...o.unk]))];return {L,T}}
function prepYield(rows,left){const R=(rows||[]).map(r=>{const n=parseInt(r.n,10)||0,w=parseFloat(r.w)||0;const _n=(r._n!=null&&r._n!=='')?parseInt(r._n,10)||0:n;const _kg=(r._kg!=null&&r._kg!=='')?Number(r._kg):n*w;return Object.assign({},r,{_n,_kg})});
 const L=(Array.isArray(left)?left:[]).map(r=>{const n=parseInt(r.n,10)||0,w=parseFloat(r.w)||0;const _n=(r._n!=null&&r._n!=='')?parseInt(r._n,10)||0:n;const _w=(r._w!=null&&r._w!=='')?parseFloat(r._w)||0:w;const _kg=(r._kg!=null&&r._kg!=='')?Number(r._kg):_n*_w;return Object.assign({},r,{_n,_w,_kg})}).filter(r=>r._n>0||r.v||r.s);
 return {rows:R,left:L}}
function rawIssueMsg(x){const wasteTxt=x.waste<0?(nf(x.waste)+' كجم (بالسالب)'):(x.waste===0?'صفر':(nf(x.waste)+' كجم'));const who=x.v?('صنف '+x.v+' — '):'';return who+'كمية الخام الداخل لازم تكون أكبر من الصادر والهالك مع بعض. الخام '+nf(x.raw)+' كجم، الصادر (الصافي) '+nf(x.net)+' كجم، الهالك '+wasteTxt+'.'}
/* الهالك في البرنامج = الخام − صافي الصادر (مش مدخل منفصل). شرط «الخام > الصادر+الهالك» يتحقق عمليًا لما الخام يكون أكبر من الصادر (هالك بالموجب). لو الخام ≤ الصادر الهالك صفر أو بالسالب وده مخالف. */
function rawBalance(d,rows,left){const p=prepYield(rows,left);const y=yieldOf(d||{},p.rows,p.left);const issues=[];
 y.L.forEach(o=>{if(!(o.raw>0))return;const raw=r1(o.raw),net=r1(o.net),waste=r1(o.raw-o.net);if(raw<=net)issues.push({v:o.v,raw,net,waste,msg:rawIssueMsg({v:o.v,raw,net,waste})})});
 return {issues,y}}
const p1=x=>(Math.round(x*1000)/10).toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
function yieldHTML(d,rows,left){const p=prepYield(rows,left);const R=p.rows.filter(r=>r._n>0||r.p||r.v||r.s),Lf=p.left;if(!R.length&&!Lf.length)return '';const {L,T}=yieldOf(d||{},R,Lf);const many=L.length>1;
 const r=(k,v,cls)=>`<tr${cls?` class="${cls}"`:''}><th>${k}</th><td>${v}</td></tr>`;let h='';
 h+=r('الخام الداخل',T.raw?`${nf(T.raw)} <u>كجم</u>`:'<span class="na">مش مكتوب</span>');
 h+=r('صافي الصادر النهائي',`${nf(T.net)} <u>كجم</u>`,'net');
 h+=r('نسبة الصادر',T.exp!=null?p1(T.exp):'—','pc');
 h+=r('الفرزة بالهالك',T.waste!=null?`${nf(T.waste)} <u>كجم</u> · ${p1(T.waste/T.raw)}`:'—','ws');
 if(many)L.forEach(o=>{h+=`<tr class="vr"><th>${e(o.v)}</th><td>${o.raw?`${p1(o.exp)} صادر · <span class="wsv">${p1(o.waste/o.raw)} فرزة</span>`:'الخام مش مكتوب'}</td></tr>`});
 const fine=`الصافي = ${nf(T.gross)} قائم − ${T.pal} باليت × ${PALLET_KG} − كرتون فاضي ${nf(T.empty)}`+(T.unk.length?` · ⚠ وزن كرتون غير معروف: ${e(T.unk.join('، '))}`:'');
 const bal=(rawBalance(d||{},R,Lf).issues||[]);const warn=bal.length?`<div class="ybal">${bal.map(x=>e(x.msg)).join('<br>')}</div>`:'';
 return `<div class="yb"><table><caption>الصادر والفرزة</caption><tbody>${h}</tbody></table><div class="ybf">${fine}</div>${warn}</div>`}
function introHTML(d,rows,dt,left){left=left||[];const N=rows.reduce((a,r)=>a+r._n,0),KG=rows.reduce((a,r)=>a+r._kg,0),P=rows.filter(r=>r.p).length,exp=e(expDisplay(d.exp||'العلا'));const LN=left.reduce((a,r)=>a+r._n,0),LKG=left.reduce((a,r)=>a+r._kg,0),HL=left.length>0;
 const all=[...rows,...left],vs=varietiesOf(all),nS=new Set(all.map(r=>(r.v||'')+'|'+(r.s||''))).size,avg=P?Math.round(N/P):0;
 const fl=flagsOf(rows,left);const bal=rawBalance(d,rows,left);if(bal.issues.length)fl.unshift({t:'r',h:'الخام الداخل مش أكبر من الصادر والهالك',d:bal.issues.map(x=>x.msg).join(' ')});
 return `<div class="hd"><h1>تقرير الإنتاج اليومي<small>DAILY PRODUCTION REPORT</small></h1><div class="ref">الرقم المرجعي: <b dir="ltr">${e(d.code||'')}</b> · تحريراً في: <b dir="ltr">${e(dt.slash)}</b></div></div>
 <div class="top2"><div class="tmain"><div class="inf${d.sup?' inf6':''}"><div><small>التاريخ</small><b dir="ltr">${e(dt.slash)}</b></div><div><small>الوردية</small><b>${e(d.shift||'—')}</b></div><div><small>مهندس التشغيل</small><b>${e(d.eng||'—')}</b></div><div><small>المصدر</small><b>${exp}</b></div>${d.sup?`<div><small>المورد</small><b>${e(d.sup)}</b></div>`:''}<div><small>وقت الإصدار</small><b dir="ltr">${e(d.at||'—')}</b></div></div>
 <div class="k"><div class="main"><small>الباليتات</small><b>${P}</b><div class="ex">متوسط ${fmt(avg)} كرتونة/باليت</div></div>
 <div class="main"><small>إجمالي الكراتين</small><b>${fmt(N+LN)}</b><div class="ex">${HL?`باليتات ${fmt(N)} + نواقص ${fmt(LN)}`:'كله على باليتات'}</div></div>
 <div class="main"><small>صافي الوزن</small><b>${nf(KG+LKG)}<u>كجم</u></b><div class="ex">≈ ${(Math.round((KG+LKG)/100)/10).toLocaleString('en-US')} طن${HL?` · نواقص ${nf(LKG)} كجم`:''}</div></div>
 <div><small>الأصناف / المقاسات</small><b>${vs.length} <u>/</u> ${nS}</b><div class="ex">${e(vs.map(g=>g.v).slice(0,3).join('، '))}${vs.length>3?'…':''}</div></div>
 <div class="${HL&&LN*100/((N+LN)||1)>=5?'warn':''}"><small>النواقص</small><b>${fmt(LN)}</b><div class="ex">${HL?`كرتونة · ${nf(LKG)} كجم · ${pct(LN,N+LN)}`:'مفيش نواقص'}</div></div></div></div></div>${(function(){const yb=yieldHTML(d,rows,left),sz=sizeShareHTML(rows,left);return (yb||sz)?`<div class="szrow">${yb}${sz}</div>`:''})()}
 ${flagsHTML(fl)}`}
function leftTable(left){const m=new Map();left.forEach(r=>{const k=(r.v||'غير محدد')+'\u0001'+(r.s||'—');if(!m.has(k))m.set(k,{v:r.v||'غير محدد',s:r.s||'—',rows:[]});m.get(k).rows.push(r)});
 const gs=[...m.values()].sort((a,b)=>vRank(a.v)-vRank(b.v)||a.v.localeCompare(b.v,'ar')||sRank(a.s)-sRank(b.s)||String(a.s).localeCompare(String(b.s),'en'));
 let body='',i=0,N=0,KG=0;gs.forEach(g=>{let n=0,kg=0;g.rows.forEach(r=>{n+=r._n;kg+=r._kg;const note=String(r.note||'').trim();body+=`<tr><td>${++i}</td><td class="r">${e(r.v)}</td><td class="sz" dir="ltr">${e(r.s||'')}</td><td>${e(r.g)}</td><td>${e(r.c)}</td><td>${e(r.b)}</td><td>${e(r.pk)}</td><td class="qn${r._n?'':' bad'}">${r._n||'—'}</td><td${r._w?'':' class="bad"'}>${r._w?nf(r._w):'—'}</td><td class="qn">${r._kg?nf(r._kg):'—'}</td><td class="nt">${note?`<div class="ntx">${e(note)}</div>`:''}</td></tr>`});
  N+=n;KG+=kg;if(gs.length>1||g.rows.length>1)body+=`<tr class="sub"><td class="r" colspan="7">إجمالي ${e(g.v)} — مقاس <span dir="ltr">${e(g.s)}</span></td><td>${fmt(n)}</td><td></td><td>${nf(kg)}</td><td></td></tr>`});
 body+=`<tr class="gt"><td class="r" colspan="7">إجمالي النواقص (${gs.length} ${gs.length===1?'مقاس':'مقاسات'})</td><td>${fmt(N)}</td><td></td><td>${nf(KG)}</td><td></td></tr>`;
 const head=`<thead><tr><th>#</th><th>الصنف</th><th>المقاس</th><th>الدرجة</th><th>نوع الكرتون</th><th>اسم الكرتون</th><th>التعبئة</th><th>كراتين</th><th>وزن الكرتونة</th><th>وزن كجم</th><th>ملاحظات</th></tr></thead>`;
 return {head,body,N,KG}}
function gradeMix(rs){const m={};rs.forEach(r=>{const k=r.g||'—';m[k]=(m[k]||0)+r._n});const ks=Object.keys(m);return ks.length===1?e(ks[0]):ks.sort((a,b)=>m[b]-m[a]).map(k=>`${e(k)} ${fmt(m[k])}`).join(' · ')}
function barCell(kg,tot){const v=tot?kg*100/tot:0;return `<td class="bar" dir="ltr"><em>${pct(kg,tot)}</em><span class="bt"><span class="bf" style="width:${Math.max(1,Math.min(100,v)).toFixed(1)}%"></span></span></td>`}
/* v16: ملخص مجمّع — سطر لكل صنف × مقاس (الباليت MIX سطر لوحده) + أرقام الباليتات + الدرجات + نسبة الوزن */
function summaryTable(rows,dexp,hl,left){left=left||[];const exps=byExp(rows,dexp);const multi=exps.length>1;let body='',P=0,N=0,KG=0;const TKG=rows.reduce((a,r)=>a+r._kg,0)+left.reduce((a,r)=>a+r._kg,0);
 exps.forEach(([x,rs])=>{const vs=varietiesOf(rs);if(multi)body+=`<tr class="gh"><td colspan="8">المصدر: ${e(x)}</td></tr>`;
  vs.forEach(g=>{let n=0,kg=0;const gm=new Map();g.rows.forEach(r=>{const k=r.s==='MIX'?'MIX\u0001'+(r.p||Math.random()):String(r.s||'');if(!gm.has(k))gm.set(k,[]);gm.get(k).push(r)});
   [...gm.values()].forEach(rs2=>{const r0=rs2[0];const sn=rs2.reduce((a,r)=>a+r._n,0),sk=rs2.reduce((a,r)=>a+r._kg,0);n+=sn;kg+=sk;
    body+=`<tr><td class="r">${e(g.v)}</td><td class="sz">${sizeCell(r0)}</td><td class="qn">${rs2.length}</td><td class="pls" dir="ltr">${e(plist(rs2,14))}</td><td class="gr">${gradeMix(rs2)}</td><td class="qn">${fmt(sn)}</td><td class="qn">${nf(sk)}</td>${barCell(sk,TKG)}</tr>`});
   body+=`<tr class="sub"><td class="r" colspan="2">إجمالي ${e(g.v)}</td><td>${g.rows.length}</td><td></td><td class="gr">${gradeMix(g.rows)}</td><td>${fmt(n)}</td><td>${nf(kg)}</td>${barCell(kg,TKG)}</tr>`});
  const tn=rs.reduce((a,r)=>a+r._n,0),tkg=rs.reduce((a,r)=>a+r._kg,0);P+=rs.filter(r=>r.p).length;N+=tn;KG+=tkg;
  if(multi||!left.length)body+=`<tr class="gt"><td class="r" colspan="2">${multi?'إجمالي المصدر: '+e(x):(hl?'إجمالي الباليتات':'الإجمالي العام')}</td><td>${rs.filter(r=>r.p).length}</td><td></td><td></td><td>${fmt(tn)}</td><td>${nf(tkg)}</td>${barCell(tkg,TKG)}</tr>`});
 if(left.length){const LN=left.reduce((a,r)=>a+r._n,0),LKG=left.reduce((a,r)=>a+r._kg,0);
  body+=`<tr class="gt lf"><td class="r" colspan="2">إجمالي الباليتات</td><td>${P}</td><td></td><td></td><td>${fmt(N)}</td><td>${nf(KG)}</td>${barCell(KG,TKG)}</tr>`;
  body+=`<tr class="gt lf"><td class="r" colspan="2">+ النواقص (بواقي التشغيل)</td><td>—</td><td></td><td></td><td>${fmt(LN)}</td><td>${nf(LKG)}</td>${barCell(LKG,TKG)}</tr>`;
  body+=`<tr class="gt"><td class="r" colspan="2">الإجمالي العام</td><td>${P}</td><td></td><td></td><td>${fmt(N+LN)}</td><td>${nf(KG+LKG)}</td>${barCell(KG+LKG,TKG)}</tr>`}
 else if(multi)body+=`<tr class="gt"><td class="r" colspan="2">الإجمالي العام</td><td>${P}</td><td></td><td></td><td>${fmt(N)}</td><td>${nf(KG)}</td>${barCell(KG,TKG)}</tr>`;
 const head=`<thead><tr><th style="width:12%">الصنف</th><th style="width:15%">المقاس</th><th style="width:6%">باليتات</th><th>أرقام الباليتات</th><th style="width:14%">الدرجة (كراتين)</th><th style="width:8%">كراتين</th><th style="width:10%">الوزن كجم</th><th style="width:13%">% من الوزن</th></tr></thead>`;
 return {head,body}}
function detailTable(rows,hl){const vs=varietiesOf(rows);let body='',i=0,N=0,KG=0;const byC={};rows.forEach(r=>{if(r._n>0){const k=r.c||'—';(byC[k]=byC[k]||[]).push(r._n)}});const md={};Object.keys(byC).forEach(k=>md[k]=byC[k].length>=3?median(byC[k]):0);
 vs.forEach(g=>{let n=0,kg=0;body+=`<tr class="gh"><td colspan="11">${e(g.v)} — ${g.rows.length} باليت</td></tr>`;
  g.rows.forEach(r=>{n+=r._n;kg+=r._kg;N+=r._n;KG+=r._kg;const note=String(r.note||'').trim();const long=note.length>26;const m=md[r.c||'—']||0;const short=m>=20&&r._n>0&&r._n<m*0.75;const B=v=>String(v||'').trim()?'':' class="bad"';
   body+=`<tr${long?' data-keep="1"':''}><td>${++i}</td><td class="pid" dir="ltr">${e(r.p)}</td><td class="sz${String(r.s||'').trim()?'':' bad'}">${sizeCell(r)}</td><td${B(r.g)}>${e(r.g)}</td><td${B(r.c)}>${e(r.c)}</td><td>${e(r.b)}</td><td>${e(r.pk)}</td><td>${e(r.loc)}</td><td class="qn${!r._n?' bad':short?' lo':''}">${r._n||'—'}</td><td class="qn${parseFloat(r.w)>0?'':' bad'}">${r._kg?nf(r._kg):'—'}</td><td class="nt">${note&&!long?`<div class="ntx">${e(note)}</div>`:''}</td></tr>`;if(long)body+=`<tr class="ntrow"><td class="ntfull" colspan="11"><span class="ntl">ملاحظات ${e(r.p)}:</span> ${e(note)}</td></tr>`});
  body+=`<tr class="sub"><td class="r" colspan="8">إجمالي ${e(g.v)}</td><td>${fmt(n)}</td><td>${nf(kg)}</td><td></td></tr>`});
 body+=`<tr class="gt"><td class="r" colspan="8">${hl?'إجمالي الباليتات (من غير النواقص)':'الإجمالي العام'}</td><td>${fmt(N)}</td><td>${nf(KG)}</td><td></td></tr>`;
 const head=`<thead><tr><th>#</th><th>رقم الباليت</th><th>المقاس</th><th>الدرجة</th><th>نوع الكرتون</th><th>اسم الكرتون</th><th>التعبئة</th><th>التخزين</th><th>كراتين</th><th>وزن كجم</th><th>ملاحظات</th></tr></thead>`;
 return {head,body,P:rows.filter(r=>r.p).length}}
function cardsHTML(rows){return ''}
function brk(title,m,tot){const ks=Object.keys(m).sort((a,b)=>m[b].n-m[a].n);
 const rows=ks.map(k=>`<tr><td class="r">${e(k)}</td><td>${m[k].p}</td><td>${fmt(m[k].n)}</td><td>${nf(m[k].kg)}</td><td>${pct(m[k].n,tot)}</td></tr>`).join('');
 return `<div><h4><i></i>${e(title)}</h4><table><thead><tr><th>${e(title.replace('حسب ',''))}</th><th>باليتات</th><th>كراتين</th><th>وزن كجم</th><th>% كراتين</th></tr></thead><tbody>${rows}</tbody></table></div>`}
function sigHTML(d){return `<div class="sg"><div><div class="role">مهندس التشغيل</div><div class="name">${e(d.eng||'....................')}</div><div class="sigl">التوقيع: ....................</div></div><div class="dep"><img src="rashed_logo_gray.png" alt=""><span>يعتمد: شركة الراشد للتجارة</span></div></div>`}
function splitRows(html){const m=html.match(/<tr[\s\S]*?<\/tr>/g);return m||[]}
function isKeep(html){return /class="gh"/.test(html)||/data-keep="1"/.test(html)}
function utf16PdfHex(s){let h='FEFF';for(let i=0;i<s.length;i++)h+=s.charCodeAt(i).toString(16).toUpperCase().padStart(4,'0');return '<'+h+'>'}
function idxBytes(u8,s,from){const n=s.length;for(let i=from||0;i<=u8.length-n;i++){let ok=1;for(let j=0;j<n;j++)if(u8[i+j]!==s.charCodeAt(j)){ok=0;break}if(ok)return i}return -1}
function lastIdxBytes(u8,s){const n=s.length;for(let i=u8.length-n;i>=0;i--){let ok=1;for(let j=0;j<n;j++)if(u8[i+j]!==s.charCodeAt(j)){ok=0;break}if(ok)return i}return -1}
function asciiLen(s){return new TextEncoder().encode(s).length}
function spliceBytes(u8,at,remove,insert){const ins=typeof insert==='string'?new TextEncoder().encode(insert):insert;const out=new Uint8Array(u8.length-remove+ins.length);out.set(u8.subarray(0,at),0);out.set(ins,at);out.set(u8.subarray(at+remove),at+ins.length);return out}
function literalSpan(u8,key){const at=idxBytes(u8,key);if(at<0)return null;let i=at+key.length;if(u8[i]!==0x28)return null;const lit=i;i++;while(i<u8.length){if(u8[i]===0x5c){i+=2;continue}if(u8[i]===0x29)break;i++}if(u8[i]!==0x29)return null;return {at:lit,remove:i+1-lit}}
function patchPdfTitle(buf,title){let u8=buf instanceof Uint8Array?buf:new Uint8Array(buf);const hex=utf16PdfHex(title);const cuts=[];for(const key of ['/Title ','/Subject ']){const hit=literalSpan(u8,key);if(hit)cuts.push({at:hit.at,remove:hit.remove,insert:hex})}const cat=idxBytes(u8,'/Type /Catalog');if(cat>=0&&idxBytes(u8,'/DisplayDocTitle')<0)cuts.push({at:cat+'/Type /Catalog'.length,remove:0,insert:' /ViewerPreferences <</DisplayDocTitle true>>'});if(!cuts.length)return u8;cuts.sort((a,b)=>a.at-b.at);const growth=off=>cuts.reduce((g,c)=>c.at<off?g+asciiLen(c.insert)-c.remove:g,0);const orig=u8;for(let i=cuts.length-1;i>=0;i--)u8=spliceBytes(u8,cuts[i].at,cuts[i].remove,cuts[i].insert);const sx=lastIdxBytes(orig,'startxref');if(sx<0)return orig;let p=sx+'startxref'.length;if(orig[p]===10||orig[p]===13)p++;let q=p;while(q<orig.length&&orig[q]>=48&&orig[q]<=57)q++;const xrefOld=parseInt(String.fromCharCode.apply(null,orig.subarray(p,q)),10);if(!xrefOld)return orig;const xrefAt=xrefOld+growth(xrefOld);const head='xref\n';if(idxBytes(u8,head,xrefAt)!==xrefAt)return orig;let i=xrefAt+head.length;const readLine=()=>{const a=i;while(i<u8.length&&u8[i]!==10&&u8[i]!==13)i++;const s=String.fromCharCode.apply(null,u8.subarray(a,i));if(u8[i]===13)i++;if(u8[i]===10)i++;return s};let guard=0;while(guard++<8){const sub=readLine();const m=/^(\d+)\s+(\d+)$/.exec(sub);if(!m)break;const count=+m[2];for(let n=0;n<count;n++){const entAt=i;const ent=readLine();const em=/^(\d{10}) (\d{5}) ([nf])/.exec(ent);if(!em||em[3]!=='n')continue;const off=+em[1];const shifted=off+growth(off);const digits=String(shifted).padStart(10,'0');for(let k=0;k<10;k++)u8[entAt+k]=digits.charCodeAt(k)}}const sxNew=lastIdxBytes(u8,'startxref');if(sxNew<0)return u8;let a=sxNew+'startxref'.length;if(u8[a]===10||u8[a]===13)a++;let b=a;while(b<u8.length&&u8[b]>=48&&u8[b]<=57)b++;const num=String(xrefAt);if(b-a===num.length){for(let k=0;k<num.length;k++)u8[a+k]=num.charCodeAt(k);return u8}return spliceBytes(u8,a,b-a,num)}

/* === size-share: each variety's size % is of THAT variety's WEIGHT (was cartons until 2026-11-25) (1 decimal, largest-remainder, sums to 100% per variety). Leftovers fold into the same variety+pack+size. Mandarin sub-varieties (كلمنتينا/فريمونت/موركيت/يوسف) appear as one «أفندي» block; أبو سرة / صيفي / بلدي / ليمون stay separate. Variety header shows share of total production. Does not change yield or other totals. === */
const SZVORDER=['أبو سرة','صيفي','بلدي','ليمون','أفندي','كلمنتينا','فريمونت','موركيت كيني','موركيت إسباني'];
function szvRank(v){const i=SZVORDER.indexOf(v);return i<0?80:i}
function packKg(c){const m=String(c||'').match(/(\d+(?:\.\d+)?)/);return m?+m[1]:999}
function cntOf(r){if(!r)return 0;if(r._n!=null&&r._n!==''){const n=parseInt(r._n,10);return n>0?n:0}const n=parseInt(r.n,10);return n>0?n:0}
function mixOf(r){return mixParts(r)}
function sharePercents(counts){const tot=counts.reduce((a,b)=>a+b,0);if(!tot)return counts.map(()=>0);const exact=counts.map(n=>n*1000/tot);const floored=exact.map(x=>Math.floor(x+1e-9));let rem=1000-floored.reduce((a,b)=>a+b,0);const ord=exact.map((x,i)=>({i,frac:x-floored[i],n:counts[i]})).sort((a,b)=>b.frac-a.frac||b.n-a.n||a.i-b.i);const out=floored.slice();if(rem>0){for(let k=0;k<ord.length&&rem>0;k++,rem--)out[ord[k].i]++}else if(rem<0){const rev=[...ord].reverse();for(let k=0;k<rev.length&&rem<0;k++){if(out[rev[k].i]>0){out[rev[k].i]--;rem++}}}return out.map(x=>x/10)}
const MAND_RE=/موركيت|موركوت|مركوت|كلمنت|كليمنت|فريمونت|فرمونت|أفندي|افندي|يوسف|murcott|clement|fremont|mandarin|\bmand\b/i;
function shareFamily(v){const s=String(v||'').trim()||'غير محدد';const A=typeof window!=='undefined'&&window.ALS;if(A&&typeof A.groupOf==='function'&&A.groupOf(s)==='mand')return 'أفندي';if(MAND_RE.test(s))return 'أفندي';return s}
/* weight-based (2026-11-25, Amir): count stays, approx kg under it, % = size kg / variety kg.
   kg per carton: the row's own carton weight → else the median carton weight of the same variety + carton name in this report
   → else the variety's average kg/carton → else (no weight at all in that variety) the % falls back to cartons for that variety only.
   Estimated weights are marked «*». */
function wParse(v){/* same rule as the entry screen (wNum + wOk): plain number, 0 < kg < 100; a red/invalid weight (7150, «7 + 1500 جم», text) counts as missing → estimated */let n;if(typeof v==='number')n=v;else{const t=String(v==null?'':v).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/\s/g,'').replace(/[٫,،]/g,'.');if(!/^(\d+\.?\d*|\.\d+)$/.test(t))return 0;n=parseFloat(t)}return isFinite(n)&&n>0&&n<100?n:0}
function rowW(r){if(!r)return 0;if(r._w!=null&&r._w!=='')return wParse(r._w);return wParse(r.w)}
function sizeShare(rows,left){const bag=new Map();const items=[];
 const add=(r,s,n)=>{n=parseInt(n,10)||0;if(!(n>0))return;const src=String((r&&r.v)||'').trim()||'غير محدد';const v=shareFamily(src);const c=String((r&&r.c)||'').trim()||String((r&&r.pk)||'').trim()||'غير محدد';s=String(s||'').trim()||'غير محدد';items.push({v,c,s,n,w:rowW(r),src})};
 (rows||[]).forEach(r=>{if(!r)return;if(String(r.s||'')==='MIX'){const p=mixOf(r);if(p.length)p.forEach(x=>add(r,x.s,x.n));else add(r,'MIX (من غير تفصيل)',cntOf(r))}else add(r,r.s,cntOf(r))});
 (left||[]).forEach(r=>{if(r)add(r,r.s,cntOf(r))});
 const med=a=>{const t=[...a].sort((x,y)=>x-y),m=t.length>>1;return t.length?(t.length%2?t[m]:(t[m-1]+t[m])/2):0};
 const byVC={},byV={};items.forEach(it=>{if(it.w>0){(byVC[it.v+'\u0001'+it.c]=byVC[it.v+'\u0001'+it.c]||[]).push(it.w);const o=byV[it.v]=byV[it.v]||{n:0,kg:0};o.n+=it.n;o.kg+=it.n*it.w}});
 items.forEach(it=>{if(it.w>0){it.kg=it.n*it.w;it.est=false;return}const m=med(byVC[it.v+'\u0001'+it.c]||[]);const av=byV[it.v]&&byV[it.v].n?byV[it.v].kg/byV[it.v].n:0;const w=m||av;it.kg=w?it.n*w:0;it.est=true;it.now=!w});
 items.forEach(it=>{const gk=it.v+'\u0001'+it.c;if(!bag.has(gk))bag.set(gk,{v:it.v,c:it.c,sizes:new Map(),sources:[]});const g=bag.get(gk);const x=g.sizes.get(it.s)||{n:0,kg:0,est:false,now:false};x.n+=it.n;x.kg+=it.kg;x.est=x.est||it.est;x.now=x.now||it.now;g.sizes.set(it.s,x);if(it.src&&!g.sources.includes(it.src))g.sources.push(it.src)});
 const groups=[...bag.values()].map(g=>{const sizes=[...g.sizes.entries()].map(([s,x])=>({s,n:x.n,kg:x.kg,est:x.est,now:x.now})).sort((a,b)=>sRank(a.s)-sRank(b.s)||String(a.s).localeCompare(String(b.s),'en'));const sources=g.sources.slice().sort((a,b)=>szvRank(a)-szvRank(b)||a.localeCompare(b,'ar'));return {v:g.v,c:g.c,sizes,n:sizes.reduce((a,x)=>a+x.n,0),kg:sizes.reduce((a,x)=>a+x.kg,0),sources}}).sort((a,b)=>szvRank(a.v)-szvRank(b.v)||a.v.localeCompare(b.v,'ar')||packKg(a.c)-packKg(b.c)||a.c.localeCompare(b.c,'ar'));
 const byVar=new Map();groups.forEach(g=>{if(!byVar.has(g.v))byVar.set(g.v,{v:g.v,n:0,kg:0,packs:[],sources:[]});const o=byVar.get(g.v);o.n+=g.n;o.kg+=g.kg;o.packs.push(g);g.sources.forEach(s=>{if(!o.sources.includes(s))o.sources.push(s)})});
 const vars=[];groups.forEach(g=>{if(!vars.some(x=>x.v===g.v))vars.push(byVar.get(g.v))});
 vars.forEach(o=>{const lines=o.packs.flatMap(g=>g.sizes);o.byCount=!(o.kg>0)||lines.some(s=>s.now);const pcts=sharePercents(lines.map(s=>o.byCount?s.n:Math.round(s.kg*1000)));lines.forEach((s,i)=>{s.pct=pcts[i]});o.est=lines.some(s=>s.est&&!s.now);o.sources.sort((a,b)=>szvRank(a)-szvRank(b)||a.localeCompare(b,'ar'))});
 const allKg=vars.every(o=>!o.byCount);const prodPcts=sharePercents(vars.map(o=>allKg?Math.round(o.kg*1000):o.n));vars.forEach((o,i)=>{o.prodPct=prodPcts[i]});
 const tot=groups.reduce((a,g)=>a+g.n,0),totKg=groups.reduce((a,g)=>a+g.kg,0);return {groups,vars,tot,totKg,allKg,empty:!tot}}
function pct1(p){return Number(p).toFixed(1)+'%'}
function kgTxt(kg,est){return kg>0?`<small class="szkg" dir="rtl">≈ ${fmt(Math.round(kg))} كجم${est?'*':''}</small>`:'<small class="szkg" dir="rtl">— كجم</small>'}
function sizeShareHTML(rows,left){const d=sizeShare(rows,left);if(d.empty)return '';let zi=0,body='';const anyEst=d.vars.some(o=>o.est),anyCnt=d.vars.some(o=>o.byCount);
 (d.vars||[]).forEach(o=>{const src=(o.sources||[]).filter(s=>s&&s!==o.v);const srcHtml=src.length?`<small class="szvs">${src.map(e).join('، ')}</small>`:'';
  body+=`<tr class="szvr"><td colspan="4"><b>${e(o.v)}</b>${srcHtml}<i><span class="szvl">نسبة الصنف من الإنتاج${d.allKg?' (بالوزن)':''}</span> <span class="szvp" dir="ltr">${pct1(o.prodPct)}</span></i></td></tr>`;
  o.packs.forEach(g=>{g.sizes.forEach((s,si)=>{const zebra=((zi++)%2)?' z':'';const pk=si===0?e(g.c):'';body+=`<tr class="${zebra.trim()}"><td class="pk">${pk}</td><td class="sz" dir="ltr">${e(s.s)}</td><td class="qn" dir="ltr">${fmt(s.n)}${kgTxt(s.kg,s.est)}</td><td class="pc" dir="ltr">${pct1(s.pct)}</td></tr>`})});
  body+=`<tr class="szvt"><td colspan="2">إجمالي ${e(o.v)}${o.byCount?' <small class="szkg">(النسبة بالعدد — مفيش وزن)</small>':''}</td><td class="qn" dir="ltr">${fmt(o.n)}${kgTxt(o.kg,o.est)}</td><td class="pc" dir="ltr">100.0%</td></tr>`});
 const note=(anyEst?' — * وزن تقريبي: سطر من غير وزن كرتونة اتحسب بوزن نفس الكرتونة في التقرير':'')+(anyCnt?' — صنف من غير أوزان نسبته بالعدد':'');
 return `<div class="szb"><div class="szt">نسبة المقاسات داخل كل صنف <small>النسبة = نصيب المقاس من <b>وزن</b> نفس الصنف (عدد الكراتين × وزن الكرتونة)، ومجموع المقاسات 100% لكل صنف — العدد زي ما هو والوزن التقريبي تحته — شامل النواقص في نفس المقاس والعبوة${note}</small></div><table class="sztbl"><colgroup><col class="c1"><col class="c2"><col class="c3"><col class="c4"></colgroup><thead><tr><th>العبوة</th><th>المقاس</th><th>عدد الكراتين<small class="szkh">الوزن التقريبي</small></th><th>النسبة (بالوزن)</th></tr></thead><tbody>${body}<tr class="szgt"><td colspan="2">الإجمالي العام</td><td class="qn" dir="ltr">${fmt(d.tot)}${kgTxt(d.totKg,anyEst)}</td><td class="pc" dir="ltr"></td></tr></tbody></table></div>`}
/* === /size-share === */
window.PR={CSS,sizeShare,sizeShareHTML,yieldOf,yieldHTML,rawBalance,introHTML,prepYield,
html(d){return ''},
async pdf(d){
 const rows=(d.rows||[]).map(r=>({...r,_n:parseInt(r.n,10)||0,_kg:(parseInt(r.n,10)||0)*(parseFloat(r.w)||0)}));
 const left=(Array.isArray(d.left)?d.left:[]).map(r=>{const n=parseInt(r.n,10)||0,w=parseFloat(r.w)||0;return {...r,_n:n,_w:w,_kg:n*w}}).filter(r=>r._n>0||r.v||r.s);
 const hasRows=rows.length>0, hasLeft=left.length>0;
 const dt=parts(d.date), N=rows.reduce((a,r)=>a+r._n,0), hasMix=rows.some(r=>r.s==='MIX');
 let st=document.getElementById('prstage');
 if(!st){st=document.createElement('div');st.id='prstage';st.style.cssText='position:fixed;left:-12000px;top:0;width:794px';document.body.appendChild(st)}
 if(!document.getElementById('prcss')){const s=document.createElement('style');s.id='prcss';s.textContent=CSS;document.head.appendChild(s)}
 st.innerHTML=mastHTML()+footHTML(1,1,d,dt)+'<div class="blk" id="prmeas"></div>';
 const imgsReady=root=>Promise.all([...root.querySelectorAll('img')].map(img=>img.complete&&img.naturalWidth?1:new Promise(r=>{img.onload=img.onerror=r;setTimeout(r,4000)})));
 await document.fonts.ready;await imgsReady(st);
 const meas=st.querySelector('#prmeas');
 const topH=st.querySelector('.chromeTop').offsetHeight;
 const footH=(()=>{const f=st.querySelector('.foot');const prev=f.style.position;f.style.position='relative';const h=f.offsetHeight;f.style.position=prev;return h})();
 const maxH=1123-topH-footH-14;
 const measure=html=>{meas.innerHTML=`<div class="blk" style="display:flow-root">${html}</div>`;return Math.ceil(meas.firstElementChild.offsetHeight)};
 const measureRows=(html,cls)=>{meas.innerHTML=`<table class="${cls||''}">${html}</table>`;return [...meas.querySelectorAll('tr')].map(tr=>Math.ceil(tr.offsetHeight))};
 const sum=summaryTable(rows,d.exp,left.length>0,left), det=detailTable(rows,left.length>0);
 const blocks=[];
 const pushHtml=html=>blocks.push({type:'html',html,h:0});
 pushHtml(introHTML(d,rows,dt,left));
 if(hasRows){
 pushHtml(`<h4><i></i><span>(1) ملخص الإنتاج حسب الصنف والمقاس</span><small>— الباليت MIX في سطر لوحده · النسبة من إجمالي الوزن${hasLeft?' (شامل النواقص)':''}</small></h4>`);
 blocks.push({type:'table',head:sum.head,rows:splitRows(sum.body),repeat:true});
 pushHtml(`<div class="note">تحت كل مقاس بخط خفيف: القطر من جدول المقاسات ووزن الحبة التقريبي (وزن العبوة ÷ العدد)، و«≈» = تقريبي لعبوات 7 ك والأفندي.${hasMix?' الباليت MIX يبيّن عدد الكراتين لكل مقاس داخل نفس الباليت.':''} الدرجة: عدد الكراتين لكل درجة لو اجتمع أكتر من درجة.</div>`);
 pushHtml(`<div class="two">${brk('حسب الدرجة',grp(rows,'g'),N)}${brk('حسب نوع الكرتون',grp(rows,'c'),N)}${brk('حسب نوع التعبئة',grp(rows,'pk'),N)}${brk('حسب مكان التخزين',grp(rows,'loc'),N)}</div>`);
  blocks.push({type:'table',tableClass:'det',before:`<h4><i></i>(2) تفاصيل الباليتات حسب الصنف<small>— الأحمر = بيان ناقص · البرتقالي = عدد أقل من المعتاد لنفس الكرتون</small></h4>`,head:det.head,rows:splitRows(det.body),repeat:true});
 pushHtml(`<div class="note">${hasLeft?'إجمالي الباليتات':'الإجمالي العام'} هو مجموع إجماليات الأصناف (${rows.filter(r=>r.p).length} باليت).${hasLeft?' النواقص في القسم (3) والإجمالي العام (باليتات + نواقص) في الملخص أول التقرير.':''}</div>`);
 }
 if(hasLeft){const lt=leftTable(left);
  blocks.push({type:'table',tableClass:'det lft',before:`<h4><i style="background:#d97706"></i>${hasRows?'(3) ':'(1) '}النواقص — بواقي التشغيل بدون رقم باليت<small>— حسب الصنف والمقاس</small></h4>`,head:lt.head,rows:splitRows(lt.body),repeat:true});
  pushHtml(`<div class="note">النواقص = كراتين متبقية في آخر التشغيل ما اتقفلتش على باليت، فمالهاش رقم باليت. إجمالي النواقص: ${lt.N.toLocaleString('en-US')} كرتونة — ${nf(lt.KG)} كجم${hasRows?' (محسوبة في الإجمالي العام أعلى التقرير مع الباليتات)':''}.</div>`)}
 pushHtml(sigHTML(d));
 blocks.forEach(b=>{if(b.type==='html')b.h=measure(b.html);else{b.beforeH=b.before?measure(b.before):0;b.hs=measureRows((b.head||'')+b.rows.join(''),b.tableClass)}});
 const pages=[];let cur=[],h=0;
 const flush=()=>{if(cur.length)pages.push(cur);cur=[];h=0};
 function place(html,bh,bi){if(h&&h+bh>maxH)flush();cur.push(`<div class="chk" data-b="${bi}">${html}</div>`);h+=bh}
 for(const [bi,b] of blocks.entries()){
  if(b.type==='html'){place(b.html,b.h,bi);continue}
  const headH=b.hs[0]||0;let i=0;const rhs=b.hs.slice(1);
  if(!b.rows.length){place((b.before||'')+`<table>${b.head}</table>`,(b.beforeH||0)+headH,bi);continue}
  while(i<b.rows.length){
   const lead=i===0?(b.before||''):'';const leadH=i===0?(b.beforeH||0):0;const showHead=i===0||b.repeat;
   let used=leadH+(showHead?headH:0);const slice=[];let guard=0;
   while(i<b.rows.length&&guard<500){guard++;
    let extra=0;if(isKeep(b.rows[i])&&i+1<b.rows.length){extra+=b.hs[i+2]||0;if(isKeep(b.rows[i+1])&&i+2<b.rows.length)extra+=b.hs[i+3]||0}const need=(b.hs[i+1]||0)+extra;
    if(slice.length&&h+used+need>maxH)break;
    if(!slice.length&&h>0&&h+used+need>maxH){flush();break}
    slice.push(b.rows[i]);used+=b.hs[i+1];i++;
    if(!slice.length)break;
   }
   if(!slice.length)continue;
   cur.push(`<div class="chk" data-b="${bi}" data-t="1">`+lead+`<table class="${b.tableClass||''}">${showHead?b.head:''}<tbody>${slice.join('')}</tbody></table></div>`);
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
 await document.fonts.ready;await imgsReady(st);
 // v20: the estimate above can be short (margins, iPhone fonts). Check the real layout and move anything that would be hidden under the footer to the next page — no row can ever be cut off.
 const mkPage=()=>{const page=document.createElement('div');page.className='page';page.innerHTML=mastHTML()+'<div class="body"></div>'+footHTML(1,1,d,dt);return page};
 const overflow=pg=>{const bd=pg.querySelector('.body'),ft=pg.querySelector('.foot');const lc=bd.lastElementChild;if(!lc)return false;return lc.getBoundingClientRect().bottom>ft.getBoundingClientRect().top-2};
 const nextBody=k=>{if(!nodes[k+1]){const np=mkPage();nodes[k].after(np);nodes.splice(k+1,0,np)}return nodes[k+1].querySelector('.body')};
 const tblRows=ch=>{const tb=ch.querySelector('table>tbody');return tb?[...tb.children]:[]};
 const keepTr=tr=>!!tr&&(tr.classList.contains('gh')||tr.getAttribute('data-keep')==='1');
 /* v29: the same check runs again after the fonts and logos finish loading — a late font can make a block taller (WebKit: the last pallet row ended up 12px under the footer) */
 const fixPages=()=>{
 for(let k=0,guard=0;k<nodes.length&&guard<5000;k++){
  while(overflow(nodes[k])&&guard++<5000){
   const bd=nodes[k].querySelector('.body');const ch=bd.lastElementChild;const nb=nextBody(k);const first=nb.firstElementChild;
   const bi=ch.dataset.b,isT=ch.dataset.t==='1',trs=isT?tblRows(ch):[];
   if(isT&&trs.length>1){// move the last row(s) — keep a group title / long note with its row
    let cut=trs.length-1;while(cut>0&&keepTr(trs[cut-1]))cut--;if(trs[cut].classList.contains('ntrow')&&cut>0)cut--;while(cut>0&&keepTr(trs[cut-1]))cut--;
    if(cut===0){if(bd.children.length===1){if(trs.length<=1)break;cut=trs.length-1}else cut=0}
    if(cut>0){const mv=trs.slice(cut);let tgt=first&&first.dataset.b===bi&&first.dataset.t==='1'?first.querySelector('table>tbody'):null;
     if(!tgt){const b=blocks[+bi];const nc=document.createElement('div');nc.className='chk';nc.dataset.b=bi;nc.dataset.t='1';nc.innerHTML=`<table class="${b.tableClass||''}">${b.repeat?b.head:''}<tbody></tbody></table>`;nb.insertBefore(nc,nb.firstChild);tgt=nc.querySelector('tbody')}
     mv.reverse().forEach(tr=>tgt.insertBefore(tr,tgt.firstChild));continue}
   }
   if(bd.children.length===1)break;// one block taller than a page: nothing better to do
   // move the whole block; if it continues on the next page, merge it there (heading + rows together)
   if(isT&&first&&first.dataset.b===bi&&first.dataset.t==='1'){const tb=ch.querySelector('table>tbody'),t2=first.querySelector('table>tbody');[...t2.children].forEach(tr=>tb.appendChild(tr));first.remove()}
   nb.insertBefore(ch,nb.firstChild)}
 }
 for(let k=nodes.length-1;k>0;k--){if(!nodes[k].querySelector('.body').children.length){nodes[k].remove();nodes.splice(k,1)}}
 };
 fixPages();await document.fonts.ready;
 await Promise.all([...st.querySelectorAll('img')].map(img=>img.complete&&img.naturalWidth?1:new Promise(r=>{img.onload=img.onerror=r})));
 fixPages();
 nodes.forEach((pg,k)=>{const f=pg.querySelector('.foot');const t=document.createElement('div');t.innerHTML=footHTML(k+1,nodes.length,d,dt);f.replaceWith(t.firstElementChild)});
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
 let emb='';if(d.aoa){const CT=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;CT[n]=c}const u=new TextEncoder().encode(JSON.stringify(Object.assign({v:1,app:'alola',kind:'prod',rows:d.aoa},Array.isArray(d.left)&&d.left.length?{left:d.left}:{})));let o='';for(let i=0;i<u.length;i+=32768)o+=String.fromCharCode.apply(null,u.subarray(i,i+32768));const b=btoa(o);let c=~0;for(let i=0;i<b.length;i++)c=CT[(c^b.charCodeAt(i))&255]^(c>>>8);emb='ALOLADATA1:'+b+':'+((~c)>>>0).toString(16).padStart(8,'0');
  pdf.setPage(1);pdf.setFont('helvetica');pdf.setFontSize(2);const ls=emb.match(/.{1,400}/g)||[];ls.forEach((l,i)=>pdf.text(l,2,3+i*2.2,{renderingMode:'invisible'}))}
 const day=String(d.date||'').trim()||new Date().toISOString().slice(0,10);const title=typeof reportTitle==='function'?reportTitle(day):('تشغيل العلا يوم '+day);
 pdf.setProperties({title,subject:title,keywords:emb,creator:'Al-Ola Production'});
 st.innerHTML='';return new Blob([patchPdfTitle(pdf.output('arraybuffer'),title)],{type:'application/pdf'})}};
})();
