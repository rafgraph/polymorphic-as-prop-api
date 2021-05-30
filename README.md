# Polymorphic `as` prop api standard PoC

I'm a fan of the polymorphic `as` prop. I've been using it in [React Interactive](https://github.com/rafgraph/react-interactive) since 2016 (I think this was the first occurrence), and since then it's seen wide spread use (Styled Components helped popularize it). With multiple libraries implementing it, I feel like composability needs to be added to polymorphism (the lack of composability has already caused several issues). A standardized polymorphic api that libraries and components can implement would accomplish this, and would allow multiple polymorphic components to work together seamlessly

The idea for this is something that I've been thinking about on and off for a bit, and was inspired by this clever [`styled` function PoC](https://codesandbox.io/embed/tender-gould-3q05k?file=/src/App.js) by [@jjenzz](https://github.com/jjenzz).

---

### The api needs to define a standardized way to:

- [Determine at runtime if a component implements the polymorphic api](#determine-at-runtime-if-the-api-is-implemented)
- [Create multilevel polymorphism when the polymorphic api is implemented by both components](#create-multilevel-polymorphism)
- [Merge two lines of polymorphism with a create polymorphic function (for example a `styled` function)](#merge-two-lines-of-polymorphism-with-a-create-function)

**Below are some initial ideas for how to do this.**

---

### Determine at runtime if the api is implemented

> In [@jjenzz](https://github.com/jjenzz)'s `styled` PoC she [calls the component function](https://codesandbox.io/s/tender-gould-3q05k?file=/src/App.js:192-272) with a dummy `as` prop, and then [checks the returned Element's type](https://codesandbox.io/s/tender-gould-3q05k?file=/src/App.js:410-456) to accomplish this. This is some quality hacking 😄 but I don't believe it will scale (there are too many edge cases, e.g. side effects when calling the function component, React components in the form of forwarded ref and memo objects, etc).

The simplest solution is probably to add a property to the component indicating support for the api (the `polymorphicAsArray` name will be explained in the next section).

```js
const MyPolymorphicComponent = (/*...*/) => {
  /*...*/
};

MyPolymorphicComponent.polymorphicAsArray = true;

// then at runtime in some other component we can do
if (SomeComponent.polymorphicAsArray === true) {
  // SomeComponent implements the polymorphic api
}
```

---

### Create multilevel polymorphism

Polymorphic components can support multilevel polymorphism by accepting an array for the `as` prop.

- A component that implements the `polymorphicAsArray` api would need to:
  - Accept an array for the `as` prop
  - Remove the first item from the `as` array and check if it supports the `polymorphicAsArray` api, if yes render it and pass through the remaining `as` array. If it doesn't implement the api, discard it, and check the next item. Repeat until either it finds a component that supports the `polymorphicAsArray` api, or it gets to the last item in the array, then always render it.
  - Or render a predefined component that supports the `polymorphicAsArray` api and pass through the `as` prop to that component untouched.
  - Set the `polymorphicAsArray` property on the component to `true`.
  - Implement additional requirements of the api like `ref` forwarding (not done in the below example).

```js
const MyPolymorphicComponent = ({ as = 'div', ...props }) => {
  let As;
  let asArray = [];

  if (!Array.isArray(as)) {
    As = as;
  } else {
    asArray = [...as];

    while (asArray.length > 0) {
      const item = asArray.shift();
      if (
        // item implements polymorphicAsArray api
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

MyPolymorphicComponent.polymorphicAsArray = true;
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

> A create polymorphic function can come in different flavors for different use cases with additional functionality. For example, a `styled` function that implements the `polymorphicAsArray` api would be a create function. Also, a create function can optionally support a default props argument (using composition, not the to-be-deprecated `defaultProps` property).

- A create polymorphic function that implements the `polymorphicAsArray` api and merges two lines of polymorphism would need to:
  - Accept an `as` array as the first argument (additional arguments can be supported for specific functionality, e.g. a styles object, default props object, etc).
  - Return a component that:
    - Accepts an array for the `as` prop.
    - Appends the `as` prop to the end of the `as` array argument passed to the create function.
    - Renders the merged `as` array as describe above in [Create multilevel polymorphism](#create-multilevel-polymorphism) (render the first item that supports the `polymorphicAsArray` api and pass through the remaining array).
    - Has the `polymorphicAsArray` property set to `true`.
    - Implements additional requirements of the api like `ref` forwarding (not done in below example).

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
        // item implements polymorphicAsArray api
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
