import spawn from 'cross-spawn';

interface TransfromOptions {
  rootDir: string;
  projcetName: string;
  raxProjectName: string;
}

export function transform(options: TransfromOptions) {
  // Init ice project.
  spawn.sync('npx', ['create-ice', options.projcetName, '--template', 'ice-scaffold-simple'], {
    stdio: 'inherit',
  });

  // Remove default src.
  spawn.sync('rm', ['-rf', 'src'], {
    cwd: `./${options.projcetName}`,
    stdio: 'inherit',
  });

  // Copy src of rax project to ice project.
  spawn.sync('cp', ['-r', `./${options.raxProjectName}/src`, `./${options.projcetName}/src`], {
    stdio: 'inherit',
  });
};
