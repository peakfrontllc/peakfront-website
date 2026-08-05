/** Public paths for brand logo and favicon assets (stored in /public/logo). */
export const LOGO_BASE = "/logo" as const;

export const logoAssets = {
  svg: `${LOGO_BASE}/logo.svg`,
  lightSvg: `${LOGO_BASE}/logo-light.svg`,
  markSvg: `${LOGO_BASE}/logo-mark.svg`,
  png: `${LOGO_BASE}/logo.png`,
  png248: `${LOGO_BASE}/logo-248.png`,
  png2x: `${LOGO_BASE}/logo@2x.png`,
  square250: `${LOGO_BASE}/logo-square-250.png`,
  square720: `${LOGO_BASE}/logo-square-720.png`,
  faviconSvg: `${LOGO_BASE}/favicon.svg`,
  faviconIco: `${LOGO_BASE}/favicon.ico`,
  favicon16: `${LOGO_BASE}/favicon-16x16.png`,
  favicon32: `${LOGO_BASE}/favicon-32x32.png`,
  appleTouch: `${LOGO_BASE}/apple-touch-icon.png`,
} as const;
