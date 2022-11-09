// 'use strict';

const baseURL = "https://urbanthrift.azurewebsites.net/api/v1";
// const baseURL = "https://0c83-42-106-236-77.ngrok.io/api/v1";

// sessionStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzY1NWNhNWE3NDk1ZDQwYzQ3MDczMmQiLCJpYXQiOjE2Njc3NjU1OTV9.wtC5MfYDPcFrU5ffcBGhlyXvcplnVIbyGef-tgNDQ2s");
const isLoggedIn = () => {
    return sessionStorage.getItem("token") != null;
}

const getUser = () => {
    return JSON.parse(sessionStorage.getItem("user"));
}

const showLoading = () => {
    const loader = document.createElement("div");
    loader.className = "progress fixed-top"
    loader.display = "none";
    loader.id = "loading";
    loader.style.borderRadius = "0";
    const inner = document.createElement("div");
    inner.className = "progress-bar progress-bar-striped progress-bar-animated"
    inner.role = "progressbar"
    inner.style.width = '100%';
    loader.appendChild(inner);
    window.document.body.append(loader)
}

const hideLoading = () => {
    document.getElementById("loading").remove(document.getElementById("loading"));
}

function showSnackbar(message) {
    let x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = message;
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

const request = async (endpoint, method = 'GET', body) => {
    try {
        showLoading();
        const response = await fetch(baseURL + endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("token"),
                'Access-Control-Allow-Origin': '*',
                'mode': 'no-cors',
            },
            body: JSON.stringify(body)
        });
        return {
            status: response.status,
            body: await response.json(),
            message: response.message || response.statusText,
        };
    } catch (e) {
        console.log(e);
        showSnackbar(e.message);
        return e;
    } finally {
        hideLoading();
    }
};

const getWatchlistCount = async () => {
    if (!isLoggedIn() || !document.getElementById("watchlist-count")) {
        return;
    }
    const response = await request("/watch");
    if (response.status === 200) {
        document.getElementById("watchlist-count").innerHTML = response.body ? response.body.length : 0;
    } else {
        showSnackbar(response.message);
    }
}

(async () => getWatchlistCount())();


const watchItem = async (id) => {
    if (!isLoggedIn()) {
        showSnackbar("You need to be logged in to watch an item");
        setTimeout(() => {
            window.location.replace("./login.html?redirect=" + window.location.href);
        }, 1000);
        return;
    }
    const response = await request("/watch/" + id, "POST", {});
    if (response.status === 201) {
        await getWatchlistCount();
        showSnackbar("Item added to watchlist!");
    } else if (response.status === 203) {
        showSnackbar("Item already in watchlist!");
    } else {
        showSnackbar(response.message);
    }
}

function getProductHtml(product) {
    let div1 = document.createElement('div');
    div1.setAttribute('href', "./product.html")
    div1.classList.add("col-sm-6", "col-lg-3");
    div1.style.marginBottom = "25px";
    div1.style.padding = "5px";
    let div2 = document.createElement('div');
    div2.classList.add("product-item");
    let div3 = document.createElement('div');
    div3.classList.add("pi-pic");
    let img = document.createElement('img');
    // img.setAttribute('src', product.image[0]);
    img.setAttribute('src', "https://via.placeholder.com/300x300/.png");
    img.onclick = function () {
        productPage(product)
    }
    img.style.cursor = "pointer";
    img.style.width = "100%";
    img.style.height = "auto";
    let div4 = document.createElement('div');
    div4.classList.add("pi-links");
    let a1 = document.createElement('a');
    a1.classList.add('add-card');
    let i1 = document.createElement('i');
    i1.classList.add("fa-solid", "fa-angles-up");
    let span1 = document.createElement('span');
    span1.innerHTML = "BID NOW";
    a1.appendChild(i1);
    a1.appendChild(span1);
    a1.onclick = function () {
        showBidDialog(product)
    };
    a1.style.marginRight = "5px";
    let a2 = document.createElement('a');
    a2.classList.add('watch-now');
    let i2 = document.createElement('i');
    i2.classList.add("fa-solid");
    i2.classList.add("fa-magnifying-glass-chart");
    let span2 = document.createElement('span');
    span2.innerHTML = "WATCH NOW";
    a2.appendChild(i2);
    a2.appendChild(span2);
    a2.onclick = function () {
        watchItem(product._id)
    };
    div4.appendChild(a1);
    div4.appendChild(a2);
    div3.appendChild(img);
    div3.appendChild(div4);
    div2.appendChild(div3);
    div3 = document.createElement('div');
    div3.onclick = function () {
        productPage(product)
    }
    div3.style.cursor = "pointer";
    div3.classList.add("pi-text");
    let h6 = document.createElement('h6');
    h6.innerHTML = `<mark>Rs. ${product.highest_bid_id != null ? product.highest_bid_id['current_amount'] : product.min_bid}</mark>`;
    let a = document.createElement("span");
    a.innerHTML = product.name;
    div3.appendChild(h6);
    div3.appendChild(a);
    div2.appendChild(div3);
    div1.appendChild(div2);
    return div1
}

