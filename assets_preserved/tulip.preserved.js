
(function(){
  try {
    if (location.protocol === 'file:') {
      document.documentElement.innerHTML = '<body style="font-family:system-ui;padding:24px">Локальна копія вимкнена. Використовуйте сайт через опубліковану адресу.</body>';
      throw new Error('Blocked on file://');
    }
  } catch(e) {}
})();

window.API_BASE = window.API_BASE || "https://floral-firefly-15b5.oleksandrmulyar.workers.dev";
window.USE_REMOTE_API = true;



// Fallback listeners (in case inline onclick is stripped by a CSP)
(function(){
  function show(){var p=document.getElementById('__info_panel'), b=document.getElementById('__info_back'); if(p&&b){p.style.display='block';b.style.display='block';document.body.style.overflow='hidden';}}
  function hide(){var p=document.getElementById('__info_panel'), b=document.getElementById('__info_back'); if(p&&b){p.style.display='none';b.style.display='none';document.body.style.overflow='';}}
  var btn=document.getElementById('__info_btn'); if(btn){ btn.addEventListener('click', show); }
  var x=document.getElementById('__info_close'); if(x){ x.addEventListener('click', hide); }
  var bd=document.getElementById('__info_back'); if(bd){ bd.addEventListener('click', hide); }
  window.addEventListener('keydown', function(e){ if(e.key==='Escape') hide(); });
})();



const W=675, H=905;
const sectorBoxes={"Base": {"x": 378, "y": 64, "w": 268, "h": 214}, "Mid": {"x": 378, "y": 330, "w": 268, "h": 214}, "Apex": {"x": 388, "y": 610, "w": 250, "h": 190}};
const leftBoxes={"Sagittal": {"x": 40, "y": 38, "w": 248, "h": 338}, "Coronal": {"x": 46, "y": 414, "w": 250, "h": 342}};
const initialPolys={"Base":{"R":{"PZa":[[0.0,0.08],[0.1,0.02],[0.2,0.02],[0.22,0.12],[0.2,0.22],[0.06,0.22]],"PZpl":[[0.0,0.34],[0.08,0.3],[0.2,0.3],[0.22,0.46],[0.18,0.58],[0.06,0.6],[0.0,0.52]],"PZpm":[[0.2,0.46],[0.3,0.44],[0.3,0.64],[0.18,0.64]],"TZa":[[0.08,0.06],[0.36,0.06],[0.36,0.24],[0.08,0.24]],"TZp":[[0.08,0.28],[0.36,0.28],[0.36,0.54],[0.08,0.54]],"CZ":[[0.12,0.6],[0.34,0.6],[0.28,0.88],[0.16,0.88]]},"L":{"PZa":[[0.8,0.02],[0.9,0.02],[1.0,0.08],[1.0,0.22],[0.94,0.22],[0.8,0.12]],"PZpl":[[0.8,0.3],[0.92,0.3],[1.0,0.34],[1.0,0.52],[0.94,0.6],[0.82,0.58],[0.78,0.46]],"PZpm":[[0.7,0.44],[0.8,0.46],[0.82,0.64],[0.7,0.64]],"TZa":[[0.58,0.06],[0.86,0.06],[0.86,0.24]],"TZp":[[0.58,0.28],[0.86,0.28],[0.86,0.54]],"CZ":[[0.66,0.6],[0.88,0.6],[0.82,0.88],[0.7,0.88]]},"C":{"AS":[[0.46,0.04],[0.54,0.04],[0.54,0.22],[0.46,0.22]]}},"Mid":{"R":{"PZa":[[0.0,0.1],[0.1,0.04],[0.2,0.04],[0.22,0.16],[0.18,0.24],[0.06,0.24]],"PZpl":[[0.0,0.36],[0.1,0.34],[0.22,0.36],[0.22,0.54],[0.16,0.64],[0.06,0.64],[0.0,0.54]],"PZpm":[[0.22,0.54],[0.34,0.56],[0.3,0.7],[0.18,0.66]],"TZa":[[0.1,0.08],[0.36,0.08],[0.36,0.26]],"TZp":[[0.1,0.3],[0.36,0.3],[0.36,0.56]]},"L":{"PZa":[[0.8,0.04],[0.9,0.04],[1.0,0.1],[1.0,0.24],[0.94,0.24],[0.82,0.16]],"PZpl":[[0.78,0.36],[0.9,0.34],[1.0,0.36],[1.0,0.54],[0.94,0.64],[0.84,0.64],[0.78,0.54]],"PZpm":[[0.7,0.56],[0.82,0.54],[0.86,0.66],[0.74,0.7]],"TZa":[[0.58,0.08],[0.84,0.08],[0.84,0.26]],"TZp":[[0.58,0.3],[0.84,0.3],[0.84,0.56]]},"C":{"AS":[[0.46,0.02],[0.54,0.02],[0.54,0.2],[0.46,0.2]]}},"Apex":{"R":{"PZa":[[0.0,0.12],[0.1,0.06],[0.22,0.08],[0.22,0.2],[0.1,0.22]],"PZpl":[[0.0,0.36],[0.12,0.34],[0.22,0.4],[0.2,0.58],[0.1,0.6],[0.02,0.52]],"PZpm":[[0.22,0.46],[0.32,0.46],[0.32,0.6],[0.22,0.58]],"TZa":[[0.12,0.14],[0.36,0.14],[0.36,0.34]],"TZp":[[0.12,0.36],[0.36,0.36],[0.36,0.56]]},"L":{"PZa":[[0.78,0.08],[0.9,0.06],[1.0,0.12],[0.94,0.22],[0.82,0.2]],"PZpl":[[0.78,0.4],[0.88,0.34],[1.0,0.36],[0.98,0.52],[0.9,0.6],[0.8,0.58]],"PZpm":[[0.68,0.46],[0.78,0.46],[0.78,0.58],[0.68,0.6]],"TZa":[[0.58,0.14],[0.82,0.14],[0.82,0.34]],"TZp":[[0.58,0.36],[0.82,0.36],[0.82,0.56]]},"C":{"AS":[[0.46,0.02],[0.54,0.02],[0.54,0.18],[0.46,0.18]]}}};
const AX_SHIFT=0.3;

let polys = JSON.parse(localStorage.getItem('pirads21_polys_v635')||'null') || initialPolys;
let state = JSON.parse(localStorage.getItem('pirads21_state_v635')||'null') || {
  "_ver":"6.3.5",
  "active":1,
  "colors":{"1":"#ff6b6b","2":"#4dabf7","3":"#38d9a9","4":"#ffd43b","5":"#845ef7"},
  "lesions":{"1":{"sectors":[],"tr":"","ap":"","cc":"","t2":"","dwi":"","DCE":"","ellipses":{}},
             "2":{"sectors":[],"tr":"","ap":"","cc":"","t2":"","dwi":"","DCE":"","ellipses":{}},
             "3":{"sectors":[],"tr":"","ap":"","cc":"","t2":"","dwi":"","DCE":"","ellipses":{}},
             "4":{"sectors":[],"tr":"","ap":"","cc":"","t2":"","dwi":"","DCE":"","ellipses":{}},
             "5":{"sectors":[],"tr":"","ap":"","cc":"","t2":"","dwi":"","DCE":"","ellipses":{}}},
  "prostate":{"tr":"","ap":"","cc":""},
  "offset":{"SagittalX":0,"SagittalY":0,"CoronalX":0,"CoronalY":0}
};

// Normalize legacy DCE -> dce once
try{
  for (let k of ['1','2','3','4','5']){
    const L = state.lesions && state.lesions[k];
    if (!L) continue;
    if (L.DCE && !L.dce){
      L.dce = (L.DCE==='+'||L.DCE==='pos')?'pos':(L.DCE==='-'||L.DCE==='neg')?'neg':'';
    }
    if (L.dce===undefined) L.dce='';
  }
  save && save();
}catch(_){}
function save(){ localStorage.setItem('pirads21_state_v635', JSON.stringify(state)); }
function savePolys(){ localStorage.setItem('pirads21_polys_v635', JSON.stringify(polys)); }

const svg=document.getElementById('overlay');
let editMode=false, editSectorId=null, dragging=null, ellipseEdit=false;

function allSectors(){ const out=[]; ['Base','Mid','Apex'].forEach(s=>{ ['R','L','C'].forEach(side=>{ if(!polys[s][side]) return; Object.keys(polys[s][side]).forEach(code=>{ out.push({"id":(s+':'+side+':'+code),"slice":s,"side":side,"code":code}); }); }); }); return out; }
function absPoints(id){ const [slice,side,code]=id.split(':'); const b=sectorBoxes[slice]; return polys[slice][side][code].map(p=>[b.x+p[0]*b.w, b.y+(p[1]+AX_SHIFT)*b.h]); }
function hexToRgba(hex,a){ const m=hex.replace('#',''); const v=parseInt(m,16); const r=(v>>16)&255,g=(v>>8)&255,b=v&255; return `rgba(${r},${g},${b},${a})`; }

function zoneCounts(ids){
  const z={PZ:0,TZ:0,CZ:0,AS:0};
  (ids||[]).forEach(id=>{
    if(id.indexOf(':PZ')>=0) z.PZ++;
    if(id.indexOf(':TZ')>=0) z.TZ++;
    if(id.indexOf(':CZ')>=0) z.CZ++;
    if(id.indexOf(':AS')>=0) z.AS++;
  });
  return z;
}
function pickZoneLabel(z){
  const tzAll = z.TZ + z.AS;
  const arr=[['PZ',z.PZ],['TZ',tzAll],['CZ',z.CZ]]; arr.sort((a,b)=>b[1]-a[1]);
  const [zn,_]=arr[0];
  if(zn==='PZ') return 'PZ';
  if(zn==='TZ') return 'TZ';
  if(zn==='CZ') return 'CZ/AS';
  return '—';
}

function getZoneAndPi(n){
  const L = state.lesions[String(n)] || {};
  const z = zoneCounts(L.sectors||[]);
  const zone = pickZoneLabel(z); // 'PZ', 'TZ', 'CZ/AS', '—'
  const t2  = parseInt(L.t2||'0',10);
  const dwi = parseInt(L.dwi||'0',10);
  const dce = (L.dce===true || L.dce===1 || String(L.dce).toLowerCase()==='pos' || String(L.dce).toLowerCase()==='+');
  const tr = parseFloat(L.tr||0), ap = parseFloat(L.ap||0), cc = parseFloat(L.cc||0);
  const maxDim = Math.max(tr||0, ap||0, cc||0);

  if ((z.PZ + z.TZ + z.CZ + z.AS) === 0) return { zone: '—', pi: '—' };

  function applySize(pi){
    if (pi>=4 && maxDim>=15) return 5;
    return pi;
  }

  let pi = '—';
  if (zone === 'PZ'){
    // primary DWI with DCE upgrade rule for 3
    if (dwi<=0){ pi='—'; }
    else if (dwi===1){ pi=1; }
    else if (dwi===2){ pi=2; }
    else if (dwi===3){ pi = dce ? 4 : 3; }
    else if (dwi===4){ pi=4; }
    else if (dwi>=5){ pi=5; }
    pi = applySize(pi);
  } else if (zone === 'TZ' || zone === 'CZ/AS'){
    // primary T2 with DWI modification for T2=2 and T2=3 (per v2.1)
    if (t2<=0){ pi='—'; }
    else if (t2===1){ pi=1; }
    else if (t2===2){ pi = (dwi>=4 ? 3 : 2); }
    else if (t2===3){ pi = (dwi>=5 ? 4 : 3); }
    else if (t2===4){ pi=4; }
    else if (t2>=5){ pi=5; }
    pi = applySize(pi);
  } else {
    // mixed/unknown -> fallback
    const primary = Math.max(t2||0, dwi||0);
    if (primary<=0){ pi='—'; }
    else if (primary===1){ pi=1; }
    else if (primary===2){ pi=2; }
    else if (primary===3){ pi=3; }
    else if (primary===4){ pi=4; }
    else if (primary>=5){ pi=5; }
    pi = applySize(pi);
  }

  return { zone, pi };
}

function getClientXY(evt){
  const r=svg.getBoundingClientRect();
  const cX = (evt.clientX!==undefined)? evt.clientX : (evt.touches? evt.touches[0].clientX:0);
  const cY = (evt.clientY!==undefined)? evt.clientY : (evt.touches? evt.touches[0].clientY:0);
  return {x: cX - r.left, y: cY - r.top};
}

