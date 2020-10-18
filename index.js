const express = require("express");
const db = require("quick.db");
const axios = require('axios')

const app = express();
const port = process.env.PORT || 3000;

const clientID = '7cfc702671649f90e0a3'
const clientSecret = 'd1304e1bbddab344045fe4b6be4c56fb70aeadf6'

app.use(express.json());
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/community", (req, res) => {
  res.render("community");
});

app.get("/en", (req, res) => {
  res.render("en");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/credits", (req, res) => {
  res.render("credits");
});


app.get("/admin", (req, res) => {
  let id = [],
    data = [];
  for (let i in db.all()) {
    id.push(db.all()[i].ID);
    data.push(String(db.all()[i].data).replace(/"/gi, ""));
  }
  id.shift();
  data.shift();

  res.render("admin", { id, data });
  return;
});

app.get("/:id", (req, res) => {
  res.redirect(db.get(req.params.id));
});

app.get('/oauth/redirect', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code
  axios({
    // make a POST request
    method: 'post',
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/admin?access_token=${accessToken}`)
  })
})

app.get('/api/editNotice', (req, res) => {
  db.set('notice', req.query.content);
  res.send();
});

app.post("/api/new", async (req, res) => {
  try {
    db.get(req.body.custom);
  } catch (error) {
    db.add("id", 1);
    db.set(String(db.get("id")), req.body.url);
    console.log(`${String(db.get("id"))}: ${req.body.url}`);
    res.send(String(db.get("id")));
  }
  if (typeof req.body.custom != "undefined") {
    if (!db.has(req.body.custom)) {
      db.set(req.body.custom, req.body.url);
      console.log(`${req.body.custom}: ${req.body.url}`);
      res.send(req.body.custom);
    } else {
      res.send("ERR");
    }
  }
});

app.post("/api/delete", (req, res) => {
  for (let i in db.all()) {
    if (db.all()[i].ID == req.body.target) {
      db.delete(req.body.target);
      return;
    }
  }
});


app.listen(port, () => console.log(`Listening on ${port}!`));

