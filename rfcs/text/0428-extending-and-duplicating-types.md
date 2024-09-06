Feature Name: extending-and-duplicating-entity-types
Start Date: 2022-07-11
First Published: 2023-06-30
RFC PR: https://github.com/blockprotocol/blockprotocol/pull/428
RFC Discussion: https://github.com/blockprotocol/blockprotocol/discussions/439

---

# Summary

[summary]: #summary

This RFC describes an extension to the [Graph module's Type System](./0352-graph-type-system.md) whereby entity types can be _extended_ and _duplicated_. These mechanisms allow users of the system to take existing entity types and reuse their definitions to create new ones — in a compatible fashion for _extension_ and an incompatible one for _duplication_.

In brief, entity type extension can be considered as a flavor of the inheritance mechanism that one popularly sees in object-oriented programming, while duplication is similar to "forking" that one sees in other systems (such as Git). As such, in the context of the Type System, these terms may be used interchangeably when it aids in intuition or ease of explanation.

# Motivation

[motivation]: #motivation

The Type System specifies a method of creating well-defined descriptions of data within a graph.
The fact that those descriptions are comprehensive and well-defined is an essential characteristic that comes with many positives for usages of the types.
However, those benefits come with compromises on reusability and flexibility.
Various domains may have overlapping concepts and similar but slightly different representations of those concepts.
Handling this within the current system is unergonomic, users are generally faced with the option of creating a new competing type for their specific domain, or using another type which ineffectively describes their representation.
It's possible that the latter isn't even an option, as if the existing type is sufficiently strict, the user may not be able to satisfy the non-overlapping constraints.

As such, this RFC intends to define a way through which new entity types can be created which reference and extend existing ones in a compatible fashion.
This should allow increasingly specific entity types to be created, while maintaining programmatic assurances that they are compatible with the more general entity types they extend.
As an escape hatch, this RFC also describes a process that type-creating environments can implement and expose, which allows users to take an existing type and create a new branch of types that diverge from the original, while giving up the programmatic assurances about compatibility.

Entity types are focused on as the most essential high-level building blocks of the system.
Designing a comparable extension of the system for other kinds of types could be looked into as a piece of future work.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

Entity type extension is the act of taking an existing entity type, and producing a new one which 'inherits' all of the existing constraints, and is able to add additional ones.
This process will allow the new type to be used in places where the original could be used (i.e. it is compatible with the original type), and will allow the new type to be used in places where the original could not be used (i.e. it is more specific than the original type).

Say you have an existing entity type `Type`, and you wish to create a new type `SubType` which has all of the constraints of `Type` as well as some additional ones.
Using `SubType` in place of `Type` must be possible when extending a type, which means that existing constraints on properties and links may _not_ be _weakened_.

For an example, let's say we have a `Person` entity type, and we wish to extend it to create an `Employee` entity type.
Doing so would allow it to add _additional_ domain-specific constraints (e.g. specifying new properties and links) to `Employee`, making it more specialized, while still allowing it to be used in all places a `Person` could be used.

If the `Person` entity type contains the required properties `name` and `age`, the `Employee` entity type would inherit these properties and would be allowed to add other properties, for example an optional `occupation` property.
If it did so, then `Employee` would have the required properties `name` and `age`, and an optional property `occupation`.

Importantly, `Employee` would _not_ be able to weaken any of the constraints inherited from `Person` to ensure that instances of `Employee` are also valid instances of `Person` (i.e. compatibility with `Person` is preserved). This means that it would not be able to make `name` or `age` optional, or remove them entirely. It also wouldn't be able to change their definition to being an array. A full list of modifications that are allowed and disallowed are described in greater detail below.

If someone needed to create an `Employee` type, but didn't have `age` data in their domain, they could take the (generally less ideal) route of _duplicating_ the `Person` type.
Type duplication can be seen as a literal copy of an entity type's contents, providing full control over any properties present on the source entity type.
As it is a **copy**, the creator is free to modify it as they wish, as there is no longer a programmatic relationship between the original type and the new type.

As a consequence of the above definition, these questions arise:

- How do we ensure that `Employee` instances can be used in place of `Person` instances in practice? (we refer to this as "subtyping")
- Do we allow, and if so, under what conditions, extending multiple types?
- How does having `additionalProperties` in existing schemas influence type extension?
- How should the Block Protocol type system support extending types?
- What strategies for type duplication should the Block Protocol recommend?

## Subtyping

An essential attribute of type extension is the ability of a subtype to be used in place of its super type.
In cases where such a usage is able to happen implicitly, it is called [_coercive subtyping_](https://en.wikipedia.org/wiki/Subtyping#Coercions).

If a subtype is defined by purely adding _additional_ constraints to that defined by the supertype, without modifying or overriding the supertype's constraints, then it is not necessary to check for compatibility between the two types.
Such a check is referred to as [`subsumption`](https://en.wikipedia.org/wiki/Subtyping#Subsumption), which is necessary when the mechanism that can create subtypes can result in the modification of the supertype's constraints.

The extension mechanism outlined in this proposal satisfies such a requirement, as types which extend another type are only able to add new constraints, which are resolved _in addition_ to the existing constraints.
There is no mechanism to invalidate, remove, or weaken a previous constraint, and as such, any satisfiable type that extends another type is necessarily compatible with it.

Building off the earlier example, take an `Employee` instance which looks as follows (simplified for brevity, omitting base URL keys, metadata, etc.):

```json
{
  "name": "Charles",
  "age": 35,
  "occupation/": "Merchant"
}
```

The properties would have the following relation to `Employee`:

```txt
      name◄┐ (supertype)    (subtype)
           ├───Person───────Employee
       age◄┘                │
                            │
occupation◄─────────────────┘
```

We can visually see that a `Person` would include `name` and `age` properties but not include the `occupation` property.
Assuming we have the `Employee` instance above, we can see that it's possible to satisfy the constraints of `Person` by selecting the properties from it which are defined by `Person` which can be referred to as _projecting_ the type.
Some considerations in this projection mechanism are explored in more detail in the coming sections, specifically in the [`additionalProperties` problem explanation section](#the-additionalproperties-problem) due to the nature of JSON schema composition.

As mentioned above, modifications do not have to be limited to the addition of new properties, as long as they do not _weaken_ existing constraints.
It is possible to add a constraint about a property which is also constrained in the supertype, as long as the resultant constraints are still _compatible_ (using the definition of compatible given in the [versioning RFC](./0408-versioning-types.md#determining-type-compatibility)).

For example, if `name` was actually _optional_ in `Person`, `Employee` would be able to _add_ the constraint of it being _required_.
Adding such a constraint still results in the `name` definition within `Employee` being compatible with the one in `Person`, just more specific.

```txt
       age◄┐ (supertype)    (subtype)
           ├───Person───────Employee
      name◄┘                │
 [optional]                 │
                            │
      name◄─────────────────┘
 [required]
```

Understanding that type extension works through the _addition_ of new constraints is important when considering constraints such as `minLength` and `maxLength`.
If a supertype has a `minLength` of `1`, a subtype can add an _additional_ constraint that `minLength` is `0`, however this does not _override_ the constraint given by the super type, and data that satisfies the schema will still end up needing to satisfy the stronger constraint of `1`.
_Adding_ a new constraint of `minLength: 2` is however a stronger constraint, which would end up taking precedence.
This is consistent with the behavior of JSON schema semantics, whereby all rules are applied in a given schema, even when one is superseded by another.

## Multiple supertypes

Constraining type extension to allow extending one type would be a pretty major limitation for how expressive the system is.
As such, the extension mechanism described above can applied to combine/re-use the constraints from multiple supertypes (this is generally referred to _multiple inheritance_).

## The `additionalProperties` problem

As established in the [Versioning RFC](./0408-versioning-types.md) for the type system, _implicitly_ applying `{ "additionalProperties": false }` for all types is important when considering type compatibility.
However, if we assume this for _any_ entity type, then we lose the ability for [_coercive subtyping_](https://en.wikipedia.org/wiki/Subtyping#Coercions) when we expand the system with the type extension mechanism.
An instance that satisfies a given supertype will not validate against a subtype if that subtype adds additional properties.

For example, if we supply the `Employee` instance from above to a `Person`, it will receive properties that are considered `additionalProperties` (the `occupation` property is not present on `Person`) and therefore break the implicitly applied constraint.

This ability to select/project parts of a subtype that make up a supertype is an essential assumption for the rest of this proposal while keeping the benefits of having strict typing in the system.

To mitigate this issue, we propose slight modifications to how `{ "additionalProperties": true }` and `{ "unevaluatedProperties": false }` are used within our type extension system to let supertypes keep strictness while allowing composition. This modification refers to the implicit constraints that should be applied when validating types and instances, and should not affect syntax.

Concrete examples of the issues that arise with `additionalProperties` and `unevaluatedProperties` are shown in the [Reference-level explanation](#problems-with-additionalproperties-and-unevaluatedproperties).

## JSON Schema Syntax for Entity Type Extension

Extended types will be defined with conventional JSON Schema syntax: the `allOf` keyword. An entity type can extend another entity type by adding a versioned URL reference to the root-level `allOf` array.
A [_versioned_ URL](https://github.com/blockprotocol/blockprotocol/blob/main/rfcs/text/0408-versioning-types.md#type-uris) (as opposed to a base URL) is used so that subtypes aren't implicitly modified (and potentially invalidated) when the supertype is updated.

## Defining entity type duplication

When looking to create a new type which is based of existing types, if extending an entity type is insufficient, an alternative is to duplicate the type so that constraints can be removed or overridden. Duplicated types become new complete, standalone types.

Type duplication, unlike extended types, is not a concrete well-defined mechanism within the Type System.
Instead, it is a guiding set of principles and behaviours which type-creating environments can support.

**Duplication does not imply that instances of the original type can be substituted by instances of the duplicated type** because the types may be incompatible.

### Duplication strategy

As alluded to earlier in the document, duplication can take place in many different ways for entity types. Since entity types can extend other entity types in this proposal, the need for duplication can arrive from differing points of that hierarchy.

As an example, if a user wanted to modify an `Employee` entity type that has the following type hierarchy:

```txt
name◄─────Being───┐
                  │
          age◄────Person─────Employee
                             │
   occupation◄───────────────┘
```

where `Employee` is a subtype of `Person` which in turn is a subtype of `Being`.

The three properties `name`, `age` and `occupation` would be present on `Employee` and considered all expanded properties for `Employee`.
The user wants to remove the `age` property and add a `tenure` property.
To do so would involve modifying existing constraints, and thus could not be done through type extension.
As such, they would have to create a new subtype of `Being` with the desired changes:

```txt
name◄─────Being───┐
                  │
       tenure◄────MyEmployee
                  │
   occupation◄────┘
```

From the perspective of the user duplicating a type, the `Person` and `Employee` entity types were squashed together or "expanded" for duplication to have the desired effect.
The `Being` supertype relation is still kept when changing a property on the `MyEmployee` duplicated type.
But in this process, the `MyEmployee` entity type loses the ability to trivially be treated as a `Person`, as there is no subtyping relation with `Person` on the new `MyEmployee` duplicated type.

The duplication happened on the expanded type resulting in combining/expanding `Person` and `Employee`, but it would also have been possible to expand the entire type, getting rid of `Being`.
This would have resulted in the following type hierarchy:

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

As the new Block Protocol type system doesn't require a delta-based storage approach for its schemas, it's unclear what the advantages of partial schemas for update requests are.

Furthermore, resolving the intentions of the existing definition for the message is problematic, as it's impossible to know whether the omission of a property should be interpreted as _removing_ that property, or leaving it in place.

We propose that we should treat type updates as complete replacements, so implementation is much more straightforward for embedding applications. Partial schema updates also add some level of indirection, and that may obfuscate error sources and error reasons. Therefore, updates to types must be complete replacements rather than partial schema updates.

### Removing link ordering

Adding a type extension mechanism causes issues with the behavior of links in situations where a link type extends another link type, and an entity type refers to both of them. This, combined with a few other reasons explored below, has lead to us suggesting the removal of link ordering from the specification.

#### Conflicting Link Orderings

To understand this, let's take the example of `Person` above. Let's define a `Knows` link type, and a `Has Friend` link type that extends `Knows`. Now let's say that `Person` defines `Knows` and `Has Friend` links to `Person` entities:

```json
{
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/1",
  "title": "Person",
  // ...
  "links": {
    "https://blockprotocol.org/@alice/entity-type/knows/v/1": {
      "type": "array",
      "items": {
        "oneOf": [
          { "ref": "https://blockprotocol.org/@alice/entity-type/person/v/1" }
        ]
      }
    },
    "https://blockprotocol.org/@alice/entity-type/has-friend/v/1": {
      "type": "array",
      "items": {
        "oneOf": [
          { "ref": "https://blockprotocol.org/@alice/entity-type/person/v/1" }
        ]
      }
    }
  }
}
```

Now, let's say that a given `Person`, `Alice` has the following links:

- `KnowsBob`
- `HasFriendCharlie`
- `HasFriendDave`

Now, `HasFriendCharlie` and `HasFriendDave` are both link entities of type `Has Friend`, which extends `Knows`, which means they are also `Knows` links. Meaning if you were to query for `Has Friend` links for `Alice` you'd get `HasFriendCharlie` and `HasFriendDave`. But if you were to query for `Knows` links for `Alice` you'd get all links: `KnowsBob`, `HasFriendCharlie` and `HasFriendDave`.

Now, what if we said that both of these link collections were **ordered**? We could define an order on the link entities, say

```ts
HasFriendCharlie.leftToRightOrder = 1;
HasFriendDave.leftToRightOrder = 0;
```

This will give us `HasFriendDave` first, then `HasFriendCharlie`. But what about the `Knows` link? There is only one `leftToRightOrder` on each link entity, so the order will apply to _both_ lists, which could result in conflicting indices. Changing the order (index) of one of the elements in one collection will affect its position in the other.

#### Other issues with link ordering

The issue above caused us to revisit the thinking around link ordering, and is the motivator for removing link ordering in this RFC. However, there are a number of other shortcomings in the current implementation, bolstering the decision to remove it (as opposed to iterating on it):

- Integer-based indexing is inflexible and causes issues with update logic. For example, if you want to add a link to the middle of the list, you'd have to increment all the conflicting indices after the insertion point.
  - One potential mitigation for this would be to use [fractional indexing](https://www.figma.com/blog/realtime-editing-of-ordered-sequences/), which would _help_ with the next shortcoming,
- Some embedding applications may support collaborative editing. In systems like those — with the need for realtime conflict resolution — the ordering of list elements is a problematic challenge, where a naive solution like an integer-based one might cause major problems when encountering race conditions. This can be helped by the aforementioned suggestion of [fractional indexing](https://www.figma.com/blog/realtime-editing-of-ordered-sequences/) but it still increases the burden on application developers.
- Furthermore, there is a data modeling question regarding whether links can be ordered based on a single property. There are many cases where the ordering could be dependent on the specific use case (as opposed to something intrinsic in the data), which is already partially supported by the `orderBy` field on the `query` methods. Various data models may also wish to have multi-tiered ordering, e.g. ordering first by one property and then secondly by another. As the current implementation does not account for all such use cases, and fractional indexing would not either, we opt to remove it for now and allow users to order links themselves at the application level. Should this decision cause problems, ordering can be added back in the future, with a design that takes issues into consideration including those posed by inheritance.

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

## Defining extended entity types

In the Block Protocol, we will allow type extension through the `allOf` JSON Schema keyword which applies all constraints from the sub-schemas within the `allOf` array.

We'll add the following fields to the [existing Entity Type meta-schema](https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type) definition:

```json
{
  "$id": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "type": "object",
  // ...,
  "properties": {
    // ...,
    "allOf": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "$ref": {
            "$comment": "Valid reference to an existing Entity Type version",
            "$ref": "https://blockprotocol.org/types/modules/graph/0.4/schema/versioned-url"
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
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/1",
  "type": "object",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/age/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/age/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name/",
    "https://blockprotocol.org/@alice/property-type/age/"
  ]
}
```

and a _subtype_ `Employee`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/1" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/occupation/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/occupation/"]
}
```

It is possible to coerce an instance of `Employee` into an instance of `Person` as the properties compose and are compatible.
For example, we may have the following (simplified) `Employee` instance:

```json
{
  "entityId": 111,
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": "Charles",
    "https://blockprotocol.org/@alice/property-type/age/": 35,
    "https://blockprotocol.org/@alice/property-type/occupation/": "Merchant"
  }
}
```

which can be coerced into the following `Person` instance:

```json
{
  "entityId": 111,
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": "Charles",
    "https://blockprotocol.org/@alice/property-type/age/": 35
  }
}
```

Notice how we are keeping the same `entityId` for this entity instance, but simply coercing the entity instance by selecting the properties of interest for the given type.

**An example of _satisfiable_ overlapping constraints**:
Given a _supertype_ `Person`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/2",
  "type": "object",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/age/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/age/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name/",
    "https://blockprotocol.org/@alice/property-type/age/"
  ]
}
```

and a _subtype_ `Employee`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/2",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/2" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/occupation/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name/",
    "https://blockprotocol.org/@alice/property-type/occupation/"
  ]
}
```

The two types share the `name` property, but the constraints for each property are identical. It's possible to coerce an instance of `Employee` into an instance of `Person` as any value that satisfies the constraints of `name` on `Employee` will satisfy the constraints of `name` on `Person`.

For example, we may have the following `Employee` instance:

```json
{
  "entityId": 112,
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": "Charles",
    "https://blockprotocol.org/@alice/property-type/age/": 35,
    "https://blockprotocol.org/@alice/property-type/occupation/": "Merchant"
  }
}
```

which can be coerced into the following `Person` instance:

```json
{
  "entityId": 112,
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": "Charles",
    "https://blockprotocol.org/@alice/property-type/age/": 35
  }
}
```

**Another example of _compatible_, overlapping constraints**:

Given a _supertype_ `Person`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/3",
  "type": "object",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/age/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/age/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/age/"]
}
```

and a _subtype_ `Employee`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/3",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/3" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/name/"]
}
```

In this example, `Person` has an optional `name` property and `Employee` defines `name` as required.

Any instance of `Employee` will have a `name` property, which will always satisfy the constraints of `name` on `Person`, as being required is a _stronger_ constraint than being optional, and all other constraints (imposed by the property type) are equal.

### Problems with `additionalProperties` and `unevaluatedProperties`

The intention of the type system is to strongly type the data, so that users of the system can benefit from strong guarantees about the shape of, and existence (or non-existence) of parts of the data.
As such, entity types are intended to comprehensively describe data within entities of that type, which means we wish to disallow additional or untyped properties within them.

In JSON schema this is generally achieved by setting `additionalProperties: false`, or `unevaluatedProperties: false`.
Unfortunately, this causes problems when you start composing schemas (e.g. with entity type inheritance)

If supertypes themselves specify one of these `{ "unevaluatedProperties": false }`, they are not able to be part of an `allOf` validator, as they will error as soon as they see properties that are not part of the root schema itself.
When composing schemas that all contain `{ "unevaluatedProperties": false }`, each schema will disallow any other properties which they do not define. Using the following (ordinary) JSON Schema as an example:

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

The required behavior is that `unevaluatedProperties` should only apply to a "flattened" view of the schema, whereby all the constraints of the subtype and its supertypes are combined.

### Defining an implicit `unevaluatedProperties`

We're already implicitly defining `{ "additionalProperties": false }` in the [versioning RFC](./0408-versioning-types.md#determining-type-compatibility) for all schemas, this RFC will piggyback on that, and change the existing, implicit `additionalProperties` usage to `unevaluatedProperties` as well as refine the conditions under which it is implied.

Instead of implicitly inserting it into every schema for an entity type, we suggest the constraint is implied at the root level schema when validating data against a specific entity type.
In other words, if you have a type `Employee` which extends `Person`, when you validate an entity of type `Employee` against the `Employee` type, the implicit `unevaluatedProperties` constraint will be implicitly inserted once, in the top-level of the `Employee` schema, and _not_ in the `Person` schema.

Concretely, this means that for a free-standing type that doesn't extend any other type such as this `Person` type:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/2",
  "type": "object",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/age/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/age/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name/",
    "https://blockprotocol.org/@alice/property-type/age/"
  ]
}
```

would implicitly have `{ "unevaluatedProperties": false }` set at time of validation.

In the case of the `Employee` type:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/2",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/2" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/occupation/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name/",
    "https://blockprotocol.org/@alice/property-type/occupation/"
  ]
}
```

with respect to JSON schema validation semantics, _at time of validation_ the resolved schema residing at `{ "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/2" }` would _not_ have `{ "unevaluatedProperties": false }`, whereas the top-level entity type itself _would_ have `{ "unevaluatedProperties": false }` set at time of validation.

### Liskov substitution principle

Subtypes in the system can be used in place of the supertypes that they extend, similarly to what is expected in the [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle). Although our entity types do not contain behavior, the semantic meaning of individual properties on an entity type is captured on the property type definitions they refer to, which enables the ability to use the subtype in place of its supertype(s) "without altering any of the desirable properties of that program" [[source](https://en.wikipedia.org/wiki/Liskov_substitution_principle#Principle)].

## Defining entity type duplication

The Block Protocol meta-schemas don't need to change to support type duplication as the details of the mechanism aren't expressed _within_ the system. Instead, the behavior is defined, in that it results in a copy of the contents of types — creating new, completely distinct, types.

As such, when duplicating a type, the new type will have an entirely different URL and potentially a new `title`.

As outlined in the [Guide-level explanation](#duplication-strategy), there may be different locations where type duplication can take effect. To maximize reusability, embedding applications should maximize supertype reuse and only duplicate parts of type hierarchies that are necessary to resolve property changes.

### Examples of type duplications

Given a _supertype_ `Person`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/1",
  "type": "object",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/age/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/age/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name/",
    "https://blockprotocol.org/@alice/property-type/age/"
  ]
}
```

