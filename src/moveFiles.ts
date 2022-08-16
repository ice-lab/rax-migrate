import fs from 'fs';
import spawn from 'cross-spawn';
import path from 'path';

const NotCopyList = {
  'src': true,
  'package.json': true,
  'build.json': true,
};

async function moveFiles(raxProjectDir: string, iceProjectDir: string): Promise<void> {
  for (let fileName of fs.readdirSync(raxProjectDir)) {
    let stat = fs.lstatSync(path.resolve(raxProjectDir, fileName));
    if (!NotCopyList[fileName]) {
      const from = path.resolve(raxProjectDir, fileName);
      const to = path.resolve(iceProjectDir);
      spawn.sync('cp', ['-r', from, to], {
        stdio: 'inherit',
      });
    }
  }
}

export default moveFiles;
