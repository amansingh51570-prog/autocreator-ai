
const topic = document.querySelector("#topic");
const category = document.querySelector("#category");
const duration = document.querySelector("#duration");
const draftPanel = document.querySelector("#draftPanel");
const draftText = document.querySelector("#draftText");
const draftBtn = document.querySelector("#draftBtn");
const copyBtn = document.querySelector("#copyBtn");

const API_URL = "https://autocreator-api.amansingh51570.workers.dev";

function addResultSection(container, heading, content) {
  const section = document.createElement("div");
  section.style.marginTop = "20px";
  section.style.padding = "14px";
  section.style.borderRadius = "12px";
  section.style.background = "rgba(128,128,128,0.12)";

  const title = document.createElement("h3");
  title.textContent = heading;

  const text = document.createElement("p");
  text.textContent = content || "Not available";
  text.style.whiteSpace = "pre-wrap";
  text.style.overflowWrap = "anywhere";

  section.append(title, text);
  container.appendChild(section);
}

  
function createThumbnail(container, title, idea) {
  const section = document.createElement("div");
  section.style.marginTop = "24px";

  const heading = document.createElement("h3");
  heading.textContent = "🎨 Your Shorts / Reels Thumbnail (9:16)";

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  canvas.style.width = "100%";
  canvas.style.maxWidth = "360px";
  canvas.style.height = "auto";
  canvas.style.display = "block";
  canvas.style.margin = "0 auto";
  canvas.style.borderRadius = "14px";

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
  gradient.addColorStop(0, "#10105c");
  gradient.addColorStop(0.5, "#5421a8");
  gradient.addColorStop(1, "#ed416d");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);

  // Decorative circles
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.beginPath();
  ctx.arc(900, 300, 230, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(100, 1700, 280, 0, Math.PI * 2);
  ctx.fill();

  // Stars
  for (let i = 0; i < 80; i++) {
    const x = (i * 197 + 83) % 1080;
    const y = (i * 113 + 37) % 1920;

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.arc(x, y, 3 + (i % 4), 0, Math.PI * 2);
    ctx.fill();
  }

  // Brand label
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffd54a";
  ctx.font = "bold 38px Arial";
  ctx.fillText("AUTO CREATOR AI", 540, 180);

  // Main title
  const words = String(title || "AMAZING FACTS")
    .toUpperCase()
    .split(/\s+/);

  const lines = [];
  let line = "";

  ctx.font = "bold 100px Arial";

  for (const word of words) {
    const test = line ? line + " " + word : word;

    if (ctx.measureText(test).width > 900 && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }

  if (line) lines.push(line);

  const displayLines = lines.slice(0, 5);
  const fontSize = displayLines.length > 3 ? 76 : 100;

  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textBaseline = "middle";

  const lineHeight = fontSize * 1.25;
  const startY = 900 - ((displayLines.length - 1) * lineHeight) / 2;

  displayLines.forEach((item, index) => {
    const y = startY + index * lineHeight;

    ctx.lineWidth = 14;
    ctx.strokeStyle = "#17113c";
    ctx.strokeText(item, 540, y);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(item, 540, y);
  });

  // Bottom label
  ctx.fillStyle = "#ffd54a";
  ctx.font = "bold 48px Arial";
  ctx.fillText("WATCH NOW!", 540, 1660);

  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "⬇ Download Portrait Thumbnail PNG";
  downloadBtn.style.width = "100%";
  downloadBtn.style.marginTop = "14px";
  downloadBtn.style.padding = "14px";
  downloadBtn.style.borderRadius = "10px";
  downloadBtn.style.border = "none";
  downloadBtn.style.background = "#6c43dc";
  downloadBtn.style.color = "white";
  downloadBtn.style.fontWeight = "bold";

  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "autocreator-shorts-thumbnail.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  section.append(heading, canvas, downloadBtn);

  if (idea) {
    const note = document.createElement("p");
    note.textContent = "AI thumbnail concept: " + idea;
    section.appendChild(note);
  }

  container.appendChild(section);
}

draftBtn.addEventListener("click", async () => {
  const idea = topic.value.trim();

  if (!idea) {
    topic.focus();
    return;
  }

  draftBtn.disabled = true;
  draftBtn.textContent = "Generating your content...";

  draftPanel.classList.remove("hidden");
  draftText.textContent = "Gemini is creating your content package...";

  const oldResults = draftPanel.querySelector("#extraResults");
  if (oldResults) oldResults.remove();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: idea,
        category: category.value,
        duration: duration.value
      })
    });

    const raw = await response.text();
    let result;

    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error("Server returned an unreadable response.");
    }

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Content generation failed.");
    }

    draftText.textContent = result.script || "No script returned.";

    const oldHeading = draftPanel.querySelector("h2");
    if (oldHeading) oldHeading.textContent = "Your AI-generated content";

    const extraResults = document.createElement("div");
    extraResults.id = "extraResults";
    draftText.after(extraResults);

    addResultSection(extraResults, "🎬 Video Title", result.title);
    addResultSection(extraResults, "📝 Video Description", result.description);

    const hashtags = Array.isArray(result.hashtags)
      ? result.hashtags.join(" ")
      : result.hashtags || "";

    addResultSection(extraResults, "#️⃣ Hashtags", hashtags);
    addResultSection(extraResults, "🖼️ Thumbnail Idea", result.thumbnail_idea);

    createThumbnail(
      extraResults,
      result.title || idea,
      result.thumbnail_idea
    );

    copyBtn.textContent = "Copy script";

    draftPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {
    draftText.textContent =
      "Sorry! Content generation failed.\n\n" +
      error.message +
      "\n\nPlease try again.";
  } finally {
    draftBtn.disabled = false;
    draftBtn.textContent = "Create script draft →";
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(draftText.textContent);
    copyBtn.textContent = "Copied ✓";
  } catch {
    copyBtn.textContent = "Select and copy the text";
  }
});

