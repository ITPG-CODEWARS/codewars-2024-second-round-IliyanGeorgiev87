// Function to handle URL shortening
function shortenURL() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const aliasInput = document.getElementById('aliasInput').value.trim();
    const lengthInput = parseInt(document.getElementById('lengthInput').value);
    const expiryInput = parseInt(document.getElementById('expiryInput').value);
    const maxUsesInput = parseInt(document.getElementById('maxUsesInput').value);

    if (!urlInput) {
        alert('Please enter a URL!');
        return;
    }

    //проверка за дължина
    if (lengthInput < 5 || lengthInput > 20) {
        alert('Моля въведете от 5 до 20 символа!');
        return;
    }

    //генериране
    const shortened = generateShortenedURL(urlInput, aliasInput, lengthInput);

    //съхраняване на данни
    const linkData = {
        originalUrl: urlInput,
        shortenedUrl: shortened,
        expiryTime: expiryInput > 0 ? Date.now() + expiryInput * 60000 : 0, //в минути
        maxUses: maxUsesInput > 0 ? maxUsesInput : Infinity,
        usesLeft: maxUsesInput > 0 ? maxUsesInput : Infinity
    };

    localStorage.setItem(shortened, JSON.stringify(linkData));

    //изобразяване на краткия линк
    const outputDiv = document.getElementById('output');
    const shortenedLink = document.getElementById('shortenedLink');
    
    shortenedLink.href = shortened;
    shortenedLink.textContent = shortened;

    outputDiv.style.display = 'block';
}
//функция за генериране
function generateShortenedURL(url, alias, length) {
    let base64String = btoa(url).substring(0, length); //съчиняване на линк
    if (alias) {
        base64String = alias; //ако има псевдоним - използвай
    }
    return 'https://shorty/' + base64String;
}

// Event listener for clicking the shortened URL link (to simulate redirection)
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'shortenedLink') {
        const shortened = e.target.href;
        const linkData = JSON.parse(localStorage.getItem(shortened));

        if (linkData) {     
            //проверка за време за използвания
            if (linkData.expiryTime > 0 && Date.now() > linkData.expiryTime) {
                alert('This link has expired.');
                e.preventDefault();  // Prevent the redirection
                return;
            }

            //провери за лимит на използвания
            if (linkData.usesLeft <= 0) {
                alert('This link has reached its max usage limit.');
                e.preventDefault();  // Prevent the redirection
                return;
            }

            //Намали брояч
            linkData.usesLeft -= 1;
            localStorage.setItem(shortened, JSON.stringify(linkData)); //Съхрани
        }
    }
});
