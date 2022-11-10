(async () => {
    if (!isLoggedIn()) {
        showSnackbar("You are not logged in");
        setTimeout(() => {
            window.location.href = "login.html?redirect=" + window.location.href;
        }, 2000);
    }
    const response = await request('/order');
    if (response.status === 200) {
        //create jquerydatatable
        let table = document.getElementById("table_ins");
        response.body.forEach(order => {
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            td1.innerHTML = new Date(order.createdAt).toLocaleDateString();
            let td2 = document.createElement("td");
            td2.innerHTML = order.product_id.name;
            let td3 = document.createElement("td");
            td3.innerHTML = order.product_id.highest_bid_id.current_amount;
            let td4 = document.createElement("td");
            td4.innerHTML = order._id;
            let td5 = document.createElement("td");
            td5.innerHTML = order.status;
            let td6 = document.createElement("td");
            let button = document.createElement("button");
            button.className = "btn btn-info btn-sm";
            let i = document.createElement("i");
            i.className = "fa-solid fa-arrow-up-right-from-square";
            button.appendChild(i);
            button.onclick = () => {
                console.log(order._id)
                window.open("product.html?pid=" + order.product_id._id);
            }
            td6.appendChild(button);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            table.appendChild(tr);
        });
        document.getElementById("table_ins").innerHTML = table.innerHTML;
    }
})();