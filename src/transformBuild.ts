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
}

interface Config {
  iceConfig: ICEConfig,
  browsersListRc?: string,
}

async function transformBuild(buildJson: RAXConfig): Promise<Config> {
  const config: Config = {
    iceConfig: {},
  };

  if (!buildJson.webpack5) {
    console.warn('ICE3 use webpack5...');
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
  ].forEach(key => {
    config.iceConfig[key] = buildJson[key];
  })

  return config;
}

export default transformBuild;
