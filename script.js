alert("JavaScript est bien relié au HTML !");

let cart = [];
let total = 0;

function addToCart(productName, price) {
    if (!productName || isNaN(price) || price <= 0) {
        console.error("Données du produit invalides.");
        return;
    }

    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price, quantity: 1 });
    }

    total += price;
    updateCartDisplay();
    saveCart();
}

function removeFromCart(index) {
    if (cart[index]) {
        total -= cart[index].price * cart[index].quantity;
        cart.splice(index, 1);
        updateCartDisplay();
        saveCart();
    }
}

function updateCartDisplay() {
    const cartItemsList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItemsList.innerHTML = "";

    if (cart.length === 0) {
        cartItemsList.innerHTML = "<li>Votre panier est vide.</li>";
    } else {
        cart.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} - ${item.quantity} x ${item.price} F`;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Supprimer";
            removeButton.addEventListener("click", () => removeFromCart(index));
            listItem.appendChild(removeButton);

            cartItemsList.appendChild(listItem);
        });
    }

    cartTotal.textContent = `Total : ${total} F`;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", total);
}

function loadCart() {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedTotal = parseFloat(localStorage.getItem("total")) || 0;

    cart = savedCart;
    total = savedTotal;
    updateCartDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    document.getElementById("add-to-cart").addEventListener("click", () => {
        const productName = document.getElementById("product-name").value;
        const productPrice = parseFloat(document.getElementById("product-price").value);
        addToCart(productName, productPrice);




        paypal.Buttons({
            createOrder: function(data, actions) {
                // Créer une commande PayPal avec le montant total
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '10000' // Remplacez ici par le total de votre panier, exemple 10 000 F
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                // Valider la commande après l'approbation du paiement
                return actions.order.capture().then(function(details) {
                    alert('Transaction réussie par ' + details.payer.name.given_name);
                    // Ici, vous pouvez enregistrer la commande et envoyer une confirmation
                    // Redirigez l'utilisateur vers une page de confirmation ou d'achèvement
                });
            }
        }).render('#paypal-button-container'); // Rendre le bouton dans le conteneur
        
    });
});
