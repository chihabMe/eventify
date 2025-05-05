export const jwtConstants = {
  secret: process.env.SECRET_KEY ?? 'no-secret',
  accessTokenLifetime: {
    asNumber: 5 * 60 * 1000,
    asString: '5m',
  },
  refreshTokenLifetime: {
    asNumber: 7 * 24 * 60 * 60 * 1000,
    asString: '7d',
  },
};

export const PAGE_SIZE = 10;
