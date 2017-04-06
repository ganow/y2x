y2x
===

[yaml|json|csv|text]形式で論文データベースを受け取り，任意のview(bibtexやtextなど)で出力する変換器．

## Usage

recordtype一覧の表示

```
y2x data.yml --list-types
# conferences
# conferences_ja
# papers
# papers_ja
# ...
```

特定のrecordtypeのentry一覧の表示

```
y2x data.yml --list-entries conferences_ja
# type
# title
# authors
# year
# ...
```

特定のrecordtypeをtext形式に変換

```
y2x data.yml --view '{id}. {authors}, ({year}) "{title}", {conference}.' --type conferences_ja --reverse-index
# 11. 長野祥大, 渡邊紀文, 武藤佳恭, (2013) "自発発火神経回路モデルを用いた注意下の神経回路の構築", 包括脳ネットワーク 夏のワークショップ.
# 10. 長野祥大, 渡邊紀文, 青山敦, (2014) "視覚的注意の変化に対応する発火頻度分布入力時の自発発火回路の分析", 脳と心のメカニズム 第14回冬のワークショップ.
# ...
```

特定のrecordtypeをviewを記述したファイルを使って変換

```
y2x data.yml --viewfile bibtex.view --type conferences_ja
# @inproceedings{長野祥大2013,
#   title={自発発火神経回路モデルを用いた注意下の神経回路の構築},
#   author={長野祥大, 渡邊紀文, 武藤佳恭},
#   booktitle={包括脳ネットワーク 夏のワークショップ},
#   year={2013}
# }
# @inproceedings{長野祥大2014,
#   title={視覚的注意の変化に対応する発火頻度分布入力時の自発発火回路の分析},
#   author={長野祥大, 渡邊紀文, 青山敦},
#   booktitle={脳と心のメカニズム 第14回冬のワークショップ},
#   year={2014}
# }
# ...
```

## 必要な機能一覧

- 通し番号を昇順・降順で付ける機能
- view を自分でいじれる機能
- カテゴリだけ出力する機能
- 特定著者のみフィルター
- ソート機能, recordtype -> yearとyear -> recordtypeのみ？
- 後ほどプロジェクトのタグ

## 実装メモ

recordtypeによってエントリの種類が変わるため，データとしてはrecordtypeごとに保持したほうがエラー処理とかめんどくさくなくて良い？

ただしその分複数のrecordtypeを結合して出力するときとかめんどくさそう

逆に複数のrecordtypeを混在させる場合，それぞれでviewを切り替えたい時などはjsで書いてもらう？

そもそも複数のrecordtypeを混在させて一括出力したい場合に適切なinterfaceは？