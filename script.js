// ----------------------------
// GET BRANCH + ROOM FROM URL
// ----------------------------
const url = new URLSearchParams(window.location.search);
const branch = url.get("branch") || "unknown";
const room = url.get("room") || "unknown";


// ----------------------------
// ON PAGE LOAD – Hero UI Setup
// ----------------------------
window.onload = () => {

    // TIME-BASED GREETING
    let hour = new Date().getHours();
    let greeting = "Welcome";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    document.getElementById("hero-greeting").textContent = `${greeting}, Guest`;

    // ROOM DISPLAY
    document.getElementById("hero-room").textContent =
        `${branch.toUpperCase()} • Room ${room}`;

    // WEATHER API (Unaizah)
    fetch("https://api.open-meteo.com/v1/forecast?latitude=26.084&longitude=43.974&current_weather=true")
        .then(r => r.json())
        .then(data => {
            const temp = data.current_weather.temperature;
            const code = data.current_weather.weathercode;

            let icon = "☀️";
            if (code >= 45 && code <= 48) icon = "🌫️";
            if (code >= 51 && code <= 67) icon = "🌧️";
            if (code >= 71 && code <= 77) icon = "❄️";
            if (code >= 80 && code <= 82) icon = "🌦️";
            if (code >= 95) icon = "⛈️";

            document.getElementById("weatherText").textContent =
                `${icon} ${temp}°C`;
        })
        .catch(() => {
            document.getElementById("weatherText").textContent = "--°C";
        });
};


// ----------------------------
// FIREBASE IMPORTS
// ----------------------------
import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


// ----------------------------
// SEND REQUEST FUNCTION
// ----------------------------
export function sendRequest(requestText) {

    const timestamp = new Date().toLocaleString();

    const data = {
        branch,
        room,
        request: requestText,
        status: "pending",
        time: timestamp
    };

    push(ref(db, "requests"), data);

    // WhatsApp Notification
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
