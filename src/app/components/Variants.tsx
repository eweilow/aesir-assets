import {
  ManifestType,
  VariantType,
  getFullName,
  hexFromColor,
} from "@/generate/types";
import assert from "assert";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import Image from "next/image";
import Link from "next/link";
import { join } from "path";

function getPath(
  variant: VariantType,
  transparent: boolean,
  width?: number,
  ext = ".svg"
) {
  const fullName = getFullName(variant, transparent, width);
  const publicPath = join("/generated", variant.name, fullName + ext);
  const filename = join("@/../public/", publicPath);
  assert(existsSync(filename), `File not found: ${filename}`);

  return {
    publicPath,
    filename,
  };
}

function getPublicPath(
  variant: VariantType,
  transparent: boolean,
  width?: number,
  ext = ".svg"
) {
  const { publicPath } = getPath(variant, transparent, width, ext);
  return publicPath;
}

function getFilename(variant: VariantType, transparent: boolean, ext = ".svg") {
  const { filename } = getPath(variant, transparent, undefined, ext);
  return filename;
}

async function lookup(variant: VariantType) {
  const manifestFile = getFilename(variant, false, ".json");
  const manifest = JSON.parse(
    await readFile(manifestFile, "utf-8")
  ) as ManifestType;

  const svgSrc = getPublicPath(variant, true, undefined, ".svg");

  return { manifest, svgSrc };
}

function VariantLink({
  variant,
  width,
  transparent = false,
}: {
  variant: VariantType;
  width?: number;
  transparent?: boolean;
}) {
  if (width == null) {
    return (
      <Link
        className="underline text-sm"
        download
        href={getPublicPath(variant, true, undefined, ".svg")}
      >
        SVG
      </Link>
    );
  }

  return (
    <Link
      className="underline text-sm"
      download
      href={getPublicPath(variant, transparent, width, ".png")}
    >
      {width}px
    </Link>
  );
}

export type VariantProps = VariantType & {
  height?: number;
};

export async function Variant({
  name,
  foreground,
  background,
  height = 120,
}: VariantProps) {
  const variant = { name, foreground, background };
  const data = await lookup(variant);

  const width = height / data.manifest.aspectRatio;

  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: hexFromColor(data.manifest.background),
        color: hexFromColor(data.manifest.foreground),
      }}
    >
      <div className="p-8 flex items-center justify-center">
        <Image alt={name} width={width} height={height} src={data.svgSrc} />
      </div>

      <header>With background</header>
      <ul className="flex flex-row gap-2">
        {data.manifest.widths
          .filter((s) => s.transparent === false)
          .map((s) => {
            return (
              <li key={s.name}>
                <VariantLink variant={variant} width={s.width} />
              </li>
            );
          })}
      </ul>

      <header>Transparent</header>
      <ul className="flex flex-row gap-2">
        {data.manifest.widths
          .filter((s) => s.transparent === true)
          .map((s) => {
            return (
              <li key={s.name}>
                <VariantLink variant={variant} transparent width={s.width} />
              </li>
            );
          })}

        <li>
          <VariantLink variant={variant} />
        </li>
      </ul>
    </div>
  );
}
