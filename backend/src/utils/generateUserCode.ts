// backend/src/utils/generateUserCode.ts

export const generateUserCode = (): string => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SC${random}`;
};