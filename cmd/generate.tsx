import sharp from "sharp";
import React from "react";
import { existsSync } from "fs";
import { copyFile, mkdir, readFile, rm, rmdir, writeFile } from "fs/promises";
import { basename, extname, join } from "path";
import satori from "satori";
import prettier from "prettier";

const assetsDir = join(__dirname, "../assets");
const outputDir = join(__dirname, "../public/generated");
const tmpDir = join(assetsDir, ".tmp");

import svgo from "svgo";

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

  static getOutputName(name: string, width?: number, ext = ".png") {
    if (width == null) {
      return `${name}${ext}`;
    }

    return `${name}_${width}w${ext}`;
  }

  /**
   * Generate an SVG file with the given color and return the path to the file.
   */
  async generateSvg(color: string) {
    const convertedText = this.text.replace(/"#ff0000"/gi, `"${color}"`);
    const outputName = join(tmpDir, Asset.getTmpName(this.name, color));

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
    });
    const optimizedText = optimized.data;
    const prettierText = await prettier.format(convertedText, {
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
    foreground: string,
    background: string,
    widths: number[],
    options?: {
      padding?: number;
    }
  ) {
    console.info(
      `Generating PNG: ${this.filename} -> ${foreground} on ${background}`
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
      Asset.getOutputName(name, undefined, ".svg")
    );
    await copyFile(svgName, svgOutputName);

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

      const outputName = join(outputDir, Asset.getOutputName(name, width));

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

  await square.generate(
    `${squareName}__color_on_white`,
    Colors.Color,
    Colors.White,
    [32, 64, 128, 256, 512],
    { padding: 0.15 }
  );

  await square.generate(
    `${squareName}__white_on_color`,
    Colors.White,
    Colors.Color,
    [32, 64, 128, 256, 512],
    { padding: 0.15 }
  );

  await logo.generate(
    `${logoName}__color_on_white`,
    Colors.Color,
    Colors.White,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
    `${logoName}__white_on_color`,
    Colors.White,
    Colors.Color,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
    `${logoName}__gray_on_white`,
    Colors.Gray,
    Colors.White,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
    `${logoName}__black_on_white`,
    Colors.Black,
    Colors.White,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
    `${logoName}__color_on_transparent`,
    Colors.Color,
    Colors.Transparent,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
    `${logoName}__white_on_transparent`,
    Colors.White,
    Colors.Transparent,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
    `${logoName}__gray_on_transparent`,
    Colors.Gray,
    Colors.Transparent,
    [125, 250, 500, 1000, 2000],
    { padding: 0.1 }
  );

  await logo.generate(
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