function draw(){
  while(svg.firstChild) svg.removeChild(svg.firstChild);
  drawEllipses();
  allSectors().filter(sec=>!(sec.code==='CZ'&&(sec.slice==='Mid'||sec.slice==='Apex'))).forEach(sec=>{
    const pts=absPoints(sec.id);
    const pstr=pts.map(p=>p[0]+','+p[1]).join(' ');
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    const poly=document.createElementNS('http://www.w3.org/2000/svg','polygon');
    poly.setAttribute('points',pstr); poly.setAttribute('class','sector-shape'); poly.dataset.id=sec.id;
    poly.addEventListener('pointerdown',function(e){
      const xy=getClientXY(e);
      if(editMode){ startEdit(sec.id); if(e.shiftKey) addPointAtCursor(sec.id,xy.x,xy.y); }
      else toggle(sec.id);
      e.preventDefault();
    });
    g.appendChild(poly);
    let cx=0, cy=0; pts.forEach(p=>{cx+=p[0]; cy+=p[1];}); cx/=pts.length; cy/=pts.length;
    const lab=document.createElementNS('http://www.w3.org/2000/svg','text');
    lab.setAttribute('x',cx); lab.setAttribute('y',cy); lab.setAttribute('font-size','10'); lab.setAttribute('fill','#000'); lab.setAttribute('text-anchor','middle'); lab.setAttribute('style','pointer-events:none');
    lab.textContent=sec.slice+' '+sec.side+' '+sec.code; g.appendChild(lab); svg.appendChild(g);
  });
  paint();
  if(editMode && editSectorId) renderHandles(editSectorId);
}

function paint(){
  svg.querySelectorAll('.sector-shape').forEach(el=>{ el.style.fill='rgba(0,0,0,0)'; el.style.strokeDasharray='4 4'; el.style.stroke='rgba(0,0,0,0.35)'; });
  [1,2,3,4,5].forEach(n=>{ const col=state.colors[String(n)]; (state.lesions[String(n)].sectors||[]).forEach(id=>{ const el=svg.querySelector('.sector-shape[data-id="'+id+'"]'); if(el){ el.style.fill=hexToRgba(col,0.35); el.style.stroke=col; el.style.strokeDasharray='none'; } }); });
}

function toggle(id){ const L=state.lesions[String(state.active)]; const i=L.sectors.indexOf(id); if(i>=0) L.sectors.splice(i,1); else L.sectors.push(id); save(); buildTable(); paint(); }

function hasLesionDims(L){ return [L.tr,L.ap,L.cc].every(v=>parseFloat(v)>0); }
function hasProstateDims(){ const P=state.prostate; return [P.tr,P.ap,P.cc].every(v=>parseFloat(v)>0); }
function dominantSlice(sectorIds){ const score={Base:0,Mid:0,Apex:0}; sectorIds.forEach(id=>{ const s=id.split(':')[0]; if(score[s]!==undefined) score[s]++; }); let best='Mid', m=-1; Object.keys(score).forEach(k=>{ if(score[k]>m){ m=score[k]; best=k; } }); return best; }

function autoEllipse(n){
  const L = state.lesions[String(n)];

  // Remove Central Zone (CZ) on MID/APEX for all projections (exists only at BASE)
  try{
    if (L && Array.isArray(L.sectors)){
      L.sectors = L.sectors.filter(id=>{
        const parts = String(id).split(':');
        const level = (parts[0]||'').toUpperCase();
        const code  = (parts[2]||'').toUpperCase();
        return !(code==='CZ' && level!=='BASE');
      });
    }
  }catch(_){}

  if(!L || !(L.sectors||[]).length || !hasProstateDims()) return null;

  // --- Rotation (per plane) ---
  const rotSagDeg = (L && (L.rotSagDeg||L.rot_sag_deg||L.rotDeg)) || 0;
  const rotCorDeg = (L && (L.rotCorDeg||L.rot_cor_deg||L.rotDeg)) || 0;
  const rotSag = (typeof rotSagDeg==='number') ? (rotSagDeg*Math.PI/180) : 0;
  const rotCor = (typeof rotCorDeg==='number') ? (rotCorDeg*Math.PI/180) : 0;
// --- CC position by dominant axial slice ---
  const slice = dominantSlice(L.sectors);
  const baseBandsSag = { Base:0.70, Mid:0.85, Apex:0.95 };
  const baseBandsCor = { Base:0.925, Mid:0.993, Apex:0.999 };

  // --- Axial→Projection mapping (refined) ---
  // AP fractions for sagittal X (0=anterior, 1=posterior)
  const AP_MAP = { AS:0.10, TZA:0.25, PZA:0.45, CZ:0.55, TZP:0.65, PZPM:0.90, PZPL:0.85 };
  // Intra‑lobe lateral for coronal X (0..1 within a lobe; 0.5 = medial)
  const LAT_INTRA = { AS:0.55, TZA:0.38, TZP:0.35, CZ:0.34, PZA:0.75, PZPM:0.40, PZPL:0.95 };
  let hasL=false, hasR=false, apSum=0, apCnt=0, latSum=0, latCnt=0;
  
  // Coronal special-case flag: if ONLY Apex-level PZPL selected, treat as PZPM (medial) on coronal
  let remapPZPLtoPZPM = false;
  try{
    if (L && Array.isArray(L.sectors)){
      let hasBase=false, hasMid=false, hasApex=false, onlyPZPL=true;
      L.sectors.forEach(id=>{
        const parts = String(id).split(':');
        const level = (parts[0]||'').toUpperCase();
        const code  = (parts[2]||'').toUpperCase();
        if (level.indexOf('BASE')===0) hasBase=true;
        else if (level.indexOf('APEX')===0 || level.indexOf('AP')===0) hasApex=true;
        else hasMid=true;
        if (code!=='PZPL') onlyPZPL=false;
      });
      if (hasApex && !hasBase && !hasMid && onlyPZPL){
        remapPZPLtoPZPM = true;
      }
    }
  }catch(_){}  
L.sectors.forEach(id=>{
    const [sl,side,codeRaw] = id.split(':');
  // --- Coronal special-case: if ONLY Apex-level PZPL is selected, render it like PZPM on coronal ---
  try{
    let hasBase=false, hasMid=false, hasApex=false, onlyPZPL=true;
    if (L && Array.isArray(L.sectors)){
      L.sectors.forEach(id=>{
        const parts = String(id).split(':');
        const level = (parts[0]||'').toUpperCase();
        const code  = (parts[2]||'').toUpperCase();
        if (level.indexOf('BASE')===0) hasBase=true;
        else if (level.indexOf('APEX')===0 || level.indexOf('AP')===0) hasApex=true;
        else hasMid=true;
        if (code!=='PZPL') onlyPZPL=false;
      });
      if (hasApex && !hasBase && !hasMid && onlyPZPL){
        // Recompute lateral sum treating PZPL as PZPM
        latSum = 0; latCnt = 0;
        L.sectors.forEach(id=>{
          const codeRaw = (String(id).split(':')[2]||'').toUpperCase();
          const mapped  = (codeRaw==='PZPL') ? 'PZPM' : codeRaw;
          if (LAT_INTRA.hasOwnProperty(mapped)){ latSum += LAT_INTRA[mapped]; latCnt++; }
        });
      }
    }
  }catch(_){}

    const code = (codeRaw||'').toUpperCase();
    if(side==='L') hasL=true; else if(side==='R') hasR=true;
    if(AP_MAP.hasOwnProperty(code)){ apSum += AP_MAP[code]; apCnt++; }
    const codeEff = (remapPZPLtoPZPM && code==='PZPL') ? 'PZPM' : code; if(LAT_INTRA.hasOwnProperty(codeEff)){ latSum += LAT_INTRA[codeEff]; latCnt++; }
  });
  const apFrac = apCnt? (apSum/apCnt) : 0.50;
  // side centers (radiologic): L→0.75, R→0.25, bilateral→0.50
  const sideCenter = (hasL && !hasR) ? 0.75 : ((hasR && !hasL) ? 0.25 : 0.50);
  const intra = latCnt? (latSum/latCnt) : 0.50;   // 0..1
  const lobeHalf = 0.5;                           // half of full width
  const nearEdge = 0.600;                          // reach near lobe edge
  const sideDir = (hasL && !hasR) ? +1 : ((hasR && !hasL) ? -1 : 0);
  const lat = sideCenter + sideDir * (intra-0.5) * lobeHalf * nearEdge;
  // map AP into usable band on sagittal width (makes ellipse live inside the prostate band)
  let apPos = 0.28 + 0.44 * apFrac;

  // --- Sagittal per-level/per-sector offsets (AP and Vertical), averaged across selected sectors ---
  let __sagYDelta = 0;
  try{
    if (L && Array.isArray(L.sectors)){
      let sumAP=0, sumY=0, cnt=0;
      for (const sid of L.sectors){
        const parts = String(sid).split(':');
        const level = (parts[0]||'').toUpperCase();  // BASE / MID / APEX
        const code0 = (parts[2]||'').toUpperCase();  // TZA / TZP / PZPM / PZPL / PZA / CZ / AS
        // Map analogous codes per your rules
        let code = code0;
        if (level.indexOf('BASE')===0){
          if (code==='PZA') code='TZA';
          if (code==='PZPM' || code==='PZPL') code='CZ';
        } else if (level.indexOf('MID')===0){
          if (code==='PZA') code='TZA';
          if (code==='PZPL') code='PZPM';
        } else if (level.indexOf('APEX')===0 || level.indexOf('AP')===0){
          if (code==='PZA' || code==='TZA') code='AS';
          if (code==='PZPM' || code==='PZPL') code='TZP';
        }
        let dAP=0, dY=0;
        if (level.indexOf('BASE')===0){
          if (code==='TZA' || code==='AS'){ dAP -= 0.11; dY -= 0.28; }
          else if (code==='TZP'){ dAP -= 0.07; dY -= 0.18; }
          else if (code==='CZ'){ dAP += 0.11; dY -= 0.24; }
        } else if (level.indexOf('MID')===0){
          if (code==='TZA'){ dAP -= 0.18; dY -= 0.18; }
          else if (code==='AS'){ dAP -= 0.22; dY -= 0.18; }
          else if (code==='TZP'){ dAP -= 0.11; dY -= 0.13; }
          else if (code==='PZPM'){ dAP -= 0.06; dY -= 0.10; }
        } else if (level.indexOf('APEX')===0 || level.indexOf('AP')===0){
          if (code==='AS'){ dAP -= 0.16; dY += 0.03; }
          else if (code==='TZP'){ dAP -= 0.16; dY += 0.01; }
        }
        
        // --- Specific sagittal overrides per your latest instructions ---
        (function(){
          const LVL_BASE = level.indexOf('BASE')===0;
          const LVL_MID  = level.indexOf('MID')===0;
          const LVL_APEX = (level.indexOf('APEX')===0 || level.indexOf('AP')===0);
          const RAW = code0; // use original code names for targeted tweaks

          // BASE
          if (LVL_BASE && RAW==='PZA')  { dAP += -0.08; }     // forward +8%
          if (LVL_BASE && RAW==='PZPL') { dAP += -0.07; }     // forward +7%
          if (LVL_BASE && RAW==='PZPM') { dAP += -0.10; }     // forward +10%

          // MID
          if (LVL_MID  && RAW==='PZA')  { dAP += -0.12; }     // forward +12%

          // APEX
          if (LVL_APEX && RAW==='AS')   { dY  += -0.05; }     // higher +5%
          if (LVL_APEX && RAW==='TZA')  { dAP += -0.07; dY += -0.05; } // +7% forward, +5% higher
          if (LVL_APEX && RAW==='PZA')  { dAP += -0.15; dY += -0.05; } // +15% forward, +5% higher
          if (LVL_APEX && RAW==='PZPM') { dAP += -0.08; }     // +8% forward
        })();
sumAP += dAP; sumY += dY; cnt++;
      }
      if (cnt>0){
        apPos += (sumAP/cnt);
        if (apPos < 0.01) apPos = 0.01;
        if (apPos > 0.99) apPos = 0.99;
        __sagYDelta = (sumY/cnt);
      }
    }
  }catch(_){}

  // --- Boxes for left drawings ---
  const sag = leftBoxes['Sagittal'], cor = leftBoxes['Coronal'];

  // --- Offsets from UI (fractions, default 0) ---
  const offSX=(state.offset.SagittalX||0), offSY=(state.offset.SagittalY||0);
  const offCX=(state.offset.CoronalX||0), offCY=(state.offset.CoronalY||0);

  // --- Centers ---
  const sag_cx = sag.x + (apPos + offSX) * sag.w;
  let sag_cy = sag.y + (baseBandsSag[slice] + offSY) * sag.h; sag_cy += 0;

  
  // --- Average sagittal Y across levels if multiple levels are selected ---
  try{
    if (L && Array.isArray(L.sectors)){
      let cntB=0, cntM=0, cntA=0;
      for (const sid of L.sectors){
        const level = String(sid).split(':')[0].toUpperCase();
        if (level.indexOf('BASE')===0) cntB++;
        else if (level.indexOf('APEX')===0 || level.indexOf('AP')===0) cntA++;
        else cntM++;
      }
      const total = cntB + cntM + cntA;
      if (total>0 && (cntB>0 && cntM>0 || cntB>0 && cntA>0 || cntM>0 && cntA>0)){
        const baseAvg = (
          cntB*baseBandsSag.Base + cntM*baseBandsSag.Mid + cntA*baseBandsSag.Apex
        ) / total;
        let frac = baseAvg + offSY;
        if (cntB>0 && cntM>0 && cntA>0){
          // All three levels selected → no extra downward shift (was 10%)
          // frac += 0.00;
        }
        if (frac < 0.01) frac = 0.01;
        if (frac > 0.99) frac = 0.99;
        sag_cy = sag.y + frac * sag.h;
      }
    }
  }catch(_){}
// --- Apply sagittal vertical delta ---
  try{
    if (typeof __sagYDelta === 'number'){
      let f = (sag_cy - sag.y)/sag.h;
      f += __sagYDelta;
      if (f < 0.01) f = 0.01;
      if (f > 0.99) f = 0.99;
      sag_cy = sag.y + f * sag.h;
    }
  }catch(_){}

  const cor_cx = cor.x + (lat    + offCX) * cor.w;
  let cor_cy = cor.y + (baseBandsCor[slice] + offCY) * cor.h; cor_cy += 0;

  
  // --- Coronal: ALL sectors vertical offsets (AVERAGE across levels; Base +21%, Mid +6%, Apex -13%) ---
  try{
    if (L && Array.isArray(L.sectors)) {
      let cntB=0, cntM=0, cntA=0;
      for (const sid of L.sectors){
        const level = String(sid).split(':')[0].toUpperCase();
        if (level.indexOf('BASE')===0) cntB++;
        else if (level.indexOf('APEX')===0 || level.indexOf('AP')===0) cntA++;
        else cntM++;
      }
      const total = cntB + cntM + cntA;
      if (total > 0){
        const delta = (cntB*(-0.21) + cntM*(-0.06) + cntA*(+0.13)) / total;
        let frac = (cor_cy - cor.y) / cor.h;
        frac += delta;
        if (!isNaN(frac)) {
          if (cntA > 0) {
            if (frac < -0.50) frac = -0.50;
            if (frac >  1.50) frac =  1.50;
          } else {
            if (frac < 0.01) frac = 0.01;
            if (frac > 0.99) frac = 0.99;
          }
          cor_cy = cor.y + frac * cor.h;
        }
      }
    }
  }catch(_){}
// --- Size scaling (proportional to prostate; corrected correlation) ---
  const pTR=parseFloat(state.prostate.tr||0), pAP=parseFloat(state.prostate.ap||0), pCC=parseFloat(state.prostate.cc||0);
  const tr=parseFloat(L.tr), ap=parseFloat(L.ap), cc=parseFloat(L.cc);
  // px per mm derived from prostate dimensions per projection
  const sag_px_x = pAP>0? sag.w/pAP : 0, sag_px_y = pCC>0? sag.h/pCC : 0;
  const cor_px_x = pTR>0? cor.w/pTR : 0, cor_px_y = pCC>0? cor.h/pCC : 0;
  // Radii strictly from mm→px; clamp only by view box (no arbitrary 60px cap)
  function clamp(v, maxR){ return Math.max(2, Math.min(maxR, v||2)); }
  const maxSagR = Math.min(sag.w, sag.h) * 0.45;
  const maxCorR = Math.min(cor.w, cor.h) * 0.45;
  const rsx = clamp(sag_px_x*ap/2, maxSagR), rsy = clamp(sag_px_y*cc/2, maxSagR);
  const rcx = clamp(cor_px_x*tr/2, maxCorR), rcy = clamp(cor_px_y*cc/2, maxCorR);
// Fallback sizes if lesion TR/AP/CC are missing → draw small visible ellipse
  try{
    ['Sagittal','Coronal'].forEach(v=>{
      const E = out[v];
      if(!E) return;
      if(!(E.rx>0)) E.rx = Math.max(2, 0.08 * (v==='Sagittal' ? sag.w : cor.w));
      if(!(E.ry>0)) E.ry = Math.max(2, 0.08 * (v==='Sagittal' ? sag.h : cor.h));
    });
  }catch(_){}
return { "Sagittal": {"cx":sag_cx,"cy":sag_cy,"rx":rsx,"ry":rsy,"rot":rotSag},
           "Coronal":{"cx":cor_cx,"cy":cor_cy,"rx":rcx,"ry":rcy,"rot":rotCor} };
}

