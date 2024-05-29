import axios from "axios";

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function setAxiosCookieHeader(cookie) {
    axios.defaults.headers.post["X-CSRF-TOKEN"] = cookie;
    axios.defaults.withCredentials = true;
}

export function setJWT() {
    let cookie = getCookie("csrf_access_token");
    setAxiosCookieHeader(cookie);
}