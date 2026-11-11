/* Khaemenes Scientific Calculator — source-coupled regression suite.
 * Run: node tests/scientific-calculator-regression.cjs
 * No dependencies, network access, or production hooks.
 * The parser is extracted directly from the shipped calculator HTML.
 */
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const html=fs.readFileSync(path.join(__dirname,"../Protools/Khaemenes_Scientific_Calculator/index.html"),"utf8");
const start=html.indexOf("function rad(x)");
const end=html.indexOf("function formatError(",start);
assert.ok(start>=0&&end>start,"Calculator parser boundaries must exist");
const source=html.slice(start,end);
const evaluate=vm.runInNewContext(`(function(expression,mode="DEG"){
 let state={angleMode:mode,answer:0,memory:0};
 ${source}
 return calculateValue(expression);
})`,{Math,Number,Error});
const cases=[
 ["2+3*4",14],["(2+3)*4",20],["-2^2",-4],["(-2)^2",4],
 ["2^3^2",512],["200+10%",220],["200-10%",180],["20%+5",5.2],
 ["sqrt(81)",9],["cbrt(27)",3],["3!",6],["5!",120],
 ["sin(30)",0.5],["cos(60)",0.5],["tan(45)",1],
 ["sin(pi/2)",1,"RAD"],["asin(0.5)",30],["log(1000)",3],
 ["ln(e)",1],["1/0",null],["sqrt(-1)",null],["171!",null],
 ["2(3+4)",14],["2^(-3)",0.125],["1e-9*2",2e-9],
 ["reciprocal(4)",0.25]
];
let passed=0;
for(const [expression,expected,mode] of cases){
 if(expected===null){
  assert.throws(()=>evaluate(expression,mode),undefined,expression+" should reject");
 }else{
  const actual=evaluate(expression,mode);
  assert.ok(Number.isFinite(actual),expression+" should be finite");
  assert.ok(Math.abs(actual-expected)<=1e-9*Math.max(1,Math.abs(expected)),
    expression+": expected "+expected+", got "+actual);
 }
 passed++;
}
const required=[
 "id=\"keys\"","id=\"historyDrawer\"","id=\"historyToggle\"",
 "id=\"functionGuide\"","id=\"functionGuideInsert\"",
 "id=\"functionGuideTopic\"","khaemenes-scientific-calculator-v4",
 "event.target?.closest?.","vnv-header-autopopulate.js"
];
for(const key of required)assert.ok(html.includes(key),"Missing UI/storage contract: "+key);
const inline=[...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/g)]
 .map(m=>m[1]).filter(s=>s.trim());
for(const [index,script] of inline.entries()){
 new vm.Script(script,{filename:"calculator-inline-"+index+".js"});
}
console.log("PASS: "+passed+" parser cases, "+required.length+" UI contracts and "+inline.length+" inline script syntax checks.");
