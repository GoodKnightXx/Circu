/* Circu: 6c. POINTER: pointerdown/move/up, abort, wheel zoom */
'use strict';
cv.addEventListener('pointerdown',e=>{const w=pt(e),el=e.target;
 if(e.button===1){M={m:'pan',sx:e.clientX,sy:e.clientY,vx:V.x,vy:V.y};return}
 if(e.button!==0)return;let te=el.closest('[data-t],[data-h]');if(!te&&el.closest('.wg')){const tt=termAt(w[0],w[1],6);if(tt)te={dataset:tt.key[0]=='H'?{h:tt.key.slice(1)}:{t:tt.key}}}
 if(te){const t=termOf(te);if(!t){render();return}if(S.pend&&Math.hypot(S.pend.x-t.x,S.pend.y-t.y)>1){addWire(S.pend,t);S.pend=null;M={m:'x'};return}S.pend={x:t.x,y:t.y,cx:w[0],cy:w[1]};M={m:'wire',sx:e.clientX,sy:e.clientY};S.sel.clear();S.selW=-1;render();return}
 const bp=el.closest('[data-bp]');if(bp){const wi=+bp.closest('[data-w]').dataset.w,pi=+bp.dataset.bp,k=wi+':'+pi,now=Date.now();
  if(lastBp.k==k&&now-lastBp.t<400){lastBp={};act(()=>{const ps=S.wires[wi].pts;ps.splice(pi,1);if(!ps.length)delete S.wires[wi].pts});return}
  lastBp={k,t:now};S.selW=wi;S.sel.clear();S.pend=null;M={m:'bend',w:wi,p:pi,sx:e.clientX,sy:e.clientY,before:snap()};render();return}
 const we=el.closest('[data-w]');if(we&&!S.pend){const wi=+we.dataset.w;S.selW=wi;S.sel.clear();S.pend=null;M={m:'bend',w:wi,seg:segAt(S.wires[wi],w),ins:1,sx:e.clientX,sy:e.clientY,before:snap()};render();return}
 const pe=el.closest('.part');
 if(S.pend){(S.pend.pts=S.pend.pts||[]).push(wsnap(w[0],w[1]));S.pend.cx=w[0];S.pend.cy=w[1];M={m:'x'};render();return}   // polyline: empty click = corner point
 S.pend=null;
 if(pe){const id=+pe.dataset.id;if(e.shiftKey)S.sel.has(id)?S.sel.delete(id):S.sel.add(id);else if(!S.sel.has(id))S.sel=new Set([id]);S.selW=-1;const sw=el.closest('[data-sw]');
  M={m:'drag',sx:w[0],sy:w[1],cx:e.clientX,cy:e.clientY,st:[...S.sel].map(i=>{const p=gp(i);return[p,p.x,p.y]}),moved:0,sw:sw?+sw.dataset.sw:-1,before:snap(),id};M.wl=wireLinks(M.st.map(a=>a[0]));render();return}
 S.sel.clear();S.selW=-1;M=e.shiftKey?{m:'band',sx:w[0],sy:w[1]}:{m:'pan',sx:e.clientX,sy:e.clientY,vx:V.x,vy:V.y};render()});
