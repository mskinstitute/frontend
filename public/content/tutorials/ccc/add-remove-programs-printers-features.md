# Add/Remove Programs, Printers, and Features (सॉफ्टवेयर और प्रिंटर जोड़ना/हटाना)

Maintaining an orderly computer requires knowing how to cleanly install new application software, uninstall unwanted programs that clog up storage, and set up peripheral devices like printers and scanners.

---

## 1. Installing and Uninstalling Applications Cleanly

### Common Beginner Mistake:
Many beginners mistakenly think that deleting a program's desktop shortcut uninstalls the software. **Deleting a shortcut does NOT uninstall the software!** The program files remain inside `C:\Program Files`, consuming disk space and running background services.

### The Correct Way to Uninstall Software:
1. Open **Settings** ($`	ext{Win} + I$) $\implies$ Click **Apps** $\implies$ **Installed apps**.
2. Or open **Control Panel** $\implies$ Click **Programs and Features (Programs $\implies$ Uninstall a program)**.
3. Find the software you want to remove in the list (e.g. *Old Game* or *Trial Antivirus*).
4. Click on it and select **Uninstall (अनइंस्टॉल करें)**.
5. An uninstallation wizard will appear. Follow the prompts to completely remove all program binaries, registry entries, and temporary files from the system.

---

## 2. Adding and Configuring Printers (प्रिंटर जोड़ना)

Printers produce physical hard copies of your digital documents. Modern printers connect via **USB cable**, **Wi-Fi Network**, or **Bluetooth**.

### Steps to Add a New Printer:
1. Connect the printer to the PC with the USB cable or ensure it is connected to the same Wi-Fi network.
2. Open **Settings** $\implies$ Click **Bluetooth & devices** $\implies$ **Printers & scanners**.
3. Click **Add device (डिवाइस जोड़ें)**. Windows will automatically scan for connected printers.
4. Once detected, Windows will automatically install the necessary **Device Driver**.
5. **Print a Test Page:** Always click **"Print test page"** to verify that ink nozzles, paper feed, and drivers are communicating properly.

### Setting a "Default Printer" (डिफ़ॉल्ट प्रिंटर):
In an office with multiple printers (e.g. a high-speed black-and-white laser printer for receipts and a color inkjet for photos), you can right-click your preferred printer and select **"Set as Default Printer"**. Whenever you press `Ctrl + P` in any app, Windows will automatically send the print job to this designated default printer.

---

## 3. What is a Device Driver? (डिवाइस ड्राइवर क्या है?)

A **Device Driver** is a specialized system software program that acts as a translator between the Operating System and a specific hardware peripheral (e.g. HP LaserJet Printer, Canon Scanner, Realtek Sound Card).

Without the appropriate driver installed, the Operating System cannot understand the mechanical commands required to control that physical hardware.

---

## 4. Enabling Windows Features

Some advanced Windows components are pre-installed but turned off by default to save memory:
- Through **Control Panel $\implies$ Programs and Features $\implies$ "Turn Windows features on or off"**, you can enable:
  - **.NET Framework** (required by older accounting software like Tally).
  - **Hyper-V** (virtual machine emulator).
  - **Windows Sandbox** (safe temporary isolated environment to test suspicious files).

---

# Multiple Choice Questions

### 1. What is the correct method to completely remove an application software from Windows?
A. Drag the desktop shortcut into the Recycle Bin
B. Delete the folder icon from the Start menu
C. Open "Installed apps" in Settings or "Programs and Features" in Control Panel and click Uninstall
D. Shut down the computer
**Answer:** C
**Explanation:** Proper uninstallation requires running the program's uninstaller through Control Panel or Settings, which safely purges executable files, configuration libraries, and registry keys.

---

### 2. What special software is necessary to enable the Operating System to communicate with a newly connected printer?
A. Word Processor
B. Device Driver
C. Spreadsheet
D. Web Browser
**Answer:** B
**Explanation:** A Device Driver is a dedicated software program that instructs the OS how to communicate with, send commands to, and control the external hardware peripheral.

---

### 3. What happens when a printer is designated as the "Default Printer" in Windows?
A. It cannot be used by other computers
B. All print jobs (`Ctrl + P`) are automatically routed to this printer unless another is explicitly chosen
C. It prints only in color
D. It prints without consuming any electricity
**Answer:** B
**Explanation:** The default printer is automatically pre-selected in print dialog boxes across all software programs, streamlining everyday document printing.

---

### 4. Which port is most commonly used today to connect local wired printers and pen drives to computers?
A. PS/2 Port
B. USB (Universal Serial Bus) Port
C. Serial COM Port
D. Parallel LPT Port
**Answer:** B
**Explanation:** USB (Universal Serial Bus) has superseded legacy serial and parallel ports, serving as the universal industry standard interface for printers, mice, keyboards, and flash drives.

---

### 5. Where can you enable optional internal Windows components like .NET Framework or Windows Sandbox?
A. Task Manager
B. "Turn Windows features on or off" in Control Panel
C. Recycle Bin properties
D. Display Settings
**Answer:** B
**Explanation:** The "Turn Windows features on or off" dialog in Control Panel lets administrators activate or deactivate optional system components, virtual environments, and developer runtimes.

---