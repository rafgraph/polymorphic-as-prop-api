import * as React from 'react';
import { randomRGBColorGenerator, ColorBlock } from 'rollpkg-example-package';
import { DarkModeButton } from './ui/DarkModeButton';
import { GitHubIconLink } from './ui/GitHubIconLink';
import { Link } from './ui/Link';
import { Button } from './ui/Button';
import { styled, globalCss } from './stitches.config';

const AppContainer = styled('div', {
  maxWidth: '420px',
  padding: '12px 15px 25px',
  margin: '0 auto',
});

const HeaderContainer = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '18px',
});

const H1 = styled('h1', {
  fontSize: '26px',
  marginRight: '16px',
});

const HeaderIconContainer = styled('span', {
  width: '78px',
  display: 'inline-flex',
  justifyContent: 'space-between',
  gap: '12px',
});

const InfoContainer = styled('p', {
  margin: '18px 0',
});

const RandomColorButton = styled(Button, {
  display: 'block',
  border: '2px solid',
  borderRadius: '6px',
  width: '100%',
  padding: '14px',
  fontSize: '18px',
  textAlign: 'center',
  margin: '36px 0 50px',
});

const ColorBlockContainer = styled('div', {
  margin: '30px 0',
  '&>div': {
    borderRadius: '6px',
  },
});

export const App = () => {
  globalCss();

  const [colors, setColors] = React.useState(() => [
    randomRGBColorGenerator(),
    randomRGBColorGenerator(),
  ]);

  return (
    <AppContainer>
      <HeaderContainer>
        <H1>Rollpkg Example Package</H1>
        <HeaderIconContainer>
          <DarkModeButton />
          <GitHubIconLink
            title="GitHub repository for Rollpkg Example Package"
            href="https://github.com/rafgraph/rollpkg-example-package"
          />
        </HeaderIconContainer>
      </HeaderContainer>
      <InfoContainer>
        This is the demo app for the Rollpkg Example Package.{' '}
        <Link href="https://github.com/rafgraph/rollpkg">Rollpkg</Link> is a
        zero config build tool to create packages with Rollup and TypeScript.
      </InfoContainer>

      <InfoContainer>
        The example package contains a random color generator, which is
        demonstrated here.
      </InfoContainer>

      <RandomColorButton
        onClick={() =>
          setColors([randomRGBColorGenerator(), randomRGBColorGenerator()])
        }
      >
        Generate new random colors
      </RandomColorButton>

      <ColorBlockContainer>
        <ColorBlock width="100%" height="200px" rgbColor={colors[0]} />
        <div>RGB {colors[0].join(', ')}</div>
      </ColorBlockContainer>
      <ColorBlockContainer>
        <ColorBlock width="100%" height="200px" rgbColor={colors[1]} />
        <div>RGB {colors[1].join(', ')}</div>
      </ColorBlockContainer>
    </AppContainer>
  );
};
