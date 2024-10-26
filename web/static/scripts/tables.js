let tableNames = [];

function addListItem(name) {
  let list = document.getElementById("list-tables");
  let listItem = document.createElement("a");
  listItem.classList.add("list-group-item");
  listItem.classList.add("py-1");
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

let types = ["text", "number", "time"];

function addColumnTableRow() {
  let table = document.getElementById("column-table-body");
  let row = document.createElement("tr");
  let nameCell = document.createElement("td");
  let nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.classList.add("form-control");
  nameInput.classList.add("form-control-sm");
  nameCell.appendChild(nameInput);
  row.appendChild(nameCell);
  let typeCell = document.createElement("td");
  let typeSelect = document.createElement("select");
  typeSelect.classList.add("form-select");
  typeSelect.classList.add("form-select-sm");
  let selected = document.createElement("option");
  selected.selected = true;
  selected.textContent = "type";
  typeSelect.appendChild(selected);
  types.forEach((type) => {
    let option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
  typeCell.appendChild(typeSelect);
  row.appendChild(typeCell);
  let defaultCell = document.createElement("td");
  let defaultInput = document.createElement("input");
  defaultInput.type = "text";
  defaultInput.classList.add("form-control");
  defaultInput.classList.add("form-control-sm");
  defaultInput.placeholder = "NULL";
  defaultCell.appendChild(defaultInput);
  row.appendChild(defaultCell);
  let primaryCell = document.createElement("td");
  let primaryInput = document.createElement("input");
  primaryInput.type = "checkbox";
  primaryInput.classList.add("form-check-input");
  primaryCell.appendChild(primaryInput);
  row.appendChild(primaryCell);
  let closeCell = document.createElement("td");
  let closeIcon = document.createElement("img");
  closeIcon.src = "/static/images/x.svg";
  closeIcon.width = 32;
  closeIcon.addEventListener("click", (_) => {
    row.remove();
  });
  closeCell.appendChild(closeIcon);
  row.appendChild(closeCell);
  table.appendChild(row);
}

addColumnTableRow();

document.getElementById("add-column-button").addEventListener("click", (_) => {
  addColumnTableRow();
});

async function createNewTable() {}
