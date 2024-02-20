function addstaff(){

    // Retrieve form data
    var name = document.getElementById("name").value;
    var phoneNumber = document.getElementById("phoneNumber").value;
    var alternatePhoneNumber = document.getElementById("alternatePhoneNumber").value;
    var age = document.getElementById("age").value;
    var salary = document.getElementById("salary").value;
    var date = document.getElementById("date").value;
  
   

    api.sendInsertstaff({ name, phoneNumber, alternatePhoneNumber, age, salary, date});

    // Listen for confirmation from the main process
    api.onStaffDataSaved((event, response) => {
        console.log('Response received after saving staff data:', response);
        alert("Staff data submitted!");
    });   
}