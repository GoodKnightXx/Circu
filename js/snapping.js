/* Circu: 6b. AUTO-SNAP: bestSnap, flexible legs, seating/overlap checks */
'use strict';
/* Auto-snap: pick the offset that lands the MOST pins (of all dragged parts) exactly in breadboard holes */
function bestSnap(parts,R=22){const pins=[];for(const p of parts){if(T[p.type].nosnap)continue;for(const q of pinsW(p))pins.push(q)}
 let best=null;for(const q of pins){const h=nearHole(q.x,q.y,R);if(!h)continue;const dx=h.x-q.x,dy=h.y-q.y;let n=0;
  for(const r of pins)if(nearHole(r.x+dx,r.y+dy,2))n++;
  const d=dx*dx+dy*dy;if(!best||n>best.n||(n==best.n&&d<best.d))best={n,d,dx,dy}}
 return best}
T.res.flex=1;T.led.flex=1;
/* Flexible legs (resistor, LED): after the body is placed, any pin still off-grid bends to the nearest free hole */
function bendLegs(p){const ps=pinsW(p),used=new Set(),strips=new Set(),lg={};
 for(const q of ps){const h=nearHole(q.x,q.y,2);if(h){used.add(h.id);strips.add(h.s)}}
 for(const q of ps){if(nearHole(q.x,q.y,2))continue;let b=null,bd=(3*G)**2;
  for(const h of HOLES){if(used.has(h.id)||strips.has(h.s))continue;const d=(h.x-q.x)**2+(h.y-q.y)**2;if(d<bd){bd=d;b=h}}
  if(b){used.add(b.id);strips.add(b.s);lg[q.n]=[b.x-q.x,b.y-q.y]}}
 if(Object.keys(lg).length)p.v.lg=lg}
function snapParts(parts){for(const p of parts)if(p.v&&p.v.lg)delete p.v.lg;const b=bestSnap(parts);if(!b)return false;
 for(const p of parts){p.x+=b.dx;p.y+=b.dy}for(const p of parts)if(T[p.type].flex)bendLegs(p);return true}
function pinHoles(parts){const o=[];for(const p of parts){if(T[p.type].nosnap)continue;for(const q of pinsW(p)){const h=nearHole(q.x,q.y,2);if(h)o.push([h.x,h.y])}}return o}
const occ=ps=>{const ids=new Set(ps.map(p=>p.id)),used=new Set();for(const p of S.parts){if(ids.has(p.id)||!T[p.type].hole)continue;for(const q of pinsW(p)){const h=nearHole(q.x,q.y,2);if(h)used.add(h.id)}}return ps.some(p=>T[p.type].hole&&pinsW(p).some(q=>{const h=nearHole(q.x,q.y,2);return h&&used.has(h.id)}))},loose=ps=>ps.some(p=>T[p.type].hole&&pinsW(p).some(q=>!nearHole(q.x,q.y,2)));
function snapSel(){const ps=M.st.map(a=>a[0]);M.ok=snapParts(ps)&&!loose(ps)&&!occ(ps);M.hl=pinHoles(ps)}
