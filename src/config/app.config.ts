export const appConfig = {
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
  assetTagPrefixes: {
    desktop: "DSK",
    laptop: "LPT",
    server: "SRV",
    printer: "PRN",
    peripheral: "PRF",
  } as Record<string, string>,
  ticketPrefix: "TKT",
  auth: {
    saltRounds: 12,
    cookieName: "ims-token",
    refreshCookieName: "ims-refresh",
  },
} as const;
