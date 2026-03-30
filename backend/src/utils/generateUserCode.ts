// backend/src/utils/generateUserCode.ts

export const generateUserCode = (): string => {
return `SC${Date.now().toString().slice(-4)}${Math.floor(Math.random()*100)}`
};