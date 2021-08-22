import { createGlobalStyle } from 'styled-components';
import {
  darkSber,
  darkEva,
  darkJoy,
  lightSber,
  lightEva,
  lightJoy,
  text, // Цвет текста
  background, // Цвет подложки
  gradient, // Градиент
} from '@sberdevices/plasma-tokens';

const DocumentStyle = createGlobalStyle`
    html:root {
      color: ${text};
      background-color: ${background};
      background-image: ${gradient};
      min-height: 100vh;
    }
    @media screen and (max-width: 1080px) and (max-height: 1920px) {      
      html:root {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
`;

const ThemeStyleDarkSber = createGlobalStyle(darkSber);
const ThemeStyleDarkEva = createGlobalStyle(darkEva);
const ThemeStyleDarkJoy = createGlobalStyle(darkJoy);

const ThemeStyleLightSber = createGlobalStyle(lightSber);
const ThemeStyleLightEva = createGlobalStyle(lightEva);
const ThemeStyleLightJoy = createGlobalStyle(lightJoy);

export const GlobalStyle = ({ themeColorsDark, assistantCharacter }) => (
  <>
    <DocumentStyle className="main" />
    {(() => {
      switch (assistantCharacter) {
        case 'sber':
          return themeColorsDark ? (
            <ThemeStyleDarkSber />
          ) : (
            <ThemeStyleLightSber />
          );
        case 'eva':
          return themeColorsDark ? (
            <ThemeStyleDarkEva />
          ) : (
            <ThemeStyleLightEva />
          );
        case 'joy':
          return themeColorsDark ? (
            <ThemeStyleDarkJoy />
          ) : (
            <ThemeStyleLightJoy />
          );
        default:
          return;
      }
    })()}
  </>
);

export default GlobalStyle;
