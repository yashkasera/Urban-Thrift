(async () => {
    const response = await request("/product/my/listings");
    if (response.status === 200) {
        if (response.body.length === 0) {
            alert("You haven't listed any product!");
            window.location.replace("./home.html");
            return;
        }
        document.getElementById("table_ins").innerHTML = "";
        response.body.forEach(product => {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.setAttribute("data-th", "Product");
            let div = document.createElement("div");
            div.setAttribute("class", "row");
            let div1 = document.createElement("div");
            div1.setAttribute("class", "col-sm-2 hidden-xs");
            let img = document.createElement("img");
            img.setAttribute("src", product.image[0]);
            img.setAttribute("style", "width:100px;height=100px");
            img.setAttribute("alt", "...");
            img.setAttribute("class", "img-responsive");
            div1.appendChild(img);
            let div2 = document.createElement("div");
            div2.setAttribute("class", "col-sm-10");
            let h6 = document.createElement("h6");
            h6.setAttribute("class", "nomargin");
            h6.innerHTML = product.name;
            let p = document.createElement("p");
            p.innerHTML = product.description;
            div2.appendChild(h6);
            div2.appendChild(p);
            div.appendChild(div1);
            div.appendChild(div2);
            td.appendChild(div);
            tr.appendChild(td);
            let size = document.createElement("td");
            size.setAttribute("data-th", "Size");
            size.innerHTML = product.size;
            tr.appendChild(size);
            let watchers = document.createElement("td");
            watchers.setAttribute("data-th", "Watchers");
            watchers.innerHTML = product.watchers;
            tr.appendChild(watchers);
            let td1 = document.createElement("td");
            td1.setAttribute("data-th", "Price");
            td1.innerHTML = `Rs.${product.highest_bid_id != null ? product.highest_bid_id['current_amount'] : product.min_bid}`
            tr.appendChild(td1);
            let td3 = document.createElement("td");
            td3.className = "actions";
            td3.setAttribute("data-th", "");
            let i = document.createElement("i");
            i.className = "fa-solid fa-pen-to-square";
            let view = document.createElement("button");
            view.className = "btn btn-info btn-sm";
            view.onclick = () => {
                window.open("./product.html?pid=" + product._id);
            }
            let i1 = document.createElement("i");
            i1.className = "fa-solid fa-arrow-up-right-from-square";
            view.appendChild(i1);
            td3.appendChild(view);
            tr.appendChild(td3);
            document.getElementById("table_ins").appendChild(tr);
        });

    } else {
        showSnackbar(response.message);
    }
})();