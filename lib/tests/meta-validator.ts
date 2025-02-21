import type {
  Metadata,
  TwitterImage,
  TwitterMetadata,
} from "../types/metadata";
import { metadata } from "../../app/layout";

interface TwitterValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateTwitterMeta(meta: Metadata): TwitterValidationResult {
  if (!meta.twitter) {
    return {
      isValid: false,
      errors: ["Twitter metadata is missing"],
    };
  }

  const errors: string[] = [];
  const twitter = meta.twitter as TwitterMetadata;
  const twitter_images = twitter.images as TwitterImage[];

  // Validate required fields
  if (!twitter.card) errors.push("Twitter card type is required");
  if (!twitter.title) errors.push("Twitter title is required");
  if (!twitter.description) errors.push("Twitter description is required");
  if (!twitter_images || !twitter_images.length)
    errors.push("Twitter image is required");

  // Validate content if exists
  if (
    twitter.title &&
    typeof twitter.title === "string" &&
    twitter.title.length > 70
  ) {
    errors.push("Twitter title should be <= 70 characters");
  }

  if (
    twitter.description &&
    typeof twitter.description === "string" &&
    twitter.description.length > 200
  ) {
    errors.push("Twitter description should be <= 200 characters");
  }

  // Validate images if they exist
  if (twitter.images && Array.isArray(twitter.images)) {
    const firstImage = twitter.images[0] as TwitterImage;
    if (firstImage) {
      if (!firstImage.url?.startsWith("http")) {
        errors.push("Image URL must be absolute");
      }
      if (firstImage.width < 300) {
        errors.push("Image width must be at least 300px");
      }
      if (firstImage.height < 157) {
        errors.push("Image height must be at least 157px");
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Run the validation
const result = validateTwitterMeta(metadata as Metadata);
if (!result.isValid) {
  console.error("❌ Twitter meta validation failed:");
  result.errors.forEach((error) => console.error(`  - ${error}`));
} else {
  console.log("✅ Twitter meta validation passed!");
}
