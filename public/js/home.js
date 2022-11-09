(async () => {
    const response = await request('/product/home');
    const latest = response.body.latest
    const mostWatched = response.body.most_watched
    let trendingDiv = document.getElementById("trending");
    let latestDiv = document.getElementById("latest");
    try {
        mostWatched.forEach(product => {
            let x = getProductHtml(product)
            trendingDiv.appendChild(x)
        })
        latest.forEach(product => {
            let x = getProductHtml(product)
            latestDiv.appendChild(x)
        })
        const product = latest[2]
        document.getElementById("card_product_img").src = product.image[0]
        document.getElementById("card_product_name").innerHTML = product.name
        document.getElementById("card_product_desc").innerHTML = product.description
        document.getElementById("card_current_bid").innerHTML = "Rs." + (product.highest_bid_id != null ? product.highest_bid_id['current_amount'] : product.min_bid)
    } catch (e) {
        console.error(e);
    }
})();

const openBrand = (brand) => {
    window.location.href = "category.html?brand=" + brand
}

const openCategory = (category) => {
    window.location.href = "category.html?category=" + category
}