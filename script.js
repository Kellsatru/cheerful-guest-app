// ---------------------------------------------------------
// Get branch & room from URL
// ---------------------------------------------------------
const url = new URLSearchParams(window.location.search);
const branch = url.get("branch") || "unknown";
const room = url.get("room") || "unknown";

// ---------------------------------------------------------
// When page loads → show room + branch AND fix links
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

    // Update greeting text
    const welcomeText = document.querySelector(".welcome-text");
    if (welcomeText) welcomeText.textContent = `${greeting}, Guest`;



    // -----------------------------------------
    // SHOW BRANCH & ROOM
    // -----------------------------------------
    let br = document.getElementById("branch-room");
    if (br) br.textContent = branch.toUpperCase() + " • Room " + room;



    // -----------------------------------------
    // UPDATE LINKS WITH BRANCH & ROOM
    // -----------------------------------------
    const pages = ["hk", "mt", "ln", "am", "rs", "ct"];
    for (let p of pages) {
        let link = document.getElementById(p + "-link");
        if (link) {
            link.href = link.href + "?branch=" + branch + "&room=" + room;
        }
    }



    // -----------------------------------------
    // LOAD UNAIZAH WEATHER
    // -----------------------------------------
    fetch("https://api.open-meteo.com/v1/forecast?latitude=26.084&longitude=43.974&current_weather=true")
        .then(response => response.json())
        .then(data => {
            const temp = data.current_weather.temperature;
            const weatherCode = data.current_weather.weathercode;

            let icon = "☀️";
            if (weatherCode >= 45 && weatherCode <= 48) icon = "🌫️";
            if (weatherCode >= 51 && weatherCode <= 67) icon = "🌧️";
            if (weatherCode >= 71 && weatherCode <= 77) icon = "❄️";
            if (weatherCode >= 80 && weatherCode <= 82) icon = "🌦️";
            if (weatherCode >= 95) icon = "⛈️";

            document.getElementById("weather").textContent =
                `${icon} ${temp}°C • Unaizah`;
        })
        .catch(() => {
            document.getElementById("weather").textContent = "Weather unavailable";
        });
};

};

// ---------------------------------------------------------
// Firebase import
// ---------------------------------------------------------
import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ---------------------------------------------------------
// Send request to Firebase + WhatsApp
// ---------------------------------------------------------
export function sendRequest(requestText) {

    const timestamp = new Date().toLocaleString();

    const data = {
        branch: branch,
        room: room,
        request: requestText,
        status: "pending",
        time: timestamp
    };

    // Save to Firebase
    push(ref(db, "requests"), data);

    // WhatsApp
    let msg =
        `Cheerful Hotel Request:\n` +
        `Branch: ${branch}\n` +
        `Room: ${room}\n` +
        `Request: ${requestText}\n` +
        `Time: ${timestamp}`;

    window.location.href =
        "https://wa.me/966560647000?text=" + encodeURIComponent(msg);
}

window.sendRequest = sendRequest;

