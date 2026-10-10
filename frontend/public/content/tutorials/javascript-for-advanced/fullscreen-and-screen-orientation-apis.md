# Fullscreen & Screen Orientation APIs in Modern JavaScript

For multimedia players, presentation tools, dashboards, and mobile web games, engaging the user requires removing browser chrome (toolbars, address bars) and managing display layout. The **Fullscreen API** and **Screen Orientation API** provide programmatic control over the viewport display mode.

---

## 1. The Fullscreen API

The Fullscreen API allows any HTML element—or the entire document—to expand to fill the entire physical screen.

### Entering & Exiting Fullscreen:
```javascript
const videoPlayer = document.querySelector('#video-container');
const fullscreenBtn = document.querySelector('#btn-fullscreen');

async function toggleFullscreen() {
  // If not currently in fullscreen, request it
  if (!document.fullscreenElement) {
    try {
      // Must be triggered by a direct user gesture (click/keypress)!
      await videoPlayer.requestFullscreen();
      console.log('Entered Fullscreen mode.');
    } catch (err) {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    }
  } else {
    // Exit fullscreen
    await document.exitFullscreen();
    console.log('Exited Fullscreen mode.');
  }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);
```

---

## 2. Fullscreen Event & Pseudo-Class

### Listening to Changes:
```javascript
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    console.log('Active fullscreen element:', document.fullscreenElement);
    fullscreenBtn.textContent = 'Exit Fullscreen';
  } else {
    console.log('Returned to normal windowed view.');
    fullscreenBtn.textContent = 'Enter Fullscreen';
  }
});
```

### Styling with CSS `:fullscreen` Pseudo-Class:
```css
/* Style element specifically when it is in fullscreen mode */
#video-container:fullscreen {
  width: 100vw;
  height: 100vh;
  background-color: black;
}

/* Style child controls during fullscreen */
#video-container:fullscreen .controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
```

---

## 3. The Screen Orientation API

Mobile web applications often require locking the display to landscape (for video/gaming) or portrait:

```javascript
// Inspect current orientation
console.log('Orientation Type:', screen.orientation.type);   // 'portrait-primary', 'landscape-primary'
console.log('Orientation Angle:', screen.orientation.angle); // 0, 90, 180, 270

// Listen for device orientation rotations:
screen.orientation.addEventListener('change', () => {
  console.log(`Orientation rotated to: ${screen.orientation.type}`);
});

// Locking orientation (Requires Fullscreen mode on mobile!):
async function lockToLandscape() {
  try {
    await document.documentElement.requestFullscreen();
    await screen.orientation.lock('landscape');
    console.log('Screen locked to landscape mode.');
  } catch (err) {
    console.warn('Orientation lock failed or unsupported:', err);
  }
}

function unlockOrientation() {
  screen.orientation.unlock();
}
```

---

## 4. Security Requirement: User Gesture Gating

To prevent malicious websites from hijacking user screens, `requestFullscreen()` **strictly requires a transient user gesture** (e.g. click or key down). Calling `element.requestFullscreen()` automatically inside `setTimeout()` or on page load throws a `TypeError: Permissions check failed`.

---

## Practice Quiz

### Q1: What property on the document object indicates which element is currently expanded to fullscreen mode?
- A) document.activeElement
- B) document.fullscreenElement
- C) window.fullscreen
- D) document.isFullScreen
**Answer:** B
**Explanation:** `document.fullscreenElement` returns the DOM element currently presented in fullscreen mode, or `null` if the page is in standard windowed mode.

### Q2: Why will calling element.requestFullscreen() immediately upon page load fail?
- A) Fullscreen requires WebAssembly
- B) The Fullscreen API requires a transient user gesture (such as a click or button tap) to prevent unauthorized screen hijacking
- C) It is blocked by CSS
- D) It only works on Linux
**Answer:** B
**Explanation:** Browsers enforce security boundaries preventing fullscreen expansion unless directly initiated by an explicit user gesture.

### Q3: What CSS pseudo-class matches elements that are currently displayed in fullscreen mode?
- A) :full
- B) :fullscreen
- C) ::screen
- D) :maximized
**Answer:** B
**Explanation:** The `:fullscreen` pseudo-class allows custom CSS styling to be applied to an element when it enters fullscreen presentation.

### Q4: On mobile devices, what must typically occur before calling screen.orientation.lock('landscape')?
- A) The device must enter Fullscreen mode
- B) Wi-Fi must be disconnected
- C) A cookie must be saved
- D) The user must restart their phone
**Answer:** A
**Explanation:** On mobile web browsers, screen orientation locking is restricted to applications that have already engaged Fullscreen mode.

### Q5: How do you exit fullscreen mode programmatically?
- A) element.closeFullscreen()
- B) document.exitFullscreen()
- C) window.minimize()
- D) document.cancelFullscreen()
**Answer:** B
**Explanation:** `document.exitFullscreen()` returns the browser document to standard windowed mode.
