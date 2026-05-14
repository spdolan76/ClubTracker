const clubs = ["D", "3W", "4H", "4I", "5I", "6I", "7I", "8I", "9I", "PW", "52", "56", "60", "Putter"];

const courseData = {
    hiawatha: {
        name: "Hiawatha Landing",
        par: [4, 4, 3, 4, 4, 3, 5, 4, 5, 4, 4, 5, 3, 4, 4, 4, 3, 5],
        tees: {
            gold: [414, 439, 179, 424, 383, 223, 525, 431, 510, 411, 433, 600, 180, 356, 452, 466, 210, 523],
            blue: [385, 395, 164, 378, 360, 205, 493, 413, 482, 355, 386, 543, 162, 339, 413, 446, 178, 489],
            white: [375, 377, 149, 361, 345, 188, 476, 375, 453, 337, 350, 517, 144, 322, 401, 384, 171, 470],
            red: [350, 360, 132, 333, 312, 173, 458, 352, 429, 329, 340, 492, 126, 300, 379, 360, 154, 422]
        }
    },
    enjoie: {
        name: "En-Joie",
        par: [4, 4, 4, 3, 4, 5, 3, 4, 5, 4, 4, 4, 3, 4, 5, 4, 3, 5],
        tees: {
            blue: [405, 383, 421, 195, 433, 532, 173, 410, 552, 416, 406, 395, 186, 415, 545, 395, 204, 538],
            white: [376, 365, 392, 175, 402, 518, 155, 385, 520, 390, 380, 370, 165, 390, 520, 370, 185, 515],
            red: [320, 315, 340, 140, 350, 460, 120, 330, 470, 340, 330, 320, 130, 340, 465, 320, 145, 460]
        }
    },
    traditions: {
        name: "Traditions",
        par: [4, 3, 4, 4, 4, 4, 3, 5, 4, 4, 3, 4, 4, 5, 4, 3, 4, 4],
        tees: {
            blue: [385, 165, 390, 365, 380, 415, 155, 520, 370, 385, 175, 405, 390, 540, 360, 145, 385, 400],
            white: [365, 145, 360, 345, 355, 380, 135, 495, 345, 360, 155, 385, 365, 515, 335, 125, 360, 380],
            red: [320, 115, 310, 290, 310, 330, 110, 440, 305, 315, 135, 330, 315, 470, 295, 105, 310, 340]
        }
    },
    elypark: {
        name: "Ely Park",
        par: [4, 4, 4, 3, 4, 4, 4, 3, 5, 4, 5, 3, 4, 4, 4, 3, 4, 5],
        tees: {
            white: [368, 381, 354, 157, 365, 382, 345, 140, 495, 370, 510, 160, 380, 355, 365, 150, 370, 485],
            red: [330, 350, 320, 130, 330, 340, 310, 120, 450, 340, 470, 140, 340, 320, 330, 130, 340, 440]
        }
    },
    tallpines: {
        name: "Tall Pines",
        par: [4, 3, 4, 4, 3, 4, 5, 4, 5, 4, 3, 5, 4, 3, 4, 4, 4, 4],
        tees: {
            white: [340, 150, 360, 315, 160, 380, 490, 330, 510, 350, 145, 505, 320, 155, 370, 340, 365, 390],
            red: [290, 120, 310, 280, 130, 330, 440, 290, 460, 310, 120, 455, 280, 130, 320, 290, 315, 340]
        }
    },
    tioga: {
        name: "Tioga Golf Club",
        par: [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5],
        tees: {
            blue: [380, 395, 165, 510, 375, 405, 185, 390, 525, 370, 385, 155, 500, 360, 375, 170, 390, 515],
            white: [360, 370, 145, 485, 355, 380, 160, 365, 500, 350, 365, 140, 480, 340, 355, 150, 370, 495],
            red: [310, 320, 120, 430, 315, 330, 130, 320, 450, 305, 315, 115, 430, 290, 310, 125, 320, 445]
        }
    }
};

const courseSelector = document.getElementById('course-selector');
const teeSelector = document.getElementById('tee-selector');
const container = document.getElementById('course-container');

