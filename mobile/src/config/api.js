import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2 to reach the host machine's localhost
// iOS simulator can use localhost directly
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `http://${HOST}:5000/api`;
export const UPLOADS_BASE_URL = `http://${HOST}:5000`;
