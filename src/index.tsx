import * as React from 'react';

//////////////////////////////////////////
// polymorphicAsArrayUtil
//
// this should be used by every component or create function
// that implements the polymorphicAsArray api

type PolymorphicAsArrayUtil = (arg: {
  defaultAs?: any | any[];
  as?: any | any[];
}) => { As: any; passThroughAsProp?: any[] };

export const polymorphicAsArrayUtil: PolymorphicAsArrayUtil = ({
  defaultAs,
  as,
}) => {
  const asArray = [];

  if (defaultAs) {
    Array.isArray(defaultAs)
      ? asArray.push(...defaultAs)
      : asArray.push(defaultAs);
  }

  if (as) {
    Array.isArray(as) ? asArray.push(...as) : asArray.push(as);
  }

  if (process.env.NODE_ENV !== 'production') {
    if (asArray.length === 0) {
      throw 'At least 1 `as` needs to be provided to polymorphicAsArrayUtil';
    }
  }

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

  return { As, passThroughAsProp };
};

//////////////////////////////////////////
// exported types

export interface PolymorphicAsArrayForwardRefComponent<P = Record<string, any>>
  extends React.ForwardRefExoticComponent<P> {
  polymorphicAsArray?: boolean;
}

export interface PolymorphicAsArrayProps {
  as?: any | any[];
  [key: string]: any;
}

//////////////////////////////////////////
// createPolymorphic

type CreatePolymorphic = (
  defaultAs: any,
  defaultProps?: Record<string, any>,
) => PolymorphicAsArrayForwardRefComponent;

export const createPolymorphic: CreatePolymorphic = (
  defaultAs,
  defaultProps,
) => {
  // polymorphic component that's returned from the create function
  const PolymorphicComponent: PolymorphicAsArrayForwardRefComponent = React.forwardRef(
    ({ as, ...props }, ref) => {
      const { As, passThroughAsProp } = polymorphicAsArrayUtil({
        defaultAs,
        as,
      });

      return (
        <As {...defaultProps} {...props} as={passThroughAsProp} ref={ref} />
      );
    },
  );

  PolymorphicComponent.polymorphicAsArray = true;

  // add compound displayName for better dev tools experience
  if (process.env.NODE_ENV !== 'production') {
    PolymorphicComponent.displayName = `createPolymorphic[${(Array.isArray(
      defaultAs,
    )
      ? defaultAs
      : [defaultAs]
    ).map((el) =>
      typeof el === 'string' ? `"${el}"` : el?.displayName || 'component',
    )}]`;
  }

  return PolymorphicComponent;
};

//////////////////////////////////////////
// styled
//
// the styled function is adapted from this PoC by @jjenzz
// https://codesandbox.io/embed/tender-gould-3q05k?file=/src/App.js

export interface StyledComponent<P = any>
  extends PolymorphicAsArrayForwardRefComponent<P> {
  styles?: React.CSSProperties;
}

type Styled = (
  defaultAs: any,
  styles?: React.CSSProperties,
  defaultProps?: Record<string, any>,
) => PolymorphicAsArrayForwardRefComponent;

export const styled: Styled = (defaultAs, styles, defaultProps) => {
  const extendedStyles = {};
  const defaultAsArray = Array.isArray(defaultAs) ? defaultAs : [defaultAs];
  defaultAsArray.forEach((as) => Object.assign(extendedStyles, as?.styles));
  Object.assign(extendedStyles, styles);

  // polymorphic component that's returned from the create function
  const StyledComponent: StyledComponent = React.forwardRef(
    ({ as, ...props }, ref) => {
      const style = { ...extendedStyles };
      const asArray = Array.isArray(as) ? as : [as];
      asArray.forEach((as) => Object.assign(style, as?.styles));
      Object.assign(style, props.style);

      const { As, passThroughAsProp } = polymorphicAsArrayUtil({
        defaultAs,
        as,
      });

      return (
        <As
          {...defaultProps}
          {...props}
          style={style}
          as={passThroughAsProp}
          ref={ref}
        />
      );
    },
  );

  StyledComponent.styles = extendedStyles;
  StyledComponent.polymorphicAsArray = true;

  // add compound displayName for better dev tools experience
  if (process.env.NODE_ENV !== 'production') {
    StyledComponent.displayName = `styled[${(Array.isArray(defaultAs)
      ? defaultAs
      : [defaultAs]
    ).map((el) =>
      typeof el === 'string' ? `"${el}"` : el?.displayName || 'component',
    )}]`;
  }

  return StyledComponent;
};

//////////////////////////////////////////