function ensureEllipse(n){ const L=state.lesions[String(n)]; if(!L.ellipses) L.ellipses={}; ['Sagittal','Coronal'].forEach(v=>{ if(!L.ellipses[v]){ const A=autoEllipse(n); if(A) L.ellipses[v]=A[v]; } }); save(); }

function drawEllipses(){
  for(let n=1;n<=5;n++){
    const L=state.lesions[String(n)]; if(!L.sectors.length || !hasProstateDims()) continue;
    ensureEllipse(n); const color=state.colors[String(n)];
    const info=getZoneAndPi(n);
    for(const view of ['Sagittal','Coronal']){
      const E=L.ellipses[view]; if(!E) continue;
      const ellFill=document.createElementNS('http://www.w3.org/2000/svg','ellipse');
      ellFill.setAttribute('cx',E.cx); ellFill.setAttribute('cy',E.cy); ellFill.setAttribute('rx',E.rx); ellFill.setAttribute('ry',E.ry);
      ellFill.setAttribute('fill', hexToRgba(color,0.35));
      if(E.rot){ ellFill.setAttribute('transform','rotate('+(E.rot*180/Math.PI)+' '+E.cx+' '+E.cy+')'); } ellFill.setAttribute('class','ellipse-fill'); svg.appendChild(ellFill);
      const ellStroke=document.createElementNS('http://www.w3.org/2000/svg','ellipse');
      ellStroke.setAttribute('cx',E.cx); ellStroke.setAttribute('cy',E.cy); ellStroke.setAttribute('rx',E.rx); ellStroke.setAttribute('ry',E.ry);
      ellStroke.setAttribute('fill','none');
      if(E.rot){ ellStroke.setAttribute('transform','rotate('+(E.rot*180/Math.PI)+' '+E.cx+' '+E.cy+')'); } ellStroke.setAttribute('stroke', color); ellStroke.setAttribute('stroke-width','2'); ellStroke.setAttribute('class','ellipse-stroke'); svg.appendChild(ellStroke);
      const txt=document.createElementNS('http://www.w3.org/2000/svg','text');
      txt.setAttribute('x',E.cx); txt.setAttribute('y',E.cy+4); txt.setAttribute('text-anchor','middle'); txt.setAttribute('font-weight','700'); txt.setAttribute('font-size','14');
      txt.setAttribute('fill','#fff'); txt.setAttribute('stroke','#000'); txt.setAttribute('stroke-width','2'); txt.setAttribute('paint-order','stroke'); txt.setAttribute('style','pointer-events:none');
      const piTxt = (info.pi && info.pi!=='—') ? ('PI-RADS '+info.pi) : 'PI-RADS —';
      txt.textContent = piTxt; svg.appendChild(txt);
      if(ellipseEdit) addEllipseHandles(n, view, color);
    }
  }
}

function addEllipseHandles(n, view, color){
  const L=state.lesions[String(n)]; const E=L.ellipses[view]; if(!E) return;
  function mk(x,y,cur){ const c=document.createElementNS('http://www.w3.org/2000/svg','rect'); c.setAttribute('x',x-5); c.setAttribute('y',y-5); c.setAttribute('width',10); c.setAttribute('height',10); c.setAttribute('class','resize-handle'); c.addEventListener('pointerdown', function(e){ const r=svg.getBoundingClientRect(); const x2=e.clientX-r.left, y2=e.clientY-r.top; dragging={type:'ellipse-handle', lesion:n, view:view, handle:cur, dx:x2-x, dy:y2-y}; }); svg.appendChild(c); }
  const center=document.createElementNS('http://www.w3.org/2000/svg','circle'); center.setAttribute('cx',E.cx); center.setAttribute('cy',E.cy); center.setAttribute('r',6); center.setAttribute('fill','#fff'); center.setAttribute('stroke',color); center.addEventListener('pointerdown', function(e){ const r=svg.getBoundingClientRect(); dragging={type:'ellipse-center', lesion:n, view:view, dx:e.clientX-r.left-E.cx, dy:e.clientY-r.top-E.cy}; }); svg.appendChild(center);
  mk(E.cx+E.rx, E.cy, 'east'); mk(E.cx-E.rx, E.cy, 'west'); mk(E.cx, E.cy-E.ry, 'north'); mk(E.cx, E.cy+E.ry, 'south');
}

svg.addEventListener('pointermove', function(e){
  if(!dragging) return;
  if(dragging.type==='handle'){
    const id=dragging.id, idx=dragging.idx;
    const r=svg.getBoundingClientRect(); const x=e.clientX-r.left-dragging.dx, y=e.clientY-r.top-dragging.dy;
    const [slice,side,code]=id.split(':'); const b=sectorBoxes[slice];
    polys[slice][side][code][idx] = [(x-b.x)/b.w, (y-b.y)/b.h - AX_SHIFT];
    savePolys(); draw(); renderHandles(id);
  } else if (dragging.type==='ellipse-center'){
    const L=state.lesions[String(dragging.lesion)]; const E=L.ellipses[dragging.view]; const r=svg.getBoundingClientRect();
    E.cx = e.clientX-r.left-dragging.dx; E.cy = e.clientY-r.top-dragging.dy; save(); draw();
  } else if (dragging.type==='ellipse-handle'){
    const L=state.lesions[String(dragging.lesion)]; const E=L.ellipses[dragging.view]; const r=svg.getBoundingClientRect();
    const x = e.clientX-r.left-dragging.dx, y = e.clientY-r.top-dragging.dy;
    if(dragging.handle==='east' || dragging.handle==='west') E.rx = Math.max(4, Math.abs(x - E.cx));
    if(dragging.handle==='north' || dragging.handle==='south') E.ry = Math.max(4, Math.abs(y - E.cy));
    save(); draw();
  }
});
window.addEventListener('pointerup', function(){ dragging=null; });

function startEdit(id){ editSectorId=id; renderHandles(id); }
function clearHandles(){ svg.querySelectorAll('.handle').forEach(h=>h.remove()); }
function renderHandles(id){
  clearHandles();
  const [slice,side,code]=id.split(':');
  polys[slice][side][code].forEach(function(rp, idx){
    const b=sectorBoxes[slice]; const x=b.x+rp[0]*b.w, y=b.y+(rp[1]+AX_SHIFT)*b.h;
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',5); c.setAttribute('class','handle');
    c.addEventListener('pointerdown', function(e){ const r=svg.getBoundingClientRect(); dragging = { type:'handle', id:id, idx:idx, dx:e.clientX-r.left-x, dy:e.clientY-r.top-y }; });
    c.addEventListener('click', function(e){ if(e.altKey && polys[slice][side][code].length>3){ polys[slice][side][code].splice(idx,1); savePolys(); draw(); renderHandles(id); } });
    svg.appendChild(c);
  });
}
function addPointAtCursor(id, x, y){
  const [slice,side,code]=id.split(':');
  const pts = polys[slice][side][code].map(function(p){ const b=sectorBoxes[slice]; return [b.x+p[0]*b.w, b.y+(p[1]+AX_SHIFT)*b.h]; });
  let bestI=0, bestD=1e9;
  for(let i=0;i<pts.length;i++){ const a=pts[i], b=pts[(i+1)%pts.length]; const A=x-a[0], B=y-a[1], C=b[0]-a[0], D=b[1]-a[1]; const dot=A*C+B*D, len=C*C+D*D; let t = len? dot/len : 0; t=Math.max(0,Math.min(1,t)); const nx=a[0]+t*C, ny=a[1]+t*D; const dx=x-nx, dy=y-ny; const d=Math.sqrt(dx*dx+dy*dy); if(d<bestD){bestD=d;bestI=i;} }
  const b=sectorBoxes[slice]; const rel=[(x-b.x)/b.w, (y-b.y)/b.h - AX_SHIFT];
  polys[slice][side][code].splice(bestI+1, 0, rel);
  savePolys(); draw(); renderHandles(id);
}

// UI buttons
document.getElementById('toggleEdit').addEventListener('click', ()=>{ editMode=!editMode; editSectorId=null; clearHandles(); draw(); });
document.getElementById('toggleEllipseEdit').addEventListener('click', ()=>{ ellipseEdit=!ellipseEdit; draw(); });
document.getElementById('snapMarkers').addEventListener('click', ()=>{ [1,2,3,4,5].forEach(n=>{ const E=autoEllipse(n); if(!E) return; if(!state.lesions[String(n)].ellipses) state.lesions[String(n)].ellipses={}; state.lesions[String(n)].ellipses=E; }); save(); draw(); });

