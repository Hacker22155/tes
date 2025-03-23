// Speech Recognition Setup
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
} else {
    console.error("Sorry, Speech Recognition is not supported in your browser.");
    document.querySelector(".error").style.display = "block";
    document.querySelector(".start").style.display = "none";
}

recognition.continuous = true;

recognition.onresult = event => {
    const speechToText = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    console.log(`You said: ${speechToText}`);
    document.querySelector(".command").innerHTML = speechToText;

    // Process the command
    handleCommands(speechToText);
};

// UI Elements
const start = document.querySelector(".start"),
    main = document.querySelector(".container"),
    icon = document.querySelector(".fa-microphone");

start.addEventListener("click", function () {
    main.style.display = "flex";
    this.style.display = "none";
    recognition.start();
});

// Command Handling
function handleCommands(text) {
    // Remove unnecessary words and filter out only numbers and operations
    text = text.replace(/please|tell me|calculate|answer quickly|what is|the|is|by|pls|what|how|say/gi, "").trim();

    if (text.includes("your name")) {
        speak("My name is Spidey. What is your name?");
    } else if (text.includes("search for")) {
        let query = text.replace("search for", "").trim();
        speak(`Searching for ${query} on Google`);
        window.open(`https://google.com/search?q=${query}`);
    } else if (text.includes("time")) {
        let t = currentTime();
        speak(t);
    } else if (text.includes("my name is")) {
        let name = text.replace("my name is", "").trim();
        speak(`Hello ${name}`);
    } else if (text.includes("bye")) {
        speak("Good Bye, Have a great day!");
    } else if (text.match(/[\dx+\-*/]/)) {
        calculate(text);
    } else {
        speak("Sorry, I can't recognize that.");
    }
}

// Get Current Time
function currentTime() {
    let date = new Date();
    return `It's ${date.getHours()} : ${date.getMinutes()} ${date.getHours() >= 12 ? "PM" : "AM"}`;
}

// Speak Function
function speak(text) {
    recognition.stop();
    let msg = new SpeechSynthesisUtterance(text);
    msg.onend = () => recognition.start();
    window.speechSynthesis.speak(msg);
}

// Math Calculation Function
function calculate(text) {
    // Convert number words to digits
    const numberWords = {
        "one": "1", "two": "2", "tow": "2", "three": "3", "four": "4",
        "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10"
    };

    for (let word in numberWords) {
        let regex = new RegExp(`\\b${word}\\b`, "gi");
        text = text.replace(regex, numberWords[word]);
    }

    // Convert operation words to symbols
    text = text.replace(/plus/gi, "+")
               .replace(/minus/gi, "-")
               .replace(/times|multiply/gi, "*")
               .replace(/divide/gi, "/")
               .replace(/x/gi, "*"); // Convert 'x' to '*'

    try {
        let result = Function(`"use strict"; return (${text})`)(); // Secure eval
        speak(`${text} equals ${result}`);
    } catch (error) {
        speak("Sorry, I couldn't calculate that. Please try again.");
    }
}