and a _subtype_ `Employee`:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/2" }
  ],
  "properties": {
    "https://blockprotocol.org/@alice/property-type/occupation/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/occupation/"]
}
```

a user, Bob, wishes to use Alice's `Employee` entity type but must change the `occupation` property, turning it into a `tenure` property such that it suits their use case. Bob can duplicate the `Employee` type, and make the change as follows:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@bob/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "allOf": [
    { "$ref": "https://blockprotocol.org/@alice/entity-type/person/v/2" }
  ],
  "properties": {
    "https://blockprotocol.org/@bob/property-type/tenure/": {
      "$ref": "https://blockprotocol.org/@bob/property-type/tenure/v/1"
    }
  },
  "required": ["https://blockprotocol.org/@bob/property-type/tenure/"]
}
```

Bob can make a change to `Employee` (removing `occupation`) such that it is no longer compatible with Alice's `Employee` through type duplication. The new, duplicated `Employee` type still extends `Person` from the original type, allowing either `Employee` type to be used in place of (substituted with) the `Person` type.

If a user wants to duplicate `Employee` but update a property present on `Person`, the entity type they're modifying acts like an entity type with all properties expanded. It is no longer possible for the user to subtype `Person` and instead they are creating a completely new type with no given `allOf` entries.

The original, conceptually expanded `Employee` entity type:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/age/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/age/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/occupation/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name/",
    "https://blockprotocol.org/@alice/property-type/age/",
    "https://blockprotocol.org/@alice/property-type/occupation/"
  ]
}
```

This expanded entity type is equivalent to the original `Employee` entity type, but without any extended type declaration. If Bob wanted to change the `age` property to `tenure`, that would be possible by duplicating this intermediate representation of `Employee` as follows:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@bob/entity-type/employee/v/1",
  "type": "object",
  "title": "Employee",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@bob/property-type/tenure/": {
      "$ref": "https://blockprotocol.org/@bob/property-type/tenure/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/occupation/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/occupation/v/1"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/name/",
    "https://blockprotocol.org/@bob/property-type/tenure/",
    "https://blockprotocol.org/@alice/property-type/occupation/"
  ]
}
```

