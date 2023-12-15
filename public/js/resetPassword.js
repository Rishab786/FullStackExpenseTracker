const resetBtn = document.getElementById("resetBtn");
const password = document.getElementById("pass1");
const confirmPassword = document.getElementById("pass2");
const URL = "http://localhost:3000";
const url = window.location.href.split("/");
const resetId = url[url.length - 1];

//  UPDATING NEW PASSWORD
resetBtn.addEventListener("click", onReset);
async function onReset(e) {
  try {
    e.preventDefault();
    if (password.value !== confirmPassword.value) {
      alert("please check the password");
    } else {
      const data = {
        resetid: resetId,
        newpassword: password.value,
      };
      const resetresponse = await axios.post(`${URL}/password/reset`, data);
      if (resetresponse && resetresponse.status === 200) {
        window.location.href = `/html/resetPasswordSuccessfully.html`; 
      }
    }
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}
