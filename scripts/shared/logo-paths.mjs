import { join } from "node:path";

export const LOGO_DIR = "logo";

export const LOGO_FILES = {
  svg: "logo.svg",
  lightSvg: "logo-light.svg",
  markSvg: "logo-mark.svg",
  png: "logo.png",
  png248: "logo-248.png",
  png2x: "logo@2x.png",
  square250: "logo-square-250.png",
  square720: "logo-square-720.png",
  faviconSvg: "favicon.svg",
  faviconIco: "favicon.ico",
  favicon16: "favicon-16x16.png",
  favicon32: "favicon-32x32.png",
  appleTouch: "apple-touch-icon.png",
};

export function logoPublicDir(publicDir) {
  return join(publicDir, LOGO_DIR);
}

export function logoFile(publicDir, filename) {
  return join(publicDir, LOGO_DIR, filename);
}

export function logoUrl(filename) {
  return `/${LOGO_DIR}/${filename}`;
}
