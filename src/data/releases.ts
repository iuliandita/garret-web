export type Platform = 'linux' | 'windows' | 'macos' | 'android';
export interface PlatformRelease {
  label: string;
  assetUrl: string | null;
  intelUrl?: string;
}
const base = 'https://github.com/iuliandita/garret/releases/download/v0.0.1/';

export const release = {
  tag: 'v0.0.1',
  channel: 'alpha',
  releaseUrl: 'https://github.com/iuliandita/garret/releases/tag/v0.0.1',
  listingUrl: 'https://github.com/iuliandita/garret/releases',
  platforms: {
    linux: { label: 'Linux', assetUrl: base + 'garret-0.0.1-linux-x86_64.tar.gz' },
    windows: { label: 'Windows', assetUrl: base + 'garret-0.0.1-windows-x86_64.zip' },
    macos: { label: 'macOS', assetUrl: base + 'garret-0.0.1-macos-arm64.zip', intelUrl: base + 'garret-0.0.1-macos-x86_64.zip' },
    android: { label: 'Android', assetUrl: base + 'garret-0.0.1-android.apk' },
  } satisfies Record<Platform, PlatformRelease>,
} as const;
