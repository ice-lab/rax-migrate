import fse from 'fs-extra';
import spawn from 'cross-spawn';
import path from 'path';
import ejs from 'ejs';
import transformBuild from './transformBuild.js';
import mergePackage from './mergePackage.js';
import moveFiles from './moveFiles.js';
import type { RaxAppConfig, Config } from './transformBuild';
import { fileURLToPath } from 'url';

interface TransfromOptions {
  rootDir: string;
  projcetName: string;
  raxProjectName: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  const buildJson: RaxAppConfig = await fse.readJSON(path.join(raxProjectDir, './build.json'));
  const config: Config = await transformBuild(buildJson);
  if (config.iceConfig) {
    fse.writeJson(path.join(iceProjectDir, './ice.config.mts'), config.iceConfig);
  }
  if (config.browsersListRc) {
    fse.writeFileSync(path.join(iceProjectDir, './.browserslistrc'), config.browsersListRc);
  }

  // Merge package.json.
  const raxPkg = await fse.readJSON(path.join(raxProjectDir, './package.json'));
  const icePkg = await fse.readJSON(path.join(iceProjectDir, './package.json'));
  const mergePkg = await mergePackage(raxPkg, icePkg);
  fse.writeJson(path.join(iceProjectDir, './package.json'), mergePkg);

  // Move other files such as tsconfig and etc...
  await moveFiles(raxProjectDir, iceProjectDir);

  const template = fse.readFileSync(path.join(__dirname, '../templates/ice.config.mts.ejs'), 'utf-8');
  const iceConfigStr = await ejs.render(template, {
    compatRaxConfig: {
      inlineStyle: true,
    }
  });
  fse.writeFileSync(path.join(iceProjectDir, './ice.config.mts'), iceConfigStr);
};
