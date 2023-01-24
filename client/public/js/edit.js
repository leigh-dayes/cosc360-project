"use strict";

function confirmNote(){
  var myAlert = document.getElementById('confirmToast');//select id of toast
  var bsAlert = new bootstrap.Toast(myAlert);//inizialize it
  bsAlert.show();//show it
}

function deleteNote(){
    var myAlert = document.getElementById('deleteToast');//select id of toast
    var bsAlert = new bootstrap.Toast(myAlert);//inizialize it
    bsAlert.show();//show it
}