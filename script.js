const productData = {
    title: "Premium Wireless Headphones",
    description: "Experience premium sound quality with our flagship wireless headphones featuring advanced noise cancellation technology, 30-hour battery life, and superior comfort for all-day listening.",
    variants: {
        "black-standard": {
            id: "black-standard",
            color: "black",
            size: "standard",
            price: 299.99,
            originalPrice: 399.99,
            stock: 10,
            image: "./image/headphone-black-small.png",
            thumbnail: "./image/headphone-black-small.png",
            onSale: true
        },
        "black-large": {
            id: "black-large",
            color: "black",
            size: "large",
            price: 329.99,
            originalPrice: 429.99,
            stock: 5,
            image: "./image/headphone-black.png",
            thumbnail: "./image/headphone-black.png",
            onSale: true
        },
        "white-standard": {
            id: "white-standard",
            color: "white",
            size: "standard",
            price: 299.99,
            originalPrice: null,
            stock: 8,
            image: "./image/headphone-white-small.png",
            thumbnail: "./image/headphone-white-small.png",
            onSale: false
        },
        "white-large": {
            id: "white-large",
            color: "white",
            size: "large",
            price: 329.99,
            originalPrice: null,
            stock: 0,
            image: "./image/headphone-white.png",
            thumbnail: "./image/headphone-white.png",
            onSale: false
        },
        "blue-standard": {
            id: "blue-standard",
            color: "blue",
            size: "standard",
            price: 319.99,
            originalPrice: null,
            stock: 12,
            image: "./image/headphone-blue-small.png",
            thumbnail: "./image/headphone-blue-small.png",
            onSale: false
        },
        "blue-large": {
            id: "blue-large",
            color: "blue",
            size: "large",
            price: 349.99,
            originalPrice: null,
            stock: 7,
            image: "./image/headphone-blue.png",
            thumbnail: "./image/headphone-blue.png",
            onSale: false
        }
    }
};

let cart = [];
let currentVariant = productData.variants["black-standard"];

document.addEventListener('DOMContentLoaded', function () {
    updateProductDisplay();
    updateCartCount();
});

function updateVariant() {
    const colorSelect = document.getElementById('colorSelect');
    const sizeSelect = document.getElementById('sizeSelect');
    const variantKey = `${colorSelect.value}-${sizeSelect.value}`;

    if (productData.variants[variantKey]) {
        currentVariant = productData.variants[variantKey];
        updateProductDisplay();
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.remove('active');
            if ((colorSelect.value === 'black' && index === 0) ||
                (colorSelect.value === 'white' && index === 1) ||
                (colorSelect.value === 'blue' && index === 2)) {
                thumb.classList.add('active');
            }
        });
    }
}

// Helper function to get available stock for current variant
function getAvailableStock(variantId) {
    const cartQuantity = cart.find(item => item.variantId === variantId)?.quantity || 0;
    const originalStock = productData.variants[variantId].stock;
    return Math.max(0, originalStock - cartQuantity);
}

function updateProductDisplay() {
    // Update main image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = currentVariant.image;
    mainImage.alt = `${productData.title} - ${currentVariant.color} ${currentVariant.size}`;

    const currentPrice = document.getElementById('currentPrice');
    const originalPrice = document.getElementById('originalPrice');
    const savings = document.getElementById('savings');
    const saleBadge = document.getElementById('saleBadge');

    currentPrice.textContent = `$${currentVariant.price.toFixed(2)}`;

    if (currentVariant.onSale && currentVariant.originalPrice) {
        originalPrice.textContent = `$${currentVariant.originalPrice.toFixed(2)}`;
        originalPrice.style.display = 'inline';
        const savingsAmount = currentVariant.originalPrice - currentVariant.price;
        savings.textContent = `Save $${savingsAmount.toFixed(2)}`;
        savings.style.display = 'block';
        saleBadge.style.display = 'block';
    } else {
        originalPrice.style.display = 'none';
        savings.style.display = 'none';
        saleBadge.style.display = 'none';
    }

    const stockInfo = document.getElementById('stockInfo');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const stockBadge = document.getElementById('stockBadge');
    const quantityInput = document.getElementById('quantity');

    // Get available stock (original stock minus items in cart)
    const availableStock = getAvailableStock(currentVariant.id);

    if (availableStock === 0) {
        stockInfo.textContent = 'Out of stock';
        stockInfo.style.color = 'var(--destructive)';
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Out of Stock';
        stockBadge.style.display = 'block';
        quantityInput.max = 0;
        quantityInput.value = 1;
    } else {
        stockInfo.textContent = `${availableStock} in stock`;
        stockInfo.style.color = 'var(--muted-foreground)';
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
        </svg>
        Add to Cart
    `;
        stockBadge.style.display = 'none';
        quantityInput.max = availableStock;

        // Ensure current quantity doesn't exceed available stock
        if (parseInt(quantityInput.value) > availableStock) {
            quantityInput.value = availableStock;
        }
    }

    validateQuantity();
}

function changeMainImage(thumbnail, index) {
    const mainImage = document.getElementById('mainImage');
    const colorSelect = document.getElementById('colorSelect');

    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');

    const colors = ['black', 'white', 'blue'];
    colorSelect.value = colors[index];

    updateVariant();
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentQuantity = parseInt(quantityInput.value);
    const maxQuantity = parseInt(quantityInput.max);

    if (currentQuantity < maxQuantity) {
        quantityInput.value = currentQuantity + 1;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentQuantity = parseInt(quantityInput.value);

    if (currentQuantity > 1) {
        quantityInput.value = currentQuantity - 1;
    }
}

function validateQuantity() {
    const quantityInput = document.getElementById('quantity');
    let quantity = parseInt(quantityInput.value);
    const maxQuantity = parseInt(quantityInput.max);
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    }
    quantityInput.value = quantity;
    const decreaseBtn = document.querySelector('.quantity-btn[onclick="decreaseQuantity()"]');
    const increaseBtn = document.querySelector('.quantity-btn[onclick="increaseQuantity()"]');

    decreaseBtn.disabled = quantity <= 1;
    increaseBtn.disabled = quantity >= maxQuantity || maxQuantity === 0;
}

function showNotification(title, message, duration = 3000) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
    <svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
      <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
      <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
    </svg>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, duration);
}

function showAlert(title, message, duration = 4000) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.innerHTML = `
    <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
    <div class="alert-content">
      <div class="alert-title">${title}</div>
      <div class="alert-message">${message}</div>
    </div>
    <button class="alert-close" onclick="this.parentElement.remove()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('show');
    }, 100);

    setTimeout(() => {
        if (alert.parentElement) {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, 300);
        }
    }, duration);
}