// FREE AI VOICEOVER FEATURE
let voiceoverUtterance;

function createVoiceover() {
  const script = document.getElementById("draftText").innerText;

  if (!script.trim()) {
    alert("Please generate a script first!");
    return;
  }

  if (!("speechSynthesis" in window)) {
    alert("Voiceover is not supported by this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  voiceoverUtterance = new SpeechSynthesisUtterance(script);
  const maleVoice = speechSynthesis.getVoices().find(v =>
  v.lang.startsWith("hi") &&
  /male|man|masculine/i.test(v.name)
);

if (maleVoice) {
  voiceoverUtterance.voice = maleVoice;
}
  voiceoverUtterance.rate = 0.95;
  voiceoverUtterance.pitch = 1;

  window.speechSynthesis.speak(voiceoverUtterance);
}

function stopVoiceover() {
  window.speechSynthesis.cancel();
}

// AUTOMATIC VIDEO GENERATOR
function createVideo() {
  const script = document.getElementById("draftText").innerText.trim();

  if (!script) {
    alert("Please generate a script first!");
    return;
  }

  const scenes = script
    .split(/[.!?।\n]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (!scenes.length) {
    alert("No scenes found!");
    return;
  }

  let videoWindow = window.open("", "_blank");

  if (!videoWindow) {
    alert("Please allow pop-ups for this website.");
    return;
  }

  videoWindow.document.write(`
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>AutoCreator Video</title>
      <style>
        body {
          margin: 0;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: Arial, sans-serif;
        }
        #screen {
  width: min(100vw, 56.25vh);
  aspect-ratio: 9 / 16;
  background: linear-gradient(135deg, #141e30, #243b55);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 25px;
  box-sizing: border-box;
  font-size: 30px;
  font-weight: bold;
  overflow: hidden;
  border-radius: 15px;
}

#screen > div {
  width: 100%;
}

#caption {
  line-height: 1.4;
  overflow-wrap: anywhere;
}
@keyframes aviMove {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

#screen img {
  animation: aviMove 2s ease-in-out infinite;
}
#caption {
  text-shadow: 2px 2px 8px #000;
  transition: opacity 0.4s ease;
  padding: 10px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
}
      </style>
    </head>
    <body>
      <div id="screen">
  <div style="text-align:center;">
    <img src="https://amansingh51570-prog.github.io/autocreator-ai/file_000000003440820897dc806d16d4f50a.png" alt="Avi" style="width:180px;height:220px;object-fit:contain;border-radius:16px;">
    <div style="font-size:28px;color:#ffd700;font-weight:bold;">AVI</div>
    <div id="caption" style="font-size:24px;color:white;margin-top:20px;">
      Your video is starting...
    </div>
  </div>
</div>
      <script>
        const scenes = ${JSON.stringify(scenes)};
        let index = 0;

        function showScene() {
  const caption = document.getElementById("caption");
  const words = scenes[index].split(/\s+/);
  let wordIndex = 0;

  caption.style.opacity = "0";

  setTimeout(() => {
    caption.textContent = "";
    caption.style.opacity = "1";

    const wordTimer = setInterval(() => {
      if (wordIndex < words.length) {
        caption.textContent +=
          (wordIndex === 0 ? "" : " ") + words[wordIndex];

        wordIndex++;
      } else {
        clearInterval(wordTimer);

        index = (index + 1) % scenes.length;
        setTimeout(showScene, 700);
      }
    }, 300);
  }, 300);
}

        showScene();
      <\/script>
    </body>
    </html>
  `);

  videoWindow.document.close();
}

// AUTOCREATOR AI - AVI CHARACTER PROFILE
const aviCharacter = {
  name: "Avi",
  type: "3D cartoon male",
  outfit: "Modern casual hoodie",
  language: "Hinglish",
  voice: "Male",
  speakingStyle: "Energetic and entertaining",
  roles: [
    "Direct-to-camera presenter",
    "Animated story character"
  ],
  videoFormat: "9:16 portrait"
};
