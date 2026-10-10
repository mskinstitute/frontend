import { jsPDF } from 'jspdf';
import { StudyMaterial } from '@/types';

export function downloadCheatsheetPdf(material: StudyMaterial): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 186mm
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 14) {
      doc.addPage();
      y = margin;
      renderHeader(true);
    }
  };

  const renderHeader = (isContinuation = false) => {
    if (!isContinuation) {
      // ----------------------------------------------------
      // PAGE 1: PRO HEADER BANNER WITH CONTACT & SOCIAL CARD
      // ----------------------------------------------------
      const bannerHeight = 34;
      doc.setFillColor(15, 23, 42); // slate 900
      doc.roundedRect(margin, y, contentWidth, bannerHeight, 2, 2, 'F');

      // Top Orange Brand Accent Line
      doc.setFillColor(249, 115, 22); // primary secondary orange
      doc.rect(margin + 2, y, contentWidth - 4, 1.2, 'F');

      // Institute Top Tagline
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(249, 115, 22);
      doc.text('MSK INSTITUTE  •  OFFICIAL REVISION CHEATSHEET', margin + 4, y + 4.5, { baseline: 'top' });

      // Document Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      const titleLines = doc.splitTextToSize(material.title, 116);
      doc.text(titleLines, margin + 4, y + 9.5, { baseline: 'top' });

      // Metadata Row (Category, Level, Academic Year)
      const metaY = y + 9.5 + titleLines.length * 4.8 + 1;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // slate 400
      doc.text(
        `Category: ${material.category}   |   Level: ${material.level}   |   Curriculum: 2026`,
        margin + 4,
        metaY,
        { baseline: 'top' }
      );

      // Right-Side Contact & Social Media Card
      const cardX = margin + 122;
      const cardW = 60;
      const cardH = 26;
      doc.setFillColor(30, 41, 59); // slate 800
      doc.setDrawColor(51, 65, 85); // slate 700
      doc.roundedRect(cardX, y + 4, cardW, cardH, 1.5, 1.5, 'FD');

      // Contact / WhatsApp
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('WhatsApp: +91 8393042166', cardX + 3, y + 6.5, { baseline: 'top' });

      // Social Media Username
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(192, 132, 252); // purple 300
      doc.text('Social: @mskinstitute', cardX + 3, y + 11.5, { baseline: 'top' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text('(Instagram • YouTube • WhatsApp)', cardX + 3, y + 16, { baseline: 'top' });

      // Official Website
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(251, 146, 60); // orange 400
      doc.text('Website: mskinstitute.in', cardX + 3, y + 21, { baseline: 'top' });

      y += bannerHeight + 3;

      // Overview Description Box (Page 1 Only)
      if (material.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        const descLines = doc.splitTextToSize(material.description, contentWidth - 8);
        const descBoxHeight = descLines.length * 3.6 + 3;

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, y, contentWidth, descBoxHeight, 1, 1, 'FD');

        doc.setTextColor(71, 85, 105);
        doc.text(descLines, margin + 4, y + 1.8, { baseline: 'top' });
        y += descBoxHeight + 3;
      }
    } else {
      // ----------------------------------------------------
      // PAGES 2+: COMPACT RUNNING HEADER WITH BRAND & CONTACT
      // ----------------------------------------------------
      const contHeight = 7.5;
      doc.setFillColor(15, 23, 42); // slate 900
      doc.roundedRect(margin, y, contentWidth, contHeight, 1, 1, 'F');

      // Top Accent Line
      doc.setFillColor(249, 115, 22);
      doc.rect(margin + 1, y, contentWidth - 2, 0.8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      const shortTitle =
        material.title.length > 45 ? material.title.substring(0, 42) + '...' : material.title;
      doc.text(`MSK INSTITUTE  •  ${shortTitle}`, margin + 4, y + 2.2, { baseline: 'top' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(251, 146, 60);
      const rightText = 'WhatsApp: +91 8393042166  |  @mskinstitute  |  mskinstitute.in';
      const textWidth = doc.getTextWidth(rightText);
      doc.text(rightText, margin + contentWidth - textWidth - 3, y + 2.2, { baseline: 'top' });

      y += contHeight + 3;
    }
  };

  renderHeader(false);

  // ----------------------------------------------------
  // RENDER CHEATSHEET SECTIONS & SYNTAX CARDS
  // ----------------------------------------------------
  const sections = material.cheatsheetContent?.sections || [];
  sections.forEach((sec) => {
    checkPageBreak(16);

    // Section Category Title Banner
    doc.setFillColor(243, 232, 255); // light purple bg
    doc.setDrawColor(216, 180, 254);
    doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'FD');

    // Solid purple accent bar on left
    doc.setFillColor(126, 34, 206);
    doc.rect(margin, y, 2, 6.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(88, 28, 135);
    doc.text(sec.categoryTitle.toUpperCase(), margin + 4, y + 1.8, { baseline: 'top' });

    // Item Count Pill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(147, 51, 234);
    const countText = `${sec.items.length} ${sec.items.length === 1 ? 'item' : 'items'}`;
    const countW = doc.getTextWidth(countText);
    doc.text(countText, margin + contentWidth - countW - 3, y + 2, { baseline: 'top' });

    y += 8.5;

    // Render individual syntax items
    sec.items.forEach((item) => {
      const syntaxText = item.commandOrSyntax;
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      const syntaxLines = doc.splitTextToSize(syntaxText, contentWidth - 10);
      const syntaxHeight = syntaxLines.length * 4 + 2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const explanationLines = doc.splitTextToSize(item.explanation, contentWidth - 10);
      const explanationHeight = explanationLines.length * 3.5;

      let exampleLines: string[] = [];
      let exampleHeight = 0;
      if (item.example) {
        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
        exampleLines = doc.splitTextToSize(`e.g. ${item.example}`, contentWidth - 10);
        exampleHeight = exampleLines.length * 3.2 + 1;
      }

      const totalItemHeight = syntaxHeight + explanationHeight + exampleHeight + 3.5;
      checkPageBreak(totalItemHeight);

      // Card Background with border
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, totalItemHeight, 1.2, 1.2, 'FD');

      // Syntax Box inside Card
      let innerY = y + 1.5;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(216, 180, 254);
      doc.roundedRect(margin + 2, innerY, contentWidth - 4, syntaxHeight - 0.5, 0.8, 0.8, 'FD');

      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(109, 40, 217);
      doc.text(syntaxLines, margin + 4, innerY + 1.2, { baseline: 'top' });
      innerY += syntaxHeight + 1;

      // Explanation
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(explanationLines, margin + 3.5, innerY, { baseline: 'top' });
      innerY += explanationHeight + 0.5;

      // Example
      if (exampleLines.length > 0) {
        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(exampleLines, margin + 3.5, innerY, { baseline: 'top' });
      }

      y += totalItemHeight + 2;
    });

    y += 1.5;
  });

  // ----------------------------------------------------
  // FOOTER ON EVERY PAGE: CONTACT, SOCIAL & PAGE NUMBERS
  // ----------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 9, margin + contentWidth, pageHeight - 9);

    doc.text(
      'MSK Institute, Shikohabad (UP)  •  WhatsApp / Call: +91 8393042166  •  @mskinstitute',
      margin,
      pageHeight - 5.5,
      { baseline: 'top' }
    );

    const rightFooter = `mskinstitute.in  •  Page ${i} of ${totalPages}`;
    const rfW = doc.getTextWidth(rightFooter);
    doc.text(rightFooter, margin + contentWidth - rfW, pageHeight - 5.5, { baseline: 'top' });
  }

  // Direct download filename
  const rawTitle = material.slug || material.title || 'cheatsheet';
  const cleanFilename = rawTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  doc.save(`${cleanFilename}-msk-institute.pdf`);
}
