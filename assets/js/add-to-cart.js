// On page load, retrieve the cart from localStorage (or initialize it)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateMiniCartUI();

// Attach event listeners to all "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    const btnText = this.querySelector('.btn-text');
    const btnSpinner = this.querySelector('.spinner-border');
    
    // Show spinner and hide text
    btnText.classList.add('d-none');
    btnSpinner.classList.remove('d-none');

    // Create a product object using data attributes from the button
    const product = {
      id: this.getAttribute('data-id'),
      name: this.getAttribute('data-name'),
      price: parseFloat(this.getAttribute('data-price')),
      img: this.getAttribute('data-img'),
      quantity: 1
    };

    addToCart(product);

    // Show the spinner for 2 seconds then restore button text and open mini-cart
    setTimeout(() => {
      btnSpinner.classList.add('d-none');
      btnText.classList.remove('d-none');
      showMiniCart();
    }, 2000);
  });
});

// Function to add or update a product in the cart
function addToCart(product) {
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateMiniCartUI();
}

// Function to open the mini cart offcanvas
function showMiniCart() {
  const offcanvasElement = document.getElementById('miniCartOffcanvas');
  const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
  offcanvas.show();
}

// Function to update the mini cart UI
function updateMiniCartUI() {
  const miniCartContent = document.getElementById('miniCartContent');
  const miniCartTotal = document.getElementById('miniCartTotal');
  
  // Clear the current cart display
  miniCartContent.innerHTML = '';

  // If cart is empty
  if (cart.length === 0) {
    miniCartContent.innerHTML = '<p>Your cart is empty.</p>';
    miniCartTotal.textContent = '0.00';
    updateCartBadge();
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    // Build a row for the item with quantity controls, an input, and a delete button
    const itemRow = document.createElement('div');
    itemRow.className = 'd-flex justify-content-between align-items-center mb-3';
    itemRow.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.img}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover;" class="me-3">
        <div>
          <h6 class="mb-0">${item.name}</h6>
          <small>$${item.price.toFixed(2)} x <span class="item-quantity">${item.quantity}</span> = $${lineTotal.toFixed(2)}</small>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <button class="btn btn-sm btn-outline-secondary btn-decrease" data-id="${item.id}">-</button>
        <input type="number" class="form-control quantity-input" data-id="${item.id}" value="${item.quantity}" min="1" style="width: 60px; margin: 0 5px;">
        <button class="btn btn-sm btn-outline-secondary btn-increase" data-id="${item.id}">+</button>
        <button class="btn btn-sm btn-danger btn-delete ms-2" data-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    miniCartContent.appendChild(itemRow);
  });

  miniCartTotal.textContent = total.toFixed(2);
  updateCartBadge(); // Update the badge count in the navbar
  attachQuantityButtonEvents();
  attachQuantityInputEvent();
  attachDeleteButtonEvents();
}

// Function to update the badge on the navbar cart icon
function updateCartBadge() {
  const cartItemCount = document.getElementById('cartItemCount');
  // Sum up all item quantities in the cart
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartItemCount.textContent = totalQuantity;
}

// Attach events to the + and - buttons
function attachQuantityButtonEvents() {
  document.querySelectorAll('.btn-decrease').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const cartItem = cart.find(item => item.id === id);
      if (cartItem) {
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
        } else {
          cart = cart.filter(item => item.id !== id);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateMiniCartUI();
      }
    });
  });

  document.querySelectorAll('.btn-increase').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const cartItem = cart.find(item => item.id === id);
      if (cartItem) {
        cartItem.quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateMiniCartUI();
      }
    });
  });
}

// Attach change event to the quantity input field
function attachQuantityInputEvent() {
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', function() {
      const id = this.getAttribute('data-id');
      let newQuantity = parseInt(this.value);
      if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
        this.value = newQuantity;
      }
      const cartItem = cart.find(item => item.id === id);
      if (cartItem) {
        cartItem.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateMiniCartUI();
      }
    });
  });
}

// Attach events to the delete buttons
function attachDeleteButtonEvents() {
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      cart = cart.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateMiniCartUI();
    });
  });
}
