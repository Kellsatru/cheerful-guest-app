// ---------------------------------------------------------
// GET BRANCH & ROOM FROM URL
// ---------------------------------------------------------
const url = new URLSearchParams(window.location.search);
const branch = url.get("branch") || "unknown";
const room = url.get("room") || "unknown";


// ---------------------------------------------------------
// ON PAGE LOAD → WELCOME TEXT + WEATHER + LINK FIXING
// ---------------------------------------------------------
window.onload = () => {

    // -----------------------------------------
    // TIME-BASED GREETING
    // -----------------------------------------
    let hour = new Date().getHours();
    let greeting = "Welcome";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    const welcomeText = document.querySelector(".welcome-text");
    if (welcomeText) welcomeText.textContent = `${greeting}, Guest`;


    // -----------------------------------------
    // SHOW BRANCH + ROOM
    // -----------------------------------------
    let br = document.getElementById("branch-room");
    if (br) br.textContent = branch.toUpperCase() + " • Room " + room;


    // -----------------------------------------
    // FIX SERVICE PAGE LINKS WITH CORRECT ROOM + BRANCH
    // -----------------------------------------
    const pages = ["hk", "mt", "ln", "am", "rs", "ct"];
    for (let p of pages) {
        let link = document.getElementById(p + "-link");
        if (link) {
            link.href = `${link.href}?branch=${branch}&room=${room}`;
        }
    }


    // -----------------------------------------
    // UNAIZAH WEATHER API
    // -----------------------------------------
    fetch("https://api.open-meteo.com/v1/forecast?latitude=26.084&longitude=43.974&current_weather=true")
        .then(response => response.json())
        .then(data => {
            const temp = data.current_weather.temperature;
            const weatherCode = data.current_weather.weathercode;

            // Choose icon
            let icon = "☀️";
            if (weatherCode >= 45 && weatherCode <= 4
