const clubs = ["D", "3W", "4H", "4I", "5I", "6I", "7I", "8I", "9I", "PW", "52", "56", "60", "Putter"];
const container = document.getElementById('course-container');

// Initialize 18 holes
const hiawathaData = {
    par: [4, 4, 3, 4, 4, 3, 5, 4, 5, 4, 4, 5, 3, 4, 4, 4, 3, 5],
    yards: {
        gold: [414, 439, 179, 424, 383, 223, 525, 431, 510, 411, 433, 600, 180, 356, 452, 466, 210, 523],
        blue: [385, 395, 164, 378, 360, 205, 493, 413, 482, 355, 386, 543, 162, 339, 413, 446, 178, 489],
        white: [375, 377, 149, 361, 345, 188, 476, 375, 453, 337, 350, 517, 144, 322, 401, 384, 171, 470],
        green: [350, 360, 132, 333, 312, 173, 458, 352, 429, 329, 340, 492, 126, 300, 379, 360, 154, 422]
    }
};

const teeSelector = document.getElementById('tee-selector');

function initHoles() {
    container.innerHTML = ''; // Clear for re-rendering
    const selectedTee = teeSelector.value;

    for (let i = 1; i <= 18; i++) {
        const par = hiawathaData.par[i-1];
        const dist = hiawathaData.yards[selectedTee][i-1];
        
        const holeDiv = document.createElement('div');
        holeDiv.className = 'hole-card';
        holeDiv.innerHTML = `
            <div class="hole-header">
                <h3>Hole ${i}</h3>
                <span class="hole-info">Par ${par} | ${dist} yds</span>
            </div>
            <div id="shots-h${i}">
                ${renderShotRow(i, 1)}
            </div>
            <button class="add-shot-btn" onclick="addShot(${i})">+ Add Shot</button>
        `;
        container.appendChild(holeDiv);
        loadData(i);
    }
}

// Re-render when tee changes
teeSelector.addEventListener('change', initHoles);

function renderShotRow(hole, shotNum) {
    let options = clubs.map(c => `<option value="${c}">${c}</option>`).join('');
    return `
        <div class="shot-row" id="h${hole}-s${shotNum}">
            <label>S${shotNum}</label>
            <select onchange="saveData(${hole})" data-hole="${hole}">
                <option value="">Select Club</option>
                ${options}
            </select>
        </div>
    `;
}

function addShot(holeNum) {
    const shotContainer = document.getElementById(`shots-h${holeNum}`);
    const nextShot = shotContainer.children.length + 1;
    shotContainer.insertAdjacentHTML('beforeend', renderShotRow(holeNum, nextShot));
}

function saveData(holeNum) {
    const selects = document.querySelectorAll(`select[data-hole="${holeNum}"]`);
    const holeClubs = Array.from(selects).map(s => s.value);
    localStorage.setItem(`hiawatha-h${holeNum}`, JSON.stringify(holeClubs));
}

function loadData(holeNum) {
    const saved = localStorage.getItem(`hiawatha-h${holeNum}`);
    if (saved) {
        const data = JSON.parse(saved);
        const shotContainer = document.getElementById(`shots-h${holeNum}`);
        shotContainer.innerHTML = ''; // Clear defaults
        data.forEach((club, index) => {
            shotContainer.insertAdjacentHTML('beforeend', renderShotRow(holeNum, index + 1));
            shotContainer.querySelectorAll('select')[index].value = club;
        });
    }
}

document.getElementById('reset-btn').addEventListener('click', () => {
    if(confirm("Clear all data for this round?")) {
        localStorage.clear();
        location.reload();
    }
});

initHoles();

document.getElementById('export-btn').addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,Hole,Shot 1,Shot 2,Shot 3,Shot 4,Shot 5\n";

    for (let i = 1; i <= 18; i++) {
        const saved = localStorage.getItem(`hiawatha-h${i}`);
        if (saved) {
            const shots = JSON.parse(saved);
            // Formats row: Hole #, Club1, Club2...
            csvContent += `${i},${shots.join(",")}\n`;
        } else {
            csvContent += `${i}\n`; // Empty hole
        }
    }

    // Create a hidden link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hiawatha_round_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
});
