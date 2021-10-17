import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  removeDependenciesFromPackageJson,
  Tree,
} from '@nrwl/devkit';
import { Schema } from './schema';
import {
  jestReactNativeVersion,
  metroReactNativeBabelPresetVersion,
  metroVersion,
  nxVersion,
  reactNativeCommunityCli,
  reactNativeCommunityCliAndroid,
  reactNativeCommunityCliIos, reactNativeSafeAreaContext, reactNativeScreens,
  reactNativeSvgTransformerVersion,
  reactNativeSvgVersion,
  reactNativeVersion, reactNavigationNativeStackVersion, reactNavigationNativeVersion,
  reactTestRendererVersion,
  reactVersion,
  testingLibraryJestNativeVersion,
  testingLibraryReactNativeVersion,
  typesReactNativeVersion,
  typesReactVersion,
} from '../../utils/versions';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addGitIgnoreEntry } from './lib/add-git-ignore-entry';
import { jestInitGenerator } from '@nrwl/jest';
import { detoxInitGenerator } from '@nrwl/detox';

export async function reactNativeInitGenerator(host: Tree, schema: Schema) {
  setDefaultCollection(host, '@nrwl/react-native');
  addGitIgnoreEntry(host);

  const tasks = [moveDependency(host), updateDependencies(host, schema)];

  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    const jestTask = jestInitGenerator(host, {});
    tasks.push(jestTask);
  }

  if (!schema.e2eTestRunner || schema.e2eTestRunner === 'detox') {
    const detoxTask = await detoxInitGenerator(host, {});
    tasks.push(detoxTask);
  }

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export function updateDependencies(host: Tree,  schema: Schema) {
  let dependencies: {[x:string]: string} = {
    react: reactVersion,
    'react-native': reactNativeVersion
  };

  if(schema.navigation) {
    dependencies = {
      ...dependencies,
      "@react-navigation/native": reactNavigationNativeVersion,
      "@react-navigation/native-stack": reactNavigationNativeStackVersion,
      "react-native-safe-area-context": reactNativeSafeAreaContext,
      "react-native-screens": reactNativeScreens
    }
  }

  return addDependenciesToPackageJson(
    host,
      dependencies,
    {
      '@nrwl/react-native': nxVersion,
      '@types/react': typesReactVersion,
      '@types/react-native': typesReactNativeVersion,
      '@react-native-community/cli': reactNativeCommunityCli,
      '@react-native-community/cli-platform-android':
        reactNativeCommunityCliAndroid,
      '@react-native-community/cli-platform-ios': reactNativeCommunityCliIos,
      'metro-react-native-babel-preset': metroReactNativeBabelPresetVersion,
      '@testing-library/react-native': testingLibraryReactNativeVersion,
      '@testing-library/jest-native': testingLibraryJestNativeVersion,
      'jest-react-native': jestReactNativeVersion,
      metro: metroVersion,
      'metro-resolver': metroVersion,
      'react-test-renderer': reactTestRendererVersion,
      'react-native-svg-transformer': reactNativeSvgTransformerVersion,
      'react-native-svg': reactNativeSvgVersion,
    }
  );
}

function moveDependency(host: Tree) {
  return removeDependenciesFromPackageJson(host, ['@nrwl/react-native'], []);
}

export default reactNativeInitGenerator;
export const reactNativeInitSchematic = convertNxGenerator(
  reactNativeInitGenerator
);
