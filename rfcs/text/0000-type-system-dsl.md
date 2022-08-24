- Feature Name: type-system-dsl
- Start Date: 2022-08-24
- RFC
  PR: [blockprotocol/blockprotocol#0000](https://github.com/blockprotocol/blockprotocol/pull/0000)
- Block Protocol
  Discussion: [blockprotocol/blockprotocol#0000](https://github.com/blockprotocol/blockprotocol/discussions/0000)

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

### `data` Declaration

CURRENTLY UNDEFINED

### `prop` Declaration

```
[doc comment]
[attributes]
prop [id] [title] = [prop-type];
```

// TODO: into EBNF
```
[prop-type] = [reference]
[prop-type] = [object]
// TODO: single prop-type does not require `()`
[prop-type] = ([prop-type])[[range]?]
[prop-type] = [prop-type] | [prop-type]

[object] = {
    ([reference] | [reference][],)*
}

[range] = [int]?..[int]?
```

```abnf

```

### `link` Declaration

### `entity` Declaration

This is the technical portion of the RFC. Explain the design in sufficient detail that:

- Its interaction with other features is clear.
- It is reasonably clear how the feature would be implemented.
- Corner cases are dissected by example.

The section should return to the examples given in the previous section, and explain more
fully how the detailed proposal makes those examples work.

### Grammar

```bnf
{
    tokens = [
        space='regexp:\s+'
        comment="regexp://[^/].*?\n"
    ]
}

root ::= (entity-stmt | link-stmt | prop-stmt | import-stmt | set-stmt | use-stmt)*

doc-comment ::= "regexp://.*?\n"

ident ::= "regexp:[a-z][a-z-]*"
prefix ::= "*" | "#" | ">" | "~"
reference ::= prefix? (ident "/")? ident ("@" integer)

attribute ::= "#" "[" ident "=" (string | integer) "]"

// TODO
string ::= 'regexp:".*"'
integer ::= 'regexp:[0-9]+'
value ::= string

key-value ::= ident "=" value
key-value-block ::= "{" (key-value ",")* key-value "}"

use-with-stmt ::= "with" key-value-block
use-stmt ::= "use" string "as" ident use-with-stmt? ";"

set-stmt ::= "set" ident "=" value ";"

// string here should be either file, http or git
import-stmt ::= "import" string ";"

array ::= "[" (integer? ".." integer?)? "]"


// TODO: prop-value "(" ")" optional on array if single
prop-object ::= "{" ( (reference array? "?"? ",")* reference array? "?"? ","? )? "}"
prop-value ::= ((reference | prop-object) "|" prop-value) | reference | prop-object  | ("(" prop-value ")" array)
prop-stmt ::= doc-comment* attribute* "prop" ident string "=" prop-value ";"

link-stmt ::= doc-comment* attribute* "link" ident string ";"

entity-object ::= "{" ((entity-value array? "?"? ",")* entity-value array? "?"? ","?)? "}"
entity-value ::= ((reference | entity-object) array? "?"?) | (("->" | "~>") reference array? "?"?)
entity-stmt ::= doc-comment* attribute* "entity" ident string "=" entity-object ";"
```

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

prop favorite-quote "Favorite Quote" = #blockprotocol/text@1;

prop user-id "User ID" = #blockprotocol/text@1 | #blockprotocol/number@1;

/// Contact Information
///
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
