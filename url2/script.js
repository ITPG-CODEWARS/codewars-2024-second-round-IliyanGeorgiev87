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
    // Get input values
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

    // Validate length
    if (isNaN(lengthInput) || lengthInput < 5 || lengthInput > 20) {
        alert('Please enter a length between 5 and 20 characters!');
        return;
    }

    // Generate shortened URL
    const shortened = generateShortenedURL(urlInput, aliasInput, lengthInput);

    // Prepare link data for local storage
    const linkData = {
        originalUrl: urlInput,
        shortenedUrl: shortened,
        expiryTime: expiryInput > 0 ? Date.now() + expiryInput * 60000 : 0,  // Expiry time in ms
        maxUses: maxUsesInput > 0 ? maxUsesInput : Infinity,
        usesLeft: maxUsesInput > 0 ? maxUsesInput : Infinity
    };

    // Save link data to localStorage
    localStorage.setItem(shortened, JSON.stringify(linkData));

    // Display the shortened URL and QR code
    const outputDiv = document.getElementById('output');
    const shortenedLink = document.getElementById('shortenedLink');

    shortenedLink.href = shortened;
    shortenedLink.textContent = shortened;
    generateQRCode(shortened);

    // Show the output section
    outputDiv.style.display = 'block';
}

function generateShortenedURL(url, alias, length) {
    let base64String = btoa(url).substring(0, length); // Generate shortened part

    // If an alias is provided, use it instead of the base64String
    if (alias) {
        base64String = alias; // Use alias if provided
    } else {
        // Generate a random part if no alias is provided
        base64String = generateRandomString(length);
    }

    // You can also include a timestamp or random value to make it unique each time
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

        // Generate QR code
        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedURL}`;
        qrCodeImage.id = 'qrCodeImage';

        qrCodeContainer.appendChild(qrCodeImage);

        // Show the save button
        document.getElementById('saveButton').style.display = 'inline-block';
    } else {
        qrCodeContainer.innerHTML = "Please provide a valid URL to generate a QR code.";
    }
}

function saveQRCode(event) {
    event.preventDefault();  // Prevent default button action

    const qrCodeImage = document.getElementById('qrCodeImage');
    if (qrCodeImage) {
        // Fetch the QR code image and save it as a file
        fetch(qrCodeImage.src)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'qr_code.png';  // Set the downloaded file name
                document.body.appendChild(a);
                a.click();  // Trigger download
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  // Clean up the object URL
            })
            .catch(err => {
                alert('Error while saving QR code: ' + err);
            });
    } else {
        alert("No QR Code available to save!");
    }
}
