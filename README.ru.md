# Версионирование статики

Технология позволяет версионировать файлы статики через их подключение с дополнительным параметром, где версия берётся
из sha1-хеша контента статики. Например, '/b/_common.js?v=abc1234'.

### Подключение в сборку

```js
require('enb-static-versions/techs/static-versions'), {
	sources: [ '_?.css', '_?.ie9.css', '_?.ie8.css', '_?.ie7.css', '_?.ie6.css', '_?.ru.js', '_?.en.js' ]
}
```

Технология создаёт файл с расширением 'static-versions.json', где лежит объект с именами исходных файлов и хешами этих
файлов.

### Использование версионирования при подключении статики

Для использования версий нужно сначала подключить json с ними в bemjson (или на этапе priv.js):

```js
{ elem: 'css', url: '/b/_common.css', ie: false, versions: require('./common.static-versions') }
```

Затем указать версию статики в bemhtml, пример для block b-page, elem css:

```js
this.ctx.url {
	tag: 'link',
	attrs: {
		rel: 'stylesheet',
		href: this.ctx.versions ? this.ctx.url + '?v=' + encodeURIComponent(this.ctx.versions[this.ctx.url.split('/').pop()])
				: this.ctx.url
	}
}
```
