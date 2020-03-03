'use strict';

const path = require('path');
const spawn = require('child_process').spawn;
const fs = require('fs-extra');
let projectDir;

/**
 * @param {string }src
 * @param {string} dst
 * @param {string}content
 * @param {function(string): void} logger
 */
function fixSourceLocation(src, dst, content, logger) {
	logger && logger(src + ' ' + dst);
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
			logger && logger('ERROR: ' + e.message + '. File: ' + src);
		}
	}
	return content;
}

function copyResultSync(source, destination, opts) {
	const moveLevelUp = opts.moveLevelUp;
	const ignoreFiles = opts.ignoreFiles;
	const logger = opts.logger;

	copyDirSyncRecursive(source, destination, {
		callback: fixSourceLocation,
		preserve: true,
		ignoreDirs: moveLevelUp,
		ignoreFiles: ignoreFiles,
		logger: logger
	});
	moveLevelUp.forEach(dir => {
		const src = path.resolve(source, dir);
		if (!fs.existsSync(src)) {
			return;
		}
		copyDirSyncRecursive(src, destination, {
			callback: fixSourceLocation,
			preserve: true,
			ignoreFiles: ignoreFiles,
			logger: logger
		});
	});
}

exports.compileTS = function(opts, callback) {
	const { sourceMaps, dir, logger } = opts;
	projectDir = dir;
	const args = ['--no-install', 'tsc', '-p', path.join(projectDir, 'tsconfig.json'), '--listEmittedFiles'];
	if (sourceMaps) {
		args.push('--sourceMap');
		args.push('true');
		args.push('--inlineSources');
		args.push('true');
	}
	logger && logger.info('Compiling TypeScript files');
	logger && logger.info(`Executing: npx ${args.join(' ')}`);
	const child = spawn('npx', args, {
		stdio: 'inherit'
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

				logger && logger.info('Copying compiled TypeScript files');
				copyResultSync(absoluteOutDir, Resources, {
					logger: logger ? logger.log : null,
					moveLevelUp: moveLevelUp,
				});
			} catch (e) {
				callback(e);
				process.exit(1);
			}
			callback();
		} else {
			const error = new Error(`TypeScript compiler with non-zero exit code ${code}`);
			error.code = code;
			callback(error);
			process.exit(code);
		}
	});
};

exports.id = 'ti.typescript';
exports.init = (logger, config, cli, appc) => {
	cli.on('build.pre.compile', {
		priority: 2200, // explicitly lower priority to make sure this hooks runs after the Alloy compiler
		post: (builder, callback) => {
			exports.compileTS({
				dir: builder['projectDir'],
				sourceMaps: builder['sourceMaps'],
				logger: logger,
			}, callback);
		}
	});
};



/**
 * Copy from node-appc
 * @link http://github.com/appcelerator/node-appc
 * @copyright
 * Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 *
 * @license
 * Licensed under the terms of the Apache Public License
 */

/**
 * copyDirSyncRecursive() is the same as the one from wrench, except this one supports a
 * logger option and ignore lists.
 * NOTE: this function will probably break when it encounters broken symlinks
 *
 * @param {string} sourceDir
 * @param {string} newDirLocation
 * @param {Object=} opts
 */
function copyDirSyncRecursive(sourceDir, newDirLocation, opts) {
	opts = opts || {};
	if (!opts.preserve) {
		try {
			fs.statSync(newDirLocation).isDirectory() && fs.removeSync(newDirLocation);
		} catch (e) {}
	}

	//  Create the directory where all our junk is moving to; read the mode of the source directory and mirror it
	var checkDir = fs.statSync(sourceDir),
		files = fs.readdirSync(sourceDir),
		rootIgnore = opts.rootIgnore && [].concat(opts.rootIgnore);

	if (!files.length) {
		fs.mkdirsSync(newDirLocation);
	}

	delete opts.rootIgnore;

	if (opts.ignoreDirs && Array.isArray(opts.ignoreDirs)) {
		opts.ignoreDirs = new RegExp('^(' + opts.ignoreDirs.map(function (a) {
			return a.replace(/(\.|\$)/g, '\\$1');
		}).join('|') + ')$');
	}

	if (opts.ignoreFiles && Array.isArray(opts.ignoreFiles)) {
		opts.ignoreFiles = new RegExp('^(' + opts.ignoreFiles.map(function (a) {
			return a.replace(/(\.|\$)/g, '\\$1');
		}).join('|') + ')$');
	}

	for (var i = 0; i < files.length; i++) {
		if (rootIgnore && rootIgnore.indexOf(files[i]) !== -1) {
			continue;
		}

		var currFile = fs.lstatSync(sourceDir + '/' + files[i]),
			destFile = newDirLocation + '/' + files[i];

		if (currFile.isDirectory()) {
			// recursion this thing right on back.
			if (opts.ignoreDirs && opts.ignoreDirs.test(files[i])) {
				continue;
			}
			fs.mkdirsSync(newDirLocation);
			copyDirSyncRecursive(sourceDir + '/' + files[i], destFile, opts);
		} else {
			if (opts.ignoreFiles && opts.ignoreFiles.test(files[i])) {
				continue;
			}

			if (fs.existsSync(destFile)) {
				fs.unlinkSync(destFile);
			}

			if (currFile.isSymbolicLink()) {
				fs.mkdirsSync(newDirLocation);
				var symlinkFull = fs.readlinkSync(sourceDir + '/' + files[i]);
				symlinkFull = path.resolve(sourceDir, symlinkFull);
				fs.symlinkSync(symlinkFull, destFile);
			} else {
				// At this point, we've hit a file actually worth copying... so copy it on over.
				var contents = fs.readFileSync(sourceDir + '/' + files[i]);
				if (opts.callback) {
					contents = opts.callback(sourceDir + '/' + files[i], destFile, contents, opts.logger);
					if (Object.prototype.toString.call(contents) === '[object Object]') {
						contents.dest && (destFile = contents.dest);
						contents.contents && (contents = contents.contents);
					}
				}
				fs.mkdirsSync(path.dirname(destFile));
				fs.writeFileSync(destFile, contents);
			}
		}
	}
}
