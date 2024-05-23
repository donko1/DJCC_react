import { useEffect, useState } from "react";

export const useCookie = (cookieName, defaultValue) => {
  const [value, setValue] = useState(() => {
    const cookieValue =
      document.cookie.match("(^|;)s*${cookieName}s*=s*([^;]+)s*")?.pop() || "";
    return cookieValue ? JSON.parse(cookieValue) : defaultValue;
  });

  useEffect(() => {
    if (!document.cookie.includes(cookieName)) {
      document.cookie = `${cookieName}=${JSON.stringify(value)}; path=/`;
    }
  }, [cookieName, value]);

  return [value, setValue];
};
