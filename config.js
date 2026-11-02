/*
 * KLANG website settings: the only file you need to edit to launch.
 *
 * Leave a link empty ("") and the page falls back gracefully:
 *   downloadUrl empty  -> "Download" buttons become an early-access email signup
 *   checkoutUrl empty  -> the Pro plan shows "Coming soon" and joins the same signup
 */
window.KLANG_CONFIG = {
  // Windows installer, e.g. a GitHub Releases asset:
  // "https://github.com/VIGAM-STUDIOS/KLANG/releases/latest/download/KLANG-setup.msi"
  downloadUrl: "",

  // Lemon Squeezy / Paddle / Gumroad / Dodo Payments checkout link for KLANG Pro.
  checkoutUrl: "",

  // Where the early-access form posts. Any service that accepts a form POST with an
  // "email" field works (Formspree, Buttondown, Lemon Squeezy email, your own endpoint).
  waitlistFormAction: "",

  // Pricing shown on the page (whole numbers, in priceCurrency).
  priceCurrency: "$",
  proPrice: 39,
  earlyBirdPrice: 24, // set to null to hide the early-bird offer
  freeSampleLimit: 2500,

  // Shown in the footer and FAQ if set.
  contactEmail: "klang.help@outlook.com",

  // Current release, shown under the download button once downloadUrl is set.
  version: "1.0 beta",
};
