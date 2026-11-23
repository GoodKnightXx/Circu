/* Circu: 6f. SAVE / LOAD: dialog, loadTxt validation */
'use strict';
const dlgData=()=>JSON.stringify({app:'Circu',version:VERSION,name:$('#pname').value,parts:S.parts,wires:S.wires,nid:ID});
const safeName=n=>String(n).trim().replace(/[\\\/:*?"<>|\x00-\x1f]+/g,'').replace(/\s+/g,'_').replace(/\.(circu\.)?json$/i,'').slice(0,60)||'circuit';
function dlgTab(save){$('#pS').hidden=!save;$('#pL').hidden=!!save;$('#tabS').classList.toggle('on',!!save);$('#tabL').classList.toggle('on',!save);$('#dst').textContent='';if(save){$('#ta').value=dlgData();$('#fnm').value=safeName($('#pname').value)}}
function openDlg(save){$('#dlg').style.display='grid';$('#fname').textContent='No file chosen';$('#lt').value='';dlgTab(save)}
function closeDlg(){$('#dlg').style.display='none'}
/* Save as file: downloads <name>.circu.json (same JSON the Load tab accepts) */
function saveFile(){const n=safeName($('#fnm').value),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([dlgData()],{type:'application/json'}));a.download=n+'.circu.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);$('#dst').textContent='Saved '+n+'.circu.json (check your Downloads folder).'}
function copyTxt(){const t=$('#ta'),ok=()=>$('#dst').textContent='Copied to clipboard.';t.select();navigator.clipboard?navigator.clipboard.writeText(t.value).then(ok,()=>{document.execCommand('copy');ok()}):(document.execCommand('copy'),ok())}
function loadTxt(t){let o,ps,ws;try{o=JSON.parse(t);if(!o||!Array.isArray(o.parts)||!Array.isArray(o.wires))throw 0;const seen=new Set();let mx=0;o.parts.forEach(p=>{if(p&&+p.id>mx)mx=+p.id});
 ps=o.parts.map(p=>{if(!p||!T[p.type]||!isFinite(p.x)||!isFinite(p.y))throw 0;let id=+p.id;if(!(id>0)||seen.has(id))id=++mx;seen.add(id);return{id,type:p.type,x:+p.x,y:+p.y,rot:(p.rot|0)&3,v:Object.assign(T[p.type].v(),p.v&&typeof p.v=='object'?p.v:{})}});
 ws=o.wires.map(w=>{if(!w||!Array.isArray(w.a)||!Array.isArray(w.b)||w.a.length<2||w.b.length<2||!isFinite(w.a[0]+w.a[1]+w.b[0]+w.b[1]))throw 0;const q={a:[+w.a[0],+w.a[1]],b:[+w.b[0],+w.b[1]],c:typeof w.c=='string'?w.c:'#e5484d'};if(Array.isArray(w.pts))q.pts=w.pts.filter(z=>Array.isArray(z)&&isFinite(z[0]+z[1])).map(z=>[+z[0],+z[1]]);return q});
 ps.forEach(p=>{const n=T[p.type].v().on;if(n&&(!Array.isArray(p.v.on)||p.v.on.length!=n.length))p.v.on=n})}catch(x){toast("That text doesn't look like a saved circuit.");return}
 act(()=>{S.parts=ps;S.wires=ws;ID=Math.max(+o.nid||0,...ps.map(p=>p.id))+1;$('#pname').value=o.name||'Loaded';S.sel.clear();burned.clear()});$('#dlg').style.display='none'}
function openFile(f){if(!f)return;$('#fname').textContent=f.name;f.text().then(loadTxt)}
$('#fl').onchange=e=>{openFile(e.target.files[0]);e.target.value=''};
$('#dlg').addEventListener('dragover',e=>e.preventDefault());
$('#dlg').addEventListener('drop',e=>{e.preventDefault();const f=e.dataTransfer&&e.dataTransfer.files[0];if(f){dlgTab(0);openFile(f)}});
