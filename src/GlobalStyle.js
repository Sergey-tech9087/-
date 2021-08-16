import { createGlobalStyle } from 'styled-components';
import {
  darkSber,
  darkEva,
  darkJoy,
  lightSber,
  lightEva,
  lightJoy,
  text,
  background,
  gradient,
} from '@sberdevices/plasma-tokens';

const DocumentStyle = createGlobalStyle`
    html:root {
      color: ${text};
      background-color: ${background};
      background-image: ${gradient};
      min-height: 100vh;
    }
`;

const ThemeDarkSber = createGlobalStyle(darkSber);
const ThemeDarkEva = createGlobalStyle(darkEva);
const ThemeDarkJoy = createGlobalStyle(darkJoy);

const ThemeLightSber = createGlobalStyle(lightSber);
const ThemeLightEva = createGlobalStyle(lightEva);
const ThemeLightJoy = createGlobalStyle(lightJoy);

export const GlobalStyle = ({ themeColorsDark, assistantCharacter }) => (
  <>
    <DocumentStyle />
    {(() => {
      switch (assistantCharacter) {
        case 'sber':
          return themeColorsDark ? <ThemeDarkSber /> : <ThemeLightSber />;
        case 'eva':
          return themeColorsDark ? <ThemeDarkEva /> : <ThemeLightEva />;
        case 'joy':
          return themeColorsDark ? <ThemeDarkJoy /> : <ThemeLightJoy />;
        default:
          return;
      }
    })()}
  </>
);

export default GlobalStyle;
