# 階層対応ToDoリストアプリ

このアプリは、階層構造に対応したToDo管理ツールです。親タスク・子タスク・孫タスクを再帰的に管理できます。

## ✅ 主な機能

- 階層構造のタスク管理（親・子・孫）
- タスクの追加・削除・復元・編集
- 完了ステータスの切り替え
- 完了タスクの表示/非表示切り替え
- タスクのドラッグ＆ドロップによる並べ替え（DnD対応）
- データの localStorage 自動保存
- JSON形式でのエクスポート/インポート対応

## 📦 データの保存・復元

- **エクスポート**：JSONファイルとしてダウンロードできます
- **インポート**：以前のファイルを読み込んで復元できます

## 🛠 開発環境

- React + TypeScript + Vite
- Tailwind CSS
- @dnd-kit/core（並べ替え）
- lucide-react（アイコン）

## 🚀 ローカルでの起動方法

```bash
git clone https://github.com/khosokawa0716/todo-react
cd todo-react
npm install
npm run dev
```

## 🔗 公開URL

[アプリを開く](https://khosokawa0716.github.io/todo-react/)