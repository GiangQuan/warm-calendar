// Unified Vietnamese Calendar Utility
// Combines lunar calendar conversion and holiday detection
import { Solar } from 'lunar-typescript';

// ============ TYPES ============

export interface Holiday {
  name: string;
  nameEn?: string;
  type: 'public' | 'observance' | 'lunar';
  daysOff?: number;
}

export interface LunarInfo {
  day: number;
  month: number;
  year: number;
  displayText: string;    // For calendar cell display
  isSpecial: boolean;     // Mùng 1 or Rằm
  isFirstDay: boolean;    // Mùng 1
  isFullMoon: boolean;    // Rằm (15)
}

export interface DayInfo {
  date: Date;
  lunar: LunarInfo;
  holiday: Holiday | null;
}

// ============ FIXED SOLAR HOLIDAYS (MM-DD) ============

const FIXED_HOLIDAYS: Record<string, Holiday> = {
  '01-01': { name: 'Tết Dương lịch', nameEn: "New Year's Day", type: 'public', daysOff: 1 },
  '02-14': { name: 'Lễ Tình nhân', nameEn: "Valentine's Day", type: 'observance' },
  '03-08': { name: 'Quốc tế Phụ nữ', nameEn: "Int'l Women's Day", type: 'observance' },
  '04-30': { name: 'Giải phóng miền Nam', nameEn: 'Reunification Day', type: 'public', daysOff: 1 },
  '05-01': { name: 'Quốc tế Lao động', nameEn: 'Labour Day', type: 'public', daysOff: 1 },
  '06-01': { name: 'Quốc tế Thiếu nhi', nameEn: "Children's Day", type: 'observance' },
  '06-28': { name: 'Ngày Gia đình VN', nameEn: 'VN Family Day', type: 'observance' },
  '07-27': { name: 'Thương binh Liệt sĩ', nameEn: 'War Invalids Day', type: 'observance' },
  '09-02': { name: 'Quốc khánh', nameEn: 'National Day', type: 'public', daysOff: 2 },
  '10-20': { name: 'Ngày Phụ nữ VN', nameEn: "VN Women's Day", type: 'observance' },
  '11-20': { name: 'Ngày Nhà giáo VN', nameEn: "VN Teachers' Day", type: 'observance' },
  '12-22': { name: 'Ngày QĐND VN', nameEn: 'VN Army Day', type: 'observance' },
  '12-25': { name: 'Giáng sinh', nameEn: 'Christmas', type: 'observance' },
};

// ============ LUNAR HOLIDAYS (MM-DD in Lunar Calendar) ============
// These are automatically detected based on lunar date

interface LunarHolidayDef {
  month: number;
  day: number;
  name: string;
  nameEn: string;
  daysOff?: number;
  range?: number; // For multi-day holidays like Tết
}

const LUNAR_HOLIDAYS: LunarHolidayDef[] = [
  { month: 1, day: 1, name: 'Tết Nguyên đán', nameEn: 'Lunar New Year', daysOff: 5, range: 5 },
  { month: 3, day: 10, name: 'Giỗ Tổ Hùng Vương', nameEn: 'Hung Kings Day', daysOff: 1 },
  { month: 4, day: 15, name: 'Lễ Phật Đản', nameEn: 'Buddha Birthday', daysOff: 0 },
  { month: 7, day: 15, name: 'Lễ Vu Lan', nameEn: 'Ghost Festival', daysOff: 0 },
  { month: 8, day: 15, name: 'Tết Trung Thu', nameEn: 'Mid-Autumn', daysOff: 0 },
  { month: 12, day: 23, name: 'Ông Táo về trời', nameEn: 'Kitchen God Day', daysOff: 0 },
];

// Vietnamese month names
const LUNAR_MONTH_NAMES: Record<number, string> = {
  1: 'Giêng', 2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 6: 'Sáu',
  7: 'Bảy', 8: 'Tám', 9: 'Chín', 10: 'Mười', 11: 'M.Một', 12: 'Chạp'
};

// ============ CORE FUNCTIONS ============

// Convert solar date to lunar info
export function getLunarInfo(date: Date): LunarInfo {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  const day = lunar.getDay();
  const month = lunar.getMonth();
  const year = lunar.getYear();
  const isFirstDay = day === 1;
  const isFullMoon = day === 15;
  
  // Generate display text
  let displayText: string;
  if (isFirstDay) {
    displayText = `1/${LUNAR_MONTH_NAMES[month] || month}`;
  } else if (isFullMoon) {
    displayText = 'Rằm';
  } else {
    displayText = day.toString();
  }
  
  return {
    day,
    month,
    year,
    displayText,
    isSpecial: isFirstDay || isFullMoon,
    isFirstDay,
    isFullMoon,
  };
}

// Get holiday for a specific date (checks both solar and lunar)
export function getHoliday(date: Date): Holiday | null {
  // Check fixed solar holidays
  const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  if (FIXED_HOLIDAYS[monthDay]) {
    return FIXED_HOLIDAYS[monthDay];
  }
  
  // Check lunar holidays
  const lunar = getLunarInfo(date);
  
  for (const lh of LUNAR_HOLIDAYS) {
    // Check if this is the main holiday day
    if (lunar.month === lh.month && lunar.day === lh.day) {
      return {
        name: lh.name,
        nameEn: lh.nameEn,
        type: 'lunar',
        daysOff: lh.daysOff,
      };
    }
    
    // Check if this is part of a multi-day holiday (like Tết)
    if (lh.range && lh.range > 1) {
      const dayDiff = lunar.day - lh.day;
      if (lunar.month === lh.month && dayDiff > 0 && dayDiff < lh.range) {
        return {
          name: `${lh.name} (Mùng ${lunar.day})`,
          nameEn: lh.nameEn,
          type: 'lunar',
        };
      }
    }
  }
  
  return null;
}

// Get complete day info (lunar + holiday)
export function getDayInfo(date: Date): DayInfo {
  return {
    date,
    lunar: getLunarInfo(date),
    holiday: getHoliday(date),
  };
}

// Get holiday color for styling
export function getHolidayColor(type: Holiday['type']): string {
  switch (type) {
    case 'public': return 'bg-red-500';
    case 'lunar': return 'bg-amber-500';
    case 'observance': return 'bg-pink-400';
    default: return 'bg-gray-400';
  }
}

// Check if date is a public holiday (day off)
export function isPublicHoliday(date: Date): boolean {
  const holiday = getHoliday(date);
  return holiday !== null && holiday.daysOff !== undefined && holiday.daysOff > 0;
}

// Simple display function for backward compatibility
export function getLunarDisplay(date: Date): { text: string; isSpecial: boolean } {
  const lunar = getLunarInfo(date);
  return { text: lunar.displayText, isSpecial: lunar.isSpecial };
}
