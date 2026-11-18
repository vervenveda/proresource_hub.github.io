import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {createHash} from 'node:crypto';

const six=readFileSync(new URL('../Protools/SixBit_Bun_Studio_index.html',import.meta.url),'utf8');
const khae=readFileSync(new URL('../Protools/KhaeZip™_index.html',import.meta.url),'utf8');
function between(text,start,end) {
  const a=text.indexOf(start),b=text.indexOf(end,a+start.length);
  assert.ok(a!==-1&&b>a,'expected source markers: '+start+' / '+end);
  return text.slice(a,b);
}
const sixZip=between(six,'const CRC_TABLE=','function codeName(');
const khaePath=between(khae,'function normalizeArchivePath(','function uniquePath(');
const khaeParser=between(khae,'function readU16(','async function inflateRaw(');
const khaeCRC=between(khae,'function makeCRCTable(','function writeU16(');
const khaeExtract=between(khae,'async function extractEntryBytes(','/* Downloads */');
const zipLimits={maxZipEntries:500,maxZipBytes:512*1024*1024,maxNameBytes:4096};
const scanLimits={archiveBytes:768*1024*1024,entries:5000,entryBytes:256*1024*1024,expandedBytes:1024*1024*1024,nameBytes:4096};
const zipCtx={Uint8Array,Uint32Array,TextEncoder,Blob,Date,Math,Array,Set,Error,
  LIMITS:zipLimits,safeFilename:n=>String(n).replace(/[^A-Za-z0-9._-]/g,'_'),humanSize:n=>String(n)};
runInNewContext(sixZip,zipCtx,{timeout:2000});
const khaeCtx={Uint8Array,Uint32Array,TextEncoder,TextDecoder,Blob,Date,Math,Array,Set,Error,
  LIMITS:scanLimits, human:n=>String(n), crcTable:null};
runInNewContext(khaePath+'\n'+khaeCRC+'\n'+khaeParser+'\n'+khaeExtract,khaeCtx,{timeout:2000});
const sha=b=>createHash('sha256').update(b).digest('hex');
const image=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l5sAAAAASUVORK5CYII=','base64');
const report=Buffer.from('SYNTHETIC TEST ONLY\\nNo accounts, keys, or protected information.\\n','utf8');
const manifest=Buffer.from(JSON.stringify({
 schema:'vnv-ka-synthetic-commissioning-evidence',schemaVersion:1,
 classification:'SYNTHETIC_NON_SECRET_ONLY',commissioningAuthority:'NONE',
 files:[{name:'fictional-report.txt',sizeBytes:report.length,sha256:sha(report)},
        {name:'fictional-pixel.png',sizeBytes:image.length,sha256:sha(image)}]
},null,2));
const inputs=[
 {name:'manifest.json',bytes:new Uint8Array(manifest)},
 {name:'assets/fictional-pixel.png',bytes:new Uint8Array(image)},
 {name:'evidence/fictional-report.txt',bytes:new Uint8Array(report)}
];
const createZip=runInNewContext('createZip',zipCtx);
const parseZip=runInNewContext('parseZipStrict',khaeCtx);
const extract=runInNewContext('extractEntryBytes',khaeCtx);

test('SixBit ZIP output passes KhaeZip strict parser and CRC, matches all SHA-256 bytes',async()=>{
 const blob=createZip(inputs);const bytes=new Uint8Array(await blob.arrayBuffer());
 const found=parseZip(bytes);
 assert.equal(found.totalEntries,inputs.length);
 for(const entry of found.entries){
  const source=inputs.find(x=>x.name===entry.name);
  assert.ok(source,'unrecognized archive entry');
  const recovered=await extract(bytes,entry,true);
  assert.equal(sha(recovered),sha(source.bytes));
  assert.equal(Buffer.compare(Buffer.from(recovered),Buffer.from(source.bytes)),0);
 }
 const manifestRec=found.entries.find(x=>x.name==='manifest.json');
 const decoded=JSON.parse(Buffer.from(await extract(bytes,manifestRec,true)).toString());
 assert.equal(decoded.commissioningAuthority,'NONE');
 for(const item of decoded.files){
  const archiveName=item.name.endsWith('.png')?'assets/'+item.name:'evidence/'+item.name;
  const entry=found.entries.find(x=>x.name===archiveName);
  assert.ok(entry);
  assert.equal(item.sha256,sha(await extract(bytes,entry,true)));
 }
});

test('KhaeZip CRC rejects single-byte asset tampering',async()=>{
 const bytes=new Uint8Array(await createZip(inputs).arrayBuffer());
 const entry=parseZip(bytes).entries.find(x=>x.name==='assets/fictional-pixel.png');
 bytes[entry.dataStart]^=1;
 await assert.rejects(()=>extract(bytes,entry,true),/CRC mismatch/);
});

test('KhaeZip strict parser rejects corrupted central-directory signature',async()=>{
 const bytes=new Uint8Array(await createZip(inputs).arrayBuffer());
 const parsed=parseZip(bytes);
 bytes[parsed.centralOffset]^=1;
 assert.throws(()=>parseZip(bytes),/Bad central directory signature/);
});

test('SixBit ZIP writer rejects duplicate normalized names',()=>{
 assert.throws(()=>createZip([{name:'A.txt',bytes:Uint8Array.of(1)},{name:'a.txt',bytes:Uint8Array.of(2)}]),/Duplicate package path/);
});

test('KhaeZip parser rejects overlapping local header offsets',async()=>{
 const bytes=new Uint8Array(await createZip(inputs).arrayBuffer());
 const parsed=parseZip(bytes);
 const encoder=new TextEncoder();
 const first=parsed.entries[0],second=parsed.entries[1];
 const firstCentral=parsed.centralOffset;
 const central1len=46+encoder.encode(first.name).length;
 const secondCentral=firstCentral+central1len;
 assert.equal(bytes[secondCentral],0x50);
 // Point the second central entry to the first entry's local header.
 const at=secondCentral+42,off=first.localOffset;
 bytes[at]=off&255;bytes[at+1]=(off>>>8)&255;bytes[at+2]=(off>>>16)&255;bytes[at+3]=(off>>>24)&255;
 assert.throws(()=>parseZip(bytes),/filenames disagree|overlap|Invalid local header/);
});
