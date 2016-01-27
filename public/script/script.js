window.addEventListener("load", function () {

  // if the add button is pressed, copy the data.
  $("#addButton").click(function () {
    var t = document.querySelector('#itemTamplate');
    var clone = document.importNode(t.content, true);
    // tip: you can use `clone` instad of `document` to edit the data before
    // adding it to .items (you can't you jquery for this!)
    document.querySelector(".items").appendChild(clone);
  });

  // if the next button is pressed, send a GET request to `/results`
  $("#nextButton").click(function () {
    // parse the data so it can be de-parsed by `/routs/result` using
    // `getShoppingList()`
    var value = "";
    $(".items .item").each(function () {
      value += $(this).find("input").eq(0).val() + "@"
        +$(this).find("input").eq(1).val() + "!";
    });

    // send a GET request (redirect) to /results and add the shopping list to
    // it.
    window.location.href = "/results?value="+value;

  });
});
