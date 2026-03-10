import CryptoJS from "crypto-js";

export const getGravatarUrl = (email) => {
    if (!email)
        return "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
    return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`;
};
