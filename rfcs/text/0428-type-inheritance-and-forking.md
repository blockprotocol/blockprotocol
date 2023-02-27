- Feature Name: type-inheritance-and-forking
- Start Date: 2022-07-11
- RFC PR: [blockprotocol/blockprotocol#428](https://github.com/blockprotocol/blockprotocol/pull/428)
- Block Protocol Discussion: [blockprotocol/blockprotocol#439](https://github.com/blockprotocol/blockprotocol/discussions/439)

# Summary

[summary]: #summary

As a follow-up to the [Graph type system RFC](./0352-graph-type-system.md), this RFC will describe the behavior of which types in the type system can be extended and duplicated to enhance reusability while giving more control to users (both block authors and users of embedding applications). Extending types can be considered the same as "type inheritance", but there are some important nuances that make these concepts different.

Type duplication allows for modifying a type completely without restrictions on how, at the expense of the guarantees that can be made for type extension. Duplication can be considered the same as "forking".

# Motivation

[motivation]: #motivation

Reusing public types in the type system comes with the potential disadvantage of not fully conforming to a user's intention. If a user is interested in a public type but needs certain additional properties to make the type usable for their use case, they would have to recreate the type themself in the current system.

The types in the type systems assume an implicit `{ "additionalProperties": false }` JSON Schema attribute that has implications for how the schemas can be composed together. The presence of this option will be addressed in this proposal.

Allowing entity types to be extended in the Block Protocol means that a user could still make use of public types when they want to define types for their domain. As an alternative to extending types, type duplication (or type forking) is a less compatible way to make use of existing public types, without a direct data mapping strategy.

This RFC introduces a way for types to be extended in a way where the reusability and sharing design philosophies of the Block Protocol are maintained, and a way for types to be duplicated for use cases where extending a type is insufficient.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

> ⭐ Usage of the word "types" in this RFC can be assumed to refer to _entity types_ unless stated otherwise.

Type extension can be seen as the concept of adding properties to an existing entity type `Type` by creating a new type `SubType` that has a specific relation to `Type`.
Using `SubType` in place of `Type` must be possible when extending a type, which means that existing properties and links may _not_ be modified. This property of extended types is an explicit design decision, as types are considered "reused" when they are extended, _not_ "modified". Extending types further empowers the idea of gradual convergence, as users can reuse publicly-available types they are not fully satisfied with.

For example, an `Employee` entity type could extend `Person`. This `Employee` type would then inherit the properties of `Person` as well as having _additional_ domain-specific properties, making it more concrete while keeping compatibility with `Person`.

If the `Person` entity type contains the required properties `name` and `age`, the `Employee` entity type would inherit these properties and could add other properties (e.g. an `occupation` property). `Employee` would _not_ be able to override any of the properties inherited from `Person` (e.g. it's not possible to turn `name` into an array or make it optional) to ensure that instances of `Employee` are also valid instances of `Person` (i.e. compatibility with `Person` is preserved).

Type duplication can be seen as a literal copy of an entity type's contents, providing full control over any properties present on the source entity type. If a user wants to use the `Employee` entity type from above, removing the `occupation` property and adding a `tenure` property in its place, it would have to be through duplication, as we are talking about overriding properties from `Employee` in a schema-breaking way.

Duplication can behave in different ways for extended types, such as acting on an "expanded" version of an extended type where the duplicated type would inherit all properties from the type hierarchy and be able to change any of them **or** duplication could act on only an immediate (sub)type, and reuse any extended type declarations. Alternatively, a hybrid version of the two ways to duplicate could be used where "expansion" could happen up to a certain part of the type hierarchy before reusing extended type declarations such that we empower partial consensus as outlined in the [Type System RFC](./0352-graph-type-system.md##convergence-and-divergence-of-consensus).

As a consequence of the above definition, these questions arise:

- How do we ensure that `Employee` instances can be used in place of `Person` instances in practice? (we refer to this as "subtyping")
- Do multiple supertypes impose constraints on extending types?
- How does having `additionalProperties` in existing schemas influence extended types?
- How should the Block Protocol type system support extending types?
- What type duplication strategy should the Block Protocol support?

## Subtyping

Compatibility between extended types is the ability to use the subtype in place of a supertype. [In academia](https://en.wikipedia.org/wiki/Subtyping#Coercions), this is `coercive subtyping` when it can happen implicitly.
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

```txt
      name◄┐ (supertype)    (subtype)
           ├───Person───────Employee
       age◄┘                │
                            │
occupation◄─────────────────┘
```

We can visually see how selecting `Person` in the type hierarchy would provide `name` and `age` properties but exclude the `occupation` property.
Assuming that we can project/select the properties of a type that are defined through the supertype, coercive subtyping is attainable for any subtype. This is a somewhat strong assumption to make, but it unlocks expressing how to extend types. The reason the selection/projection of properties is important for coercive subtyping will be explained in more detail in the coming sections, specifically in the [`additionalProperties` problem explanation section](#the-additionalproperties-problem).

While it was mentioned that we don't allow overriding properties, we do allow modifications to a certain extent. When properties are still _compatible_ (using the definition of compatible given in the [versioning RFC](./0408-versioning-types.md#determining-type-compatibility)), properties can be overridden. For example, if `Person` had an optional property `name`, `Employee` could override it to be a required property. This is because the property is still compatible, but it is now more specific. This is also the reason why we can't allow overriding properties to be arrays or objects, as that would make the property incompatible.

```txt
       age◄┐ (supertype)    (subtype)
           ├───Person───────Employee
      name◄┘                │
 [optional]                 │
                            │
      name◄─────────────────┘
 [required]
```

The same compatibility rules apply to other constraints, such as `minLength` and `maxLength`. If a supertype has a `minLength` of `1`, a subtype can override it to be `2`, but not `0`. The reason why this is still accepted is that JSON Schemas semantics would apply all rules given in the schema, so if a property is required, it must be present.

## Multiple supertypes

A type must allow extending multiple supertypes if and only if the supertypes can coexist. For supertypes to be able to coexist, their properties should either be disjoint, or overlap in a compatible manner.

**An example of _disjoint_ properties**:

- Supertype `Person` contains required properties `name` and `age`
- Supertype `Superhero` contains the property `superpower`

In this example, there is no overlap between properties, so an `Employee` type could have `Person` and `Superhero` as supertypes

```txt
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

- Supertype `Person` contains the required properties `name` and `age`
- Supertype `Superhero` contains the required properties `superpower` and `name`

In this example, `name` overlaps as a required property in both supertypes. Compatibility of overlapping properties is defined in the [versioning RFC's definition of "compatible"](./0408-versioning-types.md#determining-type-compatibility).

```txt
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

- Supertype `Person` contains the required properties `name` and `age`
- Supertype `Superhero` contains the required property `superpower` and an _array_ of `name`s

In this example, the array of `name`s on the `Superhero` type would not be compatible with the required `name` property of `Person`, which means that the two types cannot be supertypes together.

## The `additionalProperties` problem

In the proposed [Versioning RFC](./0408-versioning-types.md) for the type system, having `{ "additionalProperties": false }` for all schemas is an assumption made for determining type compatibility, which means that any supertype will not validate against a subtype that adds properties if it receives all properties of a subtype instance. For example, if we supply the `Employee` instance from above to a `Person`, it will receive properties that are considered `additionalProperties` (the `occupation` property is not present on `Person`).

The assumption that we can select/project parts of a subtype that make up a supertype is essential for keeping strictness in JSON Schemas.

We propose slight modifications to how `{ "additionalProperties": true }` and `{ "unevaluatedProperties": false }` behave and may be used within our type extension system to let supertypes keep strictness while allowing composition. This modification is a semantic change and does not change any syntax.

Concrete examples of how JSON Schema breaks with these validation constraints are shown in the [Reference-level explanation](#problems-with-unevaluatedproperties).

## Defining extended entity types

Extended types will be defined with conventional JSON Schema syntax: the `allOf` keyword. An entity type can extend another entity type by adding a versioned URL reference to the root-level `allOf` array.
A [versioned URL](https://github.com/blockprotocol/blockprotocol/blob/main/rfcs/text/0408-versioning-types.md#type-uris) is used so that subtypes aren't automatically updated (and potentially invalidated) when the supertype is updated.

As extended types can extend other extended types we must also make sure that there are no cycles within the type hierarchy, as it makes types difficult to resolve/reason about and could lead to unpredictable behavior.

## Defining entity type duplication

When looking for public types, if extending an entity type is insufficient, an alternative is to duplicate the type so that individual properties can be removed or overridden. Duplicated types become new complete, standalone types.

Type duplication, unlike extended types, does not imply that instances of the original type can be substituted by instances of the duplicated type because the types may be incompatible. A mapping may be used to persist some of the compatibility, but mapping is yet to be defined within the type system.

### Duplication strategy

As outlined in the beginning, duplication can take place in many different ways for entity types. Since entity types can extend other entity types in this proposal, duplication can happen at different conceptual locations. As an example, if a user wanted to redefine an `Employee` that has the following type hierarchy:

```txt
name◄─────Being───┐
                  │
          age◄────Person─────Employee
                             │
   occupation◄───────────────┘
```

where `Employee` is a subtype of `Person` which in turn is a subtype of `Being`. The three properties `name`, `age` and `occupation` would be present on `Employee` and considered all expanded properties for `Employee`.
The user wants to change the `age` property to a `tenure` property through duplication. They would have to create a new subtype of `Being` with the desired changes:

```txt
name◄─────Being───┐
                  │
       tenure◄────MyEmployee
                  │
   occupation◄────┘
```

From the perspective of the user duplicating a type, the `Person` and `Employee` entity types were squashed together or "expanded" for duplication to have the desired effect. The `Being` supertype relation is still kept when changing a property on the `MyEmployee` duplicated type. But in this process, the `MyEmployee` entity type loses the ability to trivially be treated as a `Person`, as there is no subtyping relation with `Person` on the new `MyEmployee` duplicated type.

The duplication happened on the expanded type resulting in combining/expanding `Person` and `Employee`, but it would also have been possible to expand the entire type, getting rid of `Being`. This would have resulted in the following type hierarchy:

```txt
      name◄────┐
               │
    tenure◄────MyEmployee
               │
occupation◄────┘
```

And like the previous example, the `MyEmployee` type would not be a subtype of `Person` anymore. It also wouldn't be a subtype of `Being` either - the reusability of the types is lost in this case. Ideally, type duplication would be able to preserve as many supertype relations as possible.

## Addressing previous considerations

In the [Type System RFC](./0352-graph-type-system.md#interfacing-with-types-1) the following statement was made:

> The update messages of both the current and new systems make use of partial schemas, merging the schema given in the message contents with the existing Entity Type. This may or may not be the desired semantics of updating, and could lead to undesired behavior. In that case, the semantics can be changed to treat updates as a complete replacement. This is to be decided and can be considered out of scope for this RFC as it touches on inheritance/forking concepts.

As the new Block Protocol type system doesn't require a delta-based storage approach for its schemas, it's unclear what the advantages of partial schemas for update requests are. We propose that we should treat type updates as complete replacements, so implementation is much more straightforward for embedding applications. Partial schema updates also add some level of indirection, and that may obfuscate error sources and error reasons. Therefore, updates to types must be complete replacements rather than partial schema updates.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

## Defining extended entity types

In the Block Protocol, we will allow type extension through the `allOf` JSON Schema keyword which specifies an array of schemas that will have to validate together.

We'll add the following fields to the existing Entity Type meta schema definition:

```json
{
  "$id": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
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
            "$comment": "Valid reference to an existing Entity Type version",
            "$ref": "$ref": "https://blockprotocol.org/types/modules/graph/0.3/schema/versioned-url"
          },
          "additionalProperties": false
        }
      }
    }
  }
}
```

### Concrete examples of extended entity types

**An example of _disjoint_ properties**:

Given a _supertype_ `Person`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
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
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
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

Notice how we are keeping the same `entityId` for this entity instance, but simply coercing the entity instance by selecting the properties of interest for the given type.

**An example of _compatible_, overlapping properties**:

Given a _supertype_ `Person`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
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
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
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

The two types do share the `name` property, but the property definitions are compatible (even using the same version). It's possible to coerce an instance of `Employee` into an instance of `Person` as the properties compose and are compatible. Checking compatibility is described in the [Reference-level explanation](#multiple-supertypes---checking-compatibility).
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

**Another example of _compatible_, overlapping properties**:

Given a _supertype_ `Person`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/3",
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
  "required": ["https://blockprotocol.org/@alice/property-type/age"]
}
```

and a _subtype_ `Employee`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/3",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/3" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/name"]
}
```

In this example, `Person` has an optional `name` property and `Employee` defines `name` as required. These are still compatible as it's possible to coerce an instance of `Employee` into an instance of `Person` as the properties compose and are compatible.

### Problems with `unevaluatedProperties`

`unevaluatedProperties` _almost_ provides the functionality we're after, but unfortunately it just barely misses. If supertypes themselves specify `{ "unevaluatedProperties": false }`, they are not able to be part of an `allOf` validator, as they will error out as soon as they see properties that are not part of the supertype itself.

When composing schemas that all contain `{ "unevaluatedProperties": false }`, each schema will disallow any other properties which they do not define. Using the following JSON Schema as an example:

```json
{
  "allOf": [
    {
      "type": "object",
      "properties": {
        "city": { "type": "string" }
      },
      "required": ["city"],
      "unevaluatedProperties": false
    }
  ],
  "type": "object",
  "properties": {
    "type": { "name": "string" }
  },
  "unevaluatedProperties": false
}
```

and trying to validate against

```json
{
  "city": "Copenhagen",
  "name": "Charles"
}
```

results in validations errors such as `Property 'name' has not been successfully evaluated and the schema does not allow unevaluated properties`.

Changing from `unevaluatedProperties` to `additionalProperties` results in errors `Property 'name' has not been defined and the schema does not allow additional properties`.

Both of these solutions for strict schemas would not be suitable for the type of expressiveness we want for type extension, unfortunately.

The required behavior is that `unevaluatedProperties` should only validate at the top level of a type, allowing supertypes to validate `unevaluatedProperties` but defer checking if they're used within in subtype.

### Redefining `unevaluatedProperties`

We're already implicitly defining `{ "additionalProperties": false }` in the [versioning RFC](./0408-versioning-types.md#determining-type-compatibility) for all schemas, this RFC will piggyback on that, and change the existing, implicit `additionalProperties` usage to `unevaluatedProperties` and slightly change its [vocabulary definition](https://json-schema.org/draft/2020-12/json-schema-core.html#name-unevaluatedproperties).

The vocabulary change is that the `unevaluatedProperties` keyword will only be applicable at top-level schemas (i.e. subtypes or schemas that don't specify `allOf`), and ignored when present on a schema that resides in the `allOf` array. Instead of the default value being `{ "unevaluatedProperties": {} }`, the default value will be `{ "unevaluatedProperties": false }`. Together this makes it so that all supertypes will be able to compose, as their individual, implicit `unevaluatedProperties` values won't have any effect on validation and defer evaluation to the extending type (the subtype).

Concretely, this means that for a free-standing type that doesn't extend any other type such as this `Person` type:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
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

would implicitly have `{ "unevaluatedProperties": false }` set. In the case of the `Employee` type:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
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

the resolved schema residing at `{ "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/2" }` would _not_ have `{ "unevaluatedProperties": false }` set, whereas the top-level entity type itself would have `{ "unevaluatedProperties": false }` set.

### Liskov substitution principle

Subtypes in the system can be used in place of the supertypes that they extend, similarly to what is expected in the Liskov substitution principle. Although our entity types do not contain behavior, the semantic meaning of individual properties on an entity type is captured on the property type definitions they refer to, which enables the ability to use the subtype in place of its supertype(s) "without altering any of the desirable properties of that program" [[source](https://en.wikipedia.org/wiki/Liskov_substitution_principle#Principle)].

## Defining entity type duplication

The Block Protocol meta schemas don't need to change to support type duplication as we're copying types and giving them a new identifier.

When duplicating a type, the new type will have an entirely different URL and potentially a new `title`. The new type can be modified without any restrictions.

As outlined in the [Guide-level explanation](#duplication-strategy), there may be different locations where type duplication can take effect. To maximize reusability, embedding applications should maximize supertype reuse and only duplicate parts of type hierarchies that are necessary to resolve property changes.

### Examples of type duplications

Given a _supertype_ `Person`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
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
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/2" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/occupation": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/occupation"]
}
```

a user, Bob, wishes to use Alice's `Employee` entity type but must change the `occupation` property, turning it into a `tenure` property such that it suits their use case. Bob can duplicate the `Employee` type, and make the change as follows:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@bob/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/2" }
  ],
  "properties": {
    "https://blockprotocol.org/@bob/property-type/tenure": {
      "$ref": "https://blockprotocol.org/@bob/property-type/tenure/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@bob/property-type/tenure"]
}
```

Bob can make a change to `Employee` (removing `occupation`) such that it is no longer compatible with Alice's `Employee` through type duplication. The new, duplicated `Employee` type still extends `Person` from the original type, allowing either `Employee` type to be used in place of (substituted with) the `Person` type.

If a user wants to duplicate `Employee` but update a property present on `Person`, the entity type they're modifying acts like an entity type with all properties expanded. It is no longer possible for the user to subtype `Person` and instead they are creating a completely new type with no given `allOf` entries.

The original, conceptually expanded `Employee` entity type:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/age": {
      "$ref": "https://blockprotocol.org/@alice/property-type/age/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/occupation": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name",
    "https://blockprotocol.org/@alice/property-type/age",
    "https://blockprotocol.org/@alice/property-type/occupation"
  ]
}
```

This expanded entity is equivalent to the original `Employee` entity type, but without any extended type declaration. If Bob wanted to change the `age` property to `tenure`, that would be possible by duplicating this intermediate representation of `Employee` as follows:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@bob/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@bob/property-type/tenure": {
      "$ref": "https://blockprotocol.org/@bob/property-type/tenure/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/occupation": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name",
    "https://blockprotocol.org/@bob/property-type/tenure",
    "https://blockprotocol.org/@alice/property-type/occupation"
  ]
}
```

As the intermediate expanded entity type does not declare any supertypes, we are unable to trivially substitute this version of Bob's `Employee` in place of `Person`.

## Detecting cycles

> 💭 Because of how verisoning is specified in the [versioning RFC](./0408-versioning-types.md), entity types cannot create proper dependency cyles. The dependency cycles explained below are not about the literal type hierarchy, but rather about indirection and obfuscation of types and potential incompatabiliites that can be introduced. Cycles across type versions can still result in valid types because the types are immutable and that we are dealing with composition.

An extension cycle happens when a part of an inheritance tree revisits a base URL it has already seen. As a contrived example, an entity type `Country` could be the supertype of `Region`, which in turn could be a supertype of the same `Country` entity type.

First entity type version of `Country` without supertype:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/country/v/1",
  "type": "object",
  "title": "Country",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/name"]
}
```

Entity type `Region` with `Country` as a supertype

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/region/v/1",
  "type": "object",
  "title": "Region",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/country/v/1" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/blurb": {
      "$ref": "https://blockprotocol.org/@alice/property-type/blurb/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/blurb"]
}
```

The second, cyclic version of the `Country` entity type

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "kind": "entityType",
  // Because of versioning, we cannot change this version to /v/1 and create a "proper" cycle.
  "$id": "https://blockprotocol.org/@alice/entity-type/country/v/2",
  "type": "object",
  "title": "Country",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/region/v/1" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/location": {
      "$ref": "https://blockprotocol.org/@alice/property-type/location/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/name"]
}
```

This sort of type hierarchy should _not_ be encouraged within the type extension system, as the circular dependencies make types difficult to reason about. While the type hierarchy might be completely valid (as it would be in this case), we should safeguard users from making redundant type structures that look like the above.

In this specific contrived example, creating a new entity type based on `Region` instead of a new version of `Country` might even encode semantic meaning better than re-defining `Country`.

## Multiple supertypes - checking compatibility

As described in the [Guide-level explanation](#multiple-supertypes), when extending multiple entity types, they must be able to coexist in a "compatible manner", which means that the entity types' `properties` and `links` comply with the following:

- For each property (base URL on the top level of `properties`) that exists in multiple entity types:

  - all entity types refer to the same versioned URL of the property type **or** compatible versions of the property type (through the [versioning RFC](./0408-versioning-types.md#determining-type-compatibility) definition of 'compatible')
  - none of the entity types define the property type as an array **or** all define the property type as an array with compatible cardinality constraints.

- For each link (versioned URL on the top level of `links`) that exists in multiple entity types:

  - none of the entity types define the link as an array **or** all define the link as an array with compatible cardinality constraints (and same `order` value).

**Compatible cardinality constraints** can be defined as follows:

For a subtype with many supertypes describing the same array cardinality constraint, all cardinality constraints must overlap.
In the case the subtype does not constrain the given array cardinality, the supertypes will impose an implicit constraint on the subtype with the overlap shared by all supertypes.

To illustrate what this means, given we have a subtype `C` that extends supertypes `A` and `B`, the following two examples can be given:

1.  Example of multiple cardinality constraints on property `x` without subtype constraint on the property

    - Supertype `A` has constraint `x: [0, 3]`
    - Supertype `B` has constraint `x: [-1, 2]`
    - Here the subtype `C` does not define a cardinality constraint on property `x`.

      This imposes an implicit constraint `x: [0, 2]` on the subtype `C` as it extends both `A` and `C`.
      The above constraints are considered valid, as an overlapping constraint can be found.

1.  Example of multiple cardinality constraints on property `x` with subtype constraint on the property

    - Supertype `A` has constraint `x: [0, 3]`
    - Supertype `B` has constraint `x: [-1, 2]`
    - Subtype `C` has constraint `x: [0, 1]`

    - Here subtype `C` imposes its own constraint on `x` which is within the overlapping constraints given by `A` and `B` on `x`.
      The above constraints are also considered valid.

## Block Protocol implications

As [mentioned above](#addressing-previous-considerations), we want to make use of complete schemas for updates instead of partial schemas. In practice for the Block Protocol, this makes it so the following update request using a partial schema:

```json
{
  // Old, partial updateEntityType message
  "entityTypeId": "https://blockprotocol.org/@alice/entity-type/person",
  "schema": {
    // The properties here are partially applied to the original Entity Type.
    "properties": {
      "https://blockprotocol.org/@alice/property-type/birth-date": {
        "$ref": "https://blockprotocol.org/@alice/property-type/birth-date/v/1"
      }
    }
  }
}
```

must instead use a complete schema

```json
{
  // New, complete updateEntityType message
  "entityTypeId": "https://blockprotocol.org/@alice/entity-type/person",
  "schema": {
    "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
    "$id": "https://blockprotocol.org/@alice/entity-type/person/v/2",
    "type": "object",
    "kind": "entityType",
    "title": "Person",
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name/": {
        "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
      },
      "https://blockprotocol.org/@alice/property-type/email": {
        "$ref": "https://blockprotocol.org/@alice/property-type/email/v/1"
      },
      "https://blockprotocol.org/@alice/property-type/phone-number": {
        "$ref": "https://blockprotocol.org/@alice/property-type/phone-number/v/1"
      },
      // The update is inlined in the existing schema
      "https://blockprotocol.org/@alice/property-type/birth-date": {
        "$ref": "https://blockprotocol.org/@alice/property-type/birth-date/v/1"
      }
    }
  }
}
```

given that the original schema was created as follows

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/1",
  "type": "object",
  "kind": "entityType",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/email": {
      "$ref": "https://blockprotocol.org/@alice/property-type/email/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/phone-number": {
      "$ref": "https://blockprotocol.org/@alice/property-type/phone-number/v/1"
    }
  }
}
```

The above change applies to these Block Protocol operations (`updateEntityType` having already been implemented, and the others proposed in accepted RFCs):

- `updateEntityType`
- `updatePropertyType`

which must all make use of complete schemas in place of partial ones. These examples originate from the [Type System RFC](./0352-graph-type-system.md#interfacing-with-types-1).

The `aggregateEntities` operation may need to change its behavior slightly. When calling `aggregateEntities` for a specific entity type, entities that are returned might be of that entity type or subtypes of it when allowing extended types. This is because the entities of the subtype can be coerced to the requested entity type.

# Drawbacks

[drawbacks]: #drawbacks

- The way this proposal adds type extension means that embedding application must be able to handle subtype entities that contain more properties than the supertype
- This drifts further away from JSON Schema by introducing a different meaning to the `unevaluatedProperties` keyword and using it implicitly for our schemas.
- The way compatibility is defined could result in newer versions of supertypes becoming incompatible over time. This is not unique to extending types and can be an "issue" in many parts of the type system as different versions of property types become incompatible.

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

The general rationale for this way of handling extended types (which we may also call type inheritance) is that we want to keep supertypes and subtypes compatible with one another. Constraining the way type inheritance works makes it so that we can implicitly have "same as" relations across type inheritance trees. It also allows extending multiple supertypes which can lead to more expressive domain models. Furthermore, the proposed additions empower users to reuse publicly-available types in places where they would need to add properties to fit their domain.

## Problems and alternatives

### Alternative through open/closed schemas

A proposed way to deal with conditional `unevaluatedProperties` is to use custom `$defs` definitions for open and closed variations of entity types.

**Open by default schema**:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "$id": "https://example.com/schema",

  // ... schema contents  ...

  "$defs": {
    "closed": {
      "$anchor": "closed",
      "$ref": "#",
      "unevaluatedProperties": false
    }
  }
}
```

Here, referencing `https://example.com/schema` in a `$ref` will result in an _open schema_ that _does not_ specify `{ "unevaluatedProperties": false }`. Referencing `https://example.com/schema#closed` results in retrieving a _closed schema_ that _does_ specify `{ "unevaluatedProperties": false }`.

**Closed by default schema**:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "$id": "https://example.com/schema",
  "$ref": "#open",
  "unevaluatedProperties": false,

  "$defs": {
    "schema": {
      "$anchor": "open"
      // ... schema contents ...
    }
  }
}
```

Here, referencing `https://example.com/schema` in a `$ref` will result in a _closed schema_ that _does_ specify `{ "unevaluatedProperties": false }`. Referencing `https://example.com/schema#open` results in retrieving an _open schema_ that _does not_ specify `{ "unevaluatedProperties": false }`.

(Thanks Jason Desrosiers for the suggestions!)

Using the above setup would mean that we need to specify `#open` at the end of type URLs when URLs appear in `allOf`. We would also need to serve type schemas with one of the above structures, such that they conform with JSON Schema. Although this does add some ceremony around extending types, we would end up with a type extension system that would conform to JSON Schema without implicitness or redefining keyword semantics.

# Prior art

[prior-art]: #prior-art

- [JSON Schema composition](https://json-schema.org/understanding-json-schema/reference/combining.html) and [`unevaluatedProperties`](https://json-schema.org/understanding-json-schema/reference/object.html#unevaluated-properties)
- [Programming languages subtyping](https://en.wikipedia.org/wiki/Subtyping)
- [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)

# Unresolved questions

[unresolved-questions]: #unresolved-questions

- We haven't specified how projecting/selecting properties of a supertype from a subtype instance is possible. It is an open question how we actually pick out the exact properties of a subtype to provide a valid supertype instance in embedding applications.
- The current argument for not allowing cyclic type hierarchies mostly build on a feeling that type hierarchies shouldn't be too indirect/obfuscated, but there could be stronger arguments for allowing/disallowing it.
- The decision to have type substitution between subtype and supertype does mean the extended types are restrictive in that they do not allow for removing/changing existing properties. Without a way to transform data between types (mappings), allowing overrides is not possible while keeping compatibility.

# Future possibilities

[future-possibilities]: #future-possibilities

- The conservative way type extension is introduced in this RFC allows for future work in the "data mapping" space to apply to type inheritance as well. Being able to map between entity types could enable a shared mapping for otherwise incompatible entity types.
- Implementations of the upcoming "Structure-based Queries" RFC could benefit from some of the ground-work set out by this RFC, as the selection/projection of supertypes could be the basis of structure-based queries.
