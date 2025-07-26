# CF7 Generic Confirmation Addon

Contact Form 7 のフォームに「入力内容確認画面」と「送信完了画面」を自動生成するプラグインです。  
ユーザーはフォーム内に `.input_area` と「確認する」ボタンだけを配置すれば、あとはプラグインが自動で確認画面・完了画面を差し込みます。

---

## 主な機能

- **汎用確認画面**  
  - `.input_area` に含まれるすべてのフィールド（`name` 属性）を自動スキャン  
  - フォーム上の `<label for="…">` テキスト or `placeholder` をそのまま見出しとして利用  
  - 確認画面に「入力済み値」と「送信」「戻る」ボタンを自動生成  

- **完了画面（サンクスページ内置き or リダイレクト）**  
  - 確認画面中の「送信」ボタン押下で完了画面をフェードイン  
  - 必要に応じて `wpcf7mailsent` イベントで外部サンクスページへリダイレクト可能  

- **必須チェック**  
  - `aria-required="true"` が付いた要素をすべて埋めると「確認する」ボタンを活性化  

---

## インストール手順

1. プラグインフォルダごと `wp-content/plugins/` にアップロード  
2. 管理画面 → 「プラグイン」 → **CF7 Generic Confirmation Addon** を有効化  
3. 対象フォームの `<form>` 内に、以下を配置：
   ```html
   <div class="input_area">
     …CF7 ショートコード（例：[text* your-name id:your-name]）…
     <input type="button" class="confirm_button" value="確認する" disabled>
   </div>
   ```
4. フォームページを開くと、自動で確認画面・完了画面が差し込まれます。

---

## 使い方

### 1. フォームマークアップ例
```html
<div class="input_area">
  <label for="your-name">お名前（漢字）</label>
  [text* your-name id:your-name placeholder "山田 太郎"]
  <!-- 必須項目は aria-required="true" が自動付与されます -->

  <label for="your-mail">メールアドレス</label>
  [email* your-mail id:your-mail placeholder "example@domain.com"]

  <input type="button" class="confirm_button" value="確認する" disabled>
</div>
```

### 2. 確認画面への切り替え
- 「確認する」ボタンを押すと `.input_area` を隠し、`.confirm_area` に自動生成された確認項目＋送信＋戻るボタンを表示します。

### 3. 完了画面の動作
- 確認画面中の「送信」ボタンを押すとフォームが AJAX 送信され、完了後に `.thanks_area` がフェードインします。
- 外部ページへ遷移したい場合は `confirm.js` 内で `wpcf7mailsent` イベントをキャッチし、`window.location.href` を設定してください。

---

## ラベル（`labelTxt`）の取得ルール

確認画面に表示されるフィールド名は以下の優先順位で自動判定されます：

1. **`<label for="フィールドの name 属性">…</label>`** のテキスト  
2. **`placeholder="…" `** の文言  
3. **`name` 属性そのまま**  

> **注意:**  
> - ユーザーに見せる文言ですので、必ず自然でわかりやすい日本語を `<label>` または `placeholder` に設定してください。  
> - `<label>` も `placeholder` もないときは、内部の `name` 属性名がそのまま表示されます。

---

## プラグイン構成

```
cf7-confirm-addon/
├── cf7-confirm-addon.php    ← メインプラグインファイル
├── css/
│   └── confirm.css          ← 確認画面・完了画面用スタイル
└── js/
    └── confirm.js           ← 確認ロジック
```

---

## カスタマイズ

- **文言変更**  
  - `js/confirm.js` 内の `.ttl` や `<p>` を編集  
- **スタイル調整**  
  - `css/confirm.css` を編集してレイアウト・色味をカスタマイズ  
- **外部サンクスページ**  
  - `document.addEventListener('wpcf7mailsent', …)` でリダイレクト先を変更  

---
