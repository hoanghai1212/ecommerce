const fetchProduct = () =>
{
    const id = window.location.search.split("=")[1];
    axios({
        url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
        method: "GET",
    }).then(res =>
    {
        console.log(res.data);
        renderProductDetail(res.data);
    }).catch(err =>
    {
        console.error(err);
    });
};

var renderProductDetail = (product) =>
{
    let htmlBody = '';
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
                    <div class="d-flex justify-content-center">
                        <img src="${product.image}" class="w-25">
                        <div>
                            <h4>${product.name}</h4>
                            <p class="mb-1">Type: ${product.type}</p>
                            <p class="text-warning mb-1">${htmlRating}</i></p>
                            <h6>Description: ${product.description}</h6>
                            <h6>Inventory: ${product.inventory}</h6>
                            <span>Price: $ ${product.price}</span>
                        </div>
                    </div>
            `
    document.querySelector("#productDetail").innerHTML = htmlBody;
}

fetchProduct();