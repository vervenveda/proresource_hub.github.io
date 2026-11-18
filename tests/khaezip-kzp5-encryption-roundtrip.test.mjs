import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {webcrypto,createHash} from 'node:crypto';

const html=readFileSync(new URL('../Protools/KhaeZip™_index.html',import.meta.url),'utf8');
function chunk(start,end){
 const a=html.indexOf(start),b=html.indexOf(end,a+start.length);
 assert.ok(a>=0 && b>a,'missing source anchors '+start);
 return html.slice(a,b);
}
const cryptoPolicy=chunk('const VERSION =','const VAULT_BACKUP_LIMIT');
const lowLevel=chunk('function writeU16(','function dosDateTime(');
const b64=chunk('function bytesToBase64(','function sha256Fallback(');
const nativeKZ=chunk('async function deriveKey(','/* Strict ZIP parser */');
const ctx={
  Uint8Array,TextEncoder,TextDecoder,Blob,Date,JSON,Math,Array,Set,Error,Number,
  crypto:webcrypto,atob,btoa,globalThis:null,
  LIMITS:{archiveBytes:768*1024*1024},
  human:bytes=>String(bytes)
};
ctx.globalThis=ctx;
runInNewContext(cryptoPolicy+'\n'+lowLevel+'\n'+b64+'\n'+nativeKZ,ctx,{timeout:2000});
const seal=runInNewContext('encryptKZ5',ctx),open=runInNewContext('decryptKhae',ctx);
const fixture=new Blob([new TextEncoder().encode('FICTIONAL-ARCHIVE-ONLY; NO ACCOUNTS OR SECRETS')],{type:'application/zip'});
const password='Synthetic-Only-Test-Password-123!';
const hex=x=>createHash('sha256').update(x).digest('hex');

test('KhaeZip KZP5 encrypt decrypt reproduces original SHA-256 bytes',async()=>{
 const encrypted=await seal(fixture,password);
 const magic=Buffer.from(await encrypted.slice(0,4).arrayBuffer()).toString();
 assert.equal(magic,'KZP5');
 const result=await open(encrypted,password);
 assert.equal(result.header.schemaVersion,5);
 assert.equal(hex(Buffer.from(await result.blob.arrayBuffer())),hex(Buffer.from(await fixture.arrayBuffer())));
});

test('KhaeZip KZP5 denies incorrect password',async()=>{
 const encrypted=await seal(fixture,password);
 await assert.rejects(open(encrypted,'Incorrect-Password-123!'),/Decryption failed/);
});

test('KhaeZip KZP5 denies ciphertext tampering',async()=>{
 const encrypted=new Uint8Array(await (await seal(fixture,password)).arrayBuffer());
 encrypted[encrypted.length-1]^=1;
 await assert.rejects(open(new Blob([encrypted]),password),/Decryption failed/);
});

test('KhaeZip KZP5 denies authenticated header tampering',async()=>{
 const encrypted=new Uint8Array(await (await seal(fixture,password)).arrayBuffer());
 const length=(encrypted[4]|encrypted[5]<<8|encrypted[6]<<16|encrypted[7]<<24)>>>0;
 const head=new TextDecoder().decode(encrypted.subarray(8,8+length));
 const value='createdAt';
 const position=head.indexOf(value);
 assert.ok(position>=0);
 encrypted[8+position]^=1; // preserve valid JSON but break header schema/AEAD binding
 await assert.rejects(open(new Blob([encrypted]),password));
});

test('KhaeZip refuses invalid encryption header length before attempting decryption',async()=>{
 const encrypted=new Uint8Array(await (await seal(fixture,password)).arrayBuffer());
 encrypted[4]=255;encrypted[5]=255;encrypted[6]=255;encrypted[7]=127;
 await assert.rejects(open(new Blob([encrypted]),password),/header size/);
});
