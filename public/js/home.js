const signupForm = document.getElementById("signupBtn");
const loginForm = document.getElementById("loginBtn");
const URL = "http://localhost:3000";

//LOGIN FORM
loginForm.addEventListener("click", async function (e) {
  e.preventDefault();
  const inputEmail = document.getElementById("loginEmail");
  const inputPassword = document.getElementById("loginPassword");
  const userObj = {
    userEmail: inputEmail.value,
    userPassword: inputPassword.value,
  };

  try {
    const isValidUser = await axios.post(`${URL}/user/login`, userObj);
    if (isValidUser.status == 200) {
      e.preventDefault();
      localStorage.setItem(
        "token",
        JSON.stringify({
          name: isValidUser.data.user.email,
          token: isValidUser.data.token,
        })
      );
      window.location.href = `${URL}/user/dashboard`;
    }
  } catch (error) {
    console.log(error);
  }
});

//SIGNUP FORM
signupForm.addEventListener("click", async (e) => {
  e.preventDefault();
  const inputName = document.getElementById("name");
  const inputEmail = document.getElementById("signupEmail");
  const inputPassword = document.getElementById("signupPassword");
  const userObj = {
    userName: inputName.value,
    userEmail: inputEmail.value,
    userPassword: inputPassword.value,
  };
  try {
    const response = await axios.post(`${URL}/user/signup`, userObj);
    if (response.status == 200)
      window.location.href = `${URL}/user/registeredSuccessfully`;
  } catch (error) {
    window.location.href = `/html/alreadyUser.html`;
    console.log(error);
  }
});
