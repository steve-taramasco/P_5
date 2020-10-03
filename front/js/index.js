showAll();

async function getTeddies() {
    let url = 'http://localhost:3000/api/teddies/';
    try {
        let response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("error : " + error);
    }
}

async function showAll() {

    const elts = await getTeddies();
    const div_row = document.getElementById('content');
    for (let elt of elts) {

        const article = document.createElement('article');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const h2 = document.createElement('h2');
        const image = document.createElement('img');
        const price = document.createElement('p');
        const describe = document.createElement('p');
        const link = document.createElement('a');

        h2.textContent = elt.name;
        price.textContent = (parseInt(elt.price, 10) / 100) + ",00 €";
        describe.textContent = elt.description;

        article.classList.add("col-md-5", "teddys", "m-3", "px-0", "card", "shadow", "border-0");
        div1.classList.add("card-body");
        div2.classList.add("card-body");
        h2.classList.add("card-title");
        price.classList.add("card-text");
        image.classList.add("card-image-top");
        link.classList.add("product");

        link.setAttribute("href", "./html/produit.html");
        image.setAttribute("id", elt._id);
        image.setAttribute("src", elt.imageUrl);

        div_row.appendChild(article);
        article.appendChild(div1);
        article.appendChild(link)
        link.appendChild(image);
        article.appendChild(div2);
        div1.appendChild(h2);
        div1.appendChild(price);
        div2.appendChild(describe);
    }

    selectElt();
}

function selectElt() {

    const links = document.querySelectorAll('a.product');
    for (let link of links) {

        link.addEventListener('click', function (e) {
            localStorage.setItem("article_id", JSON.stringify(e.target.id));
            link.setAttribute("href", "./html/produit.html?id=" + e.target.id);
        })
    }
}