function ifshoe() {
    let size;
    if (document.forms["ADD"]["category"].value === "Footwear") {
        document.getElementById('s').innerHTML = "Foot Size(in EU):";
        size = document.getElementById("size");
        while (size.options.length > 0) {
            size.remove(0);
        }
        size.add(new Option("-- select one --", ""), 0);
        size.add(new Option("4", "4"), 1);
        size.add(new Option("5", "5"), 2);
        size.add(new Option("6", "6"), 3);
        size.add(new Option("7", "7"), 4);
        size.add(new Option("8", "8"), 5);
        size.add(new Option("9", "9"), 6);
        size.add(new Option("10", "10"), 7);
        size.add(new Option("11", "11"), 8);
        document.getElementById("size").disabled = false;
    } else if (document.forms["ADD"]["category"].value === "Bottomwear") {
        document.getElementById('s').innerHTML = "Waist Size(in inches):";
        size = document.getElementById("size");
        while (size.options.length > 0) {
            size.remove(0);
        }
        size.add(new Option("-- select one --", ""), 0);
        size.add(new Option("24", "24"), 1);
        size.add(new Option("26", "26"), 2);
        size.add(new Option("28", "28"), 3);
        size.add(new Option("30", "30"), 4);
        size.add(new Option("32", "32"), 5);
        size.add(new Option("34", "34"), 6);
        size.add(new Option("36", "36"), 7);
        size.add(new Option("38", "38"), 8);
        size.add(new Option("40", "40"), 9);
        size.add(new Option("42", "42"), 10);
        size.add(new Option("44", "44"), 11);
        size.add(new Option("46", "46"), 12);
        size.add(new Option("48", "48"), 13);
        size.add(new Option("50", "50"), 14);
        document.getElementById("size").disabled = false;
    } else if (document.forms["ADD"]["category"].value === "Accessories") {
        document.getElementById('s').innerHTML = "Product Size:";
        document.getElementById("size").value = "invalid";
        document.getElementById("size").disabled = true;
    } else {
        document.getElementById('s').innerHTML = "Product Size:";
        // <select class="form-control" id="type" onchange="ifshoe()">
        size = document.getElementById("size");
        while (size.options.length > 0) {
            size.remove(0);
        }
        size.add(new Option("-- select one --", ""), 0);
        size.add(new Option("XS", "XS"), 1);
        size.add(new Option("S", "S"), 2);
        size.add(new Option("M", "M"), 3);
        size.add(new Option("L", "L"), 4);
        size.add(new Option("XL", "XL"), 5);
        size.add(new Option("XXL", "XXL"), 6);
        size.add(new Option("XXXL", "XXXL"), 7);
        size.add(new Option(">XXXL", ">XXXL"), 8);
        document.getElementById("size").disabled = false;
    }
}

function char() {
    let chars = document.getElementById("chars");
    let description = document.forms["ADD"]["description"].value;
    chars.innerHTML = description.length + " characters - Minimum 50 characters";
}

const uploadFileAsPromise = async (ref, file) => {
    return new Promise(function (resolve, reject) {
        let uploadTask = ref.put(file);
        uploadTask.on('state_changed', function (snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {
            console.log(error)
            document.getElementById("error").innerHTML = error;
            document.getElementById("error").style.display = "block";
            reject("error");
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                resolve(downloadURL);
            });
        });
    });
};

const add = async () => {
    event.preventDefault();
    let name = document.forms["ADD"]["name"].value;
    let min_bid = document.forms["ADD"]["min_bid"].value;
    let category = document.forms["ADD"]["category"].value;
    let color = document.forms["ADD"]["color"].value;
    let size = document.forms["ADD"]["size"].value;
    let size_description = document.forms["ADD"]["size_description"].value;
    let material = document.forms["ADD"]["material"].value;
    let description = document.forms["ADD"]["description"].value;
    let brand = document.forms["ADD"]["brand"].value;
    let product_condition = document.forms["ADD"]["condition"].value;
    let images = document.getElementById("images").files;
    console.log(images);
    if (!name) {
        document.getElementById("error").innerHTML = "Name cannot be empty!";
        document.getElementById("error").style.display = "block";
    } else if (!min_bid || min_bid.length === 0) {
        document.getElementById("error").innerHTML = "Price cannot be empty!";
        document.getElementById("error").style.display = "block";
    } else if (!category) {
        document.getElementById("error").innerHTML = "Category cannot be empty!";
        document.getElementById("error").style.display = "block";
    } else if (!material) {
        document.getElementById("error").innerHTML = "Material cannot be empty!";
        document.getElementById("error").style.display = "block";
    } else if (!description) {
        document.getElementById("error").innerHTML = "Description cannot be empty!";
        document.getElementById("error").style.display = "block";
    } else if (description.length < 50) {
        document.getElementById("error").innerHTML = "Description should be more than 50 characters!";
        document.getElementById("error").style.display = "block";
    } else if (images.length < 2) {
        document.getElementById("error").innerHTML = "Choose atleast 2 images!";
        document.getElementById("error").style.display = "block";
    } else {
        document.getElementById("error").style.display = "none";
        let t = parseInt(min_bid);
        let data = {
            name: name,
            min_bid: t,
            category: category,
            color: color,
            size: size,
            size_description: size_description,
            material: material,
            description: description,
            brand: brand,
            product_condition: product_condition
        };
        let images_array = [];
        const storageRef = firebase.storage().ref();
        showLoading();
        for (let i = 0; i < images.length; i++) {
            let image = images[i];
            let imageRef = storageRef.child(getUser()['_id']).child("" + (new Date().getTime()) + ".jpeg");
            const url = await uploadFileAsPromise(imageRef, image);
            images_array.push(url);
        }
        data.image = images_array;
        let response = await request("/product", "POST", data)
        if (response.status === 201) {
            showSnackbar("Product added successfully! Redirecting to product page...");
            setTimeout(function () {
                window.location.href = "product.html?pid=" + response.body._id;
            }, 2000);
        }
    }
}


(() => {
    if (!isLoggedIn()) {
        alert("You need to be logged in to add a product!");
        window.location.replace("./login.html?redirect=sell_now.html");
    }
})();