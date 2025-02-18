export function formatFileSize(kilobytes: number): string {
  const units = ["KB", "MB", "GB", "TB"];
  let size = kilobytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  if (unitIndex === 0) {
    return `${Math.round(size)} ${units[unitIndex]}`;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
