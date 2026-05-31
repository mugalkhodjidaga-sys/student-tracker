/**
 * SJM Health Database — Google Apps Script
 * Deploy: Execute as Me · Who has access: Anyone
 *
 * Tabs & headers:
 * Students:     StudentId | Name | Age | Gender | Room | BloodGroup | GuardianName | GuardianPhone | Class | Allergies | HealthStatus
 * HealthRecords: RecordId | StudentId | VisitDate | IssueType | Symptoms | Severity | TreatedBy | Notes | Temperature | BloodPressure | OxygenLevel
 * Medicines:    MedicineId | RecordId | StudentId | MedicineName | Dosage | DoseAmount | DoseUnit | FoodTiming | ScheduleJson | SchedulePreset | MedicineNotes | StartDate | EndDate
 * Attachments:  AttachmentId | RecordId | StudentId | FileName | DriveFileId | DriveWebViewLink | SyncStatus | UploadError | UploadedAt | PreviewDataUrl
 */

function doGet(e) {
  const action = e.parameter.action || 'getStudents';

  switch (action) {
    case 'getStudents':
      return jsonResponse(readSheetObjects('Students'), e);
    case 'getHealthRecords':
      return jsonResponse(getHealthRecordsData(e), e);
    case 'getMedicines':
      return jsonResponse(getMedicinesData(e), e);
    case 'getAttachments':
      return jsonResponse(getAttachmentsData(e), e);
    case 'getDashboardStats':
      return jsonResponse(getDashboardStatsData(), e);
    default:
      return jsonResponse({ success: false, message: 'Invalid action' }, e);
  }
}

function doPost(e) {
  const action = e.parameter.action || '';

  let data = {};
  if (e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse({ success: false, message: 'Invalid JSON body' });
    }
  }

  switch (action) {
    case 'addStudent':
      return addStudent(data);
    case 'updateStudent':
      return updateStudent(data);
    case 'addHealthRecord':
      return addHealthRecord(data);
    case 'addMedicine':
      return addMedicine(data);
    case 'addAttachment':
      return addAttachment(data);
    case 'updateAttachment':
      return updateAttachment(data);
    default:
      return jsonResponse({ success: false, message: 'Invalid action' });
  }
}

// ─── Students ───────────────────────────────────────────────────────────────

function getStudentsData() {
  return readSheetObjects('Students');
}

function addStudent(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Students');
  const studentId = new Date().getTime();

  sheet.appendRow([
    studentId,
    data.Name || '',
    data.Age || '',
    data.Gender || '',
    data.Room || '',
    data.BloodGroup || '',
    data.GuardianName || '',
    data.GuardianPhone || '',
    data.Class || '',
    data.Allergies || '',
    data.HealthStatus || 'healthy',
  ]);

  return jsonResponse({ success: true, studentId: studentId });
}

function updateStudent(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Students');
  const rows = sheet.getDataRange().getValues();
  const studentId = String(data.studentId || '');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === studentId) {
      sheet.getRange(i + 1, 2, 1, 10).setValues([[
        data.Name !== undefined ? data.Name : rows[i][1],
        data.Age !== undefined ? data.Age : rows[i][2],
        data.Gender !== undefined ? data.Gender : rows[i][3],
        data.Room !== undefined ? data.Room : rows[i][4],
        data.BloodGroup !== undefined ? data.BloodGroup : rows[i][5],
        data.GuardianName !== undefined ? data.GuardianName : rows[i][6],
        data.GuardianPhone !== undefined ? data.GuardianPhone : rows[i][7],
        data.Class !== undefined ? data.Class : rows[i][8] || '',
        data.Allergies !== undefined ? data.Allergies : rows[i][9] || '',
        data.HealthStatus !== undefined ? data.HealthStatus : rows[i][10] || 'healthy',
      ]]);
      return jsonResponse({ success: true, studentId: studentId });
    }
  }

  return jsonResponse({ success: false, message: 'Student not found' });
}

// ─── Health Records ─────────────────────────────────────────────────────────

function getHealthRecordsData(e) {
  let records = readSheetObjects('HealthRecords');
  const studentId = e.parameter.studentId;
  const recordId = e.parameter.recordId;

  if (studentId) {
    records = records.filter(function (r) {
      return String(r.StudentId) === String(studentId);
    });
  }
  if (recordId) {
    records = records.filter(function (r) {
      return String(r.RecordId) === String(recordId);
    });
  }

  return records;
}

