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

    // Show room and branch on the page
    let br = document.getElementById("branch-room");
    if (br) br.textContent = branch.toUpperCase() + " • Room " + room;

    // Update all homepage links with correct parameters
    const pages = ["hk", "mt", "ln", "am", "rs", "ct"];
    for (let p of pages) {
        let link = document.getElementById(p + "-link");
        if (link) {
            link.href = link.href + "?branch=" + branch + "&room=" + room;
        }
    }
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
