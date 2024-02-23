document.getElementById("expenseForm").addEventListener('submit',(event)=>{
    event.preventDefault();
    const expenseName=document.getElementById("name").value;
    const amount=document.getElementById("amount").value;
    const madeBy=document.getElementById("madeBy").value;
    let enquired="";
    if (madeBy==1){
        enquired="Owner"

    }
    else{
        enquired="Trainer"
    }
    const date=document.getElementById("dateOfExpense").value;
    console.log(expenseName,amount,enquired,date)

    addExpense(expenseName,amount,enquired,date)
})


function addExpense (expenseName,amount,enquired,date){
    api.addNewExpense({expenseName,amount,enquired,date})

    api.addedExpense((event,response)=>{
        console.log(response)
    })

    alert("Added Expense Successfully")

    document.getElementById("expenseForm").reset;

}