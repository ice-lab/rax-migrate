import spawn from 'cross-spawn';

interface TransfromOptions {
  rootDir: string;
  projcetName: string;
}

export function transform(options: TransfromOptions) {
  // Init ice project.
  spawn.sync('npx', ['create-ice', options.projcetName, '--template', 'ice-scaffold-simple'], {
    stdio: 'inherit',
  });

  spawn.sync('rm', ['-rf', 'src'], {
    cwd: `./${options.projcetName}`,
    stdio: 'inherit',
  });
};
