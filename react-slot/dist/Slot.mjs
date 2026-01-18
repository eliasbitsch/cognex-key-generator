import * as React from 'react';

export const Slot = React.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (React.Children.count(newElement) > 1) return React.Children.only(null);
        return React.isValidElement(newElement)
          ? (newElement.props.children)
          : null;
      } else {
        return child;
      }
    });

    return React.isValidElement(newElement)
      ? React.cloneElement(
          newElement,
          {
            ...mergeProps(slotProps, newElement.props),
            ref: forwardedRef
              ? composeRefs(forwardedRef, newElement.ref)
              : newElement.ref,
          },
          newChildren
        )
      : null;
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...mergeProps(slotProps, children.props),
      ref: forwardedRef
        ? composeRefs(forwardedRef, children.ref)
        : children.ref,
    });
  }

  return React.Children.count(children) > 1 ? React.Children.only(null) : null;
});

Slot.displayName = 'Slot';

function isSlottable(child) {
  return React.isValidElement(child) && child.type === React.Fragment;
}

function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
    }
  }

  return { ...slotProps, ...overrideProps };
}

function composeRefs(...refs) {
  return (node) => refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref != null) {
      ref.current = node;
    }
  });
}
