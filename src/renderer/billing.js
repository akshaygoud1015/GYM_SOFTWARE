document.getElementById("billing").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const year = document.getElementById("year").value;
    const month = document.getElementById("month").value;
    console.log(year, month);

    getBillings(year, month);
});


function getBillings(year, month) {
    api.billingInfo({ year, month });

    api.billingResults((event, rows) => {
        let sum = 0.00;
        for(i=0;i<rows.length;i++){
            
            sum+=parseInt(rows[i].amount)
        }
        console.log(sum)
        document.getElementById("billings").value=sum;

    });
    
    
}
