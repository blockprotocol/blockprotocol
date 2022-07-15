- Feature Name: extending-types
- Start Date: 2022-07-11
- RFC PR: [blockprotocol/blockprotocol#428](https://github.com/blockprotocol/blockprotocol/pull/428)
- Block Protocol Discussion: [blockprotocol/blockprotocol#0000](https://github.com/blockprotocol/blockprotocol/discussions/0000)

# Summary

[summary]: #summary

As a follow-up to the [Graph type system RFC](./0352-graph-type-system.md), this RFC will describe the behavior of which types in the type system can be extended and duplicated to enhance reusability while giving more control to users (both block authors and users of embedding applications).

# Motivation

[motivation]: #motivation

Reusing public types in the type system comes with the potential disadvantage of not fully conforming to a user's intention. If a user is interested in a public type but needs certain properties to make the type usable for their use case, they would have to recreate the type themself in the current system.

Allowing for types to be extended in the Block Protocol means that a user could still make use of public types when they want to define types for their domain.

This RFC introduces a way for types to be extended in a way where the reusability and sharing aspects of the Block Protocol are maintained

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

Type extension can be seen as the concept of adding properties to an existing entity type `Type` by creating a new type `SubType` that has a specific relation to `Type`.
Using `SubType` in place of `Type` must be possible when extending a type, which means that existing properties and links may not be modified.

For example, an `Employee` entity type can be an extended version of `Person`. This `Employee` type could contain domain-specific properties, making it more concrete while keeping compatibility with `Person`.

If the `Person` entity type contains required properties `Name` and `Age`, the `Employee` entity type would inherit these properties and perhaps add a `Occupation` property. `Employee` would _not_ be able to overwrite any of the properties given by `Person` e.g. it's not possible to turn `Name` into an array or make it optional. This restriction is important as disabling overwriting enables `Employee` instances to be valid `Person` instances i.e. compatibility with `Person` is kept.

The immediate problems that arise from this definition:

- How do we ensure that `Employee` instances can, in fact, be used in place of `Person` entities in practice?
- Do multiple super-types impose constraints on extending types?
- How does having `additionalProperties` in existing schemas influence extended types?
- How do we define extended types within the BP Type System?

## Subtyping

Compatibility between extended types is the ability to use the subtype in place of a supertype. [Prior art](https://en.wikipedia.org/wiki/Subtyping#Coercions) calls this `coercive subtyping` when it can happen implicitly.
_Composition_ rather than inheritance allows us to have more guarantees about the relationship between subtypes and supertypes. If a subtype never modifies a supertype's inherited properties, we are sure that the supertype properties are left untouched, which eliminates the need for evaluating compatibility (i.e. no need for [`subsumption`](https://en.wikipedia.org/wiki/Subtyping#Subsumption), the concept of finding out whether or not a supertype is a supertype of a subtype or not).

For example, an `Employee` instance looks as follows (simplified):

```json
{
  "name": "Charles",
  "age": 35,
  "occupation": "Merchant"
}
```

And the properties would have the following relation to `Employee`:

```
      name◄┐ (supertype)    (subtype)
           ├───Person───────Employee
       age◄┘                │
                            │
occupation◄─────────────────┘
```

We can visually see how selecting `Person` in the type hierarchy would provide `name` and `age` properties but exclude the `occupation` property.
Assuming that we are able to project/select the properties of a type that are defined through the supertype, coercive subtyping is attainable for any subtype. This is a somewhat strong assumption to make, but it unlocks expressing how to extend types.

## Multiple supertypes

A type must allow extending multiple super-types if and only if the supertypes can coexist. For supertypes to be able to coexist, their properties should either be disjoint, or overlap in a compatible manner.

**An example of _disjoint_ properties**:

- Supertype `Person` contains required properties `Name` and `Age`
- Supertype `Superhero` contains the property `Superpower`

In this example, there is no overlap between properties, so an `Employee` type could have `Person` and `Superhero` as supertypes

```
              (supertypes)
superpower◄────Superhero──┐
                          │
      name◄┐              │
           ├───Person─────Employee (subtype)
       age◄┘              │
                          │
occupation◄───────────────┘
```

**An example of _compatible_, overlapping properties**:

- Supertype `Person` contains the required properties `Name` and `Age`
- Supertype `Superhero` contains the required properties `Superpower` and `Name`

In this example, `Name` overlaps as a required property in both supertypes.

```
              (supertypes)
superpower◄────Superhero──┐
               │          │
      name◄────┤          │
               │          │
       age◄────Person─────Employee (subtype)
                          │
occupation◄───────────────┘


```

**An example of _incompatible_, overlapping properties**:

- Supertype `Person` contains the required properties `Name` and `Age`
- Supertype `Superhero` contains the required property `Superpower` and an array of `Name`s

In this example, the array of `Name`s on the `Superhero` type would not be compatible with the required `Name` property of `Person`, which means that the two types cannot be supertypes together.

## Additional properties on types

In the proposed [Versioning RFC](./0408-versioning-types.md) for the type system, having `{ "additionalProperties": false }` for all schemas is an assumption made for determining type compatibility, which means that any supertype will not validate against a subtype that adds properties if it receives all properties of a subtype instance. For example, if we supply the `Employee` instance from above to a `Person`, it will receive properties that are considered `additionalProperties` (the `Occupation` property is not present on `Person`).

The assumption that we can select/project parts of a subtype that make up a supertype is essential for keeping strictness in JSON Schemas, but breaks when validating `{ "additionalProperties": false }` for subtypes.

Unfortunately, specifying `{ "unevaluatedProperties": false }` does not behave as expected when composing types together in JSON Schema either, which means we will have to redefine how `{ "additionalProperties": true }` or `{ "unevaluatedProperties": false }` behaves within our type extension system to make supertypes keep strictness while allowing composition.

Concrete examples of how JSON Schema breaks with these validation constraints are shown in the [Reference-level explanation](#additional-properties-on-types-1)

## Defining extended types

Extended types will be defined with conventional JSON Schema syntax, the `allOf` keyword. When creating a new entity type it's possible to extend another entity type by adding an entry to `allOf` value with a versioned URI reference.
Using a versioned URI makes it so that subtypes aren't automatically updated when the supertype is.

As extended types can extend other extended types, we must also make sure that there are no cycles within the type hierarchy, as it could lead to hard to reason about types and unpredictability.

---

Explain the proposal as if it was already included in the protocol and you were teaching it to another Block Protocol implementer. That generally means:

- Introducing new named concepts.
- Explaining the feature largely in terms of examples.
- Explaining how Block Protocol implementors and users should _think_ about the feature, and how it should impact the way they use the protocol. It should explain the impact as concretely as possible.
- If applicable, provide sample error messages, deprecation warnings, or migration guidance.
- If applicable, describe the differences between teaching this to existing and new Block Protocol users.

For implementation-oriented RFCs, this section should focus on how Block Protocol implementors should think about the change, and give examples of its concrete impact. For policy RFCs, this section should provide an example-driven introduction to the policy, and explain its impact in concrete terms.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

## Additional properties on types

JSON Schema validation breaks when introducing `{ "additionalProperties": false }` or `{ "unevaluatedProperties": false }` in schema composition.

When composing schemas that all contain `{ "additionalProperties": false }`, each schema will disallow any other properties which they do not define:

```json
{
  "allOf": [
    {
      "type": "object",
      "properties": {
        "city": { "type": "string" }
      },
      "required": ["city"],
      "additionalProperties": false
    }
  ],
  "type": "object",
  "properties": {
    "type": { "name": "string" }
  },
  "additionalProperties": false
}
```

Here trying to validate against

```json
{
  "city": "Copenhagen",
  "name": "Charles"
}
```

results in validation errors such as `Property 'type' has not been defined and the schema does not allow additional properties`.

Changing from `additionalProperties` to `unevaluatedProperties` results in errors `Property 'type' has not been successfully evaluated and the schema does not allow unevaluated properties`.

Both of these solutions for strict schemas would not be suitable for the type of expressiveness we want for type extension, unfortunately.

## Defining extended types

In the BP, we will allow type extension through the `allOf` JSON Schema keyword. This keyword specifies an array of schemas that will have to validate together.

We'll add the following fields to the existing Entity Type meta schema definition:

```json
{
  "$id": "https://blockprotocol.org/type-system/0.2/schema/meta/entity-type",
  "type": "object",
  ...,
  "properties": {
    ...,
    "allOf": {
      "type": "array",
      "items": {
      "type": "object",
      "properties": {
        "$ref": {
          "$comment": "Valid references to existing Entity Types",
          "type": "string",
          "format": "uri"
        },
        "additionalProperties": false
      }
    }
    }

  }
}
```

### A concrete example of extended types

**An example of _disjoint_ properties**:

Given a _supertype_ `Person`:

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/1",
  "type": "object",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/age": {
      "$ref": "https://blockprotocol.org/@alice/property-type/age/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name",
    "https://blockprotocol.org/@alice/property-type/age"
  ]
}
```

and a _subtype_ `Employee`:

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/1" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/occupation": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/occupation"]
}
```

The two types do not share any properties, which establishes compatibility. It is possible to coerce an instance of `Employee` into an instance of `Person` as the properties compose and are compatible.
For example, we may have the following `Employee` instance:

```json
{
  "entityId": 111,
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": "Charles",
    "https://blockprotocol.org/@alice/property-type/age": 35,
    "https://blockprotocol.org/@alice/property-type/occupation": "Merchant"
  }
}
```

which can be coerced into the following `Person` instance:

```json
{
  "entityId": 111,
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": "Charles",
    "https://blockprotocol.org/@alice/property-type/age": 35
  }
}
```

Notice how we are keeping the same `entityId` for this entity instance, but simply coercing the entity instance by selecting the fields of interest for the given type.

**An example of _compatible_, overlapping properties**:

Given a _supertype_ `Person`:

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/2",
  "type": "object",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/age": {
      "$ref": "https://blockprotocol.org/@alice/property-type/age/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name",
    "https://blockprotocol.org/@alice/property-type/age"
  ]
}
```

and a _subtype_ `Employee`:

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/2",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/2" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/occupation": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name",
    "https://blockprotocol.org/@alice/property-type/occupation"
  ]
}
```

