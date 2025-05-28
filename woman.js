


document.addEventListener('DOMContentLoaded', function() {
  // Load products and initialize modal
  fetch('women.json')
    .then(response => response.json())
    .then(products => {
      const container = document.getElementById('product-list');
      
      if (!container) return; // Safety check

      products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        // Generate color dots HTML
        const colorDots = product.colors.map(color => `
          <span class="color-dot" style="background-color: ${color};"></span>
        `).join('');

        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="color-container">${colorDots}</div>
          <p><strong>Rs. ${product.price.toFixed(2)}</strong></p>
          <button class="view-btn">View More</button>
        `;

        // Change from <a> to <button> to prevent default behavior
        card.querySelector('.view-btn').addEventListener('click', (e) => {
          e.preventDefault();
          openProductModal(product);
        });

        container.appendChild(card);
      });
    })
    .catch(error => console.error('Error loading products:', error));

  // Initialize modal functionality
  initProductModal();
});

function initProductModal() {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  // Close modal when clicking close button
  modal.querySelector('.close-btn').addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Close modal when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Navigation buttons
  modal.querySelector('.slider-btn.left').addEventListener('click', () => {
    showSlide(currentSlideIndex - 1);
  });

  modal.querySelector('.slider-btn.right').addEventListener('click', () => {
    showSlide(currentSlideIndex + 1);
  });
}

let currentSlideIndex = 0;
let currentProduct = null;

function openProductModal(product) {
  currentProduct = product;
  currentSlideIndex = 0;
  
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  // Set product details
  modal.querySelector('#modal-title').textContent = product.name;
  modal.querySelector('#modal-desc').textContent = product.description;
  modal.querySelector('#modal-price').textContent = `Rs. ${product.price.toFixed(2)}`;

  // Set images - use images array if available, otherwise fall back to single image
  const images = product.images || [product.image];
  modal.querySelector('#modal-image').src = images[0];

  // Colors
  const colorsContainer = modal.querySelector('#modal-colors');
  colorsContainer.innerHTML = '';
  product.colors.forEach(color => {
    const dot = document.createElement('span');
    dot.classList.add('color-dot');
    dot.style.backgroundColor = color;
    dot.dataset.color = color;
    dot.addEventListener('click', () => {
      document.querySelectorAll('#modal-colors .color-dot').forEach(dot => {
        dot.classList.remove('selected');
      });
      dot.classList.add('selected');
    });
    colorsContainer.appendChild(dot);
  });

  // Sizes
  const sizesSelect = modal.querySelector('#modal-sizes');
  sizesSelect.innerHTML = '';
  product.sizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    sizesSelect.appendChild(option);
  });

  // Add to cart button
  modal.querySelector('#modal-add-btn').addEventListener('click', () => {
    const selectedColor = document.querySelector('#modal-colors .selected');
    const selectedSize = sizesSelect.value;

    if (!selectedColor || !selectedSize) {
      alert("Please select color and size.");
      return;
    }

    addToCart(currentProduct.id, selectedColor.dataset.color, selectedSize);
    modal.classList.add('hidden');
    showToast('Product added to cart!');
  });

  // Show modal
  modal.classList.remove('hidden');
}

function showSlide(index) {
  if (!currentProduct) return;
  
  const images = currentProduct.images || [currentProduct.image];
  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;
  
  currentSlideIndex = index;
  document.getElementById('modal-image').src = images[currentSlideIndex];
}