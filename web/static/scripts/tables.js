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

let types = ["INT", "TEXT"];

function addColumnTableRow() {
  let table = document.getElementById("column-table-body");
  let row = document.createElement("tr");
  let nameCell = document.createElement("td");
  let nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.classList.add("form-control");
  nameInput.classList.add("form-control-sm");
  nameInput.classList.add("col-name");
  nameCell.appendChild(nameInput);
  row.appendChild(nameCell);
  let typeCell = document.createElement("td");
  let typeSelect = document.createElement("select");
  typeSelect.classList.add("form-select");
  typeSelect.classList.add("form-select-sm");
  typeSelect.classList.add("col-type");
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
  defaultInput.classList.add("col-default");
  defaultInput.placeholder = "NULL";
  defaultCell.appendChild(defaultInput);
  row.appendChild(defaultCell);
  let primaryCell = document.createElement("td");
  let primaryInput = document.createElement("input");
  primaryInput.type = "checkbox";
  primaryInput.classList.add("col-primary");
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

async function createNewTable() {
  let invalid = false;
  let tableNameInput = document.getElementById("new-table-name");
  let tableName = tableNameInput.value;
  if (tableName == "") {
    invalid = true;
    tableNameInput.classList.add("is-invalid");
  } else {
    tableNameInput.classList.remove("is-invalid");
    tableNameInput.classList.add("is-valid");
  }
  let columns = [];
  let primaryChosen = false;
  let table = document.getElementById("column-table-body");
  table.childNodes.forEach((row) => {
    let nameInput = row.querySelector(".col-name");
    let name = nameInput.value;
    if (name == "") {
      invalid = true;
      nameInput.classList.add("is-invalid");
    } else {
      nameInput.classList.remove("is-invalid");
      nameInput.classList.add("is-valid");
    }
    let typeInput = row.querySelector(".col-type");
    let type = typeInput.value;
    if (type == "type") {
      invalid = true;
      typeInput.classList.add("is-invalid");
    } else {
      typeInput.classList.remove("is-invalid");
      typeInput.classList.add("is-valid");
    }
    let defaultInput = row.querySelector(".col-default");
    let deflt = defaultInput.value;
    defaultInput.classList.add("is-valid");
    let primaryInput = row.querySelector(".col-primary");
    let primary = primaryInput.checked;
    if (primary) {
      if (primaryChosen) {
        invalid = true;
        primaryInput.classList.add("is-invalid");
      } else {
        primaryInput.classList.remove("is-invalid");
        primaryInput.classList.add("is-valid");
      }
      primaryChosen = true;
    }
    columns.push({
      name: name,
      type: type,
      default: deflt,
      primary: primary,
    });
  });
  if (!primaryChosen) {
    invalid = true;
    table.querySelector(".col-primary").classList.add("is-invalid");
  }
  if (!invalid) {
    let body = { name: tableName, columns: columns };
    let response = await fetch("http://localhost:8082/newTable", {
      method: "POST",
      body: JSON.stringify(body),
    });
    console.log(response);
  }
  console.log(columns);
}

document.getElementById("add-table-button").addEventListener("click", (_) => {
  createNewTable();
});
