# Basics of Hardware and Software (हार्डवेयर और सॉफ्टवेयर की मूल बातें)

A complete computer system consists of two complementary pillars: **Hardware** and **Software**. Neither can function without the other—hardware without software is like a body without a soul (आत्मा के बिना शरीर), and software without hardware has no physical medium to execute.

![Computer Hardware and Components](/images/tutorials/ccc/computer-hardware-components.svg)

---

## 1. What is Computer Hardware? (हार्डवेयर क्या है?)

**Hardware** refers to the tangible, physical components of a computer system that you can touch, see, and feel physically.

Examples of hardware:
- **Inside the CPU Cabinet:** Motherboard, Processor (CPU), RAM sticks, Hard Disk Drive (HDD) / SSD, SMPS (Power supply), Graphics Card.
- **External Peripherals:** Keyboard, Mouse, Monitor, Printer, Speaker, USB Pen Drive.

### The Central Circuit Board: Motherboard
The **Motherboard** (also known as Mainboard or System Board) is the large printed circuit board (PCB) inside the computer cabinet. Every single component—the CPU chip, RAM modules, storage drives, power cables, mouse, and keyboard—plugs directly into the motherboard to communicate.

---

## 2. What is Computer Software? (सॉफ्टवेयर क्या है?)

**Software** is a set of programs, instructions, and data that tells the computer hardware exactly what tasks to perform and how to perform them. Software cannot be physically touched; it exists digitally in the form of code.

Examples of software:
- **Operating Systems:** Windows 10, Windows 11, Ubuntu Linux, Android.
- **Productivity Tools:** MS Word, LibreOffice Writer, MS Excel, PowerPoint.
- **Web Browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge.
- **System Utilities:** Windows Defender Antivirus, Disk Defragmenter.

---

## 3. Relationship Between Hardware, Software, and User

The interaction occurs in hierarchical layers:

```text
   +----------------------------------------------------+
   |                   USER (प्रयोगकर्ता)                |
   +----------------------------------------------------+
                            │ (Uses)
   +----------------------------------------------------+
   |        Application Software (Apps: Word, Chrome)   |
   +----------------------------------------------------+
                            │ (Runs on)
   +----------------------------------------------------+
   |         System Software (Operating System: Windows)|
   +----------------------------------------------------+
                            │ (Controls)
   +----------------------------------------------------+
   |       HARDWARE (CPU, RAM, Motherboard, Screen)     |
   +----------------------------------------------------+
```

---

## 4. What is Firmware? (फर्मवेयर क्या है?)

**Firmware** is a special category of software that is permanently etched (burned) into read-only memory (ROM) chips on hardware devices during manufacturing. 

The most famous example of firmware is **BIOS** (Basic Input/Output System) or **UEFI** found on your computer's motherboard:
- When you press the Power button on your PC, the BIOS executes a self-diagnostic test called **POST (Power-On Self-Test)**.
- It verifies that the keyboard, RAM, monitor, and drives are functioning properly before locating the Operating System on your SSD/Hard drive and loading it into RAM (a process known as **Booting**).

---

## 5. Summary Comparison: Hardware vs Software

| Parameter | Hardware (हार्डवेयर) | Software (सॉफ्टवेयर) |
| :--- | :--- | :--- |
| **Nature** | Physical & Tangible (छू सकते हैं) | Logical & Virtual (छू नहीं सकते) |
| **Creation** | Manufactured in electronic factories | Developed by software programmers |
| **Failure** | Wears out over time physically | Does not wear out physically, but can have bugs |
| **Damage Recovery**| Replaced or physically repaired | Reinstalled or updated via internet |
| **Virus Effect** | Viruses cannot physically infect wires | Highly vulnerable to virus/malware infection |

---

# Multiple Choice Questions

### 1. Which of the following is an example of computer hardware?
A. Windows 11
B. Google Chrome
C. Optical Mouse
D. MS Excel
**Answer:** C
**Explanation:** An optical mouse is a physical, tangible device that can be touched and seen, making it hardware. Windows 11, Chrome, and Excel are software programs.

---

### 2. What is the initial diagnostic self-test performed by the BIOS during computer startup?
A. BOOT
B. POST (Power-On Self-Test)
C. CMOS Check
D. SCAN
**Answer:** B
**Explanation:** POST (Power-On Self-Test) is the automatic diagnostic routine run by the system BIOS immediately upon powering on to check that hardware devices like memory, keyboard, and drives are functioning correctly.

---

### 3. What is software that is permanently stored in read-only memory (ROM) called?
A. Shareware
B. Firmware
C. Freeware
D. Malware
**Answer:** B
**Explanation:** Firmware is low-level software permanently embedded into hardware memory chips (like BIOS in ROM) to control hardware devices directly.

---

### 4. What is the main printed circuit board connecting all internal components of a computer called?
A. Breadboard
B. Motherboard
C. Sound Card
D. SMPS
**Answer:** B
**Explanation:** The motherboard is the primary circuit board inside a computer that houses the CPU socket, RAM slots, expansion bus, and connects all peripheral devices.

---

### 5. What happens during the "Booting" process of a computer?
A. The hard drive is formatted
B. The Operating System is loaded from secondary storage into RAM
C. All user files are permanently deleted
D. Antivirus scans all files
**Answer:** B
**Explanation:** Booting is the startup sequence where the BIOS locates the Operating System files on the secondary storage drive (HDD/SSD) and copies them into main memory (RAM) so the computer is ready for use.

---