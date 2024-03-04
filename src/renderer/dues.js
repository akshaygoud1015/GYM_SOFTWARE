document.addEventListener('DOMContentLoaded', () => {
    console.log("dues");
    fetchAndRenderUpcomingDues();
});

function fetchAndRenderUpcomingDues() {
    api.searchForDues();

    api.userDues((event, rows) => {
        const duesContainer = document.getElementById('duesContainer');

        if (rows == "no upcoming dues" || rows.length==0 ) {
            console.log("no dues");
            // Display a message indicating no upcoming dues
            const message = document.createElement('p');
            message.textContent = "No upcoming dues";
            duesContainer.appendChild(message);
        } else {
            for (let i = 0; i < rows.length; i++) {
                const user = rows[i];
                console.log(user.name);
        
                if (i % 2 === 0) {
                    // Create a new row for every two cards
                    var row = document.createElement('div');
                    row.classList.add('row');
                }
        
                // Create a new column for each card
                const card = document.createElement('div');
                card.classList.add('col-sm-6', 'px-6');
        
                // Create card body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card', 'shadow-lg', 'p-3', 'mb-3', 'bg-warning', 'rounded', 'text-light','text-center');
        
                // Populate card with user details
                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = 'Name: ' + user.name;
        
                const number = document.createElement('p');
                number.classList.add('card-text');
                number.textContent = 'Number: ' + user.mobile;
        
                const date = document.createElement('p');
                date.classList.add('card-text');
                // Adjust the date format as needed
                const dateFromDB = user.validity;
                const adjustedDate = new Date(dateFromDB.getTime() - (dateFromDB.getTimezoneOffset() * 60000));
                date.textContent = 'Valid till : ' + adjustedDate.toISOString().split('T')[0];
        
                // Append elements to card body
                cardBody.appendChild(title);
                cardBody.appendChild(number);
                cardBody.appendChild(date);
        
                // Append card body to card
                card.appendChild(cardBody);
        
                // Append card to row
                row.appendChild(card);
        
                // Append row to dues container only if it's the last card or the next card is not available
                if (i % 2 === 1 || i === rows.length - 1) {
                    duesContainer.appendChild(row);
                }
            }
        }
        
    });
}