// Offsets controls
const offSagX=document.getElementById('offSagX'), offSagY=document.getElementById('offSagY'), offCorX=document.getElementById('offCorX'), offCorY=document.getElementById('offCorY');
const offSagXVal=document.getElementById('offSagXVal'), offSagYVal=document.getElementById('offSagYVal'), offCorXVal=document.getElementById('offCorXVal'), offCorYVal=document.getElementById('offCorYVal');
function signed(v){ v=parseInt(v||0,10); return (v>=0? '+'+v : ''+v) + '%'; }
function loadOffsetsUI(){ offSagX.value=Math.round((state.offset.SagittalX||0)*100); offSagY.value=Math.round((state.offset.SagittalY||0)*100); offCorX.value=Math.round((state.offset.CoronalX||0)*100); offCorY.value=Math.round((state.offset.CoronalY||0)*100); offSagXVal.textContent=signed(offSagX.value); offSagYVal.textContent=signed(offSagY.value); offCorXVal.textContent=signed(offCorX.value); offCorYVal.textContent=signed(offCorY.value); }
loadOffsetsUI();
function bindRange(inp,label,key){ inp.addEventListener('input', ()=>{ state.offset[key]=parseFloat(inp.value)/100; label.textContent=signed(inp.value); save(); draw(); }); }
bindRange(offSagX,offSagXVal,'SagittalX'); bindRange(offSagY,offSagYVal,'SagittalY'); bindRange(offCorX,offCorXVal,'CoronalX'); bindRange(offCorY,offCorYVal,'CoronalY');
document.getElementById('resetOffset').addEventListener('click', ()=>{ state.offset.SagittalX=-0.29; state.offset.SagittalY=0.77; state.offset.CoronalX=0.66; state.offset.CoronalY=0.09; save(); loadOffsetsUI(); draw(); });

// Chips & colors
document.getElementById('lesionChips').addEventListener('click', e=>{ const el=e.target.closest('.chip'); if(!el) return; document.querySelectorAll('#lesionChips .chip').forEach(c=>c.classList.remove('active')); el.classList.add('active'); state.active=parseInt(el.dataset.lesion,10); save(); });
['c1','c2','c3','c4','c5'].forEach((id,idx)=>{ const n=(idx+1).toString(); const inp=document.getElementById(id); inp.value=state.colors[n]; inp.addEventListener('input', ()=>{ state.colors[n]=inp.value; save(); draw(); }); });

// Table
const rows=document.getElementById('rows');

function rowHTML(n){
  const L=state.lesions[String(n)]; const info=getZoneAndPi(n);
  return `<tr id="lesion${n}">
    <td><b>L${n}</b></td>
    <td class="sectors" style="font-size:12px;line-height:1.2">${(L.sectors||[]).join('<br>')||'—'}</td>
    <td class="dim">TR <input id="tr-${n}" type="number" step="0.1" value="${L.tr||''}" style="width:70px;display:inline-block;margin:0 4px">
        AP <input id="ap-${n}" type="number" step="0.1" value="${L.ap||''}" style="width:70px;display:inline-block;margin:0 4px">
        CC <input id="cc-${n}" type="number" step="0.1" value="${L.cc||''}" style="width:70px;display:inline-block;margin:0 4px"></td>
    <td><select id="t2-${n}"><option value="">—</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></td>
    <td><select id="dwi-${n}"><option value="">—</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></td>
    <td><select id="dce-${n}" class="dce-select"><option value="">—</option><option value="pos">+</option><option value="neg">-</option></select></td>
    <td id="zone-${n}">${info.zone}</td>
    <td id="pi-${n}">${info.pi}</td>
  </tr>
  
  
  <tr class="lesion-sub">
    <td></td>
    <td colspan="7" class="sv-sub">
      <div class="sub-controls">
        <label for="sv-${n}" class="sv-label">Інвазія сім'яних міхурців:</label>
        <select id="sv-${n}" class="sv-select">
          <option value="">—</option>
          <option value="yes">так</option>
          <option value="no">ні</option>
        </select>

        <label for="ece-${n}" class="sv-label">Виступання за межі капсули:</label>
        <select id="ece-${n}" class="sv-select">
          <option value="">—</option>
          <option value="yes">так</option>
          <option value="no">ні</option>
        </select>
      </div>
    </td>
  </tr>
  <tr class="lesion-sub lesion-sub-inv">
    <td></td>
    <td colspan="7">
      <label for="inv-${n}" class="sv-label">Інвазія інших структур:</label>
      <input id="inv-${n}" class="inv-line" type="text" placeholder="вкажіть структури">
    </td>
  </tr>

`;
}

function updateRow(n){
  const info=getZoneAndPi(n);
  document.getElementById('zone-'+n).textContent=info.zone;
  document.getElementById('pi-'+n).textContent=info.pi;
  try{
    const L = state.lesions[String(n)] || (state.lesions[String(n)]={});
    // Inputs TR/AP/CC
    ['tr','ap','cc'].forEach(k=>{
      const el=document.getElementById(k+'-'+n);
      if(el){
        el.value = L[k]||'';
        el.oninput = ()=>{ L[k]=el.value; save && save(); draw && draw(); };
      }
    });
    // T2/DWI
    const t2=document.getElementById('t2-'+n), dwi=document.getElementById('dwi-'+n);
    if(t2){ t2.value=L.t2||''; t2.onchange= e=>{ L.t2=e.target.value; save&&save(); draw&&draw(); }; }
    if(dwi){ dwi.value=L.dwi||''; dwi.onchange= e=>{ L.dwi=e.target.value; save&&save(); draw&&draw(); }; }
    // DCE
    const dce=document.getElementById('dce-'+n);
    if(dce){
      dce.value = L.dce||'';
      dce.onchange = e=>{ L.dce=e.target.value; save&&save(); draw&&draw(); };
    }
  }catch(_){}

  // Seminal vesicle invasion (SV) yes/no
  try{
    const Ls = state.lesions[String(n)] || (state.lesions[String(n)]={});
    const sv = document.getElementById('sv-'+n);
    if (sv){
      if (Ls.sv === undefined && Ls.SV) { // normalize legacy if any
        Ls.sv = (String(Ls.SV).toLowerCase()==='yes' ? 'yes' : (String(Ls.SV).toLowerCase()==='no' ? 'no' : ''));
      }
      sv.value = Ls.sv || '';
      sv.onchange = (e)=>{
        Ls.sv = e.target.value; // 'yes' | 'no' | ''
        save && save();
        updateRow(n);
        draw && draw();
      };
    }
  }catch(_){}

  // Extracapsular extension (ECE) yes/no
  try{
    const Le = state.lesions[String(n)] || (state.lesions[String(n)]={});
    const ece = document.getElementById('ece-'+n);
    if (ece){
      ece.value = Le.ece || '';
      ece.onchange = (e)=>{
        Le.ece = e.target.value; // 'yes' | 'no' | ''
        save && save();
        updateRow(n);
        draw && draw();
      };
    }
  }catch(_){}

  // Invasion of other structures: free text
  try{
    const Lo = state.lesions[String(n)] || (state.lesions[String(n)]={});
    const inv = document.getElementById('inv-'+n);
    if (inv){
      inv.value = Lo.inv || '';
      inv.addEventListener('input', (e)=>{
        Lo.inv = e.target.value; // free text
        save && save();
      });
      inv.addEventListener('change', (e)=>{
        Lo.inv = e.target.value;
        save && save();
        updateRow(n);
      });
    }
  }catch(_){}

}
function buildTable(){
  rows.innerHTML=[1,2,3,4,5].map(rowHTML).join('');
  [1,2,3,4,5].forEach(n=>{
    const L=state.lesions[String(n)];
    ['tr','ap','cc'].forEach(k=>{ const el=document.getElementById(k+'-'+n); el.addEventListener('input', ()=>{ L[k]=el.value; save(); draw(); }); });
    const t2=document.getElementById('t2-'+n), dwi=document.getElementById('dwi-'+n);
    t2.value=L.t2||''; dwi.value=L.dwi||'';
    t2.addEventListener('change', e=>{ L.t2=e.target.value; save(); updateRow(n); draw(); });
    dwi.addEventListener('change', e=>{ L.dwi=e.target.value; save(); updateRow(n); draw(); });
  });
}
buildTable();

const __volDebounce = { t: null };

function localVolumeCalc(){
  const tr=parseFloat(state.prostate.tr||0), ap=parseFloat(state.prostate.ap||0), cc=parseFloat(state.prostate.cc||0);
  return 0.52*tr*ap*cc/1000;
}

async function apiPost(path, payload){
  if (!window.USE_REMOTE_API || !window.API_BASE || /REPLACE_WITH_YOUR_WORKER/.test(window.API_BASE)) {
    throw new Error('API_BASE не налаштовано');
  }
  const res = await fetch(String(window.API_BASE).replace(/\/$/, '') + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(()=>({ ok:false, error:'Некоректна відповідь API' }));
  if (!res.ok || !data.ok) throw new Error(data.error || ('HTTP ' + res.status));
  return data;
}

function collectApiPayload(){
  const lesions = [];
  for (let n=1; n<=5; n++){
    const L = state.lesions && state.lesions[String(n)] ? state.lesions[String(n)] : {};
    lesions.push({
      id: n,
      sectors: Array.isArray(L.sectors) ? L.sectors.slice() : [],
      tr: L.tr || '', ap: L.ap || '', cc: L.cc || '',
      t2: L.t2 || '', dwi: L.dwi || '', dce: L.dce || '',
      sv: L.sv || '', ece: L.ece || '', inv: L.inv || ''
    });
  }
  return {
    pib: (document.getElementById('pib')?.value || state.pib || '').trim(),
    prostate: {
      tr: parseFloat(state.prostate?.tr || 0) || 0,
      ap: parseFloat(state.prostate?.ap || 0) || 0,
      cc: parseFloat(state.prostate?.cc || 0) || 0
    },
    lesions
  };
}

async function updateVolRemote(){
  const payload = {
    tr: parseFloat(state.prostate.tr||0)||0,
    ap: parseFloat(state.prostate.ap||0)||0,
    cc: parseFloat(state.prostate.cc||0)||0
  };
  try{
    const data = await apiPost('/api/volume', payload);
    document.getElementById('volOut').textContent = (data.volume>0 ? data.volume.toFixed(1)+' мл' : '—');
  }catch(_){
    const vol = localVolumeCalc();
    document.getElementById('volOut').textContent=(vol>0?vol.toFixed(1)+' мл':'—');
  }
}

function updateVol(){
  clearTimeout(__volDebounce.t);
  __volDebounce.t = setTimeout(updateVolRemote, 250);
}

['p_tr','p_ap','p_cc'].forEach(id=>{ const key=id.split('_')[1]; const el=document.getElementById(id); el.value=state.prostate[key]||''; el.addEventListener('input', ()=>{ state.prostate[key]=el.value; save(); updateVol(); draw(); }); });
updateVol();

// Report generation
document.getElementById('makeReport').addEventListener('click', async()=>{ await buildReportImages(); await buildReportText(); document.getElementById('report').style.display='block'; alert('Звіт зібрано. Натисни «Друк» для PDF.'); });
document.getElementById('printBtn').addEventListener('click', async()=>{ if(document.getElementById('reportImg').src===''){ await buildReportImages(); await buildReportText(); document.getElementById('report').style.display='block'; } window.print(); });

async function buildReportText(){
  try{
    const data = await apiPost('/api/report', collectApiPayload());
    document.getElementById('reportText').innerHTML = data.html || '';
    if (typeof data.volume === 'number') {
      document.getElementById('volOut').textContent = (data.volume>0 ? data.volume.toFixed(1)+' мл' : '—');
    }
    return;
  }catch(err){
    console.warn('API report fallback to local builder:', err);
  }
  const P = state.prostate||{};
  const tr = parseFloat(P.tr||0), ap = parseFloat(P.ap||0), cc = parseFloat(P.cc||0);
  const vol = 0.52*tr*ap*cc/1000; // cm3

  // helper: map code to presentation
  const pretty = (code)=>{
    code = String(code||'').toUpperCase();
    if (code==='PZPL') return 'PZpl';
    if (code==='PZPM') return 'PZpm';
    if (code==='TZP')  return 'TZp';
    if (code==='TZA')  return 'TZa';
    if (code==='PZA')  return 'PZa';
    if (code==='CZ')   return 'CZ';
    if (code==='AS')   return 'AS';
    return code||'—';
  };

  let out = '';

  // Prostate
  out += '<p><b>Prostate:</b><br>' +
         (tr?tr:'—') + 'x' + (ap?ap:'—') + 'x' + (cc?cc:'—') + 'mm<br>' +
         (vol>0 ? ('Volume ' + vol.toFixed(1) + 'cm3') : 'Volume —') +
         '</p>';

  // Lesions
  for (let n=1; n<=5; n++){
    const L = state.lesions && state.lesions[String(n)]; 
    if (!L || !(L.sectors||[]).length) continue;

    const t2  = (L.t2!==undefined && L.t2!=='' ? L.t2 : '—');
    const dwi = (L.dwi!==undefined && L.dwi!=='' ? L.dwi : '—');
    const pi  = (function(){ try{ return getZoneAndPi(n).pi || '—'; }catch(_){ return '—'; } })();

    // group sectors by level
    const groups = { BASE:[], MID:[], APEX:[] };
    (L.sectors||[]).forEach(id=>{
      const parts = String(id).split(':');
      const lvl = String(parts[0]||'').toUpperCase();
      const code = pretty(parts[2]||parts[1]||'');
      if (lvl.indexOf('BASE')===0) groups.BASE.push(code);
      else if (lvl.indexOf('APEX')===0 || lvl.indexOf('AP')===0) groups.APEX.push(code);
      else groups.MID.push(code);
    });

    const sizes = (L.tr?L.tr:'—')+'x'+(L.ap?L.ap:'—')+'x'+(L.cc?L.cc:'—')+'mm';

    out += '<p><b>Lesion '+n+':</b><br>' +
           sizes + '<br>' +
           'T2 - ' + t2 + 'pts, DWI - ' + dwi + 'pts' + (function(){
             var L=state.lesions[String(n)]||{}; var d=L.dce; var s='';
             if (d && (d==='pos'||d==='neg')) s += ', DCE - ' + (d==='pos'?'+':'-');
             return s + '<br>';
           })() +
           '<b><i>PI-RADS '+pi+'</i></b>' + '<br>' +
           'Base: ' + (groups.BASE.length? groups.BASE.join(', ') : '—') + '<br>' +
           'Mid: ' + (groups.MID.length? groups.MID.join(', ') : '—') + '<br>' +
           'Apex: ' + (groups.APEX.length? groups.APEX.join(', ') : '—') +
           (function(){ var L=state.lesions[String(n)]||{}; var bits=[];
             if (L.sv==='yes'||L.sv==='no') bits.push('Інвазія сім\'яних міхурців: ' + (L.sv==='yes'?'так':'ні'));
             if (L.ece==='yes'||L.ece==='no') bits.push('Виступання за межі капсули: ' + (L.ece==='yes'?'так':'ні'));
             if (L.inv && String(L.inv).trim().length>0) bits.push('Інвазія інших структур: ' + String(L.inv).trim());
             return bits.length? ('<br>' + bits.join('<br>')) : '';
           })() +
           '</p>';
  }

  document.getElementById('reportText').innerHTML = out;
// --- Prepend PIB right after building reportText (single insertion) ---
(function(){
  try{
    var rt = document.getElementById('reportText');
    if (!rt) return;
    // remove existing pib_line if any to avoid duplicates
    var old = rt.querySelector('#pib_line'); if (old) old.remove();
    var inp = document.getElementById('pib');
    var raw = inp ? String(inp.value||'').trim() : '';
    var v = raw || (typeof state==='object' && state && typeof state.pib==='string' ? state.pib.trim() : '');
    if (v){
      var esc = function(s){return String(s).replace(/[&<>]/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[ch];});};
      rt.innerHTML = '<div id="pib_line" style="font-weight:bold;font-size:16px;margin:0 0 6px 0">'+esc(v)+'</div>' + rt.innerHTML;
    }
  }catch(_){ }
})();
}

