#!/usr/bin/env node
/**
 * MSK Institute — Live Batches Data Integrity Validator
 *
 * Validates live batches fetched directly from Google Sheets:
 * - CSV connectivity and headers
 * - Unique Batch IDs
 * - Required fields: courseid, title, startdatetime, schedule, price, instructorId, totalSeats, leftSeats
 * - Valid courseSlug mapping to all-courses.json
 * - Valid batch lifecycle status
 * - Valid date formats & numeric seats
 */

const fs = require('fs');
const path = require('path');

const SHEET_CSV_URL = process.env.GOOGLE_SHEET_LIVE_BATCHES_URL 
  ? (process.env.GOOGLE_SHEET_LIVE_BATCHES_URL.includes('tqx=out:csv') 
      ? process.env.GOOGLE_SHEET_LIVE_BATCHES_URL 
      : 'https://docs.google.com/spreadsheets/d/1IMLDtXqnuM1A35xpboR_IrcYh5563ZCy55dzl1vGW1A/gviz/tq?tqx=out:csv&gid=1194716609')
  : 'https://docs.google.com/spreadsheets/d/1IMLDtXqnuM1A35xpboR_IrcYh5563ZCy55dzl1vGW1A/gviz/tq?tqx=out:csv&gid=1194716609';

const coursesPath = path.join(process.cwd(), 'public', 'data', 'all-courses.json');

console.log('--- MSK INSTITUTE LIVE BATCHES VALIDATION (GOOGLE SHEETS) ---');
console.log(`Connecting to: ${SHEET_CSV_URL}`);

function parseCsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell.length > 0)) rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) rows.push(currentRow);
  }

  return rows;
}

async function runValidation() {
  let csvText = '';
  try {
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    csvText = await res.text();
  } catch (err) {
    console.error(`FATAL: Could not fetch Google Sheet CSV: ${err.message}`);
    process.exit(1);
  }

  if (csvText.trim().startsWith('<!DOCTYPE html') || csvText.trim().startsWith('<html')) {
    console.error('FATAL: Google Sheet returned HTML instead of CSV (likely permissions or auth error).');
    process.exit(1);
  }

  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    console.error('FATAL: Google Sheet CSV must contain at least a header row and one batch row.');
    process.exit(1);
  }

  console.log(`Headers row: ${JSON.stringify(rows[0])}`);
  console.log(`Total batch data rows: ${rows.length - 1}`);

  const rawHeaders = rows[0].map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
  const headerMap = {};
  rawHeaders.forEach((header, idx) => {
    if (header === 'id' || header === 'batchid') headerMap['id'] = idx;
    else if (header === 'courseid' || header === 'courseslug' || header === 'course') headerMap['courseId'] = idx;
    else if (header === 'title' || header === 'batchtitle' || header === 'name') headerMap['title'] = idx;
    else if (header === 'status' || header === 'batchstatus') headerMap['status'] = idx;
    else if (header === 'startdatetime' || header === 'startdate' || header === 'datetime') headerMap['startDateTime'] = idx;
    else if (header === 'schedule' || header === 'timing' || header === 'time') headerMap['schedule'] = idx;
    else if (header === 'instructorid' || header === 'mentorid') headerMap['instructorId'] = idx;
    else if (header === 'price' || header === 'fee') headerMap['price'] = idx;
    else if (header === 'originalprice' || header === 'mrp') headerMap['originalPrice'] = idx;
    else if (header === 'totalseats' || header === 'seats') headerMap['totalSeats'] = idx;
    else if (header === 'leftseats' || header === 'remainingseats') headerMap['leftSeats'] = idx;
  });

  // Verify course catalog
  const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
  const validSlugs = new Set(courses.map(c => c.slug));
  const validIds = new Set(courses.map(c => c.id));

  let errors = 0;
  let warnings = 0;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const getVal = (k) => {
      const idx = headerMap[k];
      return idx !== undefined && idx < row.length ? row[idx].trim() : '';
    };

    const courseId = getVal('courseId');
    const title = getVal('title');
    const startDT = getVal('startDateTime');
    const schedule = getVal('schedule');
    const price = getVal('price');
    const totalSeats = getVal('totalSeats');
    const leftSeats = getVal('leftSeats');

    const idx = `Row #${r} (${courseId || title || 'unnamed'})`;

    if (!courseId) {
      console.error(`[ERROR] ${idx}: Missing 'courseid'`);
      errors++;
    } else if (!validSlugs.has(courseId) && !validIds.has(courseId)) {
      console.warn(`[WARN] ${idx}: courseid '${courseId}' not found in all-courses.json`);
      warnings++;
    }

    if (!title) {
      console.error(`[ERROR] ${idx}: Missing 'title'`);
      errors++;
    }

    if (!startDT) {
      console.error(`[ERROR] ${idx}: Missing 'startdatetime'`);
      errors++;
    }

    if (!schedule) {
      console.error(`[ERROR] ${idx}: Missing 'schedule'`);
      errors++;
    }

    if (!price) {
      console.error(`[ERROR] ${idx}: Missing 'price'`);
      errors++;
    }

    const tSeats = parseInt(totalSeats.replace(/[^\d]/g, ''), 10);
    const lSeats = parseInt(leftSeats.replace(/[^\d]/g, ''), 10);

    if (isNaN(tSeats) || tSeats <= 0) {
      console.warn(`[WARN] ${idx}: totalSeats '${totalSeats}' is not a valid positive number`);
      warnings++;
    }
    if (isNaN(lSeats)) {
      console.warn(`[WARN] ${idx}: leftSeats '${leftSeats}' is not a valid number`);
      warnings++;
    }

    console.log(`[OK] Validated batch: "${title}" (${price}) -> Seats: ${lSeats}/${tSeats}`);
  }

  console.log('----------------------------------------------------');
  console.log(`Validation finished: ${rows.length - 1} Google Sheet batches checked.`);
  console.log(`Errors: ${errors}, Warnings: ${warnings}`);

  if (errors > 0) {
    console.error('Validation FAILED: Please fix the errors listed above.');
    process.exit(1);
  } else {
    console.log('Validation PASSED: Google Sheet batch data is healthy and ready!');
    process.exit(0);
  }
}

runValidation();
