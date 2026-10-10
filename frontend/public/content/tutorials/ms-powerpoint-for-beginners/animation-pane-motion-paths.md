# The Animation Pane, Sequencing, Delays & Motion Paths

Complex multi-layered presentations require orchestrating dozens of overlapping elements. The **Animation Pane** provides a visual timeline interface where you can precisely sequence animations, calibrate millisecond delays, synchronize parallel effects, and craft customized motion paths.

![Animations & Animation Pane](/images/tutorials/ms-powerpoint/animations-and-pane.svg)

---

## Opening and Navigating the Animation Pane

To open the timeline editor:
1. Go to the **Animations** tab.
2. In the **Advanced Animation** group, click **Animation Pane**.
3. A dedicated sidebar opens on the right side of the screen displaying every animated event on the active slide.
4. Each entry displays:
   - **Trigger Icon**: A mouse cursor (On Click), a clock with arrow (With/After Previous), or a specific button name.
   - **Color-Coded Star**: Green (Entrance), Yellow (Emphasis), Red (Exit), or Blue (Motion Path).
   - **Object Label**: Name of the targeted shape or text box (e.g., `Title 1`, `Rounded Rectangle 4`).
   - **Timeline Bar**: Visual bar representing start delay and total duration.

---

## Reordering & Grouping Events

- **Drag and Drop**: Click any animation in the list and drag it up or down to change its playback order.
- **Move Earlier / Move Later**: Use the small triangular arrow buttons located at the bottom of the Animation Pane.
- **Preview Selected**: Click **Play From** to test the animation sequence starting from a specific event without running the full slide show.

---

## The Effect Options Dialog Box

Double-clicking any animation in the Animation Pane (or right-clicking and choosing **Effect Options**) unlocks granular controls:
- **Smooth Start & Smooth End**: Adds realistic physics easing (acceleration and deceleration) so objects glide naturally instead of starting and stopping abruptly.
- **Bounce End**: Adds an organic elastic bounce when a falling object hits its final position.
- **Animate Text**:
  - *All at once*: Displays the entire text block simultaneously.
  - *By word*: Drops or reveals words one by one.
  - *By letter*: Types out text character by character (typewriter effect) with a customizable percentage delay.
- **After Animation (Dimming Text)**: Changes the color of prior bullet points to a muted light gray as soon as the next point appears. This keeps the active point prominent while preventing previous text from disappearing entirely!

---

## Drawing & Editing Custom Motion Paths

Motion paths move objects along predefined or freehand tracks:
1. Select the object and go to **Animations > Add Animation > Motion Paths > Custom Path**.
2. Click and draw a line or curved path across your slide canvas. Double-click to complete the path.
3. PowerPoint draws a dashed line with a **Green circle** (Starting point) and a **Red triangle** (Destination point).
4. **Edit Points**: Right-click the path line on your canvas and select **Edit Points**. You can now drag vertex handles to curve, stretch, or redirect the exact flight path of your object with vector precision!
5. **Lock vs. Unlock**:
   - *Locked Path*: Object travels to the exact coordinate on the slide regardless of where the object is moved.
   - *Unlocked Path*: The flight path shifts relative to wherever the object is positioned.

# Multiple Choice Questions

### 1. Which tool opens the visual timeline sidebar displaying all animations, playback order, and duration bars on the active slide?
A. Selection Pane
B. Animation Pane
C. Format Background
D. Document Inspector
**Answer:** B
**Explanation:** The Animation Pane on the Animations tab provides a chronological sidebar to manage, reorder, and configure every animation event on a slide.

---

### 2. What effect creates a subtle deceleration at the conclusion of a motion path so an object glides smoothly to a stop?
A. Bounce End
B. Smooth End
C. After Previous
D. Wipe Down
**Answer:** B
**Explanation:** "Smooth End" applies deceleration physics, causing flying or moving objects to ease gracefully to a stop rather than halting rigidly.

---

### 3. In the Animation Effect Options dialog, what does the "After Animation" dimming setting accomplish?
A. It deletes the slide background
B. It changes earlier bullet points to a muted color (like light gray) when the next point appears, maintaining audience focus on the active topic
C. It dims room lighting
D. It restarts the presentation from Slide 1
**Answer:** B
**Explanation:** Setting "After Animation" to a dim gray color keeps prior points readable in the background while clearly distinguishing the currently spoken bullet.

---

### 4. What visual markers represent the starting and ending points of a motion path on the slide canvas?
A. Blue square and Yellow circle
B. Green circle (Start) and Red triangle (End)
C. Black cross and White star
D. Purple diamond and Orange arrow
**Answer:** B
**Explanation:** A green circle marks the initial coordinates where motion begins, and a red triangle designates the final destination point of the path.

---

### 5. How can you curve or modify individual inflection points along an existing custom motion path?
A. Right-click the motion path and select "Edit Points"
B. Double-click the File tab
C. Use the Format Painter
D. Crop the motion path
**Answer:** A
**Explanation:** Selecting "Edit Points" on a motion path reveals editable vector Bezier anchor points that can be moved or curved to shape the trajectory.

---
