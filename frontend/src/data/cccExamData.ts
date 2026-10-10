export interface CccQuestion {
  id: number;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  topic: 'Fundamentals' | 'Operating Systems' | 'LibreOffice Writer' | 'LibreOffice Calc' | 'LibreOffice Impress' | 'Networking' | 'Cyber Security' | 'Digital Financial Services';
  explanationEn: string;
  explanationHi: string;
}

export const CCC_EXAM_QUESTIONS: CccQuestion[] = [
  {
    id: 1,
    topic: 'Fundamentals',
    questionEn: 'Which memory type is non-volatile and retains data even when the computer is powered off?',
    questionHi: 'कंप्यूटर बंद होने पर भी कौन सा मेमोरी प्रकार गैर-वाष्पशील (Non-volatile) है और डेटा को सुरक्षित रखता है?',
    optionsEn: ['RAM (Random Access Memory)', 'ROM (Read Only Memory)', 'Cache Memory', 'Virtual Memory'],
    optionsHi: ['रैम (RAM)', 'रोम (ROM)', 'कैश मेमोरी (Cache)', 'वर्चुअल मेमोरी (Virtual Memory)'],
    correctIndex: 1,
    explanationEn: 'ROM is non-volatile memory; its contents are permanent and retained without electric power.',
    explanationHi: 'ROM गैर-वाष्पशील मेमोरी है; इसकी सामग्री स्थायी होती है और बिजली बंद होने पर भी नष्ट नहीं होती है।'
  },
  {
    id: 2,
    topic: 'LibreOffice Writer',
    questionEn: 'What is the default file extension of a document saved in LibreOffice Writer?',
    questionHi: 'लिब्रेऑफिस राइटर (LibreOffice Writer) में सहेजे गए दस्तावेज़ का डिफ़ॉल्ट फ़ाइल एक्सटेंशन क्या होता है?',
    optionsEn: ['.docx', '.odt', '.rtf', '.txt'],
    optionsHi: ['.docx', '.odt', '.rtf', '.txt'],
    correctIndex: 1,
    explanationEn: 'LibreOffice Writer saves text documents in OpenDocument Text format with the .odt extension.',
    explanationHi: 'लिब्रेऑफिस राइटर टेक्स्ट दस्तावेज़ों को .odt एक्सटेंशन के साथ ओपनडॉक्यूमेंट टेक्स्ट प्रारूप में सहेजता है।'
  },
  {
    id: 3,
    topic: 'LibreOffice Calc',
    questionEn: 'In LibreOffice Calc, what is the keyboard shortcut to insert a new function or formula?',
    questionHi: 'लिब्रेऑफिस कैल्क (Calc) में नया फ़ंक्शन या सूत्र डालने का कीबोर्ड शॉर्टकट क्या है?',
    optionsEn: ['Ctrl + F2', 'Ctrl + F12', 'Shift + F3', 'F2'],
    optionsHi: ['Ctrl + F2', 'Ctrl + F12', 'Shift + F3', 'F2'],
    correctIndex: 0,
    explanationEn: 'Ctrl + F2 opens the Function Wizard dialog in LibreOffice Calc.',
    explanationHi: 'Ctrl + F2 लिब्रेऑफिस कैल्क में फ़ंक्शन विज़ार्ड डायलॉग बॉक्स खोलता है।'
  },
  {
    id: 4,
    topic: 'Networking',
    questionEn: 'What is the full form of IPv6 address protocol and how many bits does it consist of?',
    questionHi: 'IPv6 का पूर्ण रूप क्या है और इसमें कितने बिट्स (Bits) होते हैं?',
    optionsEn: ['Internet Protocol version 6 (128 bits)', 'Internet Protocol version 6 (64 bits)', 'Internal Protocol version 6 (32 bits)', 'Internet Packet version 6 (128 bits)'],
    optionsHi: ['इंटरनेट प्रोटोकॉल वर्शन 6 (128 बिट्स)', 'इंटरनेट प्रोटोकॉल वर्शन 6 (64 बिट्स)', 'इंटरनल प्रोटोकॉल वर्शन 6 (32 बिट्स)', 'इंटरनेट पैकेट वर्शन 6 (128 बिट्स)'],
    correctIndex: 0,
    explanationEn: 'IPv6 stands for Internet Protocol version 6 and uses a 128-bit address space.',
    explanationHi: 'IPv6 का अर्थ इंटरनेट प्रोटोकॉल वर्शन 6 है और यह 128-बिट एड्रेस स्पेस का उपयोग करता है।'
  },
  {
    id: 5,
    topic: 'Digital Financial Services',
    questionEn: 'What is the full form of UPI in digital banking?',
    questionHi: 'डिजिटल बैंकिंग में UPI का पूर्ण रूप (Full Form) क्या है?',
    optionsEn: ['Unified Payments Interface', 'Universal Payment Integration', 'United Public Interface', 'Unique Person Identifier'],
    optionsHi: ['यूनिफाइड पेमेंट्स इंटरफेस (Unified Payments Interface)', 'यूनिवर्सल पेमेंट इंटीग्रेशन', 'यूनाइटेड पब्लिक इंटरफेस', 'यूनिक पर्सन आइडेंटिफायर'],
    correctIndex: 0,
    explanationEn: 'UPI stands for Unified Payments Interface, developed by National Payments Corporation of India (NPCI).',
    explanationHi: 'UPI का अर्थ यूनिफाइड पेमेंट्स इंटरफेस है, जिसे NPCI द्वारा विकसित किया गया है।'
  },
  {
    id: 6,
    topic: 'Operating Systems',
    questionEn: 'Which command in Linux is used to display the current working directory?',
    questionHi: 'लिनक्स (Linux) में वर्तमान वर्किंग डायरेक्टरी देखने के लिए किस कमांड का उपयोग किया जाता है?',
    optionsEn: ['pwd', 'cd', 'ls', 'dir'],
    optionsHi: ['pwd', 'cd', 'ls', 'dir'],
    correctIndex: 0,
    explanationEn: 'The pwd command stands for "print working directory" and displays the absolute path of the current directory.',
    explanationHi: 'pwd कमांड का अर्थ "print working directory" है, जो वर्तमान डायरेक्टरी का पूरा पथ प्रदर्शित करता है।'
  },
  {
    id: 7,
    topic: 'Cyber Security',
    questionEn: 'What type of cyber attack tricks individuals into disclosing confidential credentials via fake websites or emails?',
    questionHi: 'किस प्रकार का साइबर हमला नकली वेबसाइटों या ईमेल के माध्यम से व्यक्तियों को गोपनीय जानकारी प्रकट करने के लिए धोखा देता है?',
    optionsEn: ['Phishing', 'DDoS Attack', 'Trojan Horse', 'Spyware'],
    optionsHi: ['फ़िशिंग (Phishing)', 'डीडीओएस (DDoS) हमला', 'ट्रोजन हॉर्स (Trojan Horse)', 'स्पाइवेयर (Spyware)'],
    correctIndex: 0,
    explanationEn: 'Phishing is a social engineering attack used to steal user credentials such as login passwords and credit card details.',
    explanationHi: 'फ़िशिंग एक सोशल इंजीनियरिंग हमला है जिसका उपयोग पासवर्ड और वित्तीय जानकारी चुराने के लिए किया जाता है।'
  },
  {
    id: 8,
    topic: 'LibreOffice Impress',
    questionEn: 'What is the shortcut key to start a slide show from the first slide in LibreOffice Impress?',
    questionHi: 'लिब्रेऑफिस इम्प्रेस (Impress) में पहली स्लाइड से स्लाइड शो शुरू करने की शॉर्टकट कुंजी क्या है?',
    optionsEn: ['F5', 'Shift + F5', 'Ctrl + F5', 'Alt + F5'],
    optionsHi: ['F5', 'Shift + F5', 'Ctrl + F5', 'Alt + F5'],
    correctIndex: 0,
    explanationEn: 'F5 starts the presentation from the first slide; Shift + F5 starts from the currently active slide.',
    explanationHi: 'F5 पहली स्लाइड से स्लाइड शो शुरू करता है, जबकि Shift + F5 वर्तमान स्लाइड से शुरू करता है।'
  },
  {
    id: 9,
    topic: 'Fundamentals',
    questionEn: 'Which component of a CPU directs and coordinates most of the operations in the computer?',
    questionHi: 'सीपीयू (CPU) का कौन सा घटक कंप्यूटर के अधिकांश ऑपरेशनों को निर्देशित और समन्वयित करता है?',
    optionsEn: ['Control Unit (CU)', 'Arithmetic Logic Unit (ALU)', 'Registers', 'Motherboard'],
    optionsHi: ['कंट्रोल यूनिट (Control Unit - CU)', 'अरिथमेटिक लॉजिक यूनिट (ALU)', 'रजिस्टर (Registers)', 'मदरबोर्ड (Motherboard)'],
    correctIndex: 0,
    explanationEn: 'The Control Unit (CU) interprets instructions and manages the flow of data within the processor.',
    explanationHi: 'कंट्रोल यूनिट (CU) निर्देशों को डिकोड करता है और प्रोसेसर के भीतर डेटा प्रवाह को नियंत्रित करता है।'
  },
  {
    id: 10,
    topic: 'Digital Financial Services',
    questionEn: 'What is the maximum character length of an IFSC (Indian Financial System Code)?',
    questionHi: 'IFSC (भारतीय वित्तीय प्रणाली कोड) की अधिकतम वर्ण लंबाई (Characters) कितनी होती है?',
    optionsEn: ['11 characters', '10 characters', '12 characters', '16 characters'],
    optionsHi: ['11 वर्ण (Characters)', '10 वर्ण', '12 वर्ण', '16 वर्ण'],
    correctIndex: 0,
    explanationEn: 'An IFSC is an 11-character alphanumeric code where the first 4 characters represent the bank, the 5th character is 0, and the last 6 represent the branch.',
    explanationHi: 'IFSC 11 वर्णों का कोड होता है, जिसमें पहले 4 अक्षर बैंक को दर्शाते हैं, 5वां अंक शून्य होता है और अंतिम 6 अंक शाखा को दर्शाते हैं।'
  },
  {
    id: 11,
    topic: 'LibreOffice Writer',
    questionEn: 'What is the shortcut key for inserting a table in LibreOffice Writer?',
    questionHi: 'लिब्रेऑफिस राइटर में तालिका (Table) डालने की शॉर्टकट कुंजी क्या है?',
    optionsEn: ['Ctrl + F12', 'Ctrl + T', 'Alt + T', 'Shift + F12'],
    optionsHi: ['Ctrl + F12', 'Ctrl + T', 'Alt + T', 'Shift + F12'],
    correctIndex: 0,
    explanationEn: 'Ctrl + F12 opens the Insert Table dialog box in LibreOffice Writer.',
    explanationHi: 'Ctrl + F12 लिब्रेऑफिस राइटर में इन्सर्ट टेबल डायलॉग बॉक्स खोलता है।'
  },
  {
    id: 12,
    topic: 'Networking',
    questionEn: 'Which device is primarily used to connect different networks and forward data packets between them based on IP addresses?',
    questionHi: 'आईपी एड्रेस के आधार पर विभिन्न नेटवर्कों को जोड़ने और डेटा पैकेट अग्रेषित करने के लिए किस उपकरण का उपयोग किया जाता है?',
    optionsEn: ['Router', 'Hub', 'Repeater', 'Modem'],
    optionsHi: ['राउटर (Router)', 'हब (Hub)', 'रिपीटर (Repeater)', 'मॉडेम (Modem)'],
    correctIndex: 0,
    explanationEn: 'A Router operates at Layer 3 (Network Layer) of the OSI model and forwards packets between different IP subnets.',
    explanationHi: 'राउटर OSI मॉडल के नेटवर्क लेयर पर कार्य करता है और विभिन्न आईपी सबनेट्स के बीच डेटा पैकेट अग्रेषित करता है।'
  },
  {
    id: 13,
    topic: 'Operating Systems',
    questionEn: 'Which of the following is an open-source operating system?',
    questionHi: 'निम्नलिखित में से कौन सा एक ओपन-सोर्स (Open-Source) ऑपरेटिंग सिस्टम है?',
    optionsEn: ['Linux Ubuntu', 'Microsoft Windows 11', 'Apple macOS', 'Microsoft Windows Server'],
    optionsHi: ['लिनक्स उबंटू (Linux Ubuntu)', 'माइक्रोसॉफ्ट विंडोज 11', 'ऐप्पल मैकओएस (macOS)', 'विंडोज सर्वर'],
    correctIndex: 0,
    explanationEn: 'Linux Ubuntu is free, open-source software whose kernel code is publicly available and modifiable.',
    explanationHi: 'लिनक्स उबंटू एक स्वतंत्र और ओपन-सोर्स ऑपरेटिंग सिस्टम है जिसका कोड सार्वजनिक रूप से उपलब्ध है।'
  },
  {
    id: 14,
    topic: 'Cyber Security',
    questionEn: 'What is the full form of OTP used in two-factor authentication?',
    questionHi: 'टू-फैक्टर ऑथेंटिकेशन में उपयोग होने वाले OTP का पूर्ण रूप क्या है?',
    optionsEn: ['One Time Password', 'Online Transaction Protocol', 'Only Transfer Password', 'Open Transfer PIN'],
    optionsHi: ['वन टाइम पासवर्ड (One Time Password)', 'ऑनलाइन ट्रांजैक्शन प्रोटोकॉल', 'ओनली ट्रांसफर पासवर्ड', 'ओपन ट्रांसफर पिन'],
    correctIndex: 0,
    explanationEn: 'OTP stands for One Time Password, valid for a single transaction or login session.',
    explanationHi: 'OTP का अर्थ वन टाइम पासवर्ड है, जो केवल एक सत्र या लेन-देन के लिए मान्य होता है।'
  },
  {
    id: 15,
    topic: 'LibreOffice Calc',
    questionEn: 'In LibreOffice Calc, which symbol must precede every mathematical formula?',
    questionHi: 'लिब्रेऑफिस कैल्क में, प्रत्येक गणितीय सूत्र के आगे कौन सा चिह्न होना अनिवार्य है?',
    optionsEn: ['= (Equals sign)', '+ (Plus sign)', '@ (At sign)', '# (Hash sign)'],
    optionsHi: ['= (बराबर का चिह्न)', '+ (प्लस का चिह्न)', '@ (एट चिह्न)', '# (हैश चिह्न)'],
    correctIndex: 0,
    explanationEn: 'Every formula in Calc begins with an equals sign (=) to signal an expression to be calculated.',
    explanationHi: 'कैल्क में प्रत्येक सूत्र की शुरुआत बराबर (=) के चिह्न से होती है ताकि सॉफ्टवेयर समझ सके कि गणना करनी है।'
  },
  {
    id: 16,
    topic: 'Digital Financial Services',
    questionEn: 'What is the dialing code for USSD-based mobile banking in India (*...#)?',
    questionHi: 'भारत में यूएसएसडी (USSD) आधारित मोबाइल बैंकिंग के लिए डायलिंग कोड क्या है?',
    optionsEn: ['*99#', '*121#', '*100#', '*91#'],
    optionsHi: ['*99#', '*121#', '*100#', '*91#'],
    correctIndex: 0,
    explanationEn: '*99# is the National Unified USSD Platform (NUUP) code for mobile banking without internet on basic mobile phones.',
    explanationHi: '*99# बिना इंटरनेट के बुनियादी कीपैड मोबाइल पर बैंकिंग सेवाओं के लिए एनपीसीआई का आधिकारिक कोड है।'
  },
  {
    id: 17,
    topic: 'Fundamentals',
    questionEn: '1 Terabyte (TB) is equal to how many Gigabytes (GB)?',
    questionHi: '1 टेराबाइट (TB) में कितने गीगाबाइट (GB) होते हैं?',
    optionsEn: ['1024 GB', '1000 GB', '512 GB', '2048 GB'],
    optionsHi: ['1024 GB', '1000 GB', '512 GB', '2048 GB'],
    correctIndex: 0,
    explanationEn: 'In binary computer memory computation, 1 TB = 1024 GB.',
    explanationHi: 'बाइनरी मेमोरी गणना में, 1 TB = 1024 GB के बराबर होता है।'
  },
  {
    id: 18,
    topic: 'LibreOffice Impress',
    questionEn: 'In LibreOffice Impress, which menu contains the option to insert animated slide transitions?',
    questionHi: 'लिब्रेऑफिस इम्प्रेस में, स्लाइड ट्रांजिशन (Slide Transition) किस मेनू या साइडबार में स्थित होता है?',
    optionsEn: ['Slide Menu', 'File Menu', 'Tools Menu', 'Window Menu'],
    optionsHi: ['स्लाइड मेनू (Slide Menu)', 'फ़ाइल मेनू', 'टूल्स मेनू', 'विंडो मेनू'],
    correctIndex: 0,
    explanationEn: 'Slide transitions are configured via the Slide menu and the dedicated Slide Transition sidebar panel.',
    explanationHi: 'स्लाइड ट्रांजिशन को स्लाइड मेनू और साइडबार पैनल से लागू और प्रबंधित किया जाता है।'
  },
  {
    id: 19,
    topic: 'Networking',
    questionEn: 'Which protocol is used for securely transmitting encrypted web pages between browser and server?',
    questionHi: 'ब्राउज़र और सर्वर के बीच एन्क्रिप्टेड वेब पेजों को सुरक्षित रूप से प्रसारित करने के लिए किस प्रोटोकॉल का उपयोग किया जाता है?',
    optionsEn: ['HTTPS (HyperText Transfer Protocol Secure)', 'HTTP', 'FTP', 'SMTP'],
    optionsHi: ['HTTPS (हाइपरटेक्स्ट ट्रांसफर प्रोटोकॉल सिक्योर)', 'HTTP', 'FTP', 'SMTP'],
    correctIndex: 0,
    explanationEn: 'HTTPS encrypts communications using Transport Layer Security (TLS/SSL).',
    explanationHi: 'HTTPS प्रोटोकॉल डेटा को टीएलएस/एसएसएल एन्क्रिप्शन के साथ सुरक्षित रूप से भेजता है।'
  },
  {
    id: 20,
    topic: 'LibreOffice Writer',
    questionEn: 'What is the keyboard shortcut for saving a file under a new name (Save As) in LibreOffice Writer?',
    questionHi: 'लिब्रेऑफिस राइटर में नए नाम से फ़ाइल सहेजने (Save As) का कीबोर्ड शॉर्टकट क्या है?',
    optionsEn: ['Ctrl + Shift + S', 'Ctrl + S', 'F12', 'Alt + S'],
    optionsHi: ['Ctrl + Shift + S', 'Ctrl + S', 'F12', 'Alt + S'],
    correctIndex: 0,
    explanationEn: 'Ctrl + Shift + S triggers the Save As dialog in LibreOffice Writer.',
    explanationHi: 'Ctrl + Shift + S लिब्रेऑफिस राइटर में "Save As" डायलॉग बॉक्स खोलता है।'
  }
];

