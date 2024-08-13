import { API_BASE_URL } from '@/config/env';

export class APIURL extends URL {
  constructor(url: string | URL, base?: string | URL) {
    if (typeof url === 'string') {
      if (url.startsWith('/')) {
        url = API_BASE_URL + url;
      }
    } else if (url.href.startsWith('/')) {
      url = new URL(API_BASE_URL + url.href);
    }
    super(url, base);
  }
}
