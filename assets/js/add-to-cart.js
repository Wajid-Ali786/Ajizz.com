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
  const emptyContainer = document.createElement('div');
  emptyContainer.classList.add('empty-cart-container');

  // Display an illustration (update the src to your image or SVG)
  const illustration = document.createElement('img');
  illustration.src = 'assets/images/empty-cart.png'; // Replace with your actual image URL
  illustration.alt = 'Empty Cart';
  illustration.classList.add('empty-cart-illustration');
  emptyContainer.appendChild(illustration);

  // Add a friendly headline
  const headline = document.createElement('h3');
  headline.textContent = 'Your Cart is Empty!';
  headline.classList.add('empty-cart-heading');
  emptyContainer.appendChild(headline);

  // Add a supportive message
  const message = document.createElement('p');
  message.textContent = "It looks like you haven't added any items yet. Let's change that!";
  message.classList.add('empty-cart-text');
  emptyContainer.appendChild(message);

  // Add a call-to-action button
  const shopButton = document.createElement('a');
  shopButton.href = 'index.html'; // Update with your actual product page URL
  shopButton.textContent = 'Browse Products';
  shopButton.classList.add('empty-cart-button');
  emptyContainer.appendChild(shopButton);

  miniCartContent.appendChild(emptyContainer);
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





///    Check   out   button  


/*      
        4. Process the Checkout   */

// Example: Define shipping fee and tax percentage
const SHIPPING_FEE = 200.00; // Rs 200.00
const TAX_RATE = 0.15;       // 15% tax

// Function to populate the checkout modal with cart items and update summary
function populateCheckoutModal() {
  const container = document.getElementById('checkoutItemsContainer');
  container.innerHTML = ''; // Clear previous content
  
  let subtotal = 0;
  let totalItems = 0;
  
  // Check if the cart is empty
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('itemCount').textContent = 0;
    document.getElementById('subtotalAmount').textContent = 'Rs 0.00';
    document.getElementById('shippingFee').textContent = 'Rs 0.00';
    document.getElementById('totalAmount').textContent = 'Rs 0.00';
    document.getElementById('taxInfo').textContent = 'Including Rs 0.00 in taxes';
    return;
  }
  
  cart.forEach(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    totalItems += item.quantity;
    
    // Create item block
    const itemDiv = document.createElement('div');
    itemDiv.className = 'd-flex align-items-center mb-3 border p-2 rounded';
    
    // Checkbox for selection
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input me-2';
    checkbox.checked = true;  // default selected
    checkbox.setAttribute('data-id', item.id);
    
    // Product image
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.name;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.objectFit = 'cover';
    img.className = 'me-2';
    
    // Product details
    const details = document.createElement('div');
    details.innerHTML = `
      <strong>${item.name}</strong><br>
      Rs ${item.price.toFixed(2)} x ${item.quantity} 
      <small>= Rs ${(lineTotal).toFixed(2)}</small>
    `;
    
    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(img);
    itemDiv.appendChild(details);
    container.appendChild(itemDiv);
  });
  
  // Calculate taxes and total
  const taxAmount = subtotal * TAX_RATE;
  const totalAmount = subtotal + SHIPPING_FEE + taxAmount;
  
  // Update summary fields
  document.getElementById('itemCount').textContent = totalItems;
  document.getElementById('subtotalAmount').textContent = `Rs ${subtotal.toFixed(2)}`;
  document.getElementById('shippingFee').textContent = `Rs ${SHIPPING_FEE.toFixed(2)}`;
  document.getElementById('totalAmount').textContent = `Rs ${totalAmount.toFixed(2)}`;
  document.getElementById('taxInfo').textContent = `Including Rs ${taxAmount.toFixed(2)} in taxes`;
}

// Hook up the checkout modal population when the checkout button is clicked
document.getElementById('checkOutButton').addEventListener('click', function() {
  populateCheckoutModal();
});



  document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Gather form data
    const contactInfo = document.getElementById('contactInfo').value.trim();
    const country = document.getElementById('countrySelect').value;
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const address = document.getElementById('address').value.trim();
    const apartment = document.getElementById('apartment').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const saveInfo = document.getElementById('saveInfo').checked;
    
    // Validate required fields (basic validation)
    if (!contactInfo || !country || !firstName || !lastName || !address || !city || !postalCode || !phoneNumber) {
      alert('Please fill in all required fields.');
      return;
    }

    // Create an object with the form data
    const customerData = {
      contactInfo,
      country,
      firstName,
      lastName,
      address,
      apartment,
      city,
      postalCode,
      phoneNumber,
      saveInfo
    };

    // For demonstration: Log the data and simulate order processing
    console.log('Customer Data:', customerData);
    alert('Order confirmed! Check the console for the submitted data.');

    // Here, you can perform further actions such as sending the data to your server via AJAX,
    // clearing the form, or closing the modal if applicable.
    
    // Reset the form (optional)
    event.target.reset();
  });
