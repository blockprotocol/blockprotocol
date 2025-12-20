Feature Name: hook-module
Start Date: 2022-07-12
First Published: 2022-07-26
RFC PR: https://github.com/blockprotocol/blockprotocol/pull/430
RFC Discussion: https://github.com/blockprotocol/blockprotocol/discussions/475

---

# Summary

[summary]: #summary

This RFC introduces a Hook Module which standardizes the communication necessary between blocks and embedding applications, allowing the latter to 'take over' rendering one or more parts of a block. This allows functionality to be extended, while ensuring blocks can remain uncoupled from embedding applications.

It also extends the Core Specification so that embedding applications must respond with a `NOT_IMPLEMENTED` error for messages to any Block Protocol modules it does not implement. It is our stated intention to release an update to the `@blockprotocol/core` package which will do this for embedding applications.

# Motivation

[motivation]: #motivation

It is not uncommon for embedding applications to want to provide a consistent 'look and feel' across distinct blocks which implement similar features – i.e, rich text or image editing. Additionally, the implementation of these features may require integrating with systems bespoke to the embedding application. We don't want blocks to have to 'know' about the implementation of this functionality, or necessarily the shape of the data involved in providing this functionality. Therefore, the embedding application needs to be responsible for providing this functionality, but this depends on cooperation by block authors.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

A **hook** is an injection point blocks provide to embedding applications to allow them to optionally render or modify already rendered views associated with a Graph Module property in the block's schema.

**Note: the word 'optionally' here is key.** Blocks cannot today _require_ embedding applications to implement a handler for any specific 'hook'. Instead, they should implement a fallback in the event the embedding application does not implement a hook (see the Errors section below)

A classical example would be rich text editing. In this case, the data structure for formatted text may be bespoke to the embedding application, and impossible for the block to predictably parse or generate. The expected text editing experience may involve custom formatting controls, or special inline actions or commands. By injecting its own rich text editing input, an embedding application can provide all this.

In the rich text example, a block would send a message under the module specifying a type of `"text"`, a DOM node in which to inject the rich text editing input, and the property path the data should be stored under. Any data created by the input can be stored by the embedding application in its own format. The block need not receive this data, since it won't understand it anyway. Instead, the application should send the block a value for the property which matches what the block expects in its schema. In the case of rich text, this is likely to be `"string"`, and the application may choose to supply a plain text representation of the rich text created.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

## Hook Module

A block implements a hook by sending a `hook` message to the embedding application, with five pieces of information:

