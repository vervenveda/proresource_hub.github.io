import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const source=readFileSync(new URL('../Protools/SixBit_Bun_Studio_index.html',import.meta.url),'utf8');
const style=source.match(/<style>([\s\S]*?)<\/style>/)?.[1]||'';
const script=source.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
test('VNV parchment theme is installed without the starfield presentation',()=>{
  assert.match(style,/--parchment:#f5f0e6/);
  assert.match(style,/--charcoal:#252b2a/);
  assert.match(style,/#starfield\{display:none!important\}/);
  assert.match(style,/@media\(max-width:520px\)/);
});
test('core conversion, export, verification, history and accessibility controls remain present',()=>{
  for(const id of ['dropzone','fileInput','resizeWidth','quality','formatMode','outputMode','batchMode',
    'convertBtn','cancelBtn','manifestBtn','downloadImagesBtn','downloadCodesBtn',
    'packageBtn','clearBtn','gallery','summaryText','progressBar','guideBtn','historyBtn',
    'verifierBtn','bunVerifyInput','verifyInlineBtn','historyPreview','exportHistoryBtn',
    'clearHistoryBtn','motionBtn','starfield','guideModal','historyModal','verifierModal','undoToast']){
      assert.match(source,new RegExp('id="'+id+'"'),'missing '+id);
  }
});
test('original tool module parses and the official utility toolbar remains single-owner',()=>{
  assert.doesNotThrow(()=>new Script(script));
  assert.equal((source.match(/<script src="https:\/\/vervenveda\.com\/assets\/vnv-ecosystem-toolbar\.js"><\/script>/g)||[]).length,1);
  assert.match(script,/window\.SixBitBun=/);
});
test('no accidental duplicate IDs in page markup',()=>{
 const beforeScript=source.slice(0,source.indexOf('<script>'));
 const ids=[...beforeScript.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length);
});
