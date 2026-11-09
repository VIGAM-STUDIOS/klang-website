/*
 * KLANG website settings: the only file you need to edit to launch.
 *
 * When downloadUrl is empty, download buttons scroll to the #download section
 * until the GitHub release link is pasted here.
 */
window.KLANG_CONFIG = {
  // Windows installer (GitHub Releases asset link once uploaded):
  // e.g. "https://github.com/VIGAM-STUDIOS/KLANG/releases/latest/download/KLANG-setup.msi"
  downloadUrl: "",

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

  // Current release, shown under the download button.
  version: "1.0",
};
