// UUID GENERATOR

function generateUUID() {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


// DIFF FUNCTION

function getTextDiff(oldText, newText) {
    let oldWords = oldText.trim().split(/\s+/).filter(Boolean);
    let newWords = newText.trim().split(/\s+/).filter(Boolean);

    return {
        addedWords: newWords.filter(w => !oldWords.includes(w)),
        removedWords: oldWords.filter(w => !newWords.includes(w)),
        oldLength: oldText.length,
        newLength: newText.length
    };
}

// MAIN VARIABLES

let editor = document.getElementById("text-editor");
let historyBox = document.getElementById("history-list");

let lastText = "";
let auditTrail = JSON.parse(localStorage.getItem("versionHistory")) || [];

const defaultEntry = {
    uuid: generateUUID(),
    timestamp: new Date().toLocaleString(),
    addedWords: ["Initial version"],
    removedWords: [],
    oldLength: 0,
    newLength: 0
};


// If empty, add default entry
if (auditTrail.length === 0) {
    auditTrail.push(defaultEntry);
    localStorage.setItem("versionHistory", JSON.stringify(auditTrail));
}

// Display all entries
auditTrail.forEach(entry => addEntryToUI(entry));

// SAVE BUTTON ACTION

document.getElementById("save-btn").addEventListener("click", () => {

    let newText = editor.value;
    let diff = getTextDiff(lastText, newText);

    let entry = {
        uuid: generateUUID(),
        timestamp: new Date().toLocaleString(),
        addedWords: diff.addedWords,
        removedWords: diff.removedWords,
        oldLength: diff.oldLength,
        newLength: diff.newLength
    };
    auditTrail.unshift(entry);
    localStorage.setItem("versionHistory", JSON.stringify(auditTrail));
    addEntryToUI(entry);
    lastText = newText;
});


// FUNCTION TO ADD ENTRY TO UI

function addEntryToUI(entry) {
    let box = document.createElement("div");
    box.classList.add("version-box");
    box.innerHTML = `
        <p><b>UUID:</b> ${entry.uuid}</p>
        <p><b>Timestamp:</b> ${entry.timestamp}</p>
        <p><b>Added:</b> ${entry.addedWords.join(", ") || "None"}</p>
        <p><b>Removed:</b> ${entry.removedWords.join(", ") || "None"}</p>
        <p><b>Old Length:</b> ${entry.oldLength}</p>
        <p><b>New Length:</b> ${entry.newLength}</p>
    `;
    historyBox.prepend(box); 
}
