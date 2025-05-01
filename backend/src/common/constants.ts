export const jwtConstants = {
  secret: process.env.SECRET ?? 'no-secret',
  accessTokenLifetime: {
    asNumber: 5 * 60,
    asString: '5m',
  },
  refreshTokenLifetime: {
    asNumber: 7 * 24 * 60 * 60,
    asString: '7d',
  },
};
