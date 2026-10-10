---
id: links-hyperlinks
slug: links-hyperlinks
course: html5-complete-course
chapter: 6
topic: 6.1
title: Links & Hyperlinks
description: Learn how to connect web pages using the HTML anchor tag (<a>), absolute and relative URLs, bookmark jump links, and smart phone & email actions in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 1
keywords:
  - html links
  - anchor tag
  - href attribute
  - relative url
  - absolute url
  - mailto
  - tel
  - school html tutorial
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# Links & Hyperlinks (Connecting the World Wide Web) 🌐

Welcome to Chapter 6: **Links in HTML**!

Have you ever wondered why the World Wide Web is called a **"Web"**? 

Imagine a spider's web: every thread connects to another thread, creating an interconnected network where you can walk from any point to any other point.

In video games, imagine having a **teleportation portal**—you step inside, and WHOOSH! You are instantly transported across oceans to a new world.

In web development, **Hyperlinks** (or simply **links**) are those teleportation portals! With one gentle mouse click or screen tap, a link can take you:
- Across the globe to Wikipedia or YouTube.
- To another page on your school website.
- Straight down to an important announcement on the same page.
- Even trigger a direct phone call or email on your smartphone!

Without links, the internet would just be billions of lonely digital documents trapped on isolated computer hard drives. Links tie the entire digital universe together!

---

# The Anchor Element (`<a>`) ⚓

In HTML, we create links using the **`<a>` tag**.

Why did the inventors of HTML pick the letter **`a`**? 
Because **`a` stands for Anchor** ⚓!

Think of a big ship throwing its heavy iron anchor into the sea floor. The anchor hooks the ship firmly to a specific location. In the exact same way, the HTML `<a>` tag anchors a piece of text or an image to a web address!

### Anatomy of an Anchor Tag:

```html
<a href="https://mskinstitute.in">Visit MSK Institute</a>
```

```text
    <a   href="https://mskinstitute.in">   Visit MSK Institute   </a>
    ──   ──────────────────────────────    ───────────────────   ────
     │                 │                            │              │
 Opening Tag      Destination URL              Clickable Text  Closing Tag
              (Hypertext Reference)
```

1. **`<a>` (Opening Tag):** Tells the browser: *"Get ready, a clickable link starts here!"*
2. **`href` Attribute:** This is the most important attribute. **`href`** stands for **Hypertext Reference**. It holds the destination address where the user will land after clicking.
3. **Link Text:** The readable words between `<a>` and `</a>`. This is what the user sees on their screen (usually styled in blue with an underline).
4. **`</a>` (Closing Tag):** Marks the end of the clickable area.

---

# The 3 Main Types of Links 🗺️

Where can a link take you? There are three main destinations:

```text
               ┌─────────────────────────────────────┐
               │         3 TYPES OF HYPERLINKS       │
               └──────────────────┬──────────────────┘
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       ▼                          ▼                          ▼
 1. External Links          2. Internal Links          3. Bookmark / Jump Links
 (To another website)       (Same website, other page) (Same page, scroll down)
 e.g. https://google.com    e.g. about.html            e.g. #exam-schedule
```

---

### 1. External Links (Visiting Another Website) 🌍
An external link takes the user away from your website to a completely different website on the internet (like visiting Google, Wikipedia, or CBSE).

To create an external link, you must use an **Absolute URL**—which means writing the complete full address starting with **`https://`**:

```html
<!-- External Link to Wikipedia -->
<p>
  Learn more about space exploration on 
  <a href="https://www.wikipedia.org">Wikipedia</a>.
</p>

<!-- External Link to Google -->
<p>
  Need help with research? Try 
  <a href="https://www.google.com">Google Search</a>.
</p>
```

> ⚠️ **Important:** Always include `https://`! If you write `href="google.com"` without `https://`, the browser mistakenly thinks you are looking for a local file named `google.com` inside your computer folder!

---

### 2. Internal Links (Walking Around Your Own Website) 🏫
Imagine your school website has multiple pages:
- `index.html` (The Home Page)
- `about.html` (About Our Teachers)
- `courses.html` (Available Courses)
- `contact.html` (School Office Address)

