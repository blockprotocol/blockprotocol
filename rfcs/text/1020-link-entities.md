Feature Name: link-entities
Start Date: 2023-02-23
First Published: 2023-06-28
RFC PR: https://github.com/blockprotocol/blockprotocol/pull/1020
RFC Discussion: https://github.com/blockprotocol/blockprotocol/discussions/1300

---

# Summary

[summary]: #summary

This RFC proposes a reworking of how links are handled within the Block Protocol Graph module.

The [Graph Type System RFC](https://github.com/blockprotocol/blockprotocol/blob/main/rfcs/text/0352-graph-type-system.md) introduced the concepts of:

- Data Types
- Property Types
- Entity Types
- Link Types

In this proposal, it's suggested to remove _link types_, and re-implement them as special cases of _entity types_.
It's also suggested that a _link_ is redesigned to be special case of an _entity_.

# Motivation

[motivation]: #motivation

## Preface: Edges within the graph

At the moment, the Type System is a fairly 'complete' system.
The primitives defined within it are capable of being composed together to model highly complex graph topologies, and arbitrary JSON within an entity's properties.

Such representations are encoded through references between elements, an entity type referring to a property type within its schema for example.
These inter-element references are the glue that makes up the graph and as such will be referred to as "edges".

> **Note**: The term "edge" is distinct from "link", it is used here to refer to the relationship between two graph elements which include elements of the type system _as well as_ entities.

At the present, the following kinds of edges exist (as well as their respective reversed edges, which are omitted for brevity):

- Entity Type -> Link Type (constrains the types of links that can come from an entity)
- Entity Type -> Entity Type (constrains the types of entities that can be linked to from an entity)
- Entity Type -> Property Type (constrains the properties that can appear on an entity)
- Property Type -> Property Type (constrains the types of properties that can appear within an object in another property)
- Property Type -> Data Type (constrains the type of data that can be stored within a property)
- Entity -> Entity Type (describes the associated entity type of an entity)
- Entity -> Link (identifies a link as one that is outgoing from this entity)
- Link -> Entity (identifies an entity as the target of this link)

## Creating Higher-order abstractions through composition of the primitives of the type system

### Groups

Due to the compositional design of the primitives of the Type System, it's possible to create high-order abstractions within the system.
For example, one could want to define "groups" of entities within their system, in such a way that they would be programmatically resolvable through blocks, _with constraints guaranteed by the specification_.

One could currently do this by creating a "Group" entity type, and an associated "Has Element" link type.
They could then create a specific "Group" entity, and link it to the entities they wish to be part of the group by creating "Has element" links to existing entities:

```text
                      ┌─────┐
     ┌────────────────┤Group├────────────────┐
     │                └┬───┬┘                │
     │                 │   │                 │
     │                 │   │                 │
     │            ┌────┘   └────┐            │
     │            │             │            │
     │            │             │            │
     │            │             │            │
Has element  Has element   Has element  Has element
     │            │             │            │
     │            │             │            │
     ▼            ▼             ▼            ▼
    ┌─┐          ┌─┐           ┌─┐          ┌─┐
    │A│          │B│           │C│          │D│
    └─┘          └─┘           └─┘          └─┘
```

Being able to create such abstractions is a powerful feature of the Type System, as users are able to implicitly benefit from some of the following scenarios:

- A user updates entity `A`, the link is still associated with the new version
  - Made possible by the fact that the Block Protocol preserves entity _identity_ across update operations, and link endpoints are dependent on the identity of the entities.
- A user deletes entity `A`, the Embedding Application (EA) knows that a link has been invalidated and is able to orchestrate/trigger a resolution flow
  - This is a _possibility_ as the Block Protocol requires EAs to be aware of the linking primitives. Should a user have decided to store an `EntityId` in some arbitrary property (or some less straightforward identifier), it is not reasonable to expect an EA to have recognized that information through introspection, and to check for its ongoing validity.
- A user redefines the destination constraints of `Has element` links on the `Group` entity type to disallow entities of type `D`.
  The EA can identify that the `D` entity breaks validation, and is able to orchestrate/trigger a resolution flow
  - Again a _possibility_ for similar reasons to above, where the EA is aware of the linking primitives, including the associated constraints; making it a reasonable expectation that such conditions are verified and enforced on an ongoing basis.

### Paths

One might think a similar approach could be taken to define a "Path" entity type, also utilizing an associated "Has Element" link type.

Take the following simple subgraph of 4 entities, (`A`, `B`, `C`, and `D`), with a set of some links connecting them as follows:

```text
             ┌─┐
        ┌──► │B│ ───┐
┌─┐     │    └─┘    │     ┌─┐
│A│ ────┤           ├───► │D│
└─┘     │    ┌─┐    │     └─┘
        └──► │C│ ───┘
             └─┘
```

Now, we could apply the same strategy as above, and create a "Path" entity type, and an associated "Has Element" link type.
They could then use the _order_ of the "Has Element" links to maintain an ordered collection of the entities that make up the path.
They could therefore define a path from `A` to `B` to `C` as follows:

```text
               ┌─────┐
     ┌─────────┤Path ├─────────┐
     │         └──┬──┘         │
     │            │            │

Has element  Has element  Has element

     │            │            │
     │            │            │
     │            │            │
     │            ▼            │
     │           ┌─┐           │
     ▼      ┌──► │B│ ───┐      ▼
    ┌─┐     │    └─┘    │     ┌─┐
    │A│ ────┤           ├───► │D│
    └─┘     │    ┌─┐    │     └─┘
            └──► │C│ ───┘
                 └─┘
```

Unfortunately, expressing a path as a list of entities falls apart when looking at cases where a pair of entities has multiple links between them.
Take the following scenario with three entities, (`A`, `B`, and `C`), and three links (`1`, `2`, and `3`) between them:

```text
┌─┐  ┌─1──► ┌─┐         ┌─┐
│A│ ─┤      │B│ ───3──► │C│
└─┘  └─2──► └─┘         └─┘
```

Defining a path as the ordered collection [`A`, `B`, `C`] becomes ambiguous, as it's unclear if the path is

- `A` -- `1` -> `B` -- `3` -> `C`, or
- `A` -- `2` -> `B` -- `3` -> `C`.

Under the current constraints of the system, it is not possible to build an abstraction (using the primitives of the system) that differentiates between the two paths.
This is due to the fact that links cannot be referenced within the graph, relationships between entities can be expressed with links, but relationships between links are not capturable.
This can be solved by making links _into_ entities (thus allowing link entities to reference other link entities), as described below in the explanation sections.

## Properties on links

There are many situations whereby a user might want to associate additional information with the link between two entities.
Take some of the following scenarios:

- Associating a `Location` with a `Marriage` link between to `Person` entities
- Associating a `Date` with a `Marriage` link between to `Person` entities
- Associating a `Contract` with an `Employment` link between a `Person` entity and an `Organization` entity
- Associating a `Role` with a `Membership` link between a `User` and an `Organization` entity

Within the current system, links do not have properties.
A few potential (albeit problematic) ways to get around this in the current system are explored in further detail in the [Rationale and Alternatives](#rationale-and-alternatives) section below.

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

In brief, this RFC removes the current definition of _link types_, and extends the definition of an _entity type_, and of an _entity_, as follows:

## Entity Types

An ontology type (element of the Type System), represented as a JSON schema, that defines the structure of an entity, its link entities and their endpoints.

### Link Entity Types

A _link entity type_ is an entity type which includes the following field in its schema:

```json5
"allOf": [
  {
    "ref": "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1"
  }
]
```

The reasoning for this representation is explored in slightly more detail in the [Reference-level explanation](#reference-level-explanation) section below, but at a high-level this is just a marker annotation at the moment, although it will hopefully be future compatible with [type inheritance](https://github.com/blockprotocol/blockprotocol/pull/428).

## Entity

As previously defined in the spec, an _entity_ is a combination of **metadata** and **properties**.
An example of one is:

```json5
{
  properties: {
    "https://example.com/@example/types/property-type/shortname/": "Bob",
  },
  metadata: {
    recordId: {
      entityId: "c6f0f771-b30b-4557-8979-e339006ac793",
      editionId: "8add2c02-6295-4c6b-b079-849f3c403ad7",
    },
    entityTypeId: "https://example.com/@example/types/entity-type/user/v/1",
  },
}
```

### Link Entity

A _link entity_ is a special kind of entity that represents a link between two other entities.
It contains an additional field (alongside `"properties"` and `"metadata'`) `"linkData"` which looks like the following:

```json5
"linkData": {
  "leftEntityId": "a28041f9-f8c5-4275-a601-ac5cb0d57a0d",
  "rightEntityId": "6d7fdb6c-f519-4554-a6d7-485c818c7a63",
  "leftToRightOrder": 2
  "rightToLeftOrder": 10
},
```

The fields within `"linkData"` are as follows:

- `"leftEntityId"`: The `entityId` of the entity on the "left" hand side of the link entity. In most scenarios this will be the "source" of the link entity.
- `"rightEntityId"`: The `entityId` of the entity on the "right" hand side of the link entity. In most scenarios this will be the "target" of the link entity.
- `"leftToRightOrder"`: A value used to order this link entity against other link entities of the same type with the same `leftEntityId`.
- `"rightToLeftOrder"`: A value used to order this link entity against other link entities of the same type with the same `rightEntityId`.

The choice of "left" and "right" as opposed to "source" and "target" is an optimistic attempt to leave room for an extension of the system in the future to allow for "bidirectional" links (where a "source" and "target" would not make sense).

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

## Extending the Entity Type definition to allow for Link Entity Types

### The marker annotation

It will be necessary to define some form of indicator inside an entity type schema to identify it as a link entity type.
Keeping in mind the potential of future type inheritance, this RFC opts to achieve this by allowing an additional field on entity types which conforms to the following JSON schema:

```json5
"allOf": {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "$ref": {
        "type": "string",
        "const": "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1"
      }
    },
    "required": ["$ref"]
    "additionalProperties": false
  }
},
```

At the present, the only reference allowed within the `allOf` will be a reference to an entity type with the following schema:

```json5
{
  kind: "entityType",
  $id: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
  type: "object",
  title: "Link",
  properties: {},
  additionalProperties: false,
}
```

Seeing the presence of

```json5
"allOf": [
  {
    "ref": "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1"
  }
]
```

within an entity type will be an indicator that it is a link entity type.

### An example

In the future, this `allOf` array may be used for inheritance of types, whereby it would be necessary to resolve the types that are inherited from to see if any of those are a link entity type ([see the RFC proposing an inheritance mechanism](https://github.com/blockprotocol/blockprotocol/pull/428)).
For now, it is a simple marker annotation.

This is an example of a valid link entity type under the proposal:

```json5
{
  kind: "entityType",
  $id: "https://example.com/@example/types/entity-type/marriage/v/1",
  type: "object",
  title: "Marriage",
  allOf: [
    {
      ref: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
    },
  ],
  properties: {},
  additionalProperties: false,
}
```

## Extending the Entity definition to allow for Link Entity Types

### `linkData`

The definition of an entity is extended to allow for the presence of a `"linkData"` field which conforms to the following schema:

```json5
"linkData": {
  "type": "object",
  "properties": {
    "leftEntityId": {
      "type": "string",
    },
    "rightEntityId": {
      "type": "string",
    },
    "leftToRightOrder": {
      "type": "integer",
      "minimum": 0
    },
    "rightToLeftOrder": {
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["leftEntityId", "rightEntityId"],
  "additionalProperties": false
}
```

#### "Left" and "Right"

At the present, the system specifies unidirectional links, that is, links that go in a single direction from one entity to another entity.
When modelling knowledge, it can be very helpful to model that a relationship goes in both directions, or that there is an equivalent inverse relationship.
At the present, how this will be solved, if it will, is unknown; however, to hopefully avoid breaking changes in the future, this proposal opts to adopt terms which have weaker implications of directionality, thus "left" and "right".

Until directionality is explored further, "left" should be taken to be the "source" of the link, and "right" should be taken to be the "target" of the link.

#### Defining the endpoints of a link entity

- `"leftEntityId"`: The `entityId` of the entity on the "left" hand side of the link entity
- `"rightEntityId"`: The `entityId` of the entity on the "right" hand side of the link entity

# Drawbacks

[drawbacks]: #drawbacks

- Discussing this proposal with people has shown that this isn't a straight-forward intuitive model, it may introduce a barrier for people understanding the system.

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

## Don't do anything

The system _could_ function without this extension, however it would be comparatively significantly limited in expressiveness.
The implementation changes required to support this are actually fairly small, and it actually removes a large amount of implementation complexity on the current link primitives, removing graph methods such as `createLink`, etc.
Not making the change seems like a poor choice.

## Add properties to links

One of the things that this proposal achieves is the ability to add properties to links.
Therefore, one potential alternative is to add properties to links, _without_ turning links into entities.
By itself, this would not enable the higher-order-abstractions such as paths, and instead would introduce more complexity to the current links surface.
It would be unclear when to model something as a link, or an entity, and we would likely need to extend the system with the ability to translate between them in the future.
It would also greatly increase the implementation surface area, with backends needing to support more type validation, different storage schemas, etc.

## Let links reference links

The other main thing this proposal achieves is the increased expressiveness of the system, wherein it can model higher-order abstractions such as paths.
This could be achieved by allowing links to reference links, not just entities.
However, this has a similar problem to the previous alternative, in that it would become unclear as to what the difference between a link and entity is.
The implementation complexity would increase, as endpoints wouldn't be defined as just _entity_ IDs, and would need to include link IDs, presumably with a discriminant.
Storage models of EAs would be more complex too, storing references between disjoint classes of elements, etc.

# Prior art

[prior-art]: #prior-art

This is somewhat similar to the primitives of [RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework) — even if not idiomatic in [RDFS](https://en.wikipedia.org/wiki/RDF_Schema) — where relationships are nodes that can also be subjects or predicates of other triples. Meaning that 'links' modelled in RDF can be the same primitive as 'entities' (although interestingly also properties).

# Unresolved questions

[unresolved-questions]: #unresolved-questions

At this point, we are unaware of any.

# Future possibilities

[future-possibilities]: #future-possibilities

- It is possible that the standard library could be extended to support higher-order-abstractions (if they are included in some set of recommended types by the Protocol), especially `Path`s as these could benefit from support for ergonomics in user-facing code, and optimization of backend implementations.
