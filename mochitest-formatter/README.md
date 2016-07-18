# Format Gecko's Mochitest Output

Pipe the output of a mochitest to this node app, and it will colorize it and remove
extraneous information. Also if a line starts with `!!!` then it will be highlighted
purple, which is useful for debugging tests.

## Example bash function

```bash
mtf() {
  clear
  ./mach mochitest "$@" | node ~/scripts/mochitest-formatter
}
```
