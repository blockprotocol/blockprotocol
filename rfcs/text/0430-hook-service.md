- Feature Name: `hook-service`
- Start Date: (fill me in with today's date, 2022-07-12)
- RFC PR: [blockprotocol/blockprotocol#430](https://github.com/blockprotocol/blockprotocol/pull/430)
- Block Protocol Discussion: N/A

# Summary

[summary]: #summary

This RFC introduces a Hook Service which standardizes the communication necessary between blocks and embedding applications, allowing the latter to 'take over' rendering one or more parts of a block. This allows functionality to be extended, while ensuring blocks can remain uncoupled from embedding applications.

It also extends the Core Specification so that embedding applications must respond with a `NOT_IMPLEMENTED` error for messages to any Block Protocol services it does not implement. It is our stated intention to release an update to the `@blockprotocol/core` package which will do this for embedding applications.

# Motivation

[motivation]: #motivation

It is not uncommon for embedding applications to want to provide a consistent 'look and feel' across distinct blocks which implement similar features – i.e, rich text or image editing. Additionally, the implementation of these features may require integrating with systems bespoke to the embedding application. We don't want blocks to have to 'know' about the implementation of this functionality, or necessarily the shape of the data involved in providing this functionality. Therefore, the embedding application needs to be responsible for providing this functionality, but this depends on cooperation by block authors.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

## Hook Service

A **hook** is an injection point blocks provide to embedding applications to allow them to optionally render or modify already rendered views associated with a Graph Service property in the block's schema.

**Note: the word 'optionally' here is key.** Blocks cannot today _require_ embedding applications to implement a handler for any specific 'hook'. Instead, they should implement a fallback in the event the embedding application does not implement a hook (see the Errors section below)

A classical example would be rich text editing. In this case, you may not want to provide the underlying data storing the formatted text, as this may be bespoke to your embedding application. But you may still want to provide the plain text value for the block to make use of – e.g., if the block provides a word count feature.

A block implements a hook by sending a `hook` message to the embedding application, with five pieces of information:

- `node: HTMLElement | null`: The DOM node the embedding application will render a view into, or modifying an already rendered view.
- `type: "text" | "image" | "video" | string`: The type of view for the hook. While this can be any string, we believe `text`, `image`, and `video` will be commonly used. Straying from these commonly used types could make your block less portable between different embedding applications, particularly those designed to support all blocks.
- `path: string`: A path (expressed as a [JSON path](https://goessner.net/articles/JsonPath/)) to a property present in the block's [schema](https://blockprotocol.org/docs/spec/graph-service-specification#block-package), which the embedding application can use to render the view for this hook
- `hookId: string | null`: The ID of the hook as provided in the response when first sending a `hook` message. This should be `null` on first call.

The embedding application must respond with a `hookResponse` message specifying a `hookId: string` property, which will be provided in future `hook` messages to establish that the hook is simply being updated, and not installed.

This `hook` message should be sent every time any one of these pieces of information changes (but not, importantly, if the value `path` refers to changes – embedding applications can handle this). In this way, you can think of the message as setting up the hook.

An embedding application receiving a `hook` message should use this to directly manipulate `node` in order to render the `type` view for the specified `path`.

Where a hook makes use of data, the embedding application should normally read this from the `path` specified in the hook, and ensure the data available at this `path` is updated as changes are made. It may be that the hook stores data in a different format that the block's schema specifies. In this case, the embedding application should still, where possible, ensure a valid representation (i.e, fits the type specified in the block's schema) of this data is available at the relevant `path`.

When receiving `null` for the `node`, the embedding application should tear down any and all subscriptions made in association with this hook.

In order to enable this direct manipulation, the Graph Service is likely to be difficult or impossible to implement in Embedding Applications which use common ‘sandboxing’ techniques including `iframe`s.

### Errors

Where an embedding application has not implemented a hook, it must respond with a `NOT_IMPLEMENTED` error, which will allow blocks to implement a fallback. This error must include the `node`, `type`, `path` and `hookId` properties passed in the original `hook` message.

## Core Specification changes

When an embedding application receives a message from a block where it does the implement the `service` specified in the message, it must respond with a `NOT_IMPLEMENTED` error, so that blocks can respond appropriately.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

TODO:

This is the technical portion of the RFC. Explain the design in sufficient detail that:

- Its interaction with other features is clear.
- It is reasonably clear how the feature would be implemented.
- Corner cases are dissected by example.

The section should return to the examples given in the previous section, and explain more fully how the detailed proposal makes those examples work.

# Drawbacks

[drawbacks]: #drawbacks

- There is the possibility for explosion in values used in `type`, or for blocks to use it to tie their block to a specific embedding application, or set of embedding applications.
- The core specification which services build on does not allow sync communication – which may be an issue when it comes to rendering UI. This RFC does not propose changing this at this time as we can investigate in the implementation of the Hook Service if this becomes a problem.

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

TODO:

- Why is this design the best in the space of possible designs?
- What other designs have been considered and what is the rationale for not choosing them?
- What is the impact of not doing this?

# Prior art

[prior-art]: #prior-art

## `editableRef`

[editableref]: #editableref

A solution similar to the hooks service was first explored in a temporary implementation called `editableRef` within the [HASH](https://hash.ai) embedding application, enabling its _rich text_ blocks.

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

- Is _hook_ the best name for this service? Other possible options include (not exhaustive):
  - editable/editing/editor service
  - view service
  - UI service
  - plugin service
  - DOM service
  - extension service
  - interface service
- Is there any functionality expected to be enabled by this service where an embedding application would need to know statically that the service is being used – i.e., does this need to show up in the schema? If so, how does this work with dynamic properties (i.e., a property on a value in a list)?
- Is the use of property paths to indicate the relevant value problematic? Do we need to make it easy to generate these property paths (possible using a proxy)?
- Will blocks want to pass up data which is not present on their schema (i.e, on a linked entity or aggregation) or not provided by the graph service at all
- Do we want to standardize the "types" of hook available or do we want it to be any arbitrary string? Should we 'special-case' the recommended types by providing specific message types for those, or should all uses of the service use the same message type?
- Is the recommended list of types of hook sufficient?
- How do we formalize the relationship between the hook service and the graph service?
- Whether there’s some way of blocks requesting that a node is ONLY for displaying the relevant data, or editing the relevant data, rather than it being up to the embedding application.

# Future possibilities

[future-possibilities]: #future-possibilities

- We will want a way for an embedding application to ask to take over rendering for a specific property path, essentially an inversion of the process specified in this RFC. This will enable blocks which are generic entity editors, and don't necessarily know much about the data they're editing – i.e, an Entity Editor block.
- The Core specification should be extended so a block can know ahead of time what services / parts of services an embedding application implements. This will make some of the fallback behaviour specified in this RFC simpler.
