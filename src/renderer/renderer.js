// Handle form submission


const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

function checkPassword(){
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    console.log(user);
    console.log(pass);

    api.checkLogin({user, pass});

    api.onLogin((event, key) => {
        if (key === 1) {
            window.location.href = 'owner.html';
        } else if (key === 2) {
            window.location.href = 'trainer.html';
        } else {
            alert(key);
        }
    });
}

function changePassword(){
    const user = document.getElementById('user').value;
    const pass = document.getElementById('newPassword').value;

    api.newPassword({user, pass});

    api.onChangePassword((event, res) => {
        alert(res);
    });
    document.getElementById('changePasswordForm').reset();
}

function addClient(){

    // Retrieve form data
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('number').value;
    const gender = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    const adress = document.getElementById('adress').value;
    const age = document.getElementById('age').value;
    const fee = document.getElementById('fee').value;
    const paymentDuration = document.getElementById('dropdown').value;
  
   

    api.sendInsertClient({ name, mobile, gender, adress, age, fee, paymentDuration, formattedDate});

    

    // Listen for confirmation from the main process
    api.onDataSaved((event, response) => {
        console.log('Response received after saving data:', response);
       });

    api.paymentUpdate((event,response)=>{
        userId=response[0].id;
        payType=paymentDuration;
        amount=fee;
        api.makePayment({ payType,userId,amount });

    })   
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
            if (user.last_payment) {
                const dateFromDB = user.last_payment;
                const adjustedDate = new Date(dateFromDB.getTime() - (dateFromDB.getTimezoneOffset() * 60000));
                const lastpaid = adjustedDate.toISOString().split('T')[0];
                document.getElementById('lastPaymentDate').value = lastpaid
            }
            document.getElementById('newPaymentDate').value = formattedDate;

            const selectElement = document.getElementById('paymentType');
            selectElement.innerHTML = ''; // Clear existing options

            const paymentTypes = ['Monthly', 'Quarterly', 'Half-yearly', 'Annually'];
            paymentTypes.forEach(paymentType => {
                const option = document.createElement('option');
                option.value = paymentType;
                option.textContent = paymentType;
                if (paymentType === user.payment_duration) {
                    option.selected = true; // Select the current payment type
                }
                selectElement.appendChild(option);
            });

        } else {
            console.log('No user found with the given mobile number.');
            alert("No user found");
        }
    });
    document.getElementById('paymentForm').reset();
}


function makeRenewal(){

    const payType = document.getElementById('paymentType').value;
    const userId = document.getElementById('id').value;
    const amount = document.getElementById('fee').value;
    console.log(payType);
    console.log(userId);

    // Send a message to the main process to make the payment
    api.makePayment({ payType, userId, amount });

    // Listen for the payment result from the main process
    api.onRenewal((event, result) => {
        alert(result);
        console.log('Payment result:', result);
    });
    
}

function searchPayments(){
    const id = document.getElementById('userId').value;

    api.searchForPayments({id});
    api.onSearchPayment((event, rows) => {

        const paymentsContainer = document.getElementById('paymentsContainer');
        document.getElementById('paymentsContainer').innerHTML='';
        
        if(rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const payments = rows[i];
                const dateFromDB = payments.payment_date;
                const adjustedDate = new Date(dateFromDB.getTime() - (dateFromDB.getTimezoneOffset() * 60000));
                const lastpaid = adjustedDate.toISOString().split('T')[0];

                // Create a new card element for each user
                const card = document.createElement('div');
                card.classList.add('col-sm-5', 'md-4' ,);

                // Create card body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card', 'shadow-lg', 'p-3', 'mb-5', 'bg-success', 'rounded','text-light');

                // Populate card with user details
                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = 'User ID: '+ payments.user_id;

                const date = document.createElement('p');
                date.classList.add('card-text');
                date.textContent = 'Payment Date: '+ lastpaid;

                const type = document.createElement('p');
                type.classList.add('card-text');
                type.textContent = 'Payment Type: '+ payments.payment_type;

                const fees = document.createElement('p');
                fees.classList.add('card-text');
                fees.textContent = 'Amount: '+ payments.amount;

                // Append elements to card body
                cardBody.appendChild(title);
                cardBody.appendChild(date);
                cardBody.appendChild(type);
                cardBody.appendChild(fees);

                // Append card body to card
                card.appendChild(cardBody);

                // Append card to dues container
                paymentsContainer.appendChild(card);
            }
        } else {
            console.log("no payments found");
            const message = document.createElement('p');
            message.textContent = "No payments found";
            paymentsContainer.appendChild(message);
        }
    });
}
