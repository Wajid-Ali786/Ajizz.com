document.addEventListener("DOMContentLoaded", function () {
  // Sample product data
  const products = [
    {
      id: 1,
      title: "Luxury Scent for Men",
      price: 40.0,
      category: "men",
      image: "../src/assets/images/Signature for men1.jpg",
    },
    {
      id: 2,
      title: "Elegant Women’s Fragrance",
      price: 55.0,
      category: "women",
      image: "../src/assets/images/hero-background.jpg",
    },
    {
      id: 3,
      title: "Unisex Floral Essence",
      price: 60.0,
      category: "unisex",
      image: "../src/assets/images/featured-product-1.jpg",
    },
    {
      id: 4,
      title: "Exclusive Night Scent",
      price: 110.0,
      category: "men",
      image: "../src/assets/images/hayya-women-6.jpg",
    },
    {
      id: 5,
      title: "Classic Perfume",
      price: 80.0,
      category: "women",
      image: "../src/assets/images/Hijab for women2.jpg",
    },
    // Add more products as needed
  ];

  // DOM elements
  const productGrid = document.getElementById("productGrid");
  const searchBox = document.getElementById("searchBox");
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");

  // Function to display products in the grid
  function displayProducts(productsToDisplay) {
    productGrid.innerHTML = "";
    if (productsToDisplay.length === 0) {
      productGrid.innerHTML = "<p class='text-center'>No products found.</p>";
      return;
    }
    productsToDisplay.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="card">
          <img src="${product.image}" class="card-img-top" alt="${product.title}">
          <div class="card-body text-center">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">$${product.price.toFixed(2)}</p>
            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      `;
      productGrid.appendChild(col);
    });
  }

  // Function to filter products based on search query, category, and price
  function filterProducts() {
    const searchQuery = searchBox.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;

    const filteredProducts = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery);
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      let matchesPrice = true;
      if (selectedPrice === "low") {
        matchesPrice = product.price >= 0 && product.price <= 50;
      } else if (selectedPrice === "mid") {
        matchesPrice = product.price > 50 && product.price <= 100;
      } else if (selectedPrice === "high") {
        matchesPrice = product.price > 100;
      }
      return matchesSearch && matchesCategory && matchesPrice;
    });

    displayProducts(filteredProducts);
  }

  // Add-to-Cart functionality using event delegation
  productGrid.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart")) {
      const productId = event.target.getAttribute("data-product-id");
      const product = products.find((p) => p.id == productId);
      
      // Retrieve existing cart products or initialize as an empty array
      let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
      const existingProductIndex = cartProducts.findIndex(p => p.id == product.id);
      if (existingProductIndex !== -1) {
        // Increase quantity if the product already exists in the cart
        cartProducts[existingProductIndex].quantity = (cartProducts[existingProductIndex].quantity || 1) + 1;
      } else {
        // Set initial quantity and add the product to the cart
        product.quantity = 1;
        cartProducts.push(product);
      }
      localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
      
      // Save the last added product ID for auto-selecting on the cart page
      localStorage.setItem("lastAddedProductId", product.id);
      
      // Show popup modal with product details and auto-redirect to cart page
      showPopup(product);
    }
  });

  // Function to display a popup modal with product details, then auto-redirect to cart
  function showPopup(product) {
    let modalContainer = document.getElementById("popupModal");
    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.id = "popupModal";
      modalContainer.className = "modal fade";
      modalContainer.tabIndex = -1;
      modalContainer.setAttribute("aria-hidden", "true");
      modalContainer.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Product Added to Cart</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modalContainer);
    }
    const modalBody = modalContainer.querySelector(".modal-body");
    modalBody.innerHTML = `
      <div class="text-center">
        <img src="${product.image}" alt="${product.title}" style="width: 100%; max-width: 200px; height: auto; margin-bottom: 15px;">
        <h5>${product.title}</h5>
        <p>Price: $${product.price.toFixed(2)}</p>\n<p>Quantity: ${JSON.parse(localStorage.getItem('cartProducts')).find(p => p.id == product.id).quantity}</p>
      </div>
    `;
    const popupModal = new bootstrap.Modal(modalContainer);
    popupModal.show();

    // After 3 seconds, hide modal and redirect to cart page
    setTimeout(() => {
      popupModal.hide();
      window.location.href = "../cart page/cart.html";
    }, 3000);
  }

  // Event listeners for filtering/searching
  searchBox.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
  priceFilter.addEventListener("change", filterProducts);

  // Initially display all products
  displayProducts(products);
});
