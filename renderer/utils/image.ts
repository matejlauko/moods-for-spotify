export function getMinImage(
  images?: SpotifyApi.ImageObject[],
  minHeight: number = 32
): SpotifyApi.ImageObject | null {
  // sort from smallest height
  const sortedImages = [...(images || [])].sort(
    (a, b) => (a.height || 0) - (b.height || 0)
  );
  const imageFit = sortedImages.find(
    (image) => (image.height || 0) >= minHeight
  );

  return imageFit || sortedImages[0] || null;
}
