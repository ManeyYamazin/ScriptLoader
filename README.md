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
  loader.setScript('xxxxxxxxxx/hello.js', 'src/hello.js');
  loader.setScript('src/world.js');
  loader.loadScripts(() => {
    // 読込完了時の処理
  });
</script>
```
## xxxxxxxxxx/hello.jsが読み込めた場合

```html
<script src="xxxxxxxxxx/hello.js"></script>
<script src="src/world.js"></script>
```

## xxxxxxxxxx/hello.jsが読み込めない場合

```html
<script src="src/hello.js"></script>
<script src="src/world.js"></script>
```
