document.addEventListener('DOMContentLoaded', () => {
    
    fetchOverDues();
});


function fetchOverDues(){
    api.searchForOverDues();

    api.userOverDue((event, data)=>{
        const duesContainer = document.getElementById('duesContainer');

        if (data == "no dues") {
            console.log("no dues");
            // Display a message indicating no upcoming dues
            const message = document.createElement('p');
            message.textContent = "No upcoming dues";
            duesContainer.appendChild(message);
        } else {
            for (let i = 0; i < data.length; i++) {
                const user = data[i];
                console.log(user.name);

                // Create a new card element for each user
                const card = document.createElement('div');
                card.classList.add('col-sm-5', 'md-4' ,);

                // Create card body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card', 'shadow-lg', 'p-3', 'mb-5', 'bg-danger', 'rounded','text-light');

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
                const dateFromDB = user.validity;
                const adjustedDate = new Date(dateFromDB.getTime() - (dateFromDB.getTimezoneOffset() * 60000));
                date.textContent = 'Valid till : '+ adjustedDate.toISOString().split('T')[0];;

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

    }

)}

function signOut(){
    alert("Successfully signed out!");
    window.location.href = 'index.html';
}