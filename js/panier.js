inCart();

async function getPrice(id) { // recupere le prix d un element //
    try {
        const url = 'http://localhost:3000/api/teddies/' + id;
        const response = await fetch(url);
        const data = await response.json();
        return data.price;
    } catch (error) {
        console.error("erreur de connexion à l'api : " + error);
        message.textContent = "Oops erreur de connexion :/";
        return;
    }
}

async function inCart() { // recupere les elements du panier //
    const elts = JSON.parse(localStorage.getItem('article_inCart'));
    showCart(elts);
}

async function showCart(elts) { // affiche les elements // et affiche feedback //
    const message = document.getElementById("message");
    const content = document.querySelector('tbody');
    const sous_total = document.getElementById('sous-total');
    let totaux = 0;

    try {
        for (let elt of elts) {
            const price = await getPrice(elt.id);
            const tr = document.createElement('tr');
            const td_close = document.createElement('td');
            const td_img = document.createElement('td');
            const td_color = document.createElement('td');
            const td_qty = document.createElement('td');
            const td_total = document.createElement('td');
            const total = document.createElement('span');
            const suppr = document.createElement('button');
            const link = document.createElement('a');
            const down = document.createElement('button');
            const up = document.createElement('button');
            const qty = document.createElement('span');

            suppr.innerHTML = "<ion-icon name='close-circle-outline'></ion-icon>";
            link.innerHTML = "<img src='" + elt.image + "' > ";
            td_color.textContent = elt.color;
            down.innerHTML = "<ion-icon name='chevron-back-circle-outline'></ion-icon>";
            qty.textContent = elt.inCart;
            up.innerHTML = "<ion-icon name='chevron-forward-circle-outline'></ion-icon>";
            total.textContent = (parseInt(price * elt.inCart) / 100) + ",00 €";
            totaux += (parseInt(price * elt.inCart) / 100);
            sous_total.textContent = totaux + ",00 €";

            link.setAttribute('href', "../html/produit.html");

            td_close.classList.add('col-1');
            td_img.classList.add('col-3');
            td_color.classList.add('col-2');
            td_qty.classList.add('col-3');
            td_total.classList.add('col-3');

            suppr.classList.add('button');
            down.classList.add('button');
            qty.classList.add('qty');
            up.classList.add('button');
            total.classList.add('price');
            tr.classList.add('d-flex');

            content.appendChild(tr);
            tr.appendChild(td_close);
            tr.appendChild(td_img);
            tr.appendChild(td_color);
            tr.appendChild(td_qty);
            tr.appendChild(td_total);
            td_total.appendChild(total);
            td_close.appendChild(suppr);
            td_img.appendChild(link);
            td_qty.appendChild(down);
            td_qty.appendChild(qty);
            td_qty.appendChild(up);

            link.addEventListener('click', function () {
                localStorage.setItem('article_id', JSON.stringify(elt.id));
            })
            suppr.addEventListener('click', function () {
                trash(elt, tr, total);
            })
            up.addEventListener('click', function () {
                updateQty(elt, qty, +1);
            })
            down.addEventListener('click', function () {
                updateQty(elt, qty, -1, tr, total);
            })
        }
    } catch (error) {
        orderBtn()
        return;
    }

    message.textContent = "votre panier !";
    localStorage.setItem('total_price', totaux);
    orderBtn();
}

function orderBtn() { // active et desactive le bouton d envoi // affiche un feedback //
    const message = document.getElementById("message");
    const elts = JSON.parse(localStorage.getItem('article_inCart'));
    const order = document.getElementById('order');

    if (!elts || !elts.length) {
        message.textContent = "Panier vide :/";
        order.setAttribute('disabled', true);
        return
    } else {
        order.addEventListener('click', function () {
            window.location.href = "./form.html";
        })
    }
}

function trash(elt, line, prixLine) { // supprime un element + sa qty + son prix // update le prix //

    const elts = JSON.parse(localStorage.getItem('article_inCart'));
    let sous_total = parseInt(localStorage.getItem("total_price"));
    const order = document.getElementById('order');
    let prixElt = parseInt(prixLine.textContent);
    let new_price = sous_total - prixElt;
    const newArticles = elts.filter(function (el) {
        if ((el.id && el.color) != (elt.id && elt.color)) {
            return true
        }
    })
    localStorage.setItem("article_inCart", JSON.stringify(newArticles));
    localStorage.setItem("total_price", new_price);
    document.getElementById('sous-total').innerText = new_price + ",00 €";

    line.remove();
    orderBtn();
    showAlert();

}

function showAlert() { // affiche un feddback 2 sec //
    const alert = document.getElementById("alert");
    alert.classList.add("show");
    setTimeout(function () {
        alert.classList.remove("show");
    }, 2000);
}

function updateQty(elt, qty, nb, line, prixLine) { // incremete et decremente la qty // supprime un article //

    const articles = JSON.parse(localStorage.getItem('article_inCart'));
    const indice = articles.findIndex(element => element.id === elt.id && element.color === elt.color);

    if (articles[indice].inCart === 1 && parseInt(nb) == -1) {

        trash(elt, line, prixLine);

    } else {

        articles[indice].inCart += parseInt(nb);
        qty.innerHTML = articles[indice].inCart;
        localStorage.setItem('article_inCart', JSON.stringify(articles));
        updatePrice(articles, indice, nb);
    }
}

async function updatePrice(articles, indice, nb) { // incremente et decremente le prix total et sous total //

    sous_total = parseInt(localStorage.getItem("total_price"));
    const price = await getPrice(articles[indice].id);
    const elt_price = parseInt(price) / 100;
    let totaux = document.querySelectorAll('span.price');

    if (parseInt(nb) == -1) {
        sous_total -= elt_price;
    } else {
        sous_total += elt_price;
    }

    totaux[indice].innerHTML = parseInt(price * articles[indice].inCart) / 100 + ",00 €";
    document.getElementById('sous-total').innerText = sous_total + ",00 €";
    localStorage.setItem("total_price", sous_total);
}