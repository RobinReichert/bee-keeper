let tableNames = [];

function addListItem(name) {
  let list = document.getElementById("list-tab");
  let listItem = document.createElement("a");
  listItem.classList.add("list-group-item");
  listItem.setAttribute("data-bs-toggle", "list");
  listItem.setAttribute("href", "#");
  listItem.role = "tab";
  listItem.id = name + "-list-item";
  listItem.textContent = name;
  list.appendChild(listItem);
}

function buildTableNames() {
  tableNames.forEach((name) => {
    addListItem(name.tablename);
  });
}

async function initTableNames() {
  let response = await fetch("http://localhost:8082/tableNames");
  if (response.ok) {
    tableNames = await response.json();
    buildTableNames();
  }
}

initTableNames();
