import { ImageResponse } from "next/og";

export const alt = "Association of Engineering Students in Rocketry";
export const size = {
  width: 500,
  height: 300,
};
export const contentType = "image/png";

import IconSvg from "@/../public/generated/aesir_logo/aesir_logo__white.svg";

export default function AppIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          overflow: "hidden",
          padding: "15%",
          backgroundColor: "#37109F",
        }}
      >
        <IconSvg width={undefined} height={undefined} />
      </div>
    ),
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
