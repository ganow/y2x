const loadRecords = require('./index.js').loadRecords

const filename = 'data.yml'
const recordType = ['paper', 'conference_ja']
const viewFmt = {
  paper: '<li>{id}. {authors}, ({year}) "{title}", {journal}.</li>',
  conference_ja: '<li>{id}. {authors}, ({year}) "{title}", {conference}.</li>'
}
const offset = 1
const revindex = false

const records = loadRecords(filename)
const text = records
  .typeOf(recordType)
  .view(viewFmt)
  .render()
text.map((el) => console.log(el))
