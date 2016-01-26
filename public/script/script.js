window.addEventListener("load", function () {
  document.querySelector("#addButton").addEventListener("click",function () {
    var t = document.querySelector('#itemTamplate');
    var clone = document.importNode(t.content, true);
    document.querySelector(".items").appendChild(clone);
  })
});
