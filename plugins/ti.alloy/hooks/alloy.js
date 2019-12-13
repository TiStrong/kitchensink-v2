/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */

exports.cliVersion = '>=3.X';
exports.version = '1.0.1';
var SILENT = true;

exports.init = function (logger, config, cli, appc) {
	var path = require('path'),
		fs = require('fs'),
		afs = appc.fs,
		i18n = appc.i18n(__dirname),
		__ = i18n.__,
		pkginfo = appc.pkginfo.package(module);

	if (!process.env.sdk) {
		process.env.sdk = cli.sdk.name;
	}

	function run(deviceFamily, deployType, target, finished, silent) {
		var appDir = path.join(cli.argv['project-dir'], 'app');
		if (!afs.exists(appDir)) {
			logger.info(__('Project not an Alloy app, continuing'));
			finished();
			return;
		}
		logger.info(__('Found Alloy app in %s', appDir.cyan));

		// TODO: Make this check specific to a TiSDK version
		// create a .alloynewcli file to tell old plugins not to run
		var buildDir = path.join(cli.argv['project-dir'], 'build');
		if (!afs.exists(buildDir)) {
			fs.mkdirSync(buildDir);
		}
		fs.writeFileSync(path.join(buildDir, '.alloynewcli'), '');

		var cRequire = afs.resolvePath(__dirname, '..', 'Alloy', 'commands', 'compile', 'index.js'),
			config = {
				platform: /(?:iphone|ipad)/.test(cli.argv.platform) ? 'ios' : cli.argv.platform,
				version: '0',
				simtype: 'none',
				devicefamily: /(?:iphone|ios)/.test(cli.argv.platform) ? deviceFamily : 'none',
				deploytype: deployType || cli.argv['deploy-type'] || 'development',
				target: target
			};
		if (silent) {
			// turn off all logging output for code analyzer build hook
			config.noBanner = 'true';
			config.logLevel = '-1';
		}

		if (cli.argv.theme) {
			config.theme = cli.argv.theme;
		}

		config = Object.keys(config).map(function (c) {
			return c + '=' + config[c];
		}).join(',');

		if (!afs.exists(cRequire)) {
			// we're NOT being invoked from the actual alloy directory!
			// this should resolve to locally or globally installed package
			cRequire = path.join('alloy', 'Alloy', 'commands', 'compile');
		}
		// we're being invoked from the actual alloy directory!
		// no need to subprocess, just require() and run
		var origLimit = Error.stackTraceLimit;
		Error.stackTraceLimit = Infinity;
		try {
			var args = {
				config: config,
				outputPath: cli.argv['project-dir'],
				_version: pkginfo.version
			};
			logger.info(__('Executing Alloy compile: %s', JSON.stringify(args).cyan));
			require(cRequire)({}, args);
		} catch (e) {
			logger.error(__('Alloy compiler failed'));
			e.toString().split('\n').forEach(function (line) {
				if (line) { logger.error(line); }
			});
			process.exit(1);
		}
		logger.info(__('Alloy compiler completed successfully'));
		Error.stackTraceLimit = origLimit;
		finished();
	}

	cli.addHook('build.pre.compile', function (build, finished) {
		var deployType = build.deployType,
			target = build.target;

		run(build.deviceFamily, deployType, target, finished);
	});

	cli.addHook('codeprocessor.pre.run', function (build, finished) {
		run('none', 'development', undefined, finished, SILENT);
	});
};
