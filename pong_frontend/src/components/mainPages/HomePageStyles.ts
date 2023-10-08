import { Properties } from 'csstype';

export const pageStyle: Properties = {
  backgroundColor: '#0071BB',
  overflowX: 'hidden',
  height: '100vh',
  margin: '0',
  padding: '0',
  color: '#87CEEB',
};

export const fogWrapperStyle: Properties = {
  height: '100%',
  position: 'absolute',
  top: '0',
  width: '100%',
  WebkitFilter: 'blur(1px) grayscale(0.2) saturate(1.2) sepia(0.2)',
  filter: 'blur(1px) grayscale(0.2) saturate(1.2) sepia(0.2)',
};

export const fogLayerStyle: Properties = {
  height: '100%',
  position: 'absolute',
  width: '200%',
};

export const fogImageStyle: Properties = {
  float: 'left',
  height: '100%',
  width: '50%',
};

export const fogLayer01Style: Properties = {
  ...fogLayerStyle,
  WebkitAnimation: 'foglayer_01_opacity 10s linear infinite, foglayer_moveme 15s linear infinite',
  MozAnimation: 'foglayer_01_opacity 10s linear infinite, foglayer_moveme 15s linear infinite',
  animation: 'foglayer_01_opacity 10s linear infinite, foglayer_moveme 15s linear infinite',
};

export const fogLayer02Style: Properties = {
  ...fogLayerStyle,
  WebkitAnimation: 'foglayer_02_opacity 21s linear infinite, foglayer_moveme 13s linear infinite',
  MozAnimation: 'foglayer_02_opacity 21s linear infinite, foglayer_moveme 13s linear infinite',
  animation: 'foglayer_02_opacity 21s linear infinite, foglayer_moveme 13s linear infinite',
};

export const fogLayer03Style: Properties = {
  ...fogLayerStyle,
  WebkitAnimation: 'foglayer_03_opacity 27s linear infinite, foglayer_moveme 13s linear infinite',
  MozAnimation: 'foglayer_03_opacity 27s linear infinite, foglayer_moveme 13s linear infinite',
  animation: 'foglayer_03_opacity 27s linear infinite, foglayer_moveme 13s linear infinite',
};

export const fogImage01Style: Properties = {
  ...fogImageStyle,
  background: 'url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog1.png") center center/cover no-repeat transparent',
};

export const fogImage02Style: Properties = {
  ...fogImageStyle,
  background: 'url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png") center center/cover no-repeat transparent',
};

export type Keyframes = {
  [key: string]: Properties;
};

export const fogOpacityKeyframes: Keyframes = {
  '0%': { opacity: '0.1' },
  '22%': { opacity: '0.5' },
  '40%': { opacity: '0.28' },
  '58%': { opacity: '0.4' },
  '80%': { opacity: '0.16' },
  '100%': { opacity: '0.1' },
};

export const fogOpacityKeyframesStyle = {
  animation: 'fogOpacityKeyframes 27s linear infinite',
  WebkitAnimation: 'fogOpacityKeyframes 27s linear infinite',
  MozAnimation: 'fogOpacityKeyframes 27s linear infinite',
};

export const fogMoveMeKeyframes: Keyframes = {
  '0%': { left: '0' },
  '100%': { left: '-100%' },
};

export const fogMoveMeKeyframesStyle = {
  animation: 'fogMoveMeKeyframes 15s linear infinite',
  WebkitAnimation: 'fogMoveMeKeyframes 15s linear infinite',
  MozAnimation: 'fogMoveMeKeyframes 15s linear infinite',
};
