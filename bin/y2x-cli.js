#!/usr/bin/env node

'use strict'

var program = require('commander')
const fs = require('fs')
const loadRecords = require('../index.js').loadRecords

function main() {

  // ########################
  // ###### parameters ######
  // ########################

  // const filename = 'data.yml'
  // const recordType = 'conferences_ja'
  // const view = '{id}. {authors}, ({year}) "{title}", {conference}.'
  // const offset = 1
  // const reverseIndex = false

  program
    .version(require('../package.json').version)
    .usage('<file> [options]')
    .option('--view <text>', 'format string for each record')
    .option('--viewfile <file>', 'file name of format string for each record')
    .option('--author <text>', 'filter records with specific author')
    .option('--type <text>', 'record type')
    .option('--reverse-index', 'flag for reverse index')
    .option('--offset <n>', 'offset for index', parseInt, 1)
    .parse(process.argv);

  const filename = program.args[0]
  const recordType = program.type
  var viewFmt;
  if (program.view) {
    viewFmt = program.view
  } else if (program.viewfile) {
    viewFmt = fs.readFileSync(program.viewfile, 'utf-8', (err, file) => {
      return file
    }).replace(/\n+$/g,'')
  } else {
    viewFmt = '{id}. {title}'
  }
  const author = program.author
  const offset = program.offset
  const reverseIndex = program.reverseIndex

  var records = loadRecords(filename)

  records = records
    .view(viewFmt)
    .authoredBy(author)
    .offset(offset)

  if ( typeof recordType !== 'undefined' ) {
    records = records.typeOf(recordType)
  }
  if ( reverseIndex ) {
    records = records.reverseIndex()
  }

  const texts = records.render()
  texts.map((t) => {console.log(t)})
}

main()
