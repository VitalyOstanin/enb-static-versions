/**
 * static-versions
 * =======
 *
 * Собирает версии собранной статики (css/js), сохраняет в виде `?.static-versions.json`. Версии берутся из sha1 от
 * содержимого файлов. Хэш sha1 можно урезать по длине параметром versionLength.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.static-versions.json`.
 * * *Array* **sources** — Массив файлов статики для сбора версий.
 * * *Number* **versionLength** — Длина версии, от 1 до 20. По умолчанию 7.
 *
 * **Пример**
 *
 * ```javascript
 * [ require('enb-static-versions/techs/static-versions'), {
 * 	sources: [ '_?.css', '_?.ie9.css', '_?.ie8.css', '_?.ie7.css', '_?.ie6.css', '_?.ru.js', '_?.en.js' ]
 * } ],
 * ```
 */

var path = require('path');
var crypto = require('crypto');
var Vow = require('vow');
var vowFs = require('vow-fs');

module.exports = require('enb/lib/build-flow').create()
    .name('static-versions')
    .target('target', '?.static-versions.json')
    .defineOption('versionLength', 7)
    .defineOption('target')
    .defineRequiredOption('sources')
    .useSourceListFilenames('sources')
    .builder(function (sources) {
		var versionLength = this._versionLength;
		var hPromises = {};
		sources.forEach(function(sourceFilename) {
			hPromises[path.basename(sourceFilename)] = vowFs
				.read(sourceFilename, 'utf8')
				.then(function(content) {
					var sha1 = crypto.createHash('sha1');
					sha1.update(content);
					return sha1.digest('base64').substring(0, versionLength);
				});
		});
        return Vow.all(hPromises)
			.then(function(hValues) {
				return JSON.stringify(hValues);
			});
    })
    .createTech();
