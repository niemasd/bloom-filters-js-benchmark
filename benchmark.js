// set things up
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
import BloomFilter from 'bloom-filters'; // https://callidon.github.io/bloom-filters
//import { gzipSync, strToU8 } from 'fflate'; // https://github.com/101arrowz/fflate

// parse user arguments
if(process.argv.length != 5) {
    throw new Error("USAGE: " + process.argv[0] + " " + process.argv[1] + " <N> <K> <E>");
}
const N = parseInt(process.argv[2]);
const K = parseFloat(process.argv[3]);
const E = parseFloat(process.argv[4]);
console.log(`N = ${N}`);
console.log(`K = ${K}`);
console.log(`E = ${E}`);

// build Bloom Filter from N random strings of length K
let start = new Date();
let filter = BloomFilter.BloomFilter.create(N, E);
for(let i = 0; i < N; ++i) {
    let s = "";
    for(let j = 0; j < K; ++j) {
        s += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    filter.add(s);
}
let end = new Date();
console.log(`Build: ${end.getTime() - start.getTime()} ms`);

// export Bloom Filter as JSON
start = new Date();
const exported = filter.saveAsJSON();
const exported_s = new TextEncoder().encode(JSON.stringify(exported));
end = new Date();
console.log(`Serialize: ${end.getTime() - start.getTime()} ms`);
console.log(`Uncompressed Size: ${exported_s.length} bytes`);

// GZIP-compress serialized Bloom Filter JSON
/* Compressing is actually worse
start = new Date();
const compressed = gzipSync(strToU8(exported), {level:9, mem:4});
end = new Date();
console.log(`Compress: ${end.getTime() - start.getTime()} ms`);
console.log(`Compressed Size: ${compressed.byteLength} bytes`);
*/

// load serialized Bloom Filter as JSON
start = new Date();
const imported = BloomFilter.BloomFilter.fromJSON(exported);
end = new Date();
console.log(`Deserialize: ${end.getTime() - start.getTime()} ms`);