function productPage(product) {
    window.open("./product.html?pid=" + product._id);
}

(async () => {
    if (document.getElementById("related")) {
        try {
            const {body} = await request("/product/related");
            body.forEach(product => document.getElementById("related").appendChild(getProductHtml(product)));
        } catch (e) {
        }
    }
})();

const createBid = async (pid, max_amount) => {
    if (!isLoggedIn() && confirm("You need to be logged in to create a bid")) {
        window.location.replace("./login.html?redirect=" + window.location.href);
        return;
    }
    const response = await request("/bid/" + pid, "POST", {max_amount})
    if (response.status === 201) {
        showSnackbar("Bid Created Successfully!");
    } else {
        showSnackbar(response.message);
    }
};

const editBid = async (pid, max_amount) => {
    if (!isLoggedIn() && confirm("You need to be logged in to create a bid")) {
        window.location.replace("./login.html?redirect=" + window.location.href);
        return;
    }
    const response = await request("/bid/" + pid, "PATCH", {max_amount})
    if (response.status === 201) {
        showSnackbar("Bid Created Successfully!");
    } else {
        showSnackbar(response.message);
    }
};

const showBidDialog = (product, isEdit = false) => {
    if (!isLoggedIn()) {
        showSnackbar("You need to be logged in to bid");
        setTimeout(() => window.location.replace("./login.html?redirect=" + window.location.href), 1000);
        return;
    }
    if (isLoggedIn() && product.added_by._id === getUser()._inDialog) {
        showSnackbar("You cannot bid on your own item");
        return;
    }
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add("fade");
    modal.setAttribute("id", "bidModal");
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "bidModalLabel");
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "block";
    let modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog");
    modalDialog.classList.add("modal-dialog-centered");
    modalDialog.setAttribute("role", "document");
    let modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    let modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    let modalTitle = document.createElement("h5");
    modalTitle.classList.add("modal-title");
    modalTitle.setAttribute("id", "bidModalLabel");
    modalTitle.innerHTML = isEdit ? 'Edit Bid' : "Create Bid";
    modalHeader.appendChild(modalTitle);
    let modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    let modalBodyForm = document.createElement("form");
    let modalBodyFormGroup = document.createElement("div");
    modalBodyFormGroup.classList.add("form-group");
    let modalBodyFormLabel = document.createElement("label");
    modalBodyFormLabel.setAttribute("for", "bidAmount");
    modalBodyFormLabel.innerHTML = "Enter maximum amount you are willing to pay for this product. We will notify you if someone bids higher than you.";
    let currentMaxBid = document.createElement("p");
    currentMaxBid.innerHTML = `Current highest bid: <mark>Rs. ${product.highest_bid_id != null ? product.highest_bid_id['current_amount'] : product.min_bid}</mark>`;
    let modalBodyFormInput = document.createElement("input");
    modalBodyFormInput.classList.add("form-control");
    modalBodyFormInput.setAttribute("id", "bidAmount");
    modalBodyFormInput.setAttribute("type", "number");
    modalBodyFormInput.setAttribute("placeholder", "Enter maximum bid amount");
    let helpText = document.createElement("small");
    helpText.classList.add("form-text");
    helpText.classList.add("text-muted");
    helpText.innerHTML = "Wallet balance: Rs. " + getUser().wallet;
    modalBodyFormGroup.appendChild(modalBodyFormLabel);
    modalBodyFormGroup.appendChild(currentMaxBid);
    modalBodyFormGroup.appendChild(modalBodyFormInput);
    modalBodyFormGroup.appendChild(helpText);
    modalBodyForm.appendChild(modalBodyFormGroup);
    modalBody.appendChild(modalBodyForm);
    let modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    modalFooter.classList.add("d-flex");
    modalFooter.classList.add("justify-content-between");
    let addToWallet = document.createElement("button");
    addToWallet.classList.add("btn");
    addToWallet.classList.add("btn-info");
    addToWallet.onclick = () => addBalanceDialog();
    addToWallet.innerHTML = "Add to wallet";
    let modalFooterButton = document.createElement("button");
    modalFooterButton.classList.add("btn");
    modalFooterButton.classList.add("btn-primary");
    modalFooterButton.setAttribute("type", "button");
    modalFooterButton.innerHTML = isEdit ? "Edit Bid" : "Create Bid";
    modalFooterButton.onclick = async () => {
        if (modalBodyFormInput.value === "") {
            showSnackbar("Please enter a valid amount");
            return;
        } else if (modalBodyFormInput.value < (product.highest_bid_id != null ? product.highest_bid_id['current_amount'] : product.min_bid)) {
            showSnackbar("New bid amount should be higher than current highest bid!");
            return;
        }
        if (getUser().wallet < modalBodyFormInput.value) {
            showSnackbar("You don't have enough balance to create this bid!");
            return;
        }
        if (isEdit) {
            await editBid(product._id, modalBodyFormInput.value);
        } else {
            await createBid(product._id, modalBodyFormInput.value);
        }
        modalBodyFormInput.value = "";
        bidModal.hide();
        modal.remove()
    }
    modalFooter.appendChild(addToWallet);
    modalFooter.appendChild(modalFooterButton);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    document.body.appendChild(modal);
    let bidModal = new bootstrap.Modal(document.getElementById('bidModal'));
    bidModal.show();
};