- `node: HTMLElement | null`: The DOM node the embedding application will render a view into, or modifying an already rendered view.
- `type: "text" | "image" | "video" | string`: The type of view for the hook. While this can be any string, we believe `text`, `image`, and `video` will be commonly used. Straying from these commonly used types could make your block less portable between different embedding applications, particularly those designed to support all blocks.
- `path: string`: A path (expressed as a [JSON path](https://goessner.net/articles/JsonPath/)) to a property present in the block's [schema](https://blockprotocol.org/spec/graph#block-package), which the embedding application can use to render the view for this hook
- `hookId: string | null`: The ID of the hook as provided in the response when first sending a `hook` message. This should be `null` on first call.

The embedding application must respond with a `hookResponse` message specifying a `hookId: string` property, which will be provided in future `hook` messages to establish that the hook is simply being updated, and not set up for the first time.

This `hook` message should be sent every time any one of these pieces of information changes (but not, importantly, if the value `path` refers to changes – embedding applications can handle this). In this way, you can think of the message as setting up the hook.

An embedding application receiving a `hook` message should use this to directly manipulate `node` in order to render the `type` view for the specified `path`.

Where a hook makes use of data, the embedding application should normally read this from the `path` specified in the hook, and ensure the data available at this `path` is updated as changes are made. It may be that the hook stores data in a different format that the block's schema specifies. In this case, the embedding application should still, where possible, ensure a valid representation (i.e, fits the type specified in the block's schema) of this data is available at the relevant `path`.

When receiving `null` for the `node`, the embedding application should tear down any and all subscriptions made in association with this hook.

As this module relies on the embedding application directly manipulating DOM nodes, it will not be possible to implement this where block's 'proxy' the Block Protocol using `postMessage` (i.e, where a block includes an `iframe`). This module requires that the embedding application implementation of the module share the global environment (commonly referred to as a 'scope' or 'realm') with the DOM node passed by the block in the `hook` message.

### Errors

Where an embedding application has not implemented a hook, it must respond with a `NOT_IMPLEMENTED` error, which will allow blocks to implement a fallback. This error must include the `node`, `type`, `path` and `hookId` properties passed in the original `hook` message.

### Notes

- This RFC makes no changes to the Graph Module's requirements that an embedding application implementing the Graph Module must provide data in the format specified by a block's schema.
- The embedding application remains in control of data, as specified in the Graph Module, and should continue to indicate whether the block is in a readonly state as specified in that module. The implementation of the Hook Module should mirror this state.

## Core Specification changes

When an embedding application receives a message from a block where it does the implement the `module` specified in the message, it must respond with a `NOT_IMPLEMENTED` error, so that blocks can respond appropriately.

# Drawbacks

[drawbacks]: #drawbacks

- There is the possibility for explosion in values used in `type`, or for blocks to use it to tie their block to a specific embedding application, or set of embedding applications.
- The core specification which modules build on does not allow sync communication – which may be an issue when it comes to rendering UI. This RFC does not propose changing this at this time as we can investigate in the implementation of the Hook Module if this becomes a problem.

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

## `editableRef`

[editableref]: #editableref

A solution similar to the hooks module was first explored in a temporary implementation called `editableRef` within the [HASH](https://hash.ai) embedding application, enabling its _rich text_ blocks.

This was designed to avoid blocks being coupled to the particular rich text editing solution implemented in HASH, and in that it succeeded.

`editableRef` is a function provided by the embedding application which a block can call with a DOM node rendered by the block, which they wish the embedding application to render rich text present on the `text` field on the block entity into.

It was also used by the embedding application (HASH) to know that any particular block had an editable text section within it. The particular solution HASH uses for rich text editing needs (or needed) to know at the time blocks are loaded that a user can edit text within them. This worked because a block would use `editableRef` by reading it from the properties passed to it, which means the `editableRef` key would be in the block's schema.

`editableRef` is an unsuitable candidate for standardization for a number of reasons:

- It does not indicate which block entity property on which to store the rich text data
- It means that the type of the value in the `text` field is unknown to the block, and may not match the value in the block's schema
- It has a one-time use – you cannot use it to make multiple editable islands within a block (e.g. a blockquote _with_ a caption)
- The requirement for the use of the feature to show up in the block's schema can make certain kinds of blocks impossible (i.e., blocks that may or may not have editable sections depending on their current state).
- An embedding application can only provide one implementation for `editableRef`, which means there may be a mismatch between the implementation provided by the embedding application and the feature expected by the block. I.e., an embedding application may use `editableRef` to provide image editing features, whereas the block may expect it to be used to provide rich text editing features.

Another minor reason is its naming is tied into React – i.e., "editableRef".

This proposal fixes all of these problems.

# Unresolved questions

[unresolved-questions]: #unresolved-questions

- Is _hook_ the best name for this module? Other possible options include (not exhaustive):
  - editable/editing/editor module
  - view module
  - UI module
  - plugin module
  - DOM module
  - extension module
  - interface module
- Is there any functionality expected to be enabled by this module where an embedding application would need to know statically that the module is being used – i.e., does this need to show up in the schema? If so, how does this work with dynamic properties (i.e., a property on a value in a list)?
- Is the use of property paths to indicate the relevant value problematic? Do we need to make it easy to generate these property paths (possible using a proxy)?
- Will blocks want to pass up data which is not present on their schema (i.e, on a linked entity or aggregation) or not provided by the graph module at all
- Do we want to standardize the "types" of hook available or do we want it to be any arbitrary string? Should we 'special-case' the recommended types by providing specific message types for those, or should all uses of the module use the same message type?
- How do we formalize the relationship between the hook module and the graph module?
- Whether there’s some way of blocks requesting that a node is ONLY for displaying the relevant data, or editing the relevant data, rather than it being up to the embedding application.

# Future possibilities

[future-possibilities]: #future-possibilities

- We will want a way for an embedding application to ask to take over rendering for a specific property path, essentially an inversion of the process specified in this RFC. This will enable blocks which are generic entity editors, and don't necessarily know much about the data they're editing – i.e, an Entity Editor block.
- The Core specification should be extended so a block can know ahead of time what modules / parts of modules an embedding application implements. This will make some of the fallback behaviour specified in this RFC simpler.
