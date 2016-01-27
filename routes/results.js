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

  // take the ?value=Appel@1!Peer@3! data and turn it into the folowing object:
  // [ {product: appel, amount: 1}, {product: peer, amount: 3} ]
  var shoppingList = getShoppingList(req);


  // ask the database for the required data
  database.query('SELECT * FROM prices', function(err, prices, fields) {

    database.query('SELECT * FROM locations', function(err, locations, fields) {

      if (err) throw err;

      // we have some text-json in the database, parse it into real json.
      for (var i = 0; i < prices.length; i++) {
        prices[i].json = JSON.parse(prices[i].json);
      }

      var totalPrice = [];
      var blacklist = [];

      for (var i = 0; i < prices.length; i++) {
        totalPrice[i] = 0;
        for (var j = 0; j < shoppingList.length; j++) {

          // does this shop have the required product?
          if (shoppingList[j].product in prices[i].json) {
            // if so, do the price times the required amount and add it to
            // `totalPrice`
            totalPrice[i] += prices[i].json[shoppingList[j].product]
                * shoppingList[j].amount;
          }
          else {
            // if not, blacklist it so we can remove it later
            blacklist.push(i);
          }
        }
      }

      // remove the blacklisted shops, and subtract the `removed` count so we
      // don't remove the wrong shops
      var removed = 0;
      blacklist.forEach(function (element) {
        totalPrice.splice(element-removed, 1);
        locations.splice(element-removed, 1);
        removed++;
      });

      // built the data that will be send to the `views/results.jade`
      var data = [];
      for (var i = 0; i < locations.length; i++) {
        data[i] = {
          index: i,
          price: totalPrice[i],
          lng: locations[i].lng,
          lat: locations[i].lat
        }
      }

      // respond to the cliend
      res.render('results',{data: data});

    });

  });

});

module.exports = router;
