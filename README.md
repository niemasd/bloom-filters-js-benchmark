# bloom-filters-js-benchmark
Some benchmarking of the JavaScript bloom-filters JavaScript library

## Run

```bash
# N = 1,000; K = 100; E = 1/(2^256)
node benchmark.js 1000 100 8.636168555094445e-78
```

* N = 1000
* K = 100
* E = 8.636168555094445e-78
* Build: 76 ms
* Serialize: 5 ms
* Uncompressed Size: 61668 bytes
* Compress: 57 ms
* Compressed Size: 65676 bytes

```
# N = 500,000; K = 3,000; E = 1/(2^256)
node benchmark.js 500000 3000 8.636168555094445e-78
```

* N = 500000
* K = 3000
* E = 8.636168555094445e-78
* Build: 206190 ms
* Serialize: 3061 ms
* Uncompressed Size: 30777614 bytes
* Compress: 24240 ms
* Compressed Size: 32152416 bytes
