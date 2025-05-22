const locked = [false, false, false, false, false];
const paletteData = new Array(5).fill({ hex: '', name: '' });

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

async function getColorName(hex) {
  try {
    const response = await fetch(`https://api.color.pizza/v1/${hex.replace('#', '')}`);
    const data = await response.json();
    return data.colors[0].name;
  } catch {
    return "Unknown";
  }
}

function getLockSVG(locked) {
  return locked
    ? `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-7h-1V7a5 5 0 00-10 0v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2zM8 7a4 4 0 118 0v3H8V7z"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-7h-1V7a5 5 0 00-10 0h2a3 3 0 016 0v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2z"/></svg>`;
}

async function generatePalette() {
  const palette = document.getElementById('palette');
  palette.innerHTML = '';

  const fetchPromises = paletteData.map(async (_, i) => {
    if (!locked[i]) {
      const hex = getRandomColor();
      const name = await getColorName(hex);
      paletteData[i] = { hex, name };
    }
  });

  await Promise.all(fetchPromises);

  paletteData.forEach((color, i) => {
    const box = document.createElement('div');
    box.className = 'color-box';
    box.style.backgroundColor = color.hex;

    const hexDiv = document.createElement('div');
    hexDiv.className = 'hex';
    hexDiv.textContent = color.hex;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.textContent = color.name;

    const lockBtn = document.createElement('button');
    lockBtn.className = 'lock';
    lockBtn.innerHTML = getLockSVG(locked[i]);

    lockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      locked[i] = !locked[i];
      lockBtn.innerHTML = getLockSVG(locked[i]);
    });

    box.appendChild(lockBtn);
    box.appendChild(hexDiv);
    box.appendChild(nameDiv);

    box.addEventListener('click', () => {
      navigator.clipboard.writeText(color.hex);
      hexDiv.textContent = "Copied!";
      setTimeout(() => {
        hexDiv.textContent = color.hex;
      }, 1000);
    });

    palette.appendChild(box);
  });
}

document.getElementById('generate').addEventListener('click', generatePalette);
generatePalette();
