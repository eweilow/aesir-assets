import sharp from "sharp";
import React from "react";
import { existsSync } from "fs";
import { mkdir, readFile, rm, rmdir, writeFile } from "fs/promises";
import { basename, extname, join } from "path";
import satori from "satori";

const assetsDir = join(__dirname, "../assets");
const outputDir = join(__dirname, "../public/generated");
const tmpDir = join(assetsDir, ".tmp");

class Asset {
  static async load(name: string) {
    console.info(`Loading asset: ${name}`);

    if (extname(name) !== ".svg") {
      throw new Error(`File must be an SVG: ${name}`);
    }

    const text = await readFile(name, "utf-8");
    return new Asset(name, text);
  }

  constructor(public readonly name: string, public readonly text: string) {}

  static getSvgName(assetName: string, color: string) {
    const name = basename(assetName, ".svg");
    const variant = btoa(color);

    return `${name}_${variant}.svg`;
  }

  static getPngName(name: string, width: number) {
    return `${name}_${width}w.png`;
  }

  /**
   * Generate an SVG file with the given color and return the path to the file.
   */
  async generateSvg(color: string) {
    const convertedText = this.text.replace(/"#ff0000"/gi, `"${color}"`);
    const outputName = join(tmpDir, Asset.getSvgName(this.name, color));

    await writeFile(outputName, convertedText);
    return outputName;
  }

  /**
   * Generate PNGs for the given asset with the given colors and widths.
   */
  async generatePng(
    name: string,
    foreground: string,
    background: string,
    widths: number[],
    options?: {
      padding?: number;
    }
  ) {
    console.info(
      `Generating PNG: ${this.name} -> ${foreground} on ${background}`
    );
    const svgName = await this.generateSvg(foreground);

    const { width, height } = await sharp(svgName).metadata();
    if (width == null || height == null) {
      throw new Error(`Failed to get dimensions for ${svgName}`);
    }
    const aspectRatio = height / width;

    const svgText = await readFile(svgName, "base64");
    const svgUri = `data:image/svg+xml;base64,${svgText}`;

    for (const width of widths) {
      const padding = width * (options?.padding ?? 0);
      const widthInsidePadding = Math.round(width - padding * 2);
      const heightInsidePadding = Math.round(widthInsidePadding * aspectRatio);
      const height = Math.round(heightInsidePadding + padding * 2);

      const rendered = await satori(
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <img
            src={svgUri}
            style={{
              width: widthInsidePadding,
              height: heightInsidePadding,
            }}
          />
        </div>,
        {
          width,
          height,
          fonts: [],
        }
      );

      const outputName = join(outputDir, Asset.getPngName(name, width));

      let chain = sharp(Buffer.from(rendered));
      if (background !== Colors.Transparent) {
        chain = chain.flatten({ background });
      }
      chain = chain.resize({ width });
      chain = chain.sharpen();
      chain = chain.png({
        compressionLevel: 9,
        effort: 10,
      });

      const output = await chain.toFile(outputName);
      console.info(`Generated PNG: ${outputName} (${output.size} bytes)`);
    }
  }
}

enum Colors {
  Color = "#37109F",
  White = "#FFFFFF",
  Black = "#000000",
  Gray = "#383838",
  Transparent = "transparent",
}

async function main() {
  if (existsSync(outputDir)) {
    await rm(outputDir, { recursive: true });
  }
  if (existsSync(tmpDir)) {
    await rm(tmpDir, { recursive: true });
  }
  await mkdir(outputDir, { recursive: true });
  await mkdir(tmpDir, { recursive: true });

  const logo = await Asset.load(join(assetsDir, "_logo.svg"));
  const square = await Asset.load(join(assetsDir, "_square.svg"));

  const logoName = "aesir_logo";
  const squareName = "aesir_avatar";

  await square.generatePng(
    `${squareName}__color_on_white`,
    Colors.Color,
    Colors.White,
    [32, 64, 128, 256, 512],
    { padding: 0.15 }
  );

  await square.generatePng(
    `${squareName}__white_on_color`,
    Colors.White,
    Colors.Color,
    [32, 64, 128, 256, 512],
    { padding: 0.15 }
  );

  await logo.generatePng(
    `${logoName}__color_on_white`,
    Colors.Color,
    Colors.White,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generatePng(
    `${logoName}__white_on_color`,
    Colors.White,
    Colors.Color,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generatePng(
    `${logoName}__gray_on_white`,
    Colors.Gray,
    Colors.White,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generatePng(
    `${logoName}__black_on_white`,
    Colors.Black,
    Colors.White,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generatePng(
    `${logoName}__color_on_transparent`,
    Colors.Color,
    Colors.Transparent,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generatePng(
    `${logoName}__white_on_transparent`,
    Colors.White,
    Colors.Transparent,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generatePng(
    `${logoName}__gray_on_transparent`,
    Colors.Gray,
    Colors.Transparent,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generatePng(
    `${logoName}__black_on_transparent`,
    Colors.Black,
    Colors.Transparent,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