The two types do share the `name` property, but the property definitions are compatible (even using the same version). It's possible to coerce an instance of `Employee` into an instance of `Person` as the properties compose and are compatible.
For example, we may have the following `Employee` instance:

```json
{
  "entityId": 112,
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": "Charles",
    "https://blockprotocol.org/@alice/property-type/age": 35,
    "https://blockprotocol.org/@alice/property-type/occupation": "Merchant"
  }
}
```

which can be coerced into the following `Person` instance:

```json
{
  "entityId": 112,
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": "Charles",
    "https://blockprotocol.org/@alice/property-type/age": 35
  }
}
```

---

This is the technical portion of the RFC. Explain the design in sufficient detail that:

- Its interaction with other features is clear.
- It is reasonably clear how the feature would be implemented.
- Corner cases are dissected by example.

The section should return to the examples given in the previous section, and explain more fully how the detailed proposal makes those examples work.

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

- For implementation proposals: Does this feature exist in other technologies, and what experience have their community had?
- For community proposals: Is this done by some other community and what were their experiences with it?
- For other teams: What lessons can we learn from what other communities have done here?
- Papers: Are there any published papers or great posts that discuss this? If you have some relevant papers to refer to, this can serve as a more detailed theoretical background.

This section is intended to encourage you as an author to think about the lessons from other solutions, provide readers of your RFC with a fuller picture. If there is no prior art, that is fine - your ideas are interesting to us whether they are brand new or if it is an adaptation from other languages.

