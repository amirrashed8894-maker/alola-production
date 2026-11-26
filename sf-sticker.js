/* استيكر باليت صن فروت من البرنامج — نفس شكل ملفات الـ PDF المطبوعة (100×50 مم): الرأس، QR صغير، الرقم كبير، «تم التعبئة في محطة العلا»، 6 خانات.
   بيترسم على canvas (العربي بيتشكّل صح من المتصفح) أبيض وأسود بس (للطابعة الحرارية) وبيتحط صفحة لكل استيكر في PDF مقاسه بالظبط. */
(function(){
const K=12; /* px لكل مم ≈ 305 dpi */
const W=100,H=50;
async function fontsReady(){try{if(document.fonts){await Promise.all(['900 40px Cairo','700 20px Cairo','500 20px Cairo'].map(f=>document.fonts.load(f,'SF-0123456789 صن فروت')));}}catch(e){}}
const pt=v=>v*25.4/72; /* نقطة → مم */
function fields(r,fill){const sz=r.s==='MIX'?(typeof sizeLabel==='function'?sizeLabel(r):'MIX'):(r.s||'');const n=parseInt(r.n,10)||0,w=(typeof wNum==='function'?wNum(r.w):parseFloat(r.w))||0;
 const d=String((typeof S!=='undefined'&&S&&S.h&&S.h.date)||'').split('-');const date=d.length===3?d[2]+'/'+d[1]+'/'+d[0]:'';
 return {p:r.p,fill:fill!==false,v:r.v||'',s:sz,n:n?String(n):'',kg:'' /* Amir: الوزن على الاستيكر دايمًا فاضي (يتكتب باليد) */,date,g:r.g||''}}
async function canvas(f){await fontsReady();const c=document.createElement('canvas');c.width=W*K;c.height=H*K;const x=c.getContext('2d');
 const X=v=>v*K,Y=v=>(H-v)*K; /* نفس إحداثيات ملف الـ PDF (من تحت لفوق) */
 x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.fillStyle='#000';x.strokeStyle='#000';x.lineWidth=Math.max(2,pt(0.3)*K*1.4);x.textBaseline='alphabetic';
 const txt=(s,px,py,size,wt,al,rtl)=>{x.font=`${wt} ${pt(size)*K}px Cairo, "Noto Sans Arabic", Arial, sans-serif`;x.textAlign=al||'left';x.direction=rtl?'rtl':'ltr';x.fillText(s,X(px),Y(py))};
 const line=(a,b,c2,d,dash)=>{x.save();if(dash)x.setLineDash([X(0.8),X(0.8)]);x.beginPath();x.moveTo(X(a),Y(b));x.lineTo(X(c2),Y(d));x.stroke();x.restore()};
 /* الرأس */
 txt('SUN FRUIT',3,44.2,10.5,700,'left');txt('صن فروت',97,44.0,10.5,700,'right',true);
 txt('PALLET No.',49,44.6,7,500,'right');txt('رقم الباليت',51,44.5,7,500,'left',true);
 line(2,42.6,98,42.6);
 /* QR صغير 16 مم بهامش موديولين */
 const q=qrcode(0,'M');q.addData(f.p);q.make();const m=q.getModuleCount(),tot=m+4,ms=X(16)/tot,qx=X(2),qy=Y(25.4+16);
 for(let r=0;r<m;r++)for(let cc=0;cc<m;cc++)if(q.isDark(r,cc))x.fillRect(Math.floor(qx+(cc+2)*ms),Math.floor(qy+(r+2)*ms),Math.ceil(ms),Math.ceil(ms));
 /* الرقم الكبير: يملا العرض اللي جنب الـ QR (78 مم)، ارتفاعه لحد 15.2 مم، في نص الشريط بين الخطين 24.2 و 42.6 */
 let fs=200;x.font=`900 ${fs}px Cairo, Arial, sans-serif`;x.direction='ltr';let mt=x.measureText(f.p);
 const gh=(mt.actualBoundingBoxAscent+mt.actualBoundingBoxDescent)||fs*0.7;fs=Math.min(fs*X(78)/mt.width,fs*X(15.2)/gh);
 x.font=`900 ${fs}px Cairo, Arial, sans-serif`;mt=x.measureText(f.p);const asc=mt.actualBoundingBoxAscent||fs*0.7,des=mt.actualBoundingBoxDescent||0;
 x.textAlign='center';const band=X(42.6-24.2);x.fillText(f.p,X(58.7),Y(24.2)-(band-(asc+des))/2-des);
 /* تم التعبئة في محطة العلا */
 line(2,24.2,98,24.2);txt('Packed at Al-Ola Station',3,21.3,7,500,'left');txt('تم التعبئة في محطة العلا',97,21.1,7.4,700,'right',true);
 line(2,20.2,98,20.2);
 /* الخانات */
 const rows=[[['Product','الصنف','v'],['Size','المقاس','s']],[['Cartons','عدد الكراتين','n'],['Weight kg','الوزن كجم','kg']],[['Date','التاريخ','date'],['Grade','الدرجة','g']]];
 rows.forEach((row,i)=>{const y=14.4-i*6.0;row.forEach(([en,ar,k],j)=>{const x0=3+j*48.5,x1=x0+45;txt(en,x0,y,7.2,500,'left');txt(ar,x1,y-0.1,7.2,500,'right',true);
  x.font=`500 ${pt(7.2)*K}px Cairo, Arial`;const ew=x.measureText(en).width/K;const aw=x.measureText(ar).width/K;const a=x0+ew+1.2,b=x1-aw-1.2;line(a,y-0.4,b,y-0.4,true);
  const val=f.fill?String(f[k]||''):'';if(val){x.save();x.font=`800 ${pt(8.6)*K}px Cairo, "Noto Sans Arabic", Arial`;x.textAlign='center';x.direction=/[\u0600-\u06FF]/.test(val)?'rtl':'ltr';let vs=pt(8.6)*K;while(x.measureText(val).width>X(b-a-0.6)&&vs>10){vs-=2;x.font=`800 ${vs}px Cairo, "Noto Sans Arabic", Arial`}x.fillStyle='#fff';const vw=x.measureText(val).width;x.fillRect(X((a+b)/2)-vw/2-4,Y(y+2.6),vw+8,X(3.2));x.fillStyle='#000';x.fillText(val,X((a+b)/2),Y(y+0.15));x.restore()}})});
 line(50.5,1.5,50.5,18.8);
 /* أبيض وأسود بس (الطابعة الحرارية مبتطبعش رمادي) */
 const id=x.getImageData(0,0,c.width,c.height),D=id.data;for(let i=0;i<D.length;i+=4){const v=(D[i]*0.3+D[i+1]*0.59+D[i+2]*0.11)<150?0:255;D[i]=D[i+1]=D[i+2]=v;D[i+3]=255}x.putImageData(id,0,0);
 return c}
async function pdf(list,copies){copies=Math.max(1,Math.min(10,parseInt(copies,10)||1));const {jsPDF}=window.jspdf;const doc=new jsPDF({orientation:'landscape',unit:'mm',format:[W,H],compress:true});let first=true;
 for(const f of list){const c=await canvas(f);const png=c.toDataURL('image/png');for(let i=0;i<copies;i++){if(!first)doc.addPage([W,H],'landscape');first=false;doc.addImage(png,'PNG',0,0,W,H,'sf_'+f.p+(f.fill?'_f':''),'FAST')}}
 doc.setProperties({title:'Sun Fruit pallet stickers',creator:'Al-Ola production app'});return doc.output('blob')}
window.SFSTK={canvas,pdf,fields};
})();
