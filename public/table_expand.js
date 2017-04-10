/*
$("thead").find("th").on("click", function() {
    $(this).closest("table").find("tbody").toggle();
});
*/
let tables = document.querySelectorAll(".passTable");

for (let i = 0; i < tables.length; i++) {
    tables[i].addEventListener("click", function(e) {
        this.toggle();
    })
}
