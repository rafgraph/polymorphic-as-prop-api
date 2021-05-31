# Polymorphic `as` prop API standard PoC

> If an API standard is something that the community is interested in pursuing, it probably makes sense for this to be it's own org run by the community.

I'm a fan of the polymorphic `as` prop. I've been using it in [React Interactive](https://github.com/rafgraph/react-interactive) since 2016 (I think this was the first occurrence), and since then it's seen wide spread use with Styled Components helping to popularize it. With multiple libraries implementing the polymorphic `as` prop, I think composability needs to be added to polymorphism (the lack of composability has already caused multiple issues, for example [this Stitches issue](https://github.com/modulz/stitches/issues/448)). A standardized polymorphic API that libraries and components can implement would accomplish this, and would allow multiple polymorphic components to work together seamlessly.

The idea for this is something that I've been thinking about on and off for a bit, and was inspired by this clever [`styled` function PoC](https://codesandbox.io/embed/tender-gould-3q05k?file=/src/App.js) by [@jjenzz](https://github.com/jjenzz).

---

⚡️ [API ideas](#API-ideas) ⚡️ [Proof of concept npm package](#proof-of-concept-npm-package)

**[Try out the proof of concept in CodeSandbox](https://githubbox.com/rafgraph/polymorphic-as-prop-api/tree/main/demo)**

---

## API ideas

### The API needs to define a standardized way to:

- [Determine at runtime if a component implements the polymorphic API](#determine-at-runtime-if-the-API-is-implemented)
- [Create multilevel polymorphism when the polymorphic API is implemented by both components](#create-multilevel-polymorphism)
- [Merge two lines of polymorphism with a create polymorphic function (for example a `styled` function)](#merge-two-lines-of-polymorphism-with-a-create-function)

---

### Determine at runtime if the API is implemented

> In [@jjenzz](https://github.com/jjenzz)'s `styled` PoC she [calls the component function](https://codesandbox.io/s/tender-gould-3q05k?file=/src/App.js:192-272) with a dummy `as` prop, and then [checks the returned React Element's type](https://codesandbox.io/s/tender-gould-3q05k?file=/src/App.js:410-456) to accomplish this. This is some quality hacking 😄 but I don't believe it will scale (there are too many edge cases, e.g. side effects when calling the function component, React components in the form of forwarded ref and memo objects, etc).

The simplest solution is probably to add a property to the component indicating support for the API (the `polymorphicAsArray` name will be explained in the next section).

```js
const MyPolymorphicComponent = (/*...*/) => {
  /*...*/
};

MyPolymorphicComponent.polymorphicAsArray = true;

// then at runtime in some other component we can do
if (SomeComponent.polymorphicAsArray === true) {
  // SomeComponent implements the polymorphic API
}
```

---

### Create multilevel polymorphism

Polymorphic components can support multilevel polymorphism by accepting an array for the `as` prop.

- A component that implements the `polymorphicAsArray` API would need to:
  - Accept an array for the `as` prop
  - Remove the first item from the `as` array and check if it supports the `polymorphicAsArray` API, if yes render it and pass through the remaining `as` array. If it doesn't implement the API, discard it, and check the next item. Repeat until either it finds a component that supports the `polymorphicAsArray` API, or it gets to the last item in the array, then always render it.
  - Or render a predefined component that supports the `polymorphicAsArray` API and pass through the `as` prop to that component untouched.
  - Set the `polymorphicAsArray` property on the component to `true`.
  - Implement additional requirements of the API like `ref` forwarding (not done in the below example).

**_Note that the PoC npm package exports a [helper function `polymorphicAsArrayUtil`](#polymorphicasarrayutil) that implements the `as` array logic._**

```js
const PolymorphicComponent = ({ as = 'div', ...props }) => {
  let As;
  let asArray = [];

  if (!Array.isArray(as)) {
    As = as;
  } else {
    asArray = [...as];

    while (asArray.length > 0) {
      const item = asArray.shift();
      if (
        // item implements polymorphicAsArray API
        item?.polymorphicAsArray === true ||
        // item is the last item in the `as` array
        asArray.length === 0
      ) {
        As = item;
        break;
      }
    }
  }

  // component logic...

  // if the asArray is empty, don't pass it through
  const passThroughAsProp = asArray.length === 0 ? undefined : asArray;

  return <As {...props} as={passThroughAsProp} />;
};

PolymorphicComponent.polymorphicAsArray = true;
```

```js
// usage
// note that ButtonBase is also a polymorphic component
const App = () => (
  <MyPolymorphicComponent as={[ButtonBase, 'a']} href="#polymorphic">
    This renders MyPolymorphicComponent as a ButtonBase as an anchor tag
  </MyPolymorphicComponent>
);
```

---

### Merge two lines of polymorphism with a create function

> A create polymorphic function can come in different flavors for different use cases with additional functionality. For example, a `styled` function that implements the `polymorphicAsArray` API would be a create function. Also, a create function can optionally support a default props argument (using composition, not the to-be-deprecated `defaultProps` property).

- A create polymorphic function that implements the `polymorphicAsArray` API and merges two lines of polymorphism would need to:
  - Accept an `as` array as the first argument (additional arguments can be supported for specific functionality, e.g. a styles object, default props object, etc).
  - Return a component that:
    - Accepts an array for the `as` prop.
    - Appends the `as` prop to the end of the `as` array argument passed to the create function.
    - Renders the merged `as` array as describe above in [Create multilevel polymorphism](#create-multilevel-polymorphism) (render the first item that supports the `polymorphicAsArray` API and pass through the remaining array).
    - Has the `polymorphicAsArray` property set to `true`.
    - Implements additional requirements of the API like `ref` forwarding (not done in below example).

**_Note that the PoC npm package exports a [helper function `polymorphicAsArrayUtil`](#polymorphicasarrayutil) that implements the `as` array logic._**

```js
const createPolymorphic = (defaultAs = 'div') => {
  const asArray = Array.isArray(defaultAs) ? [...defaultAs] : [defaultAs];

  // polymorphic component that's returned from the create function
  const PolymorphicComponent = ({ as, ...props }) => {
    if (as !== undefined) {
      // append the `as` prop to the end of the `defaultAs` argument
      Array.isArray(as) ? asArray.push(...as) : asArray.push(as);
    }

    // same logic as in the above "Create multilevel polymorphism" example
    let As;
    while (asArray.length > 0) {
      const item = asArray.shift();
      if (
        // item implements polymorphicAsArray API
        item?.polymorphicAsArray === true ||
        // item is the last item in the `as` array
        asArray.length === 0
      ) {
        As = item;
        break;
      }
    }

    const passThroughAsProp = asArray.length === 0 ? undefined : asArray;

    return <As {...props} as={passThroughAsProp} />;
  };

  PolymorphicComponent.polymorphicAsArray = true;
  return PolymorphicComponent;
};
```

```js
// usage
// note that Interactive is also a polymorphic component
const ButtonBase = createPolymorphic([Interactive, 'button']);

const ButtonLink = createPolymorphic([ButtonBase, 'a']);

const ButtonLinkWithClosedApi = ({ disabled = false, href }) => (
  <ButtonLink
    as={disabled ? 'span' : undefined}
    href={disabled ? undefined : href}
  />
);
```

---

## Proof of concept npm package

The `polymorphic-as` proof of concept npm package exports 3 functions:

- [`polymorphicAsArrayUtil`](#polymorphicasarrayutil) handles the logic of merging `as` arrays, selecting the `As` to render, and creating the `passThroughAsProp`.
- [`createPolymorphic`](#createpolymorphic) is a generic create polymorphic function that accepts a default props object.
- [`styled`](#styled) is a create polymorphic function that composes component styles.

---

### Install

```shell
npm i --save polymorphic-as
```

---

### `polymorphicAsArrayUtil`

Helper function to handle the logic of merging `as` arrays, selecting the `As` to render, and creating the `passThroughAsProp`.

**_`polymorphicAsArrayUtil` should be used by every component and create function that implements the `polymorphicAsArray` API._**

```js
import { polymorphicAsArrayUtil } from 'polymorphic-as';

const AsAndPassThroughAsProp = polymorphicAsArrayUtil({
  defaultAs, // the `as` argument from a create polymorphic function, optional
  as, // the `as` prop passed to a polymorphic component, optional
});

const {
  As, // <As /> to render
  passThroughAsProp, // `as` prop to pass to As, <As as={passThroughAsProp} />
} = AsAndPassThroughAsProp;
```

```js
// using polymorphicAsArrayUtil in a polymorphic component

import { polymorphicAsArrayUtil } from 'polymorphic-as';

const MyPolymorphicComponent = React.forwardRef(
  ({ as = 'div', ...props }, ref) => {
    const { As, passThroughAsProp } = polymorphicAsArrayUtil({ as });

    // component logic...

    return <As {...props} as={passThroughAsProp} ref={ref} />;
  },
);

MyPolymorphicComponent.polymorphicAsArray = true;
```

```js
// using polymorphicAsArrayUtil in a create function

export const myPolymorphicCreateFunction = (defaultAs) => {
  // the polymorphic component that's returned from the create function
  const PolymorphicComponent = React.forwardRef(({ as, ...props }, ref) => {
    const { As, passThroughAsProp } = polymorphicAsArrayUtil({
      defaultAs,
      as,
    });

    return <As {...props} as={passThroughAsProp} ref={ref} />;
  });

  PolymorphicComponent.polymorphicAsArray = true;

  return PolymorphicComponent;
};
```

---

### `createPolymorphic`

`createPolymorphic` is a generic create function that returns a polymorphic component which implements the `polymorphicAsArray` API. It also accepts a default props object as a second argument.

```js
import { createPolymorphic } from 'polymorphic-as';

const PolymorphicComponent = createPolymorphic(as | as[], defaultPropsObject);
```

```js
import { createPolymorphic } from 'polymorphic-as';

const MyButton = createPolymorphic('button', { className: 'my-button' });

const MyButtonLink = createPolymorphic([MyButton, 'a']);
```

---

### `styled`

> Adapted from this [`styled` function PoC](https://codesandbox.io/embed/tender-gould-3q05k?file=/src/App.js) by [@jjenzz](https://github.com/jjenzz).

> The intention of the `styled` function PoC is to demonstrate what's possible if a production `styled` function (e.g. Stitches' `styled`) implemented the `polymorphicAsArray` API.

`styled` is a create function that composes component styles (using inline styles) and returns a styled polymorphic component. It also accepts a default props object as a third argument.

```js
import { styled } from 'polymorphic-as';

const StyledPolymorphicComponent = styled(as | as[], stylesObject, defaultPropsObject);
```

```js
// button example

import { styled } from 'polymorphic-as';

const ButtonBase = styled('button', {
  padding: '10px 20px',
  border: '1px solid',
  borderRadius: '1000px',
});

const ButtonLink = styled([ButtonBase, 'a']);

const GreenButton = styled(ButtonBase, { color: 'green' });

const SubmitButton = styled(
  GreenButton,
  { fontWeight: 'bold' },
  { type: 'submit' },
);

const TopOfPageButton = styled(
  [ButtonBase, 'a'],
  { padding: '5px 10px' },
  { href: '#top', children: 'Top of Page' }, // default props
);
```

```js
// text input example

import { styled } from 'polymorphic-as';

const TextInput = styled(
  'input',
  { border: '1px solid', borderRadius: '4px' },
  { type: 'text' }, // default props
);
```

---

### TypeScript

The proof of concept code is written is TypeScript but with a generous use of `any` (there are no inferred types from the `as` prop).

The `polymorphic-as` package does export a `PolymorphicAsArrayForwardRefComponent` type that can be used to type components that implement the polymorphic as array API, and a `PolymorphicAsArrayProps` type that the props interface can extend.

```ts
import {
  polymorphicAsArrayUtil,
  PolymorphicAsArrayForwardRefComponent,
  PolymorphicAsArrayProps,
} from 'polymorphic-as';

interface MyPolymorphicComponentProps extends PolymorphicAsArrayProps {
  someProp?: string;
}

// prettier-ignore
const MyPolymorphicComponent:
  PolymorphicAsArrayForwardRefComponent<MyPolymorphicComponentProps> =
  React.forwardRef(
  ({ as = 'div', someProp, ...props }, ref) => {
    const { As, passThroughAsProp } = polymorphicAsArrayUtil({ as });

    // component logic...

    return <As {...props} ref={ref} />;
  },
);

MyPolymorphicComponent.polymorphicAsArray = true;
```
