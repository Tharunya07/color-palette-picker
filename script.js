function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
async function getColorName(hex) {
    try {
        const response = await fetch(`https://api.color.pizza/v1/${hex.replace('#', '')}`);
        const data = await response.json();
        return data.colors[0].name;
    } catch (error) {
        console.error("Color name fetch failed:", error);
        return "Unknown";
    }
}

async function generatePalette() {
    const palette = document.getElementById('palette');
    palette.innerHTML = '';

    const colors = Array.from({ length: 5 }, getRandomColor);

    // Fetch all color names in parallel
    const names = await Promise.all(colors.map(hex => getColorName(hex)));

    colors.forEach((hex, i) => {
        const name = names[i];
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = hex;
        box.title = "Click to copy HEX";

        const hexDiv = document.createElement('div');
        hexDiv.className = 'hex';
        hexDiv.textContent = hex;

        const nameDiv = document.createElement('div');
        nameDiv.className = 'name';
        nameDiv.textContent = name;

        box.appendChild(hexDiv);
        box.appendChild(nameDiv);

        box.addEventListener('click', () => {
            navigator.clipboard.writeText(hex);
            hexDiv.textContent = "Copied!";
            setTimeout(() => {
                hexDiv.textContent = hex;
            }, 1000);
        });

        palette.appendChild(box);
    });
}


document.getElementById('generate').addEventListener('click', generatePalette);

// Initial load
generatePalette();