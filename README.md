y2x
===

this project is heavily under development and unstable.

[yaml|json|csv|text]形式で論文データベースを受け取り，任意のview(bibtexやtextなど)で出力する変換器．

## Installation

```
git clone git@github.com:ganow/y2x.git
cd y2x
npm install -g
```

## Usage

```
  Usage: y2x <file> [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    --view <text>      format string for each record
    --viewfile <file>  file name of format string for each record
    --author <text>    filter records with specific author
    --type <text>      record type
    --reverse-index    flag for reverse index
    --offset <n>       offset for index
```

**[未実装]** recordtype一覧の表示

```
y2x data.yml --list-types
# conferences
# conferences_ja
# papers
# papers_ja
# ...
```

**[未実装]** 特定のrecordtypeのentry一覧の表示

```
y2x data.yml --list-entries conferences_ja
# type
# title
# authors
# year
# ...
```

**[実装済]** 特定のrecordtypeをtext形式に変換

```
y2x data.yml --view '{id}. {authors}, ({year}) "{title}", {conference}.' --type conferences_ja --reverse-index
# 11. 長野祥大, 渡邊紀文, 武藤佳恭, (2013) "自発発火神経回路モデルを用いた注意下の神経回路の構築", 包括脳ネットワーク 夏のワークショップ.
# 10. 長野祥大, 渡邊紀文, 青山敦, (2014) "視覚的注意の変化に対応する発火頻度分布入力時の自発発火回路の分析", 脳と心のメカニズム 第14回冬のワークショップ.
# ...
```

**[実装済]** 特定のrecordtypeをviewを記述したファイルを使って変換

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

**[実装済]** 特定の著者を含むrecordのみ表示

```
y2x data.yml --view '{id}. {authors}, {title}' --type conferences_ja --author '武藤佳恭'
# 1. 長野祥大, 渡邊紀文, 武藤佳恭, 自発発火神経回路モデルを用いた注意下の神経回路の構築
```


## 必要な機能一覧

- 通し番号を昇順・降順で付ける機能
	- 実装済み
- view を自分でいじれる機能
	- 実装済み
- 特定のrecordtypeだけ出力する機能
	- 実装済み
- 特定著者のみフィルター
	- 実装済み
- ソート機能
	- 典型的なソートとしてrecordtype -> yearとyear -> recordtypeの2種類．
		- この2つはCLIで提供可能？デフォルトでyearでソートするようにしておけば，recordtypeごとに出したい場合はその回数分スクリプトを叩けば取り急ぎ問題なさそう．
		- → 但し後述のview分岐問題が存在する
	- それ以外に関してはパッケージのみでの提供
- 後ほどプロジェクトのタグ

## 実装メモ

**[データの保持形式]**

recordtypeによってエントリの種類が変わるため，データとしてはrecordtypeごとに保持したほうがエラー処理とかめんどくさくなくて良い？

一方で，複数のrecordtypeを結合して出力する場合は結合に手間がかかる

**[view分岐問題]**

複数のrecordtypeを結合して出力するときに，それぞれのrecordtypeごとにviewを指定したいが，CLIでそれを実現できるのか？

- 案1: viewfileで対処する？
- 案2: それぞれでviewを切り替えたい時などはパッケージのみで提供

そもそも複数のrecordtypeを混在させて一括出力したい場合に適切なinterfaceは？

**[異常系の処理]**

全体的に異常系の実装ができていない

**[パッケージ版想定interface]**

下みたいな感じで動くようにしたい

```javascript
Y2X('data.yml')
  .type('all')
  .view({
    papers: '<li>{id}. {authors}, ({year}) "{title}", {journal}.</li>',
    conferences: '<li>{id}. {authors}, ({year}) "{title}", {conference}.</li>'
  })
  .author('Yoshihiro Nagano')
  .sortBy('year', reverse=true)
  .reverseIndex()
  .render()
```