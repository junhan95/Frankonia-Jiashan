import { Noto_Sans_SC } from "next/font/google";

// Download at build time; serve Chinese glyphs from our own host at runtime.
export const notoSansSC = Noto_Sans_SC({
  display: "swap",
  variable: "--font-noto-sc",
  preload: false,
});
