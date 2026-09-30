import type { Platform } from '../data/releases';

export function detectPlatform(userAgent: string, platform = '', maxTouchPoints = 0): Platform | null {
  const device = userAgent + ' ' + platform;
  if (/Android/i.test(device)) return 'android';
  if (/iPhone|iPad|iPod|CrOS/i.test(device)) return null;
  if (/Mac/i.test(device) && maxTouchPoints > 1) return null;
  if (/Windows|Win32|Win64/i.test(device)) return 'windows';
  if (/Mac/i.test(device)) return 'macos';
  if (/Linux/i.test(device)) return 'linux';
  return null;
}

export function initPlatformSuggestion(): void {
  const platform = detectPlatform(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
  if (!platform) return;
  const link = document.querySelector<HTMLAnchorElement>('[data-os-download]');
  if (link) {
    link.href += '#' + platform;
    const defaultLabel = link.querySelector<HTMLElement>('[data-default-label]');
    if (defaultLabel) defaultLabel.hidden = true;
    const label = link.querySelector<HTMLElement>(`[data-os-label="${platform}"]`);
    if (label) label.hidden = false;
  }
  const section = document.querySelector<HTMLElement>(`[data-platform="${platform}"]`);
  if (section) {
    section.setAttribute('data-recommended', '');
    const note = section.querySelector<HTMLElement>('[data-suggestion]');
    if (note) note.hidden = false;
  }
}
