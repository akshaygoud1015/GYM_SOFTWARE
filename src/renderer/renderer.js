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

    api.sendInsertClient({ name, mobile, gender, adress, age, fee, paymentDuration });

    // Listen for confirmation from the main process
    api.onDataSaved((event, response) => {
        console.log('Response received after saving data: ', response);
        alert("Submitted");});
});
