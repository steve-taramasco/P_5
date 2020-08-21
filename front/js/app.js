// recupération des données //

const request = new XMLHttpRequest();
request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {

        response = JSON.parse(this.responseText)
        newArticle(response);
        details(response);
    }
}
request.open('GET', 'http://localhost:3000/api/teddies', true);
request.send();


// fonction contenu //

function newArticle(elts) {

    const div_row = document.getElementById('content-top');

    for (let i = 0; i < elts.length; i++) {

        const div_col = document.createElement('div');
        const article = document.createElement('article');
        const div = document.createElement('div');
        const h2 = document.createElement('h2');
        const image = document.createElement('img');
        const price = document.createElement('p');
        const button = document.createElement('a');

        h2.textContent = elts[i].name;
        price.textContent = elts[i].price + " €";
        button.textContent = "En savoir plus";

        article.classList.add("col-12", "col-md-5", "teddys", "m-3", "px-0", "card", "shadow");
        div.classList.add("card-body");
        h2.classList.add("card-title");
        price.classList.add("card-text");
        button.classList.add("btn", "btn-info");

        button.setAttribute("href", "./front/produit.html");
        image.setAttribute("src", elts[i].imageUrl);
        image.classList.add("card-image-top");

        div_row.appendChild(article);
        article.appendChild(div);
        article.appendChild(image)
        div.appendChild(h2);
        div.appendChild(price);
        div.appendChild(button);
    }
}


function details(elts) {

    let liens = document.querySelectorAll('a.btn');

    for (let i = 0; i < liens.length; i++) {
        let lien = liens[i];
        let elt = elts[i];

        lien.addEventListener('click', function (e) {

            //e.preventDefault();
            console.log(elt.name + " " + elt._id);

        })
    }
}