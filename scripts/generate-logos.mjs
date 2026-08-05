import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import {
  LOGO_FILES,
  logoFile,
  logoPublicDir,
} from "./shared/logo-paths.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const logoDir = logoPublicDir(publicDir);
const logoSvg = readFileSync(logoFile(publicDir, LOGO_FILES.svg), "utf8");

const LOGO_ASPECT = 248 / 44;

const horizontalSizes = [
  { name: LOGO_FILES.png248, width: 248 },
  { name: LOGO_FILES.png, width: 496 },
  { name: LOGO_FILES.png2x, width: 992 },
];

const squareSizes = [
  { name: LOGO_FILES.square250, size: 250 },
  { name: LOGO_FILES.square720, size: 720 },
];

function buildHorizontalHtml(width) {
  const height = Math.round(width / LOGO_ASPECT);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=JetBrains+Mono:wght@500&display=swap"
    />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html,
      body {
        background: transparent;
      }

      #logo {
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
      }

      #logo svg {
        display: block;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="logo">${logoSvg}</div>
  </body>
</html>`;
}

function buildSquareHtml(size) {
  const logoWidth = Math.round(size * 0.82);
  const logoHeight = Math.round(logoWidth / LOGO_ASPECT);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=JetBrains+Mono:wght@500&display=swap"
    />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html,
      body {
        background: #ffffff;
      }

      #square {
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
      }

      #logo {
        width: ${logoWidth}px;
        height: ${logoHeight}px;
      }

      #logo svg {
        display: block;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="square">
      <div id="logo">${logoSvg}</div>
    </div>
  </body>
</html>`;
}

async function preparePage(page, html) {
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await new Promise((resolve) => setTimeout(resolve, 250));
}

async function screenshotElement(page, selector) {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }

  return element.screenshot({
    type: "png",
    omitBackground: selector === "#logo",
  });
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60_000);

  for (const { name, width } of horizontalSizes) {
    await preparePage(page, buildHorizontalHtml(width));
    const png = await screenshotElement(page, "#logo");
    writeFileSync(logoFile(publicDir, name), png);
    console.log(
      `Generated public/logo/${name} (${width}x${Math.round(width / LOGO_ASPECT)})`,
    );
  }

  for (const { name, size } of squareSizes) {
    await preparePage(page, buildSquareHtml(size));
    const png = await screenshotElement(page, "#square");
    writeFileSync(logoFile(publicDir, name), png);
    console.log(`Generated public/logo/${name} (${size}x${size})`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
