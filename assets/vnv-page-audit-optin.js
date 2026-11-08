/* VNV campus opt-in layout and accessibility audit v1.0.0
   ?page_audit=1 only. No storage, cookies, network requests, learner data or mutation
   of campus components. The diagnostic panel itself is the sole added interface. */
(()=>{"use strict";
if(new URLSearchParams(location.search).get("page_audit")!=="1"||window.VNVPageAudit)return;
const ver="1.0.0",maxFonts=35,excluded="#vnvPageAuditPanel";
let panel=null,out=null,closed=false;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const round=n=>Math.round(n*10)/10;
const rect=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(round).join("×")};
const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity)>0&&r.width>0&&r.height>0};
function chrome(){
 const parts=[["333","#vnv333NetworkTicker"],["Auto","#vnvTickerAutoPopulate"],["Header","#vnvHeaderAutoPopulate"],["Toolbar","#vnvEcosystemUtilityDock"]];
 return parts.map(([name,sel])=>{
  const e=$(sel);if(!e)return name+": MISSING";
  const s=getComputedStyle(e);
  const r=e.getBoundingClientRect();
  const x=Math.max(0,Math.min(innerWidth-1,r.x+r.width/2));
  const y=Math.max(0,Math.min(innerHeight-1,r.y+r.height/2));
  const hit=document.elementFromPoint(x,y);
  return name+": "+(visible(e)?"VISIBLE":"HIDDEN")+" rect(x,y,w,h)="+rect(e)+
    " · top="+s.top+" · z="+s.zIndex+" · display="+s.display+" · hit="+(hit&&(hit===e||e.contains(hit)));
 }).join("\n");
}
function fonts(){
 const list=[];let inspected=0;
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;
 while((node=walker.nextNode())){
  const str=node.nodeValue.trim();if(!str||!node.parentElement)continue;
  const el=node.parentElement;
  if(el.closest(excluded+",script,style,template,noscript,svg,[hidden],[aria-hidden='true']"))continue;
  if(!visible(el))continue;
  const s=getComputedStyle(el);
  const n=parseFloat(s.fontSize);inspected++;
  if(Number.isFinite(n)&&n<15.95){
   const label=(el.tagName.toLowerCase()+(el.id?"#"+el.id:"")+(el.className&&typeof el.className==="string"?"."+el.className.trim().split(/\s+/).slice(0,2).join("."):""));
   list.push({font:round(n),where:label,text:str.replace(/\s+/g," ").slice(0,58)});
  }
 }
 list.sort((a,b)=>a.font-b.font);
 return "Visible text nodes inspected="+inspected+" · below16="+list.length+
 "\n"+(list.length?list.slice(0,maxFonts).map(x=>x.font+"px · "+x.where+" · "+x.text).join("\n"):"PASS — none detected")+
 (list.length>maxFonts?"\n..."+(list.length-maxFonts)+" additional occurrences omitted":"");
}
function grids(){
 const selectors=[".hall-grid",".principles-grid",".archive-principles",".future-grid",".corridor-grid",".resource-grid",".network-grid",".cat-grid",".tool-grid",".section-grid",".card-grid"];
 const results=[];
 for(const selector of selectors){
  for(const grid of $$(selector).slice(0,3)){
   if(!visible(grid))continue;
   const kids=[...grid.children].filter(visible);
   const rows=new Map();
   for(const e of kids){const y=Math.round(e.getBoundingClientRect().top/4)*4;rows.set(y,(rows.get(y)||0)+1)}
   const col=getComputedStyle(grid).gridTemplateColumns;
   results.push(selector+": "+kids.length+" visible children · rows="+[...rows.values()].join("/")+
     " · columns="+col.slice(0,130));
  }
 }
 return results.length?results.join("\n"):"No target card grids visible in this viewport";
}
function overlap(){
 const bar=$("#vnvEcosystemUtilityDock");
 const footer=$("footer");
 if(!bar||!footer)return "Toolbar or footer absent";
 const a=bar.getBoundingClientRect(),b=footer.getBoundingClientRect();
 const dx=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));
 const dy=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
 return "Toolbar intersects footer rectangle="+(dx>0&&dy>0)+
 " (area="+Math.round(dx*dy)+"px²). At bottom inspect footer links, not just background.";
}
function report(){
 const h=$("#vnvHeaderAutoPopulate"),t1=$("#vnv333NetworkTicker"),t2=$("#vnvTickerAutoPopulate");
 const gap=(a,b)=>a&&b?round(b.getBoundingClientRect().top-a.getBoundingClientRect().bottom)+"px":"n/a";
 return [
 "VNV PAGE FORENSIC REPORT v"+ver,"Read-only, opt-in; no learner data.",
 "[PAGE] "+location.pathname+" · viewport="+innerWidth+"×"+innerHeight+" · scrollY="+Math.round(scrollY),
 "[OVERFLOW] scrollWidth="+document.documentElement.scrollWidth+
 " · clientWidth="+document.documentElement.clientWidth+
 " · horizontal="+Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth)+"px",
 "[CANONICAL CHROME]",chrome(),
 "333→auto gap="+gap(t1,t2)+" · auto→header gap="+gap(t2,h)+
 " · --vnv-header-top="+getComputedStyle(document.documentElement).getPropertyValue("--vnv-header-top").trim(),
 "[FONTS]",fonts(),
 "[VISIBLE GRID GEOMETRY]",grids(),
 "[FOOTER / TOOLBAR]",overlap(),
 "[NOTES] Refresh report after scrolling to footer, opening menus, or resizing viewport."
 ].join("\n\n");
}
function refresh(){if(out&&!closed)out.textContent=report()}
function mount(){
 if(!document.body||panel||closed)return;
 panel=document.createElement("aside");panel.id="vnvPageAuditPanel";
 panel.setAttribute("aria-label","Opt-in VNV page forensic audit");
 panel.style.cssText="position:fixed!important;left:8px!important;bottom:8px!important;z-index:2147483647!important;width:min(750px,calc(100vw - 16px))!important;max-height:55vh!important;overflow:auto!important;padding:14px!important;border:2px solid #c8a66e!important;border-radius:7px!important;background:#192831!important;color:#fff8e9!important;font:400 14px/1.5 ui-monospace,monospace!important;box-shadow:0 10px 35px #0008!important";
 const h=document.createElement("div");h.textContent="Page Audit · "+location.pathname;h.style.cssText="font-size:17px;font-weight:400;margin-bottom:10px";
 const controls=document.createElement("div");controls.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px";
 for(const [label,cb] of [["Refresh",refresh],["Copy report",()=>{const txt=report();out.textContent=txt;navigator.clipboard?.writeText(txt).catch(()=>{})}],["Close",()=>{closed=true;panel.remove();panel=null;out=null}]]){
  const btn=document.createElement("button");btn.type="button";btn.textContent=label;btn.style.cssText="font:400 16px/1.3 Arial,sans-serif;padding:8px 12px;border:1px solid #c8a66e;border-radius:7px;background:#fff8e9;color:#243038;cursor:pointer";btn.addEventListener("click",cb);controls.append(btn);
 }
 out=document.createElement("pre");out.style.cssText="margin:0!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important;color:#fff8e9!important;font:400 13px/1.5 ui-monospace,monospace!important";
 panel.append(h,controls,out);document.body.append(panel);refresh();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.addEventListener("load",refresh);
window.VNVPageAudit=Object.freeze({version:ver,snapshot:report,refresh});
})();