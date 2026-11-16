
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
  title.style.marginBottom = "8px";

  const text = document.createElement("p");
  text.textContent = content || "Not available";
  text.style.whiteSpace = "pre-wrap";
  text.style.overflowWrap = "anywhere";

  section.append(title, text);
  container.appendChild(section);
}

draftBtn.addEventListener("click", async () => {
  const idea = topic.value.trim();

  if (!idea) {
    topic.focus();
    topic.placeholder = "Pehle apna video topic likhiye…";
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
      headers: {
        "Content-Type": "application/json"
      },
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
      throw new Error("Server returned an unreadable response. Please try again.");
    }

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Content generation failed.");
    }

    draftText.textContent = result.script || "No script returned.";

    draftPanel.querySelector("h2").textContent =
      "Your AI-generated content";

    draftPanel.querySelector(".tag").textContent =
      "AI GENERATED";

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
    draftBtn.innerHTML = 'Create script draft <span>→</span>';
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
