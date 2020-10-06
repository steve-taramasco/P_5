showOne();

async function getId() { // recupere l'id et creer une url //
    const id = JSON.parse(localStorage.getItem("article_id"));
    const url = 'http://localhost:3000/api/teddies/' + id;
    return url;
}

async function getTeddy() { // recupere l'element // ou affiche feedback //
    const message = document.getElementById('message');
    try {
        const url = await getId();
        const response = await fetch(url);
        const data = await response.json()
        return data;
    } catch (error) {
        console.error("erreur de connexion à l'api : " + error);
        message.textContent = "Oops erreur de connexion :/";
        return;
    }
}

async function showOne() { // affiche l element // ou affiche feedback //
    const message = document.getElementById('message');
    const elt = await getTeddy();
    const div_row = document.getElementById('content');
    const product = document.createElement('article');
    const details = document.createElement('article');
    const divProduct = document.createElement('div');
    const divDetails = document.createElement('div');
    const h2 = document.createElement('h2');
    const image = document.createElement('img');
    const price = document.createElement('p');
    const describe = document.createElement('p');
    const button = document.createElement('a');
    const label = document.createElement('label');
    const form = document.createElement('select');
    const colors = elt.colors;

    try {
        for (let color of colors) {
            let option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            form.appendChild(option);
        }
    } catch (e) {
        message.textContent = "Oops une erreur est survenu :(";
        return false;
    }

    h2.textContent = "Description :";
    price.textContent = "Prix : " + (parseInt(elt.price, 10) / 100) + ",00 €";
    button.textContent = "Ajouter au panier";
    describe.textContent = elt.description;
    message.textContent = elt.name;

    image.setAttribute("src", elt.imageUrl);
    button.setAttribute("id", "add");
    form.setAttribute("id", "liste");
    label.setAttribute("for", "form-control");

    h2.classList.add('h5');
    product.classList.add("col-md-5", "teddys", "m-3", "px-0", "card", "shadow", "border-0");
    divProduct.classList.add("card-body");
    image.classList.add("card-image-top");
    details.classList.add("col-md-5", "teddys", "m-3", "px-0");
    button.classList.add("btn", "btn-info");
    label.classList.add("mr-2");
    form.classList.add("form-control", "form-control-sm");

    div_row.appendChild(product);
    div_row.appendChild(details);
    product.appendChild(divProduct);
    divProduct.appendChild(image);
    details.appendChild(divDetails);
    divDetails.appendChild(h2)
    divDetails.appendChild(describe);
    divDetails.appendChild(price);
    divDetails.appendChild(label);
    label.appendChild(form);
    divDetails.appendChild(button);

    button.addEventListener("click", function () {
        createObject(elt);
        showAlert();
    })
}

function showAlert() { // affiche un feedback en cas d'ajout d'articles //
    const alert = document.getElementById("alert");
    alert.classList.add("show");

    setTimeout(function () {
        alert.classList.remove("show");
    }, 2000);

}

function createObject(elt) { // creer un objet //
    const liste = document.getElementById('liste');
    const color = liste.options[liste.selectedIndex].value;
    const product = {
        name: elt.name,
        price: elt.price,
        id: elt._id,
        image: elt.imageUrl,
        color: color,
        inCart: 0
    }
    setItems(product);
}

function setItems(product) { // ajoute le produit au panier // ou incremente l objet //
    const articles = JSON.parse(localStorage.getItem("article_inCart")) || [];
    const indice = articles.findIndex(element => element.id === product.id && element.color === product.color);

    if (indice != -1) {
        articles[indice].inCart += 1;
    } else {
        product.inCart += 1;
        articles.push(product);
    }

    localStorage.setItem("article_inCart", JSON.stringify(articles));
}