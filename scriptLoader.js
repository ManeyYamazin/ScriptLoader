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
        this.tagArray = [];
        this.callback = null;
    }

    /**
     * スタイルのソースをセットする
     * @param {string} href ソース
     * @param {string} [backupHref=null] ソースのロードに失敗した場合の、バックアップソース
     * @memberof ScriptLoader
     */
     setStyle = (href, backupHref = null) => {
        this.tagArray.push({ src: href, backupSrc: backupHref, tarType: 0 });
    }

    /**
     * スクリプトのソースをセットする
     * @param {string} src ソース
     * @param {string} [backupSrc=null] ソースのロードに失敗した場合の、バックアップソース
     * @memberof ScriptLoader
     */
    setScript = (src, backupSrc = null) => {
        this.tagArray.push({ src: src, backupSrc: backupSrc, tarType: 1 });
    }

    /**
     * セットしたスクリプトのソースを、スクリプトとしてロードする
     * @param {function} [callback=null] 完了時のコールバック
     * @memberof ScriptLoader
     */
    load = (callback = null) => {
        this.callback = callback;
        this.index = 0;
        this.loadTag(this.tagArray[this.index].src, this.tagArray[this.index].backupSrc, this.tagArray[this.index].tarType);
    };

    /**
     * スクリプトをロードする（内部）
     * @param {*} src ソース
     * @param {*} backupSrc ソースのロードに失敗した場合の、バックアップソース
     * @memberof ScriptLoader
     */
    loadTag = (src, backupSrc, tarType) => {
        let script;
        switch (type) {
            case 0:
                script = document.createElement('link');
                script.href = src;
                script.rel = 'stylesheet';
                break;
            case 1:
                script = document.createElement('script');
                script.src = src;
                break;
        }

        script.addEventListener('load', {
            scriptLoader: this,
            handleEvent: function (event) {
                this.scriptLoader.index++;
                if (this.scriptLoader.index < this.scriptLoader.tagArray.length) {
                    // 次のソース配列が存在する場合
                    this.scriptLoader.loadTag(
                        this.scriptLoader.tagArray[this.scriptLoader.index].src,
                        this.scriptLoader.tagArray[this.scriptLoader.index].backupSrc,
                        this.scriptLoader.tagArray[this.scriptLoader.index].tarType);
                } else {
                    // 次のソース配列が存在しない場合
                    this.scriptLoader.tagArray.length = 0;
                    if (this.scriptLoader.callback && typeof this.scriptLoader.callback === 'function') {
                        this.scriptLoader.callback();
                    }
                }
            }
        }, false);

        script.addEventListener('error', {
            backupSrc: backupSrc,
            tarType: type,
            delete: script,
            scriptLoader: this,
            handleEvent: function (event) {
                if (this.backupSrc) {
                    // バックアップソースが設定されている場合
                    this.delete.remove();
                    this.scriptLoader.loadTag(this.backupSrc, null, this.tarType);
                } else {
                    // バックアップソースが設定されてない場合
                    this.scriptLoader.index++;
                    if (this.scriptLoader.index < this.scriptLoader.tagArray.length) {
                        // 次のソース配列が存在する場合
                        this.scriptLoader.loadTag(
                            this.scriptLoader.tagArray[this.scriptLoader.index].src,
                            this.scriptLoader.tagArray[this.scriptLoader.index].backupSrc,
                            this.scriptLoader.tagArray[this.scriptLoader.index].tarType);
                    } else {
                        // 次のソース配列が存在しない場合
                        this.scriptLoader.tagArray.length = 0;
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