function loadImage(url){ return new Promise(res=>{ const im=new Image(); im.onload=()=>res(im); im.src=url; }); }

async function buildReportImages(){
  const base = document.getElementById('baseimg');
  const canvas1 = document.createElement('canvas'); canvas1.width = W; canvas1.height = H;
  const ctx1 = canvas1.getContext('2d');
  const img = await loadImage(base.src); ctx1.drawImage(img,0,0);
  for (let n=1;n<=5;n++){ const color = state.colors[String(n)]; const L=state.lesions[String(n)];
    ctx1.fillStyle = hexToRgba(color,0.35); ctx1.strokeStyle = color; ctx1.lineWidth=2;
    (L.sectors||[]).forEach(function(id){ const pts=absPoints(id); ctx1.beginPath(); pts.forEach(function(p,i){ if(i===0) ctx1.moveTo(p[0],p[1]); else ctx1.lineTo(p[0],p[1]); }); ctx1.closePath(); ctx1.fill(); ctx1.stroke(); });
    
if(L.ellipses){
  ['Sagittal','Coronal'].forEach(function(v){
    const E=L.ellipses[v]; if(!E) return;
    // Draw rotated ellipse properly
    ctx1.save();
    ctx1.translate(E.cx, E.cy);
    ctx1.rotate(E.rot||0);
    ctx1.beginPath();
    ctx1.ellipse(0,0, E.rx, E.ry, 0, 0, Math.PI*2);
    ctx1.closePath();
    ctx1.fillStyle = hexToRgba(color,0.35);
    ctx1.fill();
    ctx1.lineWidth = 2;
    ctx1.strokeStyle = color;
    ctx1.stroke();
    ctx1.restore();
    // Label
    ctx1.fillStyle='#fff';
    ctx1.strokeStyle='#000';
    ctx1.lineWidth=3;
    ctx1.textAlign='center';
    ctx1.font='bold 16px system-ui';
    const info=getZoneAndPi(n); const label='PI-RADS '+(info.pi||'—');
    ctx1.strokeText(label, E.cx, E.cy+5);
    ctx1.fillText(label, E.cx, E.cy+5);
  });
}

  }
  var r1=document.getElementById('reportImg'); if(r1){ r1.src = canvas1.toDataURL('image/png'); }

  const ax = {x: sectorBoxes.Base.x, y: sectorBoxes.Base.y, w: sectorBoxes.Base.w, h: (sectorBoxes.Apex.y + sectorBoxes.Apex.h - sectorBoxes.Base.y)};
  const canvas2 = document.createElement('canvas'); canvas2.width = ax.w; canvas2.height = ax.h;
  const ctx2 = canvas2.getContext('2d');
  const img2 = await loadImage(base.src);
  ctx2.drawImage(img2, ax.x, ax.y, ax.w, ax.h, 0, 0, ax.w, ax.h);
  for(let n=1;n<=5;n++){ const color = state.colors[String(n)]; const L=state.lesions[String(n)];
    ctx2.fillStyle = hexToRgba(color,0.35); ctx2.strokeStyle = color; ctx2.lineWidth=2;
    (L.sectors||[]).forEach(function(id){ const pts=absPoints(id).map(function(p){return [p[0]-ax.x, p[1]-ax.y];}); ctx2.beginPath(); pts.forEach(function(p,i){ if(i===0) ctx2.moveTo(p[0],p[1]); else ctx2.lineTo(p[0],p[1]); }); ctx2.closePath(); ctx2.fill(); ctx2.stroke(); });
  }
  var r2=document.getElementById('reportImg2'); if(r2){ r2.src = canvas2.toDataURL('image/png'); }
}

draw();

// 1) Якщо в state вже було поле DCE ("+", "-"), нормалізуємо до dce: "pos"/"neg"/"".
try {
  for (let k of ['1','2','3','4','5']) {
    const L = (state.lesions && state.lesions[k]) || (state.lesions[k] = {});
    if (L.DCE && !L.dce) {
      L.dce = (L.DCE === '+' || L.DCE === 'pos') ? 'pos' : (L.DCE === '-' || L.DCE === 'neg') ? 'neg' : '';
    }
    if (L.dce === undefined) L.dce = '';
  }
  save && save();
} catch(_) {}

// 2) Інʼєкція DCE поруч із DWI (працює навіть якщо у DWI немає класу)

// 3) Гарантуємо виклик після побудови рядків
// Якщо у вас уже є десь draw(); просто додайте після нього:
if (typeof draw === 'function') {
  // підміна draw, щоб після кожного рендеру таблиці додавати DCE
  const _draw = draw;
  window.draw = function() {
    _draw();
    injectDCE();
  };
}

// На перший раз (коли DOM готовий)
document.addEventListener('DOMContentLoaded', () => {
  try { if (typeof draw === 'function') draw(); else injectDCE(); } catch(_){}
});



(function(){
  const $ = (id)=>document.getElementById(id);
  function getCurrentPolys(){
    try{ if(typeof polys!=='undefined' && polys) return polys; }catch(e){}
    try{ if(window.polys) return window.polys; }catch(e){}
    const KEYS=['pirads21_polys_user','pirads21_polys','pirads21_polys_v635','pirads21_polys_v636','pirads21_polys_v641'];
    for(const k of KEYS){ try{ const s=localStorage.getItem(k); if(s){ return JSON.parse(s); } }catch(e){} }
    return {}; }

  function deepClone(o){ return JSON.parse(JSON.stringify(o||{})); }

  // keys that сторінка може читати як дефолтні
  const LS_POLYS_KEYS = ['pirads21_polys_user','pirads21_polys','pirads21_polys_v635','pirads21_polys_v636','pirads21_polys_v641'];

  function savePolysToAllKeys(obj){
    const s = JSON.stringify(obj||{});
    (LS_POLYS_KEYS||[]).forEach(k=>{ try{ localStorage.setItem(k, s); }catch(e){} });
  }

  // EXPORT
  if ($('btnExportPolys')){
    $('btnExportPolys').addEventListener('click', ()=>{
      try{ savePolys && savePolys(); }catch(e){};
      const payload = { polys: getCurrentPolys() };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      const ts   = new Date().toISOString().replace(/[:.]/g,'').slice(0,15);
      a.href = url; a.download = 'pirads21_polys_'+ts+'.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 400);
    });
  }

  // IMPORT
  if ($('btnImportPolys') && $('fileImportPolys')){
    $('btnImportPolys').addEventListener('click', ()=> $('fileImportPolys').click());
    $('fileImportPolys').addEventListener('change', async (e)=>{
      const f = e.target.files && e.target.files[0]; if(!f) return;
      try{
        const txt = await f.text();
        const data = JSON.parse(txt);
        const newPolys = data.polys || data; // формат {polys:{...}} або просто {...}
        if (!newPolys || typeof newPolys!=='object') throw new Error('Некоректний формат JSON');
        // Рантайм
        try{ polys = deepClone(newPolys); }catch(_){ window.polys = deepClone(newPolys); }
        // Якщо існує initialPolys — оновити як "дефолт"
        try{ window.initialPolys = deepClone(newPolys); }catch(_){}
        // Зберегти у localStorage у всіх ключах
        savePolysToAllKeys(newPolys);
        try{ savePolys && savePolys(); }catch(e){};
        try{ buildTable && buildTable(); }catch(e){};
        try{ draw && draw(); }catch(e){};
        alert('Полігони імпортовано та збережено як стандартні.');
      }catch(err){
        alert('Помилка імпорту: '+err.message);
      }finally{
        e.target.value='';
      }
    });
  }
})();



(function(){
  const LS_STATE_KEYS = ['pirads21_state','pirads21_state_v635','pirads21_state_v636','pirads21_state_v641','pirads21_state_user'];
  const LS_POLYS_KEYS = ['pirads21_polys','pirads21_polys_v635','pirads21_polys_v636','pirads21_polys_v641','pirads21_polys_user'];

  function parseEmbedded(id){
    const el = document.getElementById(id);
    if(!el) return null;
    try { return JSON.parse(el.textContent || '{}'); } catch(e){ return null; }
  }

  function writeAll(keys, obj){
    const s = JSON.stringify(obj || {});
    keys.forEach(k=>{ try{ localStorage.setItem(k, s); }catch(e){} });
  }
  function clearAll(prefix){
    const rm=[];
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(k && k.indexOf(prefix)===0) rm.push(k);
    }
    rm.forEach(k=>{ try{ localStorage.removeItem(k); }catch(e){} });
  }

  function applyEmbedded(force){
    const eState = parseEmbedded('embeddedState') || {};
    const ePolys = parseEmbedded('embeddedPolys') || {};
    if(force){
      clearAll('pirads21_');
      writeAll(LS_STATE_KEYS, eState);
      writeAll(LS_POLYS_KEYS, ePolys);
    }
    try{ state = eState; }catch(_){ window.state = eState; }
    try{ polys = ePolys; }catch(_){ window.polys = ePolys; }
    try{ save && save(); }catch(e){};
    try{ savePolys && savePolys(); }catch(e){};
    try{ buildTable && buildTable(); }catch(e){};
    try{ updateVol && updateVol(); }catch(e){};
    try{ draw && draw(); }catch(e){};
  }

  document.addEventListener('DOMContentLoaded', ()=>{ applyEmbedded(true); });
  const btn = document.getElementById('applyEmbeddedOverride');
  if(btn) btn.addEventListener('click', ()=>{ applyEmbedded(true); alert('Вбудовані налаштування застосовано та збережено.'); });
})();



