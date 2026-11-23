/* Circu: 4. NETLIST + SIMULATOR: simulate(), 74LS47 logic, DC solve */
'use strict';
/* ============ 4. NETLIST + SIMULATOR ============ */
function simulate(){
 const P={},f=k=>{if(P[k]===undefined)P[k]=k;while(P[k]!==k){P[k]=P[P[k]];k=P[k]}return k},u=(a,b)=>{P[f(a)]=f(b)};
 for(const h of HOLES)u('H'+h.id,'S'+h.s);                       // breadboard strips
 for(const p of S.parts){for(const q of pinsW(p)){const h=nearHole(q.x,q.y,7);if(h)u(q.key,'H'+h.id)}if(p.type==='disp')u(p.id+'.CA1',p.id+'.CA2');if(p.type==='dip4')p.v.on.forEach((o,i)=>{if(o)u(p.id+'.'+(i+1)+'a',p.id+'.'+(i+1)+'b')})}
 S.wires.forEach((w,i)=>{u('W'+i+'a','W'+i+'b');[[w.a,'a'],[w.b,'b']].forEach(([c,s])=>{const t=termAt(c[0],c[1],10);if(t)u('W'+i+s,t.key)})});
 const D=new Map(),SRC=new Map();let short=0,osc=0;const set=(k,v)=>{const r=f(k);if(D.has(r)&&D.get(r)!==v)short=1;D.set(r,v);SRC.set(r,v)};
 for(const p of S.parts){if(p.type==='psu'&&p.v.on[0]){set(p.id+'.+',p.v.volt);set(p.id+'.-',0)}if(p.type==='v5')set(p.id+'.5V',5);if(p.type==='gnd')set(p.id+'.GND',0);if(p.type==='sw')set(p.id+'.OUT',p.v.on[0]*5);if(p.type==='dipl')'DCBA'.split('').forEach((n,i)=>set(p.id+'.'+n,p.v.on[i]*5))}
 const L=k=>{const v=D.get(f(k));return v===undefined?null:v},sink=new Set(),np=new Set(),chips=S.parts.filter(p=>p.type==='chip'),info={};
 const RS0=S.parts.filter(p=>p.type==='res').map(p=>[f(p.id+'.1'),f(p.id+'.2')]),pu=r=>{for(const[a,b]of RS0){const o=a===r?b:b===r?a:null;if(o!==null&&D.has(o))return D.get(o)}},   // pull-up/pull-down: a resistor to a driven net sets a floating input
 gates=S.parts.filter(p=>GATES[p.type]),gnp=new Set(),GR=new Set(),gi=k=>{const r=f(k),v=D.has(r)?D.get(r):pu(r);return v!==undefined?(v>=1.5?1:0):sink.has(r)?0:1};
 let last='',conv=0;for(let it=0;it<40;it++){const go=new Map();gnp.clear();for(const g of gates){const id=g.id+'.',G0=GATES[g.type];const vc=L(id+'VCC');if(!(vc>=2&&vc<=6&&L(id+'GND')===0)){gnp.add(g.id);continue}
  for(let k=1;k<=G0.n;k++){const r=f(id+k+'Y'),v=G0.f(gi(id+k+'A'),G0.two?gi(id+k+'B'):0)*vc;if(SRC.has(r)){if(SRC.get(r)!==v)short=1}else if(go.has(r)&&go.get(r)!==v)short=1;else{D.set(r,v);go.set(r,v);GR.add(r)}}}   // each IC holds 4 (or 6) gates; passes let gates chainGR.forEach(r=>{if(!go.has(r)){D.delete(r);GR.delete(r)}});
 sink.clear();np.clear();for(const k in info)delete info[k];
 for(const c of chips){const id=c.id+'.';if(!(inV(L(id+'VCC'))&&L(id+'GND')===0)){np.add(c.id);continue}   // needs ~5V + ground
  const ib=n=>{const r=f(id+n),v=D.has(r)?D.get(r):pu(r);return v!==undefined?(v>=1.5?1:0):sink.has(r)?0:1},d=ib('D')<<3|ib('C')<<2|ib('B')<<1|ib('A');       // floating TTL input = HIGH
  let s=TT[d];if(!ib('RBI')&&d==0)s='1111111';if(!ib('LT'))s='0000000';if(!ib('BI/RBO'))s='1111111';   // lamp test, ripple blank, blanking (overrides)
  info[c.id]={d,s};SEG.split('').forEach((n,i)=>{if(s[i]==='0')sink.add(f(id+n))})}const sg=[...GR].map(r=>D.get(r)).join()+'|'+[...sink].join();if(sg===last){conv=1;break}last=sg}if(!conv&&gates.length)osc=1;   // open-collector: sinks only, else high-Z
 gnp.forEach(i=>np.add(i));
 const dm=new Map();
 const ov=new Set(S.parts.filter(p=>(p.type=='chip'&&L(p.id+'.VCC')>5.25)||(GATES[p.type]&&L(p.id+'.VCC')>6)).map(p=>p.id));if(S.running&&osc)toast('A feedback loop never settles, so its outputs are unreliable.');
 if(S.running&&ov.size)toast('Too much voltage! The 74LS47 needs 5 V and the 74HC gates max 6 V.');
 else if(S.running&&gnp.size)toast('A logic IC has no power (needs VCC and GND connected)');
 const lit=new Map(),run=S.running,sv=new Map(D),els=[];burned.forEach(id=>{if(!gp(id))burned.delete(id)});sink.forEach(r=>{if(!sv.has(r))sv.set(r,.3)});
 for(const p of S.parts){if(p.type==='res')els.push({a:f(p.id+'.1'),b:f(p.id+'.2'),g:1/Math.max(p.v.ohm,1e-3)});
  else if(p.type==='led')els.push({a:f(p.id+'.A'),b:f(p.id+'.K'),d:1,vf:VF[p.v.color],p});
  else if(p.type==='disp')for(const n of [...SEG,'dp'])els.push({a:f(p.id+'.CA1'),b:f(p.id+'.'+n),d:1,vf:2,p,n})}
 // DC solve: nodal analysis. Fixed nodes = sources and 7447 low outputs; diodes = Vf + 10 ohm, on/off iterated
 const nodes=[...new Set(els.flatMap(e=>[e.a,e.b]))].filter(r=>!sv.has(r)),ix=new Map(nodes.map((r,i)=>[r,i])),N=nodes.length,Vn=new Map(sv),gd=.1;nodes.forEach(r=>Vn.set(r,0));
 const cur=e=>{const v=Vn.get(e.a)-Vn.get(e.b);return e.d?(e.on?gd*(v-e.vf):0):e.g*v};
 for(let it=0;it<30;it++){const A=Array.from({length:N},(_,i)=>{const r=new Array(N+1).fill(0);r[i]=1e-9;return r});
  for(const e of els){let g=e.g,i0=0;if(e.d){if(!e.on)continue;g=gd;i0=gd*e.vf}const ia=ix.get(e.a),ib=ix.get(e.b);
   if(ia!==undefined){A[ia][ia]+=g;A[ia][N]+=i0;if(ib!==undefined)A[ia][ib]-=g;else A[ia][N]+=g*sv.get(e.b)}
   if(ib!==undefined){A[ib][ib]+=g;A[ib][N]-=i0;if(ia!==undefined)A[ib][ia]-=g;else A[ib][N]+=g*sv.get(e.a)}}
  for(let c=0;c<N;c++){let m=c;for(let r=c+1;r<N;r++)if(Math.abs(A[r][c])>Math.abs(A[m][c]))m=r;[A[c],A[m]]=[A[m],A[c]];for(let r=0;r<N;r++){if(r===c)continue;const k=A[r][c]/A[c][c];if(k)for(let j=c;j<=N;j++)A[r][j]-=k*A[c][j]}}
  nodes.forEach((r,i)=>Vn.set(r,A[i][N]/A[i][i]));
  let ch=0;for(const e of els)if(e.d){const on=Vn.get(e.a)-Vn.get(e.b)>e.vf;if(on!==!!e.on){e.on=on;ch=1}}if(!ch)break}
 const cn=new Set(sv.keys());for(let ch=1;ch;){ch=0;for(const e of els){if(e.d&&!e.on)continue;if(cn.has(e.a)!==cn.has(e.b)){cn.add(e.a);cn.add(e.b);ch=1}}}
 const mA=e=>e.on?Math.max(0,cur(e))*1000:0;let tot=0;
 for(const p of S.parts){if(p.type==='led'){if(burned.has(p.id)){lit.set(p.id,{burn:1});continue}const m=mA(els.find(x=>x.p===p));let o={b:0};if(run){o.b=Math.min(1,m/10);if(m>30){burned.add(p.id);o={burn:1};toast('An LED burned out. Add a resistor in series!')}}lit.set(p.id,o)}
  if(p.type==='disp'){const o={};for(const e of els)if(e.p===p){const m=mA(e);if(run&&m>.3){o[e.n]=Math.min(1,m/3);if(m>25){o.warn=1;toast(`Segment ${e.n} has too much current. Add a resistor!`)}}}lit.set(p.id,o)}
  if(p.type==='dmm'){const v=k=>{const r=f(k);return cn.has(r)?Vn.get(r):(pu(r)??0)};dm.set(p.id,v(p.id+'.+')-v(p.id+'.-'))}}
 if(run){const PR=new Set(S.parts.filter(p=>p.type==='psu'&&p.v.on[0]).map(p=>f(p.id+'.+')));for(const e of els){const i=cur(e);if(PR.has(e.a))tot+=i;if(PR.has(e.b))tot-=i}tot=Math.max(0,tot)*1000+chips.filter(c=>!np.has(c.id)).length*12+gates.filter(g=>!np.has(g.id)).length*2}

 if(run&&chips.length&&np.size&&!ov.size)toast(chips.filter(c=>np.has(c.id)).some(c=>L(c.id+'.GND')!==0)?'No ground connected':'74LS47 has no power');
 if(run&&short)toast('Two outputs are pushing against each other (like 5 V against 0 V). Check your wires.');
 const c0=chips[0],i0=c0&&info[c0.id];
 sim={f,D,sink,lit,np,ov,amp:tot/1000,dm,Vn,cn,d:i0?i0.d:-1,hint:run&&i0?`Input = ${i0.d.toString(2).padStart(4,'0')} → ${i0.d<10?'shows '+i0.d:i0.d==15?'blank':'special symbol'}`:''}}
const volt=k=>{const r=sim.f(k);return sim.cn&&sim.cn.has(r)?sim.Vn.get(r).toFixed(1)+' V':'Floating'};
