- Feature Name: graph-non-primitive-data-types
- Start Date: 2022-06-14
- RFC PR: [blockprotocol/blockprotocol#355](https://github.com/blockprotocol/blockprotocol/pull/355)
- Block Protocol Discussion: [blockprotocol/blockprotocol#0000](https://github.com/blockprotocol/blockprotocol/discussions/0000)

# Summary

[summary]: #summary

This RFC proposes how the set of six primitive data types introduced in a [Graph Type System RFC](https://github.com/blockprotocol/blockprotocol/pull/352) could be extended to allow for **non-primitive** data types.

It is a follow-up of the [Graph Type System RFC](https://github.com/blockprotocol/blockprotocol/pull/352) and assumes it has been fully accepted and adopted.

# Motivation

[motivation]: #motivation

<!-- Why are we doing this? What use cases does it support? What is the expected outcome? -->

The set of **primitive** data types (`Text`, `Number`, `Boolean`, `Null`, `Object`, `Empty List`) are sufficient to define the structure of any valid JSON value for property types in the existing type system.

However, in many situations it will be useful to further constrain the value-space of a data type using further **constraints**. These value-space constraints will help users model their domain more precisely, and allow for additional validation to be performed.

The value-space can be thought of as the set of all possible values that a data type can take. Constraints define rules that this value-space must be reduced by. For example, the value-space of the `Number` data type is the set of all possible numbers, but the value-space of a non-primitive data type `Positive Integer` is the set of all possible non-deciaml numbers greater than 0.

**Example 1:** defining an `age` property type

A user wants to model a person's `age` within the type system. Currently, they would have to use the `Number` primitive data type. However, this is too permissive, as the value-space of the `Number` primitive data type includes negative numbers and decimal numbers. Instead, the user can define or discover the `Positive Integer` non-primitive data type to capture allowed values of a person's age more accurately.

In theory these constraints could be defined in the property type, but this would inhibit these data type constraints from being re-usable. Since re-usability is a core design consideration behind the type system of the block protocol, it is important to allow for the definition of non-primitive data types.

The rationale for introducing **non-primitive** data type is therefore to allow for the type system to further constrain the value-space of its data types, in a re-usable manner.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

Non-primitive data types are data types which further constrain an exisiting data type (which can be either non-primitive or primitive).

In other words, non-primitive data types further restrict the _value space_ of an existing data type.

- **Constraining another Data Type** - Defining constraints on an existing Data Type restricts the value space to a subset of the existing one

  - Allowed constraints

> 💭 Do we want to list all of the allowed constraints in plain-english here? Somewhat similar to the work being done in ‣. Alternatively we really do view this section as a nice plain-english intro but to see the **full** list of constraints they have to read the technical description below
> if we don’t list them here then we should be explicit that the constraints available operate on the primitive top-level type (so using them on a different one wouldn’t make sense), although there are list constraints, and we can point that there aren’t constraints on Null or Object for example)

**Example 1**

`Positive Number` is a new Data Type which is also a `Number` Data Type with the additional constraint that the values are greater than 0

**Example 2**

`Cardinal Direction` is a new Data Type which is also a `Text` Data Type with the additional constraint that the value needs to be one of `[”North”, “East”, “South”, “West”]`

**Example 3**

`Alphanumeric` is a new Data Type which is also a `Text` Data Type with the additional constraint that values match the regular-expression **`/[A-Za-z0-9]/`**

- **Combining Data Types** - Data Types can be combined into “union” types which express an **or** relationship

  **Example 1**

  `Text or Number` is a Data Type where the value is _either_ an instance of the `Text` Data Type **or** an instance of the `Number` Data Type

- **Creating Collections of Data Types** - Data Types can also be lists of other Data Types
  **Example 1**
  `Number List` is a Data Type which is a list of instances of `Number` Data Types

As mentioned above, these mechanisms can be used together in a combination

**Example 1**

`Positive Number List or Text` is a Data Type where the values are _either_ a list of instances of the `Number` Data Type **or** an instance of the `Text` Data Type

> 💭 Note that all ways of creating _new_ Data Types involve using and further modifying at least one other Data Type. A nice consequence of this is that all Data Types are indirectly (or directly) related to top-level primitive Data Types.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

<!--

This is the technical portion of the RFC. Explain the design in sufficient detail that:

- Its interaction with other features is clear.
- It is reasonably clear how the feature would be implemented.
- Corner cases are dissected by example.

The section should return to the examples given in the previous section, and explain more fully how the detailed proposal makes those examples work.

-->

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

# Drawbacks

[drawbacks]: #drawbacks

<!-- Why should we _not_ do this? -->

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
