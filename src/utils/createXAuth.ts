import crypto from 'crypto-js';

const getTimestamp = ():string => {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = `0${date.getUTCMonth() + 1}`.slice(-2);
  const day = `0${date.getUTCDate()}`.slice(-2);
  return `${year}${month}${day}`;
};

export const createXAuth = ():string => {
  return crypto.MD5(`${process.env.NEXT_PUBLIC_PRODUCTS_API_SECRET_KEY}_${getTimestamp()}`).toString();
}