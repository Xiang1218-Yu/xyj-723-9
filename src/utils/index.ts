export function formatTime(date: Date | number | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('-') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
}

export function formatNumber(n: number): string {
  const s = n.toString();
  return s[1] ? s : '0' + s;
}

export function convertToStarsArray(stars: number): number[] {
  const num = stars.toString().substring(0, 1);
  const array: number[] = [];
  for (let i = 1; i <= 5; i++) {
    array.push(i <= Number(num) ? 1 : 0);
  }
  return array;
}

export function convertToCastString(casts: { name: string }[]): string {
  return casts.map(cast => cast.name).join('/');
}

export function convertToCastInfos(casts: { avatars?: { large: string }; name: string }[]): { img: string; name: string }[] {
  return casts.map(cast => ({
    img: cast.avatars ? cast.avatars.large : '',
    name: cast.name
  }));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    Object.keys(obj).forEach(key => {
      (clonedObj as Record<string, unknown>)[key] = deepClone(
        (obj as Record<string, unknown>)[key]
      );
    });
    return clonedObj;
  }
  return obj;
}
