import { Product } from './models/product.js'

const fetchProductList = () =>
{
    axios({
        url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
        method: "GET",
    }).then(res =>
    {
        console.log(res.data);
        renderProductItem(res.data);
    }).catch(err =>
    {
        console.error(err);
    });
}

window.fetchProductById = (id) =>
{
    axios({
        url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
        method: "GET",
    }).then(res =>
    {
        console.log(res.data);
        renderSelectProduct(res.data);
    }).catch(err =>
    {
        console.error(err);
    });
}

window.addProduct = (el) =>
{
    const Name = document.querySelector(`#Name`).value;
    const Type = document.querySelector(`#Type`).value;
    const Description = document.querySelector(`#Description`).value;
    const Image = document.querySelector(`#Image`).value;
    const Rating = document.querySelector(`#Rating`).value;
    const Inventory = document.querySelector(`#Inventory`).value;
    const Price = document.querySelector(`#Price`).value;

    const newProduct = new Product(Name, Image, Description, Price, Inventory, Rating, Type);

    axios({
        url: 'https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products',
        method: 'POST',
        data: newProduct,
    }).then(res =>
    {
        console.log(res);
        fetchProductList();
        el.form.reset();
    }).catch(err =>
    {
        console.log(err);
    })

}

window.deleteProductById = (id) =>
{
    console.log(el);
    axios({
        url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
        method: "DELETE",
    }).then(res =>
    {
        console.log(res);
        fetchProductList();
    }).catch(err =>
    {
        console.log(err);
    })
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
            <tr>
                <td>
                    <figure class="media">
                        <div class="d-flex w-25"><img
                                src="${product.image}"
                                class="img-thumbnail"></div>
                        <figcaption class="media-body">
                            <h4>${product.name}</h4>
                            <p class="mb-1">Type: ${product.type}</p>
                            <p class="text-warning mb-1">${htmlRating}</i>
                            </p>
                        </figcaption>
                    </figure>
                </td>
                <td>
                    <p>${product.description}</p>
                </td>
                <td>
                    <h5>${product.inventory}</h5>
                </td>
                <td>
                    <span>$ ${product.price}</span>
                </td>
                <td >
                    <a href="#" onclick="fetchProductById('${product.id}')" class="btn btn-outline-warning">Update</a>
                    <a style="cursor: pointer" class="btn btn-danger text-white" onclick="deleteProductById('${product.id}')">Remove</a>
                    <a style="cursor: pointer" class="btn btn-primary mx-1 mt-2 d-block text-white" onclick="goToDetail('${product.id}')">Detail</a>
                </td>
            </tr>
        `
    });

    document.querySelector(`#productList`).innerHTML = htmlBody;


}


window.handleUpdateProduct = (el) =>
{
    const id = localStorage.getItem("id");
    const UpdateName = document.querySelector(`#Name`).value;
    const UpdateType = document.querySelector(`#Type`).value;
    const UpdateDescription = document.querySelector(`#Description`).value;
    const UpdateImage = document.querySelector(`#Image`).value;
    const UpdateRating = document.querySelector(`#Rating`).value;
    const UpdateInventory = document.querySelector(`#Inventory`).value;
    const UpdatePrice = document.querySelector(`#Price`).value;
    const updateProduct = new Product(UpdateName, UpdateImage, UpdateDescription, UpdatePrice, UpdateInventory, UpdateRating, UpdateType);

    axios({
        url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
        method: `PUT`,
        data: updateProduct,
    }).then(res =>
    {
        console.log(res);
        fetchProductList();
        document.querySelector('#btnAddNewProduct').style.display = "inline-block"
        el.form.reset();
        el.style.display= "none"

    }).catch(err =>
    {
        console.log(err);
    })

}

window.renderSelectProduct = (product) =>
{
    let updateButton = document.querySelector(`#btnConfirmUpdateProduct`);
    let addButton = document.querySelector(`#btnAddNewProduct`);
    addButton.style.display = "none"
    updateButton.style.display = "inline-block";
    localStorage.setItem("id", product.id);
    document.querySelector(`#Name`).value = product.name;
    document.querySelector(`#Type`).value = product.type;
    document.querySelector(`#Description`).value = product.description;
    document.querySelector(`#Image`).value = product.image;
    document.querySelector(`#Rating`).value = product.rating;
    document.querySelector(`#Inventory`).value = product.inventory;
    document.querySelector(`#Price`).value = product.price;
}

window.goToDetail = (id) =>
{
    window.location.assign('detail.html?id=' + id);
}

fetchProductList()
