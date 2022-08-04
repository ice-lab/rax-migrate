function mergePackage(raxPkg, icePkg) {
  let pkg = {};
  for (let key in raxPkg) {
    let raxValue = raxPkg[key];
    let iceValue = icePkg[key];
    if (key === 'scripts') {
      // Move rax scripts to ice scripts when ice scripts has't the script.
      pkg[key] = Object.assign(raxValue, iceValue || {});
    } else {
      // Merge rax pkg config and ice pkg config.
      if (Object.prototype.toString.call(raxValue) === '[Object Object]') {
        pkg[key] = Object.assign(iceValue || {}, raxValue);
      } else {
        pkg[key] = raxValue;
      }
    }
  }
  return pkg;
}

export default mergePackage;
