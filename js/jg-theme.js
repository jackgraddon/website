// Gets local time and sets the theme and greeting accordingly

const times = {
    morning: {
        start: 5,
        end: 12
    },
    afternoon: {
        start: 12,
        end: 18
    },
    evening: {
        start: 18,
        end: 22
    },
    night: {
        start: 22,
        end: 5
    }
}

// Get the current time
var currentTime = new Date().getHours();

// Fudge current time (for testing)
// currentTime = 24;

// Set the theme based on the time
function setTimeTheme() {
    // Morning theme: 5am to 12pm
    if (currentTime >= times.morning.start && currentTime < times.morning.end) {
        document.body.dataset.jgTheme = "morning";
        console.log("morning");
    }

    // Afternoon theme: 12pm to 6pm
    if (currentTime >= times.afternoon.start && currentTime < times.afternoon.end) {
        document.body.dataset.jgTheme = "afternoon";
        console.log("afternoon");
    }

    // Evening theme: 6pm to 10pm
    if (currentTime >= times.evening.start && currentTime < times.evening.end) {
        document.body.dataset.jgTheme = "evening";
        console.log("evening");
    }

    // Night theme: 10pm to 5am
    if (currentTime >= times.night.start || currentTime < times.night.end) {
        document.body.dataset.jgTheme = "night";
        console.log("night");
    }

    // If the browser's theme is dark, set the theme to dark
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.dataset.jgTheme = document.body.dataset.jgTheme + "-dark";
        console.log("dark");
    }
}

// Set the theme
setTimeTheme();

// Watch for changes to the browser's theme and update the theme accordingly
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setTimeTheme();
});

