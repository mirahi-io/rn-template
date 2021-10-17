import { execSync } from 'child_process';
import { readFileSync, writeFileSync, remove } from 'fs-extra';
import { readdirSync } from 'fs';
import {
  prettierVersion,
  typescriptVersion,
} from '../packages/workspace/src/utils/versions';

process.env.PUBLISHED_VERSION = `9999.0.2`;
process.env.npm_config_registry = `http://localhost:4872`;
process.env.YARN_REGISTRY = process.env.npm_config_registry;

async function buildPackagePublishAndCleanPorts() {
  if (!process.env.SKIP_PUBLISH) {
    await Promise.all([
      remove('./build'),
      remove('./tmp/nx/proj-backup'),
      remove('./tmp/angular/proj-backup'),
      remove('./tmp/local-registry'),
    ]);

    build(process.env.PUBLISHED_VERSION);
    try {
      await updateVersionsAndPublishPackages();
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }
}

const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

async function updateVersionsAndPublishPackages() {
  const npmMajorVersion = execSync(`npm --version`)
    .toString('utf-8')
    .trim()
    .split('.')[0];

  const directories = getDirectories('./build/packages');

  await Promise.all(
    directories.map(async (pkg) => {
      updateVersion(`./build/packages/${pkg}`);
      publishPackage(`./build/packages/${pkg}`, +npmMajorVersion);
    })
  );
}

function updateVersion(packagePath: string) {
  return execSync(`npm version ${process.env.PUBLISHED_VERSION}`, {
    cwd: packagePath,
  });
}

async function publishPackage(packagePath: string, npmMajorVersion: number) {
  if (process.env.npm_config_registry.indexOf('http://localhost') === -1) {
    throw Error(`
      ------------------
      💣 ERROR 💣 => $NPM_REGISTRY does not look like a local registry'
      ------------------
    `);
  }
  try {
    console.log(` 📦 ${packagePath}`);

    // NPM@7 requires a token to publish, thus, is just a matter of fake a token to bypass npm.
    // See: https://twitter.com/verdaccio_npm/status/1357798427283910660
    if (npmMajorVersion === 7) {
      writeFileSync(
        `${packagePath}/.npmrc`,
        `registry=${
          process.env.npm_config_registry
        }\n${process.env.npm_config_registry.replace(
          'http:',
          ''
        )}/:_authToken=fake`
      );
    }

    execSync(`npm publish`, {
      cwd: packagePath,
      env: process.env,
      stdio: ['ignore', 'ignore', 'ignore'],
    });
  } catch (e) {
    console.log(e);
  }
}

function build(nxVersion: string) {
  try {
    execSync(
      'npx nx run-many --target=build --all --parallel --max-parallel=8',
      {
        stdio: ['pipe', 'pipe', 'pipe'],
      }
    );
    console.log('Packages built successfully');
  } catch (e) {
    console.log(e.output.toString());
    console.log('Build failed. See error above.');
    process.exit(1);
  }

  const BUILD_DIR = 'build/packages';

  const files = [
    ...[
      'react',
      'next',
      'gatsby',
      'web',
      'jest',
      'node',
      'express',
      'nest',
      'cypress',
      'storybook',
      'angular',
      'workspace',
      'react-native',
      'detox',
    ].map((f) => `${f}/src/utils/versions.js`),
    ...[
      'react',
      'next',
      'gatsby',
      'web',
      'jest',
      'node',
      'express',
      'nest',
      'cypress',
      'storybook',
      'angular',
      'workspace',
      'cli',
      'linter',
      'tao',
      'devkit',
      'eslint-plugin-nx',
      'create-nx-workspace',
      'create-nx-plugin',
      'nx-plugin',
      'react-native',
      'detox',
    ].map((f) => `${f}/package.json`),
    'create-nx-workspace/bin/create-nx-workspace.js',
    'create-nx-plugin/bin/create-nx-plugin.js',
  ].map((f) => `${BUILD_DIR}/${f}`);

  files.forEach((f) => {
    const content = readFileSync(f, 'utf-8')
      .replace(
        /exports.nxVersion = '\*'/g,
        `exports.nxVersion = '${nxVersion}'`
      )
      .replace(/NX_VERSION/g, nxVersion)
      .replace(/TYPESCRIPT_VERSION/g, typescriptVersion)
      .replace(/PRETTIER_VERSION/g, prettierVersion);

    writeFileSync(f, content);
  });
}

(async () => {
  await buildPackagePublishAndCleanPorts();
})();
