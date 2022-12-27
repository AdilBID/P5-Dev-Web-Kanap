// Récupération du localStorage
let cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);

// Variable pour stocker les Id de chaque articles présent dans le panier (utilisés pour créer la commande)
let products = [];

// Variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST
let orderId = "";

// Récupération des produits de l'API
async function getProductById(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      return res.json();
    })
    .catch((err) => {
      console.error(err)
    })
    .then(function (response) {
      return response;
    });
}

// Affichage du contenu du panier
const displayCart = async () => {
  const parser = new DOMParser();
  const positionEmptyCart = document.getElementById("cart__items");
  let cartArray = [];

  // Si le localstorage est vide
  if (cart === null || cart === 0) {
    positionEmptyCart.textContent = "Votre panier est vide";
  } else {
    console.log("Des produits sont présents dans le panier");
  }
  
  // Si le localstorage contient des produits
  for (i = 0; i < cart.length; i++) {
    const product = await getProductById(cart[i].id);
    cartArray += `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                  <div class="cart__item__img">
                      <img src="${product.imageUrl}" alt="${product.altTxt}">
                  </div>
                  <div class="cart__item__content">
                      <div class="cart__item__content__description">
                          <h2>${product.name}</h2>
                          <p>${cart[i].color}</p>
                          <p>${product.price}€</p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p id="quantité">
                              Qté : <input data-id= ${cart[i].id} data-color= ${cart[i].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].quantity}>
                            </p>
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p data-id= ${cart[i].id} data-color= ${cart[i].color} class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </article>`;
  }
  
  if (i == cart.length) {
    const displayBasket = parser.parseFromString(cartArray, "text/html");
    positionEmptyCart.appendChild(displayBasket.body);
    calculateTotal();
    changeQuantity();
    deleteItem();
  }
}


displayCart();

// fonction qui calcule le total 
const calculateTotal = () => {
  // déclaration variable en tant que nombre
  let totalArticle = 0;
  // déclaration variable en tant que nombre
  let totalPrice = 0;
  // on pointe l'élément
  const cart = document.querySelectorAll(".cart__item__content");

  let quantity;
  let price;

  // pour chaque élément cart
  cart.forEach((cart) => {
    
    quantity = cart.querySelector('.itemQuantity').value;
    price = cart.querySelector('.cart__item__content__description :nth-child(3)').textContent;

    totalArticle += parseInt(quantity);
    
    totalPrice += parseInt(price) * parseInt(quantity);
  });

  document.getElementById("totalQuantity").textContent = totalArticle;
  document.getElementById("totalPrice").textContent = totalPrice;
}

// Modification de la quantité
const changeQuantity = () => {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((quantityInput) => {
    // Add an oninput event listener to the quantity input
    quantityInput.addEventListener("input", (event) => {
      // Check if the input value is greater than 100
      if (event.target.value > 100) {
        // Set the value to 100
        event.target.value = 100;
        alert("La quantité maximale autorisé est 100");
      }
    });

    // Add a change event listener to update the item's quantity in the cart
    quantityInput.addEventListener("change", (event) => {
      event.preventDefault();
      const inputValue = event.target.value;
      const dataId = event.target.getAttribute("data-id");
      const dataColor = event.target.getAttribute("data-color");
      let cart = localStorage.getItem("cart");
      let items = JSON.parse(cart);

      items = items.map((item) => {
        if (item.id === dataId && item.color === dataColor) {
          item.quantity = inputValue;
        }
        return item;
      });

      // Mise à jour du localStorage
      let itemsStr = JSON.stringify(items);
      localStorage.setItem("cart", itemsStr);
      
      // appeler la fonction pour recalculer le total
      calculateTotal();
    });
  });
}


// Suppression d'un article
const deleteItem = () => {
  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      const deleteId = event.target.getAttribute("data-id");
      const deleteColor = event.target.getAttribute("data-color");
    
      cart = cart.filter(
        (element) => !(element.id == deleteId && element.color == deleteColor)
      );

      // Mise à jour du localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Supprimer la balise article dans le dom
      const element = event.target.closest('article')
      element.remove()
      alert("Article supprimé du panier.");

      // appeler la fonction pour recalculer le total
      calculateTotal();
    });
    
  });
}

/* LE FORMULAIRE */

// sélection du bouton Valider
const btnValidate = document.querySelector("#order");

