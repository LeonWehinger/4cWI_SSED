document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('demoForm');


    // Parsley Custom Validator für Großbuchstaben im Passwort
    window.Parsley.addValidator('uppercase', {
        requirementType: 'number',
        validateString: function(value, requirement) {
            const count = (value.match(/[A-Z]/g) || []).length;
            return count >= requirement;
        },
        messages: {
            en: 'Password must have at least %s uppercase letters.',
            de: 'Das Passwort muss mindestens %s Großbuchstaben enthalten.'
        }
    });

    // Parsley Custom Validator für maximale Dateigröße
    window.Parsley.addValidator('maxfilesize', {
        requirementType: 'number',
        validateString: function(value, maxSize, parsleyInstance) {
            const files = parsleyInstance.$element[0].files;
            if (!files || files.length === 0) return true; // Kein File = kein Fehler
            
            const file = files[0];
            const fileSizeInMB = file.size / (1024 * 1024);
            return fileSizeInMB <= maxSize;
        },
        messages: {
            en: 'File must not exceed %s MB.',
            de: 'Die Datei darf maximal %s MB groß sein.'
        }
    });

    // Parsley Custom Validator für Dateitypen
    window.Parsley.addValidator('filetypes', {
        requirementType: 'string',
        validateString: function(value, allowedTypes, parsleyInstance) {
            const files = parsleyInstance.$element[0].files;
            if (!files || files.length === 0) return true;
            
            const file = files[0];
            const allowedTypesArray = allowedTypes.split(',').map(t => t.trim().toLowerCase());
            
            // Prüfe Dateiendung
            const fileName = file.name.toLowerCase();
            const hasValidExtension = allowedTypesArray.some(type => fileName.endsWith(type));
            
            return hasValidExtension;
        },
        messages: {
            en: 'Only files with these extensions are allowed: %s',
            de: 'Nur Dateien mit folgenden Endungen sind erlaubt: %s'
        }
    });

    // Parsley Custom Validator für Bildabmessungen (min/max Breite/Höhe)
    window.Parsley.addValidator('imagesize', {
        requirementType: 'string',
        validateString: function(value, requirements, parsleyInstance) {
            const files = parsleyInstance.$element[0].files;
            if (!files || files.length === 0) return true;
            
            const file = files[0];
            
            // Prüfe ob es ein Bild ist
            if (!file.type.startsWith('image/')) return true;
            
            const deferred = window.$.Deferred();
            const [minWidth, minHeight, maxWidth, maxHeight] = requirements.split(',').map(n => parseInt(n.trim()));
            
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            
            img.onload = function() {
                const width = img.width;
                const height = img.height;
                
                let isValid = true;
                
                if (minWidth && width < minWidth) isValid = false;
                if (minHeight && height < minHeight) isValid = false;
                if (maxWidth && width > maxWidth) isValid = false;
                if (maxHeight && height > maxHeight) isValid = false;
                
                deferred.resolve(isValid);
            };
            
            img.onerror = function() {
                deferred.resolve(false);
            };
            
            reader.readAsDataURL(file);
            
            return deferred.promise();
        },
        messages: {
            en: 'Image dimensions must be between the specified limits (minW, minH, maxW, maxH).',
            de: 'Die Bildabmessungen müssen innerhalb der angegebenen Grenzen liegen (minBreite, minHöhe, maxBreite, maxHöhe).'
        }
    });

    // Range live
    const rangeInput = form.lautstaerke;
    const rangeOutput = document.getElementById('rangeOut');
    if (rangeInput && rangeOutput) {
        rangeInput.addEventListener('input', () => {
            rangeOutput.value = rangeInput.value;
        });
    }

    // Color live
    const colorInput = form.farbe;
    if (colorInput) {
        colorInput.addEventListener('input', () => {
            document.body.style.backgroundColor = colorInput.value;
        });
    }

    // Submit nur aktiv, wenn AGB Checkbox gesetzt
    const submitBtn = form.querySelector('input[type="submit"]');
    const agbCheckbox = form.agb;
    submitBtn.disabled = !agbCheckbox.checked;
    agbCheckbox.addEventListener('change', () => {
        submitBtn.disabled = !agbCheckbox.checked;
    });

    // File-Input: Vorschau für Bilder
    const fileInput = form.datei;
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;

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
    }

    // Auto-Focus auf erstes Textfeld
    const firstTextField = form.querySelector('input[type="text"]');
    if (firstTextField) {
        firstTextField.focus();
    }
});
