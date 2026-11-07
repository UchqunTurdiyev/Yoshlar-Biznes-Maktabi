/**
 * Yoshlar Biznes Maktabi — lidlarni Google Sheetga yozish.
 *
 * O‘rnatish:
 * 1. Google Sheet → Kengaytmalar (Extensions) → Apps Script → shu kodni joylang.
 * 2. Deploy → Manage deployments → ✏️ → Version: New version → Deploy
 *    (Execute as: Me, Who has access: Anyone). URL o‘zgarmaydi.
 * 3. Ixtiyoriy: SECRET ga qiymat yozing va saytdagi GOOGLE_SHEETS_SECRET ga ham shuni qo‘ying.
 */
const SHEET_NAME = "Lidlar";
const SECRET = ""; // bo‘sh bo‘lsa tekshirilmaydi

const COLUMNS = [
  ["date", "Sana"],
  ["name", "Ism"],
  ["phone", "Telefon"],
  ["region", "Manzil"],
  ["age", "Yoshi"],
  ["employees", "Xodimlar soni"],
  ["turnover", "Aylanma"],
  ["utm_source", "utm_source"],
  ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"],
  ["utm_term", "utm_term"],
  ["amoLeadId", "amoCRM ID"],
  ["pageUrl", "Sahifa"],
  ["id", "Lid ID"],
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let data = {};
    try {
      data = JSON.parse((e.postData && e.postData.contents) || "{}");
    } catch (err) {
      data = e.parameter || {};
    }
    if (SECRET && data.secret !== SECRET) return out({ ok: false, error: "forbidden" });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(COLUMNS.map((c) => c[1]));
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
    }
    // Telefon "+998..." formula bo‘lib qolmasligi uchun matn sifatida yozamiz
    sh.appendRow(COLUMNS.map((c) => {
      const v = data[c[0]];
      return v === undefined || v === null ? "" : (c[0] === "phone" ? "'" + v : v);
    }));
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out({ ok: true, info: "POST only" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
