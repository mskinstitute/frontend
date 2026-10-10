# Capstone Project 2: Building an Interactive Non-Linear Quiz Game

Presentations do not have to be passive lectures. By orchestrating **Slide Hyperlinks**, **Action Buttons**, and **Animation Triggers**, you can transform PowerPoint into an interactive trivia quiz game, an e-learning assessment module, or an automated classroom game show complete with score keeping and instant feedback!

---

## Project Concept & Game Architecture

In this capstone project, you will build a 5-question interactive quiz application featuring:
- A **Start Game Landing Menu**
- **Question Slides** with 4 clickable multiple-choice answer buttons
- An instant **"Correct Answer! 🎉"** victory slide that advances the score
- An instant **"Try Again! ❌"** feedback slide that links back to re-attempt the question
- An interactive **Final Score / Certificate of Completion** slide

---

## The Secret: Disabling "Advance on Mouse Click"

In standard PowerPoint presentations, clicking anywhere on the background advances to the next slide. In an interactive game, this ruins the mechanics—the user should *only* navigate by clicking deliberate game buttons!

To lock down navigation:
1. Switch to **Slide Sorter View** and press **`Ctrl + A`** to select every slide in the deck.
2. Go to the **Transitions** tab.
3. In the **Timing** group, **uncheck [ ] On Mouse Click**.
4. Now, if a user clicks blank canvas areas during the game, nothing happens! Navigation occurs strictly when clicking programmed interactive buttons.

---

## Step-by-Step Interactive Mechanics

### Step 1: Designing the Question Slide
1. Insert a slide with the question: *"What is the keyboard shortcut to insert a new slide in PowerPoint?"*.
2. Draw 4 rounded rectangle shapes as answer buttons:
   - Button A: `Ctrl + N` (Incorrect)
   - Button B: `Ctrl + M` (Correct!)
   - Button C: `Ctrl + Shift + S` (Incorrect)
   - Button D: `Alt + P` (Incorrect)

### Step 2: Building the Feedback Slides
- **Slide 10 ("Try Again" Slide)**: Features a red badge, a friendly explanation of why the answer was wrong, and an Action Button labeled `🔄 Re-attempt Question`.
- **Slide 11 ("Correct!" Slide)**: Features green confetti, celebratory sound, and an Action Button labeled `Next Question ➔`.

### Step 3: Hyperlinking the Answer Buttons
1. Select **Button A**: Press **`Ctrl + K`** > **Place in This Document** > select **Slide 10 (Try Again)**.
2. Select **Button B** (the correct answer): Press **`Ctrl + K`** > select **Slide 11 (Correct!)**.
3. Select Buttons C and D: Link to Slide 10 (Try Again).
4. On Slide 10 (Try Again): Configure the "Re-attempt" button via **Insert > Action > Hyperlink to: Last Slide Viewed**! This ensures the player returns to whichever question they just missed.
5. On Slide 11 (Correct!): Link the "Next Question" button to the upcoming Question 2 slide.

---

## Advanced: Adding Animation Triggers for In-Slide Feedback

If you prefer keeping feedback on the *same slide* rather than branching:
1. Draw a green checkmark icon and a red "X" shape over the answers, initially set to hidden.
2. Go to **Animations > Add Animation > Zoom (Entrance)** on the green checkmark.
3. With the checkmark selected, click **Animations > Trigger > On Click of > [Button B - Correct]**!
4. Now, the green checkmark appears only when the user clicks Button B!

# Multiple Choice Questions

### 1. What critical setting on the Transitions tab must be disabled across all slides when creating an interactive quiz or game in PowerPoint?
A. Apply to All
B. On Mouse Click
C. Duration
D. Sound
**Answer:** B
**Explanation:** Disabling "On Mouse Click" prevents arbitrary clicks on the background from advancing slides, forcing the player to interact exclusively through programmed buttons.

---

### 2. Which Hyperlink destination option on a "Try Again" feedback button returns the user directly back to whichever question slide they just answered incorrectly?
A. First Slide
B. Last Slide Viewed
C. Next Slide
D. Slide 1
**Answer:** B
**Explanation:** Linking to "Last Slide Viewed" acts as a dynamic browser back button, returning the player to the exact question slide they came from.

---

### 3. What feature on the Animations tab allows an entrance effect to trigger exclusively when a specific button shape is clicked by the user?
A. Animation Painter
B. Trigger (On Click of...)
C. Delay Timer
D. Motion Path
**Answer:** B
**Explanation:** The "Trigger" command specifies an exact shape on the slide that must be clicked to execute the designated animation event.

---

### 4. Which keyboard shortcut opens the Hyperlink dialog box to connect an answer button to a target slide?
A. Ctrl + K
B. Ctrl + G
C. Ctrl + T
D. Alt + Enter
**Answer:** A
**Explanation:** Ctrl + K is the standard shortcut to attach hyperlinks to shapes or text.

---

### 5. Why are interactive PowerPoint presentations well-suited for self-paced employee onboarding and museum kiosks?
A. They require no internet connection and run self-contained non-linear learning pathways
B. They cannot be exported
C. They prevent the monitor from turning off
D. They automatically print certificates on plain paper
**Answer:** A
**Explanation:** Non-linear interactive presentations operate offline as self-guided interactive kiosks, allowing users to explore at their own pace without external software.

---
