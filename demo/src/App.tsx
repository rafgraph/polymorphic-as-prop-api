import { DarkModeButton } from './ui/DarkModeButton';
import { GitHubIconLink } from './ui/GitHubIconLink';
import { styled, globalCss } from './stitches.config';

const AppContainer = styled('div', {
  maxWidth: '800px',
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

export const App = () => {
  globalCss();

  return (
    <AppContainer>
      <HeaderContainer>
        <H1>
          Polymorphic <code>as</code> prop api standard PoC
        </H1>
        <HeaderIconContainer>
          <DarkModeButton />
          <GitHubIconLink
            title="GitHub repository for polymorphic as prop api proof of concept"
            href="https://github.com/rafgraph/polymorphic-as-prop-api"
          />
        </HeaderIconContainer>
      </HeaderContainer>
      <InfoContainer>
        This is the demo app for the Polymorphic <code>as</code> prop api
        standard proof of concept.
      </InfoContainer>
    </AppContainer>
  );
};
