document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to the shorten button
    document.getElementById('shortenButton').addEventListener('click', shortenURL);
});

function shortenURL() {
    console.log("Button clicked!"); // Debugging line

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

    // Validate length input (between 5 and 20)
    if (isNaN(lengthInput) || lengthInput < 5 || lengthInput > 20) {
        alert('Please enter a length between 5 and 20 characters!');
        return;
    }

    // Generate the shortened URL
    const shortened = generateShortenedURL(urlInput, aliasInput, lengthInput);

    // Save link data to localStorage
    const linkData = {
        originalUrl: urlInput,
        shortenedUrl: shortened,
        expiryTime: expiryInput > 0 ? Date.now() + expiryInput * 60000 : 0, // expiry in minutes
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

    outputDiv.style.display = 'block';
}

function generateShortenedURL(url, alias, length) {
    let base64String = btoa(url).substring(0, length); // Generate shortened link
    if (alias) {
        base64String = alias; // Use alias if provided
    }
    return 'https://shorty/' + base64String; // Replace 'https://shorty/' with your actual base domain
}
