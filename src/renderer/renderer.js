// Handle form submission


document.getElementById('survey-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    // Retrieve form data
    const name = document.getElementById('name').value;0.
    console.log(name)
    const mobile = document.getElementById('number').value;
    console.log(mobile)
    const gender = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    console.log(gender)
    const adress = document.getElementById('adress').value;
    console.log(adress)
    const age = document.getElementById('age').value;
    console.log(age)
    const fee = document.getElementById('fee').value;
    console.log(fee)
    const paymentDuration = document.getElementById('dropdown').value;
    console.log(paymentDuration)

    ipcRenderer.send('insert-client', { name, mobile, gender, adress, age, fee, paymentDuration });

    

    // Here, you can insert the form data into your MySQL database
    // You can use your MySQL connection code here to perform the insertion

    

    // After inserting data, you can optionally clear the form fields
    alert("submitted")

});
