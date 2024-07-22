# bloom-filters-js-benchmark
Some benchmarking of the JavaScript bloom-filters JavaScript library

# Run

## Small Test

```bash
# N = 1,000; K = 100; E = 1/(2^256)
node benchmark.js 1000 100 8.636168555094445e-78
```

### Output

```
N = 1000
K = 100
E = 8.636168555094445e-78
Build: 98 ms
Serialize: 5 ms
Uncompressed Size: 61668 bytes
Deserialize: 6 ms
```

## Big Test

```bash
# N = 500,000; K = 3,000; E = 1/(2^256)
node benchmark.js 500000 3000 8.636168555094445e-78
```

### Output

```
N = 500000
K = 3000
E = 8.636168555094445e-78
Build: 215329 ms
Serialize: 3291 ms
Uncompressed Size: 30777614 bytes
Deserialize: 105 ms
```

## Theoretical Comparison to SHA256 (*n* = 500K, *k* = 3K)

For the task of storing a collection of *n* strings with the intention to perform "find" operations on query strings, one alternative to a Bloom Filter that is still more efficient than just listing all *n* strings would be to store their [SHA256](https://en.wikipedia.org/wiki/SHA-2) hashes. Each SHA256 hash is a 256-bit = 32-byte integer (thus the total size to store all of the raw SHA256 hashes would be 32*n* bytes), and the probability that two different strings *x* and *y* will have the same SHA256 hash is $2^{-256}$. The time complexity to calculate all SHA256 hashes of a collection of *n* strings of length *k* would be O(*nk*): O(*k*) per string, performed for all *n* strings.

To mirror the larger of the two Classic Bloom Filter benchmarks above (*n* = 500,000; *k* = 3,000), the list of raw SHA256 hashes would be 32 * 500,000 = 16,000,000 bytes = 16 MB. At a glance, this *seems* better than the Classic Bloom Filter, which had a serialized size of 30,777,614 bytes = 31 MB.

However, the Classic Bloom Filter can be directly operated upon: given a query string, excluding the hashing step on the query, the "find" operation is O(1) per query. The unsorted list of SHA256 hashes, however, would require a O(*n*) scan to perform "find" operations for each query (also excluding the hashing step).

One improvement to the SHA256 approach would be to store a *sorted* list of SHA256 hashes. This would improve the "find" operation to O(log *n*) per query, which is still much slower than O(1), and it would worsen the "build" operation to O(*nk* + *n* log *n*) due to the need for an additional sorting step performed on the SHA256 hashes, which *could* be tolerable given that it happens server-side fairly infrequently (but would likely be intolerably slow if it ever needs to be performed client-side).

Another improvement to the SHA256 approach would be to store the original *unsorted* list of SHA256 hashes when sending from server to client, but store it client-side in a Hash Table instead of an (un)sorted list. This would keep the O(*nk*) server-side "build" operation, and excluding client-side hash calculations, this would be O(1) *average*-case "find" per query (all aforementioned time complexities were *worst*-case), but to achieve average-case O(1) "find" per query, we would need the Hash Table to have a reasonable number of empty slots. Thus, if the raw collection of SHA256 hashes would be 16 MB, we would expect 24-32 MB for the Hash Table (which brings it in-line with a Bloom Filter in terms of size).

In conclusion, it seems as though, from a *theoretical* standpoint, using a Bloom Filter for inexact client-side "Have I seen this element in the big database?" would likely be better than comparing SHA256 hashes (and would be comparable at worst).
