const scanBtn = document.getElementById('scanBtn');
const imageInput = document.getElementById('imageInput');
const output = document.getElementById('output');
const loaderBar = document.querySelector('.loader-bar');

scanBtn.addEventListener('click', () => {
    const file = imageInput.files[0];
    if (!file) {
        alert("Choisis une image d'abord !");
        return;
    }

    output.textContent = '';
    loaderBar.style.width = '0%';
    loaderBar.parentElement.classList.remove('hidden');
    scanBtn.disabled = true;

    const reader = new FileReader();
    reader.onload = function() {
        Tesseract.recognize(
            reader.result,
            'fra',
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        // m.progress va de 0 à 1
                        let progressPercent = Math.floor(m.progress * 100);
                        loaderBar.style.width = progressPercent + '%';
                    }
                    console.log(m);
                }}
        ).then(({ data: { text } }) => {
            output.textContent = text || "Aucun texte détecté.";
            loaderBar.style.width = '100%';
            setTimeout(() => {
                loaderBar.parentElement.classList.add('hidden');
                scanBtn.disabled = false;
            }, 800);
        }).catch(err => {
            alert("Erreur lors de la lecture OCR : " + err.message);
            loaderBar.parentElement.classList.add('hidden');
            scanBtn.disabled = false;
        });
    };
    reader.readAsDataURL(file);
});
```

Important :
N’oublie pas d’inclure dans ton HTML la bibliothèque Tesseract.js via CDN dans la balise `<head>` ou avant ton script.js :

```html
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/dist/tesseract.min.js"></script>
```