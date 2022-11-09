let page = 1;

let serialize = function (obj) {
    let str = [];
    for (let p in obj)
        if (obj[p]) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
    return str.join("&");
}

const fetchData = async (query) => {
    let url = '/product/filter?page=' + page
    if (query) {
        url += '&' + query
    }
    document.getElementById("more").style.display = "none";
    const response = await request(url);
    if(response.body.length === 0){
        noProduct();
        return;
    }
    response.body.forEach(product => {
        let x = getProductHtml(product)
        document.getElementById("products").appendChild(x);
    })
};
(async () => {
    await fetchData();
})();

function noProduct() {
    document.getElementById("more").style.display = "block";
}

async function fetchPage(page) {
    document.getElementById("products").innerHTML = "";
    await fetchData(page)
}

let dic = {
    "category": undefined,
    "size": undefined,
    "color": undefined,
    "brand": undefined,
}
let fil = decodeURIComponent(window.location.search);
fil = fil.substring(1);
if (fil != null && fil.length > 0) {
    filter(fil.substring(0, fil.indexOf('=')), fil.substring(fil.indexOf('=') + 1));
} else {
    fetchData();
}

function chip(i) {
    dic[i] = undefined;
    applyFilter();
}

function filter(category, fil) {
    dic[category] = fil;
    let id_filters = document.getElementById("id_filters");
    id_filters.innerHTML = "";
    for (let i in dic) {
        if (dic[i] !== undefined) {
            id_filters.innerHTML += `<div class="chip" style="margin:2px" >
                            ${dic[i]}
                            <span class="closebtn" onclick='this.parentElement.style.display="none";chip("${i}")'>&times;</span>
                          </div>`;
        }
    }
    applyFilter();
}


function applyFilter() {
    let products = document.getElementById("products");
    while (products.firstChild) {
        products.removeChild(products.firstChild);
    }
    console.log(serialize(dic))
    fetchData(serialize(dic));
}