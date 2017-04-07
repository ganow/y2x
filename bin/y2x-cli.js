#!/usr/bin/env node

'use strict'

const fs = require('fs')
const yaml = require('js-yaml')
var program = require('commander')

/**
 * add format string function to str
 * from: http://phiary.me/javascript-string-format/
 */

// 存在チェック
if (String.prototype.format == undefined) {
  /**
   * フォーマット関数
   */
  String.prototype.format = function(arg)
  {
    // 置換関数
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

function stringify(records, view, offset, reverse) {

  if ( offset == null ) { offset = 1 }
  if ( reverse == null ) { reverse = false }

  return records.map((r, id) => {

    const r_new = Object.assign({}, r, {
      id: (reverse) ? records.length - id - 1 + offset : id + offset,
      authors: r.authors.join(', '),
      firstauthor: r.authors[0]
    })

    return view.format(r_new)
  })
}

function main() {

  // ########################
  // ###### parameters ######
  // ########################

  // const filename = 'data.yml'
  // const recordtype = 'conferences_ja'
  // const view = '{id}. {authors}, ({year}) "{title}", {conference}.'
  // const offset = 1
  // const revindex = false

  program
    .version(require('./package.json').version)
    .usage('<file> [options]')
    .option('--view <text>', 'format string for each record')
    .option('--viewfile <file>', 'file name of format string for each record')
    .option('--author <text>', 'filter records with specific author')
    .option('--type <text>', 'record type')
    .option('--reverse-index', 'flag for reverse index')
    .option('--offset <n>', 'offset for index', parseInt, 1)
    .parse(process.argv);

  const filename = program.args[0]
  const recordtype = program.type
  const view = (program.view) ? program.view : fs.readFileSync(program.viewfile, 'utf-8', (err, file) => {
    return file
  }).replace(/\n+$/g,'')
  const offset = program.offset
  const revindex = program.reverseIndex

  // load file
  const file = fs.readFileSync(filename, 'utf-8', (err, file) => {
    return file
  })
  const data = yaml.safeLoad(file)

  // filter
  var records = data[recordtype]
  if ( program.author ) {
    records = records.filter((r) => {
      if ( r.authors.indexOf(program.author) >= 0 ) {
        return r
      }
    })
  }

  // stringify
  const texts = stringify(records, view, offset, revindex)
  texts.map((t) => {console.log(t)})
}

main()