// Core sequence: Populate Tee Dropdown -> Set active Tee -> Build Holes
function updateTeeOptions() {
    const courseKey = courseSelector.value;
    const tees = Object.keys(courseData[courseKey].tees);
    
    // 1. Rebuild options
    teeSelector.innerHTML = tees.map(t => `<option value="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('');
    
    // 2. Decide which tee should be active
    const savedTee = localStorage.getItem(`${courseKey}_tee`);
    if (savedTee && tees.includes(savedTee)) {
        teeSelector.value = savedTee;
    } else if (tees.includes('white')) {
        teeSelector.value = 'white';
    }

    // 3. Build the UI
    initHoles();
}

function initHoles() {
    const courseKey = courseSelector.value;
    const teeKey = teeSelector.value;
    const currentCourse = courseData[courseKey];

    // Save state
    localStorage.setItem('lastCourse', courseKey);
    localStorage.setItem(`${courseKey}_tee`, teeKey);

    container.innerHTML = ''; 

    for (let i = 1; i <= 18; i++) {
        const par = currentCourse.par[i-1];
        const dist = currentCourse.tees[teeKey][i-1];
        
        const holeDiv = document.createElement('div');
        holeDiv.className = 'hole-card';
        holeDiv.innerHTML = `
            <div class="hole-header">
                <h3>Hole ${i}</h3>
                <span class="hole-info">Par ${par} | ${dist}y</span>
            </div>
            <div class="column-labels"><span>#</span><span>Club</span><span>Left</span><span>Dist</span></div>
            <div id="shots-h${i}">${renderShotRow(i, 1)}</div>
            <button class="add-shot-btn" onclick="addShot(${i})">+ Add Shot</button>
        `;
        container.appendChild(holeDiv);
        loadData(i);
    }
}

function renderShotRow(hole, shotNum) {
    let options = clubs.map(c => `<option value="${c}">${c}</option>`).join('');
    return `
        <div class="shot-row">
            <label>${shotNum}</label>
            <select onchange="saveData(${hole})" class="club-sel"><option value="">--</option>${options}</select>
            <input type="number" class="left-input" placeholder="Yds" oninput="calculateDistances(${hole}); saveData(${hole})">
            <span class="dist-calc">--</span>
        </div>`;
}

function calculateDistances(holeNum) {
    const courseKey = courseSelector.value;
    const teeKey = teeSelector.value;
    const startYards = courseData[courseKey].tees[teeKey][holeNum - 1];
    const rows = document.getElementById(`shots-h${holeNum}`).querySelectorAll('.shot-row');
    
    rows.forEach((row, index) => {
        const currentLeft = parseInt(row.querySelector('.left-input').value);
        const distDisplay = row.querySelector('.dist-calc');
        if (!isNaN(currentLeft)) {
            const base = (index === 0) ? startYards : parseInt(rows[index - 1].querySelector('.left-input').value);
            distDisplay.innerText = !isNaN(base) ? (base - currentLeft) : "--";
        } else { 
            distDisplay.innerText = "--"; 
        }
    });
}

function addShot(holeNum) {
    const shotContainer = document.getElementById(`shots-h${holeNum}`);
    shotContainer.insertAdjacentHTML('beforeend', renderShotRow(holeNum, shotContainer.children.length + 1));
}

function saveData(holeNum) {
    const rows = document.getElementById(`shots-h${holeNum}`).querySelectorAll('.shot-row');
    const data = Array.from(rows).map(row => ({
        club: row.querySelector('.club-sel').value,
        left: row.querySelector('.left-input').value
    }));
    localStorage.setItem(`round_${courseSelector.value}_h${holeNum}`, JSON.stringify(data));
}

function loadData(holeNum) {
    const saved = localStorage.getItem(`round_${courseSelector.value}_h${holeNum}`);
    if (saved) {
        const data = JSON.parse(saved);
        const shotContainer = document.getElementById(`shots-h${holeNum}`);
        shotContainer.innerHTML = '';
        data.forEach((entry, index) => {
            shotContainer.insertAdjacentHTML('beforeend', renderShotRow(holeNum, index + 1));
            const row = shotContainer.querySelectorAll('.shot-row')[index];
            row.querySelector('.club-sel').value = entry.club;
            row.querySelector('.left-input').value = entry.left;
        });
        calculateDistances(holeNum);
    }
}

// Event Listeners
courseSelector.addEventListener('change', updateTeeOptions);
teeSelector.addEventListener('change', initHoles);

document.getElementById('reset-btn').addEventListener('click', () => {
    if(confirm("Clear data for this course?")) {
        for(let i=1; i<=18; i++) localStorage.removeItem(`round_${courseSelector.value}_h${i}`);
        initHoles();
    }
});

document.getElementById('export-btn').addEventListener('click', () => {
    const courseKey = courseSelector.value;
    let csv = `Course: ${courseData[courseKey].name}, Tee: ${teeSelector.value}\nHole,Shot,Club,Left,ShotDist\n`;
    for (let i = 1; i <= 18; i++) {
        const data = JSON.parse(localStorage.getItem(`round_${courseKey}_h${i}`) || "[]");
        const startYards = courseData[courseKey].tees[teeSelector.value][i-1];
        data.forEach((e, idx) => {
            const prev = (idx === 0) ? startYards : data[idx-1].left;
            const d = (e.left && prev) ? prev - e.left : "";
            csv += `${i},${idx+1},${e.club},${e.left},${d}\n`;
        });
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${courseKey}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
    a.click();
});

// Load last used state
const lastCourse = localStorage.getItem('lastCourse');
if (lastCourse && courseData[lastCourse]) {
    courseSelector.value = lastCourse;
}
updateTeeOptions();
