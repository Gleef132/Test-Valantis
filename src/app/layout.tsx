import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { AntdRegistry } from '@ant-design/nextjs-registry';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Test | Valantis",
  description: "test valantis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Theme appearance="dark">
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </Theme>
      </body>
    </html >
  );
}
