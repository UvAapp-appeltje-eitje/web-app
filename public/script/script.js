function addElement() {
  // add the element
  var template = document.querySelector('#itemTamplate');
  var clone = document.importNode(template.content, true);
  document.querySelector(".items").appendChild(clone);

  // select the new element with jQuery
  var $newEl = $(".item").eq(-1);

  // auto select the item after it's created
  $newEl.find(".product").select();

  // auto remove if the user leaves it empty
  $newEl.find(".product").blur(function () {
    if ($(this).val() == "") {
      $(this).parent().remove();
    }
  });
}

// jQuery's .ready doesn't wait for things like images and fonts to load.
$(document).ready(function () {

  // if the add button is pressed, copy the data.
  $("#addButton").click(addElement);
  $("#addButton").focus(addElement);

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