As the intermediate expanded entity type does not declare any supertypes, we are unable to trivially substitute this version of Bob's `Employee` in place of `Person`.

## Block Protocol implications

As [mentioned above](#addressing-previous-considerations), we want to make use of complete schemas for updates instead of partial schemas. In practice for the Block Protocol, this makes it so the following update request using a partial schema:

```json
{
  // Old, partial updateEntityType message
  "entityTypeId": "https://blockprotocol.org/@alice/entity-type/person",
  "schema": {
    // The properties here are partially applied to the original Entity Type.
    "properties": {
      "https://blockprotocol.org/@alice/property-type/birth-date/": {
        "$ref": "https://blockprotocol.org/@alice/property-type/birth-date/v/1"
      }
    }
  }
}
```

must instead use a complete schema (absent of an `$id`)

```json
{
  // New, complete updateEntityType message
  "entityTypeId": "https://blockprotocol.org/@alice/entity-type/person",
  "schema": {
    "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
    "type": "object",
    "kind": "entityType",
    "title": "Person",
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name/": {
        "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
      },
      "https://blockprotocol.org/@alice/property-type/email/": {
        "$ref": "https://blockprotocol.org/@alice/property-type/email/v/1"
      },
      "https://blockprotocol.org/@alice/property-type/phone-number/": {
        "$ref": "https://blockprotocol.org/@alice/property-type/phone-number/v/1"
      },
      // The update is inlined in the existing schema
      "https://blockprotocol.org/@alice/property-type/birth-date/": {
        "$ref": "https://blockprotocol.org/@alice/property-type/birth-date/v/1"
      }
    }
  }
}
```

given that the original schema was created as follows

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "$id": "https://blockprotocol.org/@alice/entity-type/person/v/1",
  "type": "object",
  "kind": "entityType",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/email/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/email/v/1"
    },
    "https://blockprotocol.org/@alice/property-type/phone-number/": {
      "$ref": "https://blockprotocol.org/@alice/property-type/phone-number/v/1"
    }
  }
}
```

The above change applies to these Block Protocol operations (`updateEntityType` having already been implemented, and the others proposed in accepted RFCs):

- `updateEntityType`
- `updatePropertyType`

which must all make use of complete schemas (absent of `$id`) in place of partial ones. These examples originate from the [Type System RFC](./0352-graph-type-system.md#interfacing-with-types-1).

## Removing link ordering

The [current meta-schema for `Entity Type`](https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type) allows an `ordered` property inside of `links` and [current schema for `Link Data`](https://blockprotocol.org/types/modules/graph/0.3/schema/link-data) includes the [link ordering schema](https://blockprotocol.org/types/modules/graph/0.3/schema/link-orders) as properties, which consists of `leftToRightOrder` and `rightToLeftOrder`. With the removal of link ordering, these will be removed in the next version of the meta-schema, so the next version of the `Entity Type` meta-schema will look like this (the changes to the `allOf` property from above were omitted):

```json
{
  "$id": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "title": "Entity Type",
  "properties": {
    "links": {
      "patternProperties": {
        ".*": {
          "type": "object",
          "properties": {
            "type": {
              "const": "array"
            },
            "items": {
              "$ref": "#/$defs/oneOfEntityTypeReference"
            },
            "minItems": {
              "type": "integer",
              "minimum": 0
            },
            "maxItems": {
              "type": "integer",
              "minimum": 0
            }
          },
          "required": ["type", "items"],
          "additionalProperties": false
        }
      }
      // ...
    }
    // ...
  }
  // ...
}
```

and the next version of the `Link Data` schema will become this:

```json
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "$id": "https://blockprotocol.org/types/modules/graph/0.4/schema/link-data",
  "title": "Link Data",
  "type": "object",
  "properties": {
    "leftEntityId": {
      "$ref": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-id"
    },
    "rightEntityId": {
      "$ref": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-id"
    }
  },
  "required": ["leftEntityId", "rightEntityId"]
}
```

Similarly, the `Link Orders` reference will be removed from the [`updateEntity`](https://github.com/blockprotocol/blockprotocol/blob/3c06d843d95506c0ec33e08bee99ec923d4ec3de/libs/%40blockprotocol/graph/src/graph-module.json#L48-L80) method in the graph-module schema. The changes to [`createEntity`](https://github.com/blockprotocol/blockprotocol/blob/3c06d843d95506c0ec33e08bee99ec923d4ec3de/libs/%40blockprotocol/graph/src/graph-module.json#L6-L31) are implicit by updating the `Link Data` schema reference:

```json5
{
  "name": "graph",
  "version": "0.4",
  "messages": [
    {
      "messageName": "createEntity",
      "data": {
        "type": "object",
        "properties": {
          "entityTypeId": {
            "description": "The entityTypeId of the type of the entity to create",
            "$ref": "https://blockprotocol.org/types/modules/graph/0.4/schema/versioned-url"
          },
          "properties": {
            "description": "The properties of the entity to create",
            "$ref": "https://blockprotocol.org/types/modules/graph/0.4/schema/property-type-object"
          },
          "linkData": {
            "description": "Link data if the entity is a link entity",
            "$ref": "https://blockprotocol.org/types/modules/graph/0.4/schema/link-data"
          }
        },
        "required": ["entityTypeId", "properties"]
      },
      //...
    },
    {
      "messageName": "updateEntity",
      "data": {
        "type": "object",
        "properties": {
          "entityId": {
            "description": "The entityId of the entity to update",
            "$ref": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-id"
          },
          "entityTypeId": {
            "description": "The entityTypeId of the updated entity",
            "$ref": "https://blockprotocol.org/types/modules/graph/0.4/schema/versioned-url"
          },
          "properties": {
            "description": "The new properties object to assign to the entity",
            "$ref": "https://blockprotocol.org/types/modules/graph/0.4/schema/property-type-object"
          }
        }
        "required": ["entityId", "entityTypeId", "properties"],
      },
      //...
    },
    // ...
  ]
}
```

# Drawbacks

[drawbacks]: #drawbacks

- Handling the additional properties found on a subtype, when wanting to use it in place of a supertype, requires more work for the implementation, especially when considering entity validation and JSON schema semantics.
- There will be more avenues for users to define unsatisfiable schemas.
- Resolving types becomes more complicated and requires even more traversal across distinct records, with considerations for cyclic dependencies

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

The proposed design attempts to make a trade-off between the following:

- The expressiveness of the type system, allowing for greater re-use and expression of hierarchies between types
- Implementation complexity, especially:
  - when _not_ opting to try and avoid unsatisfiable schemas
  - optimizing for trivial assumptions to be made regarding the compatibility of a supertype and subtype

As such, this section outlines a number of considerations or compromises which have been made within the design.

## Implicitly adding `unevaluatedProperties`

An alternative way to achieve the same semantic behaviour as with the implicit `unevaluatedProperties` is to use custom `$defs` definitions for open and closed variations of entity types.

**Open by default schema**:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "$id": "https://example.com/schema/v/1",

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

Here, referencing `https://example.com/schema/v/1` in a `$ref` will result in an _open schema_ that _does not_ specify `{ "unevaluatedProperties": false }`. Referencing `https://example.com/schema/v/1#closed` results in retrieving a _closed schema_ that _does_ specify `{ "unevaluatedProperties": false }`.

