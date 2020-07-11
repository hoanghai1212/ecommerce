const fetchData = () =>
{
    axios({
        url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
        method: "GET",
    }).then(function (res)
    {
        console.log(res.data);
        renderProductItem(res.data);
        handleQuantityChange();

    }).catch(function (err)
    {
        console.error(err);
    });
}

const renderProductItem = (productList) =>
{
    let htmlBody = '';
    productList.forEach(product =>
    {
        let htmlRating = '';
        for (let i = 0; i < +product.rating; i++)
        {
            if (i === 5)
            {
                break;
            }
            htmlRating += `<i class="fa fa-star"></i>`;
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
                            <a href="#" class="btn btn-success p-0 w-75">Add to cart</a>
                        </div>
                </div>    
                    
                </div>
            </div>
        `
    });

    document.querySelector(`.product__item-list`).innerHTML += htmlBody;

}

const handleQuantityChange = () =>
{
    document.querySelectorAll(`#quantity`).forEach(el =>
    {
        let descrease = el.parentElement.querySelector("#decrease");
        let increase = el.parentElement.querySelector("#increase");
        let minQuantity = +el.getAttribute(`min`);
        let maxQuantity = +el.getAttribute(`max`);

        descrease.addEventListener("click", () =>
        {
            if (el.value > minQuantity)
            {
                el.value = --el.value;
            }
        })

        increase.addEventListener("click", () =>
        {
            if (el.value < maxQuantity)
            {
                el.value = ++el.value;
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

fetchData();



