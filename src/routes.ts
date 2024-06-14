/**
 * Public routes are routes that are accessible to everyone, including unauthenticated users.
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/"];

/**
 * Private routes are routes that are only accessible to authenticated users.
 * @type {string[]}
 */
export const privateRoutes: string[] = [
    "/users",
    "/users/[id]",
    "/users/[id]/settings",
    "/users/[id]/settings/info",
    "/users/[id]/wishlist",
    "/users/[id]/bookings",
    "/users/[id]/profile",
    "/restaurants/[restaurantId]/booking",
];

/**
 * Activated user routes are routes that are only accessible to activated users.
 * @type {string[]}
 */
export const activetedUserRoutes = [
    "/restaurants/[restaurantId]/booking",
];

/**
 * Admin routes are routes that are only accessible to admin users.
 * @type {string[]}
 */
export const adminRoutes: string[] = [
    "/admin/dashboard",
    "/admin/dashboard/restaurants",
    "/admin/dashboard/restaurants/[restaurantId]",
    "/admin/dashboard/restaurants/[restaurantId]/edit",
    "/admin/dashboard/users",
    "/admin/dashboard/users/[id]",

];

export const confirmReservationRoute: string[] = [
    "/confirm/[reservationId]",
];

/**
 * Auth routes are routes that are only accessible to unauthenticated users.
 * @type {string[]}
 */
export const authRoutes: string[] = ["/sign-in", "/sign-up"];
