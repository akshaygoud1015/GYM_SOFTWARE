document.getElementById("billing").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    console.log(from, to);

    getBillings(from, to);
});


function getBillings(from, to) {
    api.billingInfo({ from, to });

    api.billingResults((event, rows, clientCount) => {
        let sum = 0.00;
        for(i=0;i<rows.length;i++){
            
            sum+=parseInt(rows[i].amount)
        }
        console.log(sum)
        newClients = parseInt(clientCount.count);
        document.getElementById("billings").value = sum;
        document.getElementById("clients").value = newClients;
        
    });    
}
