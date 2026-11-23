/* Circu: About card (click the logo): version and developer */
'use strict';
function showAbout(){$('#about').style.display='grid'}
function closeAbout(){$('#about').style.display='none'}
$('#ver').textContent='Version '+VERSION;$('#dev').textContent=DEV;
