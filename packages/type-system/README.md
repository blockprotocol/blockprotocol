# Type-System

This folder contains the definitions of the BlockProtocol type system packages. 
These packages are created through various mechanisms from a source definition written in [Rust](./rust).

## Development

### Changes
Changes to the implementation should be made within the Rust project, consult the [README](./rust/README.md) for more details.

### Testing
- The Rust package contains unit and integration tests as outlined within the [README](./rust/README.md#Testing)
- The generated NodeJS and Web NPM packages are found within the [ts](./ts) folder, accompanied by tests as outlined within its respective [README](./ts/README.md#Testing)
