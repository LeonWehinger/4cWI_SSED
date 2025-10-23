document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('demoForm');

    // Range live
    const rangeInput = form.lautstaerke;
    const rangeOutput = document.getElementById('rangeOut');
    rangeInput.addEventListener('input', () => {
        rangeOutput.value = rangeInput.value;
    });

    // Color live
    const colorInput = form.farbe;
    colorInput.addEventListener('input', () => {
        document.body.style.backgroundColor = colorInput.value;
    });

    // Submit nur aktiv, wenn AGB Checkbox gesetzt
    const submitBtn = form.querySelector('input[type="submit"]');
    const agbCheckbox = form.agb;
    submitBtn.disabled = !agbCheckbox.checked;
    agbCheckbox.addEventListener('change', () => {
        submitBtn.disabled = !agbCheckbox.checked;
    });

    // File-Input: max. 2MB + Vorschau für Bilder
    const fileInput = form.datei;
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB
            alert("Datei darf maximal 2MB groß sein!");
            fileInput.value = "";
            return;
        }

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                let preview = document.getElementById('imagePreview');
                if (!preview) {
                    preview = document.createElement('img');
                    preview.id = 'imagePreview';
                    preview.style.maxWidth = '200px';
                    preview.style.display = 'block';
                    preview.style.marginTop = '10px';
                    fileInput.parentNode.appendChild(preview);
                }
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Auto-Focus auf erstes Textfeld
    form.querySelector('input[type="text"]').focus();
});
