const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createScreenshots() {
  const brandDir = path.join(__dirname, '..', 'public', 'brand');

  // 1. Mobile Screenshot (1080 x 1920)
  const mobileSvg = `
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0A2540" />
        <stop offset="30%" stop-color="#0E355A" />
        <stop offset="100%" stop-color="#061727" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#f8fafc" />
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="1080" height="1920" fill="url(#bgGrad)" />

    <!-- Top Status / Header -->
    <rect x="0" y="0" width="1080" height="160" fill="#0A2540" />
    <text x="60" y="105" font-family="Arial, sans-serif" font-size="48" font-weight="900" fill="#ffffff">MSK<tspan fill="#F26522">.Institute</tspan></text>
    <rect x="800" y="65" width="220" height="60" rx="30" fill="#F26522" />
    <text x="835" y="105" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff">Admissions Open</text>

    <!-- Hero Banner -->
    <rect x="60" y="200" width="960" height="440" rx="32" fill="url(#cardGrad)" />
    <rect x="100" y="240" width="340" height="48" rx="24" fill="#FFF1EB" />
    <text x="120" y="272" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#F26522">SHIKOHABAD'S #1 ACADEMY</text>
    <text x="100" y="360" font-family="Arial, sans-serif" font-size="52" font-weight="900" fill="#0A2540">Empower Your Career</text>
    <text x="100" y="420" font-family="Arial, sans-serif" font-size="48" font-weight="900" fill="#F26522">with Practical Coding</text>
    <text x="100" y="480" font-family="Arial, sans-serif" font-size="26" fill="#64748B">Python, Full-Stack MERN, NIELIT CCC &amp; ADCA</text>
    
    <rect x="100" y="530" width="280" height="70" rx="20" fill="#F26522" />
    <text x="135" y="575" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffffff">Explore Courses ➔</text>

    <!-- Live Batch Card -->
    <rect x="60" y="680" width="960" height="520" rx="32" fill="#0E355A" stroke="#1E4A78" stroke-width="4" />
    <rect x="100" y="720" width="260" height="44" rx="22" fill="#F26522" />
    <text x="130" y="750" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">LIVE COHORT 2026</text>
    <text x="100" y="825" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#ffffff">Python Developer Fast-Track</text>
    <text x="100" y="875" font-family="Arial, sans-serif" font-size="24" fill="#94A3B8">Weekday Evening Mentorship by Er. Sumit Kumar</text>
    
    <!-- Stats Row inside card -->
    <rect x="100" y="920" width="260" height="120" rx="20" fill="#0A2540" />
    <text x="130" y="970" font-family="Arial, sans-serif" font-size="36" font-weight="900" fill="#F26522">4 Seats</text>
    <text x="130" y="1010" font-family="Arial, sans-serif" font-size="20" fill="#94A3B8">Left in Batch</text>

    <rect x="400" y="920" width="260" height="120" rx="20" fill="#0A2540" />
    <text x="430" y="970" font-family="Arial, sans-serif" font-size="36" font-weight="900" fill="#10B981">100%</text>
    <text x="430" y="1010" font-family="Arial, sans-serif" font-size="20" fill="#94A3B8">Practical Labs</text>

    <rect x="700" y="920" width="260" height="120" rx="20" fill="#0A2540" />
    <text x="730" y="970" font-family="Arial, sans-serif" font-size="36" font-weight="900" fill="#38BDF8">Verified</text>
    <text x="730" y="1010" font-family="Arial, sans-serif" font-size="20" fill="#94A3B8">Certificates</text>

    <rect x="100" y="1080" width="880" height="80" rx="20" fill="#F26522" />
    <text x="410" y="1130" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffffff">Enroll in Live Batch</text>

    <!-- Popular Courses Grid -->
    <text x="60" y="1260" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff">Popular Courses &amp; Notes</text>
    
    <rect x="60" y="1300" width="460" height="380" rx="28" fill="#ffffff" />
    <rect x="60" y="1300" width="460" height="180" rx="28" fill="#E2E8F0" />
    <text x="90" y="1420" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#0A2540">HTML5 &amp; CSS3</text>
    <text x="90" y="1530" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#0A2540">Modern Web Design</text>
    <text x="90" y="1580" font-family="Arial, sans-serif" font-size="22" fill="#64748B">1-Month Practical Course</text>
    <text x="90" y="1630" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#F26522">Free Notes Included</text>

    <rect x="560" y="1300" width="460" height="380" rx="28" fill="#ffffff" />
    <rect x="560" y="1300" width="460" height="180" rx="28" fill="#E2E8F0" />
    <text x="590" y="1420" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#0A2540">Full-Stack MERN</text>
    <text x="590" y="1530" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#0A2540">React &amp; Node.js</text>
    <text x="590" y="1580" font-family="Arial, sans-serif" font-size="22" fill="#64748B">3-Month Bootcamp</text>
    <text x="590" y="1630" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#F26522">Job Assistance</text>

    <!-- Bottom App Nav Bar -->
    <rect x="0" y="1740" width="1080" height="180" fill="#ffffff" />
    <line x1="0" y1="1740" x2="1080" y2="1740" stroke="#E2E8F0" stroke-width="2" />
    <text x="120" y="1835" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#F26522">Home</text>
    <text x="340" y="1835" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#64748B">Courses</text>
    <text x="560" y="1835" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#64748B">Live</text>
    <text x="760" y="1835" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#64748B">Notes</text>
    <text x="940" y="1835" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#64748B">Verify</text>
  </svg>
  `;

  // 2. Desktop Screenshot (1920 x 1080)
  const desktopSvg = `
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dbgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F8FAFC" />
        <stop offset="100%" stop-color="#EEF2F6" />
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#dbgGrad)" />

    <!-- Top Navigation Bar -->
    <rect x="0" y="0" width="1920" height="80" fill="#ffffff" />
    <line x1="0" y1="80" x2="1920" y2="80" stroke="#E2E8F0" stroke-width="1" />
    <text x="100" y="50" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#0A2540">MSK<tspan fill="#F26522">.Institute</tspan></text>
    
    <text x="360" y="48" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#F26522">Home</text>
    <text x="460" y="48" font-family="Arial, sans-serif" font-size="16" fill="#64748B">Courses</text>
    <text x="570" y="48" font-family="Arial, sans-serif" font-size="16" fill="#64748B">Live Classes</text>
    <text x="700" y="48" font-family="Arial, sans-serif" font-size="16" fill="#64748B">Study Material</text>
    <text x="845" y="48" font-family="Arial, sans-serif" font-size="16" fill="#64748B">Careers</text>
    <text x="945" y="48" font-family="Arial, sans-serif" font-size="16" fill="#64748B">Blogs</text>

    <!-- Search box -->
    <rect x="1100" y="20" width="320" height="42" rx="8" fill="#F1F5F9" stroke="#E2E8F0" />
    <text x="1120" y="46" font-family="Arial, sans-serif" font-size="14" fill="#94A3B8">Search tutorials, courses...</text>

    <!-- Header buttons -->
    <rect x="1460" y="20" width="140" height="42" rx="8" fill="#FFF1EB" stroke="#F26522" stroke-width="1" />
    <text x="1485" y="46" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#F26522">Install App</text>

    <rect x="1620" y="20" width="180" height="42" rx="8" fill="#0A2540" />
    <text x="1655" y="46" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">Enroll Online</text>

    <!-- Hero Content -->
    <text x="100" y="160" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#F26522">SHIKOHABAD'S LEADING COMPUTER &amp; CODING ACADEMY</text>
    <text x="100" y="220" font-family="Arial, sans-serif" font-size="48" font-weight="900" fill="#0A2540">Empower Your Career with Practical Coding Skills</text>
    <text x="100" y="265" font-family="Arial, sans-serif" font-size="18" fill="#64748B">Join MSK Institute in Shikohabad to learn Python, Full-Stack Web Development, and essential computer concepts with practical lab projects.</text>
    
    <rect x="100" y="300" width="180" height="52" rx="12" fill="#F26522" />
    <text x="135" y="332" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff">Explore Courses ➔</text>

    <rect x="300" y="300" width="200" height="52" rx="12" fill="#ffffff" stroke="#0A2540" stroke-width="1" />
    <text x="325" y="332" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0A2540">Verify Certificate</text>

    <!-- Right Hero Card: Upcoming Live Batch -->
    <rect x="1220" y="120" width="600" height="400" rx="24" fill="#ffffff" stroke="#E2E8F0" stroke-width="1" />
    <rect x="1250" y="150" width="220" height="32" rx="8" fill="#FFF1EB" />
    <text x="1270" y="172" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#F26522">STARTING 15 SEPT 2026</text>
    <text x="1680" y="175" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#F26522">₹4,999</text>
    <text x="1250" y="230" font-family="Arial, sans-serif" font-size="26" font-weight="900" fill="#0A2540">Python Developer Fast-Track Live</text>
    <text x="1250" y="270" font-family="Arial, sans-serif" font-size="14" fill="#64748B">Start your programming journey with live mentorship by Er. Sumit Kumar.</text>
    <rect x="1250" y="310" width="540" height="80" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="1280" y="345" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0A2540">Only 4 of 20 Seats Left</text>
    <text x="1280" y="370" font-family="Arial, sans-serif" font-size="13" fill="#10B981">Admissions Open - Offline &amp; Online Classes</text>
    <rect x="1250" y="410" width="540" height="52" rx="12" fill="#F26522" />
    <text x="1450" y="442" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff">View Batch Details ➔</text>

    <!-- Course Cards Section -->
    <text x="100" y="480" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#0A2540">Featured Programs</text>

    <!-- Card 1 -->
    <rect x="100" y="510" width="380" height="500" rx="20" fill="#ffffff" stroke="#E2E8F0" />
    <rect x="100" y="510" width="380" height="200" rx="20" fill="#0E355A" />
    <text x="140" y="620" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff">HTML5 Masterclass</text>
    <text x="130" y="750" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#0A2540">HTML5 Complete Course</text>
    <text x="130" y="790" font-family="Arial, sans-serif" font-size="14" fill="#64748B">Semantic web, forms, SEO, and browser APIs with live projects.</text>
    <text x="130" y="880" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#F26522">Duration: 1 Month</text>
    <rect x="130" y="910" width="320" height="44" rx="10" fill="#F26522" />
    <text x="240" y="938" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">View Syllabus</text>

    <!-- Card 2 -->
    <rect x="520" y="510" width="380" height="500" rx="20" fill="#ffffff" stroke="#E2E8F0" />
    <rect x="520" y="510" width="380" height="200" rx="20" fill="#0A2540" />
    <text x="560" y="620" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff">JavaScript &amp; React</text>
    <text x="550" y="750" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#0A2540">Frontend Engineering</text>
    <text x="550" y="790" font-family="Arial, sans-serif" font-size="14" fill="#64748B">ES6+, DOM events, React hooks, state management, and SPA architecture.</text>
    <text x="550" y="880" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#F26522">Duration: 3 Months</text>
    <rect x="550" y="910" width="320" height="44" rx="10" fill="#F26522" />
    <text x="660" y="938" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">View Syllabus</text>

    <!-- Card 3 -->
    <rect x="940" y="510" width="380" height="500" rx="20" fill="#ffffff" stroke="#E2E8F0" />
    <rect x="940" y="510" width="380" height="200" rx="20" fill="#1E4A78" />
    <text x="980" y="620" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff">Python &amp; Django</text>
    <text x="970" y="750" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#0A2540">Python Masterclass</text>
    <text x="970" y="790" font-family="Arial, sans-serif" font-size="14" fill="#64748B">Core scripting, OOP, automation, database integration, and REST APIs.</text>
    <text x="970" y="880" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#F26522">Duration: 2 Months</text>
    <rect x="970" y="910" width="320" height="44" rx="10" fill="#F26522" />
    <text x="1080" y="938" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">View Syllabus</text>

    <!-- Card 4 -->
    <rect x="1360" y="510" width="460" height="500" rx="20" fill="#ffffff" stroke="#E2E8F0" />
    <rect x="1360" y="510" width="460" height="200" rx="20" fill="#061727" />
    <text x="1420" y="620" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff">NIELIT CCC &amp; ADCA</text>
    <text x="1390" y="750" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#0A2540">Govt Certified Diplomas</text>
    <text x="1390" y="790" font-family="Arial, sans-serif" font-size="14" fill="#64748B">Complete computer concepts, MS Office, typing, internet &amp; cybersecurity.</text>
    <text x="1390" y="880" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#F26522">Duration: 3 to 12 Months</text>
    <rect x="1390" y="910" width="400" height="44" rx="10" fill="#F26522" />
    <text x="1530" y="938" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">View Details</text>
  </svg>
  `;

  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true });
  }

  await sharp(Buffer.from(mobileSvg))
    .png({ quality: 90 })
    .toFile(path.join(brandDir, 'screenshot-mobile.png'));
  console.log('Created screenshot-mobile.png (1080x1920)');

  await sharp(Buffer.from(desktopSvg))
    .png({ quality: 90 })
    .toFile(path.join(brandDir, 'screenshot-desktop.png'));
  console.log('Created screenshot-desktop.png (1920x1080)');
}

createScreenshots().catch(console.error);
