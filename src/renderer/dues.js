// renderer.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("dues")
    fetchAndRenderUpcomingDues();
});


function fetchAndRenderUpcomingDues(){
    api.searchforDues();

    api.userdues((event,rows)=>{
        if (rows=="no upcoming dues"){
            console.log("no dues")
        }
        else{
            users=(rows[0])
            console.log(users.name)
            for(i=0;i<users.length  ;i++){
                console.log(i.name)
            }
        }

    })
}