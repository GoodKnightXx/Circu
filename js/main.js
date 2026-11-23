/* Circu: Startup: initial view and first render (must load last) */
'use strict';
if(innerWidth<700)togSide();fit();refresh();addEventListener('resize',()=>{if(!userView)fit()});
