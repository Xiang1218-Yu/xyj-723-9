/**
 * 通用工具函数（原 untils/util.js、untils/untils.js 的 TS 收敛版）
 * @module utils/format
 */

/** 补零 */
export function formatNumber(n: number | string): string {
  const s = n.toString();
  return s[1] ? s : `0${s}`;
}

/** 格式化时间为 YYYY-MM-DD HH:mm:ss */
export function formatTime(date: Date | number | string): string {
  const d = new Date(date);
  const ymd = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(formatNumber).join('-');
  const hms = [d.getHours(), d.getMinutes(), d.getSeconds()].map(formatNumber).join(':');
  return `${ymd} ${hms}`;
}

/** 获取当天日期字符串 YYYY-MM-DD */
export function getDateStr(date: Date = new Date()): string {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(formatNumber).join('-');
}

/** 将评分转换为 5 位星级数组（1 表示实心） */
export function convertToStarsArray(stars: number | string): number[] {
  const num = Number(stars.toString().substring(0, 1));
  const array: number[] = [];
  for (let i = 1; i <= 5; i += 1) {
    array.push(i <= num ? 1 : 0);
  }
  return array;
}
