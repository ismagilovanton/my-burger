export type TCookieProps = {
  expires?: number;
  path?: string;
};

export const setCookie = (
  name: string,
  value: string,
  props: TCookieProps = {}
): void => {
  const options: TCookieProps = {
    path: '/',
    ...props,
  };

  let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    const date = new Date();
    date.setTime(date.getTime() + options.expires * 1000);
    updatedCookie += `; expires=${date.toUTCString()}`;
  }

  if (options.path) {
    updatedCookie += `; path=${options.path}`;
  }

  document.cookie = updatedCookie;
};

export const getCookie = (name: string): string | undefined => {
  const regexp = new RegExp(
    `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`
  );
  const matches = regexp.exec(document.cookie);
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const deleteCookie = (name: string): void => {
  setCookie(name, '', { expires: -1 });
};
