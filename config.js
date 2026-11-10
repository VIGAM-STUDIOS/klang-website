/*
 * KLANG website settings: the only file you need to edit to launch.
 */
window.KLANG_CONFIG = {
  // Direct installer download links:
  downloadUrlWindows:
    "https://github.com/VIGAM-STUDIOS/klang-website/releases/latest/download/KLANG-Windows-x64-setup.exe",
  downloadUrlMac:
    "https://github.com/VIGAM-STUDIOS/klang-website/releases/latest/download/KLANG-macOS-arm64.dmg",

  // Default download URL fallback (Windows):
  downloadUrl:
    "https://github.com/VIGAM-STUDIOS/klang-website/releases/latest/download/KLANG-Windows-x64-setup.exe",

  // Dodo Payments live checkout link for KLANG Pro:
  checkoutUrl:
    "https://checkout.dodopayments.com/buy/pdt_0NrZo1BgJYwzKRTZQcgQb?quantity=1&redirect_url=https%3A%2F%2Fklang.vigamai.com%2Fdownload.html",

  // Pricing shown on the page (whole numbers, in priceCurrency).
  priceCurrency: "$",
  proPrice: 30,
  earlyBirdPrice: 24, // $24 launch offer until December 10, then $30
  earlyBirdEndDate: "December 10, 2026",
  freeSampleLimit: 2500,

  // Shown in the footer and FAQ if set.
  contactEmail: "klang.help@outlook.com",

  // Current release, shown under the download buttons.
  version: "1.0",
};
