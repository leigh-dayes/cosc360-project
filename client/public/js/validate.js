function validateBooking(){
  //Activate Push notificaiton
  var pendingAlert = document.getElementById('pendingToast');//select id of toast
  var bsAlert = new bootstrap.Toast(pendingAlert);//inizialize it
  bsAlert.show();//show it
  var delay = 3000
  setTimeout( () => {
    var confirmAlert = document.getElementById('SSEToast');//select id of toast
    var bbsAlert = new bootstrap.Toast(confirmAlert);//inizialize it
    bbsAlert.show();//show it
    }, delay )
}
