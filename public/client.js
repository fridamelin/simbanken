function addField () {
    var myTable = document.getElementById("myTable");
    // var currentIndex = myTable.rows.length;
    var currentRow = myTable.insertRow(-1);

    var exercise = document.createElement("input");
    exercise.setAttribute("type", "text");
    exercise.setAttribute("name", "exercise");
    exercise.setAttribute('class', 'inputtable');

    var description = document.createElement("input");
    description.setAttribute("type", "text");
    description.setAttribute("name", "description");
    description.setAttribute('class', 'inputtable');

    var distance = document.createElement("input");
    distance.setAttribute("type", "text");
    distance.setAttribute("name", "distance");
    distance.setAttribute('class', 'inputtable');

    var rest = document.createElement('input');
    rest.setAttribute('type', 'text');
    rest.setAttribute('name', 'rest');
    rest.setAttribute('class', 'inputtableSmall');

    var help = document.createElement('input');
    help.setAttribute('type', 'text');
    help.setAttribute('name', 'help');
    help.setAttribute('class', 'inputtable');

    var total = document.createElement('input');
    total.setAttribute('type', 'text');
    total.setAttribute('name', 'total');
    total.setAttribute('class', 'inputtableSmall');

    var currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(exercise);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(description);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(distance);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(rest);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(help);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(total);
}
 function removeField() {
     document.getElementById('myTable').deleteRow(-1);
 }

 function NotifyMe() {

     if(!('Notification' in window)) {
         alert('This browser does not support notifications');
     }else if (Notification.permission == 'granted')
     {
         var notification = new Notification('Ett nytt pass har lagts upp');
     } else if (Notification.permission != 'denied')
     {
         Notification.requestPermission(function (permission) {
             if('permission' == 'granted')
             {
                 var notification = new Notification('Ett nytt pass har lagts upp');
               setTimeout(function () {
                   notification.close();
               }, 3000);
             }
         });
     }
 }


module.exports = removeField();
module.exports = addField();
module.exports = NotifyMe();

