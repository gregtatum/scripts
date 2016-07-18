const split = require('split');
const through2 = require('through2')

;(function() {
  process.stdin
    .pipe(split())
    .pipe(through2.obj(function(chunk, enc, callback) {
      this.push(chunk + "\n")
      callback()
    }))
    .pipe(process.stdout)
})()
