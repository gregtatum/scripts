# cargo-test-debug

This script automatically runs a cargo test for a specific function with lldb and
sets a breakpoint for that function. It assumes to be running in the current
working directory of the Cargo.toml for that project.

Usage:

```
cargo-test-debug test_function_name
```

# Installation

Set this up as an alias, e.g.

```
alias cargo-test-debug="node ~/scripts/rust-scripts/cargo-test-debug.js
```
