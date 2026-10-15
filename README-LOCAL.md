# ローカル開発

Sitesの最新保存版（バージョン4）のソースです。
コミット: d7fc427fb0d633414400f0e2df0edfb7a962557d

dist/index.html、dist/style.css、dist/script.jsを直接編集する静的サイトです。画像はdist/assetsに含まれます。

dist/index.htmlをブラウザーで開くと表示できます。Python 3導入済みのWindowsでは、展開先で以下を実行するとHTTPで確認できます。

```powershell
py -m http.server 8000 --bind 127.0.0.1 --directory dist
```

http://localhost:8000 を開きます。停止はCtrl+C。npm installやビルドは不要です。Google Fontsの取得にはインターネット接続を使用します。

ローカルのCodexでこのフォルダーを開き、READMEとdistを読んで続きを開発するよう依頼してください。

ヘッダー固定、SNSリンク、ファーストビューの文字消失演出を含みます。後から作成した三面図・配色案は未反映です。Git履歴や認証情報は含みません。
