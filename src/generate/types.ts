export enum Colors {
  ÆSIR,
  White,
  Black,
  Gray,
}

export function hexFromColor(color: Colors) {
  switch (color) {
    case Colors.ÆSIR:
      return "#37109F";
    case Colors.White:
      return "#FFFFFF";
    case Colors.Black:
      return "#000000";
    case Colors.Gray:
      return "#383838";
  }
}

export function nameFromColor(color: Colors) {
  switch (color) {
    case Colors.ÆSIR:
      return "aesir";
    case Colors.White:
      return "white";
    case Colors.Black:
      return "black";
    case Colors.Gray:
      return "gray";
  }
}

export type ManifestType = {
  name: string;
  svg: string;
  foreground: Colors;
  background: Colors;
  aspectRatio: number;
  widths: Array<{
    name: string;
    width: number;
    height: number;
    transparent: boolean;
  }>;
};

export type VariantType = {
  name: string;
  foreground: Colors;
  background: Colors;
};

export function getFullName(
  variant: VariantType,
  transparent: boolean,
  width?: number
) {
  const foreground = nameFromColor(variant.foreground);
  const background = nameFromColor(variant.background);
  let name = `${variant.name}__${foreground}`;
  if (transparent === false) {
    name += `_on_${background}`;
  }

  if (width != null) {
    name += `_${width}w`;
  }

  return name;
}
