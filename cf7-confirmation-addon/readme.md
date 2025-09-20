# CF7 Generic Confirmation Addon

## 説明 / Description
Contact Form 7 のフォームに「入力内容確認画面」と「送信完了画面」を自動生成するプラグインです。  
ユーザーはフォーム内に `.input_area` と「確認する」ボタンだけを配置すれば、あとはプラグインが自動で確認画面・完了画面を差し込みます。

---

### ✅ 主な機能 / Features

- Contact Form 7 に簡易な「確認画面」フローを追加
- 入力値を確認エリア（`.confirm_area` など）へ自動反映
- 「戻る」で編集に復帰（送信は保留）
- 必須項目・バリデーション結果を尊重
- マークアップ（クラス名・ラッパー構造）をカスタマイズ可能

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
3. 対象フォーム内に、以下を配置：
   ```html
   <div class="input_area">
     …CF7 ショートコード（例：[text* your-name id:your-name]）…
     <input type="button" class="confirm_button" value="確認する" disabled>
   </div>
   ```
4. フォームページを開くと、自動で確認画面・完了画面が差し込まれます。

---

## 使い方

本アドオンは `.input_area` 内のフィールド（`name` 属性）を自動スキャンし、確認画面（`.confirm_area`）と送信完了画面（`.thanks_area`）を自動生成します。

### ✅ ラップ要否の原則

- **単一入力（1ラベル : 1フィールド）** … `confirm-group` / `confirm-child` は **不要**（自動スキャンで十分）。  
- **複数入力を1つの見出しでまとめたい** … `confirm-group`（親見出し）配下に `confirm-child`（各フィールド）を並べて **初めて必要**。確認画面では「親見出し」の中に複数項目がまとまって表示されます。

### 🟦 ステップ1：フォームに最低限の要素を配置

```html
<div class="input_area">
  <!-- 例：氏名（単一入力。ラップ不要） -->
  <label for="your-name">お名前（漢字）</label>
  [text* your-name id:your-name placeholder "山田 太郎"]

  <!-- 例：メール（単一入力。ラップ不要） -->
  <label for="your-mail">メールアドレス</label>
  [email* your-mail id:your-mail placeholder "example@domain.com"]

  <input type="button" class="confirm_button" value="確認する" disabled>
</div>
```

### 🟨 ステップ2：複数入力を1見出しにまとめたい場合のみラップを使う（例：住所）

```html
<tr>
  <th>住所 <span class="required">必須</span></th>
  <td>
    <div class="confirm-group" data-confirm-label="住所">
      <div class="confirm-child" data-field-name="zip">
        <label for="zip">郵便番号</label><br />
        [text* zip id:zip placeholder "123-4567"]
      </div>
      <div class="confirm-child" data-field-name="pref">
        <label for="pref">都道府県</label><br />
        [select* pref id:pref first_as_label "選択してください" "北海道" "青森県" … "沖縄県"]
      </div>
      <div class="confirm-child" data-field-name="address">
        <label for="address">市区町村番地</label><br />
        [text* address id:address placeholder "〇〇市〇〇町1-2-3"]
      </div>
    </div>
  </td>
</tr>
```

- `data-confirm-label="住所"` … 確認画面での **親見出し**  
- `data-field-name` … 各 CF7 の **name** と一致（配列の場合は `name[]`）

### 🟩 ステップ3：チェックボックスと確認画面の連携（正しい運用）

- **単一フィールド**のチェックボックス（例：`content` のみ）は **ラップ不要**。
```text
[checkbox* content use_label_element
  "リフォームについて相談したい" "オンライン相談を希望する"
  "現地調査をしてほしい" "見積もりが欲しい" "資料請求"
  "キャンペーンについて" "その他"]
```

- **複数フィールド**のチェックボックスを「ひとつの見出し」でまとめたい場合のみ、ラップを使用。
```html
<div class="confirm-group" data-confirm-label="ご相談内容">
  <div class="confirm-child" data-field-name="content-basic[]">
    [checkbox* content-basic use_label_element
      "現地調査をしてほしい" "見積もりが欲しい"]
  </div>
  <div class="confirm-child" data-field-name="content-info[]">
    [checkbox content-info use_label_element
      "資料請求" "キャンペーンについて"]
  </div>
</div>
```

- 「その他」の追加入力を併設する場合は同じグループ内にテキストを置き、選択時のみ表示する制御を CSS/JS で行います。
```text
[checkbox content use_label_element
  "リフォームについて相談したい" "オンライン相談を希望する" "その他"]
[text content-other placeholder "具体的に（その他の場合）"]
```

### 🚀 ステップ4：画面遷移

- 「確認する」クリックで `.input_area` を隠し、`.confirm_area` に確認項目＋「送信」「戻る」を表示。  
- 「送信」で AJAX 投稿。成功後は `.thanks_area` を表示（または `wpcf7mailsent` で任意URLにリダイレクト）。

### 🔧 実装メモ

- 確認画面の見出しは、**`<label for="…">` → `placeholder` → `name`** の優先順位で自動決定。  
- **単一入力はラップ不要**。**複数入力を1見出しに束ねたい場合のみ** `confirm-group / confirm-child` を使用。  
- 確認画面側：`.confirm-group[data-confirm-label]` を見出しに、配下の `.confirm-child[data-field-name]` を順に出力。

---

## ラベル（`labelTxt`）の取得ルール

確認画面に表示されるフィールド名は以下の優先順位で自動判定されます：

1. **`<label for="フィールドの name 属性">…</label>`** のテキスト  
2. **`placeholder="…"`** の文言  
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

### 🛠 インストール / Installation

1. 本プラグイン ZIP を **プラグイン > 新規追加 > プラグインのアップロード** からインストールし、有効化します。  
2. Contact Form 7 フォームの編集画面で、本アドオンが提供する **確認エリアのマークアップ** と **ボタン** をテンプレートへ追加します。  
3. 必要に応じて、CSS で `.confirm_area` / `.thanks_area` / `.confirm-row` などの見た目を整えます。

### 📘 使い方 / Usage（基本）

- 入力ステップ → 確認ステップ → 送信ステップ の 3 段階を想定しています。  
- JavaScript により、入力値が確認用の要素へコピーされます。  
- 戻るボタンで入力ステップへ戻れるため、ユーザーは修正が可能です。

### 🤝 開発者向けメモ / For Developers

- クラス名：`.confirm_area`, `.thanks_area`, `.confirm-row`, `.confirm-child`, `.confirm-group` など。  
- フィールド値の同期は `name` 属性ベース。`use_label_element` 等でラベル化している場合は表示テキストを適切に取得してください。  
- 既存の CF7 ショートコード（例：`[text* your-name]`）と併用できます。  
