function addStaff() {
    // Retrieve form data
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('phone_number').value;
    const alternateMobile = document.getElementById('alternate_phone_number').value;
    const age = document.getElementById('age').value;
    const salary = document.getElementById('salary').value;
    const dateOfJoining = document.getElementById('date_of_joining').value;
  
    // Create an object with the form data
    const formData = {
      name: name,
      mobile: mobile,
      alternateMobile: alternateMobile,
      age: age,
      salary: salary,
      dateOfJoining: dateOfJoining
    };
  
    // Send the form data to the API function
    api.sendInsertStaff(formData);
  
    // Log the form data to check if it's retrieved correctly
    console.log("Form Data:", formData);
}

// Listen for the response after saving staff data
api.onStaffDataSaved((event, response) => {
    console.log('Response received after saving staff data:', response);
});
