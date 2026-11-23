/* Circu: 6e. ACTIONS: rotate, delete, duplicate, copy/paste, run, theme, truth table, keyboard */
'use strict';
function rot(){if(!S.sel.size)return;const wl=wireLinks([...S.sel].map(gp).filter(Boolean));act(()=>{S.sel.forEach(i=>{const p=gp(i);p.rot=(p.rot+1)%4;snapParts([p])});followWires(wl)});const ps=[...S.sel].map(gp).filter(Boolean);if(occ(ps)){undo();toast('Rotating there would put pins in used holes.')}else if(loose(ps)&&pinHoles(ps).length)toast('Some pins are not in holes after rotating.')}
function del(){if(S.selW>=0)act(()=>{S.wires.splice(S.selW,1);S.selW=-1});else if(S.sel.size)act(()=>{S.parts=S.parts.filter(p=>!S.sel.has(p.id));S.sel.clear()})}
function dup(){if(!S.sel.size)return;act(()=>{const n=new Set();for(const i of S.sel){const o=gp(i),p=JSON.parse(JSON.stringify(o));p.id=ID++;p.x+=2*G;p.y+=2*G;S.parts.push(p);snapParts([p]);for(let k=0;k<40&&occ([p]);k++){p.x+=2*G;snapParts([p])}n.add(p.id)}S.sel=n})}
function tbState(){const has=S.sel.size>0||S.selW>=0;[['#bCopy',has],['#bDel',has],['#bRot',S.sel.size>0],['#bPaste',!!CB],['#bUndo',S.undo.length>0],['#bRedo',S.redo.length>0]].forEach(([q,e])=>{const b=$(q);if(b)b.disabled=!e})}
const jc=o=>JSON.parse(JSON.stringify(o));
function copyC(){if(S.sel.size){CB={parts:[...S.sel].map(i=>jc(gp(i))),wires:[],n:0};toast(`Copied ${CB.parts.length} part${CB.parts.length>1?'s':''}`)}else if(S.selW>=0){CB={parts:[],wires:[jc(S.wires[S.selW])],n:0};toast('Wire copied')}else return;ui()}
function pasteC(){if(!CB){toast('Nothing to paste. Select something and press Ctrl+C first.');return}
 CB.n++;const o=2*G*CB.n;act(()=>{const n=new Set();for(const c of CB.parts){const p=jc(c);p.id=ID++;p.x+=o;p.y+=o;S.parts.push(p);snapParts([p]);for(let k=0;k<40&&occ([p]);k++){p.x+=2*G;snapParts([p])}n.add(p.id)}
  for(const c of CB.wires){const w=jc(c);[w.a,w.b,...(w.pts||[])].forEach(q=>{q[0]+=o;q[1]+=o});S.wires.push(w)}
  S.sel=n;S.selW=-1})}
function toggleRun(){S.running=!S.running;burned.clear();warned.clear();refresh()}
function theme(){const r=document.documentElement;r.dataset.theme=r.dataset.theme=='dark'?'light':'dark';$('#thm').textContent=r.dataset.theme=='dark'?'Light mode':'Dark mode'}
function tgl(){const t=$('#truth');t.style.display=t.style.display=='flex'?'none':'flex';setTimeout(()=>{if(!userView)fit()},0)}
addEventListener('keydown',e=>{if(e.key=='Escape'){$('#dlg').style.display='none';$('#help').style.display='none';$('#about').style.display='none'}if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;const k=e.key.toLowerCase();
 if(S.pend&&S.pend.pts&&S.pend.pts.length&&k=='backspace'){S.pend.pts.pop();$('#wires').innerHTML=wiresSVG()}else if(k=='delete'||k=='backspace')del();else if(k=='r'&&!e.ctrlKey&&!e.metaKey)rot();else if((e.ctrlKey||e.metaKey)&&k=='z'&&!e.shiftKey){e.preventDefault();undo()}else if((e.ctrlKey||e.metaKey)&&(k=='y'||k=='z'&&e.shiftKey)){e.preventDefault();redo()}else if((e.ctrlKey||e.metaKey)&&k=='d'){e.preventDefault();dup()}else if((e.ctrlKey||e.metaKey)&&k=='c'){e.preventDefault();copyC()}else if((e.ctrlKey||e.metaKey)&&k=='v'){e.preventDefault();pasteC()}else if(k=='?')$('#help').style.display='grid';else if(k=='escape'){S.pend=null;S.sel.clear();render()}});
