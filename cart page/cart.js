document.addEventListener("DOMContentLoaded", function() {
    const cartContainer = document.getElementById("cartContainer");
    // Retrieve array of cart products from localStorage
    const cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    // Retrieve the last added product ID
    const lastAddedProductId = localStorage.getItem("lastAddedProductId");

    if (cartProducts.length > 0) {
      cartProducts.forEach(product => {
        const cartCard = document.createElement("div");
        cartCard.className = "card cart-card mb-3";
        cartCard.innerHTML = `
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${product.image}" class="img-fluid rounded-start" alt="${product.title}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">Price: $${product.price.toFixed(2)}</p>
                <p class="card-text">Quantity: ${product.quantity}</p>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="select-${product.id}" ${product.id == lastAddedProductId ? 'checked' : ''}>
                  <label class="form-check-label" for="select-${product.id}">Select this product</label>
                </div>
              </div>
            </div>
         </div>
        `;
        cartContainer.appendChild(cartCard);
      });
    } else {
      cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
    }

    // Clear the last added product ID from localStorage
    localStorage.removeItem("lastAddedProductId");
});
