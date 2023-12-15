const inputAmount = document.getElementById("amount");
const inputDescription = document.getElementById("description");
const inputCategory = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const tokenData = JSON.parse(localStorage.getItem("token"));
const rzrpBtn = document.getElementById("rzpBtn");
const container = document.getElementById("root");
const leaderBoardList = document.getElementById("leaderBoard");
const noOfItemsPerPage = document.getElementById("noiteminpage");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const curPageBtn = document.getElementById("currentPage");
const listOfItems = document.getElementById("listOfExpense");
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
prevPageBtn.addEventListener("click", clickPrevPage);
nextPageBtn.addEventListener("click", clickNextPage);

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

async function saveData(amount, description, category) {
  const myObj = {
    price: amount,
    product: description,
    category: category,
    userid: tokenData.name,
  };

  await authenticatedAxios.post(`${URL}/expenses/addExpense`, myObj);
}

const createElement = (element) => {
  let amount = element.amount;
  if (amount == undefined) {
    amount = element.price;
  }
  const description = element.product;
  const category = element.category;
  const li = document.createElement("li");
  li.id = element.id;
  li.innerText = `${amount}     ${description}     ${category} `;
  const deleteBtn = document.createElement("button");
  deleteBtn.appendChild(document.createTextNode("Delete"));
  li.append(deleteBtn);
  listOfItems.appendChild(li);
  deleteElement(deleteBtn, element, li);
};

function deleteElement(deleteBtn, user, li) {
  deleteBtn.onclick = () => {
    let userId = user.id;
    if (confirm("Are You Sure?")) {
      let element = document.getElementById(`${userId}`);
      element.remove();
      deleteData(userId);
    }
  };
}

function deleteData(expenseId) {
  authenticatedAxios.delete(`${URL}/expenses/delete/${expenseId}`);
}

function selectRows() {
  noitem = noiteminpage.value;
  currentPage = 1;
  getAllExpenses();
}

async function getAllExpenses() {
  const response = await authenticatedAxios.get(
    `${URL}/expenses/getAllExpenses/?page=${currentPage}&noitem=${noitem}`
  );
  hasMoreExpenses = response.data.hasMoreExpenses;
  hasPreviousExpenses = response.data.hasPreviousExpenses;
  curPageBtn.innerText = currentPage;
  expenseData = response.data.expenses;
  showOutput(expenseData);
}

function showOutput(data) {
  listOfItems.innerHTML = "";
  if (data.length > 0) {
    data.forEach((element, index) => {
      const li = document.createElement("h5");
      li.id = element.id;
      li.innerText = `${(currentPage - 1) * noitem + index + 1} ${
        element.amount
      }  ${element.product}  ${element.category} `;
      const deleteBtn = document.createElement("button");
      deleteBtn.appendChild(document.createTextNode("Delete"));
      li.append(deleteBtn);
      deleteElement(deleteBtn, element, li);
      listOfItems.appendChild(li);
    });
  }
}

function clickPrevPage(e) {
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

async function isPremiumUser () {
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
};

async function showLeaderBoard() {
  const leaderBoard = await authenticatedAxios.get(
    `${URL}/premium/leaderboard`
  );
  const data = leaderBoard.data;
  for (let i = 0; i < data.length; i++) {
    const totalExpense = data[i].totalExpenses;

    const userName = data[i].name;
    const userId = data[i].email;
    const li = document.createElement("li");
    li.innerText = `${userId}     ${userName}     ${totalExpense} `;
    leaderBoardList.appendChild(li);
  }
}

async function downloadExpenses() {
  try {
    let response = await authenticatedAxios.get(`${URL}/premium/download`);
    window.location.href = response.data.URL;
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

const clear = () => {
  amount.value = "";
  description.value = "";
  category.value = "";
};

isPremiumUser();
