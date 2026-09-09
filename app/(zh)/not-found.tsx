import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
      <h1 style={{ fontSize: 40, fontWeight: 300 }}>404</h1>
      <p style={{ color: "var(--sub)" }}>未找到页面 · Page not found</p>
      <Link href="/" style={{ color: "var(--red)", fontWeight: 700 }}>← 返回首页</Link>
      <Link href="/en/" style={{ color: "var(--red)" }}>English home</Link>
    </div>
  );
}
