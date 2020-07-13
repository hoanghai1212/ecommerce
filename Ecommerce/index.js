let ProductList = [];
let ShoppingCartList = JSON.parse(localStorage.getItem('shoppingCartList'));
if (!ShoppingCartList) ShoppingCartList = [];

const fetchData = () =>
{
    axios({
        url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
        method: "GET",
    }).then(function (res)
    {
        console.log(res.data);
        ProductList = res.data;
    }).then(() =>
    {
        renderProductItem(ProductList);
        renderFilterOption(ProductList);
        renderCartItem(ShoppingCartList);
    }).catch(function (err)
    {
        console.error(err);
    });
}

const renderProductItem = (ProductList) =>
{
    let htmlBody = '';
    ProductList.forEach(product =>
    {
        let htmlRating = '';
        for (let i = 0; i < +product.rating; i++)
        {
            if (i === 5)
            {
                break;
            }
            htmlRating += `<i class="fa fa-star text-warning"></i>`;
        }

        htmlBody += `
            <div class="card product__item mb-4 mx-3">
                <div class="card-body d-flex flex-column">
                <div class= "d-flex align-items-center">
                    <img class="pr-3" src="${product.image}" alt="a">
                    <div class="product__info w-100 pr-2 text-left">
                        <h5 class="cart-title product__name">${product.name}</h5>
                        <div class="product__rating">${htmlRating}</div>
                        <div class="product__brand text-muted pb-2 mb-2">Brand: <a href="#">${product.type}</a> |
                            <a href="#">More from ${product.type}</a></div>
                        <div class="cart-text product__description mb-2">${product.description}
                        </div>
                        <div class="product__price mb-5">$${product.price}</div>
                    </div>
                </div>
                <div class= "d-flex align-items-center mt-3">
                        <div class="product__quantity w-50">
                            <label class="m-0 mr-3 font-weight-bold" for="quantity">Q.ty:</label>
                            <span id="decrease" class="text-center">
                                <i class="fa fa-minus" aria-hidden="true"></i>
                            </span>
                            <input class="text-center" id="quantity" type="number" min="0" max="${product.inventory}" value="1">
                            <span id="increase" class="text-center">
                                <i class="fa fa-plus" aria-hidden="true"></i>
                            </span>
                        </div>
                        <div class="product__purchase w-50">
                            <a onclick="handleAddToCart(this,${product.id})" class="btn btn-success p-0 w-75 product__add-to-cart">Add to cart</a>
                        </div>
                </div>    
                    
                </div>
            </div>
        `
    });

    document.querySelector(`.product__item-list`).innerHTML = htmlBody;
    handleQuantityChange(".product__container");

    document.querySelectorAll(`.product__add-to-cart`).forEach(el =>
    {
        let maxQuantity = +el.parentElement.parentElement.querySelector(`#quantity`).getAttribute("max");
        if (maxQuantity === 0)
        {
            el.classList.add("disabled");
        }
    })
}

const handleSortEvent = (ProductList) =>
{
    const ascBtn = document.querySelector(`#ascSortBtn`);
    const descBtn = document.querySelector(`#descSortBtn`);
    descBtn.classList.remove("bg-info");
    ascBtn.classList.remove("bg-info");

    ascBtn.addEventListener(`click`, () =>
    {
        descBtn.classList.remove("bg-info");
        ascBtn.classList.add("bg-info");
        let ProductListAsc = ProductList.sort((nextProduct, currentProduct) =>
        {
            let currentProductName = currentProduct.name.toLowerCase();
            let nextProductName = nextProduct.name.toLowerCase();

            if (currentProductName > nextProductName) return -1;
            if (currentProductName < nextProductName) return 1;
            return 0;
        });
        renderProductItem(ProductListAsc);
    })

    descBtn.addEventListener(`click`, () =>
    {
        ascBtn.classList.remove("bg-info");
        descBtn.classList.add("bg-info");
        let ProductListDesc = ProductList.sort((nextProduct, currentProduct) =>
        {
            let currentProductName = currentProduct.name.toLowerCase();
            let nextProductName = nextProduct.name.toLowerCase();

            if (currentProductName < nextProductName) return -1;
            if (currentProductName > nextProductName) return 1;
            return 0;
        });
        renderProductItem(ProductListDesc);
    })
};

const renderFilterOption = (ProductList) =>
{
    const productFilter = document.querySelector(`#productFilter`);
    let filteredProductList = ProductList;
    let htmlBody = '<a class="dropdown-item" href="#">All</a>';
    let UniqProductType = [];

    ProductList.forEach(product =>
    {
        UniqProductType.push(product.type);
    });
    UniqProductType = [...new Set(UniqProductType)];

    UniqProductType.forEach(type =>
    {
        htmlBody += `<a class="dropdown-item" href="#">${type}</a>`;
    })
    productFilter.querySelector(`.dropdown-menu`).innerHTML = htmlBody;

    const productItemList = productFilter.querySelectorAll(`.dropdown-item`);
    productItemList.forEach(item =>
    {
        item.addEventListener(`click`, () =>
        {
            let activeItem = item.parentElement.querySelector(`.active`);
            if (activeItem) activeItem.classList.remove(`active`);
            item.classList.add("active")
            productFilter.querySelector(`.dropdown-toggle`).innerHTML = item.innerHTML;

            item.innerHTML !== "All" ? filteredProductList = ProductList.filter(product => product.type.toLowerCase() === item.innerHTML.toLowerCase()) : filteredProductList = ProductList;
            renderProductItem(filteredProductList);
            handleSortEvent(filteredProductList);
        })
    });
    handleSortEvent(filteredProductList);
}

