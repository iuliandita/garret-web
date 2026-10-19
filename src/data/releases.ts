export type Platform = 'linux' | 'windows' | 'macos' | 'android';
export type OptionId =
  | 'linuxDeb' | 'linuxRpm' | 'linuxAppImage' | 'linuxPortable'
  | 'windowsX64' | 'windowsArm64' | 'windowsX64Portable' | 'windowsArm64Portable'
  | 'macosArm64' | 'macosX64' | 'android';
export interface ReleaseOption {
  id: OptionId;
  url: string | null;
  secondary?: boolean;
}
export interface PlatformRelease {
  label: string;
  options: readonly ReleaseOption[];
}
const base = 'https://github.com/iuliandita/garret/releases/download/v0.0.10/';

export const release = {
  tag: 'v0.0.10',
  channel: 'alpha',
  androidInstructionsUrl: base + 'garret-0.0.10-android-info.zip',
  releaseUrl: 'https://github.com/iuliandita/garret/releases/tag/v0.0.10',
  listingUrl: 'https://github.com/iuliandita/garret/releases',
  platforms: {
    linux: { label: 'Linux', options: [
      { id: 'linuxDeb', url: base + 'garret-0.0.10-linux-x86_64.deb' },
      { id: 'linuxRpm', url: base + 'garret-0.0.10-linux-x86_64.rpm' },
      { id: 'linuxAppImage', url: base + 'garret-0.0.10-linux-x86_64.AppImage' },
      { id: 'linuxPortable', url: base + 'garret-0.0.10-linux-x86_64.tar.gz', secondary: true },
    ] },
    windows: { label: 'Windows', options: [
      { id: 'windowsX64', url: base + 'garret-0.0.10-windows-x86_64-setup.exe' },
      { id: 'windowsArm64', url: base + 'garret-0.0.10-windows-arm64-setup.exe' },
      { id: 'windowsX64Portable', url: base + 'garret-0.0.10-windows-x86_64.zip', secondary: true },
      { id: 'windowsArm64Portable', url: base + 'garret-0.0.10-windows-arm64.zip', secondary: true },
    ] },
    macos: { label: 'macOS', options: [
      { id: 'macosArm64', url: base + 'garret-0.0.10-macos-arm64.dmg' },
      { id: 'macosX64', url: base + 'garret-0.0.10-macos-x86_64.dmg' },
    ] },
    android: { label: 'Android', options: [
      { id: 'android', url: base + 'garret-0.0.10-android.apk' },
    ] },
  } satisfies Record<Platform, PlatformRelease>,
} as const;
