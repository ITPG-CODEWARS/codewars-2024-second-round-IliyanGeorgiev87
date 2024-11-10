document.addEventListener('DOMContentLoaded', function () {
    const shortenButton = document.getElementById('shortenButton');
    if (shortenButton) {  
        shortenButton.addEventListener('click', shortenURL);
    }

    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveQRCode);
    }
});

function shortenURL() {
    //вземи стойности от форм
    const urlInput = document.getElementById('urlInput').value.trim();
    const aliasInput = document.getElementById('aliasInput').value.trim();
    let lengthInput = parseInt(document.getElementById('lengthInput').value);
    let expiryInput = parseInt(document.getElementById('expiryInput').value);
    let maxUsesInput = parseInt(document.getElementById('maxUsesInput').value);

    //проверка
    if (!urlInput) {
        alert('Моля въведете валиден URL адрес!');
        return;
    }

    //създаване на съкратен URL
    const shortened = generateShortenedURL(urlInput, aliasInput, lengthInput);

    //Съхраняване на стойности ЛОКАЛНО
    const linkData = {
        originalUrl: urlInput,
        shortenedUrl: shortened,
        expiryTime: expiryInput > 0 ? Date.now() + expiryInput * 60000 : 0,  // Expiry time in ms
        maxUses: maxUsesInput > 0 ? maxUsesInput : Infinity,
        usesLeft: maxUsesInput > 0 ? maxUsesInput : Infinity
    };

    localStorage.setItem(shortened, JSON.stringify(linkData));

    //изписване на стойности
    const outputDiv = document.getElementById('output');
    const shortenedLink = document.getElementById('shortenedLink');

    shortenedLink.href = shortened;
    shortenedLink.textContent = shortened;
    generateQRCode(shortened);

    outputDiv.style.display = 'block';
}

function generateShortenedURL(url, alias, length) {
    let base64String = btoa(url).substring(0, length);

    //използване на алиас
    if (alias) {
        base64String = alias; //използвай псевдоним
    } else {
        // създване на линк
        base64String = generateRandomString(length);
    }

    //свързване на линк
    return 'https://shorty/' + base64String;
}

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateQRCode(url) {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = '';

    if (url && url.trim() !== "") {
        const encodedURL = encodeURIComponent(url);

        //създаване на qr code
        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedURL}`;
        qrCodeImage.id = 'qrCodeImage';

        qrCodeContainer.appendChild(qrCodeImage);

        //покажи qr code
        document.getElementById('saveButton').style.display = 'inline-block';
    } else {
        qrCodeContainer.innerHTML = "Please provide a valid URL to generate a QR code.";
    }
}

function saveQRCode(event) {
    event.preventDefault();

    const qrCodeImage = document.getElementById('qrCodeImage');
    if (qrCodeImage) {
        fetch(qrCodeImage.src)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'qr_code.png';  // име на файл
                document.body.appendChild(a);
                a.click();  //изтегли
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  //изчисти
            })
            .catch(err => {
                alert('Error while saving QR code: ' + err);
            });
    } else {
        alert("No QR Code available to save!");
    }
}
