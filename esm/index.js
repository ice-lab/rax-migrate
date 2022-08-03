import spawn from 'cross-spawn';
export function transform(options) {
    // Init ice project.
    spawn.sync('npx', ['create-ice', options.projcetName, '--template', 'ice-scaffold-simple'], {
        stdio: 'inherit',
    });
    spawn.sync('rm', ['-rf', 'src'], {
        cwd: `./${options.projcetName}`,
        stdio: 'inherit',
    });
}
;
//# sourceMappingURL=index.js.map