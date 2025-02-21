import { NextResponse } from "next/server";
import type {
  TwitterImage,
  TwitterMetadata,
} from "../../../lib/types/metadata";
import { metadata } from "../../../app/layout";

export async function GET() {
  if (!metadata.twitter) {
    return new NextResponse("Twitter metadata not found", { status: 404 });
  }

  const twitter = metadata.twitter as TwitterMetadata;
  const imageUrl = Array.isArray(twitter.images)
    ? (twitter.images[0] as TwitterImage).url
    : (twitter.images as TwitterImage).url;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="twitter:card" content="${twitter.card || ""}" />
        <meta name="twitter:title" content="${
          typeof twitter.title === "string" ? twitter.title : ""
        }" />
        <meta name="twitter:description" content="${
          typeof twitter.description === "string" ? twitter.description : ""
        }" />
        ${
          twitter.creator
            ? `<meta name="twitter:creator" content="${twitter.creator}" />`
            : ""
        }
        ${imageUrl ? `<meta name="twitter:image" content="${imageUrl}" />` : ""}
      </head>
      <body>
        <h1>Twitter Card Preview</h1>
        <p>Use Twitter's Card Validator to test this page: <a href="https://cards-dev.twitter.com/validator" target="_blank">Card Validator</a></p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
