import * as React from 'react';
import {
  polymorphicAsArrayUtil,
  createPolymorphic,
  styled,
} from 'polymorphic-as';
import type {
  PolymorphicAsArrayForwardRefComponent,
  PolymorphicAsArrayProps,
} from 'polymorphic-as';

//////////////////////////////////////////
// button demo

const ButtonBase = styled('button', {
  padding: '10px 20px',
  border: '1px solid',
  borderRadius: '1000px',
  display: 'block',
  margin: '20px 0 0',
});

const BoldButton = styled(ButtonBase, {
  fontWeight: 'bold',
  borderWidth: '2px',
});

const GreenButton = styled(ButtonBase, { backgroundColor: 'hsl(120,60%,60%)' });

const RedButton = styled(ButtonBase, { backgroundColor: 'hsl(0,100%,70%)' });

export const ButtonDemo = () => (
  <>
    <ButtonBase>Button Base</ButtonBase>
    <BoldButton>Bold Button</BoldButton>
    <GreenButton>Green Button</GreenButton>
  </>
);

//////////////////////////////////////////
// alert demo

interface AlertProps extends PolymorphicAsArrayProps {
  children?: React.ReactNode;
  alertText?: string;
}
const Alert: PolymorphicAsArrayForwardRefComponent<AlertProps> = React.forwardRef(
  ({ as = 'button', alertText, ...props }, ref) => {
    const handleClick = React.useCallback(() => {
      window.alert(alertText);
    }, [alertText]);

    const { As, passThroughAsProp } = polymorphicAsArrayUtil({ as });

    return (
      <As {...props} onClick={handleClick} as={passThroughAsProp} ref={ref} />
    );
  },
);
Alert.polymorphicAsArray = true;
Alert.displayName = 'Alert';

// could also use the styled function here instead of the createPolymorphic function
const RedAlert = createPolymorphic([Alert, RedButton], {
  alertText: 'RED ALERT!!!', // default prop
});
// the above is equivalent to the following:
// const RedAlert = React.forwardRef<HTMLButtonElement, any>(
//   ({ alertText = 'RED ALERT!!!', as, ...props }, ref) => (
//     <Alert
//       {...props}
//       as={[RedButton, as].flat().filter((el) => el)}
//       alertText={alertText}
//       ref={ref}
//     />
//   ),
// );
// // @ts-ignore
// RedAlert.polymorphicAsArray = true;

export const AlertDemo = () => (
  <>
    <RedAlert>Alert</RedAlert>
  </>
);

//////////////////////////////////////////
// form demo

const Form = styled('form', {
  display: 'inline-block',
  padding: '20px',
  border: '1px solid',
  borderRadius: '8px',
});

// could also use the styled function here instead of the createPolymorphic function
const SubmitButton = createPolymorphic([BoldButton, GreenButton], {
  type: 'submit',
  children: 'Submit',
});

const TextInput = styled(
  'input',
  {
    border: '2px solid',
    borderRadius: '4px',
    padding: '4px 8px',
    width: '200px',
    outline: 'none',
  },
  { type: 'text' },
);

const FormContainer = styled('div', {
  margin: '40px 0',
});

export const FormDemo = () => (
  <FormContainer>
    <Form onSubmit={(e: any) => e.preventDefault()}>
      <TextInput />
      <Alert as={SubmitButton} alertText="You clicked submit! ⚡️💨" />
    </Form>
  </FormContainer>
);

//////////////////////////////////////////
// text demo

const Text = styled('span', {
  fontFamily: 'American Typewriter',
  letterSpacing: '0.5px',
});

const H1 = styled([Text, 'h1'], {
  fontSize: '26px',
  margin: '20px 0',
});

const H2 = styled([Text, 'h2'], {
  fontSize: '22px',
  margin: '15px 0',
});

const Paragraph = styled([Text, 'p'], {
  textIndent: '25px',
  margin: '15px 0',
});

const TextContainer = styled('div', {
  margin: '20px 0',
});

export const TextDemo = () => (
  <TextContainer>
    <H1>H1 Heading</H1>
    <H2>H2 Heading</H2>

    <Paragraph>
      Paragraph... the quick brown fox jumps over the lazy dog. The quick brown
      fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
      The quick brown fox jumps over the lazy dog.
    </Paragraph>
  </TextContainer>
);

//////////////////////////////////////////
// top of page ButtonLink demo

const TopOfPageButton = styled(
  [ButtonBase, 'a'],
  {
    padding: '7px 12px',
    textDecoration: 'none',
    display: 'inline',
  },
  { href: '#top', children: 'Top of Page 👆' },
);

const TopOfPageContainer = styled('div', {
  marginTop: '100px',
});

export const TopOfPageDemo = () => (
  <TopOfPageContainer>
    <TopOfPageButton />
  </TopOfPageContainer>
);

//////////////////////////////////////////