**Closed by default schema**:

```json
{
  "$schema": "https://blockprotocol.org/types/modules/graph/0.4/schema/entity-type",
  "$id": "https://example.com/schema/v/1",
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

Here, referencing `https://example.com/schema/v/1` in a `$ref` will result in a _closed schema_ that _does_ specify `{ "unevaluatedProperties": false }`. Referencing `https://example.com/schema/v/1#open` results in retrieving an _open schema_ that _does not_ specify `{ "unevaluatedProperties": false }`.

(Thanks Jason Desrosiers for the suggestions!)

Using the above setup would mean that we need to specify `#open` at the end of type URLs when URLs appear in `allOf`. We would also need to serve type schemas with one of the above structures, such that they conform with JSON Schema. Although this does add some ceremony around extending types, we would end up with a type extension system that would conform to JSON Schema without implicitness or redefining keyword semantics.

Generally, this RFC opts to forego this design to avoid the major breaking changes it would introduce to current formats of types and accepted URLs. 'Implicitly' adding a constraint about additional properties is not an uncommon practice for JSON validators, and is a fairly easy step to implement when trying to validate entity properties against a given entity type.

## Detecting cycles

A potential complication of the proposed extension mechanism is that it allows for cycles to be created between types. This is not necessarily a problem for the type system in itself, but rather implementations.

