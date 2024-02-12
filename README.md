## CloudFront Cache Purge Extension

このChrome拡張機能は、現在見ているWebページのCloudFrontキャッシュをショートカットで削除することを目的としています。

## 使い方

### ダウンロード方法
- リリースノートにあるcf_cache_purge_extension.zipをダウンロードし展開します。
- `chrome://extensions` を開き、デベロッパーモードをオンにして、展開したフォルダを指定します。

または、リポジトリ内で`npm run build`を実行し、`/dist`以下を指定することも可能です。

### 実行方法
- 拡張機能一覧に`CloudFront cache purge`があることを確認します。
- CloudFrontの`distributionId`と、下記相当のPolicyを持つIAMアクセスキーを取得します。
- 拡張機能を開き、必要情報を入力します
- `Ctrl+Shift+0`を入力、もしくは拡張機能内で`purge cache`ボタンをクリックします
- キャッシュ削除が完了したらWEB Pushが通知されます。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["cloudfront:GetInvalidation", "cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
    }
  ]
}
```


## License
[MIT](https://choosealicense.com/licenses/mit/)
