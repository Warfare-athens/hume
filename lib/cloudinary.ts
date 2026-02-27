type CloudinaryTransformOptions = {
  width?: number;
};

const BASE_TRANSFORMS = "f_auto,q_auto,dpr_auto";

export function withCloudinaryTransforms(
  url: string,
  { width }: CloudinaryTransformOptions = {}
): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }

  const transforms = width ? `${BASE_TRANSFORMS},w_${width}` : BASE_TRANSFORMS;
  const marker = "/image/upload/";

  if (url.includes(`${marker}${transforms}/`)) {
    return url;
  }

  const [prefix, suffix] = url.split(marker);
  if (!prefix || !suffix) return url;

  // If URL already has transform segment, we prepend our baseline transforms
  // so delivery optimization is always enforced.
  return `${prefix}${marker}${transforms}/${suffix}`;
}