Cyclical dependencies can cause numerous issues when it comes to update logic, validation, consistency guarantees, traversal of the type tree, and more. As such, there was consideration about disallowing cyclic dependencies within the system as a conservative initial standpoint.

Enforcing this constraint would perhaps be more complicated than allowing them in the first place, a cycle could happen over a very large number of types, and if implementations rely on the specification prohibiting them, then they may not be written to appropriately detect and handle external types which do not correctly abide by that restriction of the specification.

An extension cycle happens when a part of an inheritance tree revisits a base URL it has already seen. As a contrived example, an entity type `Country` could be the supertype of `Region`, which in turn could be a supertype of the same `Country` entity type.

It is important to note that aside from difficulties in implementations, the actual semantics of a type with a cyclical inheritance tree are well defined. As the types largely follow JSON schema semantics, constraints are composed and never overridden. Any finite cycle of types would result in a finite set of constraints, and upon detecting a cycle, an implementation can safely finish traversal once establishing the comprehensive set of constraints (therefore avoiding an infinite loop).

## Disallowing unsatisfiable schemas

Another uncomfortable side-effect of the extension mechanism is that it gives more routes through which an 'unsatisfiable type' can be created. An _unsatisfiable_ type is a type where it is impossible to create data that satisfies the constraints of the type.

