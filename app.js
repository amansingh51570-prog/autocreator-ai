
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
  heading.textContent = "🎨 Your Free Thumbnail";

  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.borderRadius = "14px";
  canvas.style.display = "block";

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
  gradient.addColorStop(0, "#10105c");
  gradient.addColorStop(0.5, "#5421a8");
  gradient.addColorStop(1, "#ed416d");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1280, 720);

  // Decorative circles
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.beginPath();
  ctx.arc(1100, 130, 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(80, 650, 230, 0, Math.PI * 2);
  ctx.fill();

  // Small decorative stars
  for (let i = 0; i < 45; i++) {
    const x = (i * 197 + 83) % 1280;
    const y = (i * 113 + 37) % 720;
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.beginPath();
    ctx.arc(x, y, 3 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  // Top label
  ctx.fillStyle = "#ffd54a";
  ctx.font = "bold 30px Arial";
  ctx.fillText("AUTO CREATOR AI", 65, 75);

  // Main title
  const words = String(title || "AMAZING FACTS")
    .toUpperCase()
    .split(/\s+/);

  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > 1050 && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }

  if (line) lines.push(line);

  const displayLines = lines.slice(0, 4);
  const fontSize = displayLines.length > 2 ? 76 : 94;

  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineHeight = fontSize * 1.2;
  const startY = 350 - ((displayLines.length - 1) * lineHeight) / 2;

  displayLines.forEach((item, index) => {
    const y = startY + index * lineHeight;

    ctx.lineWidth = 12;
    ctx.strokeStyle = "#17113c";
    ctx.strokeText(item, 640, y);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(item, 640, y);
  });

  // Bottom label
  ctx.fillStyle = "#ffd54a";
  ctx.font = "bold 34px Arial";
  ctx.textAlign = "center";
  ctx.fillText("WATCH NOW!", 640, 645);

  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "⬇ Download Thumbnail PNG";
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
    link.download = "autocreator-thumbnail.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  section.append(heading, canvas, downloadBtn);

  if (idea) {
    const note = document.createElement("p");
    note.textContent = "AI thumbnail concept: " + idea;
    note.style.marginTop = "12px";
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
