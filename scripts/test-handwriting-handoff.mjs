#!/usr/bin/env node
// Read-only source-contract check: node scripts/test-handwriting-handoff.mjs
import fs from "node:fs";
import assert from "node:assert/strict";
const source=fs.readFileSync(new URL("../Protools/PROSE/Handwriting Lab/handwriting-lab.html",import.meta.url),"utf8");
for(const [name,pattern] of Object.entries({
  vocabularyReceiver:/function receiveReadingPractice\(\)/,
  explicitFragment:/vnv-practice=/,
  fragmentCleared:/history\.replaceState\(null,"",location\.pathname\+location\.search\)/,
  inputLimit:/Array\.from\(word\)\.length>80/,
  controlCharacterGuard:/charCodeAt\(0\)<32/,
  selectedLanguage:/handwritingPracticeLanguages/,
  bilingualSource:/id="bilingualSource"/,
  bilingualTranslation:/id="bilingualTranslation"/,
  readAloud:/function bilingualSpeak\(elementId\)/,
  recall:/id="bilingualCheckRecall"/,
  printRules:/#worksheetView\{display:block!important\}/,
  portfolioOptIn:/\$\("saveSampleBtn"\)\.onclick=/,
}))assert.match(source,pattern,"Missing handshake guard: "+name);
assert.doesNotMatch(source,/fetch\([^)]*vnv-practice/,"Vocab handoff should not fetch externally");
console.log("HANDWRITING_HANDOFF_SOURCE_GUARDS=PASS");
