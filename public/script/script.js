window.addEventListener("load", function () {
  $("#addButton").click(function () {
    var t = document.querySelector('#itemTamplate');
    var clone = document.importNode(t.content, true);
    document.querySelector(".items").appendChild(clone);
  });

  $("#nextButton").click(function () {
    var value = "";
    $(".items .item").each(function () {
      value += $(this).find("input").eq(0).val() + "@"
        +$(this).find("input").eq(1).val() + "!";
    });

    window.location.href = "/results?value="+value;

  });
});
