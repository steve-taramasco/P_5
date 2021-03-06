const form = document.querySelectorAll('input');
const btn = document.getElementById("envoi");
btn.addEventListener('click', () => check());

for (let input of form) { // appel la fonction help //
    input.addEventListener('input', function () {
        help(input);
    });
}

function isValid(input) { // compare avec le resultat attendu //
    const regex_text = /^[A-zÀ-ú\s]{3,}$/;
    const regex_zip = /^[\d]{5}$/;
    const regex_address = /^[a-z0-9 .,]{10,}$/i;
    const regex_mail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i;

    if (input.type == "text" && input.name != "address" && regex_text.test(input.value)) {
        return true;
    } else if (input.type == "email" && regex_mail.test(input.value)) {
        return true;
    } else if (input.type == "number" && regex_zip.test(input.value)) {
        return true;
    } else if (input.name == "address" && regex_address.test(input.value)) {
        return true;
    }
    return false;
}

function help(input) { // affiche l'aide et color le champ
    if (isValid(input)) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        const span = input.nextElementSibling;
        span.style.display = "none";
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        const span = input.nextElementSibling;
        span.style.display = "block";
    }
}

function check() { // verifie la validité du form //
    const firstName = document.getElementById('firstname');
    const lastName = document.getElementById('lastname');
    const address = document.getElementById('address');
    const zip = document.getElementById('zip');
    const city = document.getElementById('city');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const articles = JSON.parse(localStorage.getItem("article_inCart"));

    if (!isValid(firstName) || !isValid(lastName) ||
        !isValid(address) || !isValid(city) ||
        !isValid(zip) || !isValid(email)) {
        message.textContent = "Formulaire invalide ...";
        return;
    }
    confirm();
}

async function order() { // creer un objet et l envoi //
    const articles = JSON.parse(localStorage.getItem("article_inCart"));
    const url = "http://localhost:3000/api/teddies/order";

    const object = {
        contact: {
            firstName: form[0].value,
            lastName: form[1].value,
            address: form[2].value,
            city: form[3].value,
            zip: form[4].value,
            email: form[5].value
        },
        products: []
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        for (let article of articles) {
            object.products.push(article.id);
        }
        const data = await fetch(url, options);
        return data.json();

    } catch (error) {
        message.textContent = "Oops une erreur est survenu :(";
        return;
    }
}

async function confirm() { // recupere la reponse // vide le panier // stocke la reponse //
    try {
        const response = await order();
        localStorage.clear();
        localStorage.setItem("order", response.orderId);
        localStorage.setItem("contact", JSON.stringify(response.contact));
        window.location.replace("../html/confirm.html");

    } catch (error) {
        message.textContent = "Oops une erreur est survenu :(";

    }
}