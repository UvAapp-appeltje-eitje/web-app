var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var database = mysql.createConnection({
  host     : '130.211.57.185',
  user     : 'root',
  password : 'WTK7dUkeEStnH0hxv5Dv',
  database : 'shops'
});

function getShoppingList (req) {

  var shoppingList = req.query.value.split("!");
  shoppingList = shoppingList.filter(function(n){ return n != "" });

  var tmp;
  for (var i = 0; i < shoppingList.length; i++) {
    tmp = shoppingList[i].split("@");
    shoppingList[i] = {product: tmp[0].toLowerCase(), amount: tmp[1]-0};
  }

  return shoppingList;
}

/* GET results page. */
router.get('/', function(req, res, next) {

  var shoppingList = getShoppingList(req);


  database.connect();

  console.log("Connecting to database")

  database.query('SELECT * FROM prices', function(err, rows, fields) {
    if (err) throw err;

    console.log("Raw: ",rows);

    for (var i = 0; i < rows.length; i++) {
      rows[i].json = JSON.parse(rows[i].json);
    }

    res.json(rows);

    // TODO: use the `shoppingList` and the `rows` to find calculate the
    // pricing.

  });

  database.end();

});

module.exports = router;
