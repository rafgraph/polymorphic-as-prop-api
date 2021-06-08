import {
  ButtonDemo,
  AlertDemo,
  FormDemo,
  TextDemo,
  TopOfPageDemo,
} from './PolymorphicAsArrayDemos';
import { GitHubIconLink } from './GitHubIconLink';
import { styled } from 'polymorphic-as';

const AppContainer = styled('div', {
  maxWidth: '600px',
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

const DemoContainer = styled('div', {
  margin: '30px 0',
});

export const App = () => {
  return (
    <AppContainer>
      <HeaderContainer>
        <H1>
          Polymorphic <code>as</code> array API Demo
        </H1>
        <GitHubIconLink
          title="GitHub repository for polymorphic as prop api proof of concept"
          href="https://github.com/rafgraph/polymorphic-as-prop-api"
        />
      </HeaderContainer>
      <DemoContainer>
        <ButtonDemo />
        <AlertDemo />
        <FormDemo />
        <TextDemo />
        <TopOfPageDemo />
      </DemoContainer>
    </AppContainer>
  );
};
