#!/usr/bin/env node

// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @thunderid/copyright-header */

import {intro, outro, cancel} from '@clack/prompts';
import {createLogger} from '@thunderid/logger';
import {Command} from 'commander';
import colors from 'picocolors';
import createFeature from './commands/createFeature';
import createPackage from './commands/createPackage';
import getWorkspaceInfo from './utils/getWorkspaceInfo';

const logger = createLogger();

const program: Command = new Command();

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.clear();

  intro(
    '\n' +
      [
        colors.blueBright('████████╗██╗  ██╗██╗   ██╗███╗   ██╗██████╗ ███████╗██████╗ ') +
          colors.magentaBright('██╗██████╗'),
        colors.blueBright('╚══██╔══╝██║  ██║██║   ██║████╗  ██║██╔══██╗██╔════╝██╔══██╗') +
          colors.magentaBright('██║██╔══██╗'),
        colors.blueBright('   ██║   ███████║██║   ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝') +
          colors.magentaBright('██║██║  ██║'),
        colors.cyanBright('   ██║   ██╔══██║██║   ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗') +
          colors.magentaBright('██║██║  ██║'),
        colors.cyanBright('   ██║   ██║  ██║╚██████╔╝██║ ╚████║██████╔╝███████╗██║  ██║') +
          colors.magentaBright('██║██████╔╝'),
        colors.cyanBright('   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝') +
          colors.magentaBright('╚═╝╚═════╝'),
      ].join('\n') +
      '\n\n' +
      `          ${colors.yellow('⚡')} ${colors.bold(colors.white('ThunderID'))}${colors.dim(
        colors.gray(' · Frontend Scaffolding Tool'),
      )}\n`,
  );

  // Check if we're in a project workspace

  const workspaceInfo = getWorkspaceInfo();
  if (!workspaceInfo.isThunderWorkspace) {
    cancel(colors.red('This command must be run from a project workspace.'));
    process.exit(1);
  }

  // Validate that required workspace paths exist
  if (!workspaceInfo.packagePath) {
    cancel(colors.red('Missing required folder: frontend/packages. Please create it before running this command.'));
    process.exit(1);
  }
  if (!workspaceInfo.appsPath) {
    cancel(colors.red('Missing required folder: frontend/apps. Please create it before running this command.'));
    process.exit(1);
  }

  program.name('create').description('CLI scaffolding tool for ⚡ ThunderID frontends').version('0.0.0');

  program.command('feature').description('Create a new feature module').action(createFeature);

  program.command('package').description('Create a new shared package').action(createPackage);

  await program.parseAsync();

  outro(colors.green('✅ Done! Happy coding!'));
}

export default main;

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    logger.error('CLI execution failed:', {error});
    process.exit(1);
  });
}
