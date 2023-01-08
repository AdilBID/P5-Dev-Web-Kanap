//---------APPEL A L'API QUI CONTIENT LES PRODUITS---------//

//fetch récupère les données depuis l'url de l'API : 
fetch('http://localhost:3000/api/products')
// première promesse .then qui va récupérer la réponse (en staged)
// en la transformant en json pour faciliter l'intérprétation par le navigateur :
.then(res => res.json())
// deuxième promesse .then qui va afficher (en online)
// les données contenues dans ma fonction showProducts :
.then(data => { 
    showProducts(data);
})
// j'ajoute un message au cas où le serveur ne répond pas
.catch(_error => {
    alert('Le serveur ne répond pas');
});

//---------J'AFFICHE TOUS LES PRODUITS---------

const showProducts = (data) => {
// pour ma variable product de ma promise .then data
    for (product of data) {
        // trouver l'élément #items dans index.html...
        const itemCard = document.getElementById('items');
        // ... et le modifier avec le contenu entre ``
        // le + sert à ajouter tous les éléments tant qu'il y en a
        itemCard.innerHTML +=`
        <a href="./product.html?id=${product._id}">
        <article>
        <img src="${product.imageUrl}" alt="${product.altTxt}">
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
        </article>
        </a>
    `;
    }
}