(function(){
  function ensurePanel(){
    let anchor = document.getElementById('overlay') || document.getElementById('baseimg');
    if(!anchor){
      const svgs = document.getElementsByTagName('svg');
      if(svgs && svgs[0]) anchor = svgs[0];
    }
    if(!anchor) return null;
    let panel = document.getElementById('rotPanel');
    if(!panel){
      panel = document.createElement('div');
      panel.id='rotPanel';
      panel.className='rot-panel';
      anchor.parentNode.insertBefore(panel, anchor.nextSibling);
    }
    return panel;
  }

  function makeRow(i){
    const idx = i-1;
    const row = document.createElement('div');
    row.className='rot-row';
    row.dataset.lesion = String(idx);
    row.innerHTML = ''
      + '<span class="rot-title">L'+i+'</span>'
      + '<label>Sag (°): <input type="range" min="-60" max="60" step="1" id="l'+i+'_rotSag_s" /></label>'
      + '<input type="number" min="-60" max="60" step="1" id="l'+i+'_rotSag_n" style="width:64px">'
      + '<label>Cor (°): <input type="range" min="-60" max="60" step="1" id="l'+i+'_rotCor_s" /></label>'
      + '<input type="number" min="-60" max="60" step="1" id="l'+i+'_rotCor_n" style="width:64px">';
    return row;
  }

  function mount(){
    const panel = ensurePanel();
    if(!panel) return;
    // clear old children to avoid duplicates / mis-order
    panel.innerHTML = '<div style="font-size:12px;margin-bottom:4px;">Rotation (by lesion, per plane)</div>';
    window.state = window.state || {};
    state.lesions = state.lesions || [];

    for(let i=1;i<=5;i++){
      const row = makeRow(i);
      panel.appendChild(row);
      const idx = i-1;
      state.lesions[idx] = state.lesions[idx] || {};

      const sSag = row.querySelector('#l'+i+'_rotSag_s');
      const nSag = row.querySelector('#l'+i+'_rotSag_n');
      const sCor = row.querySelector('#l'+i+'_rotCor_s');
      const nCor = row.querySelector('#l'+i+'_rotCor_n');

      const vSag = Number.isFinite(state.lesions[idx]?.rotSagDeg) ? state.lesions[idx].rotSagDeg
              : Number.isFinite(state.lesions[idx+1]?.rotSagDeg) ? state.lesions[idx+1].rotSagDeg : 0;
      const vCor = Number.isFinite(state.lesions[idx]?.rotCorDeg) ? state.lesions[idx].rotCorDeg
              : Number.isFinite(state.lesions[idx+1]?.rotCorDeg) ? state.lesions[idx+1].rotCorDeg : 0;
      sSag.value = vSag; nSag.value = vSag; sCor.value = vCor; nCor.value = vCor;

      function apply(idxLocal){
        const sag = parseFloat(nSag.value);
        const cor = parseFloat(nCor.value);
        // normalize targets: write to idx and idx+1 to cover off-by-one linkage in base code
        const targets = [idxLocal, idxLocal+1];
        targets.forEach(t=>{
          state.lesions[t] = state.lesions[t] || {};
          state.lesions[t].rotSagDeg = Number.isFinite(sag)? sag : 0;
          state.lesions[t].rotCorDeg = Number.isFinite(cor)? cor : 0;
        });
        try{ if(typeof saveState==='function') saveState(); }catch(e){}
        try{ if(typeof draw==='function') draw(); }catch(e){}
      }
      // Bind with explicit index to avoid closure/off-by-one
      sSag.addEventListener('input', ()=>{ nSag.value = sSag.value; apply(idx); });
      nSag.addEventListener('change', ()=>{ sSag.value = nSag.value; apply(idx); });
      sCor.addEventListener('input', ()=>{ nCor.value = sCor.value; apply(idx); });
      nCor.addEventListener('change', ()=>{ sCor.value = nCor.value; apply(idx); });
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', mount);
  }else{
    setTimeout(mount,0);
  }
  // Also remount after draw in case layout changes
  window.addEventListener('resize', ()=>{ setTimeout(()=>{ if(document.getElementById('rotPanel')){} else mount(); }, 0); });
})();



(function(){
  function set0(el){
    if(!el) return;
    if(el.type==='range' || el.type==='number'){ el.value = 0; }
    if('valueAsNumber' in el) try{ el.valueAsNumber = 0; }catch(_){}
    // bubble input/change so any listeners recompute UI
    ['input','change'].forEach(ev=> el.dispatchEvent(new Event(ev,{bubbles:true})));
  }
  function zeroPercents(root){
    (root||document).querySelectorAll('span,small,b,i,em').forEach(s=>{
      const t=(s.textContent||'').trim();
      if(/^-?\d+\s*%$/.test(t) || /Sagittal|Coronal/.test(t)) {
        // If element contains percent only, set to 0%
        if(/%/.test(t)) s.textContent='0%';
      }
    });
  }
  window.resetAllEllipseShifts = function(){
    try{
      // Prefer a dedicated panel if present
      const panel = Array.from(document.querySelectorAll('*'))
        .find(n=>/Зміщення еліпсів/i.test(n.textContent||'')) || document;
      // Ranges and numeric inputs in that panel
      panel.querySelectorAll('input[type="range"], input[type="number"]').forEach(set0);
      // Known ids fallbacks
      ['sagX','sagY','corX','corY','SagX','SagY','CorX','CorY'].forEach(id=>{
        const el=document.getElementById(id); if(el) set0(el);
      });
      // Internal state
      if (window.state){
        if (!state.ellipseShift) state.ellipseShift={Sagittal:{x:0,y:0},Coronal:{x:0,y:0}};
        state.ellipseShift.Sagittal = {x:0,y:0};
        state.ellipseShift.Coronal  = {x:0,y:0};
      }
      zeroPercents(panel);
      // Redraw
      if (typeof window.redrawAll==='function') window.redrawAll();
      else if (typeof window.draw==='function') window.draw();
    }catch(e){ console.error(e); }
  };
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('button, input[type="button"]').forEach(btn=>{
      const label=(btn.innerText||btn.value||'').trim().toLowerCase();
      if (label==='скинути') btn.onclick = window.resetAllEllipseShifts;
    });
  });
})();



(function(){
  function on(el, ev, fn){ if (el) el.addEventListener(ev, fn, {capture:true}); }
  function qs(sel){ return document.querySelector(sel); }

  async function buildImages(){
    try{ if (typeof window.buildReportImages === 'function') { await window.buildReportImages(); } }catch(e){ console.warn(e); }
  }
  async function buildText(){
    try{ if (typeof window.buildReportText === 'function') { await window.buildReportText(); } }catch(e){ console.warn(e); }
  }

  async function handleMakeReport(e){
    if(e){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
    await buildImages();
    await buildText();
    var rep = qs('#report'); if (rep) rep.style.display='block';
    return false;
  }

  function writeIframe(html){
    var iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    var doc = iframe.contentWindow || iframe.contentDocument;
    if (doc.document) doc = doc.document;
    doc.open();
    doc.write(html);
    doc.close();
    return iframe;
  }

  function makePrintDoc(contentHTML){
    var css = `
      
    `;
    var html = `<!doctype html><html><head><meta charset="utf-8">`+css+`


<script>
window.API_BASE = window.API_BASE || "https://floral-firefly-15b5.oleksandrmulyar.workers.dev";
window.USE_REMOTE_API = true;



        window.addEventListener('load', function(){
          setTimeout(function(){ try{ window.print(); }catch(_){ } }, 50);
        });
        window.addEventListener('afterprint', function(){ try{ window.close(); }catch(_){ } });
      <\/script>
    </body></html>`;
    return html;
  }

  async function handlePrint(e){
    if(e){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
    // Ensure report is built & visible
    await buildImages();
    await buildText();
    var rep = qs('#report'); if (!rep) return false;
    rep.style.display = 'block';

    // Clone current report HTML and print via invisible iframe
    var html = makePrintDoc(rep.innerHTML);
    var iframe = writeIframe(html);
    // Cleanup iframe after some delay (in case afterprint didn't close it)
    setTimeout(function(){ try{ iframe.remove(); }catch(_){ } }, 5000);
    return false;
  }

  document.addEventListener('DOMContentLoaded', function(){
    on(document.getElementById('makeReport'), 'click', handleMakeReport);
    on(document.getElementById('printBtn'),  'click', handlePrint);
  });
})();



(function(){
  function bubble(el){ ['input','change'].forEach(ev=> el.dispatchEvent(new Event(ev,{bubbles:true}))); }
  function set0(el){ if(!el) return;
    if(el.type==='checkbox' || el.type==='radio'){ el.checked=false; bubble(el); return; }
    if(el.tagName==='SELECT'){ el.selectedIndex=0; bubble(el); return; }
    if(el.tagName==='TEXTAREA'){ el.value=''; bubble(el); return; }
    if(el.type){ el.value=''; try{ el.valueAsNumber = NaN; }catch(_){ } bubble(el); return; }
  }
  function clearLocalPolygonStorage(){ try{ 
    Object.keys(localStorage).forEach(k=>{ if(/^pirads21_/i.test(k)) localStorage.removeItem(k); });
  }catch(_){ }}

  const DEFAULT_COLORS = ['#ff6b6b','#4dabf7','#38d9a9','#ffd43b','#845ef7'];

  window.resetAllEverything = function(){ 
    try{ 
      if (typeof window.resetAllEllipseShifts === 'function') window.resetAllEllipseShifts();

      document.querySelectorAll('input, select, textarea').forEach(el=>{
        if (el.tagName==='INPUT' && (el.type||'').toLowerCase()==='file') return;
        set0(el);
      });

      ['pib','p_tr','p_ap','p_cc'].forEach(id=>{ const el=document.getElementById(id); if(el) set0(el); });
      [['volOut','—'],['report',''],['result',''],['summary',''],['generatedReport','']].forEach(([id,txt])=>{
        const el=document.getElementById(id); if(el) el.textContent = txt;
      });

      document.querySelectorAll('.sectors').forEach(n=> n.innerHTML = '—');

      try{ 
        if (window.state && window.state.lesions) { 
          Object.keys(window.state.lesions).forEach(k=>{ window.state.lesions[k] = {sectors:[], tr:'', ap:'', cc:'', t2:'', dwi:'', dce:'', sv:'', ece:'', inv:''}; });
          window.state.active = 1;
        }
      }catch(_){ }

      clearLocalPolygonStorage();

      // Reset colors to default if fields exist
      DEFAULT_COLORS.forEach((clr,i)=>{
        const id = 'c'+(i+1);
        const el = document.getElementById(id);
        if(el){ el.value = clr; bubble(el); }
        if(window.state && window.state.colors) window.state.colors[i] = clr;
      });

      if (typeof save==='function') try{ save(); }catch(_){ }
      if (typeof window.redrawAll==='function') try{ window.redrawAll(); }catch(_){ }
      else if (typeof draw==='function') try{ draw(); }catch(_){ }

      alert('Усе очищено до повного нуля ✅ (включно з кольорами)');
    }catch(e){ console.error(e); alert('Помилка під час скидання.'); }
  };

  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('resetOffset') || Array.from(document.querySelectorAll('button,input[type="button"]')).find(b=>/(^|\s)скинути(\s|$)/i.test((b.innerText||b.value||'').trim()));
    if (btn) btn.onclick = window.resetAllEverything;
  });
})();



(function(){
  // Зберігаємо оригінальний title
  var __ORIG_TITLE__ = document.title;

  function pibToFilename(){
    var el = document.getElementById('pib');
    var v = (el && el.value ? el.value : '').trim();
    if(!v){ return __ORIG_TITLE__ || 'report'; }
    // Заміна пробілів/не-алфанумериків на "_", прибираємо дублікати "_"
    try{
      v = v.replace(/[^\p{L}\p{N}]+/gu,'_').replace(/^_+|_+$/g,'');
    }catch(e){
      // Fallback без unicode classes (на старих браузерах)
      v = v.replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
    }
    return v || (__ORIG_TITLE__ || 'report');
  }

  // Працює для будь-якого способу друку: кнопка, Ctrl+P, window.print()
  window.addEventListener('beforeprint', function(){
    document.title = pibToFilename();
  });
  window.addEventListener('afterprint', function(){
    document.title = __ORIG_TITLE__;
  });

  // Додатково: якщо є явні кнопки "Звіт" або "Друк" без beforeprint (деякі браузери)
  document.addEventListener('click', function(e){
    var t = e.target;
    if(!t) return;
    var txt = (t.innerText || t.value || '').toLowerCase();
    if(/звіт|pdf|друк/.test(txt)){
      document.title = pibToFilename();
      // Через мить повернемо (для випадків, де afterprint не спрацьовує, наприклад, якщо відмінили друк)
      setTimeout(function(){ document.title = __ORIG_TITLE__; }, 5000);
    }
  }, true);
})();



