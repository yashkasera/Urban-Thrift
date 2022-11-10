(async () => {
    let name = document.getElementById("name");
    let mobile = document.getElementById("mobile");
    let address = document.getElementById("address");
    let city = document.getElementById("city");
    let state = document.getElementById("state");
    let pin = document.getElementById("pin");
    let email = document.getElementById("email");
    let wallet = document.getElementById("wallet");
    let user = getUser();
    name.value = user.name;
    mobile.value = user.phone;
    address.value = user.address.addressLineOne;
    city.value = user.address.city;
    state.value = user.address.state;
    pin.value = user.address.pincode;
    email.value = user.email;
    wallet.innerHTML = user.wallet;
})();

(async () => {
    let response = await request('/bid/all');
    document.getElementById("count_bid").innerHTML = response.body.length;
})();

(async () => {
    let response = await request('/order');
    document.getElementById("count_orders").innerHTML = response.body.length;
})();

(async () => {
    let response = await request('/product/my/listings');
    document.getElementById("count_listings").innerHTML = response.body.length;
})();

(async () => {
    let response = await request('/watch');
    document.getElementById("count_watchlist").innerHTML = response.body.length;
})();

const updateUser = async () => {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let phone = document.getElementById("mobile").value;
    let addressLineOne = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let pincode = document.getElementById("pin").value;
    const user = {
        name,
        phone,
        address: {
            addressLineOne,
            city,
            state,
            pincode
        }
    }
    try {
        await request('/user', 'POST', user);
        showSnackbar("Profile updated successfully");
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } catch (e) {
        showSnackbar(e.message);
    }
}

const editDetails = () => {
    document.getElementById("name").disabled = false;
    document.getElementById("mobile").disabled = false;
    document.getElementById("address").disabled = false;
    document.getElementById("city").disabled = false;
    document.getElementById("state").disabled = false;
    document.getElementById("pin").disabled = false;
    document.getElementById("updateBtn").style.display = "block";
}