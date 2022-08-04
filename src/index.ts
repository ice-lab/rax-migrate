import fse from 'fs-extra';
import fs from 'fs';
import spawn from 'cross-spawn';
import path from 'path';
import transformBuild from './transformBuild.js';
import mergePackage from './mergePackage.js';
import moveFiles from './moveFiles.js';

interface TransfromOptions {
  rootDir: string;
  projcetName: string;
  raxProjectName: string;
}

export async function transform(options: TransfromOptions) {
  const iceProjectDir = path.resolve(process.cwd(), options.projcetName);
  const raxProjectDir = path.resolve(process.cwd(), options.raxProjectName);

  // Init ice project.
  spawn.sync('npx', ['create-ice', options.projcetName, '--template', 'ice-scaffold-simple'], {
    stdio: 'inherit',
  });

  // Remove default src.
  spawn.sync('rm', ['-rf', 'src'], {
    cwd: iceProjectDir,
    stdio: 'inherit',
  });

  // Copy src of rax project to ice project.
  spawn.sync('cp',
    [
      '-r',
      path.join(raxProjectDir, './src'),
      path.join(iceProjectDir, './src')
    ], {
    stdio: 'inherit',
  });

  // Transfrom build.json to ice.config.mts.
  const buildJson = await fse.readJSON(path.join(raxProjectDir, './build.json'));
  const iceConfig = await transformBuild(buildJson);
  fse.writeJson(path.join(iceProjectDir, './ice.config.mts'), iceConfig);

  // Merge package.json.
  const raxPkg = await fse.readJSON(path.join(raxProjectDir, './package.json'));
  const icePkg = await fse.readJSON(path.join(iceProjectDir, './package.json'));
  const mergePkg = await mergePackage(raxPkg, icePkg);
  fse.writeJson(path.join(iceProjectDir, './package.json'), mergePkg);

  // Move other files such as tsconfig and etc...
  await moveFiles();
};
