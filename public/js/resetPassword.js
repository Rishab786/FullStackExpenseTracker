const resetBtn=document.getElementById('resetBtn');
const password=document.getElementById('pass1');
const confirmPassword=document.getElementById('pass2');
const url = window.location.href.split('/'); 
const resetId= url[url.length - 1];

resetBtn.addEventListener('click',onReset)
async function onReset(e) {
    try {
             e.preventDefault();
            if(password.value!==confirmPassword.value){
                
            }else{
                const data = {
                    resetid: resetId,
                    newpassword: password.value,
                };
               const resetresponse =  await axios.post("http://localhost:3000/password/reset", data);
               if(resetresponse && resetresponse.status === 200){
                console.log("successfuly reset");
          }
            }
        

    } catch (error) {
        console.log(error);
        alert(error.response.data.message);

    }
}