Note that while precedent set by other technologies is some motivation, it does not on its own motivate an RFC. Please also take into consideration that the Block Protocol sometimes intentionally diverges from other approaches.

# Unresolved questions

[unresolved-questions]: #unresolved-questions

- Given we made the assumption that we are able to project/select fields of a supertype from a subtype instance, we haven't specified how this is possible. It is an open quesiton how we actually pick out the exact fields of a subtype to provide a valid supertype instance.

---

- What parts of the design do you expect to resolve through the RFC process before this gets merged?
- What parts of the design do you expect to resolve through the implementation of this feature before stabilization?
- What related issues do you consider out of scope for this RFC that could be addressed in the future independently of the solution that comes out of this RFC?

# Future possibilities

[future-possibilities]: #future-possibilities

Think about what the natural extension and evolution of your proposal would be and how it would affect the project and ecosystem as a whole in a holistic way. Try to use this section as a tool to more fully consider all possible interactions with the project and ecosystem in your proposal. Also consider how this all fits into the roadmap for the project and of the relevant sub-team.

This is also a good place to "dump ideas", if they are out of scope for the RFC you are writing but otherwise related.

If you have tried and cannot think of any future possibilities, you may simply state that you cannot think of anything.

Note that having something written down in the future-possibilities section is not a reason to accept the current or a future RFC; such notes should be in the section on motivation or rationale in this or subsequent RFCs. The section merely provides additional information.
