document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('shortenButton').addEventListener('click', shortenURL);
    
    const path = window.location.pathname.replace('/', '');
    if (path) {
        redirectToOriginal(path);
    }

    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveQRCode);
    }
});

function shortenURL() 
{

    //стойности и данни
    const urlInput = document.getElementById('urlInput').value.trim();
    const aliasInput = document.getElementById('aliasInput').value.trim();
    let lengthInput = parseInt(document.getElementById('lengthInput').value);
    let expiryInput = parseInt(document.getElementById('expiryInput').value);
    let maxUsesInput = parseInt(document.getElementById('maxUsesInput').value);

    // Validate URL input
    if (!urlInput) {
        alert('Please enter a URL!');
        return;
    }

    //извести ако дължина по-малка от 5 или по-голяма от 20
    if (isNaN(lengthInput) || lengthInput < 5 || lengthInput > 20) {
        alert('Please enter a length between 5 and 20 characters!');
        return;
    }

    //генерирай линк
    const shortened = generateShortenedURL(urlInput, aliasInput, lengthInput);

    //съхрани линк
    const linkData = {
        originalUrl: urlInput,
        shortenedUrl: shortened,
        expiryTime: expiryInput > 0 ? Date.now() + expiryInput * 60000 : 0, //изтичане в минути 1 000 ms * 60ms * 60s
        maxUses: maxUsesInput > 0 ? maxUsesInput : Infinity,
        usesLeft: maxUsesInput > 0 ? maxUsesInput : Infinity
    };

    // Save the shortened URL data to localStorage
    localStorage.setItem(shortened, JSON.stringify(linkData));

    // Display the shortened link
    const outputDiv = document.getElementById('output');
    const shortenedLink = document.getElementById('shortenedLink');
    
    shortenedLink.href = shortened;
    shortenedLink.textContent = shortened;

    // Generate and display the QR code for the shortened URL
    generateQRCode(shortened);

    outputDiv.style.display = 'block';
}

function generateShortenedURL(url, alias, length) {
    let base64String = btoa(url).substring(0, length); // Generate shortened link
    if (alias) {
        base64String = alias; //използвай псевдоним
    }
    return 'https://shorty/' + base64String;
}

function generateQRCode(url) {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    
    qrCodeContainer.innerHTML = '';

    // Check if the URL is not empty
    if (url && url.trim() !== "") {
        const encodedURL = encodeURIComponent(url);

        //създаване на qr code
        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedURL}`;


        qrCodeImage.id = 'qrCodeImage';  //сложи id

        qrCodeContainer.appendChild(qrCodeImage);

        //покажи бутона
        document.getElementById('saveButton').style.display = 'inline-block';
    } else {
        qrCodeContainer.innerHTML = "Please provide a valid URL to generate a QR code.";
    }
}

function saveQRCode(event) {
    event.preventDefault();  //prevent default функция

    const qrCodeImage = document.getElementById('qrCodeImage');
    if (qrCodeImage) {
        //fetch функция
        fetch(qrCodeImage.src)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'qr_code.png';  //име на файл
                document.body.appendChild(a);
                a.click();  //изтегли!
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                alert('Error while saving QR code: ' + err);
            });
    } else {
        alert("No QR Code available to save!");
    }
}

function redirectToOriginal(shortenedPath) {
    const storedData = localStorage.getItem(shortenedPath);
    
    if (storedData) {
        const linkData = JSON.parse(storedData);

        //провери време на изтичане
        if (linkData.expiryTime && Date.now() > linkData.expiryTime) {
            alert('This link has expired!');
            return;
        }

        //провери макс изпозлвания
        if (linkData.usesLeft <= 0) {
            alert('This link has reached its maximum usage limit!');
            return;
        }

        //към оригинален линк
        window.location.href = linkData.originalUrl;

        //промяна на брояч
        if (linkData.maxUses !== Infinity) {
            linkData.usesLeft -= 1;
            localStorage.setItem(shortenedPath, JSON.stringify(linkData));
        }
    } 
}
