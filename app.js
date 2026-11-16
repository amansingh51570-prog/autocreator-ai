const topic = document.querySelector("#topic");
const category = document.querySelector("#category");
const duration = document.querySelector("#duration");
const draftPanel = document.querySelector("#draftPanel");
const draftText = document.querySelector("#draftText");

document.querySelector("#draftBtn").addEventListener("click", () => {
  const idea = topic.value.trim();
  if (!idea) {
    topic.focus();
    topic.placeholder = "Pehle apna video topic likhiye…";
    return;
  }
  const brief = `AUTOCREATOR AI — CONTENT BRIEF

Topic: ${idea}
Category: ${category.value}
Language: Hinglish
Target duration: ${duration.value} seconds
Formats: YouTube Shorts + Instagram Reels

SCRIPT STRUCTURE
1. Hook (first 2–3 seconds): Start with a surprising question or bold statement.
2. Main content: Explain the idea in simple, natural Hinglish.
3. Retention: Add a curiosity gap or mini-reveal halfway through.
4. Ending: Finish with a memorable takeaway and a natural call to action.

VOICE & STYLE
Energetic, conversational Hinglish. Short sentences. Avoid unsupported facts and copyrighted material.

NEXT: Connect an AI text model to turn this brief into a complete timed script.`;
  draftText.textContent = brief;
  draftPanel.classList.remove("hidden");
  draftPanel.scrollIntoView({behavior:"smooth", block:"start"});
});

document.querySelector("#copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(draftText.textContent);
    document.querySelector("#copyBtn").textContent = "Copied ✓";
  } catch {
    document.querySelector("#copyBtn").textContent = "Select and copy the text";
  }
});
