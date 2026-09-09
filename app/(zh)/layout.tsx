import RootShell from "../root-shell";
import { openSans } from "../fonts";
import { notoSansSC } from "../fonts-zh";

export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell lang="zh" fontClass={`${openSans.variable} ${notoSansSC.variable}`}>
      {children}
    </RootShell>
  );
}
