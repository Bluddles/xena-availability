// ========================================
// MANUAL OVERRIDE
// ========================================

// Choose: "available", "busy", "maybe", or null
// Use null when you want the normal schedule to decide.

const manualOverride = "Busy";


// ========================================
// NORMAL WEEKLY SCHEDULE
// ========================================

// 0 = free all day
// 15 = free after 3 PM
// 16 = free after 4 PM
// 17 = free after 5 PM
// null = busy all day

const weeklySchedule = {
    Monday: 0,
    Tuesday: null,
    Wednesday: null,
    Thursday: 16,
    Friday: 0,
    Saturday: 17,
    Sunday: 15
};


// ========================================
// GET EASTERN TIME
// ========================================

function getEasternTime() {
    const formatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h23",
        timeZone: "America/New_York"
    });

    const parts = formatter.formatToParts(new Date());

    const weekday = parts.find(
        part => part.type === "weekday"
    ).value;

    const hour = Number(
        parts.find(part => part.type === "hour").value
    );

    return {
        weekday: weekday,
        hour: hour
    };
}


// ========================================
// UPDATE CURRENT STATUS
// ========================================

function updateCurrentStatus() {
    const easternTime = getEasternTime();
    const availableAfter = weeklySchedule[easternTime.weekday];
    const statusElement = document.querySelector(".status");

    let currentStatus;

    // Manual override takes priority
    if (manualOverride !== null) {
        currentStatus = manualOverride;
    }

    // Otherwise, use the weekly schedule
    else if (availableAfter === 0) {
        currentStatus = "available";
    }

    else if (
        availableAfter !== null &&
        easternTime.hour >= availableAfter
    ) {
        currentStatus = "available";
    }

    else {
        currentStatus = "busy";
    }

    // Remove the previous color
    statusElement.classList.remove(
        "available",
        "busy",
        "maybe"
    );

    // Add the correct text and color
    if (currentStatus === "available") {
        statusElement.textContent = "Available";
        statusElement.classList.add("available");
    }

    else if (currentStatus === "maybe") {
        statusElement.textContent = "Maybe Available";
        statusElement.classList.add("maybe");
    }

    else {
        statusElement.textContent = "Busy";
        statusElement.classList.add("busy");
    }
}


// ========================================
// HIGHLIGHT TODAY
// ========================================

function highlightCurrentDay() {
    const easternTime = getEasternTime();
    const dayCards = document.querySelectorAll(".day");

    dayCards.forEach(function(card) {
        const dayName = card.querySelector("h3").textContent;

        if (dayName === easternTime.weekday) {
            card.classList.add("today");
        }
    });
}


// Run both functions when the page opens
updateCurrentStatus();
highlightCurrentDay();

// Check the status again every minute
setInterval(updateCurrentStatus, 60000);