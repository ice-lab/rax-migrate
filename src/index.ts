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

  // Transform app.js/app.ts to app.tsx.
  let appStr = '';
  const appJsPath = path.join(raxProjectDir, './src/app.js');
  const appTsPath = path.join(raxProjectDir, './src/app.ts');
  if (fse.existsSync(appJsPath)) {
    appStr = fse.readFileSync(appJsPath, 'utf-8');
  } else if (fse.existsSync(appTsPath)) {
    appStr = fse.readFileSync(appTsPath, 'utf-8');
  }
  let iceAppStr = appStr.replace(/runApp/g, 'defineAppConfig').replace(/rax-app/g, 'ice');
  iceAppStr += 'export default defineAppConfig;';
  fse.writeFileSync(path.join(iceProjectDir, './src/app.tsx'), iceAppStr);
  // Delete app.js of ice project.
  spawn.sync('rm', [path.join(iceProjectDir, './src/app.*')], { stdio: 'inherit' });

  // Init document.
  const documentStr = fse.readFileSync(path.join(__dirname, '../templates/document.tsx'), 'utf-8');
  fse.writeFileSync(path.join(iceProjectDir, './src/document.tsx'), documentStr);

  // Copy plugins.
  spawn.sync('cp',
    [
      '-r',
      path.join(__dirname, '../plugins'),
      path.join(iceProjectDir, './')
    ], {
    stdio: 'inherit',
  });

  // Transform build.json to ice.config.mts.
  const buildJson: RaxAppConfig = await fse.readJSON(path.join(raxProjectDir, './build.json'));
  const config: Config = await transformBuild(buildJson);
  const template = fse.readFileSync(path.join(__dirname, '../templates/ice.config.mts.ejs'), 'utf-8');
  const iceConfigStr = await ejs.render(template, {
    transfromPlugins: config.transfromPlugins,
    iceConfig: config.iceConfig,
    compatRaxConfig: {
      inlineStyle: true,
    }
  });
  fse.writeFileSync(path.join(iceProjectDir, './ice.config.mts'), iceConfigStr);

  if (config.browsersListRc) {
    fse.writeFileSync(path.join(iceProjectDir, './.browserslistrc'), config.browsersListRc);
  }

  // Merge package.json.
  const raxPkg = await fse.readJSON(path.join(raxProjectDir, './package.json'));
  const icePkg = await fse.readJSON(path.join(iceProjectDir, './package.json'));
  const mergePkg = await mergePackage(raxPkg, icePkg);
  // Delete rax-app、plugin and etc.
  for (const key of Object.keys(mergePkg['devDependencies'] || {})) {
    if (key.includes('rax-app')) {
      delete mergePkg['devDependencies'][key];
    }
  }
  fse.writeJson(path.join(iceProjectDir, './package.json'), mergePkg, { spaces: '\t' });

  // Move other files such as tsconfig and etc...
  await moveFiles(raxProjectDir, iceProjectDir);
};
