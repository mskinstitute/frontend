---
id: target-attributes-security
slug: target-attributes-security
course: html5-complete-course
chapter: 6
topic: 6.2
title: Target Attributes & Security
description: Learn how to control link destinations using the target attribute (_blank, _self), protect users from malicious tab redirection with rel="noopener noreferrer", and create downloadable links in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 2
keywords:
  - target attribute
  - target blank
  - link security
  - noopener noreferrer
  - reverse tabnabbing
  - download attribute
  - school html tutorial
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# Target Attributes & Link Security (Opening Tabs Safely) 🛡️

Welcome back! In the previous lesson, you learned how to connect web pages using the `<a>` (anchor) tag.

Now, imagine this real-life scenario:

A student is reading your school's website to prepare for their upcoming final exams. In your notes, you provide a helpful link to the official **CBSE Board Exam Sample Papers**.

When the student clicks that link:
- If the CBSE website opens in the **exact same tab**, it completely wipes out your school website from their screen!
- When they finish reading the sample paper and close the browser, they have lost your school website and might forget to come back!

Wouldn't it be so much better if clicking the link opened a **brand new tab** in their browser, keeping your school website safely open right behind it?

That is exactly what the **`target` attribute** does! But opening new tabs also has a sneaky cyber security risk that every young programmer must know how to defend against. Let's learn both!

---

# The `target` Attribute 🎯

The **`target` attribute** tells the browser **where** the linked webpage should be displayed when clicked.

```html
<a href="https://cbse.gov.in" target="_blank" rel="noopener noreferrer">
  Visit Official CBSE Portal
</a>
```

There are four official values you can give to the `target` attribute:

| Target Value | Where It Opens | When Should You Use It? |
|---|---|---|
| **`_blank`** | In a **brand new browser tab** or window. | **External websites**, user manuals, and documents you want users to view without leaving your site. |
| **`_self`** | In the **same tab** (replaces current page). | **Internal pages** of your own website (Default behavior if you omit `target`). |
| **`_parent`** | In the parent frame. | Used when working with embedded web boxes (`<iframe>`). |
| **`_top`** | In the full, top-level body of the window. | Used to break out of nested frames or embed boxes completely. |

---

# Deep Dive: `target="_blank"` vs `target="_self"`

### 1. `target="_blank"` (The New Tab Superpower 🆕)
When you add `target="_blank"`, clicking the link leaves your current tab untouched and pops open a fresh new tab:

```html
<!-- External Link opening in a fresh new tab -->
<p>
  Check out the latest space discoveries on the 
  <a href="https://www.isro.gov.in" target="_blank" rel="noopener noreferrer">
    Official ISRO Website 🚀
  </a>
</p>
```

---

### 2. `target="_self"` (The Same Tab Default 🔄)
By default, all links act as `target="_self"` even if you don't write it:

```html
<!-- Both of these links behave in the exact same way -->
<a href="about.html">About School</a>
<a href="about.html" target="_self">About School</a>
```

> 💡 **Best Practice Tip for School Projects:**
> - For pages inside your **own website** (`about.html`, `contact.html`), let them open in the same tab (`_self`). Opening 20 new tabs for your own pages annoys visitors!
> - For **external websites** (like Wikipedia, YouTube, or government portals), always open them in a new tab (`_blank`).

---

# The Hidden Cyber Danger: Reverse Tabnabbing 🕵️‍♂️

Now, here is a secret that many amateur web developers don't know: **Opening links in new tabs without precautions can expose your visitors to cyber hackers!**

### The "Fake Classroom Imposter" Analogy 🏫
Imagine you are sitting in your school classroom studying quietly. You send a friend out into the hallway to fetch a library book from another building. 

But while opening the door, you accidentally hand your friend a **duplicate master key to your classroom**! 

While your friend is away, an imposter sneakily uses that master key to walk into your classroom, picks up your real notebook, and swaps it with a **fake lookalike notebook** designed to steal your secrets!

---

### How This Happens on the Web:
In web browsers, when you open an external website using `target="_blank"` alone:

```html
<!-- ⚠️ DANGEROUS: Vulnerable to Reverse Tabnabbing! -->
<a href="https://external-website.com" target="_blank">
  Visit Partner Site
</a>
```

The new tab secretly gains a digital bridge back to your original page through a JavaScript feature called `window.opener`.

A malicious hacker on the external website can run a sneaky piece of code:
```javascript
// The hacker changes your original tab behind your back!
window.opener.location = "https://fake-phishing-login-page.com";
```

When the user finishes browsing the external site and switches back to their first tab, they suddenly see a fake login page that looks identical to Google, Gmail, or your school portal! Thinking they got logged out, they type their password—and the hacker steals it!

This cyber trick is called **Reverse Tabnabbing**.

---

# The Superhero Shield: `rel="noopener noreferrer"` 🛡️

Fortunately, web security experts gave us a simple, 100% effective defense: the **`rel` attribute**!

Whenever you write `target="_blank"`, you should **always** include:

$$\text{rel="noopener noreferrer"}$$

```html
<!-- 🛡️ The 100% Safe, Professional Standard -->
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  Visit Secure External Resource
</a>
```

### What Do These Two Magic Words Do?

1. **`noopener` (Locks the Door 🔒):**
   - It cuts the communication cord between the old tab and the new tab.
   - It sets `window.opener` to `null`.
   - Even if the external website is owned by a cyber criminal, it has **zero power** to touch or redirect your original tab!

2. **`noreferrer` (The Privacy Mask 🎭):**
   - It prevents the browser from sending a "Referer" header to the target site.
   - This hides your website's exact page URL from the destination server, protecting your users' privacy.

