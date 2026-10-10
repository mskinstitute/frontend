# CPU, Memory, Storage, Input & Output Devices

To understand how a computer executes commands, we must inspect its internal organs: the **Processor (CPU)**, **Primary Memory (RAM & ROM)**, **Secondary Storage**, and **Input/Output devices**.

![Computer Hardware Components](/images/tutorials/ccc/computer-hardware-components.svg)

---

## 1. Central Processing Unit (CPU - कंप्यूटर का दिमाग)

The **CPU** is the brain of the computer that interprets and executes all instructions. In modern PCs and mobile phones, the CPU is contained on a single silicon microchip called a **Microprocessor**.

A CPU consists of three primary sub-units:
1. **Arithmetic Logic Unit (ALU):**
   - Performs all mathematical arithmetic operations: Addition ($+$), Subtraction ($-$), Multiplication ($*$), Division ($/$).
   - Performs all logical decisions and comparisons: Greater than ($>$), Less than ($<$), Equal ($==$).
2. **Control Unit (CU):**
   - Acts as the "Traffic Police" of the computer.
   - It fetches instructions from memory, decodes them, and directs the flow of data between ALU, memory, and I/O devices.
3. **Registers & Cache Memory:**
   - Tiny, ultra-fast memory storage locations built directly inside the CPU chip (L1, L2, L3 Cache).
   - Holds the immediate operands and instructions currently being calculated by the ALU.

---

## 2. Primary Memory vs Secondary Memory

```text
+-----------------------+-----------------------------+-----------------------------+
| Feature               | Primary Memory (RAM / ROM)  | Secondary Storage (HDD/SSD) |
+-----------------------+-----------------------------+-----------------------------+
| Location              | Directly accessible by CPU  | Connected via cables/buses  |
| Speed                 | Ultra Fast (Nanoseconds)    | Slower (Milliseconds)       |
| Capacity              | Smaller (8 GB, 16 GB, 32 GB)| Massive (512 GB, 1 TB, 2 TB)|
| Cost per GB           | Expensive                   | Very Affordable             |
| Retention (Power Off) | RAM is Volatile (लॉस्ट)     | Non-Volatile (Permanent)    |
+-----------------------+-----------------------------+-----------------------------+
```

### A. RAM (Random Access Memory - अस्थायी मेमोरी)
- RAM is **Volatile Memory**: Its contents are wiped out completely the moment power is switched off or the computer reboots.
- Think of RAM as your **Working Desk**: Whatever app you are actively working on (MS Word, YouTube video) is loaded into RAM so the CPU can access it at lightning speed.

### B. ROM (Read Only Memory - स्थायी मेमोरी)
- ROM is **Non-Volatile Memory**: Its contents are permanent and cannot be accidentally deleted or modified during normal computer operations.
- Contains the manufacturer's **BIOS / UEFI firmware** needed to boot the computer.

---

## 3. Secondary Storage Devices (स्थायी स्टोरेज)

Secondary storage preserves your files, photos, songs, documents, and operating system permanently:

1. **HDD (Hard Disk Drive):** Uses spinning magnetic platters and mechanical read/write heads. Cheap and large capacity, but slower and susceptible to physical shock.
2. **SSD (Solid State Drive):** Modern replacement for HDDs using **Flash Memory** chips with no moving parts. **5x to 10x faster** than traditional hard drives.
3. **Optical Discs:**
   - **CD (Compact Disc):** Standard capacity is **700 MB**.
   - **DVD (Digital Versatile Disc):** Standard capacity is **4.7 GB** (Single Layer).
   - **Blu-Ray Disc:** Capacity ranges from **25 GB** to **50 GB**.
4. **Flash Drives & Memory Cards:** Pen drives and MicroSD cards using portable USB flash memory.

---

## 4. Input and Output Devices Classification

![Input and Output Devices](/images/tutorials/ccc/input-devices.jpg)

### Input Devices (इनपुट उपकरण):
- **Keyboard:** Standard layout is **QWERTY**. Standard 104-key layout with Function keys ($F1$ to $F12$).
- **Mouse:** Pointing device invented by **Douglas Engelbart**. Modern mice use optical LED or laser sensors.
- **Scanner:** Converts physical documents and photos into digital image files (Soft Copy).
- **OMR (Optical Mark Recognition):** Evaluates pencil/pen marked answer sheets in competitive exams like CCC.
- **OCR (Optical Character Recognition):** Reads printed text characters from paper and converts them into editable digital text.
- **MICR (Magnetic Ink Character Recognition):** Used in Banks to read the 9-digit special magnetic code printed at the bottom of Bank Cheques.
- **Barcode & QR Code Reader:** Reads product barcodes at supermarket billing counters.

### Output Devices (आउटपुट उपकरण):
- **Monitor (VDU - Visual Display Unit):** Provides soft copy output. Types: CRT (bulky legacy), LCD, LED, OLED. Resolution is measured in **Pixels**.
- **Printers (Hard Copy Output):**
  - **Impact Printers:** Physical strike against ribbon (Dot Matrix Printer - noisy, slow, used in railway reservation counters).
  - **Non-Impact Printers:** Quiet and high quality without physical striking.
    - **Inkjet Printer:** Sprays tiny droplets of liquid ink.
    - **Laser Printer:** Uses dry toner powder and laser beam (Fastest, crisp text, used in offices).
- **Plotter:** High-resolution vector printer used by architects and civil engineers to print large blueprints, maps, and flex banners.
- **Speakers & Headphones:** Audio sound output.

---

# Multiple Choice Questions

### 1. Which unit of the CPU is responsible for performing additions, subtractions, and logical comparisons?
A. Memory Unit (MU)
B. Control Unit (CU)
C. Arithmetic Logic Unit (ALU)
D. Power Supply Unit (SMPS)
**Answer:** C
**Explanation:** The Arithmetic Logic Unit (ALU) is the mathematical and logical engine of the CPU where all arithmetic operations ($+,-,*,/$) and comparison checks are executed.

---

### 2. Why is RAM termed "Volatile Memory"?
A. It generates extreme physical heat
B. Its contents are lost as soon as the electric power is turned off
C. It cannot be upgraded
D. It only stores operating system files
**Answer:** B
**Explanation:** Volatile memory requires continuous electrical power to maintain its stored state. When power is lost or the PC restarts, all data stored in RAM is immediately erased.

---

### 3. Which technology is used on Bank Cheques to facilitate rapid automated verification and clearing?
A. OMR
B. OCR
C. MICR (Magnetic Ink Character Recognition)
D. Barcode
**Answer:** C
**Explanation:** Cheques use MICR technology. A 9-digit code printed with magnetic iron-oxide ink at the bottom of the cheque contains the City Code, Bank Code, and Branch Code, which is read by MICR scanners.

---

### 4. What is the standard data storage capacity of a normal Compact Disc (CD)?
A. 4.7 GB
B. 700 MB
C. 1.44 MB
D. 25 GB
**Answer:** B
**Explanation:** A standard 120 mm Compact Disc (CD-ROM) has a data storage capacity of 700 MB (equivalent to about 80 minutes of audio). DVDs store 4.7 GB.

---

### 5. Which printer uses dry powdered toner and a laser beam to produce high-speed office prints?
A. Dot Matrix Printer
B. Laser Printer
C. Inkjet Printer
D. Daisy Wheel Printer
**Answer:** B
**Explanation:** Laser printers are non-impact printers that use a laser beam, an electrostatically charged drum, and dry powdered toner to produce crisp, high-speed documents.

---