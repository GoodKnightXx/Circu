/* Circu: 2. BOARD GEOMETRY: breadboard holes (HOLES/HM), pin/hole lookup */
'use strict';
/* ============ 2. BOARD GEOMETRY ============ */
const BX=40,BY=150,HOLES=[],HM={};
const addH=(id,x,y,s)=>{const h={id,x,y,s};HOLES.push(h);HM[id]=h};
for(let c=0;c<63;c++){const x=BX+34+c*G;for(let i=0;i<5;i++){addH(c+'abcde'[i],x,BY+70+i*G,'c'+c+'t');addH(c+'fghij'[i],x,BY+196+i*G,'c'+c+'b')}}
['tp','tn','bp','bn'].forEach((r,j)=>{const y=[BY+40,BY+22,BY+314,BY+296][j];for(let i=0;i<50;i++)addH(r+i,BX+34+2*G+Math.floor(i/5)*6*G+i%5*G,y,r)});
$('#board').innerHTML=`<rect x="${BX}" y="${BY}" width="1180" height="336" rx="10" fill="var(--bd)" stroke="var(--hl)" stroke-width="2"/><rect x="${BX+14}" y="${BY+158}" width="1152" height="30" fill="#0000001a"/>
<line x1="${BX+20}" x2="${BX+1160}" y1="${BY+52}" y2="${BY+52}" stroke="#0002"/><line x1="${BX+20}" x2="${BX+1160}" y1="${BY+288}" y2="${BY+288}" stroke="#0002"/>
<text x="${BX+14}" y="${BY+27}" font-size="14" fill="#6fb7e9" text-anchor="middle" font-weight="800">−</text><text x="${BX+14}" y="${BY+45}" font-size="14" fill="#e88b82" text-anchor="middle" font-weight="800">+</text><text x="${BX+14}" y="${BY+301}" font-size="14" fill="#6fb7e9" text-anchor="middle" font-weight="800">−</text><text x="${BX+14}" y="${BY+319}" font-size="14" fill="#e88b82" text-anchor="middle" font-weight="800">+</text>`+'abcde'.split('').map((l,i)=>[BX+16,BX+1164].map(x=>`<text x="${x}" y="${BY+74+i*G}" font-size="9" text-anchor="middle" fill="var(--mut)">${l.toUpperCase()}</text><text x="${x}" y="${BY+200+i*G}" font-size="9" text-anchor="middle" fill="var(--mut)">${'fghij'[i].toUpperCase()}</text>`).join('')).join('')+[...Array(63).keys()].filter(c=>c==0||(c+1)%5==0).map(c=>`<text x="${BX+34+c*G}" y="${BY+63}" font-size="9" text-anchor="middle" fill="var(--mut)">${c+1}</text><text x="${BX+34+c*G}" y="${BY+282}" font-size="9" text-anchor="middle" fill="var(--mut)">${c+1}</text>`).join('')+HOLES.map(h=>`<circle class="hole" data-h="${h.id}" data-s="${h.s}" cx="${h.x}" cy="${h.y}" r="3.4"/>`).join('');
const pinsW=p=>T[p.type].pins.map(([n,x,y])=>{const[a,b]=[[x,y],[-y,x],[-x,-y],[y,-x]][p.rot%4],o=(p.v&&p.v.lg&&p.v.lg[n])||[0,0];return{n,key:p.id+'.'+n,x:p.x+a+o[0],y:p.y+b+o[1]}});
const legLoc=(p,n)=>{const o=(p.v&&p.v.lg&&p.v.lg[n])||[0,0],[wx,wy]=o;return[[wx,wy],[wy,-wx],[-wx,-wy],[-wy,wx]][p.rot%4]};
function nearHole(x,y,r){let b=null,bd=r*r;for(const h of HOLES){const d=(h.x-x)**2+(h.y-y)**2;if(d<bd){bd=d;b=h}}return b}
function termAt(x,y,r=12){let b=null,bd=r*r+1;for(const p of S.parts)for(const q of pinsW(p)){const d=(q.x-x)**2+(q.y-y)**2;if(d<bd){bd=d;b={x:q.x,y:q.y,key:q.key}}}for(const h of HOLES){const d=(h.x-x)**2+(h.y-y)**2;if(d<bd-.01){bd=d;b={x:h.x,y:h.y,key:'H'+h.id}}}return b}
