/* Circu: 3. STATE / UNDO: S, act(), snapshots, restore, toast */
'use strict';
/* ============ 3. STATE / UNDO ============ */
let ID=1;const S={parts:[],wires:[],sel:new Set(),selW:-1,color:'#e5484d',running:false,undo:[],redo:[],pend:null};const burned=new Set(),warned=new Set();
const mk=(t,x,y)=>({id:ID++,type:t,x,y,rot:0,v:T[t].v()}),gp=id=>S.parts.find(p=>p.id===id);
const snap=()=>JSON.stringify({parts:S.parts,wires:S.wires,nid:ID});
function restore(s){const o=JSON.parse(s);S.parts=o.parts;S.wires=o.wires;ID=Math.max(ID,o.nid);S.sel.clear();S.selW=-1;S.pend=null}
function act(fn){S.undo.push(snap());S.redo=[];warned.clear();fn();refresh()}
function undo(){if(!S.undo.length)return;S.redo.push(snap());restore(S.undo.pop());refresh()}
function redo(){if(!S.redo.length)return;S.undo.push(snap());restore(S.redo.pop());refresh()}
function toast(m){if(warned.has(m))return;warned.add(m);const d=document.createElement('div');d.className='toast';d.textContent=m;$('#toasts').append(d);setTimeout(()=>d.remove(),4000)}