const addBalanceDialog = () => {
    //show add balance dialog
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add("fade");
    modal.setAttribute("id", "addBalanceModal");
    modal.setAttribute("tabindex", "-1");
    modal.style.display = "block";
    let modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog");
    modalDialog.classList.add("modal-dialog-centered");
    modalDialog.setAttribute("role", "document");
    let modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    let modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    let modalTitle = document.createElement("h5");
    modalTitle.classList.add("modal-title");
    modalTitle.setAttribute("id", "addBalanceModalLabel");
    modalTitle.innerHTML = "Add Balance";
    modalHeader.appendChild(modalTitle);
    modalContent.appendChild(modalHeader);
    let modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    let modalBodyForm = document.createElement("form");
    let modalBodyFormGroup = document.createElement("div");
    modalBodyFormGroup.classList.add("form-group");
    let modalBodyFormLabel = document.createElement("label");
    modalBodyFormLabel.setAttribute("for", "addBalanceAmount");
    modalBodyFormLabel.innerHTML = "Enter amount you want to add to your balance";
    let modalBodyFormInput = document.createElement("input");
    modalBodyFormInput.classList.add("form-control");
    modalBodyFormInput.setAttribute("id", "addBalanceAmount");
    modalBodyFormInput.setAttribute("type", "number");
    modalBodyFormInput.setAttribute("placeholder", "Enter amount");
    modalBodyFormGroup.appendChild(modalBodyFormLabel);
    modalBodyFormGroup.appendChild(modalBodyFormInput);
    modalBodyForm.appendChild(modalBodyFormGroup);
    modalBody.appendChild(modalBodyForm);
    let modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    let modalFooterButton = document.createElement("button");
    modalFooterButton.classList.add("btn");
    modalFooterButton.classList.add("btn-primary");
    modalFooterButton.setAttribute("type", "button");
    modalFooterButton.innerHTML = "Add Balance";
    modalFooterButton.onclick = async () => {
        if (modalBodyFormInput.value === "") {
            showSnackbar("Please enter a valid amount");
            return;
        }
        await showRazorpay(modalBodyFormInput.value)
        modalBodyFormInput.value = "";
        addBalanceModal.hide();
        modal.remove()
    }
    modalFooter.appendChild(modalFooterButton);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    document.body.appendChild(modal);
    let addBalanceModal = new bootstrap.Modal(document.getElementById('addBalanceModal'), {
        keyboard: false,
    });
    addBalanceModal.show();
};

async function addBalance(amount) {
    const response = await request('/user', 'PATCH', {wallet: amount})
    if (response.status === 200) {
        showSnackbar("Balance added successfully");
        sessionStorage.setItem("user", JSON.stringify(response.body));
        window.location.replace("home.html");
        return true;
    } else {
        showSnackbar("Something went wrong");
        return false;
    }
}

const showRazorpay = async (amount) => {
    //show razorpay dialog
    let options = {
        "key": "rzp_test_0cZR4Q8MkQHXoZ",
        "amount": amount * 100,
        "currency": "INR",
        "name": "Urban Thrift",
        "description": "Test Transaction",
        "image": "img/logo.png",
        // "order_id": "order_DBJOWzybf0sJbb",
        "handler": async function (response) {
            await addBalance(amount);
        },
        "prefill": {
            "name": getUser().name,
            "email": getUser().email,
            "contact": getUser().phone
        },
        "notes": {
            "address": getUser().address
        },
        "theme": {
            "color": "#292929"
        }
    };
    let rzp1 = new Razorpay(options);
    rzp1.open();
};