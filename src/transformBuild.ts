export interface ICEConfig {
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
  plugins: string[],
}

export interface RaxAppConfig {
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
  plugins?: Array<String>,
}

export interface Config {
  iceConfig: ICEConfig,
  browsersListRc?: string,
  transfromPlugins: Array<boolean>,
}

const PLUGINS = {
  '@ali/build-plugin-rax-app-def': '@ali/ice-plugin-def',
  '@ali/build-plugin-rax-faas': '@ali/build-plugin-faas',
  // TODO: @ali/build-plugin-track-info-register
}

async function transformBuild(buildJson: RaxAppConfig): Promise<Config> {
  const config: Config = {
    iceConfig: {
      plugins: [],
    },
    transfromPlugins: [],
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

  // Mapping the plugins.
  buildJson.plugins.forEach((raxPlugin: string) => {
    const icePluginName = PLUGINS[raxPlugin];
    if (icePluginName) {
      config.transfromPlugins.push(icePluginName);
    } else {
      console.warn(`There is no ICE plugin that can be automatically replaced ${raxPlugin} plugin at present, please manually confirm whether it is needed.`);
    }
  })

  return config;
}

export default transformBuild;
