const clubs = ["D", "3W", "4H", "4I", "5I", "6I", "7I", "8I", "9I", "PW", "52", "56", "60", "Putter"];

const hiawathaData = {
    par: [4, 4, 3, 4, 4, 3, 5, 4, 5, 4, 4, 5, 3, 4, 4, 4, 3, 5],
    yards: {
        gold: [414, 439, 179, 424, 383, 223, 525, 431, 510, 411, 433, 600, 180, 356, 452, 466, 210, 523],
        blue: [385, 395, 164, 378, 360, 205, 493, 413, 482, 355, 386, 543, 162, 339, 413, 446, 178, 489],
        white: [375, 377, 149, 361, 345, 188, 476, 375, 453, 337, 350, 517, 144, 322, 401, 384, 171, 470],
        green: [350, 360, 132, 333, 312, 173, 458, 352, 429, 329, 340, 492, 126, 300, 379, 360, 154, 422]
    }
};

const container = document.getElementById('course-container');
const teeSelector = document.getElementById('tee-selector');

// 1. Initialize App
function initHoles() {
    // Persistent Tee Choice
    if (localStorage.getItem('selectedTee')) {
        teeSelector.value = localStorage.getItem('selectedTee');
    }

    container.innerHTML = ''; 
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

// 2. Render Single Shot Dropdown
function renderShotRow(hole, shotNum) {
    let options = clubs.map(c => `<option value="${c}">${c}</option>`).join('');
    return `
        <div class="shot-row">
            <label>${shotNum}</label>
            <select onchange="saveData(${hole})" data-hole="${hole}">
                <option value="">--</option>
                ${options}
            </select>
        </div>
    `;
}

// 3. Add Shot Logic
function addShot(holeNum) {
    const shotContainer = document.getElementById(`shots-h${holeNum}`);
    const nextShot = shotContainer.children.length + 1;
    shotContainer.insertAdjacentHTML('beforeend', renderShotRow(holeNum, nextShot));
}

// 4. Persistence Logic
function saveData(holeNum) {
    const selects = document.querySelectorAll(`select[data-hole="${holeNum}"]`);
    const holeClubs = Array.from(selects).map(s => s.value);
    localStorage.setItem(`hiawatha-h${holeNum}`, JSON.stringify(holeClubs));
}

function loadData(holeNum) {
    const saved = localStorage.getItem(`hiawatha-h${holeNum}`);
    if (saved) {
        const data = JSON.parse(saved);
        if (data.length > 0) {
            const shotContainer = document.getElementById(`shots-h${holeNum}`);
            shotContainer.innerHTML = ''; 
            data.forEach((club, index) => {
                shotContainer.insertAdjacentHTML('beforeend', renderShotRow(holeNum, index + 1));
                shotContainer.querySelectorAll('select')[index].value = club;
            });
        }
    }
}

// 5. Tee Selection Event
teeSelector.addEventListener('change', () => {
    localStorage.setItem('selectedTee', teeSelector.value);
    initHoles();
});

// 6. Reset Round
document.getElementById('reset-btn').addEventListener('click', () => {
    if(confirm("Clear all shot data for this round?")) {
        const tee = teeSelector.value;
        localStorage.clear();
        localStorage.setItem('selectedTee', tee);
        location.reload();
    }
});

// 7. Export CSV
document.getElementById('export-btn').addEventListener('click', () => {
    const currentTee = teeSelector.value.toUpperCase();
    let csvContent = `data:text/csv;charset=utf-8,Hiawatha Landing - ${currentTee} TEES\n`;
    csvContent += "Hole,S1,S2,S3,S4,S5,S6\n";

    for (let i = 1; i <= 18; i++) {
        const saved = localStorage.getItem(`hiawatha-h${i}`);
        const shots = saved ? JSON.parse(saved) : [];
        csvContent += `${i},${shots.join(",")}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hiawatha_Round_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Start
initHoles();
