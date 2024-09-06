Feature Name: versioning-types
Start Date: 2022-06-28
First Published: 2022-07-13
RFC PR: https://github.com/blockprotocol/blockprotocol/pull/408
RFC Discussion: https://github.com/blockprotocol/blockprotocol/discussions/433

---

# Summary

[summary]: #summary

The Type System outlined in [RFC 0352](https://github.com/blockprotocol/blockprotocol/blob/main/rfcs/text/0352-graph-type-system.md) introduced classes of types that are used to describe the data used and produced by blocks and embedding applications. The types are possibly (ideally often) publicly accessible, and their hierarchy allows for them to be composed together into new types. Due to this, changes in a type can affect the structure of another one. This RFC defines how types are versioned, to mitigate potential problems that would arise without versioning.

# Motivation

[motivation]: #motivation

The Type System is intended to allow for **reusable and shared** descriptions of data. As such, a version of a block should be able to tie itself to a _specific_ description of the structure of the data it requires, because if a type depended on by a block was updated without the block's knowledge or intervention then this could cause problems. Additionally, if someone (Alice) creates an entity type that refers to someone else's (Bob's) "address" property type, we do not want Bob to be able to change what Alice meant in her entity type by arbitrarily and implicitly updating it (via updating his property type).

Being able to refer to specific, immutable versions of types should mitigate or solve the majority of the issues stemming from changes to types that are relied on by blocks or other types.

This RFC proposes that every iteration of every Type (i.e. data type, property type, entity type, or link type) should be associated with a unique version number. This version number will be part of the URL that is used to uniquely identify the specific instance of the Type, to access the Type's schema, and to refer to the Type from other Types.

We also outline a method to determine compatibility between types, and use this in the [Rationale and Alternatives](#rationale-and-alternatives) section to explain how it replaces the need for, and is preferable over, some other versioning scheme such as semantic versioning.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

## Type Versions

The _version number_ of a type is an incrementing positive integer that increases by 1 with each new version, starting from 1.

## Type URLs

The _base URL_ of a type is a _unique_ identifier for the type irrespective of its version, _ending with a trailing slash_.

The _versioned URL_ of a type is a URL string (with max-length of 2048) of the form:

```json
"${base_url}v/${version_number}"
```

We opt not to constrain the format of the `base_url` to enable flexibility in non-public use-cases or in domains with constraints that we cannot predict. Despite this, we _suggest_ that the base URLs should have a consistent format for all types hosted on your domain, and should generally be humanly readable in a way that describes your type. For example, one could choose:

```jsonc
"http://example.com/${namespace}/${type_class}/${type_name}/" // where type_class is "data-type", "property-type", "entity-type", or "link-type"
```

as the identifier (assuming that the domain decides that type names are unique across a namespace).

Where it's possible to guarantee, the _versioned_ URL should be valid, and refer to the same iteration of the type, indefinitely.

> ⚠️ New iterations and changes to the type _must occur_ under new version numbers. An important reason for this, in addition to the ones outlined above, is that components of the Block Protocol ecosystem will certainly implement caching and local-persistence logic, and the spec consciously makes no recommendation that they look for updates, or that these caches are updated.
>
> **As such, a specific version of a Type is to be treated as an immutable record**.

# Reference-level explanation

## What is a "version" of a Type

Any published (accessible) iteration of a Type can be considered a "version" of the Type. Once a specific iteration of a type is made accessible via a URL, it should be considered immutable.

- This means that any change made to the Type (for example changing the description, adding a field, etc) constitutes reason for a new version.
- If multiple changes are made prior to making it accessible (i.e. batching the changes), then a separate version is not needed for each individual change, but they can all be 'released' together.

## URL Format and Version Numbers

Type URLs, and their version numbers are defined as outlined in the [Guide-level explanation](#guide-level-explanation).

### Support for 'Canonical URLs'

Other systems often allow for "canonical" URLs which can extend a versioned URL scheme with some more functionality. [W3C recommends](https://www.w3.org/2005/05/tr-versions) the use of:

- `/latest` for retrieving the most recent "stabilized" version of the document
- `/upcoming` for retrieving the most recent version of the document which is under progress but not stabilized

and some other canonical URLs. This scheme is relatively consistent with other systems such as Git.

> \*\*We recommend that schema hosts support `${base_url}v/latest`, redirecting to (or directly serving) the most recent published version of a type.

Outside of that recommendation we opt to not provision for other canonical URLs at this time.

### Schemas

1.  The `"$id"` field of a Type should be equal to the Type's _versioned URL_.
1.  When referencing another Type using `"$ref"`, the reference should be equal to the Type's _versioned URL_.
1.  When used as the key of a property, the _base URL_ should be used (and consequently only a single version of a type may be used in any given property object).

Example Type schema:

```json
{
  "kind": "entityType",
  "$id": "https://example.com/@alice/entity-type/book/v/4",
  "type": "object",
  "title": "Book",
  "properties": {
    "https://example.com/@alice/property-type/name/": {
      "$ref": "https://example.com/@alice/property-type/name/v/13"
    },
    "https://example.com/@alice/property-type/published-on/": {
      "$ref": "https://example.com/@alice/property-type/published-on/v/23"
    },
    "https://example.com/@alice/property-type/blurb/": {
      "$ref": "https://example.com/@alice/property-type/blurb/v/4"
    }
  },
  "required": ["https://example.com/@alice/property-type/name/"]
}
```

Example `properties` object conforming to the above schema:

```json
{
  "https://example.com/@alice/property-type/name/": "The Time Machine",
  "https://example.com/@alice/property-type/published-on/": "1895-05",
  "https://example.com/@alice/property-type/blurb/": ...
}
```

## Determining Type Compatibility

A key part of the reasoning for picking this approach depends on the ability to determine compatibility between various types.

For the purposes of this section, the following assumptions are applied:

- Any given Schema X is _compatible with_ another schema Y if and only if all possible values that satisfy Schema X also satisfy schema Y (note the directionality)
- Any given Schema X is _equivalent to_ another Schema Y if and only if X is _compatible with_ Y _and_ Y is _compatible with_ X
- All Type schemas have `additionalProperties: false` unless otherwise stated (future RFCs may change this to allow for schemas to 'inherit' from other schemas via `allOf`')
- 'Constraints' refer to all JSON schema keywords which affect the validation of data in the Block Protocol, these include (but are not limited to) `type`, `properties`, `minItems`, `maxItems`, `minimum`, `maximum`
- 'Semantic Annotations' refer to all JSON schema keywords which do not affect the validation of data in the Block Protocol, these include (but are not limited to) `title`, `description`, `examples`, `default`
- The ordering of constraints does not affect the compatibility of schemas

### Data Types

At the present data types represent completely disjoint value spaces, and the base primitive types are all **incompatible** with one another. As the [Non-Primitive Data Types RFC](https://github.com/blockprotocol/blockprotocol/pull/355) continues to be specified, it should comment on how checking compatibility will be affected.

### Property Types

1.  Due to how property types are used, they implicitly affect the structure of the data in that they require the existence of a key that matches their base URL.
1.  Property types define their constraints through a `oneOf` field. This `oneOf` is a collection of one or more values where each value is a variant of the "Property Values" (defined below).

A property type `A` is therefore compatible with another property type `B` if and only if

1.  they have the same base URL (which implies they are the same property type but perhaps different versions), and
1.  every element of `A`'s `oneOf` is compatible with one element of `B`'s `oneOf`

The "Property Values" is a recursive definition which refers to the sub-schemas defined within the [property types meta-schema](https://github.com/blockprotocol/blockprotocol/blob/main/rfcs/text/0352-graph-type-system.md#property-types-1). It defines the element as being one of the following:

#### Data Type Reference

A data type reference will be compatible with another data type reference if the data types that are referred to are also compatible.

> _Without_ non-primitive data types this implies that the references are to the same data type.

#### Property Type Object

A property type object is JSON object defining a schema which is used as `oneOf` the permitted values for a property type, where the schema is of `type: "object`, and within its own `properties` definition:

1.  The keys are base URLs to a property type
1.  The values are defined by either:
    1.  A reference to a property type
    1.  An array definition, where
        1.  the `items` are defined by a reference to a property type
        1.  `minItems` and/or `maxItems` are optionally defined
1.  The required fields are defined by a `required` list where the elements are base URLs that are a subset of the keys in the `properties`

A property type Object `X` is therefore compatible with another property type Object `Y` if and only if

1.  Each key in the `properties` of `X` is also in the `properties` of `Y`
1.  If a property in `X` is defined as an array, then it's also defined as an array in `Y` (and therefore the same for direct references)
1.  If a property in `X` is defined as an array with a `minItems`, then there is a `minItems` constraint on the respective property in `Y` that is equal to or larger to that in `X`
1.  If a property in `X` is defined as an array with a `maxItems`, then there is a `maxItems` constraint on the respective property in `Y` that is less than or equal to that in `X`
1.  Each property type referenced in `X` is compatible with the respective property type referenced in `Y`. Where respective is defined by having the same base URL (property key)
1.  Each URL in the `required` list of `X` is also in the `required` list of `Y`

#### An Array of "Property Values"

Finally, the "Property Values" can be a recursive definition that infinitely nests arrays where the `items` are a `oneOf` where the options are "Property Values" variants. Because of this, compatibility is defined largely similar to above.

A definition of an array of "Property Values" `X` is compatible with another definition of an array of "Property Values" `Y`, if and only if

1.  Every element of `X`'s `oneOf` is compatible with at least one element of `Y`'s `oneOf`
1.  If `X` has a `minItems` constraint specified, then there is a `minItems` constraint in `Y` that is equal to or larger to that in `X`
1.  If `X` has a `maxItems` constraint specified, then there is a `maxItems` constraint in `Y` that is less than or equal to that in `X`

### Entity Types

1.  Entity types define their constraints on the structure of an entity through their `properties`, where
    1.  The keys are base URLs to a property type
    1.  The values are defined by either:
        1.  A reference to a property type
        1.  An array definition, where
            1.  the `items` are defined by a reference to a property type
            1.  `minItems` and/or `maxItems` are optionally defined
1.  The required fields are defined by a `required` list where the elements are base URLs that are a subset of the keys in the `properties`
1.  Entity types also define additional constraints on links from their entity through their:
    1.  `links`, where
        1.  The keys are _versioned URLs_ to a link type
        1.  The values are defined by either:
            1.  An empty object (until Link Constraints are implemented)
            1.  An array definition, where
                1.  the `items` are an empty object (until Link Constraints are implemented)
                1.  `ordered` is optionally defined
                1.  `minItems` and/or `maxItems` are optionally defined
    1.  `requiredLinks` array, where the elements are _versioned URLs_, and is a subset of the keys in the `links`

An entity type `A` is therefore compatible with another entity type `B` if and only if:

1.  Each key in the `properties` of `A` is also in the `properties` of `B`
1.  If a property in `A` is defined as an array, then it's also defined as an array in `B` (and therefore the same for direct references)
1.  If a property in `A` is defined as an array with a `minItems`, then there is a `minItems` constraint on the respective property in `B` that is equal to or larger to that in `A`
1.  If a property in `A` is defined as an array with a `maxItems`, then there is a `maxItems` constraint on the respective property in `B` that is less than or equal to that in `B`
1.  Each property type referenced in `A` is compatible with the respective property type referenced in `B`. Where respective is defined by having the same base URL (property key)
1.  Each URL in the `required` list of `A` is also in the `required` list of `B`
1.  Each key in the `links` of `A` is also in the `links` of `B`
1.  If a link in `links` of `A` is defined as an array, then it's also defined as an array in `B` (and therefore the same for direct references)
1.  If a link in `links` of `A` is defined as an array with a `minItems`, then there is a `minItems` constraint on the respective link in `B` that is equal to or larger to that in `A`
1.  If a link in `links` of `A` is defined as an array with a `maxItems`, then there is a `maxItems` constraint on the respective link in `B` that is less than or equal to that in `B`
1.  If a link in `links` of `A` is defined as an array with `ordered` as `true`, then there is an `ordered` as `true` on the respective link in `B`
1.  Each URL in the `requiredLinks` list of `A` is also in the `requiredLinks` list of `B`

### Link Types

Link types are only able to be changed through _semantic annotations_ and as such, any link type `X`, with the same Base URL as another link type `Y` (i.e. a different version of the same link type), are _compatible_ (this is likely to change in the near future).

## When to Check Compatibility of Types

Block schemas, and other uses of types (for example graph module methods), can request particular data structures from the embedding application by referencing types. Not relying on the version of a type to ensure compatibility means that if a block or data (associated with a versioned type) in an embedding application is associated with a different version of a type – or different types altogether – the compatibility of the data can still be checked by comparing the two schemas. Data blobs can continue to be validated against the relevant schema.

This should allow a bit more flexibility within the system when it comes to compatibility of data requirements.

# Drawbacks

[drawbacks]: #drawbacks

- This proposal makes the active decision to not embed compatibility information within the version identifier. This contrasts with approaches like semantic versioning, which is explored more in the [Rationale and alternatives](#rationale-and-alternatives) section.
- The versioning approach does not encapsulate information about the scale of the change, fixing a typo causes a new version in the same way that completely rewriting the constraints does.
- When compared to an approach like semantic versioning, there is some _further_ implementation overhead to determining compatibility between versions of the same type. However in most cases this overhead would be present in both approaches regardless.

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

There were a number of strategies evaluated as part of this proposal:

## No Versioning

Not having _some sense of_ versioning has been ruled out largely for the reasoning outlined in the [Summary](#summary) and [Motivation](#motivation).

- If a block uses a definition of the type, and has hard-coded logic that depends on the guarantees of the type, then if that type can change without the Block author intending it to, the block can break.
- A block could mitigate this by "vendoring in" a specific instance of the type and then providing it alongside its source (note: this proposal doesn't actually make suggestions for or against this), but if that iteration of the type is not persisted, identifiable (by some form of version number..), and addressable, then this greatly reduces the reusability of types and would make it easy to lose a specific iteration.
- This also could cause a lot of problems for the composability of types. Entity types could have their definitions implicitly affected by a property or data type being modified, etc.

## Semantic Versioning

This section is going to largely refer to _semantic versioning_ as defined by [semver.org](https://semver.org/), although it should be noted that it doesn't perfectly map to the ways types operate.

### Effects of versioning on Blocks and Embedding Applications

The Types sit in the middle of producers and consumers of data, and unfortunately various types of changes have differing effects on the compatibility for either side.

Importantly, the data in an embedding application can be matched to a type that is ahead of, or behind, the type used by a Block. This means that we are interested in the two following questions:

1.  [**Backwards compatible**] Can old data fit in the new Type (trying to upgrade version of Entity, or trying to read old entities in a new Block)
1.  [**Forwards compatible**] Can new data fit in the old Type (new block trying to read old data, or block creating new data to fit into old type?)

Semantic versioning encapsulates the following:

- Major Version - No guarantees about compatibility with previous versions (_generally_ assumed to be incompatible)
- Minor Version - Guarantees about backwards compatibility with previous versions (_generally_ assumed to **not** be forwards compatible)
- Patch Version - Guarantees about forwards _and_ backwards compatibility with previous versions

This causes an issue when we look at some of the updates we allow on Types, we explore a specific example:

---

#### Adding an Optional Field

Adding an optional field on the type will mean that

- Blocks using the old type **will _not_ be compatible** with new data because the new field will break `additionalProperties: false`. Thus it is a **major change**
  - (There is a separate discussion about only passing the fields to the Block that it requests, but that muddies the waters of this discussion and this case is the simpler way to understand the way compatibility depends on directionality)
- Data using the old type **will be compatible** with the new type, as they will just hit the empty branch of the Option. Thus it is a **minor change**

Thus, adding an optional field is "backwards compatible" but not "forwards compatible". (In the standard way of viewing semver this would be a **minor change**)

#### Removing an Optional Field

Removing an optional field on the type will mean that

- Blocks using the old type **will be compatible** with new data because the new data will just hit the empty branch of the Option. Thus it is a **minor change**
- Data using the old type **will _not_ be compatible** with the new type because the new type does not validate against data where it was _not_ the empty branch of the Option. Thus it is a **major** change.

Thus removing an optional field is "forwards compatible" but not "backwards compatible". (In the standard way of viewing semver, the only option would be to mark this as a **major change**)

---

The two cases above highlight a weakness of using semver in our environment, as we care about identifying forward but not backwards compatible changes, and the semantic version does not traditionally capture this. As such we explored a potential solution by tracking two versions.

### Combined Versions

A potential solution to the problems caused by the above is to store a pair of semantic versions. If we specify type versions as the _ordered_ pair `(P, C)`, where `P` is the semantic version according to the producer, and `C` is the semantic version according to the consumer then both sides are able to track compatibility.

Example:

A new type:

```json
{
  "P": "1.0.0",
  "C": "1.0.0"
}
```

An optional field is added to the Type

```json
{
  "P": "1.1.0",
  "C": "2.0.0"
}
```

An optional field is removed from the Type

```json
{
  "P": "2.0.0",
  "C": "2.1.0"
}
```

This allows us to compare the versions depending on the circumstance outlined above, where we're trying to track forwards or backwards compatibility. In addition to being a rather unintuitive and confusing solution, this still has a few large problems.

### Other Problems

- As outlined above, we start with a type, add an optional field, and then remove an optional field. This _should_ theoretically be the same type as the previous one (outside of versioning info), although semver tells us that there was a major change between them, and as such we are not able to infer compatibility from the versioning information. _Because of this, we'll almost always need to check compatibility regardless_
- Updating a **major** version of a deeply nested type, for instance a data type, will require **major** version changes to all types using it (if they wish to update). This is deeply in contrast to most uses of semver like versioning libraries. In those cases, major versions of sub-dependencies often cause the need to update some internal logic, but these breaking changes to not propagate up the dependency chain. If we used semver for types, we'd sometimes see propagating major version changes, causing very large major versions in the higher-level types with lots of dependencies. This is a problem because the major appeal of semantic versioning would be the assumptions an implementation could make about compatibility in non-major version differences.

## Other Decisions

### Versioned vs Base URLs in Types

- `$schema` needs to be versioned as it uniquely identifies the instance of the schema and makes it referenceable
- Similarly, uses of `$ref` need to use versioned URLs so they can reference a specific iteration of the schema
- Properties inside objects use _base_ URLs because otherwise _any_ version of an entity type would always be incompatible with another version of an entity type, as the keys in the underlying possible entities wouldn't match
- The items in `links` are _versioned_ URLs because they do _not_ affect the underlying data structure of an entity. Furthermore the format of `links`, and the associated constraints, don't actually use `$ref` at the moment, so using a _base_ URL would link the entity type to some undetermined version of the link type. This could cause problems if a new version of a link type majorly changes the semantic meaning.

### Trailing slashes on Base URLs

Various implementations of URL resolution have different behaviors when resolving a URL with a trailing slash vs without one.
Often "join"ing a URL that doesn't end in a trailing slash, and another path component, will _replace_ the last path component of the URL.
Due to this, we opt to require that all Base URL's end in a trailing slash, and joining a Base URL with the `v/${version}` path component will always result in the intended state.

# Prior art

[prior-art]: #prior-art

- [Semantic Versioning](https://semver.org)

# Unresolved questions

[unresolved-questions]: #unresolved-questions

- [x] How should we constrain valid URL formats
  - [x] How should the version be formatted? Should we use query parameters?
  - [x] Should it be possible to go to a URL _without_ expressing a version, if so should returning the latest version be the expected behavior
  - [x] Do we want to reserve some suffix such as `/latest`

# Future possibilities

[future-possibilities]: #future-possibilities

- We can publish a Block Protocol package (or many) for validation of Types
- We can update the specification to provision for working drafts of Types, perhaps allowing for tagged versions that encapsulate Alpha/Beta/Unstable releases, etc.
