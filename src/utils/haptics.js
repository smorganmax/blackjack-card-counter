export function vibrate(pattern = 10) {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {}
}

export function lightTap() {
  vibrate(10);
}

export function mediumTap() {
  vibrate(30);
}

export function successPattern() {
  vibrate([20, 50, 20]);
}

export function errorPattern() {
  vibrate([40, 30, 40]);
}
