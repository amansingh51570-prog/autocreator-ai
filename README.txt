AUTOCREATOR AI — ANDROID-FRIENDLY STARTER

What this build does:
- Responsive mobile-first content studio dashboard.
- Lets you enter a topic, category and target duration.
- Creates a local content brief for a Hinglish Short/Reel.
- Includes a PWA manifest and offline service worker foundation.

What it does NOT do yet:
- It does not call an AI model or generate a finished script.
- It does not generate voice, video or music.
- It does not upload to YouTube or Instagram.
Those will be added in later steps. Do not put API keys in browser JavaScript.

NEXT STEP (when ready):
1. Create a free GitHub account.
2. Create a public repository named autocreator-ai.
3. Upload index.html, style.css, app.js, manifest.json and service-worker.js to the repository root.
4. In GitHub repository Settings > Pages, deploy from the main branch and root folder.
5. Open the published HTTPS website in Chrome on Android.
6. Chrome menu > Add to Home screen (or Install app, if offered).

To enable offline caching, add this line before </body> in index.html:
<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}
</script>

This is a starter prototype, not a native APK. It can be installed from the browser as a web app after HTTPS hosting.
