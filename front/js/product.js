// Récupération de l'ID du produit
const getProductId = () => {
  return new URL(location.href).searchParams.get("id");
};

const productId = getProductId();

fetch(`http://localhost:3000/api/products/${productId}`)
.then((response) => {
  return response.json();
})
.then((product) => {
  selectedProduct(product);
  registredProduct(product);
})
.catch((error) => {
  alert(error);
});

// Sélection de l'ID colors
const selectedColor = document.querySelector("#colors");

// Sélection de l'ID quantity
const selectedQuantity = document.querySelector("#quantity");

//  Sélection du bouton Ajouter au panier
const button = document.querySelector("#addToCart");

// Fonction qui récupère les données de la promesse .then(product) pour injecter les valeurs dans le fichier Html
const selectedProduct = (product) => {
  // Intégration des données du produit sélectionné dans la page HTML
  document.querySelector("title").textContent = product.name;
  document.querySelector(".item__img")
  .innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  document.querySelector("#title").textContent += product.name;
  document.querySelector("#price").textContent += product.price;
  document.querySelector("#description").textContent += product.description;

  // Boucle intégrant les différentes couleurs du produit dans le HTML
  for (color of product.colors) {
      let option = document.createElement("option");
      option.setAttribute('value', color);
      option.textContent = color;
      selectedColor.appendChild(option);
  }
}


// Fonction qui enregistre dans un objet les options de l'utilisateur au click sur le bouton ajouter au panier
const registredProduct = (product) => {
  // Écoute de l'évènement click sur le bouton ajouter
  button.addEventListener("click", (event) => {
    event.preventDefault();

    if (selectedColor.value == false) {
      confirm("Veuillez sélectionner une couleur");
      return;
    } else if (selectedQuantity.value == 0) {
      confirm("Veuillez sélectionner le nombre d'articles souhaités");
      return;
    } else if (selectedQuantity.value > 100) {
      confirm('La quantité sélectionnée ne peut pas dépasser les 100 unités');
      return;
    }

    // Récupération des informations du produit sélectionné
    let selectedProduct = {
      id: product._id,
      color: selectedColor.value,
      quantity: parseInt(selectedQuantity.value, 10),
    };
    console.log(selectedProduct);

    /**** Gestion du localStorage ****/

    // Récupération des données du localStorage
    let existingCart = JSON.parse(localStorage.getItem("cart"));

    if (!existingCart) {
      existingCart = [];
    }
  
    // On recherche avec la méthode find() si l'id et la couleur d'un article sont déjà présents
    let item = existingCart.find(
      (item) =>
        item.id == selectedProduct.id && item.color == selectedProduct.color
    );

    // Si oui, on incrémente la nouvelle quantité et la mise à jour du prix total de l'article
    if (item) {
      selectedProduct.quantity = item.quantity + selectedProduct.quantity;
      selectedProduct.totalPrice += item.price * selectedProduct.quantity;
    }
    
    if (selectedProduct.quantity > 100) {
      confirm('La quantité totale de l\'article ne peut pas dépasser les 100 unités.');
      return;
    }

    // Si non, alors on push le nouvel article sélectionné
    existingCart.push(selectedProduct);
    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Le produit a été ajouté au panier");

  });
};