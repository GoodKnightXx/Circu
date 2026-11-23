/* Circu: 7. STARTER EXAMPLES: loadEx and the example circuits */
'use strict';
/* ============ 7. STARTER EXAMPLES ============ */
function loadEx(n){if(!n)return;act(()=>{S.parts=[];S.wires=[];S.sel.clear();if(n=='dec')exDec();if(n=='led')exLed();if(n=='gate')exGate()});$('#ex').value='';$('#pname').value={blank:'Untitled circuit',dec:'My decoder circuit',led:'LED + resistor',gate:'Logic gate circuit'}[n]||'Untitled circuit';fit()}
const put=(t,id,v)=>{const h=typeof id=='string'?HM[id]:{x:id[0],y:id[1]},p=mk(t,h.x,h.y);Object.assign(p.v,v||{});S.parts.push(p);return p};
const wr=(a,b,c)=>{const q=s=>typeof s=='string'?[HM[s].x,HM[s].y]:s;S.wires.push({a:q(a),b:q(b),c})};
function exDec(){const R='#e5484d',K='#222';put('psu',[40,16]);put('chip','20e');put('disp','35e');put('dip4','3e');put('res','41a',{ohm:330});for(let i=0;i<4;i++)put('res',(3+i)+'abcd'[i],{ohm:10000});
 wr([140,117],'tp0',R);wr([164,117],'tn0',K);wr('tp1','20a',R);wr('tn1','27j',K);
 wr('3e','25j','#2f80ed');wr('4e','21j','#22b24c');wr('5e','20j','#fbc02d');wr('6e','26j','#fb8c00');           // DIP switches 1-4 = D,C,B,A -> pins 6,2,1,7
 for(let i=0;i<4;i++){wr('tp'+(5+i),(3+i)+'j',R);wr((7+i)+'e','tn'+(4+i),K)}   // +5V to one side of each switch; 10k pull-down resistors to ground on the other
 [['23a','38a'],['24a','39a'],['25a','38j'],['26a','36j'],['27a','35j'],['21a','36a'],['22a','35a']].forEach(([a,b],i)=>wr(a,b,['#2f80ed','#22b24c','#fbc02d','#fb8c00','#fff','#e5484d','#222'][i])); // a..g
 wr('41b','37c',R);wr('45b','tp3',R)}
function exLed(){put('psu',[40,16]);put('res','10a',{ohm:330});put('led','14c',{color:'red'});wr([140,117],'tp0','#e5484d');wr([164,117],'tn0','#222');wr('tp1','10b','#e5484d');wr('16b','tn1','#222')}
function exGate(){put('psu',[40,16]);put('sw','3e');put('sw','6e');put('and','20e');put('res','24i',{ohm:330});put('led','28g',{color:'green'});
 wr([140,117],'tp0','#e5484d');wr([164,117],'tn0','#222');wr('tp1','20a','#e5484d');wr('26j','tn1','#222');wr('3a','20j','#2f80ed');wr('6a','21j','#fb8c00');wr('22j','24j','#22b24c');wr('30j','tn2','#222')}   // 7408: pin14 VCC, pin7 GND, 1A/1B/1Y = pins 1/2/3
