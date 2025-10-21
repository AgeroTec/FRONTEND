export class HttpClient {
  private baseHeaders: HeadersInit;

  constructor() {
    this.baseHeaders = {
      'accept': 'application/json',
      'X-Tenant-Id': '11111111-1111-1111-1111-111111111111',
      'Accept-Language': 'pt-BR',
      'X-Correlation-Id': this.generateSimpleId(),
    };
  }

  private generateSimpleId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async get<T>(url: string): Promise<T> {
    console.log(`🔗 Fazendo requisição GET para: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.baseHeaders,
      mode: 'cors',
    });

    console.log(`📡 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
}