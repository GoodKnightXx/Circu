/* Circu: 6a. WIRES: pointer->canvas coords, addWire, termOf, wire bending helpers */
'use strict';
/* ============ 6. UI + INTERACTION ============ */
const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left-V.x)/V.k,(e.clientY-r.top-V.y)/V.k]};
function addWire(a,b){act(()=>{const w={a:[a.x,a.y],b:[b.x,b.y],c:S.color};if(a.pts&&a.pts.length)w.pts=a.pts.map(q=>[q[0],q[1]]);S.wires.push(w)})}
function termOf(el){if(el.dataset.t){const[id]=el.dataset.t.split('.'),p=gp(+id);return p?pinsW(p).find(q=>q.key===el.dataset.t):null}const h=HM[el.dataset.h];return{x:h.x,y:h.y,key:'H'+h.id}}
/* Wires follow parts. A wire end sitting on a part pin that is NOT seated in a breadboard hole is attached to that pin and moves with it
   (drag, rotate). Ends plugged into breadboard holes stay where they are, like real jumper wires.
   wireLinks(parts) is called when a move starts; followWires(links) is called after every position change. */
function wireLinks(parts){
 const find=pt=>{for(const p of parts)for(const q of pinsW(p))if(Math.hypot(q.x-pt[0],q.y-pt[1])<=3&&!nearHole(q.x,q.y,7))return{p,n:q.n};return null},L=[];
 for(const w of S.wires){const a=find(w.a),b=find(w.b);if(a||b)L.push({w,o:JSON.parse(JSON.stringify(w)),a,b})}
 return L}
function followWires(L){
 for(const l of L||[]){
  const at=k=>{const q=pinsW(l[k].p).find(q=>q.n===l[k].n);return q?[q.x,q.y]:null},na=l.a&&at('a'),nb=l.b&&at('b');
  if(na)l.w.a=na;if(nb)l.w.b=nb;
  if(l.o.pts&&l.o.pts.length){l.w.pts=l.o.pts.map(q=>[q[0],q[1]]);   /* bend points travel too when both ends moved by the same amount */
   if(na&&nb){const dx=na[0]-l.o.a[0],dy=na[1]-l.o.a[1];if(Math.abs(nb[0]-l.o.b[0]-dx)<.5&&Math.abs(nb[1]-l.o.b[1]-dy)<.5)l.w.pts=l.o.pts.map(q=>[q[0]+dx,q[1]+dy])}}}}
/* Wire bending: drag a wire's body to add a bend point; drag a bend point to move it; double-click a bend point to remove it */
const wsnap=(x,y)=>[Math.round((x-2)/9)*9+2,Math.round((y-4)/9)*9+4];
function segAt(w,q){const P=[w.a,...(w.pts||[]),w.b];let best=0,bd=1e18;for(let i=0;i<P.length-1;i++){const[x1,y1]=P[i],[x2,y2]=P[i+1],dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((q[0]-x1)*dx+(q[1]-y1)*dy)/l)),d=(x1+t*dx-q[0])**2+(y1+t*dy-q[1])**2;if(d<bd){bd=d;best=i}}return best}
let lastBp={},inspMin=false;
