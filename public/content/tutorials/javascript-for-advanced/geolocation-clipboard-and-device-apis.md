# Geolocation, Clipboard & Device APIs in Modern JavaScript

Modern web applications can access native device capabilities—including GPS coordinates, the system clipboard, hardware vibration motors, and battery status. These **Device APIs** enable web apps to provide native-app-like user experiences while respecting user privacy and security sandboxes.

---

## 1. The Geolocation API

The `navigator.geolocation` interface provides access to the device's physical geographic location (GPS, Wi-Fi tri-angulation, cell towers):

```javascript
function getUserLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  const options = {
    enableHighAccuracy: true, // Use GPS hardware if available
    timeout: 5000,            // Max wait time (5s)
    maximumAge: 0             // Do not use cached position
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`User Coordinates: ${latitude}, ${longitude} (Accuracy: ${accuracy}m)`);
      console.log('Timestamp:', new Date(position.timestamp));
    },
    (error) => {
      console.error(`Geolocation error (${error.code}): ${error.message}`);
      // Error codes: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
    },
    options
  );
}
```

---

## 2. The Async Clipboard API (`navigator.clipboard`)

Replacing the legacy, insecure `document.execCommand('copy')`, the modern **Async Clipboard API** enables safe reading and writing to the system clipboard with Promise-based asynchronous calls:

```javascript
// Copy text to system clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Content successfully copied to clipboard!');
    showToast('Copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy text:', err);
  }
}

// Read text from system clipboard (Requires explicit user permission!)
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Pasted text:', text);
    return text;
  } catch (err) {
    console.error('Failed to read clipboard:', err);
  }
}
```

---

## 3. The Vibration API (`navigator.vibrate`)

Provides physical haptic feedback on supported mobile devices:

```javascript
function triggerHapticFeedback() {
  if (navigator.vibrate) {
    // Vibrate for 200ms
    navigator.vibrate(200);

    // Vibration pattern: Vibrate 100ms, pause 50ms, vibrate 100ms
    // navigator.vibrate([100, 50, 100]);
  }
}
```

---

## 4. The Permissions API: Querying Hardware Status

Before invoking intrusive device features, use the **Permissions API** to inspect whether permission has already been granted, denied, or needs a prompt:

```javascript
async function checkLocationPermission() {
  const status = await navigator.permissions.query({ name: 'geolocation' });
  console.log('Permission state:', status.state); // 'granted', 'denied', or 'prompt'

  status.onchange = () => {
    console.log('Permission state changed to:', status.state);
  };
}
```

---

## 5. Security Requirements: Secure Contexts (HTTPS)

All modern Device APIs require a **Secure Context (HTTPS or localhost)** and explicit **User Gesture Activation** (e.g., must be triggered inside a `click` event listener). Invoking `navigator.clipboard.writeText()` automatically on page load without user interaction throws a `NotAllowedError`.

---

## Practice Quiz

### Q1: What security environment is strictly required to access Device APIs like Geolocation and Clipboard?
- A) Any HTTP website
- B) A Secure Context (HTTPS or localhost) paired with user gesture activation
- C) A local file:/// URL
- D) Private browsing mode
**Answer:** B
**Explanation:** Modern browsers enforce that sensitive Device APIs operate exclusively in Secure Contexts (HTTPS) and require user interaction (transient activation).

### Q2: What modern Promise-based API replaces the deprecated document.execCommand('copy')?
- A) window.copy()
- B) navigator.clipboard.writeText(text)
- C) document.setClipboard()
- D) System.clipboard()
**Answer:** B
**Explanation:** `navigator.clipboard.writeText()` is the modern, asynchronous W3C standard for writing content to the system clipboard.

### Q3: What happens if a user denies location permissions when navigator.geolocation.getCurrentPosition() is called?
- A) The computer shuts down
- B) The error callback executes with an error.code of 1 (PERMISSION_DENIED)
- C) It falls back to IP geolocation automatically
- D) It retries indefinitely
**Answer:** B
**Explanation:** If the user rejects the browser permission prompt, the failure callback is invoked with error code 1 (`PERMISSION_DENIED`).

### Q4: Which API enables checking whether a device permission is currently 'granted', 'denied', or 'prompt' without triggering a prompt?
- A) navigator.permissions.query({ name: '...' })
- B) window.checkPermission()
- C) document.hasPermission()
- D) navigator.security()
**Answer:** A
**Explanation:** `navigator.permissions.query()` inspects the current authorization state without opening a popup dialog.

### Q5: What does navigator.vibrate([100, 200, 100]) do on supported mobile hardware?
- A) Plays a 100Hz audio tone
- B) Vibrates for 100ms, pauses for 200ms, and vibrates again for 100ms
- C) Throws a RangeError
- D) Sets screen brightness
**Answer:** B
**Explanation:** Arrays passed to `navigator.vibrate()` define alternating intervals of vibration duration and pause duration in milliseconds.
