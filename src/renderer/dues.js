document.addEventListener('DOMContentLoaded', () => {
    console.log("dues");
    fetchAndRenderUpcomingDues();
});

function fetchAndRenderUpcomingDues() {
    api.searchforDues();

    api.userdues((event, rows) => {
        const duesContainer = document.getElementById('duesContainer');

        if (rows == "no upcoming dues") {
            console.log("no dues");
            // Display a message indicating no upcoming dues
            const message = document.createElement('p');
            message.textContent = "No upcoming dues";
            duesContainer.appendChild(message);
        } else {
            for (let i = 0; i < rows.length; i++) {
                const user = rows[i];
                console.log(user.name);

                // Create a new card element for each user
                const card = document.createElement('div');
                card.classList.add('col-sm-5', 'md-4' ,);

                // Create card body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card', 'shadow-lg', 'p-3', 'mb-5', 'bg-dark', 'rounded','text-light');

                // Populate card with user details
                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = 'Name : '+user.name;

                const number = document.createElement('p');
                number.classList.add('card-text');
                number.textContent = 'Number: '+ user.mobile;

                const date = document.createElement('p');
                date.classList.add('card-text');
                // Adjust the date format as needed
                date.textContent = 'Valid till : '+ user.last_payment.toISOString().split('T')[0];

                // Append elements to card body
                cardBody.appendChild(title);
                cardBody.appendChild(number);
                cardBody.appendChild(date);

                // Append card body to card
                card.appendChild(cardBody);

                // Append card to dues container
                duesContainer.appendChild(card);
            }
        }
    });
}
