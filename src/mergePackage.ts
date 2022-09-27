const extraDependencies = {
  '@ice/plugin-rax-compat': 'latest',
  '@ice/plugin-jsx-plus': 'latest',
  '@ice/webpack-modify': 'latest',
};

function mergePackage(raxPkg: object, icePkg: object): object {
  let pkg = Object.assign({}, icePkg);
  for (let key in raxPkg) {
    let raxValue: string | object = raxPkg[key];
    let iceValue: string | object = icePkg[key] || {};
    if (key === 'scripts') {
      // Move rax scripts to ice scripts when ice scripts has't the script.
      pkg[key] = Object.assign(raxValue, iceValue);
    } else {
      // Merge rax pkg config and ice pkg config.
      if (typeof raxValue === 'object') {
        pkg[key] = Object.assign(iceValue, raxValue);
      } else {
        pkg[key] = raxValue;
      }
    }
  }

  // Add extra dependencies to dependencies.
  for (let [dep, version] of Object.entries(extraDependencies)) {
    pkg['dependencies'][dep] = version;
  }

  return pkg;
}

export default mergePackage;
