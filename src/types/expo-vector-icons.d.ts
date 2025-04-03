declare module '@expo/vector-icons' {
  import { ComponentClass } from 'react';
  import { TextStyle } from 'react-native';

  interface IconProps {
    size?: number;
    name: string;
    color?: string;
    style?: TextStyle;
  }

  export class Ionicons extends ComponentClass<IconProps> {
    static glyphMap: { [key: string]: string };
  }
} 