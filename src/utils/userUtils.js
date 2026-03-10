import CryptoJS from "crypto-js";

export const getGravatarUrl = (email) => {
    if (!email)
        return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOJzBi3nAybLJlKJJzRk1HswM9DtSt2LwauA&s";
    const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
    return `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOJzBi3nAybLJlKJJzRk1HswM9DtSt2LwauA&s`;
};
