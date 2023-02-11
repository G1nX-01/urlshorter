function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
const rateLimiter = require("express-rate-limit");
const limiter = rateLimiter({
    max: 5,
    windowMS: 10000, // 10 seconds
    message: "Hey so uh sorry to tell ya this but you're being rate limited... sorry man. Try again in 10 seconds.",
});
const Blowfish = require('javascript-blowfish');
const bf = new Blowfish("banana");
const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
const JSONdb = require('simple-json-db');
const db = new JSONdb('db.json');
const path = require('path');

app.use(cors());
app.use(limiter);
var htmlPath = path.join(__dirname, 'html');

app.use(express.static(htmlPath));

function encryptstuff(text) {
return bf.encrypt(text);
}

function decryptstuff(text) {
  return bf.decrypt(text);
}

/*
app.get('/', (req, res) => {
res.sendFile('html/index.html', {root: __dirname })
})
*/

app.get('/:short', (req, res) => {
  
  let stuff = db.get(req.params.short);
  stuff = stuff.replace("https:/", "https://")
  let result = stuff.replace('"', "")
  result = result.slice(0, -1)
  res.redirect(result)
  console.log(stuff)
})

app.get('/add/json:url(*)', (req, res) => {
  app.set('json spaces', 2);
  res.append('Content-Type', 'application/json; charset=UTF-8');
  let arg = req.params.url
  let newshortcut = makeid(7)
  let result = arg.replace("https:/", " https://");
  result = result.replace(" ", "");
  result = result.slice(1);
  db.set(newshortcut, JSON.stringify(result));
  res.json({ shortcut: newshortcut, status: 200});
  console.log("someone made a url with shortcut: " + newshortcut + " - url: " + result)
  res.status(200)
})

app.get('/add/:url(*)', (req, res) => {
  let arg = req.params.url
  let newshortcut = makeid(7)
  let result = arg.replace("https:/", " https://");
  result = result.replace(" ", "");
  db.set(newshortcut, JSON.stringify(result));
  res.send('url ' + result + " was successfully added to the db. available in shortcut: " + newshortcut)
  console.log("someone made a url with shortcut: " + newshortcut + " - url: " + result)
  res.status(200);
})

app.listen(port, () => {
  console.log(`We're on port ${port} now`)
})