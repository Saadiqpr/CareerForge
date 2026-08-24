# Accessibility Component Notes

## FE-05 Comparison: Hand-Built Components vs shadcn/ui

For this assignment, I first built a modal dialog, tabs, and disclosure component manually in React and TypeScript. I then installed shadcn/ui and generated the Dialog and Tabs components using the Base UI library.

The main lesson from comparing the generated source with my own implementation is that accessibility is not only about adding ARIA attributes. A production component also needs reliable keyboard behavior, focus management, semantic relationships, and handling of edge cases.

## 1. Dialog Behavior

My hand-built modal manually implemented several accessibility behaviors, including Escape-to-close, moving focus into the dialog, restoring focus to the trigger, and trapping Tab navigation.

The generated shadcn Dialog takes a different approach. Instead of implementing these behaviors directly, it delegates them to the Base UI dialog primitives:

- DialogPrimitive.Root
- DialogPrimitive.Trigger
- DialogPrimitive.Close
- DialogPrimitive.Portal
- DialogPrimitive.Backdrop
- DialogPrimitive.Popup

This means the generated component relies on a specialized dialog primitive for the complex interaction behavior instead of maintaining all of that logic inside my component.

## 2. Accessible Close Button

The generated Dialog also provides a reusable close mechanism through DialogPrimitive.Close.

It includes an icon-based close button with:

`<span className="sr-only">Close</span>`

This gives an icon-only control an accessible text label for assistive technologies.

My hand-built modal used a visible "Close" text button, so I did not need a separate visually-hidden accessible label. The generated component therefore demonstrates a more reusable pattern for icon-only controls.

## 3. Dialog Semantics and Structure

The generated source provides dedicated components for:

- DialogTitle
- DialogDescription
- DialogHeader
- DialogFooter

DialogTitle and DialogDescription are backed by the corresponding Base UI primitives.

My implementation manually connected the dialog to an h2 using `aria-labelledby`, but I did not create reusable title and description primitives or a structured header/footer API.

This showed me that accessible components need to consider the complete component structure, not just the main container.

## 4. Tabs and Keyboard Interaction

My hand-built Tabs component manually implemented Arrow Right, Arrow Left, Home, and End keyboard handling.

The generated shadcn Tabs component delegates this behavior to Base UI through:

- TabsPrimitive.Root
- TabsPrimitive.List
- TabsPrimitive.Tab
- TabsPrimitive.Panel

This is a significant difference. My implementation was responsible for maintaining the keyboard interaction model itself, while the generated component uses a dedicated primitive designed for tabs.

I also identified a limitation in my own implementation: when an arrow key changed the active tab, I changed the selected state but did not explicitly move DOM focus to the newly selected tab. A production tabs implementation needs the focus behavior to match the keyboard interaction pattern.

## 5. More Flexible Tab Configuration

The generated Tabs components expose the underlying primitive props and support additional configuration such as orientation.

For example, the root component supports:

`orientation = "horizontal"`

and the individual tab components pass their remaining props to the Base UI primitives.

My hand-built implementation used a much simpler custom Tab type containing only an id, label, and content. It therefore provides fewer built-in behaviors and configuration options.

## 6. What I Learned

The biggest lesson from this comparison is that accessibility cannot be treated as an afterthought.

My manually built components helped me understand the underlying requirements because I had to think about focus, keyboard events, ARIA attributes, and state myself.

The shadcn-generated components showed how a production-oriented implementation can delegate difficult interaction behavior to specialized primitives while keeping the component source readable and customizable.

I also learned that using a component library does not remove the need for accessibility knowledge. A developer still needs to understand what the component is doing so that they can review it, configure it correctly, and identify problems when requirements change.

## 7. Concrete Gaps in My Hand-Built Version

The main gaps I identified were:

1. My modal manually implemented focus trapping and restoration, while the generated Dialog delegates the complex dialog interaction behavior to a dedicated Base UI dialog primitive.

2. My modal did not provide reusable DialogTitle, DialogDescription, DialogHeader, and DialogFooter primitives like the generated component.

3. My tabs implementation manually handled arrow-key state changes but did not explicitly move DOM focus to the newly selected tab.

4. My tabs implementation had a much smaller API and did not expose the additional configuration and primitive behavior provided by the generated Tabs components.

These differences showed me why understanding accessibility fundamentals is important even when using AI-generated or library-provided components.
