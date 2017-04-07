const fs = require('fs')
const yaml = require('js-yaml')

class defaultDict {
  constructor(d) {
    if (d === undefined) {
      return
    }
    this.set(d)
  }

  get(key) {
    if (this.hasOwnProperty(key)) {
      return this[key];
    } else {
      return this.default;
    }
  }

  setDefault(value) {
    this.default = value
  }

  set(d) {
    for (const key in d) {
      this[key] = d[key]
    }
  }
}

class Records {
  constructor(filename) {
    // filename: string of yaml data or Records object

    if (Records.prototype.isPrototypeOf(filename)) {
      this.data = filename.data
      this.filterFns = filename.filterFns.concat()
      this.viewFmt = filename.viewFmt
      this.offset = filename.offset
      this.reverseIndex = filename.reverseIndex
      return
    }

    // load file
    const file = fs.readFileSync(filename, 'utf-8', (err, file) => {
      return file
    })
    const data = yaml.safeLoad(file)
    this.data = data

    this.filterFns = [ (record) => true ]
    this.viewFmt = new defaultDict()
    this.viewFmt.setDefault('{id}. {title}')
    this.offset = 1
    this.reverseIndex = false
  }

  getData() {
    return this.data
  }

  contain (record) {
    if ( this.filterFns.length === 1 ) {
      return this.filterFns[0](record)
    } else {
      return this.filterFns.reduce((leftFn, rightFn) => {
        return leftFn(record) && rightFn(record)
      })
    }
  }

  typeOf(recordType) {
    var records = new Records(this)
    if (Array.prototype.isPrototypeOf(recordType)) {
      records.filterFns.push((record) => {
        return ( recordType.indexOf(record.type) >= 0 )
      })
    } else {
      records.filterFns.push((record) => {
        return record.type == recordType
      })
    }
    return records
  }

  authoredBy(author) {
    var records = new Records(this)
    records.filterFns.push((record) => {
      return ( record.authors.indexOf(author) >= 0 )
    })
    return records
  }

  offset(num) {
    var records = new Records(this)
    records.offset = num
    return records
  }

  reverseIndex() {
    var records = new Records(this)
    records.reverseIndex = true
    return records
  }

  view(viewFmt) {
    var records = new Records(this)
    if (typeof viewFmt === 'string') {
      records.viewFmt.setDefault(viewFmt)
    } else {
      records.viewFmt.set(viewFmt)
    }
    return records
  }

  render() {
    return stringify(
      this.data.filter((record) => this.contain(record)),
      this.viewFmt,
      this.offset,
      this.reverseIndex
    )
  }
}

function loadRecords (filename) {
  return new Records(filename)
}

function stringify(data, viewFmt, offset, reverse) {

  if ( offset == null ) { offset = 1 }
  if ( reverse == null ) { reverse = false }

  return data.map((r, id) => {

    const r_new = Object.assign({}, r, {
      id: (reverse) ? data.length - id - 1 + offset : id + offset,
      authors: r.authors.join(', '),
      firstauthor: r.authors[0]
    })

    return format(viewFmt.get(r_new.type), r_new)
  })
}

function format(viewFmt, record) {
    var rep_fn = undefined;

    if (typeof record == "object") {
        rep_fn = function(m, k) { return record[ k ]; }
    }
    else {
        var args = arguments;
        rep_fn = function(m, k) { return args[ parseInt(k)+1 ]; }
    }

    return viewFmt.replace( /\{(\w+)\}/g, rep_fn);
}

module.exports.Records = Records
module.exports.loadRecords = loadRecords
module.exports.stringify = stringify
module.exports.format = format
