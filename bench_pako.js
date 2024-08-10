// set things up
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pako = require('pako');
var fs = require('fs');

// parse user arguments
if(process.argv.length != 6) {
    throw new Error("USAGE: " + process.argv[0] + " " + process.argv[1] + " <example_CSV> <N> <compress_level> <mem>");
}
const csv = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n');
const N = parseInt(process.argv[3]);
const LEVEL = parseInt(process.argv[4]);
const MEM = parseInt(process.argv[5]);
console.log(`CSV = ${process.argv[2]} (${csv.length} lines)`);
console.log(`N = ${N}`);
console.log(`LEVEL = ${LEVEL}`);
console.log(`MEM = ${MEM}`);

// create test dataset
let data = "";
for(let i = 0; i < N; ++i) {
    data += csv[Math.floor(Math.random()*csv.length)];
    data += '\n';
}
console.log(`Uncompressed Size: ${data.length} bytes`)

// GZIP-compress test dataset
let start = new Date();
const compressed = pako.deflate(data, {level:LEVEL, memLevel:MEM});
//const compressed = gzipSync(data, {level:LEVEL, mem:MEM});
let end = new Date();
console.log(`Compress: ${end.getTime() - start.getTime()} ms`);
console.log(`Compressed Size: ${compressed.byteLength} bytes`);
