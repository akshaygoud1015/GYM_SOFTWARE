// Handle form submission


const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;


function addClient(){

    // Retrieve form data
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('number').value;
    const gender = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    console.log(gender)
    const adress = document.getElementById('adress').value;
    console.log(adress)
    const age = document.getElementById('age').value;
    const fee = document.getElementById('fee').value;
    const paymentDuration = document.getElementById('dropdown').value;
  
   

    api.sendInsertClient({ name, mobile, gender, adress, age, fee, paymentDuration, formattedDate});

    // Listen for confirmation from the main process
    api.onDataSaved((event, response) => {
        console.log('Response received after saving data:', response);
       });
    alert("Submitted!")     
}


function searchUser(){
    const numb= document.getElementById('mobileNumber').value;
    console.log(numb)

    api.searchuser({numb});
    api.onSearchResult((event, rows) => {
        


        if (rows.length > 0) {
            const user = rows[0]; // Assuming only one user is returned
            document.getElementById('id').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('mobile').value = user.mobile;
            document.getElementById('fee').value = user.fee;
            document.getElementById('paymentType').value = user.payment_duration;
            const dateFromDB = user.last_payment;
            const adjustedDate = new Date(dateFromDB.getTime() - (dateFromDB.getTimezoneOffset() * 60000));
            const lastpaid = adjustedDate.toISOString().split('T')[0];
            document.getElementById('lastPaymentDate').value = lastpaid
            document.getElementById('newpaymentDate').value = formattedDate;
            console.log(formattedDate)



        } else {
            console.log('No user found with the given mobile number.');
            alert("No user found");
        }
    });
}


function makeRenewal(){

    const payType = document.getElementById('paymentType').value;
    const userId = document.getElementById('id').value;
    console.log(payType);
    console.log(userId);

    // Send a message to the main process to make the payment
    api.makePayment({ payType, userId });

    // Listen for the payment result from the main process
    api.onRenewal((event, result) => {
        alert(result)
        console.log('Payment result:', result);
    });
    
}

