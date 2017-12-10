# simple-mailgun

simple-mailgun is a simple client for the [Mailgun API](https://documentation.mailgun.com/en/latest/api_reference.html)

## install

```sh
npm install michaelrhodes/simple-mailgun
```

## use

```js
var mailgun = require('simple-mailgun')({
  domain: process.env.DOMAIN,
  key: process.env.API_KEY
})

var send = mailgun('POST /messages')

var email = {
  from: 'You <you@domain.com>',
  to: 'them@domain.com',
  subject: 'Hi',
  html: '<strong>How are you?</strong>',
  text: 'How are you?'
}

send(email, function (err, json) {
  err ? console.error(err) : console.log(json)
})
```

## obey

[MIT](http://opensource.org/licenses/MIT)
