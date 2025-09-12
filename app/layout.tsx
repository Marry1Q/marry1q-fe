import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Marry1Q",
  description: "결혼 준비 커플을 위한 스마트 예산 관리 앱",
  generator: "v0.dev",
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-icon-180x180.png",
  },
  openGraph: {
    title: "Marry1Q - 결혼 준비를 위한 스마트한 시작",
    description: "결혼 준비를 위한 스마트 예산 관리 앱",
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
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          async
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
