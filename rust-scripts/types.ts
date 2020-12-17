export type Target = {
  kind: string[], // [ 'example' ],
  crate_types: string[], // [ 'bin' ],
  name: string, //'attributes-enums',
  src_path: string, // '/Users/greg/me/spec-rs/examples/attributes-enums.rs',
  edition: string, // '2015',
  doc: boolean,
  doctest: boolean,
  test: boolean
}

export type Profile = {
  opt_level: string, // '0',
  debuginfo: number, //2,
  debug_assertions: boolean,
  overflow_checks: boolean,
  test: boolean
}

export type CargoTestRow =
  | {
    reason: 'compiler-artifact',
    package_id: string, // 'spec-rs 0.1.0 (path+file:///Users/greg/me/spec-rs)',
    target: Target,
    profile: Profile,
    features: string[],
    filenames: string[], // paths
    executable: string | null, // path
    fresh: boolean
  }
  | {
    reason: 'build-finished',
    success: boolean
  }
