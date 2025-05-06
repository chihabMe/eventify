import dayjs from "dayjs";

let secret = process.env.SECRET_KEY 
if(!secret)
  throw new Error("Secret key is required") 

export const jwtConstants = {
  secret ,
  accessTokenLifetime: {
    asNumber: 0.5 * 60 * 1000 , 
    asString: '30s',
    get asDate() {
      return dayjs().add(30, 'seconds').toDate();
    },
  },
  refreshTokenLifetime: {
    asNumber: 7 * 24 * 60 * 60 * 1000,
    asString: '7d',
    get asDate() {
      return dayjs().add(30, 'days').toDate();
    },
  },
};

export const PAGE_SIZE = 10;
