let id = decodeURIComponent(window.location.search);
id = id.substring(5);
if (id.length === 0) {
    window.location.replace("./404.html");
}

function whatsapp() {
    let url = encodeURI(window.location.href);
    window.open("https://wa.me/?text=" + url);
}

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function click1() {
    let n = parseInt(event.srcElement.id.substring(5));
    currentSlide(n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("demo");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    try {
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].classList.add("active");
    } catch (e) {
    }
}

(async () => {
    const response = await request('/product/' + window.location.search.substring(5));
    const product = response.body.product;
    const relatedProducts = response.body.related_products;
    let slideIndex = 1;
    showSlides(slideIndex);
    console.log(product);
    document.getElementById("title").innerHTML = product.name;
    document.getElementById("price").innerHTML = "Rs." + (product.highest_bid_id != null ? product.highest_bid_id["current_amount"] : product.min_bid);
    document.getElementById("size").innerHTML = product.size;
    document.getElementById("size_desc").innerHTML = product.size_description;
    document.getElementById("desc").innerHTML = product.description;
    document.getElementById("material").innerHTML = product.material;
    store_id = product.store_id;
    let acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }

    for (let i = 0; i < product.image.length; i++) {
        let prdImage = document.getElementById('prdImage');
        let div1 = document.createElement('div');
        div1.classList.add("mySlides");
        let div2 = document.createElement('div')
        div2.classList.add("numbertext")
        div2.innerHTML = (i + 1) + "/" + product.image.length;
        let img = document.createElement('img');
        img.setAttribute('src', product.image[i]);
        img.classList.add('prd-dimens');
        div1.appendChild(div2);
        div1.appendChild(img);
        prdImage.appendChild(div1);
        if (i === 1) {
            currentSlide(1);
        }
        let thumbs = document.getElementById('thumbs');
        let div = document.createElement('div');
        div.classList.add('column')
        img = document.createElement('img');
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.margin = "5px";
        img.classList.add('demo', 'cursor', 'img-thumbnail-border');
        img.setAttribute('src', product.image[i]);
        img.setAttribute('id', 'thumb' + (i + 1))
        img.onclick = function () {
            click1();
        }
        div.appendChild(img);
        thumbs.appendChild(div);
    }

    /*---------Related Products----------*/

    relatedProducts.forEach(function (product) {
        document.getElementById("related").appendChild(getProductHtml(product));
    });
    document.getElementById("more").onclick = function () {
        window.location.assign("./category.html");
    };
})();
