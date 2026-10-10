# Web Audio & MediaStream APIs Basics in Modern JavaScript

Modern browsers are capable of processing real-time audio synthesis, visual audio frequency analysis, camera streams, and screen recording without external plugins. The **Web Audio API** and the **MediaStream (WebRTC) API** provide low-level access to digital signal processing (DSP) and hardware media devices.

---

## 1. The Web Audio API: The AudioNode Graph

The Web Audio API operates as an **Audio Routing Graph**, where modular `AudioNode` instances are connected together from source to destination:

```
┌─────────────────────────────────────────────────────────────┐
│                     AUDIO ROUTING GRAPH                     │
├───────────────┬─────────────────────────────┬───────────────┤
│ Audio Source  │ Audio Processing Node       │ Destination   │
│ (Oscillator / │ (GainNode: volume,          │ (Speakers /   │
│  MP3 Buffer)  │  BiquadFilter: equalizer)   │  Headphones)  │
└───────┬───────┴──────────────┬──────────────┴───────▲───────┘
        │                      │                      │
        └──────► .connect() ───┴──────► .connect() ───┘
```

### Synthesizing a Pure Audio Tone:
```javascript
// Step 1: Create AudioContext (Audio processing environment)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency = 440, durationSeconds = 1) {
  // AudioContext requires a user gesture to resume in modern browsers!
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // Step 2: Create Sound Generator (OscillatorNode)
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle'
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // 440Hz = A4 musical note

  // Step 3: Create Volume Controller (GainNode)
  const gainNode = audioCtx.createGain();
  // Fade out smoothly using exponential ramp:
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationSeconds);

  // Step 4: Connect Graph: Oscillator -> Gain -> Hardware Speakers
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Step 5: Start & Stop playback
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + durationSeconds);
}
```

---

## 2. MediaStream API: Accessing Camera & Microphone

The `navigator.mediaDevices.getUserMedia()` API requests permission to capture live hardware audio and video:

```javascript
async function startWebcamPreview(videoElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720, facingMode: 'user' },
      audio: true
    });

    // Stream live webcam into HTML5 <video> element
    videoElement.srcObject = stream;
    videoElement.play();
  } catch (err) {
    console.error('Camera access denied or device not found:', err.message);
  }
}
```

---

## 3. Screen Recording with `getDisplayMedia()`

Capturing screen video for presentations or bug recordings:

```javascript
async function captureScreen(videoElement) {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' },
      audio: false
    });

    videoElement.srcObject = screenStream;
  } catch (err) {
    console.warn('Screen capture cancelled by user.');
  }
}
```

---

## 4. Teardown: Stopping Media Tracks

Leaving webcam or mic tracks running drains battery and keeps the hardware indicator light on. Always stop active tracks:

```javascript
function stopStream(mediaStream) {
  mediaStream.getTracks().forEach(track => {
    track.stop(); // Powers down camera/microphone hardware!
  });
}
```

---

## Practice Quiz

### Q1: How does the Web Audio API process audio data?
- A) By compiling MP3s to WebAssembly
- B) Through a modular AudioNode Graph, routing source nodes through effect/gain nodes to a destination
- C) By writing raw WAV files to localStorage
- D) Using CSS animations
**Answer:** B
**Explanation:** The Web Audio API routes audio through an AudioNode graph where sources (oscillators, buffers) connect through processing nodes (gains, filters) to `audioCtx.destination`.

### Q2: Why does AudioContext often initialize in a "suspended" state in modern browsers?
- A) It is an audio driver crash
- B) Browser Autoplay Policies require a user gesture (click, tap) before audio can play to prevent unwanted loud ads
- C) The speaker volume is zero
- D) Web Audio only works in HTTPS
**Answer:** B
**Explanation:** Browsers suspend new `AudioContext` instances until a direct user gesture occurs, preventing intrusive unsolicited audio playback.

### Q3: What API requests hardware permission to stream the user's camera and microphone?
- A) navigator.camera.record()
- B) navigator.mediaDevices.getUserMedia()
- C) window.getMedia()
- D) document.requestWebcam()
**Answer:** B
**Explanation:** `navigator.mediaDevices.getUserMedia()` is the standard Web API for accessing real-time camera and microphone streams.

### Q4: How do you turn off a user's webcam and shut down its hardware indicator light after streaming?
- A) Set video.srcObject = null
- B) Call track.stop() on every MediaStreamTrack returned by stream.getTracks()
- C) Close the browser tab
- D) Reload the webpage
**Answer:** B
**Explanation:** Calling `.stop()` on each track of a `MediaStream` explicitly releases the camera/microphone hardware lock.

### Q5: What API allows a web application to prompt the user to share their screen or a specific application window?
- A) navigator.mediaDevices.getDisplayMedia()
- B) navigator.screen.share()
- C) window.capture()
- D) document.requestScreen()
**Answer:** A
**Explanation:** `navigator.mediaDevices.getDisplayMedia()` prompts the user to select and share an entire display, application window, or browser tab.
