/**
 * @module utils/cloudinaryDelete
 * @description Best-effort Cloudinary asset removal from secure URLs.
 */

import cloudinary from "./cloudinary.js";

/**
 * @param {string} secureUrl
 */
export const deleteCloudinaryFile = async (secureUrl) => {
  if (!secureUrl || !process.env.CLOUDINARY_CLOUD_NAME) return;

  try {
    const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    if (!match?.[1]) return;
    await cloudinary.uploader.destroy(match[1], { resource_type: "raw" });
  } catch {
    // Best-effort cleanup during account deletion
  }
};
