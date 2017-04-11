/*
$("thead").find("th").on("click", function() {
    $(this).closest("table").find("tbody").toggle();
});
*/

function HideFunc(tableid) {

    let tables = document.querySelectorAll('.tableClass')[tableid];

    if(tables.style.display === 'none'){
        tables.style.display = 'block';
    } else {
        tables.style.display = 'none';
    }
}

module.exports = HideFunc();