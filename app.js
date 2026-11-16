
const topic = document.querySelector("#topic");
const category = document.querySelector("#category");
const duration = document.querySelector("#duration");
const draftPanel = document.querySelector("#draftPanel");
const draftText = document.querySelector("#draftText");
const draftBtn = document.querySelector("#draftBtn");
const copyBtn = document.querySelector("#copyBtn");

const API_URL =
  "https://autocreator-api.amansingh51570.workers.dev";

draftBtn.addEventListener("click", async () => {
  const idea = topic.value.trim();

  if (!idea) {
    topic.focus();
    topic.placeholder = "Pehle apna video topic likhiye…";
    return;
  }

  draftBtn.disabled = true;
  draftBtn.textContent = "Generating your AI script...";

  draftPanel.classList.remove("hidden");
  draftText.textContent = "Gemini is writing your Hinglish script...";
  draftPanel.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: idea,
        category: category.value,
        duration: Number(duration.value)
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.details || result.error || "Script generation failed.");
    }

    draftText.textContent = result.script;

    draftPanel.querySelector("h2").textContent =
      "Your AI-generated script";

    draftPanel.querySelector(".tag").textContent =
      "AI GENERATED";

    copyBtn.textContent = "Copy script";

    draftPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } catch (error) {
    draftText.textContent =
      "Sorry! Script generation failed.\n\n" +
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