function addHealthRecord(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('HealthRecords');
  const recordId = new Date().getTime();

  sheet.appendRow([
    recordId,
    data.StudentId || '',
    data.VisitDate || '',
    data.IssueType || '',
    data.Symptoms || '',
    data.Severity || '',
    data.TreatedBy || '',
    data.Notes || '',
    data.Temperature || '',
    data.BloodPressure || '',
    data.OxygenLevel || '',
  ]);

  return jsonResponse({ success: true, recordId: recordId });
}

// ─── Medicines ──────────────────────────────────────────────────────────────

function getMedicinesData(e) {
  let medicines = readSheetObjects('Medicines');
  const studentId = e.parameter.studentId;
  const recordId = e.parameter.recordId;

  if (studentId) {
    medicines = medicines.filter(function (m) {
      return String(m.StudentId) === String(studentId);
    });
  }
  if (recordId) {
    medicines = medicines.filter(function (m) {
      return String(m.RecordId) === String(recordId);
    });
  }

  return medicines;
}

function addMedicine(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Medicines');
  const medicineId = new Date().getTime() + Math.floor(Math.random() * 1000);

  sheet.appendRow([
    medicineId,
    data.RecordId || '',
    data.StudentId || '',
    data.MedicineName || '',
    data.Dosage || '',
    data.DoseAmount || '',
    data.DoseUnit || '',
    data.FoodTiming || '',
    data.ScheduleJson || '',
    data.SchedulePreset || '',
    data.MedicineNotes || '',
    data.StartDate || '',
    data.EndDate || '',
  ]);

  return jsonResponse({ success: true, medicineId: medicineId });
}

// ─── Attachments ────────────────────────────────────────────────────────────

function getAttachmentsData(e) {
  let attachments = readSheetObjects('Attachments');
  const studentId = e.parameter.studentId;
  const recordId = e.parameter.recordId;

  if (studentId) {
    attachments = attachments.filter(function (a) {
      return String(a.StudentId) === String(studentId);
    });
  }
  if (recordId) {
    attachments = attachments.filter(function (a) {
      return String(a.RecordId) === String(recordId);
    });
  }

  return attachments;
}

function addAttachment(data) {
  const sheet = getOrCreateSheet('Attachments', [
    'AttachmentId', 'RecordId', 'StudentId', 'FileName',
    'DriveFileId', 'DriveWebViewLink', 'SyncStatus', 'UploadError',
    'UploadedAt', 'PreviewDataUrl',
  ]);
  const attachmentId = new Date().getTime() + Math.floor(Math.random() * 1000);

  sheet.appendRow([
    attachmentId,
    data.RecordId || '',
    data.StudentId || '',
    data.FileName || '',
    data.DriveFileId || '',
    data.DriveWebViewLink || '',
    data.SyncStatus || 'pending',
    data.UploadError || '',
    data.UploadedAt || '',
    data.PreviewDataUrl || '',
  ]);

  return jsonResponse({ success: true, attachmentId: attachmentId });
}

function updateAttachment(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Attachments');
  if (!sheet) {
    return jsonResponse({ success: false, message: 'Attachments sheet not found' });
  }

  const rows = sheet.getDataRange().getValues();
  const attachmentId = String(data.attachmentId || '');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === attachmentId) {
      const headers = rows[0];
      headers.forEach(function (header, colIndex) {
        if (data[header] !== undefined) {
          sheet.getRange(i + 1, colIndex + 1).setValue(data[header]);
        }
      });
      return jsonResponse({ success: true, attachmentId: attachmentId });
    }
  }

  return jsonResponse({ success: false, message: 'Attachment not found' });
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

function getDashboardStatsData() {
  const studentCount = Math.max(0, sheetRowCount('Students') - 1);
  const visitCount = Math.max(0, sheetRowCount('HealthRecords') - 1);

  return {
    studentCount: studentCount,
    visitCount: visitCount,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function readSheetObjects(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  return data.slice(1)
    .filter(function (row) {
      return row.some(function (cell) { return cell !== '' && cell != null; });
    })
    .map(function (row) {
      const obj = {};
      headers.forEach(function (header, index) {
        obj[header] = row[index];
      });
      return obj;
    });
}

function sheetRowCount(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return sheet ? sheet.getLastRow() : 0;
}

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function jsonResponse(data, e) {
  const callback = e && e.parameter && e.parameter.callback;
  const json = JSON.stringify(data);

  if (callback) {
    // JSONP — bypasses browser CORS for GitHub Pages / PWA
    return ContentService.createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