(function(){
  // ====== Utility: pick report root ======
  function pickReportRoot(){
    return document.getElementById('report') ||
           document.getElementById('result') ||
           document.getElementById('summary') ||
           document.getElementById('generatedReport') ||
           document.querySelector('[data-report]') ||
           document.querySelector('.report') ||
           document.querySelector('#reportContainer') ||
           document.querySelector('#report-area') ||
           null;
  }
  function filenameFromPIB(){
    var el = document.getElementById('pib');
    var v = (el && el.value ? el.value : '').trim();
    if(!v) return 'report';
    try{ v = v.replace(/[^\p{L}\p{N}]+/gu,'_').replace(/^_+|_+$/g,''); }
    catch(e){ v = v.replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,''); }
    return v || 'report';
  }
  function todayDDMMYYYY(){
    var d = new Date();
    var dd = String(d.getDate()).padStart(2,'0');
    var mm = String(d.getMonth()+1).padStart(2,'0');
    var yy = d.getFullYear();
    return dd + '.' + mm + '.' + yy;
  }
  function chosenFormat(){
    var sel = document.getElementById('imgFormat');
    var f = sel ? (sel.value||'jpg').toLowerCase() : 'jpg';
    if (f === 'jpeg') f = 'jpg';
    return (f === 'jpg' || f === 'png') ? f : 'jpg';
  }

  // ====== IndexedDB helpers to persist directory handle ======
  const DB_NAME = 'pirads-fs';
  const STORE = 'handles';
  function idb_open(){
    return new Promise((res,rej)=>{
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (ev)=>{
        const db = req.result;
        if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = ()=> res(req.result);
      req.onerror = ()=> rej(req.error);
    });
  }
  function idb_get(key){
    return idb_open().then(db=> new Promise((res,rej)=>{
      const tx = db.transaction(STORE, 'readonly');
      const st = tx.objectStore(STORE);
      const rq = st.get(key);
      rq.onsuccess = ()=> res(rq.result);
      rq.onerror = ()=> rej(rq.error);
    }));
  }
  function idb_set(key, value){
    return idb_open().then(db=> new Promise((res,rej)=>{
      const tx = db.transaction(STORE, 'readwrite');
      const st = tx.objectStore(STORE);
      const rq = st.put(value, key);
      rq.onsuccess = ()=> res(true);
      rq.onerror = ()=> rej(rq.error);
    }));
  }
  function idb_del(key){
    return idb_open().then(db=> new Promise((res,rej)=>{
      const tx = db.transaction(STORE, 'readwrite');
      const st = tx.objectStore(STORE);
      const rq = st.delete(key);
      rq.onsuccess = ()=> res(true);
      rq.onerror = ()=> rej(rq.error);
    }));
  }

  const DIR_KEY = 'saveDirHandle';
  async function getSavedDirHandle(){
    try{
      const h = await idb_get(DIR_KEY);
      return h || null;
    }catch(e){ console.warn('getSavedDirHandle:', e); return null; }
  }
  async function setSavedDirHandle(handle){
    try{
      await idb_set(DIR_KEY, handle);
      return true;
    }catch(e){ console.warn('setSavedDirHandle:', e); return false; }
  }
  async function clearSavedDirHandle(){
    try{ await idb_del(DIR_KEY); }catch(_){}
  }

  async function verifyPermission(handle, readWrite){
    try{
      const opts = { mode: readWrite ? 'readwrite' : 'read' };
      if ((await handle.queryPermission(opts)) === 'granted') return true;
      if ((await handle.requestPermission(opts)) === 'granted') return true;
    }catch(e){ console.warn('verifyPermission:', e); }
    return false;
  }

  // ====== UI status ======
  function setStatus(txt){
    const el = document.getElementById('saveDirStatus');
    if (el) el.textContent = txt || '';
  }

  // ====== Folder selection ======
  async function chooseSaveFolder(){
    if (!window.showDirectoryPicker){
      alert('Ваш браузер не підтримує вибір папки (File System Access API). Використайте Chrome/Edge 86+.');
      return;
    }
    try{
      // Persist storage so permission survives
      if (navigator.storage && navigator.storage.persist) {
        try{ await navigator.storage.persist(); }catch(_){}
      }
      const dir = await window.showDirectoryPicker({ id: 'pirads-save-dir', mode: 'readwrite' });
      if (!dir) return;
      const ok = await verifyPermission(dir, true);
      if (!ok){ alert('Немає дозволу на запис у вибрану папку.'); return; }
      await setSavedDirHandle(dir);
      setStatus('Папка вибрана ✔️');
    }catch(e){
      console.error('chooseSaveFolder error', e);
      if (e && e.name === 'AbortError') return; // user canceled
      alert('Не вдалося вибрати папку. Деталі в консолі.');
    }
  }

  // ====== Save via File System Access (if available), else fallback to download ======
  async function saveDataUrl(dataUrl, filename){
    try{
      const dir = await getSavedDirHandle();
      if (dir && await verifyPermission(dir, true)){
        // Convert dataURL to Blob
        const bin = atob(dataUrl.split(',')[1]);
        const arr = new Uint8Array(bin.length);
        for (let i=0; i<bin.length; i++) arr[i] = bin.charCodeAt(i);
        const isPNG = /\.png$/i.test(filename);
        const blob = new Blob([arr], { type: isPNG ? 'image/png' : 'image/jpeg' });
        const fileHandle = await dir.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        setStatus('Збережено: ' + filename);
        return;
      }
    }catch(e){
      console.warn('FS save failed, fallback to download', e);
    }
    // Fallback: classic download
    const a = document.createElement('a');
    a.download = filename;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    requestAnimationFrame(()=> a.remove());
  }

  // ====== Export Image (uses html2canvas already loaded) ======
  async function exportAsImage(){
    try{
      var fmt = chosenFormat(); // 'jpg' or 'png' (default 'jpg')
      var node = pickReportRoot();
      if(!node){ alert('Не знайшов блок звіту для експорту.'); return; }
      var prevBg = node.style.backgroundColor;
      if(!prevBg) node.style.backgroundColor = '#ffffff';
      const canvas = await html2canvas(node, { backgroundColor:'#ffffff', useCORS:true, allowTaint:true, scale:4, logging:false });
      if(!prevBg) node.style.backgroundColor = '';
      var dataUrl = (fmt === 'jpg') ? canvas.toDataURL('image/jpeg', 0.95) : canvas.toDataURL('image/png');
      var base = filenameFromPIB();
      var date = todayDDMMYYYY();
      var fname = base + '_' + date + (fmt === 'jpg' ? '.jpg' : '.png');
      await saveDataUrl(dataUrl, fname);
    }catch(e){
      console.error('EXPORT IMAGE ERROR', e);
      alert('Не вдалося зберегти зображення. Деталі в консолі.');
    }
  }

  // ====== Wire UI ======
  document.addEventListener('DOMContentLoaded', async function(){
    var btn = document.getElementById('btnSaveImage');
    if (btn) btn.addEventListener('click', function(ev){ ev.preventDefault(); exportAsImage(); });
    var choose = document.getElementById('btnChooseFolder');
    if (choose) choose.addEventListener('click', function(ev){ ev.preventDefault(); chooseSaveFolder(); });

    // Show status if a folder is already saved
    try{
      const dir = await getSavedDirHandle();
      if (dir && await verifyPermission(dir, false)) setStatus('Папка вибрана ✔️');
      else setStatus('Папка не вибрана');
    }catch(_){
      setStatus('Папка не вибрана');
    }
  });
})();



(function(){
  function byText(query, rx){
    const els = Array.from(document.querySelectorAll(query));
    return els.find(el => rx.test((el.innerText||el.value||'').trim()));
  }
  function openDrawer(open){ document.body.classList.toggle('drawer-open', !!open); }

  document.addEventListener('DOMContentLoaded', function(){
    // Toggle drawer
    const btn = document.getElementById('btnSideMenu');
    const overlay = document.getElementById('drawerOverlay');
    if(btn) btn.addEventListener('click', ()=> openDrawer(true));
    if(overlay) overlay.addEventListener('click', ()=> openDrawer(false));
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') openDrawer(false); });

    // Locate original controls
    const btnChoose = document.getElementById('btnChooseFolder') || byText('button', /обрати\s+папку/i);
    const btnExport = document.getElementById('btnExportPolys') || byText('button', /експорт(увати)?\s+полігонів/i);
    const btnImport = document.getElementById('btnImportPolys') || byText('button', /імпорт(увати)?\s+полігонів/i);

    // Hide originals to shorten header
    if(btnChoose) btnChoose.classList.add('menu-moved');
    if(btnExport) btnExport.classList.add('menu-moved');
    if(btnImport) btnImport.classList.add('menu-moved');

    // Wire menu items (exact order requested)
    const miChoose = document.getElementById('miChooseFolder');
    const miExport = document.getElementById('miExportPolys');
    const miImport = document.getElementById('miImportPolys');

    if(miChoose) miChoose.addEventListener('click', function(){
      openDrawer(false);
      if(btnChoose) btnChoose.click();
      else if (typeof window.chooseSaveFolder === 'function') window.chooseSaveFolder();
      else alert('Кнопку «Обрати папку…» не знайдено.');
    });
    if(miExport) miExport.addEventListener('click', function(){
      openDrawer(false);
      if(btnExport) btnExport.click();
      else if (typeof window.exportPolygons === 'function') window.exportPolygons();
      else alert('Кнопку «Експорт полігонів» не знайдено.');
    });
    if(miImport) miImport.addEventListener('click', function(){
      openDrawer(false);
      if(btnImport) btnImport.click();
      else if (typeof window.importPolygons === 'function') window.importPolygons();
      else {
        // Fallback trigger hidden file input if present
        const fi = document.getElementById('fileImportPolys');
        if (fi) fi.click(); else alert('Кнопку «Імпорт полігонів» не знайдено.');
      }
    });
  });
})();



(function(){
  // Provide shared helpers if missing
  if (typeof window.getSavedDirHandle !== 'function') {
    window.getSavedDirHandle = async function(){
      try{
        const req = indexedDB.open('pirads-fs', 1);
        const db = await new Promise((res,rej)=>{
          req.onupgradeneeded = ()=>{ const d=req.result; if(!d.objectStoreNames.contains('handles')) d.createObjectStore('handles'); };
          req.onsuccess = ()=> res(req.result);
          req.onerror = ()=> rej(req.error);
        });
        return await new Promise((res,rej)=>{
          const tx = db.transaction('handles','readonly');
          const st = tx.objectStore('handles');
          const rq = st.get('saveDirHandle');
          rq.onsuccess = ()=> res(rq.result || null);
          rq.onerror = ()=> rej(rq.error);
        });
      }catch(e){ return null; }
    };
  }
  if (typeof window.verifyPermission !== 'function') {
    window.verifyPermission = async function(handle, readWrite){
      try{
        const opts = { mode: readWrite ? 'readwrite' : 'read' };
        if ((await handle.queryPermission(opts)) === 'granted') return true;
        if ((await handle.requestPermission(opts)) === 'granted') return true;
      }catch(e){}
      return false;
    };
  }

  // Robust saver: try chosen folder, else fallback to classic browser download
  window.saveDataUrl = async function(dataUrl, filename){
    try{
      const dir = await window.getSavedDirHandle();
      if (dir && await window.verifyPermission(dir, true)){
        const bin = atob(dataUrl.split(',')[1]);
        const arr = new Uint8Array(bin.length);
        for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
        const mime = (/\.png$/i.test(filename) ? 'image/png' : (/\.jpg$/i.test(filename)||/\.jpeg$/i.test(filename)) ? 'image/jpeg' : 'application/octet-stream');
        const blob = new Blob([arr], {type:mime});
        const fileHandle = await dir.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      }
    }catch(e){
      // fall through to download
    }
    // Fallback: trigger standard download → goes to default "Завантаження"
    const a = document.createElement('a');
    a.download = filename;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    requestAnimationFrame(()=> a.remove());
    return false;
  };

  // Ensure "Зберегти як зображення" uses saveDataUrl
  function ensureImageHook(){
    const btn = document.getElementById('btnSaveImage');
    if (!btn) return;
    // Try to detect existing handler; if none, attach minimal one that calls html2canvas then saveDataUrl
    let attached = false;
    // If there is an existing listener, we won't remove it; this is a safety net.
    btn.addEventListener('click', async function(ev){
      // If some other handler already prevented default and handled, we skip.
      // We can't detect reliably; but calling preventDefault won't break.
      if (typeof html2canvas !== 'function') return;
      // Try to find report
      const report = document.getElementById('report') || document.getElementById('result') || document.getElementById('summary') || document.querySelector('.report');
      if (!report) return;
      // Build filename using PIB + date if helpers exist, else fallback
      function todayDDMMYYYY(){
        const d = new Date();
        const dd = String(d.getDate()).padStart(2,'0');
        const mm = String(d.getMonth()+1).padStart(2,'0');
        const yy = d.getFullYear();
        return dd + '.' + mm + '.' + yy;
      }
      function filenameFromPIB(){
        const el = document.getElementById('pib');
        let v = (el && el.value ? el.value : '').trim();
        if(!v) return 'report';
        try{ v = v.replace(/[^\p{L}\p{N}]+/gu,'_').replace(/^_+|_+$/g,''); }
        catch(e){ v = v.replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,''); }
        return v || 'report';
      }
      const sel = document.getElementById('imgFormat');
      let fmt = sel ? (sel.value||'jpg').toLowerCase() : 'jpg';
      if (fmt === 'jpeg') fmt = 'jpg';
      const prevBg = report.style.backgroundColor;
      if(!prevBg) report.style.backgroundColor = '#ffffff';
      const canvas = await html2canvas(report, { backgroundColor:'#ffffff', useCORS:true, allowTaint:true, scale:4, logging:false });
      if(!prevBg) report.style.backgroundColor = '';
      const dataUrl = (fmt === 'jpg') ? canvas.toDataURL('image/jpeg', 0.95) : canvas.toDataURL('image/png');
      const fname = filenameFromPIB() + '_' + todayDDMMYYYY() + (fmt === 'jpg' ? '.jpg' : '.png');
      await window.saveDataUrl(dataUrl, fname);
    }, { capture: true });
  }
  document.addEventListener('DOMContentLoaded', ensureImageHook);

})();