addEventListener('pointermove',e=>{const w=pt(e);
 if(!M){let te=e.target.closest&&e.target.closest('[data-t],[data-h]');const tip=$('#tip');if(te&&te.dataset.t&&!gp(+te.dataset.t.split('.')[0]))te=null;
  if(te){const k=te.dataset.t,h=te.dataset.h;let t='';if(k){const[id,n]=k.split('.'),p=gp(+id),num=(p.type=='chip'||GATES[p.type])?T[p.type].pins.findIndex(a=>a[0]==n)+1:'';t=T[p.type].n+(num?` pin ${num}: `:' · ')+n}else t=/^\d/.test(h)?`Column ${parseInt(h)+1}, row ${h.slice(-1)}`:(h[0]=='t'?'Top ':'Bottom ')+(h[1]=='p'?'+ rail':'− rail');if(S.running)t+=' — '+volt(k||'H'+h);tip.textContent=t;tip.style.left=e.clientX+12+'px';tip.style.top=e.clientY+14+'px';tip.hidden=0}else tip.hidden=1;
  const s=te&&te.dataset.s;if(s!==cv._hs){document.querySelectorAll('.hs').forEach(n=>n.classList.remove('hs'));if(s)document.querySelectorAll(`[data-s="${s}"]`).forEach(n=>n.classList.add('hs'));cv._hs=s}
  if(S.pend){S.pend.cx=w[0];S.pend.cy=w[1];$('#wires').innerHTML=wiresSVG()}return}
 if(M.m=='pan'){userView=true;V.x=M.vx+e.clientX-M.sx;V.y=M.vy+e.clientY-M.sy;setT()}
 else if(M.m=='drag'){if(!M.moved&&Math.hypot(e.clientX-M.cx,e.clientY-M.cy)<4)return;M.moved=1;for(const[p,x,y]of M.st){p.x=x+w[0]-M.sx;p.y=y+w[1]-M.sy}snapSel();followWires(M.wl);render()}
 else if(M.m=='bend'){if(!M.moved&&Math.hypot(e.clientX-M.sx,e.clientY-M.sy)<4)return;M.moved=1;const wr_=S.wires[M.w];if(!wr_){M=null;return}
  if(M.ins){(wr_.pts=wr_.pts||[]).splice(M.seg,0,wsnap(w[0],w[1]));M.p=M.seg;M.ins=0}else wr_.pts[M.p]=wsnap(w[0],w[1]);render()}
 else if(M.m=='wire'&&S.pend){S.pend.cx=w[0];S.pend.cy=w[1];$('#wires').innerHTML=wiresSVG()}
 else if(M.m=='band'){const b=$('#band');b.setAttribute('display','');b.setAttribute('x',Math.min(w[0],M.sx));b.setAttribute('y',Math.min(w[1],M.sy));b.setAttribute('width',Math.abs(w[0]-M.sx));b.setAttribute('height',Math.abs(w[1]-M.sy));M.w=w}});
addEventListener('pointerup',e=>{const m=M;M=null;if(!m)return;
 if(m.m=='drag'){if(m.lib&&document.elementFromPoint(e.clientX,e.clientY)?.closest('#side')){S.parts.pop();S.sel.clear();ID--;refresh();return}
  if(m.moved&&occ(m.st.map(a=>a[0]))){restore(m.before);toast('Those breadboard holes are already used by another part.');refresh();return}if(m.moved){const pp=m.st.map(a=>a[0]);if(loose(pp)&&pinHoles(pp).length)toast('Some pins are not in breadboard holes, so they are not connected.');S.undo.push(m.before);S.redo=[]}else if(m.sw>=0){S.undo.push(m.before);S.redo=[];const p=gp(m.id);p.v.on[m.sw]^=1}warned.clear();refresh()}
 else if(m.m=='bend'){if(m.moved){S.undo.push(m.before);S.redo=[]}warned.clear();refresh()}
 else if(m.m=='wire'){if(Math.hypot(e.clientX-m.sx,e.clientY-m.sy)>6&&S.pend){const w=pt(e),t=termAt(w[0],w[1],14);if(t&&Math.hypot(S.pend.x-t.x,S.pend.y-t.y)>1)addWire(S.pend,t);S.pend=null;render()}}
 else if(m.m=='band'){$('#band').setAttribute('display','none');if(m.w){const[x0,x1]=[m.sx,m.w[0]].sort((a,b)=>a-b),[y0,y1]=[m.sy,m.w[1]].sort((a,b)=>a-b);S.sel=new Set(S.parts.filter(p=>{const q=pinsW(p),cx=q.reduce((s,a)=>s+a.x,0)/q.length,cy=q.reduce((s,a)=>s+a.y,0)/q.length;return(p.x>=x0&&p.x<=x1&&p.y>=y0&&p.y<=y1)||(cx>=x0&&cx<=x1&&cy>=y0&&cy<=y1)}).map(p=>p.id));render()}}});
function abortM(){const m=M;M=null;if(m&&m.before&&(m.m=='drag'||m.m=='bend'))restore(m.before);if(m)refresh()}addEventListener('pointercancel',abortM);addEventListener('blur',abortM);
cv.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.1:1/1.1,e.clientX,e.clientY)},{passive:false});
