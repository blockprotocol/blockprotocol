# @blockprotocol/type-system-node

## 0.0.2

### Patch Changes

- [#725](https://github.com/blockprotocol/blockprotocol/pull/725) [`f63712e`](https://github.com/blockprotocol/blockprotocol/commit/f63712ef56676109183534446cf7468d6eb4b704) Thanks [@Alfred-Mountfield](https://github.com/Alfred-Mountfield)! - - Adds foundation for Inheritance in Entity Types
  - Use entity type references in `links` object rather than link type references
  - Remove Link Types from the Type System
  - Allow empty destination constraints on `links` in entity types
  - Remove `pluralTitle` from Type System
  - Make `ordered` a required property on link array constraints
  - Greatly improve types
