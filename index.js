'use strict'

const fs = require('fs')
const yaml = require('js-yaml')

// 存在チェック
if (String.prototype.format == undefined) {
  /**
   * フォーマット関数
   */
  String.prototype.format = function(arg)
  {
    // 置換ファンク
    var rep_fn = undefined

    // オブジェクトの場合
    if (typeof arg == 'object') {
      rep_fn = function(m, k) { return arg[k]; }
    }
    // 複数引数だった場合
    else {
      var args = arguments
      rep_fn = function(m, k) { return args[ parseInt(k) ] }
    }

    return this.replace( /\{(\w+)\}/g, rep_fn )
  }
}

function stringify(data, view, offset, reverse) {

  if ( offset == null ) { offset = 1 }
  if ( reverse == null ) { reverse = false }

  return data.map((c, id) => {

    const c_new = Object.assign({}, c, {
      id: (reverse) ? data.length - id - 1 + offset : id + offset,
      authors: c.authors.join(', '),
      firstauthor: c.authors[0]
    })

    return view.format(c_new)
  })
}

function main() {

  // ########################
  // ###### parameters ######
  // ########################

  const filename = 'data.yml'
  const recordtype = 'conferences_ja'
  const view = '{id}. {authors}, ({year}) "{title}", {conference}.'
  // const view = '@inproceedings{{firstauthor}{year},\n' +
  // '  title={{title}},\n' +
  // '  author={{authors}},\n' +
  // '  booktitle={{conference}},\n' +
  // '  year={{year}}\n' +
  // '}'
  const offset = 1
  const revindex = false

  // load file

  const file = fs.readFileSync(filename, 'utf-8', (err, file) => {
    return file
  })
  const data = yaml.safeLoad(file)

  // stringify

  const texts = stringify(data[recordtype], view, offset, revindex)
  texts.map((t) => {console.log(t)})
}

// ゆくゆくは...
// 読んだ論文を著者リスト，タイトル，アブスト，代表画像

main()