export interface ExamScoreRecord {
  score: number;
  total: number;
  percentage: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  gradeTitle: string;
  topicBreakdown: Record<string, { correct: number; total: number }>;
}

export function calculateCccScore(userAnswers: Record<number, number>): ExamScoreRecord {
  let score = 0;
  const total = CCC_EXAM_QUESTIONS.length;
  const topicBreakdown: Record<string, { correct: number; total: number }> = {};

  CCC_EXAM_QUESTIONS.forEach((q) => {
    if (!topicBreakdown[q.topic]) {
      topicBreakdown[q.topic] = { correct: 0, total: 0 };
    }
    topicBreakdown[q.topic].total += 1;

    if (userAnswers[q.id] === q.correctIndex) {
      score += 1;
      topicBreakdown[q.topic].correct += 1;
    }
  });

  const percentage = Math.round((score / total) * 100);

  let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let gradeTitle = 'Needs Practice (Fail)';

  if (percentage >= 85) {
    grade = 'S';
    gradeTitle = 'Super Grade (Distinction)';
  } else if (percentage >= 75) {
    grade = 'A';
    gradeTitle = 'Grade A (Excellent)';
  } else if (percentage >= 65) {
    grade = 'B';
    gradeTitle = 'Grade B (Good)';
  } else if (percentage >= 55) {
    grade = 'C';
    gradeTitle = 'Grade C (Satisfactory)';
  } else if (percentage >= 50) {
    grade = 'D';
    gradeTitle = 'Grade D (Pass)';
  }

  return {
    score,
    total,
    percentage,
    grade,
    gradeTitle,
    topicBreakdown
  };
}