(function(){
  const LS_KEY = 'pirads_history_v1';
  function nowISO(){ return new Date().toISOString(); }
  function todayDDMMYYYY(){
    const d = new Date(); const dd=String(d.getDate()).padStart(2,'0');
    const mm=String(d.getMonth()+1).padStart(2,'0'); const yy=d.getFullYear();
    return dd+'.'+mm+'.'+yy;
  }
async function readHistory(){
  try {
    const res = await getHistoryRemote();
    return res && res.ok && Array.isArray(res.items) ? res.items : [];
  } catch(_) {
    return [];
  }
}

async function writeHistory(arr){
  return arr;
}
  }
  function uuid(){ return 'h-'+Math.random().toString(36).slice(2)+Date.now().toString(36); }

  // Collect all input/select/textarea values
  function collectFormValues(){
    const data = [];
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(el=>{
      try{
        const rec = { tag: el.tagName.toLowerCase(), id: el.id||null, name: el.name||null, type: el.type||null };
        if (el.type === 'checkbox' || el.type === 'radio'){
          rec.checked = !!el.checked;
          rec.value = el.value;
        }else{
          rec.value = el.value;
        }
        data.push(rec);
      }catch(_){}
    });
    return data;
  }
  // Apply saved values back to form
  function applyFormValues(arr){
    if (!Array.isArray(arr)) return;
    arr.forEach(rec=>{
      let el = null;
      if (rec.id) el = document.getElementById(rec.id);
      if (!el && rec.name) el = document.querySelector(`[name="${CSS.escape(rec.name)}"]`);
      if (!el) return;
      try{
        if (rec.type === 'checkbox' || rec.type === 'radio'){
          el.checked = !!rec.checked;
          if (el.value !== rec.value && el.type==='radio'){
            // try find radio in same name group
            const alt = document.querySelector(`input[type="radio"][name="${CSS.escape(rec.name||'')}"][value="${CSS.escape(rec.value||'')}"]`);
            if (alt) alt.checked = !!rec.checked;
          }
        }else{
          el.value = (rec.value != null ? rec.value : '');
          // trigger change/input
          el.dispatchEvent(new Event('input', {bubbles:true}));
          el.dispatchEvent(new Event('change', {bubbles:true}));
        }
      }catch(_){}
    });
  }

  // Collect polygons from localStorage
  function collectPolygons(){
    const obj = {};
    for (let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if (/^pirads21_/i.test(k)){ obj[k] = localStorage.getItem(k); }
    }
    return obj;
  }
  function applyPolygons(obj){
    if (!obj) return;
    // Clear previous keys of this namespace
    const del = [];
    for (let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(/^pirads21_/i.test(k)) del.push(k);
    }
    del.forEach(k=> localStorage.removeItem(k));
    // Set saved keys
    Object.keys(obj).forEach(k=> localStorage.setItem(k, obj[k]));
  }

  // Report HTML (optional, if present)
  function collectReport(){
    const rep = document.getElementById('report');
    return rep ? rep.innerHTML : null;
  }
  function applyReport(html){
    const rep = document.getElementById('report');
    if (rep && typeof html === 'string'){ rep.innerHTML = html; }
  }

  function getPIB(){
    const el = document.getElementById('pib');
    const v = (el && el.value) ? el.value.trim() : '';
    return v || 'Безіменний';
  }

  function snapshotCurrent(){
    return {
      id: uuid(),
      name: getPIB(),
      savedAt: nowISO(),
      form: collectFormValues(),
      polygons: collectPolygons(),
      reportHTML: collectReport()
    };
  }

async function saveCurrentToHistory(){
  const snap = snapshotCurrent();

  const payload = {
    pib: snap.name || '',
    snapshot: snap,
    form: snap.form || {},
    polygons: snap.polygons || {},
    reportHTML: snap.reportHTML || ''
  };

  const res = await savePatientRemote(payload);

  if (!res || !res.ok) {
    alert((res && res.error) || 'Помилка серверного збереження');
    return;
  }

  await renderHistory();
}

async function loadSession(id, ownerEmail){
  const res = await loadPatientRemote(id, ownerEmail);
  const s = res && res.ok ? (res.data.snapshot || res.data) : null;
  if (!s) return;

  applyFormValues(s.form);
  applyPolygons(s.polygons);
  applyReport(s.reportHTML);
    // refresh any derived UI after load (e.g., regenerate report preview if needed)
    // Try to trigger known functions if they exist
    if (typeof window.handleMakeReport === 'function') { try{ window.handleMakeReport(); }catch(_){ } }
  }

async function removeSession(id, ownerEmail){
  const res = await fetch(window.API_BASE + '/api/patient/delete', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId: id, ownerEmail })
  });

  const data = await res.json();
  if (!data || !data.ok) {
    alert((data && data.error) || 'Не вдалося видалити запис');
    return;
  }

  await renderHistory();
}

  function fmtDate(iso){
    try{
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2,'0');
      const mm = String(d.getMonth()+1).padStart(2,'0');
      const yy = d.getFullYear();
      const t = String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
      return dd+'.'+mm+'.'+yy+' '+t;
    }catch(_){ return todayDDMMYYYY(); }
  }

async function renderHistory(){
  const list = document.getElementById('historyList');
  if (!list) return;

  const items = await readHistory();

  if (!items.length){
    list.innerHTML = '<div class="muted">Поки що порожньо. Натисни «Зберегти поточного».</div>';
    return;
  }

  list.innerHTML = items.map(s => (
    '<div class="row">'+
      '<div class="meta"><div class="name">'+ (s.pib || s.name || 'Безіменний') +'</div><div class="date">'+ fmtDate(s.updatedAt || s.savedAt) +'</div></div>'+
      '<div class="actions">'+
        '<button class="btn" data-act="load" data-id="'+ s.patientId +'" data-owner="'+ (s.ownerEmail || '') +'">Відкрити</button>'+
        '<button class="btn" data-act="delete" data-id="'+ s.patientId +'" data-owner="'+ (s.ownerEmail || '') +'">Видалити</button>'+
      '</div>'+
    '</div>'
  )).join('');

  list.querySelectorAll('button[data-act="load"]').forEach(b =>
    b.addEventListener('click', async (e) => {
      await loadSession(
        e.currentTarget.getAttribute('data-id'),
        e.currentTarget.getAttribute('data-owner')
      );
      document.body.classList.remove('history-open');
    })
  );

  list.querySelectorAll('button[data-act="delete"]').forEach(b =>
    b.addEventListener('click', async (e) => {
      if (!confirm('Видалити цей запис?')) return;
      await removeSession(
        e.currentTarget.getAttribute('data-id'),
        e.currentTarget.getAttribute('data-owner')
      );
    })
  );
}


  document.addEventListener('DOMContentLoaded', function(){
    const openBtn = document.getElementById('btnHistory');
    const closeBtn = document.getElementById('btnHistoryClose');
    const saveBtn = document.getElementById('btnHistorySave');
    const backdrop = document.getElementById('historyBackdrop');

if (openBtn) openBtn.addEventListener('click', async function(){
  document.body.classList.add('history-open');
  await renderHistory();
});
    if (closeBtn) closeBtn.addEventListener('click', function(){ document.body.classList.remove('history-open'); });
    if (backdrop) backdrop.addEventListener('click', function(){ document.body.classList.remove('history-open'); });
if (saveBtn) saveBtn.addEventListener('click', async function(){ await saveCurrentToHistory(); });

// Optional auto-save when PIB changes and user leaves the field
const pib = document.getElementById('pib');
if (pib){
  pib.addEventListener('change', async function(){
    // If there's already a history entry with previous name, saving will overwrite same-name entry
    await saveCurrentToHistory();
  });
}
  });
})();



(function(){
  function showInfo(){
    alert('ІНСТРУКЦІЯ КОРИСТУВАЧА\n\nОсновні дії:\n• «Звіт» — сформувати/оновити звіт у блоці «Звіт PI-RADS».\n• «Друк» — друк тільки блоку звіту (без інтерфейсу).\n• «Зберегти як зображення» — експорт звіту у .jpg (за замовч.) або .png.\n  Назва файлу: «ПІБ_ДД.ММ.РРРР». Якщо папку не обрано — файл збережеться у стандартну «Завантаження».\n\nВибір папки для збереження:\n• Натисніть ☰ (праворуч угорі) → «Обрати папку для збереження».\n• Після вибору всі подальші збереження (зображення/файли) підуть у цю папку.\n• Якщо папку не обрано, діє автозбереження у стандартну теку «Завантаження».\n\nІсторія пацієнтів:\n• Кнопка «Історія» у верхній панелі.\n• «Зберегти поточного» — зберігає ПІБ, усі поля, полігони (pirads21_*) та вміст звіту.\n• У списку: «Відкрити» — відновлює повний стан; «Видалити» — прибирає запис.\n• Змінив ПІБ — запис автоматично оновлюється під цим ім’ям.\n\nЕкспорт/Імпорт полігонів:\n• Через ☰ → «Експорт полігонів / Імпорт полігонів».\n• Експорт — JSON із усіма ключами localStorage «pirads21_*». Імпорт — підвантажує їх назад.\n\nРозробник: Oleksandr Muliar — t.me/oleksandrmuliar');
  }
  document.addEventListener('DOMContentLoaded', function(){
    var b = document.getElementById('btnInfo');
    if (!b) return;
    // remove all old listeners by cloning
    var clone = b.cloneNode(true);
    b.parentNode.replaceChild(clone, b);
    clone.addEventListener('click', showInfo);
  });
})();



document.addEventListener('DOMContentLoaded', function(){
  var pb = document.getElementById('printBtn');
  if(pb){
    pb.addEventListener('click', function(e){
      try {
        if (typeof buildReportText === 'function') { buildReportText(); }
      } catch(_) {}
      try {
        var old = document.getElementById('_printArea'); if(old) old.remove();
        var pa = document.createElement('div');
        pa.id = '_printArea';
        var rep = document.getElementById('report');
        pa.innerHTML = rep ? rep.innerHTML : '';
        document.body.appendChild(pa);
        window.addEventListener('afterprint', function cleanup(){ try{ pa.remove(); }catch(_){} window.removeEventListener('afterprint', cleanup); });
      } catch(_) {}
      setTimeout(function(){ window.print(); }, 50);
    }, {capture:true}); // capture to override earlier handlers
  }
});

async function getHistoryRemote() {
  const res = await fetch(window.API_BASE + '/api/history/list', {
    method: 'GET',
    credentials: 'include'
  });
  return await res.json();
}

async function loadPatientRemote(patientId, ownerEmail) {
  const res = await fetch(window.API_BASE + '/api/patient/get', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, ownerEmail })
  });
  return await res.json();
}

async function savePatientRemote(payload) {
  const res = await fetch(window.API_BASE + '/api/patient/save', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}
