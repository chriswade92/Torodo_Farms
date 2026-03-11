// Local network testing — PC IP address on WiFi
// To switch back to emulator, change to: '10.0.2.2'
// To deploy to production, change to your server domain
const HOST = '10.30.3.122';

export const API_BASE_URL = `http://${HOST}:5000/api`;
export const UPLOADS_BASE_URL = `http://${HOST}:5000`;
