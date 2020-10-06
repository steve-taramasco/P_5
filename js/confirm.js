const contact = JSON.parse(localStorage.getItem("contact"));
const orderNb = localStorage.getItem("order");
const first = document.getElementById("firstName");
const orderId = document.getElementById("orderId");
const mail = document.getElementById("mail");
const message = document.getElementById("message");

message.textContent = "merci " + contact.firstName + " !";
first.textContent = contact.firstName;
orderId.textContent = orderNb;
mail.textContent = contact.email;