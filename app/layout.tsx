import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Marry1Q",
  description: "예비 신혼부부를 위한 결혼 준비 플랫폼",
  generator: "v0.dev",
  icons: {
    icon: "/Users/bongwook/projects/marry1q-prod/marry1q-fe/public/favicon-32x32.png",
    apple: "/Users/bongwook/projects/marry1q-prod/marry1q-fe/public/apple-icon-180x180.png",
  },
  openGraph: {
    title: "Marry1Q - 예비 신혼부부를 위한 결혼 준비 플랫폼",
    description: "복잡한 결혼, 한 큐에 Marry1Q에서!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Bona+Nova+SC:ital,wght@0,400;0,700;1,400;1,700&family=Gowun+Dodum:wght@400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Gowun+Dodum:wght@400&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Dodum:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily:
            '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", sans-serif',
        }}
      >
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
