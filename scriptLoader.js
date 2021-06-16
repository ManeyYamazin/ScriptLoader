/**
 * スクリプトローダー
 * @class ScriptLoader
 */
class ScriptLoader {
    /**
     * コンストラクター
     * @memberof ScriptLoader
     */
    constructor() {
        this.index = 0;
        this.srcArray = [];
        this.callback = null;
    }

    /**
     * スクリプトのソースをセットする
     * @param {string} src ソース
     * @param {string} [backupSrc=null] ソースのロードに失敗した場合の、バックアップソース
     * @memberof ScriptLoader
     */
    setScript = (src, backupSrc = null) => {
        this.srcArray.push({src:src, backupSrc:backupSrc});
    }
    
    /**
     * セットしたスクリプトのソースを、スクリプトとしてロードする
     * @param {function} [callback=null] 完了時のコールバック
     * @memberof ScriptLoader
     */
    loadScripts = (callback = null) => {
        this.callback = callback;
        this.index = 0;
        this.loadScirpt(this.srcArray[this.index].src, this.srcArray[this.index].backupSrc);
    };

    /**
     * スクリプトをロードする（内部）
     * @param {*} src ソース
     * @param {*} backupSrc ソースのロードに失敗した場合の、バックアップソース
     * @memberof ScriptLoader
     */
    loadScirpt = (src, backupSrc) => {
        let script = document.createElement('script');
        script.src = src;

        script.addEventListener('load', {
            scriptLoader: this,
            handleEvent: function (event) {
                this.scriptLoader.index++;
                if (this.scriptLoader.index < this.scriptLoader.srcArray.length) {
                    // 次のソース配列が存在する場合
                    this.scriptLoader.loadScirpt(
                        this.scriptLoader.srcArray[this.scriptLoader.index].src,
                        this.scriptLoader.srcArray[this.scriptLoader.index].backupSrc);
                } else {
                    // 次のソース配列が存在しない場合
                    this.scriptLoader.srcArray.length = 0;
                    if (this.scriptLoader.callback && typeof this.scriptLoader.callback === 'function') {
                        this.scriptLoader.callback();
                    }
                }
            }
        }, false);

        script.addEventListener('error', {
            backupSrc: backupSrc,
            delete: script,
            scriptLoader: this,
            handleEvent: function (event) {
                if (this.backupSrc) {
                    // バックアップソースが設定されている場合
                    this.delete.remove();
                    this.scriptLoader.loadScirpt(this.backupSrc, null);
                } else {
                    // バックアップソースが設定されてない場合
                    this.scriptLoader.index++;
                    if (this.scriptLoader.index < this.scriptLoader.srcArray.length) {
                        // 次のソース配列が存在する場合
                        this.scriptLoader.loadScirpt(
                            this.scriptLoader.srcArray[this.scriptLoader.index].src,
                            this.scriptLoader.srcArray[this.scriptLoader.index].backupSrc);
                    } else {
                        // 次のソース配列が存在しない場合
                        this.scriptLoader.srcArray.length = 0;
                        if (this.scriptLoader.callback && typeof this.scriptLoader.callback === 'function') {
                            this.scriptLoader.callback();
                        }
                    }
                }
            }
        }, false);

        let head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
    };
}