When a visitor wants to move from the Home page to the About page, you use a **Relative URL** (pointing to a file inside the same website folder):

```html
<!-- Simple Navigation Menu -->
<nav>
  <a href="index.html">Home</a> |
  <a href="about.html">About Us</a> |
  <a href="courses.html">Our Courses</a> |
  <a href="contact.html">Contact Office</a>
</nav>
```

Because these files live in the same project directory, you don't need `https://`—just the file name!

---

### 3. Bookmark / Jump Links (The Page Elevator 🛗)
Have you ever visited a very long webpage—like a long Wikipedia article or a complete school syllabus—and wanted to jump straight to Chapter 10 without scrolling for 5 minutes?

You can create **Jump Links** that smoothly scroll directly to a specific section on the same page!

### How Jump Links Work in 2 Easy Steps:

**Step 1: Give your target heading an `id`:**
```html
<h2 id="sports-day">Annual Sports Day Schedule</h2>
```

**Step 2: Link to that `id` using a hashtag (`#`):**
```html
<a href="#sports-day">Jump to Sports Day Schedule 🏃</a>
```

You can even create a handy **"Back to Top"** button at the very bottom of your page:
```html
<a href="#top">Back to Top ⬆️</a>
```

---

# Smart Action Links (Call, Email & WhatsApp) 📱

Modern mobile phones, tablets, and laptops can perform smart native actions directly from an HTML link!

### 1. Click-to-Call (`tel:`)
When someone taps this link on their smartphone, their phone app opens with the phone number already dialed:

```html
<!-- Click to Call School Office -->
<a href="tel:+918393042166">📞 Call School Helpline: +91 83930 42166</a>
```

### 2. Click-to-Email (`mailto:`)
When clicked, this opens the user's default email app (like Gmail or Apple Mail) with the "To" address and even a pre-written subject line ready to send:

```html
<!-- Click to Compose an Email -->
<a href="mailto:contact@mskinstitute.in?subject=Admission%20Enquiry%20Class%2010">
  ✉️ Email Admissions Office
</a>
```

### 3. Direct WhatsApp Chat Link
You can create a link that opens a WhatsApp conversation with a preset greeting message:

```html
<!-- Click to Chat on WhatsApp -->
<a href="https://wa.me/918393042166?text=Hello%20Sir%2C%20I%20want%20information%20about%20coding%20classes">
  💬 Chat with MSK Mentors on WhatsApp
</a>
```

---

# Turning Images & Buttons into Clickable Links 🖼️

You don't have to link only plain text! You can put almost any HTML element inside an anchor tag—including images!

For example, when visitors click your school logo, you want them to return to the home page:

```html
<!-- Clickable School Logo Link -->
<a href="index.html">
  <img src="school-logo.png" alt="MSK Institute Home" width="120">
</a>
```

You can also style an anchor tag with colors and padding so it looks just like a modern rounded button:

```html
<!-- Link styled as a Button -->
<a href="register.html" style="background-color: #FF6B00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
  Register for Free Demo Class 🚀
</a>
```

---

# Default Link Colors (How Browsers Display Links) 🎨

By default, every web browser styles links in three distinct states so users know what is happening:

| Link State | Default Appearance | What It Means |
|---|---|---|
| **Unvisited Link** | **Blue with underline** | A link you have not clicked yet. |
| **Visited Link** | **Purple with underline** | A page you have already visited in this browser before. |
| **Active Link** | **Red with underline** | The exact moment your mouse button is held down over the link. |

---

# Common Beginner Mistakes (And How to Avoid Them) ⚠️

### 1. ⚠️ Forgetting `https://` on External Links
```html
<!-- ❌ WRONG: Tries to find a file named "google.com" on your computer! -->
<a href="google.com">Google</a>

<!-- ✅ CORRECT: Full web address with https:// -->
<a href="https://www.google.com">Google</a>
```

### 2. ⚠️ Forgetting the Closing `</a>` Tag
If you forget to close `</a>`, the browser thinks **everything below it until the end of your document is part of the link**! Your entire page will turn blue and clickable!
```html
<!-- ❌ WRONG: Missing closing tag! -->
<a href="about.html">About Us
<p>This whole paragraph accidentally becomes clickable too!</p>

<!-- ✅ CORRECT: Always close the anchor tag immediately -->
<a href="about.html">About Us</a>
<p>This paragraph remains normal text.</p>
```

