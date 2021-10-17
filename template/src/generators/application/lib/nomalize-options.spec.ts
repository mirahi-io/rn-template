import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';
import { Schema } from '../schema';
import { normalizeOptions } from './normalize-options';

describe('Normalize Options', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should normalize options with name in kebab case', () => {
    const schema: Schema = {
      name: 'my-app',
      linter: Linter.EsLint,
      e2eTestRunner: 'none',
    };
    const options = normalizeOptions(appTree, schema);
    expect(options).toEqual({
      androidProjectRoot: 'apps/my-app/android',
      appProjectRoot: 'apps/my-app',
      className: 'MyApp',
      displayName: 'MyApp',
      iosProjectRoot: 'apps/my-app/ios',
      lowerCaseName: 'myapp',
      name: 'my-app',
      parsedTags: [],
      projectName: 'my-app',
      linter: Linter.EsLint,
      entryFile: '/virtual/apps/my-app/src/main.tsx',
      e2eTestRunner: 'none',
      unitTestRunner: 'jest',
    });
  });

  it('should normalize options with name in camel case', () => {
    const schema: Schema = {
      name: 'myApp',
      e2eTestRunner: 'none',
    };
    const options = normalizeOptions(appTree, schema);
    expect(options).toEqual({
      androidProjectRoot: 'apps/my-app/android',
      appProjectRoot: 'apps/my-app',
      className: 'MyApp',
      displayName: 'MyApp',
      iosProjectRoot: 'apps/my-app/ios',
      lowerCaseName: 'myapp',
      name: 'my-app',
      parsedTags: [],
      projectName: 'my-app',
      entryFile: '/virtual/apps/my-app/src/main.tsx',
      e2eTestRunner: 'none',
      unitTestRunner: 'jest',
    });
  });

  it('should normalize options with directory', () => {
    const schema: Schema = {
      name: 'my-app',
      directory: 'directory',
      e2eTestRunner: 'none',
    };
    const options = normalizeOptions(appTree, schema);
    expect(options).toEqual({
      androidProjectRoot: 'apps/directory/my-app/android',
      appProjectRoot: 'apps/directory/my-app',
      className: 'MyApp',
      displayName: 'MyApp',
      iosProjectRoot: 'apps/directory/my-app/ios',
      lowerCaseName: 'myapp',
      name: 'my-app',
      directory: 'directory',
      parsedTags: [],
      projectName: 'directory-my-app',
      entryFile: '/virtual/apps/directory/my-app/src/main.tsx',
      e2eTestRunner: 'none',
      unitTestRunner: 'jest',
    });
  });

  it('should normalize options that has directory in its name', () => {
    const schema: Schema = {
      name: 'directory/my-app',
      e2eTestRunner: 'none',
    };
    const options = normalizeOptions(appTree, schema);
    expect(options).toEqual({
      androidProjectRoot: 'apps/directory/my-app/android',
      appProjectRoot: 'apps/directory/my-app',
      className: 'DirectoryMyApp',
      displayName: 'DirectoryMyApp',
      iosProjectRoot: 'apps/directory/my-app/ios',
      lowerCaseName: 'directorymyapp',
      name: 'directory/my-app',
      parsedTags: [],
      projectName: 'directory-my-app',
      entryFile: '/virtual/apps/directory/my-app/src/main.tsx',
      e2eTestRunner: 'none',
      unitTestRunner: 'jest',
    });
  });

  it('should normalize options with display name', () => {
    const schema: Schema = {
      name: 'my-app',
      displayName: 'My App',
      e2eTestRunner: 'none',
    };
    const options = normalizeOptions(appTree, schema);
    expect(options).toEqual({
      androidProjectRoot: 'apps/my-app/android',
      appProjectRoot: 'apps/my-app',
      className: 'MyApp',
      displayName: 'My App',
      iosProjectRoot: 'apps/my-app/ios',
      lowerCaseName: 'myapp',
      name: 'my-app',
      parsedTags: [],
      projectName: 'my-app',
      entryFile: '/virtual/apps/my-app/src/main.tsx',
      e2eTestRunner: 'none',
      unitTestRunner: 'jest',
    });
  });
});
