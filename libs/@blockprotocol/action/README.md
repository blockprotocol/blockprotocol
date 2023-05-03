## Block Protocol – Action Module

This package implements the Block Protocol Action module for blocks and embedding applications.

To get started:

1.  `yarn add @blockprotocol/action` or `npm install @blockprotocol/action`
1.  Follow the instructions to use the action module as a [block](#blocks) or an [embedding application](#embedding-applications)

## Blocks

To create a `ActionBlockHandler`, pass the constructor:

1.  An `element` in the block
1.  `callbacks` to respond to messages from the embedder
    - You should register a callback for the `updateAction` message, which allows embedding application to set new labels for block actions.

To tell the embedding application what elements will dispatch actions, call the `availableActions` function.
Send this message again if the available actions change.

To send an action message, you call the `action` function.

## Embedding applications

To create a `ActionEmbedderHandler`, pass the constructor:

1.  An `element` wrapping the block
1.  `callbacks` to respond to messages from the block
    - you should register callbacks for `availableActions` to do something with the actions the block advises are possible
    - `action` to process individual action reports

To update the `label` in an action, call `updateAction`. The block should respond with the updated `availableActions`.
