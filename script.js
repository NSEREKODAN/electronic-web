// ===== CART FUNCTIONALITY =====
// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('voltCart')) || [];

// Update cart count in header on all pages
function updateCartCount() {
  const countElements = document.querySelectorAll('#cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countElements.forEach(el => {
    if (el) el.textContent = totalItems;
  });
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('voltCart', JSON.stringify(cart));
  updateCartCount();
}

// Add item to cart (called from product buttons)
function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  saveCart();
  alert(`${name} added to cart!`);
}

// Attach event listeners to all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', function() {
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = parseFloat(this.dataset.price);
      addToCart(id, name, price);
    });
  });
  
  // Update count on load
  updateCartCount();

  // ===== CART PAGE SPECIFIC =====
  const cartContainer = document.getElementById('cart-items-container');
  if (cartContainer) {
    renderCartPage();
  }

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const feedback = document.getElementById('form-feedback');
      feedback.textContent = 'Thank you! Your message has been sent. We will get back to you shortly.';
      contactForm.reset();
      setTimeout(() => { feedback.textContent = ''; }, 5000);
    });
  }
});

// ===== RENDER CART PAGE =====
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  const summary = document.getElementById('cart-summary');
  const emptyMsg = document.getElementById('empty-cart-msg');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '';
    if (summary) summary.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = 'block';
    updateCartCount();
    return;
  }
  
  if (summary) summary.style.display = 'block';
  if (emptyMsg) emptyMsg.style.display = 'none';
  
  let html = '';
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">UGX ${item.price.toLocaleString()}</span>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn decrease-qty" data-index="${index}">−</button>
          <span style="font-weight:600; min-width:24px; text-align:center;">${item.quantity}</span>
          <button class="qty-btn increase-qty" data-index="${index}">+</button>
          <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
        </div>
        <div style="font-weight:700; min-width:120px; text-align:right;">UGX ${itemTotal.toLocaleString()}</div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Update total
  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = `UGX ${total.toLocaleString()}`;
  
  // Attach event listeners to quantity buttons
  document.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      saveCart();
      renderCartPage();
    });
  });
  
  document.querySelectorAll('.increase-qty').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      cart[index].quantity += 1;
      saveCart();
      renderCartPage();
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      cart.splice(index, 1);
      saveCart();
      renderCartPage();
    });
  });
  
  // Clear cart button
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (confirm('Remove all items from cart?')) {
        cart = [];
        saveCart();
        renderCartPage();
      }
    });
  }
  
  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) return;
      alert('Thank you for your order! This is a demo checkout. In a real store, you would be redirected to payment.');
      cart = [];
      saveCart();
      renderCartPage();
    });
  }
}

// Re-render cart if on cart page and localStorage changes elsewhere (optional)
window.addEventListener('storage', function(e) {
  if (e.key === 'voltCart') {
    cart = JSON.parse(e.newValue) || [];
    updateCartCount();
    if (document.getElementById('cart-items-container')) {
      renderCartPage();
    }
  }
});