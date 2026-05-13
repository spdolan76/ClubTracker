const clubs = ["D", "3W", "4H", "4I", "5I", "6I", "7I", "8I", "9I", "PW", "52", "56", "60", "Putter"];
const container = document.getElementById('course-container');

// Initialize 18 holes
function initHoles() {
    for (let i = 1; i <= 18; i++) {
        const holeDiv = document.createElement('div');
        holeDiv.className = 'hole-card';
        holeDiv.innerHTML = `
            <h3>Hole ${i}</h3>
            <div id="shots-h${i}">
                ${renderShotRow(i, 1)}
            </div>
            <!-- Added the class here for styling -->
            <button class="add-shot-btn" onclick="addShot(${i})">+ Add Shot</button>
        `;
        container.appendChild(holeDiv);
        loadData(i);
    }
}

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
