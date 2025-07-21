function startDraw() {
    const namesInput = document.getElementById('names-input').value.trim();
    const names = namesInput.split(',').map(name => name.trim()).filter(name => name.length > 0);
    
    if (names.length === 0) return;

    const slots = [
        'mon-morning', 'mon-afternoon',
        'tue-morning', 'tue-afternoon',
        'wed-morning', 'wed-afternoon',
        'thu-morning', 'thu-afternoon',
        'fri-morning', 'fri-afternoon'
    ];

    let result = Object.fromEntries(slots.map(slot => [slot, null]));
    let nameCount = {};
    let assignedNames = {};

    for (let slot of slots) {
        const daySlot = slot.split('-')[0];
        let validNames = names.filter(name => !(assignedNames[name]?.includes(daySlot)));

        if (validNames.length > 0) {
            const randomName = validNames[Math.floor(Math.random() * validNames.length)];
            result[slot] = randomName;

            assignedNames[randomName] = assignedNames[randomName] || [];
            assignedNames[randomName].push(daySlot);
            nameCount[randomName] = (nameCount[randomName] || 0) + 1;
        }
    }

    let missingNames = names.filter(name => !assignedNames[name] || assignedNames[name].length === 0);
    for (let name of missingNames) {
        for (let slot of slots) {
            if (!result[slot]) {
                result[slot] = name;
                assignedNames[name] = assignedNames[name] || [];
                assignedNames[name].push(slot.split('-')[0]);
                nameCount[name] = (nameCount[name] || 0) + 1;
                break;
            }
        }
    }

    let unassignedNames = names.filter(name => !assignedNames[name] || assignedNames[name].length === 0);
    if (unassignedNames.length > 0) return startDraw();

    let maxCount = Math.max(...Object.values(nameCount));
    let minCount = Math.min(...Object.values(nameCount));

    while (maxCount - minCount > 1) {
        let mostFrequent = Object.keys(nameCount).filter(name => nameCount[name] === maxCount);
        let leastFrequent = Object.keys(nameCount).filter(name => nameCount[name] === minCount);

        let nameToReplace = mostFrequent[Math.floor(Math.random() * mostFrequent.length)];
        let nameToFill = leastFrequent[Math.floor(Math.random() * leastFrequent.length)];

        let replaceSlots = Object.keys(result).filter(slot => result[slot] === nameToReplace);
        if (replaceSlots.length > 0) {
            const slotToSwap = replaceSlots[0];
            result[slotToSwap] = nameToFill;
            nameCount[nameToReplace]--;
            nameCount[nameToFill]++;
        }

        maxCount = Math.max(...Object.values(nameCount));
        minCount = Math.min(...Object.values(nameCount));
    }

    let nameCountsText = names.map(name => `${name}: ${nameCount[name] || 0}<br>`).join('');
    document.getElementById('name-counts').innerHTML = nameCountsText;

    for (const slot in result) {
        document.getElementById(slot).textContent = result[slot];
    }

    if (checkDuplicateAssignments(result)) {
        return startDraw();
    }

    document.getElementById('result-table').style.display = 'table';
}

function checkDuplicateAssignments(result) {
    for (const day of ['mon', 'tue', 'wed', 'thu', 'fri']) {
        const morning = result[`${day}-morning`];
        const afternoon = result[`${day}-afternoon`];
        if (morning && afternoon && morning === afternoon) {
            return true;
        }
    }
    return false;
}
