import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

import IconSvg from "@/app/assets/aesir_square.svg";

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
        <IconSvg
          width={undefined}
          height={undefined}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    ),
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
