var express = require('express');
var router = express.Router();
var database = require('../app').database;

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

  //res.render("results");

  var shoppingList = getShoppingList(req);

  database.query('SELECT * FROM prices', function(err, prices, fields) {

    database.query('SELECT * FROM locations', function(err, locations, fields) {

      if (err) throw err;

      for (var i = 0; i < prices.length; i++) {
        prices[i].json = JSON.parse(prices[i].json);
      }

      var totalPrice = [];
      var blacklist = [];

      for (var i = 0; i < prices.length; i++) {
        totalPrice[i] = 0;
        for (var j = 0; j < shoppingList.length; j++) {
          if (shoppingList[j].product in prices[i].json) {
            totalPrice[i] += prices[i].json[shoppingList[j].product]
                * shoppingList[j].amount;
          }
          else {
            blacklist.push(i);
          }
        }
      }

      var removed = 0;

      blacklist.forEach(function (element) {
        totalPrice.splice(element-removed, 1);
        locations.splice(element-removed, 1);
        removed++;
      });

      var data = [];
      for (var i = 0; i < locations.length; i++) {
        data[i] = {
          index: i,
          price: totalPrice[i],
          lng: locations[i].lng,
          lat: locations[i].lat
        }
      }

      res.render('results',{data: data});

    });

  });

});

module.exports = router;
