const productsContainer = document.querySelector(".products-container");
const showMoreButton = document.querySelector(".btn-load");
const categoriesContainer = document.querySelector(".categories");
const categoriesList = document.querySelectorAll(".category");
const cartBtn = document.querySelector(".cart-label");
const cartMenu = document.querySelector(".cart");
const menuBtn = document.querySelector(".menu-label");
const barsMenu = document.querySelector(".navbar-list");
const overlay = document.querySelector(".overlay");
const productsCart = document.querySelector(".cart-container");
const total = document.querySelector(".total");
const cartBubble = document.querySelector(".cart-bubble");
const buyBtn = document.querySelector(".btn-buy");
const deleteBtn = document.querySelector(".btn-delete");
const succesModal = document.querySelector(".add-modal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const createProductTemplate = (product) => {
  const { id, name, bid, user, userImg, cardImg } = product;
  return `
    <div class="product">
        <img src=${cardImg} alt=${name} />
        <div class="product-info">

            <div class="product-top">
                <h3>${name}</h3>
                <p>Current Bid</p>
            </div>

            <div class="product-mid">
                <div class="product-user">
                    <img src=${userImg} alt="user" />
                    <p>@${user}</p>
                </div>
                <span>${bid} eTH</span>
            </div>


            <div class="product-bot">
                <div class="product-offer">
                    <div class="offer-time">
                        <img src="./assets/img/fire.png" alt="" />
                        <p>05:12:07</p>
                    </div>
                    <button class="btn-add"
                    data-id='${id}'
                    data-name='${name}'
                    data-bid='${bid}'
                    data-img='${cardImg}'>Add</button>
                </div>
            </div>
        </div>
    </div>`;
};

const renderProducts = (productsList) => {
  productsContainer.innerHTML += productsList
    .map(createProductTemplate)
    .join("");
};

const isLastIndexOf = () => {
  return appState.currentProductsIndex === appState.productsLimit - 1;
};

const showMoreProducts = () => {
  appState.currentProductsIndex += 1;
  let { products, currentProductsIndex } = appState;
  renderProducts(products[currentProductsIndex]);
  if (isLastIndexOf()) {
    showMoreButton.classList.add("hidden");
  }
};

const setShowMoreVisibility = () => {
  if (!appState.activeFilter) {
    showMoreButton.classList.remove("hidden");
    return;
  }
  showMoreButton.classList.add("hidden");
};

const changeButtonActiveState = (selectedCategory) => {
  const categories = [...categoriesList];
  categories.forEach((categoriyBtn) => {
    if (categoriyBtn.dataset.category !== selectedCategory) {
      categoriyBtn.classList.remove("active");
      return;
    }
    categoriyBtn.classList.add("active");
  });
};

const changeFilterState = (btn) => {
  appState.activeFilter = btn.dataset.category;
  changeButtonActiveState(appState.activeFilter);
  setShowMoreVisibility(appState.activeFilter);
};

const applyFilter = ({ target }) => {
  if (!isInactiveFilterButton(target)) {
    return;
  }
  changeFilterState(target);
  productsContainer.innerHTML = "";
  if (appState.activeFilter) {
    renderedFilteredProducts();
    appState.currentProductsIndex = 0;
    return;
  }
  renderProducts(appState.products[0]);
};

const isInactiveFilterButton = (element) => {
  return (
    element.classList.contains("category") &&
    !element.classList.contains("active")
  );
};

const renderedFilteredProducts = () => {
  const filteredProducts = productsData.filter((product) => {
    return product.category === appState.activeFilter;
  });
  renderProducts(filteredProducts);
};

const toggleCart = () => {
  cartMenu.classList.toggle("open-cart");
  if (barsMenu.classList.contains("open-menu")) {
    barsMenu.classList.remove("open-menu");
    return;
  }
  overlay.classList.toggle("show-overlay");
};

toggleMenu = () => {
  barsMenu.classList.toggle("open-menu");
  if (cartMenu.classList.contains("open-cart")) {
    cartMenu.classList.remove("open-cart");
    return;
  }
  overlay.classList.toggle("show-overlay");
};

closeOnScroll = () => {
  if (
    !barsMenu.classList.contains("open-menu") &&
    !cartMenu.classList.contains("open-cart")
  ) {
    return;
  }
  barsMenu.classList.remove("open-menu");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
};

const closeOnClick = (e) => {
  if (!e.target.classList.contains("navbar-link")) {
    return;
  }

  barsMenu.classList.remove("open-menu");
  overlay.classList.remove("show-overlay");
};

const closeOnOverlayClick = () => {
  barsMenu.classList.remove("open-menu");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
};

