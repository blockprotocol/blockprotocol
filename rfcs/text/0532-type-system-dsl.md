- Feature Name: type-system-dsl
- Start Date: 2022-08-24
- RFC
  PR: [blockprotocol/blockprotocol#532](https://github.com/blockprotocol/blockprotocol/pull/532)
- RFC
  Discussion: [blockprotocol/blockprotocol#540](https://github.com/blockprotocol/blockprotocol/discussions/540)

# Summary

[summary]: #summary

This RFC proposes a new system for expressing all types outlined in [RFC 0352],
and [RFC 0408] through a domain specific language (DSL). The DSL addresses pain points
that working with raw types using JSON brings with and includes a toolbox of programs to
aid in development, specifically geared towards developers.

TODO: name? file extension?

# Motivation

[motivation]: #motivation

Why are we doing this? What use cases does it support? What is the expected outcome?

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

Explain the proposal as if it was already included in the protocol and you were teaching
it to another Block Protocol implementor. That generally means:

- Introducing new named concepts.
- Explaining the feature largely in terms of examples.
- Explaining how Block Protocol implementors and users should _think_ about the feature,
  and how it should impact the way they use the protocol. It should explain the impact as
  concretely as possible.
- If applicable, provide sample error messages, deprecation warnings, or migration
  guidance.
- If applicable, describe the differences between teaching this to existing and new Block
  Protocol users.

For implementation-oriented RFCs, this section should focus on how Block Protocol
implementors should think about the change, and give examples of its concrete impact. For
policy RFCs, this section should provide an example-driven introduction to the policy, and
explain its impact in concrete terms.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

## Domain-Specific-Language (DSL)

```abnf
IDENT = ALPHA *(ALPHA / DIGIT / "-")
```

### Primitive Types

```abnf
INTEGER = ["+" / "-"] 1*DIGIT
FLOAT = INTEGER "." 1*DIGIT
BOOLEAN = true / false;
STRING = ... ; TODO
COMMENT = "//" ; TODO
VALUE = FLOAT / INTEGER / STRING / BOOLEAN
```

### Comments

```abnf
COMMENT = "//" ; TODO
doc-comment = "///" ; TODO
```

There are two types of comments: code comments and documentation comments.
Code comments are erased during the compilation, while documentation comments are used
as the description of resources (if they support it).
Code comments are allowed anywhere, while documentation comments are only allowed before
resources.

### Attributes

```abnf
attribute = "#" "[" IDENT "=" (VALUE / (*(IDENT "::") IDENT)) "]"
```

Attributes are optional information about a specific resource (property-type, data-type,
link-type, entity-type, etc.), which are used to add more detail to a resource.

Attribute values may refer to previously set configuration values, depending on the
attribute these may be forbidden.

| Name      | Description                                                                            | Type  | Variable Support |
|-----------|----------------------------------------------------------------------------------------|-------|------------------|
| `version` | Version of a resource, if not specified will be inserted on execution, defaults to `1` | `int` | `false`          |

### Reference

```abnf
range = [INTEGER] ".." [INTEGER]
reference-array = "[" variable [";" range] "]"
reference = variable / reference-array
```

```abnf
url = STRING
id = IDENT

use-key-value = id "=" VALUE
use-with = "with" "{" [*(use-key-value ",") use-key-value [","]] "}"
use = "use" url "as" id [use-with] ";"
```

-> How use works, required `self`

### Resources

Resources are types, which are declared in the DSL. They have $n$ inputs and one output.

The inputs to a resource are implicitly defined, and are the resources that have been used
in the current resource. The output of a resource is its identifier.

There are four types of resources:

* `prop` (corresponding to property-types)
* `link` (corresponding to link-types)
* `data` (corresponding to data-types)
* `entity` (corresponding to entities)

#### Example 1

```
imp std;

prop age "Age" = number;

prop alive "Boolean" = bool;

entity person "Person" = {
  age?,
  alive
};
```

```mermaid
flowchart LR;
  bp_number["#bp::number"]
  bp_bool["#bp::boolean"]
  age[Age]
  alive[Alive]
  person[Person]
  
  bp_number --> number --> age
  bp_bool --> bool --> alive
  
  alive --> person
  age --> person
```

#### Data Type

Currently unspecified

#### Property Type

```abnf
id = IDENT
title = STRING

prop-object = "{" [*(reference ",") reference [","]] "}"
prop-array = "[" prop-value [";" range] "]"
prop-value = variable / prop-object / prop-array / (prop-value "|" prop-value) / "(" prop-value ")"
prop = *doc-comment *attribute prop [id] title "=" prop-value ";"
```

### Type Alias

[//]: # (TODO: use alias instead of "virtual" prop)

```abnf
alias = "alias" IDENT "=" prop-value;
```

-> explain virtual

#### Link Type

```abnf
id = IDENT
title = STRING

link = *doc-comment *attribute link [id] title ";"
```

#### Entity Type

```abnf
id = IDENT
title = STRING

entity-link-direction = "~>" / "->"
entity-link = link-direction reference 

entity-value = "{" [*(reference / entity-link-direction ",") (reference / entity-link-direction ",")] "}"
entity = *doc-comment *attribute entity [id] title "=" entity-value ";"
```

### Variables

```abnf
type = "@" / "#" / ">" / "~"
module = IDENT
id = IDENT
version = INTEGER

variable = type? [module "::"] id ["/" version] 
```

### Functions

```abnf
arg = call / variable / VALUE;
call = IDENT "(" [*(arg ",") arg [","]] ")"
```

-> list implemented function
-> TODO: consider removing

### Modules

```abnf
glob = STRING

import = "imp" (glob / "std") ";"
```

-> TODO: explain module structure, how import works.

### Configuration

```abnf
id = IDENT

set *(id "::") id "=" VALUE ";"
```

Configuration is used to set values, which may be referenced later using interpolation or
during configuration of the implementations. Configuration keys need to be unique, cannot
be overwritten and user-defined configuration keys *may not* use built-in names.

Configuration keys are dictionaries, which are partitioned using `::`, this allows the
protection of certain values, to reduce breakage in future releases.

The namespace `impl` and `lang` are reserved and *may not* be used for user-defined
configuration.

| Name                     | Type                          | Description                                                                                                                                          | Effect                                                       | Default  | Implemented since     |
|--------------------------|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|----------|-----------------------|
| `lang::transaction`      | `boolean`                     | Remote registry supports transactions                                                                                                                | If enabled, cycles which aren't self-referential are allowed | `false`  | not implemented       |
| `lang::unstable`         | `boolean`                     | Enable unstable feature in language, if available.                                                                                                   | Will set every key starting with `lang::unstable` to true.   | `false`  | `0.1`                 |
| `lang::unstable::env`    | `boolean`                     | Enable the usage of environmental variables for configuration values                                                                                 | Use of `${}` in configuration strings is possible.           | `false`  | not implemented       |
| `lang::unstable::format` | `boolean`                     | Enable string interpolation with configuration values                                                                                                | Use of `{}` in strings to reference configuration values.    | `false`  | not implemented       |
| `lang::unstable::func`   | `boolean`                     | Enable support for the calling of functions                                                                                                          | Enable the use of functions calls across the whole app       | `false`  | not implemented       |
| `impl::auth`             | `enum` (`"none", "password"`) | Remote registry has a specific authentication scheme, depending on the implementation, different methods for supplying the credentials are provided. | If enabled, will use authentication to contact registry      | `"none"` | `"none"`: since `0.1` |
| `impl::unstable`         | `boolean`                     | Enable unstable features in implementation, if available.                                                                                            | Will set every key starting with `impl::unstable` to true    | `false`  | `0.1`                 |

### `std` module

```
use "https://blockprotocol.org/types/@blockprotocol" as bp;

alias text = #bp/text;
alias number = #bp/number;
alias bool = #bp/boolean;
alias object = #bp/object;
```

## Language Extensibility

## Toolbox

### Variables

Variables are used to refer to other types that have been declared remotely or locally and
expressed through a prefix, a namespace and an identifier, and is expressed
as `[prefix]?([namespace]/)?[identifier]`.

The prefix of a variable determines which type the variable it is referring
to (`data-type`, `property-type`, etc.) and is optional in all types, if omitted a
variable will take on the prefix of the declaration it is used in.

This means that `other` is equivalent to `@other` in a `prop` declaration, and equivalent
to `#other` in a `data` declaration.

The available prefixes are: `#` for data-types, `@` for property-types, `>` for link-types
and `~` for entities.

The namespace of variable determines which URL is used to prefix the type name and can be
omitted, if omitted the namespace will be `self`.

The identifier is the unique identifier for a type in a specific namespace/URL.

### Identifier

### Attributes

### Comments

### `use` Statement

The use state can be used to reference remote types and can be expressed as:

```
use [url] as [alias] (where {
    data = [format],
    prop = [format],
    link = [format],
    entity = [format]
}
)?;
```

The `[url]` is a string with a valid URL pointing to a repository of types where `alias`
is a valid identifier, which is used to refer to a remote type in the DSL. The where
clause is optional, if not defined a default will be chosen instead.

`[format]` is a minimalistic format string, that uses string interpolation through `{var}`
, supported variables are: `base` (defined `[url]`) and `id` (generated `id` for a
specific declaration).

One **must** specify a URL using the alias `self`, all declarations in a file will
implicitly refer to the declared URL.

### `set` Statement

### `import` Statement

```
import [resource];
```

where `[resource]` is either a local file, a URL or points to a file in a git repository.

This is the technical portion of the RFC. Explain the design in sufficient detail that:

- Its interaction with other features is clear.
- It is reasonably clear how the feature would be implemented.
- Corner cases are dissected by example.

The section should return to the examples given in the previous section, and explain more
fully how the detailed proposal makes those examples work.

### Example

```
use "https://blockprotocol.org/types/@alice" as self with {
    data = "{self}/data-type/{id}",
    prop = "{self}/property-type/{id}",
    link = "{self}/link-type/{id}",
    entity = "{self}/entity-type/{id}"
};


use "https://blockprotocol.org/types/@blockprotocol" as bp with {
    data = "{self}/data-type/{id}",
    prop = "{self}/property-type/{id}",
    link = "{self}/link-type/{id}",
    entity = "{self}/entity-type/{id}"
};

prop favorite-quote "Favorite Quote" = #bp::text/1;

prop user-id "User ID" = #bp::text/1 | #bp::number/1;

/// This is a further description of Contact Information
#[version = 14]
prop contact-information "Contact Information" = {
    *bp/email@1,
    *bp/phone-number@1?
};

/// Interests
///
/// This is some flavor text
#[version = 1]
prop interests "Interests" = {
    favorite-song@1?,
    favorite-film@1?,
    hobby@1[]?
};

prop contrived-property "Contrived Property" = #blockprotocol/number@1 | (#blockprotocol/number@1)[];

// alternatives that need to be discussed:
/// Owns
///
/// Have (something) as one's own; possess
link owns "Owns";

#[version = 1]
entity book "Book" = {
    name@1,
    published-on@1?,
    blurb@1,

    -> written-by@1,
    -> friend-of@1[],
    ~> best-friend@1?
};

#[version = 1]
prop property-values "Property Values" = (
    *bp/text@1
    | *bp/number@1
    | (some-object@1)[..5]
)[..10];
```

# Drawbacks

[drawbacks]: #drawbacks

Why should we _not_ do this?

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

- Why is this design the best in the space of possible designs?
- What other designs have been considered and what is the rationale for not choosing them?
- What is the impact of not doing this?

# Prior art

[prior-art]: #prior-art

Discuss prior art, both the good and the bad, in relation to this proposal.
A few examples of what this can include are:

- For implementation proposals: Does this feature exist in other technologies, and what
  experience have their community had?
- For community proposals: Is this done by some other community and what were their
  experiences with it?
- For other teams: What lessons can we learn from what other communities have done here?
- Papers: Are there any published papers or great posts that discuss this? If you have
  some relevant papers to refer to, this can serve as a more detailed theoretical
  background.

This section is intended to encourage you as an author to think about the lessons from
other solutions, provide readers of your RFC with a fuller picture. If there is no prior
art, that is fine - your ideas are interesting to us whether they are brand new or if it
is an adaptation from other languages.

Note that while precedent set by other technologies is some motivation, it does not on its
own motivate an RFC. Please also take into consideration that the Block Protocol sometimes
intentionally diverges from other approaches.

# Unresolved questions

[unresolved-questions]: #unresolved-questions

- What parts of the design do you expect to resolve through the RFC process before this
  gets merged?
- What parts of the design do you expect to resolve through the implementation of this
  feature before stabilization?
- What related issues do you consider out of scope for this RFC that could be addressed in
  the future independently of the solution that comes out of this RFC?

# Future possibilities

[future-possibilities]: #future-possibilities

Think about what the natural extension and evolution of your proposal would be and how it
would affect the project and ecosystem as a whole in a holistic way. Try to use this
section as a tool to more fully consider all possible interactions with the project and
ecosystem in your proposal. Also consider how this all fits into the roadmap for the
project and of the relevant sub-team.

This is also a good place to "dump ideas", if they are out of scope for the RFC you are
writing but otherwise related.

If you have tried and cannot think of any future possibilities, you may simply state that
you cannot think of anything.

Note that having something written down in the future-possibilities section is not a
reason to accept the current or a future RFC; such notes should be in the section on
motivation or rationale in this or subsequent RFCs. The section merely provides additional
information.
