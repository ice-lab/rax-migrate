interface ICEConfig {
  alias?: Object,
  publicPath?: string,
  devPublicPath?: string,
  sourceMap?: boolean | string,
  externals?: Object,
  hash?: string | boolean,
  minify?: boolean,
  outputDir?: string,
  proxy?: object,
  define?: object,
  compileDependencies?: Array<string> | boolean,
  eslint?: boolean | object,
  tsChecker?: boolean,
}

interface RAXConfig {
  webpack5?: boolean,
  inlineStyle?: boolean | { forceEnableCSS: boolean },
  alias?: Object,
  publicPath?: string,
  devPublicPath?: string,
  sourceMap?: boolean | string,
  externals?: Object,
  hash?: string | boolean,
  minify?: boolean,
  outputDir?: string,
  proxy?: object,
  define?: object,
  browserslist?: string | object,
  compileDependencies?: Array<string>,
  terserOptions: object,
  eslint?: boolean | object,
  tsChecker?: boolean,
}

interface Config {
  iceConfig: ICEConfig,
  browsersListRc?: string,
}

async function transformBuild(buildJson: RAXConfig): Promise<Config> {
  const config: Config = {
    iceConfig: {},
  };

  // TODO: support other options of build.json.

  if (!buildJson.webpack5) {
    console.warn('The Rax project currently uses Webpack4, but ICE3 uses Webpack5. Please be aware of the differences.');
  }

  if (buildJson.inlineStyle) {
    // TODO:
  }

  if (buildJson.browserslist) {
    // Save browserslist to .browserslistrc file in ICE3.
    if (typeof buildJson.browserslist === 'string') {
      config.browsersListRc = buildJson.browserslist;
    } else {
      config.browsersListRc = '';
      for (const key in buildJson.browserslist) {
        config.browsersListRc += `${key} ${buildJson.browserslist[key]}\n`
      }
    }
  }

  if (buildJson.terserOptions) {
    console.warn('TerserOptions has been deprecated and the minify parameter is recommended.');
  }

  // Mapping the same config.
  [
    'alias',
    'publicPath',
    'devPublicPath',
    'sourceMap',
    'externals',
    'hash',
    'minify',
    'outputDir',
    'proxy',
    'define',
    'compileDependencies',
    'eslint',
    'tsChecker'
  ].forEach(key => {
    if (buildJson[key] !== undefined) {
      config.iceConfig[key] = buildJson[key];
    }
  })

  return config;
}

export default transformBuild;
