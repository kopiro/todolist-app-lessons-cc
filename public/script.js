const inputBox = document.querySelector("#inputBox");
const buttonForInput = document.querySelector("#buttonForInput");
const list = document.querySelector("#list");

// This is a global variable representing the entire list for javascript
let todoList = [];

/**
 * This function will send an element of the list to the server
 * @param {Object} element The element to send
 */
async function sendDataToServer(element) {
  // options for the network request
  const options = {
    // the method is POST because we're sending one element
    method: "POST",
    // headers of the request
    headers: {
      // the content-type is set to json because we want to dialogue with
      // the server using JSON format
      "content-type": "application/json",
    },
    // the actual data sent to the server, converted to JSON (a string)
    body: JSON.stringify(element),
  };
  // send the network request to save the element
  const response = await fetch("http://localhost:3000/todolist", options);
  return response;
}

/**
 * Create an element, add it to the array list (todoList)
 * and send the element to the server
 * @param {string} text The text of the note
 */
function addElementToList(text) {
  // The data-schema of our element consists of:
  // - text (string): The actual text of the note
  // - done (bool): True/False based on the element is done or not
  // - createdAt (number, date): Timestamp of when this element is created
  const element = {
    text: text,
    done: false, // This is a todo-list app, therefore the "done" should be false by default
    createdAt: Date.now(), // Date.now() represents the current timestamp
  };
  todoList.push(element);
  sendDataToServer(element);
  return element;
}

/**
 * Add the element created by "addElementToList" to the HTML list
 * @param {Object} element The element to add
 */
function addElementToDoListHtml(element) {
  // The structure of this HTML element is:
  // <li><input type="checkbox" /><span>{TEXT}</span></li>
  // Create the parent element LI
  const li = document.createElement("li");

  // Create the other sub-elements
  const input = document.createElement("input");
  const span = document.createElement("span");

  // Make sure we set the type of the input to checkbox
  input.type = "checkbox";
  // Set the actual "checked" value to element.done
  input.checked = element.done;
  // Add a special dataset attribute to make sure we can refer to this element later
  // when the user clicks on an input checkbox
  input.dataset.createdAt = element.createdAt;
  // Set the inside HTML with the text
  span.innerText = element.text;
  // Appending sub-elements
  li.appendChild(input);
  li.appendChild(span);

  // Append the <LI> to the <UL id="list">
  list.appendChild(li);

  return element;
}

/**
 * Function invoked when the user wants to add an element
 */
function onUserWantsToAddElement() {
  // Prevent adding empty inputs
  if (inputBox.value !== "") {
    // Create the object element based on inputBox.value (the text)
    const el = addElementToList(inputBox.value);
    // Make this element visible in the HTML
    addElementToDoListHtml(el);
    // Clear the input
    inputBox.value = "";
  }
}

// When the user clicks the button...
buttonForInput.addEventListener("click", () => {
  onUserWantsToAddElement();
});

// When the user writes on the keyboard
inputBox.addEventListener("keydown", (event) => {
  // ... and when the key is ENTER...
  if (event.code === "Enter") {
    onUserWantsToAddElement();
  }
});

// Listen for any "change" events in the input checkbox
list.addEventListener("change", (event) => {
  // Make sure we take the actual CLICKED element by using event.target
  const input = event.target;
  // For every element in the list
  todoList.forEach((e) => {
    // If the "createdAt" key match, then we have found our element in the list
    // based on the value in "input.dataset.createdAt"
    if (e.createdAt.toString() === input.dataset.createdAt) {
      // Set this element to done = true|false
      e.done = input.checked;
      // TODO: send the new element to the server
    }
  });
});

/**
 * Get the data of the list from the server
 */
async function getData() {
  // Call the server using GET
  let response = await fetch("http://localhost:3000/todolist", {
    method: "GET",
  });
  // Convert the response to JSON
  let list = await response.json();
  return list;
}

/**
 * Load all the data from server and display them into HTML
 */
async function loadData() {
  // Set the data from the server into the global variable "todoList"
  todoList = await getData();
  console.log("todoList", todoList);
  // For every element in the list
  todoList.forEach((element) => {
    // Display it
    addElementToDoListHtml(element);
  });
}

// When app starts, load the data to show to the user the list
loadData();
