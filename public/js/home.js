const signupForm = document.getElementById("signupBtn");
const loginForm = document.getElementById("loginBtn");
loginForm.addEventListener("click", async function (e) {
  e.preventDefault();
  const inputEmail = document.getElementById("loginEmail").value;
  const inputPassword = document.getElementById("loginPassword").value;

  const userObj = {
    userEmail: inputEmail,
    userPassword: inputPassword,
  };

  const isValidUser = await axios.post(
    "http://localhost:3000/user/login",
    userObj
  );
  console.log(isValidUser);
  if (isValidUser.status == 200) {
    e.preventDefault();
    localStorage.setItem(
      "token",
      JSON.stringify({
        name: isValidUser.data.user.email,
        token: isValidUser.data.token,
      })
    );
    window.location.href = `http://localhost:3000/user/dashboard`;
  }
});

signupForm.addEventListener("click", async (e) => {
  e.preventDefault();
  const inputName = document.getElementById("name").value;
  const inputEmail = document.getElementById("signupEmail").value;
  const inputPassword = document.getElementById("signupPassword").value;

  const userObj = {
    userName: inputName,
    userEmail: inputEmail,
    userPassword: inputPassword,
  };
  await axios.post(
    "http://localhost:3000/user/signup",
    userObj
  );
});
