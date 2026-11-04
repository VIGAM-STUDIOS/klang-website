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

  // Dodo Payments checkout link for KLANG Pro. This is the TEST-mode link: swap in the live
  // one (checkout.dodopayments.com, no "test.") at launch, same time as DODO_TEST_MODE in
  // the app's core/licensing.py.
  checkoutUrl:
    "https://test.checkout.dodopayments.com/buy/pdt_0NrD5CH5uU8kdjMFGuxHI?quantity=1&redirect_url=https://klang-website-expq.vercel.app%2F",

  // Where the early-access form posts. Any service that accepts a form POST with an
  // "email" field works (Formspree, Buttondown, your own endpoint).
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
