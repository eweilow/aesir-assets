import sharp from "sharp";
import React from "react";
import { existsSync } from "fs";
import { copyFile, mkdir, readFile, rm, rmdir, writeFile } from "fs/promises";
import { basename, dirname, extname, join } from "path";
import satori from "satori";
import prettier from "prettier";

const assetsDir = join(__dirname, "../assets");
const outputDir = join(__dirname, "../public/generated");
const tmpDir = join(assetsDir, ".tmp");

import svgo from "svgo";

import {
  Colors,
  ManifestType,
  getFullName,
  hexFromColor,
  nameFromColor,
} from "@/generate/types";

class Asset {
  static async load(name: string) {
    console.info(`Loading asset: ${name}`);

    if (extname(name) !== ".svg") {
      throw new Error(`File must be an SVG: ${name}`);
    }

    const text = await readFile(name, "utf-8");
    return new Asset(name, basename(name, extname(name)), text);
  }

  constructor(
    public readonly filename: string,
    public readonly name: string,
    public readonly text: string
  ) {}

  static getTmpName(name: string, color: string, ext = ".svg") {
    const variant = btoa(color);
    return `${name}_${variant}.svg`;
  }

  static getOutputName(
    name: string,
    foreground: Colors,
    background: Colors,
    transparent: boolean,
    width?: number,
    ext = ".png"
  ) {
    const fullName = getFullName(
      { name, foreground, background },
      transparent,
      width
    );
    return `${name}/${fullName}${ext}`;
  }

  /**
   * Generate an SVG file with the given color and return the path to the file.
   */
  async generateSvg(color: Colors) {
    let convertedText = this.text;

    let hex = hexFromColor(color);
    if (hex != null) {
      convertedText = convertedText.replace(/"#ff0000"/gi, `"${hex}"`);
    }

    let colorName = nameFromColor(color);

    const outputName = join(tmpDir, Asset.getTmpName(this.name, colorName));
    const optimized = svgo.optimize(convertedText, {
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
      ],
      floatPrecision: 4,
    });
    const optimizedText = optimized.data;
    const prettierText = await prettier.format(optimizedText, {
      filepath: "file.html", // Format using HTML
    });

    await writeFile(outputName, prettierText);
    return outputName;
  }

  /**
   * Generate PNGs for the given asset with the given colors and widths.
   */
  async generate(
    name: string,
    foreground: Colors,
    background: Colors,
    widths: number[],
    options?: {
      padding?: number;
    }
  ) {
    let foregroundName = nameFromColor(foreground);
    let backgroundName = nameFromColor(background);

    console.info(
      `Generating PNG: ${this.filename} -> ${foregroundName} on ${backgroundName}`
    );

    const svgName = await this.generateSvg(foreground);
    const svgSharp = sharp(svgName);
    const { width, height } = await svgSharp.metadata();
    if (width == null || height == null) {
      throw new Error(`Failed to get dimensions for ${svgName}`);
    }
    const aspectRatio = height / width;

    const svgText = await readFile(svgName, "base64");
    const svgUri = `data:image/svg+xml;base64,${svgText}`;
    const svgOutputName = join(
      outputDir,
      Asset.getOutputName(name, foreground, background, true, undefined, ".svg")
    );
    await mkdir(dirname(svgOutputName), { recursive: true });
    await copyFile(svgName, svgOutputName);

    const manifest: ManifestType = {
      name,
      svg: basename(svgOutputName),
      foreground: foreground,
      background: background,
      aspectRatio,
      widths: [],
    };

    for (const transparent of [false, true]) {
      for (const width of widths) {
        const padding = width * (options?.padding ?? 0);
        const widthInsidePadding = Math.round(width - padding * 2);
        const heightInsidePadding = Math.round(
          widthInsidePadding * aspectRatio
        );
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

        const outputName = join(
          outputDir,
          Asset.getOutputName(name, foreground, background, transparent, width)
        );

        let chain = sharp(Buffer.from(rendered));
        if (transparent === false) {
          let backgroundHex = hexFromColor(background);
          if (backgroundHex != null) {
            chain = chain.flatten({ background: backgroundHex });
          }
        }
        chain = chain.resize({ width });
        chain = chain.sharpen();
        chain = chain.png({
          compressionLevel: 9,
          effort: 10,
        });

        await mkdir(dirname(outputName), { recursive: true });
        const output = await chain.toFile(outputName);
        console.info(`Generated PNG: ${outputName} (${output.size} bytes)`);

        manifest.widths.push({
          name: basename(outputName),
          width,
          height,
          transparent,
        });
      }
    }

    const manifestName = join(
      outputDir,
      Asset.getOutputName(
        name,
        foreground,
        background,
        false,
        undefined,
        ".json"
      )
    );
    await mkdir(dirname(manifestName), { recursive: true });
    await writeFile(manifestName, JSON.stringify(manifest, null, 2));
  }
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

  await square.generate(
    squareName,
    Colors.ÆSIR,
    Colors.White,
    [32, 64, 128, 256, 512],
    { padding: 0.15 }
  );

  await square.generate(
    squareName,
    Colors.White,
    Colors.ÆSIR,
    [32, 64, 128, 256, 512],
    { padding: 0.15 }
  );

  await logo.generate(
    logoName,
    Colors.ÆSIR,
    Colors.White,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
    logoName,
    Colors.White,
    Colors.ÆSIR,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
    logoName,
    Colors.Gray,
    Colors.White,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
    logoName,
    Colors.Black,
    Colors.White,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