This can happen through a combination of constraints which overlap or contradict one another, where a simple example is saying a property must be both a number and an array.

Prior to this proposal, the primitives over which the type system are built were limited enough to avoid being able to define conflicting constraints. However, with the introduction of type extension, it will be possible to combine two schemas which express a constraint over the same thing, and there is no guarantee that those constraints will be compatible.

### Worked Examples

Take the following supertypes of `Employee`, where:

- Supertype `Person` defines the properties `name` and `age`
- Supertype `Superhero` defines the properties `superpower` and `name`

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

We now analyze the implications of various scenarios where `Person` and `Superhero` define constraints on the `name` property (we shall ignore the other properties for simplicity).

#### Equal and overlapping constraints

Say that both `Person` and `Superhero` define that `name` is **required**. This results in two (duplicative) constraints of a required `name`.

An entity instance containing a `name` would satisfy both of these constraints.:

```json5
{
  "name": "John Doe",
  ... // superpower, age, occupation
}
```

And as expected, an entity instance _not_ containing a `name` would not satisfy either of these constraints.:

```json5
{
  ... // superpower, age, occupation
  // ERROR: missing required property 'name'
}
```

#### Unequal but compatible overlapping constraints

Instead, say that `Person` defines that `name` is **required**, and `Superhero` defines that `name` is **optional**.

