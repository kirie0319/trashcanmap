# ゴミ箱マップ - 日本のゴミ箱位置マッピングアプリ

FastAPIベースの日本のゴミ箱位置をマッピング・共有するWebアプリケーションです。

## 🎯 プロジェクトの目的

日本では海外に比べてゴミ箱が少なく、観光客や住民がゴミ箱を見つけるのに苦労することがあります。このアプリは、ゴミ箱の位置情報を共有し、みんなでマッピングすることで、より便利で清潔な街づくりに貢献することを目指しています。

## 🌟 機能

- 🗑️ 地図上にゴミ箱位置を表示・追加・削除
- 🗺️ Google Maps API統合（APIキー設定時）
- 💾 ゴミ箱データの永続化（メモリ内ストレージ）
- 📱 レスポンシブデザイン
- 🎨 モダンで美しいUI
- 🔄 リアルタイムゴミ箱情報管理
- 📍 詳細な位置情報と説明

## 🗑️ 初期データ

アプリには東京主要駅周辺の仮のゴミ箱データが含まれています：

- 東京駅 八重洲口
- 有楽町駅前
- 新橋駅 SL広場
- 品川駅 港南口
- 渋谷駅 ハチ公前
- 池袋駅 東口
- 新宿駅 南口
- 上野駅 公園口
- 秋葉原駅 電気街口
- 原宿駅 竹下口

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 2. アプリケーションの起動

```bash
python main.py
```

または

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. ブラウザでアクセス

```
http://localhost:8000
```

## 🗝️ Google Maps API設定（セキュリティ重視）

### ⚠️ 重要: APIキーのセキュリティ

**APIキーは機密情報です。以下の点に注意してください：**

- ✅ 環境変数として設定する
- ✅ `.env` ファイルを `.gitignore` に追加する
- ❌ ソースコードに直接記載しない
- ❌ 公開リポジトリにコミットしない

### 🔧 安全な設定手順

1. **Google Cloud ConsoleでAPIキーを取得**
   - [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
   - Maps JavaScript APIを有効化
   - APIキーを取得し、適切な制限を設定

2. **環境変数の設定**
   ```bash
   # 環境変数として設定（推奨）
   export GOOGLE_MAPS_API_KEY="your_actual_api_key_here"
   
   # または .env ファイルを作成
   cp env.example .env
   # .env ファイルを編集してAPIキーを設定
   ```

3. **APIキー制限の設定（セキュリティ強化）**
   - HTTPリファラー制限: `yourdomain.com/*`
   - API制限: Maps JavaScript API のみ
   - 使用量制限: 適切な上限を設定

### 🚀 起動方法

```bash
# 環境変数を設定してから起動
export GOOGLE_MAPS_API_KEY="your_api_key"
python main.py

# または .env ファイルを使用（python-dotenvが必要）
pip install python-dotenv
python main.py
```

**注意**: APIキーが設定されていない場合は、フォールバック機能により簡易地図として動作します。

## 📖 使用方法

### ゴミ箱の追加
1. 「🗑️ ゴミ箱追加モード: OFF」ボタンをクリックしてONに切り替え
2. 地図上の任意の場所をクリック
3. モーダルで場所・名称と詳細情報を入力
4. 「追加」ボタンをクリック

### ゴミ箱の削除
- 地図上のゴミ箱アイコンをクリックして情報ウィンドウの「削除」ボタン
- サイドバーのゴミ箱一覧から「削除」ボタン
- 「🧹 全ゴミ箱削除」ボタンで全削除

### ゴミ箱の表示
- サイドバーのゴミ箱一覧からゴミ箱をクリックすると地図上でフォーカス
- 緑色のゴミ箱アイコンで表示

## 🛠️ API エンドポイント

### ゴミ箱管理API

- `GET /api/pins` - 全ゴミ箱の取得
- `POST /api/pins` - 新しいゴミ箱の追加
- `PUT /api/pins/{pin_id}` - ゴミ箱情報の更新
- `DELETE /api/pins/{pin_id}` - ゴミ箱の削除

### リクエスト例

```bash
# ゴミ箱の追加
curl -X POST "http://localhost:8000/api/pins" \
     -H "Content-Type: application/json" \
     -d '{
       "lat": 35.6812,
       "lng": 139.7671,
       "title": "東京駅 八重洲口",
       "description": "改札外コンコース、自動販売機横"
     }'

# 全ゴミ箱の取得
curl "http://localhost:8000/api/pins"
```

## 📁 プロジェクト構造

```
googlemap/
├── main.py              # FastAPIメインアプリケーション
├── requirements.txt     # Python依存関係
├── README.md           # このファイル
└── static/             # 静的ファイル
    ├── index.html      # メインHTMLファイル
    ├── style.css       # CSSスタイル
    └── script.js       # JavaScript機能
```

## 🎨 技術スタック

- **バックエンド**: FastAPI, Python
- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **地図**: Google Maps JavaScript API
- **スタイリング**: CSS Grid, Flexbox, CSS Animations
- **データ**: メモリ内ストレージ（本番環境ではDBを推奨）

## 🔧 今後の拡張予定

### データベース統合
本番環境では以下のようなDBを統合予定：

- PostgreSQL + SQLAlchemy
- MongoDB + Motor
- SQLite + SQLAlchemy

### 追加機能の実装
- 👤 ユーザー認証・登録
- 🏷️ ゴミ箱のカテゴリ分け（一般ゴミ、リサイクル、喫煙所併設など）
- 📸 ゴミ箱の写真アップロード
- 🔍 検索・フィルター機能
- ⭐ ゴミ箱の評価・レビュー機能
- 📊 統計・分析機能
- 📱 モバイルアプリ版
- 🌐 多言語対応（英語、中国語、韓国語など）
- 📤 データのエクスポート/インポート機能

## 🌍 社会的インパクト

このアプリは以下の社会的価値を提供します：

- **観光客支援**: 外国人観光客がゴミ箱を見つけやすくなる
- **環境保護**: 適切なゴミ処理の促進
- **街の美化**: ポイ捨て防止に貢献
- **コミュニティ参加**: 市民参加型の街づくり

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

プルリクエストや課題報告を歓迎します！一緒により良い街づくりに貢献しましょう。

---

**注意**: このアプリケーションはデモ目的で作成されており、本番環境で使用する場合は適切なセキュリティ対策とデータベース統合を行ってください。 