> 💡 **Did You Know?** Modern web browsers (like latest Chrome, Edge, and Firefox) automatically add `noopener` in the background when you use `target="_blank"`. However, professional software companies still explicitly write `rel="noopener noreferrer"` to guarantee protection for users on older browsers, mobile phones, or smart TVs!

---

# Bonus Superpower 1: The `download` Attribute 📥

What if you want a link to **download a file** straight to the student's computer or phone (like a PDF syllabus, homework sheet, or school song MP3), instead of displaying it in the browser?

Use the **`download` attribute**:

```html
<!-- Forces browser to download the file -->
<a href="files/class10-science-syllabus.pdf" download="CBSE-Class10-Science-2026.pdf">
  📥 Download Class 10 Science Syllabus (PDF)
</a>

<!-- Download School Application Form -->
<a href="forms/admission-form.docx" download>
  📄 Download Admission Form (Word Doc)
</a>
```

If you put a name inside `download="MyName.pdf"`, the browser will automatically rename the downloaded file to that exact clean name on the user's computer!

---

# Bonus Superpower 2: The `title` Attribute (Helpful Hover Tooltips 💬)

You can add a small, helpful hover note to any link using the **`title` attribute**:

```html
<a 
  href="https://www.isro.gov.in" 
  target="_blank" 
  rel="noopener noreferrer" 
  title="Official Website of Indian Space Research Organisation"
>
  ISRO Portal
</a>
```

When a user rests their mouse cursor over the link for a split second, a little yellow tooltip box pops up displaying your helpful hint!

---

# Common Beginner Mistakes (And How to Avoid Them) ⚠️

### 1. ⚠️ Writing `target="blank"` instead of `target="_blank"`
Notice the missing underscore (`_`)! 
- `_blank` (with an underscore) is a special browser keyword that opens a **new** tab every time.
- `blank` (without an underscore) becomes a custom tab name. If the user clicks three different links, all three will reload inside that one single tab!
```html
<!-- ❌ WRONG: Missing leading underscore -->
<a href="https://google.com" target="blank">Google</a>

<!-- ✅ CORRECT: Must start with an underscore -->
<a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>
```

### 2. ⚠️ Opening Every Internal Link in a New Tab
Never put `target="_blank"` on regular internal links (`about.html`, `contact.html`). A user visiting your site shouldn't end up with 30 open tabs!

### 3. ⚠️ Forgetting `rel="noopener noreferrer"` on External Links
Always treat `target="_blank"` and `rel="noopener noreferrer"` as inseparable best friends!

---

# Quick Summary

- ✅ The **`target` attribute** controls where a linked page will open.
- ✅ **`target="_blank"`** opens the link in a fresh, brand new browser tab.
- ✅ **`target="_self"`** is the default setting that opens the page in the same tab.
- ✅ **Reverse Tabnabbing** is a cyber attack where an external page secretly changes your original tab to a fake phishing page.
- ✅ Always protect external new-tab links by adding **`rel="noopener noreferrer"`**.
- ✅ Use the **`download` attribute** to trigger automatic file downloads (like PDFs, sample papers, or forms).
- ✅ Use the **`title` attribute** to show friendly hover tooltips for accessibility.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which target attribute value opens a link in a brand new browser tab?
A. `target="_new"`
B. `target="_window"`
C. `target="_blank"`
D. `target="_open"`
**Answer:** C

---

### 2. What cyber hazard occurs when an external link uses `target="_blank"` without security attributes?
A. The computer's hard disk gets formatted
B. Reverse Tabnabbing (the original tab can be redirected to a fake phishing site)
C. The internet router catches fire
D. The monitor screen loses all colors
**Answer:** B

---

### 3. Which attribute and values protect users when opening external links in a new tab?
A. `secure="true"`
B. `rel="noopener noreferrer"`
C. `protect="tab"`
D. `lock="parent"`
**Answer:** B

---

### 4. What happens if you accidentally write `target="blank"` (without the leading underscore)?
A. The browser crashes
B. It creates a named browsing context, re-using the same tab for subsequent clicks instead of creating new ones
C. The link turns into an image
D. The link stops working completely
**Answer:** B

---

### 5. Which attribute forces the browser to save a linked file to the computer instead of opening it?
A. `save`
B. `store`
C. `download`
D. `export`
**Answer:** C

---

# Hands-on Practice Challenge 🎯

Open VS Code and create a file named **`student-downloads.html`**.

### Your Challenge:
Create a "Student Resources & Downloads Portal" for your school:
1. **Official Board Links:** Add links to CBSE (`https://cbse.gov.in`) and NCERT (`https://ncert.nic.in`).
   - Both must open in a new tab using `target="_blank"`.
   - Both must be protected with `rel="noopener noreferrer"`.
   - Add a helpful tooltip to each using the `title` attribute.
2. **Downloadable Study Material:**
   - Add a download link for a sample PDF: `<a href="math-sample-paper.pdf" download="Class10-Maths-Sample-2026.pdf">`.
3. **School Internal Navigation:**
   - Add a regular link returning to `index.html` opening in the same tab (`_self`).
4. Test your file in your web browser and verify that external tabs open safely!

---

**Congratulations!** You have mastered Chapter 6: Links! You now know how to build fully connected, multi-page websites and keep your users 100% safe from cyber tricks!
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Unordered & Ordered Lists** (Lists).

👉 **[Continue to Next Lesson: Unordered & Ordered Lists →](/tutorials/html5-complete-course/unordered-ordered-lists)**
