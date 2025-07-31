/**
 * Track a page view in Google Analytics
 * This sends a manual page_view event without disabling the automatic tracking
 *
 * @param {string} page_path - The path of the page (e.g., '/home')
 * @param {string} page_title - The title of the page (e.g., 'Home Page')
 * @param {object} additional_params - Any additional parameters to send
 */

export const trackPageView = ({
  page_title,
  additional_params = {},
}: {
  page_title?: string;
  additional_params?: Record<string, string | number | boolean>;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_title: page_title ?? document.title,
      page_location:
        window.location.origin + location.pathname + location.search,
      page_path: location.pathname + location.search,
      ...{ ...additional_params },
    });
  } else {
    console.warn("Google Analytics is not initialized.");
  }
};
