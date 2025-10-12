/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/*
 * This was pulled AND MODIFIED from the URL below as
 * LitElements does not prevent the same element from
 * being registered more than once causing errors.
 * https://github.com/lit/lit-element/blob/master/src/lib/decorators.ts
 *
 * Idea: https://github.com/lit/lit-element/issues/207#issuecomment-1150057355
 */

interface Constructor<T> {
  // tslint:disable-next-line:no-any
  new (...args: any[]): T;
}

// From the TC39 Decorators proposal
interface ClassElement {
  kind: "field" | "method";
  key: PropertyKey;
  placement: "static" | "prototype" | "own";
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
  descriptor?: PropertyDescriptor;
}

// From the TC39 Decorators proposal
interface ClassDescriptor {
  kind: "class";
  elements: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
}

const legacyCustomElement = (
  tagName: string,
  clazz: Constructor<HTMLElement>,
): any => {
  if (window.customElements.get(tagName)) {
    return clazz as any;
  }

  window.customElements.define(tagName, clazz);
  // Cast as any because TS doesn't recognize the return type as being a
  // subtype of the decorated class when clazz is typed as
  // `Constructor<HTMLElement>` for some reason.
  // `Constructor<HTMLElement>` is helpful to make sure the decorator is
  // applied to elements however.
  return clazz as any;
};

const standardCustomElement = (
  tagName: string,
  descriptor: ClassDescriptor,
): any => {
  const { kind, elements } = descriptor;
  return {
    kind,
    elements,
    // This callback is called once the class is otherwise fully defined
    finisher(clazz: Constructor<HTMLElement>): void {
      if (window.customElements.get(tagName)) {
        return;
      }
      window.customElements.define(tagName, clazz);
    },
  };
};

/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```
 * @customElement('my-element')
 * class MyElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The name of the custom element to define.
 */
export const customElementIfUndef =
  (tagName: string): any =>
  (classOrDescriptor: Constructor<HTMLElement> | ClassDescriptor): any =>
    typeof classOrDescriptor === "function"
      ? legacyCustomElement(tagName, classOrDescriptor)
      : standardCustomElement(tagName, classOrDescriptor);
