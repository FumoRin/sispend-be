/**
 * Utility ini generated untuk parsing data bulan tahun
 * yang terdapat di database. Contoh: "Januari 2024"
 *
 * Kode yang tedapat pada monule ini AI-Generated dengan
 * beberapa modifikasi untuk sesuai penggunaan
 */

// Indonesian month names mapping
const bulan = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

/**
 * Parse Indonesian month-year string to Date object
 * @param {string} monthYearString - String like "Januari 2024"
 * @returns {Date|null} - Parsed ISO date format or null if invalid
 */
export function parseBulanTahun(monthYearString) {
  if (!monthYearString || typeof monthYearString !== "string") {
    return null;
  }

  const trimmed = monthYearString.trim().toLowerCase();

  // Try to match pattern like "januari 2024" or "Januari 2024"
  const match = trimmed.match(/^([a-z]+)\s+(\d{4})$/);
  if (!match) {
    return null;
  }

  const monthName = match[1];
  const year = parseInt(match[2]);

  // Check if month name is valid
  if (!bulan.hasOwnProperty(monthName)) {
    return null;
  }

  const month = bulan[monthName];
  const date = new Date(year, month, 1);

  // Validate the date
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

/**
 * Extract year from Indonesian month-year string
 * @param {string} monthYearString - String like "Januari 2024"
 * @returns {number|null} - Year number (2024) or null if invalid
 */
export function extractTahunDariBulanTahun(monthYearString) {
  const date = parseBulanTahun(monthYearString);
  return date ? date.getFullYear() : null;
}

/**
 * Check if a string is a valid Indonesian month-year format
 * @param {string} monthYearString - String to validate
 * @returns {boolean} - True if valid format
 */
export function validsasiBulanTahun(monthYearString) {
  return parseBulanTahun(monthYearString) !== null;
}

/**
 * Format Indonesian month-year string to standard format
 * @param {string} monthYearString - String like "Januari 2024"
 * @returns {string|null} - Formatted string like "2024-01" or null if invalid
 */
export function formatBulanTahun(monthYearString) {
  const date = parseBulanTahun(monthYearString);
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}