### 3. ⚠️ Writing Vague Link Text like "Click Here"
Never write just "Click here" or "Read more". For students using screen-reader software (for visually impaired learners), "Click here" gives zero clue where the link goes!
```html
<!-- ❌ BAD: Vague and inaccessible -->
To download syllabus, <a href="syllabus.pdf">click here</a>.

<!-- ✅ GOOD: Clear and descriptive -->
<a href="syllabus.pdf">Download Class 10 Science Syllabus (PDF)</a>.
```

### 4. ⚠️ Confusing `href` with `src`
Remember: Images use `src` (source). Links use `href` (hypertext reference)!
```html
<!-- ❌ WRONG: Anchor tags do NOT use src! -->
<a src="contact.html">Contact Us</a>

<!-- ✅ CORRECT: Use href -->
<a href="contact.html">Contact Us</a>
```

---

# Quick Summary

- ✅ In HTML, hyperlinks are created using the **`<a>` tag** (Anchor tag ⚓).
- ✅ The **`href` attribute** (Hypertext Reference) specifies the destination web address.
- ✅ **External links** point to other websites and must always start with **`https://`** (Absolute URL).
- ✅ **Internal links** point to other pages inside your own website folder (Relative URL, like `about.html`).
- ✅ **Jump links** use `#id-name` to zoom directly to a specific section on the same page.
- ✅ Use **`tel:`** for click-to-call phone numbers and **`mailto:`** for click-to-compose emails.
- ✅ Images can be turned into clickable buttons by wrapping them inside `<a>...</a>`.
- ✅ Always write meaningful, descriptive link text instead of generic words like "Click here".

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. What does the letter "a" stand for in the HTML `<a>` tag?
A. Action
B. Address
C. Anchor
D. Article
**Answer:** C

---

### 2. Which attribute is used to specify the destination URL of a link?
A. `src`
B. `link`
C. `url`
D. `href`
**Answer:** D

---

### 3. Which of the following is the correct way to link to an external website?
A. `<a href="www.google.com">Google</a>`
B. `<a href="https://www.google.com">Google</a>`
C. `<a link="https://www.google.com">Google</a>`
D. `<a src="https://www.google.com">Google</a>`
**Answer:** B

---

### 4. How do you create an internal jump link that scrolls down to `<h2 id="syllabus">`?
A. `<a href="syllabus">Go to Syllabus</a>`
B. `<a href="#syllabus">Go to Syllabus</a>`
C. `<a target="#syllabus">Go to Syllabus</a>`
D. `<a id="syllabus">Go to Syllabus</a>`
**Answer:** B

---

### 5. What special prefix is used to create a click-to-call phone link?
A. `call:`
B. `phone:`
C. `dial:`
D. `tel:`
**Answer:** D

---

# Hands-on Practice Challenge 🎯

Open VS Code and create a file named **`school-portal.html`**.

### Your Challenge:
Create a mini School Website Home Page with working links:
1. **Top Navigation Bar:** Add internal links for `Home`, `About School`, `Admissions`, and `Contact Office`.
2. **Featured Section:** Add an external link to Wikipedia's page on Indian Space Research (`https://en.wikipedia.org/wiki/ISRO`).
3. **Jump Link:** Add a link at the top saying *"Jump to Principal's Message"*, which smoothly scrolls down to an `<h3 id="principal">` heading.
4. **Smart Action Bar:** Add a helpline section at the bottom with:
   - A `tel:` link to your school office phone.
   - A `mailto:` link to the admissions office email.
5. Open your file in Chrome or Edge and test clicking every single link!

---

**Next Up:** In Topic 6.2, we will explore **Target Attributes & Hyperlink Security**—how to open links in brand new browser tabs safely without exposing your website to hackers!
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Target Attributes & Security** (Links).

👉 **[Continue to Next Lesson: Target Attributes & Security →](/tutorials/html5-complete-course/target-attributes-security)**
