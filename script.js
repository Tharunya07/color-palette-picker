function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function generatePalette() {
    const palette = document.getElementById('palette');
    palette.innerHTML = ''; // Clear previous colors

    for (let i = 0; i < 5; i++) {
        const hex = getRandomColor();
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = hex;
        box.textContent = hex;
        box.title = "Click to copy";

        box.addEventListener('click', () => {
            navigator.clipboard.writeText(hex);
            box.textContent = "Copied!";
            setTimeout(() => {
                box.textContent = hex;
            }, 1000);
        });

        palette.appendChild(box);
    }
}

document.getElementById('generate').addEventListener('click', generatePalette);

// Initial load
generatePalette();