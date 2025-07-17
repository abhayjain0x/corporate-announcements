import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("http://www.rsrch.space"),
  title: "announcements watch",
  description: "Corporate announcements tracking and monitoring.",
  openGraph: {
    type: "website",
    url: "https://www.rsrch.space",
    site_name: "announcements watch",
    images: [
      {
        url: "https://www.rsrch.space/thumbnail.png",
        alt: "announcements watch homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ishan0102",
    title: "announcements watch",
    description: "Corporate announcements tracking and monitoring",
    image: "https://www.rsrch.space/thumbnail.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@ishan0102" />
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
