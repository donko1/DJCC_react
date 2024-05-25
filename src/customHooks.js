import { useState } from "react";

export const useCookie = (cookieName, defaultValue) => {
  const [value, setValue] = useState(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`));
    return cookie ? cookie.split("=")[1] : defaultValue;
  });

  const setCookieValue = (newValue) => {
    document.cookie = `${cookieName}=${newValue}; path=/`;
    setValue(newValue);
  };

  return [value, setCookieValue];
};
