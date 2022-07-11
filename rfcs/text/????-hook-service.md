- Feature Name: `hook-service`
- Start Date: (fill me in with today's date, YYYY-MM-DD)
- RFC PR: [blockprotocol/blockprotocol#????](https://github.com/blockprotocol/blockprotocol/pull/????)
- Block Protocol Discussion: [blockprotocol/blockprotocol#????](https://github.com/blockprotocol/blockprotocol/discussions/????)

# Summary

[summary]: #summary

This service standardises the communication between blocks and the embedding application necessary to enable embedding applications to 'take over' the rendering of parts of a block to extend functionality, while ensuring block can remain uncoupled from the embedding application, even where these are implemented by the same organisation.

In order to enable direct manipulation, this service is likely to be difficult or impossible to implement in Embedding Applications which use common ‘sandboxing’ techniques including `iframe`s.

# Motivation

[motivation]: #motivation

It is not uncommon for embedding applications to want to provide a consistent 'look and feel' across distinct blocks which implement similar features – i.e, rich text editing. Additionally, the implementation of these features may require integrating with systems bespoke to the embedding application. We don't want blocks to have to 'know' about the implementation of this functionality, or necessarily the shape of the data involved in providing this functionality.

This service will allow a block to 'call out' to the embedding application to ask it to render or modify views associated with specified data, provided by the graph service.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

IN PROGRESS:

The hook service can be used by a block to allow the embedding application, should they wish, to provide functionality not provided by the block, associated with a specified value on the `blockEntity` property provided by the graph service. 

The 'should they wish' here is key. Blocks cannot require embedding applications to implement a response to 

A classical example would be rich text editing. In this case, you may not want to provide the underlying data storing the formatted text, as this may be bespoke to your embedding application. But you may still want to provide the plain text value for the block to make use of – i.e, if the block provides a word count feature.  

This example is an illustration that you shouldn't think of the hook service as a way of directly coupling a block and the embed

a block will send a `render` message with three pieces of information:
- `node`: The DOM node to give control to the embedding application. We use direct manipulation of the DOM node, rather than the embedding application providing the

Explain the proposal as if it was already included in the protocol and you were teaching it to another Block Protocol implementor. That generally means:

- Introducing new named concepts.
- Explaining the feature largely in terms of examples.
- Explaining how Block Protocol implementors and users should _think_ about the feature, and how it should impact the way they use the protocol. It should explain the impact as concretely as possible.
- If applicable, provide sample error messages, deprecation warnings, or migration guidance.
- If applicable, describe the differences between teaching this to existing and new Block Protocol users.

For implementation-oriented RFCs, this section should focus on how Block Protocol implementors should think about the change, and give examples of its concrete impact. For policy RFCs, this section should provide an example-driven introduction to the policy, and explain its impact in concrete terms.

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

TODO:

Why should we _not_ do this?

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

TODO:

- Why is this design the best in the space of possible designs?
- What other designs have been considered and what is the rationale for not choosing them?
- What is the impact of not doing this?

# Prior art

[prior-art]: #prior-art

## `editableRef`

[editableRef]: #editableref

The first exploration of this space was the introduction of `editableRef` in the HASH app, currently powering the rich text blocks.

This was designed to avoid blocks being coupled to the particular rich text editing solution implemented in HASH, and in that it succeed.

`editableRef` is a function provided by the embedding application which a block can call with a DOM node rendered by the block, which they wish the embedding application to render rich text present on the `text` field on the block entity into.

It was also used by the embedding application (HASH) to know that any particular block had an editable text section within it. The particular solution HASH uses for rich text editing needs (or needed) to know at the time blocks are loaded that a user can edit text within them. This worked because a block would use `editableRef` by reading it from the properties passed to it, which means the `editableRef` key would be in the block's schema.

`editableRef` is an unsuitable candidate for standardisation for a number of reasons:
- It does not indicate which block entity property on which to store the rich text data
- It means that the type of the value in the `text` field is unknown to the block, and may not match the value in the block's schema
- It has a one time use – you cannot use it to make multiple editable islands within a block (think a blockquote with a caption)
- The requirement for the use of the feature to show up in the block's schema can make certain kinds of blocks impossible (i.e, blocks that may or may not have editable sections depending on their current state).
- An embedding application can only provide one implementation for `editableRef`, which means there may be a mismatch between the implementation provided by the embedding application and the feature expected by the block. I.e, an embedding application may use `editableRef` to provide image editing features, whereas the block may expect it to be used to provide rich text editing features. 

Another minor reason is its naming is tied into React – i.e, "editableRef". 

This proposal fixes all of these problems.

# Unresolved questions

[unresolved-questions]: #unresolved-questions

- Is hook the best name for this service? Other options include (not exhaustive):
  - editable/editing/editor service
  - view service
  - UI service
  - plugin service
  - DOM service
  - extension service
- Is there any functionality expected to be enabled by this service where an embedding application would need to know statically that the service is being used – i.e, does this need to show up in the schema. If so, how does this work with dynamic properties (i.e, a property on a value in a list)
- Is the use of property paths to indicate the relevant value problematic? Do we need to make it easy to generate these property paths (possible using a proxy)?
- Will blocks want to pass up data which is not present on `blockEntity` (i.e, on a linked entity or aggregation) or not provided by the block service at all
- Do we want to standardise the "types" of hook available or do we want it to be any arbitrary string? Should we 'special-case' the recommended types by providing specific message types for those, or should all uses of the service use the same message type? 
- Is the recommended list of types of hook sufficient?
- How do we formalise the relationship between the hook service and the graph service?

# Future possibilities

TODO:

[future-possibilities]: #future-possibilities

Think about what the natural extension and evolution of your proposal would be and how it would affect the project and ecosystem as a whole in a holistic way. Try to use this section as a tool to more fully consider all possible interactions with the project and ecosystem in your proposal. Also consider how this all fits into the roadmap for the project and of the relevant sub-team.

This is also a good place to "dump ideas", if they are out of scope for the RFC you are writing but otherwise related.

If you have tried and cannot think of any future possibilities, you may simply state that you cannot think of anything.

Note that having something written down in the future-possibilities section is not a reason to accept the current or a future RFC; such notes should be in the section on motivation or rationale in this or subsequent RFCs. The section merely provides additional information.
