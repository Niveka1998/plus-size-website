document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart UI
  loadCart();
});

async function loadCart() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Failed to load products');
    const products = await response.json();
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-container');
    
    if (!container) {
      console.error('Cart container element not found');
      return;
    }

    renderCart(products, cart, container);
    updateCartCount();
    
  } catch (error) {
    console.error('Error:', error);
    const container = document.getElementById('cart-container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>Failed to load cart contents. Please try again later.</p>
          <button onclick="loadCart()">Retry</button>
        </div>
      `;
    }
  }
}

function renderCart(products, cart, container) {
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <a href="home.html" class="continue-shopping">Continue Shopping</a>
      </div>
    `;
    return;
  }

  let totalPrice = 0;
  const fragment = document.createDocumentFragment();

  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    if (!product) return;

    const itemTotal = product.price * cartItem.quantity;
    totalPrice += itemTotal;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    itemDiv.innerHTML = `
      <div class="cart-item-img">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="cart-item-details">
        <h3>${product.name}</h3>
        <p><strong>Size:</strong> ${cartItem.size || 'N/A'}</p>
        <p><strong>Color:</strong> 
          <span class="color-display" style="background-color: ${cartItem.color || 'transparent'};"></span>
          ${cartItem.color || 'N/A'}
        </p>
        <p><strong>Price:</strong> Rs. ${product.price.toFixed(2)}</p>
        <div class="quantity-control">
          <button class="qty-decrement" data-id="${product.id}">-</button>
          <input type="number" min="1" value="${cartItem.quantity}" 
                 class="qty-input" data-id="${product.id}" />
          <button class="qty-increment" data-id="${product.id}">+</button>
        </div>
        <p class="item-total"><strong>Total:</strong> Rs. ${itemTotal.toFixed(2)}</p>
        <button class="remove-btn" data-id="${product.id}">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    `;

    fragment.appendChild(itemDiv);
  });

  container.appendChild(fragment);

  // Add totals section without the checkout button
  const totalsDiv = document.createElement('div');
  totalsDiv.classList.add('cart-totals');
  totalsDiv.innerHTML = `
    <div class="subtotal">
      <span>Subtotal:</span>
      <span>Rs. ${totalPrice.toFixed(2)}</span>
    </div>
    <div class="shipping">
      <span>Shipping:</span>
      <span>Calculated at checkout</span>
    </div>
    <div class="total">
      <span>Estimated Total:</span>
      <span>Rs. ${totalPrice.toFixed(2)}</span>
    </div>
  `;
  container.appendChild(totalsDiv);

  // Add event listeners
  setupCartEventListeners();
}

function setupCartEventListeners() {
  // Quantity input changes
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', handleQuantityChange);
  });

  // Increment buttons
  document.querySelectorAll('.qty-increment').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      input.value = parseInt(input.value) + 1;
      input.dispatchEvent(new Event('change'));
    });
  });

  // Decrement buttons
  document.querySelectorAll('.qty-decrement').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
        input.dispatchEvent(new Event('change'));
      }
    });
  });

  // Remove buttons
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', handleRemoveItem);
  });
}

function handleQuantityChange(e) {
  const newQty = parseInt(e.target.value);
  const productId = parseInt(e.target.dataset.id);

  if (isNaN(newQty)) {
    e.target.value = 1;
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(i => i.id === productId);

  if (itemIndex !== -1) {
    cart[itemIndex].quantity = Math.max(1, newQty); // Ensure quantity is at least 1
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast(`Quantity updated`);
    loadCart(); // Refresh the cart display
  }
}

function handleRemoveItem(e) {
  const productId = parseInt(e.target.dataset.id);
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(i => i.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  showToast('Item removed from cart');
  loadCart(); // Refresh the cart display
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}