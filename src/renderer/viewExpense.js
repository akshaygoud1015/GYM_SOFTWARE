document.getElementById("expenses").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const from = document.getElementById("start").value;
    const to = document.getElementById("end").value;
    console.log(from, to);
    fetchExpenses(from, to);
});


function fetchExpenses(from, to){
    api.getExpenses({from, to});

    api.expenseResult((event,rows)=>{
        let sum = 0.00;
        const expensesContainer = document.getElementById('expensesContainer');
        if (rows == "no Expenses Found") {
            const message = document.createElement('p');
            message.textContent = "No expenses Found";
            expensesContainer.appendChild(message);
        } else {
            for (let i = 0; i < rows.length; i++) {
                const expense = rows[i];
                console.log(expense.expense_name);
                sum+=parseInt(rows[i].amount);

                const card = document.createElement('div');
                card.classList.add('col-sm-5', 'md-4' ,);

                const cardBody = document.createElement('div');
                cardBody.classList.add('card', 'shadow-lg', 'p-3', 'mb-5', 'bg-success', 'rounded', 'text-light');


                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = 'Name: '+ expense.expense_name;

                const number = document.createElement('p');
                number.classList.add('card-text');
                number.textContent = 'amount: '+ expense.amount;

                const madeBy = document.createElement('p');
                madeBy.classList.add('card-text');
                madeBy.textContent = 'Expense BY: '+ expense.made_by;

                const date = document.createElement('p');
                date.classList.add('card-text');
                const dateFromDB = expense.expense_date;
                const adjustedDate = new Date(dateFromDB.getTime() - (dateFromDB.getTimezoneOffset() * 60000));
                date.textContent = 'Expense Made on: '+ adjustedDate.toISOString().split('T')[0];


                cardBody.appendChild(title);
                cardBody.appendChild(number);
                cardBody.appendChild(madeBy)
                cardBody.appendChild(date);


                card.appendChild(cardBody);

                expensesContainer.appendChild(card);
            }
            document.getElementById("totalExpenses").value = sum;
        }
    });
    document.getElementById('expensesContainer').innerHTML='';
}