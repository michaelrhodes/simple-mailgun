var http = require('http')
var req = require('simple-get')
var parse = require('fast-json-parse')
var form = 'application/x-www-form-urlencoded'
var uenc = encodeURIComponent
var keys = Object.keys

module.exports = mailgun

function mailgun (conf) {
  conf = conf || {}

  var root = 'https://api.mailgun.net/v{version}/{domain}'
    .replace('{version}', conf.version || 3)
    .replace('{domain}', conf.domain)

  var headers = {
    'Authorization': 'Basic ' + Buffer
      .from('api:' + conf.key)
      .toString('base64')
  }

  return function prepare (path, cb) {
    var part = path.split(/\s+/)
    var method = part[1] ? part[0] : 'GET'
    var url = root + (part[1] || part[0])

    return typeof cb == 'function' ?
      request(cb) :
      request

    function request (body, cb) {
      if (typeof body == 'function')
        cb = body, body = null

      var opts = {
        headers: headers,
        method: method,
        url: url
      }

      if (body && method == 'GET') {
        opts.url += '?' + enc(body)
      }
      else if (body) {
        opts.headers['Content-Type'] = form
        opts.body = enc(body)
      }

      req.concat(opts, function (err, res, data) {
        if (err) return cb(err)

        var json = parse(data)
        var code = res.statusCode

        if (code >= 200 && code < 400) {
          return cb(null, json.value, res)
        }

        cb(new Error(json.value ?
          json.value.message :
          http.STATUS_CODES[code]
        ))
      })
    }
  }
}

function enc (obj) {
  return keys(obj).map(function (key) {
    return [].concat(obj[key]).map(function (val) {
      return uenc(key) + '=' + uenc(val)
    }).join('&')
  }).join('&')
}
