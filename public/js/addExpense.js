const inputAmount = document.getElementById("amount");
const inputDescription = document.getElementById("description");
const inputCategory = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const listOfItems = document.getElementById("listOfItems");
const tokenData = JSON.parse(localStorage.getItem("token"));

const { token, email } = tokenData;
const authenticatedAxios = axios.create({
  headers: {
    Authorization: `${token}`,
    userId: `${email}`,
  },
});

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

const saveData = async (amount, description, category) => {
  const myObj = {
    price: amount,
    product: description,
    category: category,
    userid: tokenData.name,
  };
  createElement(myObj);
  const response = await authenticatedAxios.post(
    `http://localhost:3000/expenses/addExpense`,
    myObj
  );
};

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
const deleteElement = (deleteBtn, user, li) => {
  deleteBtn.onclick = () => {
    let userId = user.id;
    if (confirm("Are You Sure?")) {
      let element = document.getElementById(`${userId}`);
      element.remove();
      deleteData(userId);
    }
  };
};

const deleteData = (expenseId) => {
  authenticatedAxios.delete(
    `http://localhost:3000/expenses/delete/${expenseId}`
  );
};
const getAllExpenses = async () => {
  const response = await authenticatedAxios.get(
    `http://localhost:3000/expenses/getAllExpenses`
  );
  for (let i = 0; i < response.data.length; i++) {
    createElement(response.data[i]);
  }
};
function clear() {
  amount.value = "";
  description.value = "";
  category.value = "";
}

getAllExpenses();
