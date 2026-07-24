function formatTime(date) {
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

function formatNumber(n) {
  const s = n.toString();
  return s[1] ? s : '0' + s;
}

function convertToStarsArray(stars) {
  const num = stars.toString().substring(0, 1);
  const array = [];
  for (let i = 1; i <= 5; i++) {
    array.push(i <= Number(num) ? 1 : 0);
  }
  return array;
}

function convertToCastString(casts) {
  return casts.map(cast => cast.name).join('/');
}

function convertToCastInfos(casts) {
  return casts.map(cast => ({
    img: cast.avatars ? cast.avatars.large : '',
    name: cast.name
  }));
}

function debounce(func, wait) {
  let timeout = null;
  return function (...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function throttle(func, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone(obj[key]);
    });
    return clonedObj;
  }
  return obj;
}

module.exports = {
  formatTime,
  formatNumber,
  convertToStarsArray,
  convertToCastString,
  convertToCastInfos,
  debounce,
  throttle,
  deepClone
};
