document.addEventListener('DOMContentLoaded', () => {
    console.log("customers");
    fetchCustomers();
});

function fetchCustomers() {
    api.getCustomers();

    api.customersList((event, rows) => {
        const customersContainer = document.getElementById('customersContainer');

        if (rows.length > 0) {

            for (let i = 0; i < rows.length; i++) {
                const user = rows[i];
                console.log(user.name);

                // Create a new card element for each user
                const card = document.createElement('div');
                card.classList.add('col-sm-5', 'md-4' ,);

                // Create card body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card', 'shadow-lg', 'p-3', 'mb-5', 'bg-black', 'rounded', 'text-light');

                // Populate card with user details
                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = 'Name: '+ user.name;

                const id = document.createElement('p');
                id.classList.add('card-text');
                id.textContent = 'ID: '+ user.id;

                const number = document.createElement('p');
                number.classList.add('card-text');
                number.textContent = 'Number: '+ user.mobile;

                const date = document.createElement('p');
                date.classList.add('card-text');
                // Adjust the date format as needed
                const dateFromDB = user.validity;
                const adjustedDate = new Date(dateFromDB.getTime() - (dateFromDB.getTimezoneOffset() * 60000));
                date.textContent = 'Valid till: '+ adjustedDate.toISOString().split('T')[0];

                // Append elements to card body
                cardBody.appendChild(title);
                cardBody.appendChild(id);
                cardBody.appendChild(number);
                cardBody.appendChild(date);

                // Append card body to card
                card.appendChild(cardBody);

                // Append card to dues container
                customersContainer.appendChild(card);
            }            
        } else {
            console.log("no customers found");
            // Display a message indicating no upcoming dues
            const message = document.createElement('p');
            message.textContent = "No customers found";
            customersContainer.appendChild(message);            
        }        
    });
}