const handleQuantityChange = (root) =>
{
    document.querySelector(root).querySelectorAll(`#quantity`).forEach(el =>
    {
        let descrease = el.parentElement.querySelector("#decrease");
        let increase = el.parentElement.querySelector("#increase");
        let minQuantity = +el.getAttribute(`min`);
        let maxQuantity = +el.getAttribute(`max`);

        if (maxQuantity === 0)
        {
            el.value = 0;
            descrease.classList.add("disabled");
            increase.classList.add("disabled");
            el.style.pointerEvents = "none";
        }

        descrease.addEventListener("click", () =>
        {
            if (el.value > minQuantity)
            {
                increase.classList.remove("disabled");
                el.value = --el.value;

            } else
            {
                descrease.classList.add("disabled");
            }

        })

        increase.addEventListener("click", () =>
        {
            if (el.value < maxQuantity)
            {
                descrease.classList.remove("disabled");
                el.value = ++el.value;
            } else
            {
                increase.classList.add("disabled");
            }

        })

        el.addEventListener("change", () =>
        {
            if (el.value > maxQuantity || el.value < minQuantity || el.value === "")
            {
                el.value = 1;
            }
        })
    })
}


const renderCartItem = (AddToCartList) =>
{
    let htmlBody = '';
    let totalCost = 0;
    AddToCartList.forEach(product =>
    {
        htmlBody += `
                <div class="shopping__item d-flex pb-3 mb-5 mx-2">
                    <img src="${product.product.image}" alt="a">
                    <div class="d-flex flex-column justify-content-between w-100">
                        <div class="product__info">
                            <h5 class="shopping__name mb-0">${product.product.name}</h5>
                        </div>
                        <div class="product__quantity d-flex justify-content-between align-items-center">
                            <div class="shopping__price">$${product.product.price} </div>
                            <i class="fa fa-times"></i>
                            <div>
                                <span onclick='updateCartQuantity(this,${product.product.id}, "sub")' id="decrease" class="text-center">
                                    <i class="fa fa-minus" aria-hidden="true"></i>
                                </span>
                                <input class="text-center" id="quantity" type="number" min="0" max="${product.product.inventory}" value="${product.quantity}">
                                <span onclick='updateCartQuantity(this,${product.product.id})' id="increase" class="text-center">
                                    <i class="fa fa-plus" aria-hidden="true"></i>
                                </span>
                            </div>
                            <div onclick="handleRemoveItemFromCart(${product.product.id})" class="btn btn-danger p-0 shopping__cancel-btn"><i class="fa fa-times"></i></div>
                        </div>
                    </div>
                </div>
        `
        totalCost += (product.quantity * product.product.price);
    });
    
    document.querySelector(`#totalCost`).innerHTML = ` $ ${totalCost}`;
    document.querySelector(`.shopping__item-list`).innerHTML = htmlBody;
    handleQuantityChange(".shopping-cart");
}

const handleAddToCart = (elem, id) =>
{
    const productToAdd = ProductList.find(product => +product.id === id);
    const productInCart = ShoppingCartList.find(item => item.product.id === productToAdd.id);
    let quantity = elem.parentElement.parentElement.querySelector(`#quantity`);
    let quantityValue = +quantity.value;
    let maxQuantity = +quantity.getAttribute("max");

    if (quantityValue !== 0)
    {
        if (productInCart && productInCart.quantity < maxQuantity)
        {
            ((productInCart.quantity += quantityValue) > maxQuantity) ? productInCart.quantity = maxQuantity : '';
        } else if (!productInCart)
        {
            let addToCartItem = {
                product: productToAdd,
                quantity: quantityValue,
            }
            ShoppingCartList.push(addToCartItem);
        }
    }

    localStorage.setItem('shoppingCartList', JSON.stringify(ShoppingCartList));
    renderCartItem(ShoppingCartList);
}

const handleRemoveItemFromCart = (id) =>
{
    const productInCart = ShoppingCartList.find(item => +item.product.id === +id);
    ShoppingCartList = ShoppingCartList.filter(el => el !== productInCart);
    localStorage.setItem('shoppingCartList', JSON.stringify(ShoppingCartList));
    renderCartItem(ShoppingCartList);
}

const updateCartQuantity = (elem, id, action = "add") =>
{
    const productInCart = ShoppingCartList.find(item => +item.product.id === +id);
    let quantity = elem.parentElement.querySelector(`#quantity`);
    let updateQuantityValue = +quantity.value;
    let maxQuantity = +quantity.getAttribute("max");

    if (action === "add" && updateQuantityValue < maxQuantity)
    {
        updateQuantityValue = ++updateQuantityValue;
        productInCart.quantity = updateQuantityValue;
        localStorage.setItem('shoppingCartList', JSON.stringify(ShoppingCartList));
    } else if (action === "sub" && updateQuantityValue > 0)
    {
        updateQuantityValue = --updateQuantityValue;
        if (updateQuantityValue === 0) handleRemoveItemFromCart(id);
        productInCart.quantity = updateQuantityValue;
        localStorage.setItem('shoppingCartList', JSON.stringify(ShoppingCartList));
    }

    renderCartItem(ShoppingCartList);
}

const handleCheckOut = () =>
{
    ShoppingCartList = [];
    renderCartItem(ShoppingCartList);
    localStorage.setItem('shoppingCartList', JSON.stringify(ShoppingCartList));
}



fetchData();
