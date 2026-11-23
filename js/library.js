/* Circu: 6d. COMPONENT PANEL: side/inspector toggles, parts library, thumbnails, wire colours */
'use strict';
function togSide(){const sd=$('#side'),m=sd.classList.toggle('min'),t=$('#sideTab');t.style.right=m?'0':'300px';t.textContent=m?'❮':'❯';if(!userView)fit()}
function togInsp(){inspMin=!inspMin;ui()}
$('#lib').addEventListener('pointerdown',e=>{const it=e.target.closest('.it');if(!it)return;const t=it.dataset.t;if(t=='wire'){toast('Click a hole or pin, then click another to add a wire.');return}e.preventDefault();
 const w=pt(e),before=snap(),p=mk(t,w[0],w[1]);S.parts.push(p);S.sel=new Set([p.id]);S.selW=-1;M={m:'drag',sx:w[0],sy:w[1],cx:e.clientX,cy:e.clientY,st:[[p,p.x,p.y]],moved:1,sw:-1,before,lib:1,id:p.id};render()});
const CATS=[...new Set(LIB.map(a=>a[2]))];
function thumb(t){const x=T[t];if(!x)return '<svg viewBox="0 0 60 36" height="40"><path d="M6 26C20 6 40 6 54 26" stroke="#e5484d" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="6" cy="26" r="4" fill="#fff" stroke="#0006"/><circle cx="54" cy="26" r="4" fill="#fff" stroke="#0006"/></svg>';const[bx,by,bw,bh]=x.box;let g='';try{g=x.draw({id:0,type:t,x:0,y:0,rot:0,v:x.v()},{})}catch(e){}return `<svg viewBox="${bx-4} ${by-4} ${bw+8} ${bh+8}" height="44">${g}</svg>`}
function drawLib(){const cs=$('#cat');if(!cs.options.length)cs.innerHTML=['All',...CATS].map(c=>`<option>${c}</option>`).join('');const q=$('#q').value.toLowerCase(),cv_=cs.value;let c='',h='';for(const[t,n,cat]of LIB){if(cv_!='All'&&cat!=cv_)continue;if(q&&!(n+cat).toLowerCase().includes(q))continue;if(cat!=c){h+=`<div class="cat">${cat}</div>`;c=cat}h+=`<div class="it" data-t="${t}" title="${n}">${thumb(t)}<span>${n}</span></div>`}$('#lib').innerHTML=h||'<div class="cat">No parts found</div>'}
$('#q').oninput=drawLib;drawLib();
$('#cols').innerHTML=['#e5484d','#222','#2f80ed','#22b24c','#fbc02d','#fb8c00','#ffffff'].map(c=>`<button class="sw ${c==S.color?'s':''}" style="background:${c}" onclick="pick('${c}')"></button>`).join('');
function pick(c){S.color=c;$('#colsw').style.background=c;$('#colpop').style.display='none';document.querySelectorAll('.sw').forEach(b=>b.classList.toggle('s',b.style.backgroundColor&&b.getAttribute('style').includes(c)));if(S.selW>=0)act(()=>{S.wires[S.selW].c=c})}