const createCartProductTemplate = (cartProduct) => {
  const { id, name, bid, img, quantity } = cartProduct;
  return `
    <div class="cart-item">
      <img src=${img} alt="Nft del carrito" />
      <div class="item-info">
        <h3 class="item-title">${name}</h3>
        <p class="item-bid">Current bid</p>
        <span class="item-price">${bid} ETH</span>
      </div>
      <div class="item-handler">
        <span class="quantity-handler down" data-id=${id}>-</span>
        <span class="item-quantity">${quantity}</span>
        <span class="quantity-handler up" data-id=${id}>+</span>
      </div>
    </div>
    `;
};

const renderCart = () => {
  if (!cart.length) {
    productsCart.innerHTML = `<p class="empty-msg">No Hay productos en el Carrito</p>`;
    return;
  }
  productsCart.innerHTML = cart.map(createCartProductTemplate);
};

const getCartTotal = () => {
  return cart.reduce((acc, cur) => acc + Number(cur.bid) * cur.quantity, 0);
};

const showCartTotal = () => {
  total.innerHTML = `${getCartTotal().toFixed(2)} eTH`;
};

const renderCartBubble = () => {
  cartBubble.textContent = cart.reduce((acc, cur) => acc + cur.quantity, 0);
};

const disableBtn = (btn) => {
  if (!cart.length) {
    btn.classList.add("disabled");
  } else {
    btn.classList.remove("disabled");
  }
};

const updateCartState = () => {
  saveCart();
  renderCart();
  showCartTotal();
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
  renderCartBubble();
};

const addProduct = (e) => {
  if (!e.target.classList.contains("btn-add")) {
    return;
  }
  const product = createProductData(e.target.dataset);
  if (isExisistingCartProduct(product)) {
    addUnitToProduct(product);
    showModalSucces("Se agregó una Unidad el Producto al Carrito");
  } else {
    createCartProduct(product);
    showModalSucces("El producto se ha agregado al Carrito");
  }
  updateCartState();
};

const showModalSucces = (msg) => {
  succesModal.classList.add("active-modal");
  succesModal.textContent = msg;
  setTimeout(() => {
    succesModal.classList.remove("active-modal");
  }, 1500);
};

const addUnitToProduct = (product) => {
  cart = cart.map((cartProduct) => {
    return cartProduct.id === product.id
      ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
      : cartProduct;
  });
};

const createCartProduct = (product) => {
  cart = [...cart, { ...product, quantity: 1 }];
};

const isExisistingCartProduct = (product) => {
  return cart.find((item) => item.id === product.id);
};

const createProductData = (product) => {
  const { id, name, bid, img } = product;
  return { id, name, bid, img };
};

const handleQuantity = (e) => {
  if (e.target.classList.contains("down")) {
    handleMinusBtnEvent(e.target.dataset.id);
  } else if (e.target.classList.contains("up")) {
    handlePlusBtnEvent(e.target.dataset.id);
  }
  updateCartState();
};

const handleMinusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);
  if (existingCartProduct.quantity === 1) {
    if (window.confirm("Desea Eliminar el Producto del Carrito?")) {
      removeProductFromCart(existingCartProduct);
    }
    return;
  }
  subtractProductUnit(existingCartProduct);
};

const subtractProductUnit = (existingProduct) => {
  cart = cart.map((product) => {
    return product.id === existingProduct.id
      ? { ...product, quantity: Number(product.quantity) - 1 }
      : product;
  });
};

const removeProductFromCart = (existingProduct) => {
  cart = cart.filter((product) => product.id !== existingProduct.id);
  updateCartState();
};

const handlePlusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);
  addUnitToProduct(existingCartProduct);
};

const resetCartItems = () => {
  cart = [];
  updateCartState();
};

const completeCartAction = (confirmMsg, succesMsg) => {
  if (!cart.length) {
    return;
  }
  if (window.confirm(confirmMsg)) {
    resetCartItems();
    alert(succesMsg);
  }
};

const completeBuy = () => {
  completeCartAction("¿Desea Completar su Compra?", "¡Gracias Por su Compra!");
};

const deleteCart = () => {
  completeCartAction(
    "¿Desea Vaciar el Carrito?",
    "No hay Productos en el Carrito"
  );
};

const init = () => {
  renderProducts(appState.products[0]);
  showMoreButton.addEventListener("click", showMoreProducts);
  categoriesContainer.addEventListener("click", applyFilter);
  cartBtn.addEventListener("click", toggleCart);
  menuBtn.addEventListener("click", toggleMenu);
  window.addEventListener("scroll", closeOnScroll);
  barsMenu.addEventListener("click", closeOnClick);
  overlay.addEventListener("click", closeOnOverlayClick);
  document.addEventListener("DOMContentLoaded", renderCart);
  document.addEventListener("DOMContentLoaded", showCartTotal);
  productsContainer.addEventListener("click", addProduct);
  productsCart.addEventListener("click", handleQuantity);
  buyBtn.addEventListener("click", completeBuy);
  deleteBtn.addEventListener("click", deleteCart);
  renderCartBubble();
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
};

init();
