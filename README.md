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
    --sort-by <text>   entry which is used by sort
    --reverse          flag for reverse sort
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
y2x data.yml --list-entries conference
# type
# title
# authors
# year
# ...
```

**[実装済]** 特定のrecordtypeをtext形式に変換

```
y2x data.yml --view '{id}. {authors}, ({year}) "{title}", {conference}.' --type conference --reverse-index
# 2. Diederik Kingma, Max Welling, (2013) "Auto-encoding Variational Bayes", ICLR.
# 1. Ruslan Salakhutdinov, Geoffrey Hinton, (2009) "Deep Boltzmann Machines", AISTATS.
```

**[実装済]** 特定のrecordtypeをviewを記述したファイルを使って変換

```
y2x data.yml --viewfile bibtex.view --type conference
# @inproceedings{Diederik Kingma2013,
#   title={Auto-encoding Variational Bayes},
#   author={Diederik Kingma, Max Welling},
#   booktitle={ICLR},
#   year={2013}
# }
# @inproceedings{Ruslan Salakhutdinov2009,
#   title={Deep Boltzmann Machines},
#   author={Ruslan Salakhutdinov, Geoffrey Hinton},
#   booktitle={AISTATS},
#   year={2009}
# }
# ...
```

**[実装済]** 特定の著者を含むrecordのみ表示

```
y2x data.yml --view '{id}. {authors}, {title}' --type conference --author 'Max Welling'
# 1. Diederik Kingma, Max Welling, Auto-encoding Variational Bayes
```

**[実装済]** パッケージとしてスクリプト内で使用する


```javascript
const loadRecords = require('y2x').loadRecords

const records = loadRecords('data.yml')
const texts = records
  .typeOf(['paper', 'conference'])
  .view({
    paper: '<li>{id}. {authors}, ({year}) "{title}", {journal}.</li>',
    conference: '<li>{id}. {authors}, ({year}) "{title}", {conference}.</li>'
  })
  .authoredBy('Geoffrey Hinton')
  .sortBy('year', reverse=true)
  .reverseIndex()
  .render()
texts.map((el) => console.log(el))
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

filterに関しては`Records.contain(el) => bool`みたいな関数を論理和で追加していく感じで，`render()`が実行されたタイミングで

```javascript
this.data.filter((el) => {
  if ( this.contain(el) ) { return el }
})
```

を実行して，O(N)でfilterされるようにする．

**[複数エントリでのソート]**

以下が動くようにしたい

```javascript
records.sortBy(['type', 'year'], reverse=[false, true])
```

**[目指すファイル構成]**

CLI部分とコアのロジック部分を`bin/y2x-cli.js`と`lib/y2x.js`に分離する．

```
y2x/
  bin/
    y2x-cli.js
  lib/
    y2x.js
  index.js
```

`index.js`のイメージ:

```javascript
var y2x = require('./lib/y2x.js');
module.exports = y2x;
```

`bin/y2x-cli.js`のイメージ:

```javascript
var program = require('commander')
const Y2X = require('..')
...
```