function addToCart() {
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value);
    console.log('Adding to cart:', currentVariant, 'Quantity:', quantity);

    const availableStock = getAvailableStock(currentVariant.id);

    if (availableStock === 0) {
        const variantText = `${currentVariant.color} • ${currentVariant.size}`;
        showAlert(
            'Out of Stock',
            `Sorry, ${productData.title} (${variantText}) is currently out of stock. Please select a different variant or check back later.`
        );
        return;
    }

    if (isNaN(quantity) || quantity <= 0) {
        showAlert(
            'Invalid Quantity',
            'Please select a valid quantity before adding to cart.'
        );
        return;
    }

    if (quantity > availableStock) {
        const variantText = `${currentVariant.color} • ${currentVariant.size}`;
        showAlert(
            'Quantity Exceeds Stock',
            `You tried to add ${quantity}, but only ${availableStock} available for ${productData.title} (${variantText}).`
        );
        return;
    }

    const existingItemIndex = cart.findIndex(item =>
        item.variantId === currentVariant.id
    );

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            variantId: currentVariant.id,
            title: productData.title,
            color: currentVariant.color,
            size: currentVariant.size,
            price: currentVariant.price,
            quantity,
            image: currentVariant.thumbnail
        });
    }

    // Update stock display immediately after adding to cart
    updateProductDisplay();
    updateCartDisplay();
    updateCartCount();

    const variantText = `${currentVariant.color} • ${currentVariant.size}`;
    const quantityText = quantity === 1 ? '1 item' : `${quantity} items`;
    showNotification(
        'Added to Cart!',
        `${quantityText} (${variantText}) added to your cart`
    );

    toggleCart();
    quantityInput.value = 1;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');

    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        cartFooter.style.display = 'none';
        return;
    }

    cartFooter.style.display = 'block';

    cartItems.innerHTML = cart.map((item, index) => {
        const availableStock = getAvailableStock(item.variantId);
        const maxQuantity = availableStock + item.quantity; // Current quantity + remaining stock
        return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-variant">${item.color} • ${item.size}</div>
            <div class="cart-item-controls">
              <div class="cart-item-quantity">
                <button class="cart-quantity-btn" onclick="updateCartItemQuantity(${index}, -1)">-</button>
                <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1" max="${maxQuantity}" onchange="setCartItemQuantity(${index}, this.value)">
                <button class="cart-quantity-btn" onclick="updateCartItemQuantity(${index}, 1)" ${item.quantity >= maxQuantity ? 'disabled' : ''}>+</button>
              </div>
              <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
          <button class="remove-item" onclick="removeCartItem(${index})" aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
    }).join('');

    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${subtotal.toFixed(2)}`;
}

function updateCartItemQuantity(index, change) {
    const item = cart[index];
    const availableStock = getAvailableStock(item.variantId);
    const maxQuantity = availableStock + item.quantity; // Current quantity + remaining stock
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        removeCartItem(index);
    } else if (newQuantity <= maxQuantity) {
        cart[index].quantity = newQuantity;
        updateCartDisplay();
        updateCartCount();

        // Update product display if this variant is currently selected
        if (item.variantId === currentVariant.id) {
            updateProductDisplay();
        }
    }
}

function setCartItemQuantity(index, value) {
    const item = cart[index];
    const availableStock = getAvailableStock(item.variantId);
    const maxQuantity = availableStock + item.quantity; // Current quantity + remaining stock
    let quantity = parseInt(value);

    if (isNaN(quantity) || quantity <= 0) {
        removeCartItem(index);
    } else {
        if (quantity > maxQuantity) {
            quantity = maxQuantity;
        }
        cart[index].quantity = quantity;
        updateCartDisplay();
        updateCartCount();

        // Update product display if this variant is currently selected
        if (item.variantId === currentVariant.id) {
            updateProductDisplay();
        }
    }
}

function removeCartItem(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartCount();

    // Update product display if this variant is currently selected
    if (removedItem.variantId === currentVariant.id) {
        updateProductDisplay();
    }
}

document.addEventListener('click', function (event) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBtn = document.querySelector('.cart-btn');

    if (!cartSidebar.contains(event.target) && !cartBtn.contains(event.target) && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
});