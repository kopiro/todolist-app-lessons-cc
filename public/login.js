const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const response = await fetch("/login", {
    method: "POST",
    body: fd,
  });
  const json = await response.json();

  if (json.error === true) {
    alert(json.message);
  } else {
    location.href = "/todolist.html";
  }
});
