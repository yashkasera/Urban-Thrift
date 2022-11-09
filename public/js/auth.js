try {
    if (localStorage.getItem("token")) {
        document.getElementById("profile").style.display = "block";
        document.getElementById("cart").style.display = "block";
        document.getElementById("login").style.display = "none";
        document.getElementById("signup").style.display = "none";
    } else {
        document.getElementById("profile").style.display = "none";
        document.getElementById("cart").style.display = "none";
        document.getElementById("login").style.display = "block";
        document.getElementById("signup").style.display = "block";
    }
} catch (e) {
}

const login = async () => {
    try {
        event.preventDefault();
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        const {status, body, message} = await request('/user/login', 'POST', {email, password});
        if (status === 200) {
            localStorage.setItem("token", body.token);
            localStorage.setItem("user", JSON.stringify(body.user));
            if (window.location.search) {
                window.location.href = window.location.search.substring(window.location.search.indexOf("=") + 1);
            } else {
                window.location.href = "home.html";
            }
        } else {
            showSnackbar(message);
        }
    } catch (e) {
        showSnackbar(e.message);
    }
}

const logout = async () => {
    const response = await request('/user/logout', 'POST', {});
    if (response.status === 200) {
        localStorage.clear();
        localStorage.clear();
        showSnackbar("You have been logged out successfully");
        setTimeout(() => {
            window.location.href = "home.html";
        }, 3000);
    } else {
        showSnackbar(response.message);
    }
}

const signup = async () => {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    let addressLineOne = document.getElementById("addressLine1").value;
    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let pincode = document.getElementById("pincode").value;
    const {status, body, message} = await request('/user/signup', 'POST', {
        name,
        email,
        phone,
        password,
        address: {
            addressLineOne,
            city,
            state,
            pincode
        }
    });
    if (status === 201) {
        localStorage.setItem("token", body.token);
        localStorage.setItem("user", JSON.stringify(body.user));
        console.log(body.user);
        showSnackbar("You have been registered successfully");
        addBalanceDialog();
    } else {
        showSnackbar(message);
    }
    return true;
}
// login("deep@gmail.com", "abcd1234");