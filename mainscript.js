document.addEventListener('DOMContentLoaded', () => {
    const shortBin = document.getElementById('short-btn');
    const reloadBin = document.getElementById('reload-btn');
    const qrCodeImg = document.getElementById("qrCode");
    const saveQrBtn = document.getElementById("save-qr-btn");
    const customAliasInput = document.getElementById('customAlias'); //вход за custom "име"
    //константни стойности

    shortBin.addEventListener('click', () => {
        const longURL = document.getElementById('longURL').value;
        const usageLimitInput = document.getElementById('usageLimit').value; //извади стойност
        const usageLimit = parseInt(usageLimitInput, 10); //към числена стойност
        const customAlias = customAliasInput.value.trim(); // стойност на подаденото custom "име"

        //проверки за URL
        if (!longURL) {
            alert("Please enter a URL."); //грешка
            return;
        }

       /* if (!usageLimit || usageLimit < 1) {
            alert("Please enter a valid usage limit (greater than 0)."); //грешка
            return;
        }
        */

        // If a custom alias is provided, include it in the TinyURL creation
        let ApiURL = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`;
        
        //ако има вкарано име, добавя се към съкратения линк
        if (customAlias) {
            ApiURL += `&alias=${encodeURIComponent(customAlias)}`;
        }

        const shortURLtextarea = document.getElementById("shortURL");

        fetch(ApiURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");//Грешка при интернет връзка
                }
                return response.text();
            })
            .then(data => {
                shortURLtextarea.value = data;
                storeShortURL(data, usageLimit);
                generateQRCode(data); //генерирай QR Code
            })
            .catch(error => {
                shortURLtextarea.value = "Error! Unable to shorten URL!";
                console.error("Fetch error:", error);
            });
    });

    reloadBin.addEventListener('click', () => location.reload());

    function storeShortURL(shortURL, limit) {
        localStorage.setItem(shortURL, JSON.stringify({ count: 0, limit }));
    }

    /*QR Code функция*/
    function generateQRCode(url) {
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=150x150`;
        qrCodeImg.src = qrCodeUrl;
        qrCodeImg.style.display = "block"; //Код
        saveQrBtn.style.display = "block"; //Бутон
    }

    /*бутон за запазване*/
    saveQrBtn.addEventListener('click', () => {
        fetch(qrCodeImg.src)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'QRCode.png'; //Име за запазване на файл
                document.body.appendChild(link);
                link.click();//"цъкни за да запизиш"
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            })
            .catch(error => console.error('Error downloading QR code:', error));
    });

    //Функция за лимит за използвания
    function checkUsage(shortURL) {
        const storedData = JSON.parse(localStorage.getItem(shortURL));//прочитане на брой изолзвания
        if (storedData) {
            if (storedData.count < storedData.limit) 
            {
                storedData.count += 1; //увеличаване на брояч
                localStorage.setItem(shortURL, JSON.stringify(storedData));
                return true; //Позволи при недостигнат брой използвания
            } 
            else if (storedData == storedData.limit == 0) 
            {
                return true; //Позволи при неподаден брой използвания
            }
            else
            {
                alert("Usage limit reached for this URL!");
                return false; //Спри при достигнат лимит
            }
        }
        return false; // URL not found
    }

    //Към съкратен линк
    document.getElementById('shortURL').addEventListener('click', () => {
        const shortURL = document.getElementById('shortURL').value;
        if (checkUsage(shortURL)) {
            window.open(shortURL, '_blank'); //Отвори, ако лимит не е достигнат 
        }
    });
});
