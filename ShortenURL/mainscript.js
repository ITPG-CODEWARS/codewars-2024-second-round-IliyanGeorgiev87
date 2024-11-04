document.addEventListener('DOMContentLoaded', () => {
    const shortBin = document.getElementById('short-btn');
    const reloadBin = document.getElementById('reload-btn');

    shortBin.addEventListener('click', () => {
        const longURL = document.getElementById('longURL').value;
        if (!longURL) {
            alert("Please enter a URL."); // Проверка за празен/невалиден линк
            return;
        }
        
        const ApiURL = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`;//вграждане на API
        const shortURLtextarea = document.getElementById("shortURL");

        fetch(ApiURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok"); //грешка при интернет връзка
                }
                return response.text();
            })
            .then(data => {
                shortURLtextarea.value = data;//Съкратен линк
            })
            .catch(error => {
                shortURLtextarea.value = "Error! Unable to shorten URL!"; //грешка
                console.error("Fetch error:", error);
            });
    });

    reloadBin.addEventListener('click', () => location.reload());
});
