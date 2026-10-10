import { NextRequest, NextResponse } from 'next/server';
import { LeadSubmission } from '@/types';
import fs from 'fs/promises';
import path from 'path';

const WHATSAPP_NUMBER = '918393042166'; // MSK Institute Official WhatsApp: 8393042166

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email = '',
      city = '',
      learningMode = 'OFFLINE',
      batchId = '',
      batchTitle = '',
      courseTitle = '',
      price = '',
      startDate = '',
      schedule = '',
      query = '',
      utm_source = '',
      utm_medium = '',
      utm_campaign = '',
    } = body;

    // Basic validation
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and Phone number are required' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const leadId = `lead-${Date.now()}`;

    const leadData: LeadSubmission & {
      startDate?: string;
      schedule?: string;
    } = {
      id: leadId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim() || 'Not specified',
      learningMode: learningMode,
      batchId,
      batchTitle,
      courseTitle,
      price,
      startDate,
      schedule,
      query: query.trim(),
      submittedAt: timestamp,
      utm_source,
      utm_medium,
      utm_campaign,
    };

    // 1. Save to Local Backup (public/data/leads.json) to ensure zero data loss
    try {
      const dataDir = path.join(process.cwd(), 'public', 'data');
      await fs.mkdir(dataDir, { recursive: true });
      const filePath = path.join(dataDir, 'leads.json');

      let existingLeads: any[] = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        existingLeads = JSON.parse(fileContent);
        if (!Array.isArray(existingLeads)) existingLeads = [];
      } catch {
        existingLeads = [];
      }

      existingLeads.unshift(leadData);
      await fs.writeFile(filePath, JSON.stringify(existingLeads, null, 2), 'utf8');
    } catch (fsErr) {
      console.error('Failed to write local lead backup:', fsErr);
    }

    // 2. Forward to Google Sheets Webhook if configured in environment
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (googleSheetWebhookUrl) {
      try {
        await fetch(googleSheetWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            name: leadData.name,
            phone: leadData.phone,
            email: leadData.email,
            city: leadData.city,
            learningMode: leadData.learningMode,
            batchTitle: leadData.batchTitle,
            courseTitle: leadData.courseTitle,
            price: leadData.price,
            startDate: leadData.startDate,
            schedule: leadData.schedule,
            query: leadData.query,
            utm_source: leadData.utm_source,
            utm_campaign: leadData.utm_campaign,
          }),
        });
      } catch (sheetErr) {
        console.error('Failed forwarding lead to Google Sheet webhook:', sheetErr);
      }
    }

    // 3. Format Professional Business WhatsApp Message
    const formattedWhatsAppMessage = `🎓 *NEW LIVE BATCH ADMISSION ENQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Batch:* ${batchTitle || 'Coding Live Batch'}
📚 *Course:* ${courseTitle || 'Professional Training'}
${startDate ? `📅 *Start Date:* ${startDate}\n` : ''}${schedule ? `⏰ *Schedule:* ${schedule}\n` : ''}${price ? `💰 *Batch Fee:* ${price}\n` : ''}
👤 *STUDENT DETAILS:*
• *Full Name:* ${leadData.name}
• *WhatsApp Phone:* ${leadData.phone}
${leadData.email ? `• *Email Address:* ${leadData.email}\n` : ''}${leadData.city ? `• *City / Location:* ${leadData.city}\n` : ''}• *Preferred Mode:* ${leadData.learningMode === 'OFFLINE' ? 'Offline Classroom (Shikohabad)' : leadData.learningMode === 'ONLINE' ? 'Online Live' : 'Online & Offline'}
${leadData.query ? `• *Student Query:* ${leadData.query}\n` : '• *Goal:* Requesting Trial Demo & Admission Confirmation\n'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 *MSK Institute of Technology & Coding*
🚀 _Sent from Official MSK Live Admissions Portal_`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedWhatsAppMessage)}`;

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead registered successfully',
      whatsappUrl,
      formattedWhatsAppMessage,
    });
  } catch (error: any) {
    console.error('Lead submission API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
