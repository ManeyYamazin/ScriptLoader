# Script Loader

&lt;script&gt;タグをセットするスクリプト
* ソースとは別にバックアップソースを指定することで、ソースが読み込めない場合バックアップソースを読み込む
* ソースを複数指定した場合、読み込み終わってから次を読み込む
* 全てのソースが読み込み終わったタイミングで発火する、コールバックあり

# DEMO

## 実装

```html
<script src="scriptLoader.js"></script>
<script>
  let loader = new ScriptLoader();
  loader.setStyle('src/test.css');
  loader.setScript('xxxxxxxxxx/hello.js', 'src/hello.js');
  loader.setScript('src/world.js');
  loader.load(() => {
    // 読込完了時の処理
  });
</script>
```
## xxxxxxxxxx/hello.jsが読み込めた場合

```html
<link href="src/test.css" rel="stylesheet">
<script src="xxxxxxxxxx/hello.js"></script>
<script src="src/world.js"></script>
```

## xxxxxxxxxx/hello.jsが読み込めない場合

```html
<link href="src/test.css" rel="stylesheet">
<script src="src/hello.js"></script>
<script src="src/world.js"></script>
```