// Écoute du bouton Valider sur le click pour pouvoir valider le formulaire
btnValidate.addEventListener("click", (event) => {
  event.preventDefault();

  let contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  /* GESTION DU FORMULAIRE */

  // Regex pour le contrôle des champs Prénom, Nom et Ville
  const regExChaineDeCaracteres = (value) => {
    return /^[A-Z][A-Za-z\é\è\ê\-]+$/.test(value);
  };

  // Regex pour le contrôle du champ Adresse
  const regExAdresse = (value) => {
    return /^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/.test(value);
  };

  // Regex pour le contrôle du champ Email
  const regExEmail = (value) => {
    return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(
      value
    );
  };

  // Fonctions de contrôle du champ Prénom:
  const firstNameControl = () => {
    const prenom = contact.firstName;
    let inputFirstName = document.querySelector("#firstName");
    if (regExChaineDeCaracteres(prenom)) {
      inputFirstName.style.backgroundColor = "green";

      document.querySelector("#firstNameErrorMsg").textContent = "";
      return true;
     } else {
      inputFirstName.style.backgroundColor = "#FF6F61";

      document.querySelector("#firstNameErrorMsg").textContent =
        "Champ Prénom de formulaire invalide, ex: Charles";
      return false;
    }
  }

  // Fonctions de contrôle du champ Nom:
  const lastNameControl = () => {
    const nom = contact.lastName;
    let inputLastName = document.querySelector("#lastName");
    if (regExChaineDeCaracteres(nom)) {
      inputLastName.style.backgroundColor = "green";

      document.querySelector("#lastNameErrorMsg").textContent = "";
      return true;
    } else {
      inputLastName.style.backgroundColor = "#FF6F61";

      document.querySelector("#lastNameErrorMsg").textContent =
        "Champ Nom de formulaire invalide, ex: Martin";
      return false;
    }
  }

  // Fonctions de contrôle du champ Adresse:
  const addressControl = () => {
    const adresse = contact.address;
    let inputAddress = document.querySelector("#address");
    if (regExAdresse(adresse)) {
      inputAddress.style.backgroundColor = "green";

      document.querySelector("#addressErrorMsg").textContent = "";
      return true;
    } else {
      inputAddress.style.backgroundColor = "#FF6F61";

      document.querySelector("#addressErrorMsg").textContent =
        "Champ Adresse de formulaire invalide, ex: 45 rue des pyrénées";
      return false;
    }
  }

  // Fonctions de contrôle du champ Ville:
  const cityControl = () => {
    const ville = contact.city;
    let inputCity = document.querySelector("#city");
    if (regExChaineDeCaracteres(ville)) {
      inputCity.style.backgroundColor = "green";

      document.querySelector("#cityErrorMsg").textContent = "";
      return true;
    } else {
      inputCity.style.backgroundColor = "#FF6F61";

      document.querySelector("#cityErrorMsg").textContent =
        "Champ Ville de formulaire invalide, ex: Paris";
      return false;
    }
  }

  // Fonctions de contrôle du champ Email:
  const mailControl = () => {
    const courriel = contact.email;
    let inputMail = document.querySelector("#email");
    if (regExEmail(courriel)) {
      inputMail.style.backgroundColor = "green";

      document.querySelector("#emailErrorMsg").textContent = "";
      return true;
    } else {
      inputMail.style.backgroundColor = "#FF6F61";

      document.querySelector("#emailErrorMsg").textContent =
        "Champ Email de formulaire invalide, ex: exemple@contact.fr";
      return false;
    }
  }


   /* REQUÊTE DU SERVEUR ET POST DES DONNÉES */
   const sendToServer = () => {
    console.log('click')
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({ contact, products }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      // Récupération et stockage de la réponse de l'API (orderId)
      .then((response) => {
        return response.json();
      })
      .then((server) => {
        orderId = server.orderId;
        // Si l'orderId a bien été récupéré, on redirige l'utilisateur vers la page de Confirmation
        if (orderId != "") {
          console.log(orderId);
          location.href = "confirmation.html?id=" + orderId;
          console.log(orderId);
        }
      })
      .catch((err) => {
        alert(err)
      });
  }

  // Contrôle validité formulaire avant de pouvoir passer commande 
  if (
    firstNameControl() &&
    lastNameControl() &&
    addressControl() &&
    mailControl()
  ) {
    sendToServer();
  } else {
    alert("Veuillez bien remplir le formulaire");
  }
});

/* FIN REQUÊTE DU SERVEUR ET POST DES DONNÉES */

// appuyer une seule fois sur le bouton passer la commande