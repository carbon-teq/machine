import { Graphics, Container, Text } from 'pixi.js';
import type { PixiReactElementProps } from '@pixi/react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      graphics: any;
      container: any;
      text: any;
    }
  }
}
