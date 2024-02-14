// Handle form submission


const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;


document.getElementById('survey-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    // Retrieve form data
    const name = document.getElementById('name').value;0.
    const mobile = document.getElementById('number').value;
    const gender = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    console.log(gender)
    const adress = document.getElementById('adress').value;
    console.log(adress)
    const age = document.getElementById('age').value;
    const fee = document.getElementById('fee').value;
    const paymentDuration = document.getElementById('dropdown').value;
  
   

    api.sendInsertClient({ name, mobile, gender, adress, age, fee, paymentDuration,formattedDate });

    // Listen for confirmation from the main process
    api.onDataSaved((event, response) => {
        console.log('Response received after saving data: ', response);
       ;});
    alert("Submitted")
        
});


function searchUser(){
    const numb= document.getElementById('mobileNumber').value;
    console.log(numb)

    api.searchuser({numb});
    api.onSearchResult((event, rows) => {
        console.log(rows);


        if (rows.length > 0) {
            const user = rows[0]; // Assuming only one user is returned
            document.getElementById('id').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('mobile').value = user.mobile;
            document.getElementById('fee').value = user.fee;
            document.getElementById('paymentDate').value = user.date;
            document.getElementById('newpaymentDate').value = formattedDate;


        } else {
 
            console.log('No user found with the given mobile number.');
        }
    });
}


document.getElementById("paymentForm").addEventListener('submit',(event)=>{
    event.preventDefault();

    console.log("hello")
    console.log(formattedDate)
});

