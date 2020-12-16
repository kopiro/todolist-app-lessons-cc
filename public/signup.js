const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  // HTML forms sends the data for us!
  // We need to prevent that because we want to do it
  // with the fetch.... therefore....
  e.preventDefault();

  // Get the data and the values of the form
  const fd = new FormData(form);

  // Send the data using POST to the /register endpoint (URL)
  const response = await fetch("/register", {
    method: "POST",
    body: fd,
  });
  // Get the response from the server in JSON
  const json = await response.json();

  // If the server replied with an error, we have to show to
  // the user a message!
  if (json.error === true) {
    alert(json.message);
  } else {
    // Otherwise, just go the the "success" page
    location.href = "/signup_ok.html";
  }
});
