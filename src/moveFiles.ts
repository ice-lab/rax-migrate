import fs from 'fs';
import shell from 'shelljs';
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
      console.log(`Copy ${fileName} to ice project...`);
      const from = path.resolve(raxProjectDir, fileName);
      const to = path.resolve(iceProjectDir);
      shell.exec(`cp ${stat.isDirectory() ? '-r ' : ''}${from} ${to}`);
    }
  }
}

export default moveFiles;