When applied simultaneously, these constraints are _equivalent_ to a single constraint of a **required** `name`.

Same as above, an entity instance containing a `name` would satisfy both of these constraints.:

```json5
{
  "name": "John Doe",
  ... // superpower, age, occupation
}
```

And as expected, an entity instance _not_ containing a `name` would not satisfy either of these constraints.:

```json5
{
  ... // superpower, age, occupation
  // ERROR: missing required property 'name'
}
```

In practice, this combination could be _statically analyzed_ and resolved to a single satisfiable constraint. The interaction of an **optional** definition with a **required** definition is known, and the **stronger** constraint of **required** would be the one that contains the other. Unfortunately, such static analysis is not as simple in the general case, especially when constraints that are intended to be added in the future (see the [Non-Primitive Data Types RFC](https://github.com/blockprotocol/blockprotocol/pull/355)) are taken into consideration. Checking the compatibility of two regexes, for example, is a very difficult task.

#### Unequal and incompatible overlapping constraints

Finally, say that `Person` defines that `name` is a _string_ and is **required**, and `Superhero` defines that `name` is _an array of strings_ and is **required**.

When applied simultaneously, these constraints are _incompatible_ and result in an unsatisfiable type. Let us try and create an instance that satisfies it. First we try and create one with a string `name`:

```json5
{
  name: "John Doe", // ERROR: expected string array, got string
  ... // superpower, age, occupation
}
```

And then we instead try and create one with an array of `name`s:

```json5
{
  name: ["John Doe"], // ERROR: expected string, got string array
  ... // superpower, age, occupation
}
```

### An uncomfortable compromise

As alluded to above, checking compatibility of any two given schemas is quite possibly an NP-Hard problem. Even if it is generally solvable, it is likely a task that is complicated enough that it would be an exceptionally high barrier to entry for potential implementers to overcome.

While various implementations likely will want to implement checking for the simpler cases (disallowing a property from being two disjoint types for example), we opt not to encode such restrictions within the type system, and **implementations should not assume that an arbitrary type is satisfiable**.

# Prior art

[prior-art]: #prior-art

- [JSON Schema composition](https://json-schema.org/understanding-json-schema/reference/combining.html) and [`unevaluatedProperties`](https://json-schema.org/understanding-json-schema/reference/object.html#unevaluated-properties)
- [Programming languages subtyping](https://en.wikipedia.org/wiki/Subtyping)
- [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)

# Unresolved questions

[unresolved-questions]: #unresolved-questions

- We haven't specified how projecting/selecting properties of a supertype from a subtype instance is possible. It is an open question how we actually pick out the exact properties of a subtype to provide a valid supertype instance in embedding applications.
  - This may be especially difficult if a property type is defined as being an array of `oneOf` a given set of property type objects. Detecting which sub-schema applies to a given array element when accounting for dropped properties, **may** be a very difficult task.
  - We intend to explore the viability of this and figure out a solution during the initial implementation of this RFC.

# Future possibilities

[future-possibilities]: #future-possibilities

The extension mechanism described in this proposal is very powerful for being able to cheaply determine compatibility of different types. It is fairly limited in that way however, and the Block Protocol vision aligns with a much more flexible system whereby blocks can express requirements for subsets of types.

The system likely needs to be extended with a concept of "mappings", whereby transformations between types and properties can be defined. This would also help to provide more flexibility when _duplicating_ types.
