export const COOKIES = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
};
export const TOAST_TYPE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  WRANING: "WRANING",
  INFO: "INFO",
};

export const PUBLIC_ROUTES = {
  LOGIN: "/login",
  MANAGER_INVITE: "/manager/invite",
};

export const PRIVATE_ROUTES = {
  DASHBOARD: "/dashboard",
  OVERVIEW: "/overview",
};

export const superAdminAllowedPaths = [
  "/dashboard",
  "/organizations",
  "/calendar",
  "/venues",
  "/reservations",
  "/users",
  "/sports",
  "/vending-machines",
  "/purchases",
  "/inventory",
  "/venue-settings",
  // "/courts",
  "/rentals",
  "/profile",
  "/manager",
  "/calls",
  "/whatsapp",
];
export const ownerAllowedPaths = [
  "/dashboard",
  "/calendar",
  // "/venues",
  "/venue-settings",
  "/purchases",
  // "/courts",
  "/reservations",
  "/users",
  "/sports",
  "/vending-machines",
  "/inventory",
  "/organizations",
  "/calls",
  "/whatsapp",
];
export const locationManagerAllowedPaths = [
  "/dashboard",
  "/calendar",
  "/reservations",
  "/venue-settings",
  // "/courts",
  "/organizations",
  "/vending-machines",
  "/inventory",
  "/calls",
  "/whatsapp",
];  