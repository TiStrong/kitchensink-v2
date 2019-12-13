'use strict';

const path = require('path');
const spawn = require('child_process').spawn;
let projectDir;

/**
 * @param {string }src
 * @param {string} dst
 * @param {string}content
 * @param {function(string): void} logger
 */
function fixSourceLocation(src, dst, content, logger) {
	logger(src + ' ' + dst);
	if (src.lastIndexOf('.map') === src.length - 4) {
		try {
			const data = JSON.parse(content);
			data['sources'].forEach((s, idx) => {
				if (s.indexOf('../') === 0) {
					data['sourceRoot'] = projectDir;
					data['sources'][idx] = path.relative(projectDir,
						path.resolve(path.dirname(src), s));
				}
			});
			return JSON.stringify(data);
		} catch (e) {
			logger('ERROR: ' + e.message + '. File: ' + src);
		}
	}
	return content;
}

function copyResultSync(afs, source, destination, opts) {
	const moveLevelUp = opts.moveLevelUp;
	const ignoreFiles = opts.ignoreFiles;
	const logger = opts.logger;

	afs.copyDirSyncRecursive(source, destination, {
		callback: fixSourceLocation,
		preserve: true,
		ignoreDirs: moveLevelUp,
		ignoreFiles: ignoreFiles,
		logger: logger
	});
	moveLevelUp.forEach(dir => {
		const src = path.resolve(source, dir);
		if (!afs.exists(src)) {
			return;
		}
		afs.copyDirSyncRecursive(src, destination, {
			callback: fixSourceLocation,
			preserve: true,
			ignoreFiles: ignoreFiles,
			logger: logger
		});
	});
}

exports.id = 'ti.typescript';
exports.init = (logger, config, cli, appc) => {
	cli.on('build.pre.compile', {
		priority: 2200, // explicitly lower priority to make sure this hooks runs after the Alloy compiler
		post: (builder, callback) => {
			projectDir = builder.projectDir;
			const tscPath = path.resolve(projectDir, 'node_modules', '.bin', 'tsc');
			const args = [tscPath, '-p', 'tsconfig.json', '--listEmittedFiles'];
			if (builder['sourceMaps']) {
				args.push('--sourceMap');
				args.push('true');
				args.push('--inlineSources');
				args.push('true');
			}
			logger.info('Compiling TypeScript files');
			logger.trace(`Executing: node ${args.join(' ')}`);
			const child = spawn('node', args, {
				stdio: 'inherit',
				cwd: cli.argv['project-dir']
			});
			child.on('close', code => {
				if (code === 0) {
					try {
						const tscConfigPath = path.resolve(projectDir, 'tsconfig.json');
						const tscConfig = require(tscConfigPath);
						const relativeOutDir = tscConfig['compilerOptions'] && tscConfig['compilerOptions']['outDir'] || './build/TypeScript';
						const absoluteOutDir = path.resolve(projectDir, relativeOutDir);
						const Resources = path.join(projectDir, 'Resources');
						const moveLevelUp = ['gen', 'lib', 'src'];

						copyResultSync(appc.fs, absoluteOutDir, Resources, {
							logger: logger.log,
							moveLevelUp: moveLevelUp,
						});
					} catch (e) {
						return callback(e);
					}
					callback();
				} else {
					const error = new Error(`TypeScript compiler with non-zero exit code ${code}`);
					error.code = code;
					callback(error);
				}
			});
		}
	});
};
