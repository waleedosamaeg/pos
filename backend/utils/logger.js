import fs from 'fs';
import path from 'path';

// فولدر الـ Logs
const logDir = path.join(process.cwd(), 'logs');

// إنشاء فولدر لو مش موجود
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// دالة لتوليد اسم الملف حسب اليوم
const getLogFile = () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return path.join(logDir , `${dateStr}.log`);
};

// دالة أساسية للكتابة في الملف + Console
function writeLog(level, message, extra = '') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message} ${extra}\n`;

  // كتابة في الملف
  if (level === "error" || level === "warn") { 
      fs.appendFile(getLogFile(), logMessage, (err) => {
        if (err) console.error("Failed to write log:", err);
      });

  }

  // طباعة في الكونسول
  console.log(logMessage);
}

// اختصارات
export const info = (msg, extra) => writeLog('info', msg, extra);
export const warn = (msg, extra) => writeLog('warn', msg, extra);
export const error = (msg, extra) => writeLog('error', msg, extra);

// دالة عامة ممكن تستخدمها لأي Level
export const log = writeLog;
