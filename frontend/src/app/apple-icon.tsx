import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const svg = await readFile(
    join(process.cwd(), "src/assets/logo/medicare-logo-icon-on-light.svg"),
    "base64",
  );
  return new ImageResponse(
    <img
      src={`data:image/svg+xml;base64,${svg}`}
      width={180}
      height={180}
      alt=""
    />,
    size,
  );
}
