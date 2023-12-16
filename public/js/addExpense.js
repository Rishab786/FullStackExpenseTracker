const inputAmount = document.getElementById("amount");
const inputDescription = document.getElementById("description");
const inputCategory = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const tokenData = JSON.parse(localStorage.getItem("token"));
const rzrpBtn = document.getElementById("rzpBtn");
const container = document.getElementById("root");
const leaderBoardTable = document.getElementById("leaderBoardTable");
const noOfItemsPerPage = document.getElementById("noiteminpage");
const expenseTable = document.getElementById("expenseTable");
const tableParentElement = document.getElementById("tableParentElement");
const URL = "http://localhost:3000";

const authenticatedAxios = axios.create({
  headers: {
    Authorization: `${tokenData.token}`,
    userId: `${tokenData.name}`,
  },
});
let currentPage = 0;
let hasMorePage;
let hasPreviousPage;
let noitem = 0;
let pageIndex = 0;

noOfItemsPerPage.addEventListener("change", selectRows);

//CREATE NEW EXPENSE
addBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = inputAmount.value;
  const description = inputDescription.value;
  const category = inputCategory.value;

  if (amount <= 0) {
    alert("please enter correct amount");
  } else if (description === "") {
    alert("please enter valid description");
  } else if (category === "" || category === "Select Category") {
    alert("please select a category");
  } else {
    saveData(amount, description, category);

    clear();
  }
});

//SAVING THE EXPENSE INTO DATABASE
async function saveData(amount, description, category) {
  const myObj = {
    price: amount,
    product: description,
    category: category,
    userid: tokenData.name,
  };

  await authenticatedAxios.post(`${URL}/expenses/addExpense`, myObj);
  getAllExpenses();
}

//DELETE EXPENSE FROM DATABASE
async function deleteData(expenseId) {
  if (confirm("Are You Sure?")) {
    let element = document.getElementById(`${expenseId}`);
    element.remove();
    await authenticatedAxios.delete(`${URL}/expenses/delete/${expenseId}`);
    getAllExpenses();
  }
}

//GETTING ALL EXPENSES OF A USER
async function getAllExpenses() {
  const response = await authenticatedAxios.get(
    `${URL}/expenses/getAllExpenses/?page=${currentPage}&noitem=${noitem}`
  );
  hasMoreExpenses = response.data.hasMoreExpenses;
  hasPreviousExpenses = response.data.hasPreviousExpenses;
  const expenseData = response.data.expenses;
  if (expenseData.length > 0) createElement(expenseData);
}

//  SHOWING EXPENSE DATA
function createElement(data) {
  expenseTable.innerHTML = "";

  expenseTable.innerHTML = `
    <tr>
    <th>Amout</th>
    <th>Description</th>
    <th>Category</th>
  </tr>
    `;
  data.forEach((element, index) => {
    const html = `
        <tr id=${element.id}>
    <td>${element.amount}</td>
    <td>${element.product} </td>
    <td> ${element.category}</td>
     <td><button onclick="deleteData(${element.id})">Delete</button></td>
    </tr>`;
    expenseTable.innerHTML += html;
  });
  const footerHtml = `<div id="footer">
    <button id="prevPage" onclick="clickPrevPage()">Previous</button>
    <button id="currentPage">${currentPage}</button>
    <button id="nextPage" onclick="clickNextPage()">Next</button>
    </div>

    `;
  expenseTable.innerHTML += footerHtml;
}

//PAGINATION LOGIC
function selectRows() {
  noitem = noiteminpage.value;
  currentPage = 1;
  getAllExpenses();
}

function clickPrevPage() {
  if (hasPreviousExpenses) {
    currentPage--;
    getAllExpenses();
  }
}

function clickNextPage() {
  if (hasMoreExpenses) {
    currentPage++;
    getAllExpenses();
  }
}

//PAYMENT GATEWAY
rzrpBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const response = await authenticatedAxios.get(
    `${URL}/purchase/premiummembership`
  );
  const { key_id, orderid } = response.data;

  var options = {
    key: key_id,
    order_id: orderid,

    handler: async function (response) {
      await authenticatedAxios.put(`${URL}/purchase/updatetransactionstatus`, {
        order_id: response.razorpay_order_id,
        payment_id: response.razorpay_payment_id,
      });
      rzrpBtn.remove();

      alert(`you are a premium user now`);
      isPremiumUser();
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("Something went wrong Transaction failed");
  });
});

//CHECKING WHETHER USER IS A PREMIUM USER OR NOT
async function isPremiumUser() {
  try {
    const currentuser = await authenticatedAxios.get(`${URL}/user/userstatus`);

    if (currentuser.status == 200) {
      const h4 = document.createElement("h4");
      const leaderBoardBtn = document.createElement("button");
      h4.appendChild(document.createTextNode("You are a premium User"));
      leaderBoardBtn.appendChild(document.createTextNode("Show LeaderBoard"));
      leaderBoardBtn.setAttribute("onclick", "showLeaderBoard()");
      container.appendChild(h4);
      container.appendChild(leaderBoardBtn);
      const downloadBtn = document.createElement("button");
      downloadBtn.appendChild(document.createTextNode("Download Expenses"));
      container.appendChild(downloadBtn);
      downloadBtn.setAttribute("onclick", "downloadExpenses()");
      rzrpBtn.remove();
    } else {
      console.log("u are not premium user");
    }
  } catch (error) {
    console.log(error);
  }
}

//SHOWING LEADERBOARD TO PREMIUM USERS
async function showLeaderBoard() {
  const leaderBoard = await authenticatedAxios.get(
    `${URL}/premium/leaderboard`
  );
  leaderBoardTable.innerHTML = `
    <h4 id="footer"> LEADERBOARD </h4>
    <tr>
    <th>Name</th>
    <th>Email Address</th>
    <th>Total Expenses</th>
  </tr>
    `;
  const data = leaderBoard.data;
  for (let i = 0; i < data.length; i++) {
    const html = `
        <tr>
    <td>${data[i].name}</td>
    <td>${data[i].email} </td>
    <td> ${data[i].totalExpenses}</td>
     
    </tr>`;
    leaderBoardTable.innerHTML += html;
  }
}

//DOWNLOAD THE EXPENSE DATA FILE
async function downloadExpenses() {
  try {
    let response = await authenticatedAxios.get(`${URL}/premium/download`);
    window.location.href = response.data.URL;
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

//CLEARING FORM FIELDS
const clear = () => {
  amount.value = "";
  description.value = "";
  category.value = "";
};

isPremiumUser();
