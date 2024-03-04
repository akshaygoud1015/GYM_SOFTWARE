document.addEventListener('DOMContentLoaded', () => {
    console.log("staff");
    fetchStaff();
});

function fetchStaff() {
    api.getStaff();

    api.staffList((event, rows) => {
        const staffContainer = document.getElementById('staffContainer');
    
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const staff = rows[i];
                const date = new Date(staff.date_of_joining);
    
                // Format the date as ddmmyyyy
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
                const year = date.getFullYear().toString();
                const formattedDate = day + month + year;
    
                if (i % 2 === 0) {
                    // Create a new row for every two cards
                    var row = document.createElement('div');
                    row.classList.add('row');
                }
    
                // Create a new column for each card
                const card = document.createElement('div');
                card.classList.add('col-sm-6', 'md-4');
    
                // Create card body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card', 'shadow-lg', 'p-3', 'mb-5', 'bg-black', 'rounded', 'text-light');
    
                // Populate card with staff details
                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = 'Name: ' + staff.name;
    
                const id = document.createElement('p');
                id.classList.add('card-text');
                id.textContent = 'ID: ' + staff.id;
    
                const phoneNumber = document.createElement('p');
                phoneNumber.classList.add('card-text');
                phoneNumber.textContent = 'Phone Number: ' + staff.phone_number;
    
                const age = document.createElement('p');
                age.classList.add('card-text');
                age.textContent = 'Age: ' + staff.age;
    
                const salary = document.createElement('p');
                salary.classList.add('card-text');
                salary.textContent = 'Salary: ' + staff.salary;
    
                const dateOfJoining = document.createElement('p');
                dateOfJoining.classList.add('card-text');
                dateOfJoining.textContent = 'Date of Joining: ' + formattedDate;
    
                // Append elements to card body
                cardBody.appendChild(title);
                cardBody.appendChild(id);
                cardBody.appendChild(phoneNumber);
                cardBody.appendChild(age);
                cardBody.appendChild(salary);
                cardBody.appendChild(dateOfJoining);
    
                // Append card body to card
                card.appendChild(cardBody);
    
                // Append card to row
                row.appendChild(card);
    
                // Append row to staff container only if it's the last card or the next card is not available
                if (i % 2 === 1 || i === rows.length - 1) {
                    staffContainer.appendChild(row);
                }
            }
        } else {
            console.log("No staff found");
            // Display a message indicating no staff found
            const message = document.createElement('p');
            message.textContent = "No staff found";
            staffContainer.appendChild(message);
        }
    });
    
}
