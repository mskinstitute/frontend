function doPost(e) {
  try {
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet and sheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(data.sheetName);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = spreadsheet.insertSheet(data.sheetName);
      
      // Add headers
      sheet.getRange(1, 1, 1, 9).setValues([[
        'Timestamp',
        'Course ID', 
        'Course Title',
        'Course Price',
        'Course Discount',
        'Student Name',
        'Student Phone',
        'Student Demo Date',
        'Source'
      ]]);
      
      // Format headers
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#f0f0f0');
    }
    
    // Append the new row
    sheet.appendRow([
      data.timestamp,
      data.courseId,
      data.courseTitle,
      data.coursePrice,
      data.courseDiscount,
      data.studentName,
      data.studentPhone,
      data.studentDemoDate,
      data.source
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data added successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setup() {
  // This function can be run manually to set up the sheet headers
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('demoRequest');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('demoRequest');
  }
  
  sheet.getRange(1, 1, 1, 9).setValues([[
    'Timestamp',
    'Course ID',
    'Course Title', 
    'Course Price',
    'Course Discount',
    'Student Name',
    'Student Phone',
    'Student Demo Date',
    'Source'
  ]]);
  
  sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#f0f0f0');
}