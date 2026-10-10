# Concept of Internet, WWW, and IP Address (इंटरनेट, WWW और आईपी एड्रेस)

Today, we take instant messaging, online video streaming, and digital banking for granted. But what exactly is the **Internet**, how does the **World Wide Web (WWW)** work, and how do billions of connected devices identify one another?

![Internet Networking](/images/tutorials/ccc/internet-networking.jpg)

---

## 1. What is the Internet? (इंटरनेट क्या है?)

The **Internet** (short for *Interconnected Networks*) is a colossal, worldwide global network of billions of computers, servers, mobile phones, and smart devices communicating using standard rules called **Protocols**.

### History of the Internet (CCC Super Important):
- **ARPANET (1969):** The grandfather of the modern Internet. Developed by the **US Department of Defense (DoD)** Advanced Research Projects Agency to connect university computers.
- **Vinton Cerf & Bob Kahn:** Revered as the **"Fathers of the Internet"** for co-designing the **TCP/IP** protocol suite.
- **Birth of Internet in India:** The Internet was publicly launched in India on **15 August 1995** by **VSNL** (Videsh Sanchar Nigam Limited).

---

## 2. Internet vs World Wide Web (WWW)

Many people mistakenly think the Internet and the Web are the exact same thing. In computer science:

- **The Internet (The Infrastructure / Hardware Roads):** The physical network of underwater optical fiber cables, satellites, servers, and routers that connect machines worldwide.
- **The World Wide Web (The Service / Traffic on Roads):** A vast global collection of interconnected hypertext web pages, documents, images, and videos hosted on internet servers.
  - Invented in **1989** by British scientist **Sir Tim Berners-Lee** at CERN in Switzerland.
  - Tim Berners-Lee also created the world's first web browser, the **HTTP** protocol, and **HTML**.

---

## 3. What is an IP Address? (आईपी एड्रेस क्या है?)

Just as your home requires a postal address to receive courier parcels, every device connected to the Internet (laptop, smartphone, smart TV) is assigned a unique numerical label called an **IP Address (Internet Protocol Address)**.

There are two major versions of IP addresses:

```text
+-----------------------+-----------------------------+-----------------------------+
| Feature               | IPv4 (Version 4)            | IPv6 (Version 6)            |
+-----------------------+-----------------------------+-----------------------------+
| Address Length        | **32 Bits** (4 Bytes)       | **128 Bits** (16 Bytes)     |
| Notation Format       | Decimal numbers separated by| Hexadecimal separated by    |
|                       | dots (.)                    | colons (:)                  |
| Example               | `192.168.1.1`               | `2001:0db8:85a3::8a2e:0370`|
| Total Addresses       | Approx. 4.3 Billion ($2^{32}$)| Undecillion ($2^{128}$ - infinite!)|
+-----------------------+-----------------------------+-----------------------------+
```

---

## 4. Domain Name System (DNS - इंटरनेट की फोनबुक)

Computers only understand numbers (IP addresses like `142.250.190.46`). But humans cannot memorize dozens of random 10-digit numbers to visit websites!

The **DNS (Domain Name System)** acts as the **Phonebook of the Internet**:
- It automatically translates human-friendly domain names (like `www.google.com` or `www.mskinstitute.com`) into machine-readable numerical IP addresses.

---

# Multiple Choice Questions

### 1. Who is considered the "Father of the Internet"?
A. Tim Berners-Lee
B. Vinton Cerf (and Bob Kahn)
C. Charles Babbage
D. Bill Gates
**Answer:** B
**Explanation:** Vinton Cerf and Bob Kahn are recognized as the "Fathers of the Internet" for inventing the foundational TCP/IP protocols that govern internet communications.

---

### 2. Who invented the World Wide Web (WWW) in 1989?
A. Tim Berners-Lee
B. Steve Jobs
C. Mark Zuckerberg
D. Alan Turing
**Answer:** A
**Explanation:** Sir Tim Berners-Lee invented the World Wide Web (WWW) in 1989 while working as a computer scientist at the CERN laboratory in Switzerland.

---

### 3. What is the bit length of an IPv4 address?
A. 16 Bits
B. 32 Bits
C. 64 Bits
D. 128 Bits
**Answer:** B
**Explanation:** An IPv4 address is strictly 32 bits in length, represented as four 8-bit octets separated by dots (e.g. 192.168.1.1). IPv6 is 128 bits.

---

### 4. On which historic date was public internet service officially launched in India by VSNL?
A. 26 January 1950
B. 15 August 1995
C. 2 October 2000
D. 1 January 2005
**Answer:** B
**Explanation:** Public Internet access in India was officially inaugurated on Independence Day, 15 August 1995, by Videsh Sanchar Nigam Limited (VSNL).

---

### 5. What system functions as the "Phonebook of the Internet", translating domain names into IP addresses?
A. ISP
B. DNS (Domain Name System)
C. FTP
D. SMTP
**Answer:** B
**Explanation:** The Domain Name System (DNS) translates human-readable web addresses (like google.com) into numerical IP addresses required by networking routers.

---