---
Feature Name: "graph-non-primitive-data-types"
Start Date: 2022-06-14
First Published: Pending
RFC PR: https://github.com/blockprotocol/blockprotocol/pull/355
RFC Discussion: Pending
---

# Summary

[summary]: #summary

This RFC proposes how the set of six primitive data types introduced in a [Graph Type System RFC](https://github.com/blockprotocol/blockprotocol/pull/352) could be extended to allow for **non-primitive** data types.

It is a follow-up of the [Graph Type System RFC](https://github.com/blockprotocol/blockprotocol/pull/352) and assumes it has been fully accepted and adopted.

# Motivation

[motivation]: #motivation

<!-- Why are we doing this? What use cases does it support? What is the expected outcome? -->

The set of **primitive** data types (`Text`, `Number`, `Boolean`, `Null`, `Object`, `Empty List`) are sufficient to define the structure of any valid JSON value for property types in the existing type system.

However, in many situations it will be useful to further constrain the value-space of a data type using further **constraints**. These value-space constraints will help users model their domain more precisely, and allow for additional validation to be performed.

The value-space can be thought of as the set of all possible values that a data type can take. Constraints define rules that this value-space must be reduced by. For example, the value-space of the `Number` data type is the set of all possible numbers, but the value-space of a non-primitive data type `Positive Integer` is the set of all possible non-decimal numbers greater than 0.

For example, a user wants to model a person's `age` as a property type within the type system. Currently, they would have to use the `Number` primitive data type. However, this is too permissive, as the value-space of the `Number` primitive data type includes negative numbers and decimal numbers. Instead, the user can define or discover the `Positive Integer` non-primitive data type to capture allowed values of a person's age more accurately.

In theory these constraints could be defined in the property type, but this would inhibit these data type constraints from being reusable. Since re-usability is a core design consideration behind the type system of the block protocol, it is important to allow for the definition of non-primitive data types.

Ideally, data types and their constraints should be **composable**, so that a non-primitive data type can be defined as a combination of other data types. This will allow for expressing more complex data types, and enable the reuse of constraints across data types. Data types composition will allow users to _reduce_ and _expand_ value-spaces.

For example, a user wants to model `color` as a property type within the type system. They want to represent a triple of numbers from 0 - 255. This is not possible in the current type system, but with composable non-primitive data types with constraints, it would be possible to define a `RGB Color` data type that consists of a list of three `Positive Integer` data types that are constrained to be between 0 and 255. `color` could make use of `RGB Color` to obtain the semantics the user seeks.

The rationale for introducing **non-primitive** data type is therefore to allow for the type system to further constrain the value-space of its data types, in a reusable manner and allow for flexibility of defining more complex data types.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

Non-primitive data types are data types that further constrain or extend an existing data type (which can be either non-primitive or primitive). In other words, non-primitive data types further reduce or expand the _value space_ of existing data types.

JSON Schema allows for various constraints to be defined on schemas, and they can be combined in a variety of ways. When multiple constraints are defined in a JSON Schema, validators will try to apply each one even if they define unsatisfiable types. The Block Protocol type system will allow for the definition of non-primitive data types by combining these constraints in a similar way.

To provide a way for these constraints to be composable and re-usable, the Block Protocol type system will allow for data types to _inherit_ from other data types. This will allow for data type constraints to be reusable and composable among non-primitive data types. This inheritance will lean on how the `allOf` keyword works in JSON Schema. All data types referenced in the `allOf` array of a data type schema will provide value-space constraints to the inheritor.

A second kind of composability of data types will also be possible by allowing data types to be defined as choices between data types. Conceptually this is similar to JSON Schema's `oneOf` keyword where a schema can take on the shape of _one of_ a list of schemas. This composability, instead of constraining the value-space, will allow data types to expand their value-space.

Lastly, we will allow for data types to compose through the use of lists. This means that data types can be of `{ type: "array" }` and use the `items` keyword to define their value-space(s).

In the next sections we will explore what kind of constraints we will allow and what the three kinds of composition could look like.

## Constraints

The constraints we will be supporting for non-primitive data types are a subset of the constraints that JSON Schema supports. The constraints can be roughly grouped by the value(s) they operate on.

### For all data types

- `enum`: a list of values that the data type can take
- `const`: a single value that the data type can take

### Text (primitive data type)

- `minLength`: a number that defines the minimum length of the text value
- `maxLength`: a number that defines the maximum length of the text value
- `regex`: a regular expression that the text value must match

### Number (primitive data type)

- `minimum`: a number that defines the minimum value of the number value (`x >= minimum`)
- `exclusiveMinimum`: a number that defines the minimum value of the number value excluding the value itself (`x > minimum`)
- `maximum`: a number that defines the maximum value of the number value (`x <= maximum`)
- `exclusiveMaximum`: a number that defines the maximum value of the number value excluding the value itself (`x < maximum`)
- `multipleOf`: a number that defines the value that the number value must be a multiple of (`x % multipleOf == 0`)

### List (composition)

- `minItems`: a number that defines the minimum number of items in the list value
- `maxItems`: a number that defines the maximum number of items in the list value

### Using the constraints

When using constraints, we still rely on existing data types to add constraints to. Constraining is equivalent to restricting some data type's original value-space.

**Example 1**

`Positive Integer` is a new data type which is also a `Number` data type where the constraint `minimum` is set to `0` and `multipleOf` is set to `1`.

Valid values include: `0`, `1`, `2`, and so forth.

**Example 2**

`Cardinal Direction` is a new data type which is also a `Text` data type where the constraint `enum` is set to `["North", "East", "South", "West"]`

Valid values are only: `"North"`, `"East"`, `"South"`, `"West"`.

**Example 3**

`Alphanumeric` is a new data type which is also a `Text` data type with the additional constraint that values match the regular expression **`/[A-Za-z0-9]/`**

Valid values include: `"a"`, `"b"`, `"c"`, `"1"`, `"2"`, `"3"`, and so forth.

## Composition

With the constraints defined above, we can define how non-primitive data types can expand their value spaces using composition.

> 💭 Note that all ways of creating _new_ data types involve using and further modifying at least one other data type. A nice consequence of this is that all data types are indirectly (or directly) related to top-level primitive data types.

### Uniting value-spaces

This kind of composition allows data types to be combined into "union" types which express an **or** relationship. Conceptually the value-spaces of the unioned data types are combined into a single value-space.

**Example 1**

`Text or Number` is a data type where the value is _either_ an instance of the `Text` data type **or** an instance of the `Number` data type.

Valid values include: `"Hello"`, `-1`, `0.5`, `2`, and so forth.

**Example 2**

`Positive Integer or Object` is a data type where the value is _either_ an instance of the `Positive Integer` data type **or** an instance of the `Object` data type.

Valid values include: `0`, `1`, `2`, `{ "foo": "bar" }`, and so forth.

### Collection of value-spaces

This type of composition allows for data types to represent a collection of values. Conceptually the value-space of the data type is a list of values, where each value is an instance of one of the data types in the list.

**Example 1**
`Number List` is a list data type with the `Number` data types' value-space.

Valid values include: `[]`, `[1]`, `[1, 2]`, `[1, 2, 3]`, and so forth.

### Constraining and composing

It is possible to apply these features of non-primitive data types in combination with each other to allow for the creation of more complex data types.

**Example 1**

`Positive Integer List or Text` is a data type where the values are _either_ a list of instances of the `Number` data type **or** an instance of the `Text` data type

Valid values include: `[]`, `[1, 2]`, `[1, 2, 3]`, `"Hello"`, and so forth.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

> To be written.

<!--

This is the technical portion of the RFC. Explain the design in sufficient detail that:

- Its interaction with other features is clear.
- It is reasonably clear how the feature would be implemented.
- Corner cases are dissected by example.

The section should return to the examples given in the previous section, and explain more fully how the detailed proposal makes those examples work.

-->

<!--
This section is not yet complete.

Incomplete text snippet

The existing primitive data types are expressed as JSON-Schemas.

```json
{
  "kind": "dataType",
  "$id": "https://blockprotocol.org/types/@blockprotocol/data-type/text",
  "title": "Text",
  "description": "An ordered sequence of characters",
  "type": "string"
}
```

```json
{
  "kind": "dataType",
  "$id": "http://.../data-type/PositiveNumber",
  "allOf": [{ "$ref": "http://.../data-type/Number" }],
  "exclusiveMinimum": 0
}
```
-->

# Drawbacks

[drawbacks]: #drawbacks

<!-- Why should we _not_ do this? -->

Adding constraints and composition to data types will increase their complexity a fair amount. The addition of user-created, non-primitive data types implies that:

- Non-primitive data types can capture some semantic meaning that primitive data types do not have/provide a way to describe.
- Constraints require embedding applications to understand the value-spaces provided by the primitive data types and require that data type validations are implemented in the embedding application.
- Composition of data types adds an extra layer of indirection when validating entities as data types have to be expanded before applying validation rules.
- Some validations may be computationally expensive to perform, such as regular expression matching on text.
- Composed constraints could create non-satisfiable data types, such as a `Natural Number` data type with a `maximum` constraint set to `0` and a `minimum` constraint set to `1`.

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

<!--

- Why is this design the best in the space of possible designs?
- What other designs have been considered and what is the rationale for not choosing them?
- What is the impact of not doing this?

-->

# Prior art

[prior-art]: #prior-art

<!--

Discuss prior art, both the good and the bad, in relation to this proposal.
A few examples of what this can include are:

- For implementation proposals: Does this feature exist in other technologies, and what experience have their community had?
- For community proposals: Is this done by some other community and what were their experiences with it?
- For other teams: What lessons can we learn from what other communities have done here?
- Papers: Are there any published papers or great posts that discuss this? If you have some relevant papers to refer to, this can serve as a more detailed theoretical background.

This section is intended to encourage you as an author to think about the lessons from other solutions, provide readers of your RFC with a fuller picture. If there is no prior art, that is fine - your ideas are interesting to us whether they are brand new or if it is an adaptation from other languages.

Note that while precedent set by other technologies is some motivation, it does not on its own motivate an RFC. Please also take into consideration that the Block Protocol sometimes intentionally diverges from other approaches.

-->

Most of the contents in this RFC are directly defined in the JSON Schema specification. The data type constraints are analogous to those defined for the [JSON Schema types](https://json-schema.org/understanding-json-schema/reference/type.html). and composition is analogous to the [JSON Schema `allOf` keyword](https://json-schema.org/understanding-json-schema/reference/combining.html#allof).

That being said, we've adapted the validations to match our primitive data types - and omitted some of the constraints such as `format` for the `string`. Composition is also a bit different in that we don't allow all the JSON Schema composition keywords, but only `allOf`. This is to reduce the scope of implementation and to avoid introducing more new concepts than required.

In the semantic web domain, [SHACL](https://www.w3.org/TR/shacl/) is a popular way to define constraints on RDF graphs. SHACL is a W3C recommendation and is used in many semantic web applications. SHACL is a bit different from JSON Schema in that it is a language for defining constraints on RDF graphs and not blobs of JSON. Furthermore, SHACL is used to enhance semantic interoperability between RDF ontologies.

# Unresolved questions

[unresolved-questions]: #unresolved-questions

<!--

- What parts of the design do you expect to resolve through the RFC process before this gets merged?
- What parts of the design do you expect to resolve through the implementation of this feature before stabilization?
- What related issues do you consider out of scope for this RFC that could be addressed in the future independently of the solution that comes out of this RFC?

-->

# Future possibilities

[future-possibilities]: #future-possibilities

<!--

Think about what the natural extension and evolution of your proposal would be and how it would affect the project and ecosystem as a whole in a holistic way. Try to use this section as a tool to more fully consider all possible interactions with the project and ecosystem in your proposal. Also consider how this all fits into the roadmap for the project and of the relevant sub-team.

This is also a good place to "dump ideas", if they are out of scope for the RFC you are writing but otherwise related.

If you have tried and cannot think of any future possibilities, you may simply state that you cannot think of anything.

Note that having something written down in the future-possibilities section is not a reason to accept the current or a future RFC; such notes should be in the section on motivation or rationale in this or subsequent RFCs. The section merely provides additional information.

-->
