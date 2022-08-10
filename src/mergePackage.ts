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
      if (Object.prototype.toString.call(raxValue) === '[Object Object]') {
        pkg[key] = Object.assign(iceValue, raxValue);
      } else {
        pkg[key] = raxValue;
      }
    }
  }
  return pkg;
}

export default mergePackage;
