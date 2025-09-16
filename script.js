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
            image: "/placeholder.svg?height=500&width=500",
            thumbnail: "/placeholder.svg?height=100&width=100",
            onSale: true
        },
        "black-large": {
            id: "black-large",
            color: "black",
            size: "large",
            price: 329.99,
            originalPrice: 429.99,
            stock: 5,
            image: "/placeholder.svg?height=500&width=500",
            thumbnail: "/placeholder.svg?height=100&width=100",
            onSale: true
        },
        "white-standard": {
            id: "white-standard",
            color: "white",
            size: "standard",
            price: 299.99,
            originalPrice: null,
            stock: 8,
            image: "/placeholder.svg?height=500&width=500",
            thumbnail: "/placeholder.svg?height=100&width=100",
            onSale: false
        },
        "white-large": {
            id: "white-large",
            color: "white",
            size: "large",
            price: 329.99,
            originalPrice: null,
            stock: 0,
            image: "/placeholder.svg?height=500&width=500",
            thumbnail: "/placeholder.svg?height=100&width=100",
            onSale: false
        },
        "blue-standard": {
            id: "blue-standard",
            color: "blue",
            size: "standard",
            price: 319.99,
            originalPrice: null,
            stock: 12,
            image: "/placeholder.svg?height=500&width=500",
            thumbnail: "/placeholder.svg?height=100&width=100",
            onSale: false
        },
        "blue-large": {
            id: "blue-large",
            color: "blue",
            size: "large",
            price: 349.99,
            originalPrice: null,
            stock: 7,
            image: "/placeholder.svg?height=500&width=500",
            thumbnail: "/placeholder.svg?height=100&width=100",
            onSale: false
        }
    }
};

let cart = [];
let currentVariant = productData.variants["black-standard"];

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    updateProductDisplay();
    updateCartCount();
});

// Update product display based on selected variant
function updateVariant() {
    const colorSelect = document.getElementById('colorSelect');
    const sizeSelect = document.getElementById('sizeSelect');
    const variantKey = `${colorSelect.value}-${sizeSelect.value}`;

    if (productData.variants[variantKey]) {
        currentVariant = productData.variants[variantKey];
        updateProductDisplay();

        // Update thumbnail active state
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

// Update the product display with current variant data
function updateProductDisplay() {
    // Update main image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = currentVariant.image;
    mainImage.alt = `${productData.title} - ${currentVariant.color} ${currentVariant.size}`;

    // Update price
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

    // Update stock info and button state
    const stockInfo = document.getElementById('stockInfo');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const stockBadge = document.getElementById('stockBadge');
    const quantityInput = document.getElementById('quantity');

    if (currentVariant.stock === 0) {
        stockInfo.textContent = 'Out of stock';
        stockInfo.style.color = 'var(--destructive)';
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Out of Stock';
        stockBadge.style.display = 'block';
        quantityInput.max = 0;
    } else {
        stockInfo.textContent = `${currentVariant.stock} in stock`;
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
        quantityInput.max = currentVariant.stock;
    }

    // Validate current quantity
    validateQuantity();
}

// Change main image when thumbnail is clicked
function changeMainImage(thumbnail, index) {
    const mainImage = document.getElementById('mainImage');
    const colorSelect = document.getElementById('colorSelect');

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');

    // Update color select based on thumbnail index
    const colors = ['black', 'white', 'blue'];
    colorSelect.value = colors[index];

    // Update variant
    updateVariant();
}

// Quantity control functions
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

    // Handle invalid input
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    } else if (quantity > maxQuantity) {
        quantity = maxQuantity;
    }

    quantityInput.value = quantity;

    // Update quantity buttons state
    const decreaseBtn = document.querySelector('.quantity-btn[onclick="decreaseQuantity()"]');
    const increaseBtn = document.querySelector('.quantity-btn[onclick="increaseQuantity()"]');

    decreaseBtn.disabled = quantity <= 1;
    increaseBtn.disabled = quantity >= maxQuantity || maxQuantity === 0;
}