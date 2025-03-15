Feature Name: graph-type-system
Start Date: 2022-06-14
First Published: 2022-07-04
RFC PR: https://github.com/blockprotocol/blockprotocol/pull/352
RFC Discussion: https://github.com/blockprotocol/blockprotocol/discussions/418

---

# Summary

[summary]: #summary

This RFC proposes changing the way data structural requirements are expressed within the BP.

Rather than allowing any free-form JSON schema, this RFC defines the following classes of constrained JSON schemas:

- Data Types
- Property Types
- Link Types
- Entity Types

These elements are used in combination to improve reusability of, and better define, expressions of data structural requirements.

The structure of these types are defined by (and can be validated against) their meta-schemas, which can be found in the [reference-level explanation](#reference-level-explanation).

By using the proposed types, blocks, embedding applications, and end-users can all have greater confidence in each other's roles and functionalities, and hopefully will allow them all to benefit from better computational inference and capabilities. Reusability through sharing of descriptions of data should decrease developmental overhead over time, with all members of the ecosystem benefiting from emergent standardization. It's essential for reusability that _sharing_ occurs between users of the Block Protocol - if these types are defined in isolation, it's not possible to facilitate reusability.

The benefits of emergent standardization are, however, greatly dependent on participating members within the ecosystem. Members sharing types and structural requirements (i.e. when creating blocks) enable the full potential of the proposed type system. Allowing proper reusability of descriptions of data is thus gated by the progression of the ecosystem through participation and sharing.

# Motivation

[motivation]: #motivation

The Block Protocol operates in-between parties that otherwise have limited to no communication. A block developer may not even be aware of the existence of a specific embedding application or the data within it, and in some scenarios the developers and owners of an embedding application may not be aware of the existence of a specific block (in the case of dynamic selection and loading at run-time). This is a common occurrence already in technology, whether it be library authors not knowing what projects are built with their work, or developers using libraries without utilizing pathways for communication (online forums or otherwise). This is made possible through encoded contracts: function signatures, documentation, REST APIs, etc. These tools are ways of asynchronously, and often autonomously, declaring one side of the communication channel. In such a system of imperfect information, the standardization of communication mediums is essential to effective function.

By getting both parties to agree to a prescriptive standard, new technological possibilities become viable. The Block Protocol is an example of this, enabling a new class of applications, ones that are able to dynamically load complex front-end components at run-time which are immediately usable and functional, even if the component was previously unknown to the application.

The foundation of this capability is standardizing how requirements are expressed. Most notably, the block and entity schemas expressed through [the graph module](https://blockprotocol.org/spec/graph) allow for dynamic resolution of expected input data.

---

**Example**:

A block expresses that it needs a URL hosting an image (presumably so that it can render it):

```json
{
  "properties": {
    "image_url": "string"
  }
}
```

The embedding application is then able to search across its data to find entities that satisfy this requirement, such as:

```json
{
  "image_url": "https://dummyimage.com/300.jpg",
  ... // some other fields
}
```

It is then able to pass the value to the block, satisfying its requirements for input data.

---

This works most easily when the data uses the same identifier (key in the object) as the block expects, but problems arise if people have different ways of describing compatible data. For example, the embedding application might have an entity that looks like:

```json
{
  "display_picture": "https://dummyimage.com/300.jpg",
  ... // some other fields
}
```

This is an example of a lack of **consensus**, where two parties don't agree on how to describe the data in question. At this point, there isn't a clear route to deciding compatibility. Block schemas could perhaps be modified so that the block could express it needs something that matches a [regex to ensure the URL has an image extension](https://stackoverflow.com/questions/42853961/regex-that-matches-image-links-but-exclude-normal-url), and the embedding application could ignore the key and just match on values, but this:

- is potentially flakey ([here's an example](https://dummyimage.com/300) of a URL that points to an image but _does not_ have an extension)
- ends up being very domain-specific
- introduces a large maintenance burden
- is generally not reusable, possibly leading to similar bespoke logic being defined in multiple places, with possible subtle but incompatible variations

Thus the main reason for the following RFC:

> 💬 Removing some flexibility to establish a stronger contract between the block developer, embedding application, and end-user, allows for more powerful run-time inference and general confidence of all parties. Furthermore, creating a well-defined hierarchy of types, that are reusable and discoverable, encourages emergent standardization and, in turn, leads to higher-quality interoperable parts.

In the following document we outline an approach to being more specific about the types that describe data. Through the following definitions of types, the community will be able and more likely to **gradually converge** upon a **consensus** of how to describe information.

## Motivating implications

**embedding applications**, where types are shared with blocks, and property types shared across entity types:

- are required to do less guesswork about what the block is asking for
- require less user intervention (or hard-coded logic/guesses) to map X to Y

**blocks**, where they share types with embedding applications:

- have greater confidence that the data passed to them is correct and useable
- are able to be more specific about their requirements and more easily express the function of the data
  - This also facilitates more powerful composition as there's greater confidence about other parties' data semantics.

**Data Producers** (whether that be end-users, EA developers, or businesses):

- have a toolkit to better describe the data they're producing and to help them be explicit about semantic meaning
- benefit from a community-driven description of knowledge, potentially removing barriers of communication between domains

# Guide-Level explanation

[guide-level-explanation]: #guide-level-explanation

## Goals

Given the motivation above and some other implications of the current design, this RFC attempts to:

1.  make descriptions of data **discoverable**, **reusable**, and **composable**
2.  remove the few instances where the specification currently misuses (modifies in a breaking way) JSON schema

As well as addressing these existing shortcomings, this RFC seeks to:

3.  define a constrained type system that is able to describe any JSON object structure
4.  refine the current way of defining links between entities, encapsulating the approach within the type system

## Types

Underpinning this proposal is the definition of four classes of "types". One of these classes is an extension of the current definition of an _Entity Type_ while the other three are new classifications that are designed to improve the usability and expressiveness of _Entity Types_.

### Data Types

A **Data Type** describes a space of possible valid _values_. For instance, the _string_ value `"foo"` might be an instance of a `Text` Data Type, or a _float_ value `0.6` might be an instance of a `Number` Data Type ("instance of" means that the value satisfies the constraints expressed on the Data Type, or alternatively you can view it as saying the value is within the value space of the Data Type).

> 💬 The underlying value's representation will depend on the implementation environment, different languages and technologies may store these differently.

A Data Type is composed of the following:

- a **required** `$id`, which is a globally unique identifier, where the Data Type's definition can be accessed (in most cases this will be a URL)
- a **required** `kind` that should be set to `"dataType"`, to specify the kind of type being defined
- a **required** `title`, which should generally be a non-pluralized short description of the Data Type (for example: "Number" not "Numbers")
- **optionally** a `description` to further explain the semantic meaning of the Data Type
- a **required** definition of its possible value

#### Primitive Top-Level Data Types

We pre-define a set of primitive top-level Data Types.
These can be considered the least restrictive value spaces:

- `Text`
- `Number`
- `Boolean`
- `Null`
- `Object`
- `Empty List` (see [here](#including-an-empty-list-data-type) for why this is a top-level Data Type)

#### Creating new Data-Types

Due to the size of this RFC, creating new data-types has been deemed out-of-scope and a [follow-up RFC](https://github.com/blockprotocol/blockprotocol/pull/355) is in the works to spec out how this could work. Please consult it for plans on introducing a suite of Data Types including ones like `Date`, `Positive Number`, etc.

### Property Types

A **Property Type** is a description of a named piece of data, including its possible values. A Property Type is composed of the following:

- a **required** `$id`, which is a globally unique identifier, where the Property Type's definition can be accessed (in most cases this will be a URL)
- a **required** `kind` that should be set to `"propertyType"`, to specify the kind of type being defined
- a **required** `title`, which should generally be a non-pluralized description of the property (for example: "Address" not "Addresses")
- **optionally** a `description` to further explain the semantic meaning of the Property Type
- a **required** definition of its possible values

**Defining the possible values of a property**

#### Data Types

A Property Type can have plain data as its value, which it can define by using a Data Type.

**Example 1**

The `Favorite Quote` Property Type could define its value as being an instance of the `Text` Data Type.

- Sample data when used in (simplified view of) an Entity

  ```json
  {
    "http://.../favorite-quote": "He who controls the spice controls the universe"
  }
  ```

**Example 2**

The `Age` Property Type could define its value as being an instance of the `Number` Data Type.

- Sample data when used in (simplified view of) an Entity

  ```json
  {
    "http://.../age": 67
  }
  ```

#### Objects

A Property Type can also have an object made up of other properties as its value. These properties are defined by using Property Types, where when using one it's also possible to define:

- that there is a list of properties
  - that the list has a minimum amount of values
  - that the list has a maximum amount of values
- that a property is **required**

**Example 1**

The `Contact Information` Property Type could define its value as being an object which has an `E-mail` property and a **required** `Phone Number` property.

- Sample data when used in (simplified view of) an Entity

  Assuming that `E-mail` and `Phone Number` accept instances of `Text`, although these would likely be defined with more complicated constraints in a future iteration

  ```json
  {
    "http://.../contact-information": {
      "http://.../email": "leto.atreides@example.com",
      "http://.../phone-number": "020-7946-0999"
    }
    ...
  }
  ```

**Example 2**

The `Interests` Property Type could define its value as being an object which has a `Favorite Film` property, a `Favorite Song` property, and _a list_ of `Hobby` properties.

- Sample data when used in (simplified view of) an Entity

  Assuming that `Favorite Film`, `Favorite Song`, and `Hobby` all accept instances of `Text`. (Although these would be better expressed as Entities that are linked)

  ```json
  {
    "http://.../interest": {
      "http://.../favorite-film": "Dune (2021)",
      "http://.../favorite-song": "Rocket Man - Elton John",
      "http://.../hobby": [
        "Extreme Ironing",
        "Stone Skipping",
        ...
      ]
    }
    ...
  }
  ```

#### Collection of things

A Property Type can also express that it has a list of things as its value.

> ⚠️ It's important to note that in **most circumstances a Property Type should be expressed as a singular item** as this encourages reusability when sharing and allows the parent object to define whether there is a collection or not.
>
> As such, examples are not provided in this section, refer to the Reference-Level description for more information.

#### Describing multiple possibilities

A Property Type can also express that its value is _either_ something _or_ something else, where "something" and "something else" are defined as outlined above using Data Types or an object definition.

**Example 1**

The `User ID` Property Type could define its value as being _either_ an instance of the `Text` Data Type _or_ an instance of the `Number` Data Type

- Sample data when used in (simplified view of) an Entity

  ```json
  {
    "http://.../user-id": 42088130893
  }
  ```

  or

  ```json
  {
    "http://.../user-id": "c09b1839-8084-4a2d-9713-5d074c9c6ce2"
  }
  ```

**Example 2**

The `Contrived Property` Property Type could define its value as being _either_ an instance of the `Number` Data Type, _or_ an object which has a list with a maximum of 4 `Foo` property values

- Sample data when used in (simplified view of) an Entity

  Assuming that `Foo` accepts an instance of the `Text` Data Type

  ```json
  {
    "http://.../contrived-property": 32
  }
  ```

  or

  ```json
  {
    "http://.../contrived-property": {
      "http://.../foo": ["one", "two"]
    },
    ...
  }
  ```

### Link Types

A **Link Type** is a description of a _directional_ relationship between two things. A Link Type is composed of the following:

- a **required** `$id`, which is a globally unique identifier, where the Property Type's definition can be accessed (in most cases this will be a URL)
- a **required** `kind` that should be set to `"linkType"`, to specify the kind of type being defined
- a **required** `title`, which should be a non-pluralized description of the relationship (for example: "Friend" not "Friends")
- a **required** `description` to further explain the semantic meaning of the relationship
- a **possible** `relatedKeywords`, which is a list of terms that are related to the link type

> 💭 As the next section (Entity Types) will outline, there's an additional step to quantifying the types of things on either end of the relationship, as such the descriptions **should** be very general and most of the time not contain specific words about types (such as person).

**Example 1**

There could be an `Owns` link type with a `description` of "Have (something) as one's own; possess"

**Example 2**

There could be a `Submitted By` link type with a `description` of "Suggested, proposed, or presented by"

### Entity Types

An Entity Type is a description of a particular "thing", made up of identifiable pieces of data. An Entity Type is composed of the following:

- a **required** `$id`, which is a globally unique identifier, where the Entity Type's definition can be accessed (in most cases this will be a URL)
- a **required** `kind` that should be set to `"entityType"`, to specify the kind of type being defined
- a **required** `title`, which should generally be a non-pluralized description of the thing
- **optionally** a `description` to further explain the semantic meaning of the Entity Type
- a **required** definition of its possible properties and links.

#### Defining an Entity Type's Properties

- **Specifying an Entity Type has Property Types** - The data _within_ an Entity is described simply through a set of Property Types

  **Example 1**

  The `Book` Entity Type could contain the Property Types `Name`, a `Published On` and a `Blurb`

  - Sample (simplified) data assuming that

    - The `Name`, `Published On`, and `Blurb` Property Types all have values that are instances of the `Text` Data Type

    ```json
    {
      "http://.../name": "The Time Machine",
      "http://.../published-on": "1895-05",
      "http://.../blurb": "brulb"
    }
    ```

- **Specifying properties are required** - The Entity Type can also define which of its properties are **required**, _note: properties are **optional** by default_

  **Example 1**

  The `Blog Post` Entity Type could contain the **required** Property Types `Title`, `Author`, and `Contents`, and the **optional** Property Type `Category`

  - Sample (simplified) data assuming that

    - The `Title`, `Author`, `Contents`, and `Category` Property Types all have values that are instances of the `Text` Data Type

    ```json
    {
      "http://.../title": "Making the web better. With blocks!",
      "http://.../author": "Joel Spolsky",
      "http://.../contents": ..., // omitted for brevity
      "http://.../category": "News"
    }
    ```

    or

    ```json
    {
      "http://.../title": "The non-negotiable principle",
      "http://.../author": "David Wilkinson",
      "http://.../contents": ..., // omitted for brevity
    }
    ```

- **Specifying there is a list of properties** - The Entity Type can also define whether its properties are lists, where

  - the elements of the list are described by a Property Type
  - there is an optionally specified _maximum_ amount of items in the list
  - there is an optionally specified _minimum_ amount of items in the list

  **Example 1**

  The `Car` Entity Type could contain the Property Types `Make`, `Model`, `Year`, `Brake Horsepower`, and a list of `Extra Trim`

  - Sample (simplified) data assuming that

    - The `Model`, `Make`, `Spec`, and `Year` Property Types all have values that are instances of the `Text` Data Type
    - The `Extra Trim` Property Type is a list where the list items are instances of the `Text` Data Type
    - The `Brake Horsepower` Property Type has a value that is an instance of the `Number` Data Type

    ```json
    {
      "http://.../make": "Mercedes-Benz",
      "http://.../model": "300 SL",
      "http://.../year": "1957",
      "http://.../brake-horsepower": 222,
      "http://.../extra-trim": ["Leather Seats", "Cream and Red"]
    }
    ```

#### Defining Relationships between Entities

Entity Types can also express the types of relationships they have with other things.

- **Specifying an Entity Type has outgoing Links** - The links going _from_ an Entity are described as a set of Link Types

  **Example 1**

  The `Book` Entity Type could contain the Property Types outlined above, and a `Written By` link

  - Sample (simplified) data with the same assumptions as outlined above

    ```json
    [
      // Person entity
      {
        "entityId": 111,
        "properties": {
          "http://.../name": "Herbert George Wells",
          ...
        }
      },
      // Book Entity
      {
        "entityId": 112,
        "properties": {
          "http://.../name": "The Time Machine",
          "http://.../published-on": "1895-05",
          "http://.../blurb": "brulb",
          ...
        },
        "links": {
          "http://.../written-by": 111 // referring to the Person entity ID
        }
      }
    ]
    ```

  **Example 2**

  The `Building` Entity Type could contain some Property Types, a `Located At` link, and a `Tenant` link

  - Sample (simplified) data with the same assumptions as outlined above

    ```json
    [
      // UK Address entity
      {
        "entityId": 113,
        "properties": {
          "http://.../address-line-1": "Buckingham Palace",
          "http://.../postcode": "SW1A 1AA",
          "http://.../city": "London",
          ...
        }
      },
      // Organization entity
      {
        "entityId": 114,
        "properties": {
          "http://.../name": "HASH, Ltd.",
          ...
        }
      }
      // Building entity
      {
        "entityId": 115,
        "properties": {
          ...
        },
        "links": {
          "http://.../address": 113, // referring to the UK Address entity ID
          "http://.../tenant": 114 // referring to the Organization entity ID
        }
      }
    ]
    ```

- **Specifying that a Link is required** - The Entity Type can also define that some of its links are **required**, _note: links are **optional** by default_

  **Example 1**
  The `Bank Account` Entity Type could have a **required** `Maintained By` link

  - Sample (simplified) data

    ```json
    [
      // Bank entity
      {
        "entityId": 211,
        "properties": {
          "http://.../name": "Iron Bank of Braavos"
        }
      },
      // Bank Account entity
      {
        "entityId": 212,
        "properties": {
          "http://.../sortCode": 100000,
          "http://.../accountNumber": 31510604
        },
        "links": {
          "http://.../maintainedBy": 211
        }
      }
    ]
    ```

- **Specifying there is a List of Links** - The Entity Type can also express that it can have multiple outgoing links of the same type

  **Example 1**

  The `Person` Entity Type could contain some Property Types, and multiple `Friend Of` links

  - Sample (simplified) data

    ```json
    [
      // Person entities
      {
        "entityId": 311,
        "properties": {
          "http://.../name": "Alice"
        }
      },
      {
        "entityId": 312,
        "properties": {
          "http://.../name": "Bob"
        }
      }
      {
        "entityId": 313,
        "properties": {
          "http://.../name": "Charlie"
        },
        "links": {
          "http://.../friend-of": [311, 312] // referring to the Person entity IDs, where the array ordering is unstable
        }
      }
    ]
    ```

- **Specifying there is an Ordered List of Links** - The Entity Type can also express that its outgoing links (of the same type) are ordered

  **Example 1**

  The `Playlist` Entity Type could contain some Property Types, and an _ordered_ list of `Contains` links

  - Sample (simplified) data

    ```json
    [
      // Songs
      {
        "entityId": 412,
        "properties": {
          "http://.../name": "Rocket Man",
          ...
        }
      },
      {
        "entityId": 413,
        "properties": {
          "http://.../name": "Du Hast",
          ...
        }
      },
      {
        "entityId": 414,
        "properties": {
          "http://.../name": "Valley of the Shadows",
          ...
        }
      },
      // Playlist
      {
        "entityId": 415,
        "properties": {
          "http://.../name": "Favorite Songs",
        },
        "links:": {
          "http://.../contains": [412, 414, 413], // referring to the song entity IDs, ordering is intentional and stable
          ...
        }
      }
    ]
    ```

  **Example 2**

  The `Page` Entity Type could contain some Property Types, a `Written By` link, and an _ordered_ list of `Contains` links

  - Sample (simplified) data

    ```json
    [
      // Paragraph Entity
      {
        "entityId": 416,
        "properties": {
          "http://.../text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit nisl et velit porta, eget cursus nulla fermentum. Aenean in faucibus velit, at cursus quam. Proin scelerisque quam id erat semper egestas.",
          ...
        }
      },
      // Heading Entity
      {
        "entityId": 417,
        "properties": {
          "http://.../name": "Duo Reges: constructio interrete.",
          ...
        }
      },
      // Divider Entity
      {
        "entityId": 418,
        "properties": {
          "http://.../width": "full",
          ...
        }
      },
      // User Entity
      {
        "entityId": 419,
        "properties": {
          "http://.../name": "Alice",
          ...
        }
      }
      // Page Entity
      {
        "entityId": 420,
        "properties": {
          "http://.../name": "Lorum Ipsum",
          ...
        },
        "links": {
          "http://.../written-by": 419, // referring to the User entity ID
          "http://.../contains": [417, 416, 418] // referring to IDs of the various types of page contents above
        }
      }
    ]
    ```

## JSON Schema additions

The proposed type system will make use of several non-standard JSON Schema keywords to add explicitness and allow for new semantics within the schemas.

The `kind` keyword will be used to identify the kind of the schema being described. The value of `kind` must be one of:

- `entityType`
- `propertyType`
- `dataType`
- `linkType`

The `links` keyword will be used to allow Entity Type schemas to define links. The value of `links` is an object, whose keys are URLs (that point to Link Types). Values of `links` are also objects, which can optionally define extra constraints on the link (for more information see the [Reference-Level explanation](#reference-level-explanation)).

The `requiredLinks` keyword will be used to specify which links are required to be present for a given Entity Type. It is a list of URLs.

In JSON Schema `title` and `description` are described as follows: "Both of these keywords can be used to decorate a user interface with information about the data produced by this user interface".
We repurpose these with slightly different meanings:

The `description` keyword for Link Types adds semantic meaning to a link (which could be encapsulated in a custom vocabulary specification for the meta schemas).

The `title` keyword refers to the name of the Type it is describing.

The `$ref` keyword when used to refer to Property Types, Data Types, and Link Types URLs will always need to be equal to the key of the object which it is defined under (and vice versa). If the `$ref` is within an array's `items` definition, the URL should equal the nearest JSON Schema property name which is a URL. This is so that the property, data, or link type can be identified from an instance conforming to it (which it could not if the key, i.e. the property name, were different from the `$ref`).

## Using the Types in the Block Protocol

> 💭 This section has been kept purposefully brief, as in-depth discussion of implications has been reserved for the Reference-Level Explanation due to heavy reliance on technical details

### Interfacing with properties on Entities

As the `title` of a Property Type is not guaranteed to be globally unique, the representation of entities is likely going to need to change, especially with regards to changing the keys to be the Property Type URLs:

**An example of an entity in the current system:**

```json
{
  "name": "Arthur Philip Dent",
  "age": 30,
  "planetOfOrigin": "Earth",
  "occupation": "Intergalactic Traveler"
}
```

**A simplified example of an entity in the proposed system:**

```json
{
  "http://example.com/property-types/name": "Arthur Philip Dent",
  "http://example.com/property-types/age": 30,
  "http://example.com/property-types/planetOfOrigin": "Earth",
  "http://example.com/property-types/occupation": "Intergalactic Traveler"
}
```

> 💭 Acknowledgement: This is less ergonomic than the current state of things; this drawback among others, is explored with some possible mitigations in the [Drawbacks](#drawbacks), [Rationale and Alternatives](#rationale-and-alternatives), and [Future Possibilities](future-possibilities) sections

This will have an impact on how developers:

- **access** fields in entities
- format properties when they **create** entities
- format properties when they **update** entities

### Interfacing with Linked Entities

#### Receiving Links and Linked Entities

Links will likely continue to be returned in a separate collection alongside entities when blocks receive data. The data within the `linkGroups` object might change to incorporate the new type information, likely with the `path` field being replaced with something that uses the link type's URL.

#### Creating Links

The Link Functions will be updated to handle Link Types, removing the `path` fields and instead use the URL of the Link Type.

### Block Schemas

Block schemas will need to be updated to be built using the types outlined above. The specifics of this are explored in-depth in the Reference-Level explanation, however the basic premise is that instead of writing new property constraint definitions inline in every block schema, the properties and links should be defined as references to their respective types. If a type does not exist for a given property then it will need to be created, and so on.

### Structure-based Queries

Queries on the structure of data (those which do not directly reference an exact Entity Type), such as `AggregateEntities`, `AggregateEntityType` and any future methods the Block Protocol supports, behave somewhat similarly to expressing a type. Requiring combinations of properties, constraints, etc. will need to refer to the respective Property Types, Link Types, etc.

### Link Constraints

This RFC does not currently mention ways of constraining the destination of a Link Type used in an Entity Type. **This is different from current way of handling things**. The detailed reasoning for removing this, and a potential solution, is outlined in a [follow-up RFC](https://github.com/blockprotocol/blockprotocol/pull/354).

### Interfacing with Types

The largest change (in terms of the number of interfaces modified) is unsurprisingly the updates that will need to be made to the Entity Type functions.

- The Type objects will be updated to capture the new structures and references between them
- New `create`, `get`, `update`, and `delete` methods will need to be made for Property Types and Link Types
- A new `get` method will need to be made for Data Types (as they are not user-defined, they do not require full CRUD yet.)
- The error conditions of the Type methods will be updated to include further validation errors that include but are not limited to:
  - referencing a type that isn't in the embedding application
  - submitting a type that is malformed

# Reference-Level explanation

[reference-level-explanation]: #reference-level-explanation

## Data Types

A **Data Type** is a JSON schema that satisfies the following JSON meta-schema:

```json
{
  "$id": "https://blockprotocol.org/types/modules/graph/0.3/schema/data-type",
  "description": "Specifies the structure of a Data Type",
  "type": "object",
  "properties": {
    "kind": {
      "const": "dataType"
    },
    "$id": { "type": "string", "format": "uri" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "type": { "type": "string" }
  },
  "required": ["kind", "$id", "title", "type"]
}
```

### Primitive Top-Level Data Types

This RFC defines the following primitive top-level Data Types

- `Text`

  ```json
  {
    "kind": "dataType",
    "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/text",
    "title": "Text",
    "description": "An ordered sequence of characters",
    "type": "string"
  }
  ```

- `Number`

  ```json
  {
    "kind": "dataType",
    "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/number",
    "title": "Number",
    "description": "An arithmetical value (in the Real number system)",
    "type": "number"
  }
  ```

- `Boolean`

  ```json
  {
    "kind": "dataType",
    "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/boolean",
    "title": "Boolean",
    "description": "A True or False value",
    "type": "boolean"
  }
  ```

- `Null`

  ```json
  {
    "kind": "dataType",
    "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/null",
    "title": "Null",
    "description": "A placeholder value representing 'nothing'",
    "type": "null"
  }
  ```

- `Object`

  ```json
  {
    "kind": "dataType",
    "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/object",
    "title": "Object",
    "description": "A plain JSON object with no pre-defined structure",
    "type": "object"
  }
  ```

- `Empty List`

  ```json
  {
    "kind": "dataType",
    "$id": "https://blockprotocol.org/@blockprotocol/types/data-type/empty-list",
    "title": "Empty List",
    "description": "An Empty List",
    "type": "array",
    "const": []
  }
  ```

### Creating new Data Types

Due to the size of this RFC, creating new Data Types has been deemed out-of-scope and a [follow-up RFC](https://github.com/blockprotocol/blockprotocol/pull/355) is in the works to spec out how this could work, please consult it for plans on introducing a suite of Data Types including ones like `Date`, `Positive Number`, etc.:

## Property Types

A **Property Type** is a JSON schema that satisfies the following JSON meta-schema:

```json
{
  "$id": "https://blockprotocol.org/types/modules/graph/0.3/schema/property-type",
  "description": "Specifies the structure of a Property Type",
  "type": "object",
  "properties": {
    "kind": {
      "const": "propertyType"
    },
    "$id": {
      "type": "string",
      "format": "uri"
    },
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "oneOf": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/propertyValues"
      }
    }
  },
  "required": ["kind", "$id", "title", "oneOf"],
  "$defs": {
    "propertyValues": {
      "$comment": "The definition of potential property values, made up of a `oneOf` keyword which has a list of options of either references to Data Types, or objects made up of more Property Types",
      "oneOf": [
        {
          "$ref": "#/$defs/propertyTypeObject"
        },
        {
          "$ref": "#/$defs/dataTypeReference"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "const": "array"
            },
            "items": {
              "type": "object",
              "properties": {
                "oneOf": {
                  "type": "array",
                  "items": {
                    "$ref": "#/$defs/propertyValues"
                  },
                  "minItems": 1
                }
              },
              "required": ["oneOf"],
              "additionalProperties": false
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
          "required": ["type", "items"]
        }
      ]
    },
    "propertyTypeObject": {
      "type": "object",
      "properties": {
        "type": {
          "const": "object"
        },
        "properties": {
          "type": "object",
          "propertyNames": {
            "$comment": "Property names must be a valid URL to a Property Type",
            "type": "string",
            "format": "uri"
          },
          "patternProperties": {
            ".*": {
              "oneOf": [
                {
                  "$ref": "#/$defs/propertyTypeReference"
                },
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "const": "array"
                    },
                    "items": {
                      "$ref": "#/$defs/propertyTypeReference"
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
              ]
            }
          },
          "minimumProperties": 1
        },
        "required": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "uri"
          }
        }
      },
      "required": ["type", "properties"],
      "additionalProperties": false
    },
    "propertyTypeReference": {
      "type": "object",
      "properties": {
        "$ref": {
          "$comment": "Property Object values must be defined through references to the same valid URL to a Property Type",
          "type": "string",
          "format": "uri"
        }
      },
      "additionalProperties": false,
      "required": ["$ref"]
    },
    "dataTypeReference": {
      "type": "object",
      "properties": {
        "$ref": {
          "type": "string",
          "format": "uri"
        }
      },
      "additionalProperties": false,
      "required": ["$ref"]
    }
  }
}
```

### Defining the possible values of a property

A Property Type describes its possible values through a `oneOf` definition, which can include:

#### Data Types

**Example 1**

The `Favorite Quote` Property Type could define its value as being an instance of the `Text` Data Type.

```json
{
  "kind": "propertyType",
  "$id": "https://blockprotocol.org/@alice/property-type/favorite-quote",
  "title": "Favorite Quote",
  "oneOf": [
    { "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/text" }
  ]
}
```

**Example 2**

The `Age` Property Type could define its value as being an instance of the `Number` Data Type.

```json
{
  "kind": "propertyType",
  "$id": "https://blockprotocol.org/@alice/property-type/age",
  "title": "Age",
  "oneOf": [
    {
      "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/Number"
    }
  ]
}
```

**Example 3**

The `User ID` Property Type could define its value as being _either_ an instance of the `Text` Data Type _or_ an instance of the `Number` Data Type.

```json
{
  "kind": "propertyType",
  "$id": "https://blockprotocol.org/@alice/property-type/user-id",
  "title": "User ID",
  "oneOf": [
    { "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/text" },
    {
      "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number"
    }
  ]
}
```

#### Objects

A Property Type can also have an object made up of other properties as its value. These properties are defined by using Property Types, where when using one it's also possible to define:

- that there is a list of properties
  - that the list has a minimum amount of values
  - that the list has a maximum amount of values
- that a property is **required**

The key of the property value is the Property Type URL, as shown in the following examples.

**Example 1**

The `Contact Information` Property Type could define its value as being an object which has a **required** `E-mail` property and a `Phone Number` property.

```json
{
  "kind": "propertyType",
  "$id": "https://blockprotocol.org/@alice/property-type/contact-information",
  "title": "Contact Information",
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "https://blockprotocol.org/@blockprotocol/types/property-type/email": {
          "$ref": "https://blockprotocol.org/@blockprotocol/types/property-type/email"
        },
        "https://blockprotocol.org/@blockprotocol/types/property-type/phone-number": {
          "$ref": "https://blockprotocol.org/@blockprotocol/types/property-type/phone-number"
        }
      },
      "required": [
        "https://blockprotocol.org/@blockprotocol/types/property-type/email"
      ]
    }
  ]
}
```

**Example 2**

The `Interests` Property Type could define its value as being an object which has a `Favorite Film` property, a `Favorite Song` property, and _a list_ of `Hobby` properties.

```json
{
  "kind": "propertyType",
  "$id": "https://blockprotocol.org/@alice/property-type/interests",
  "title": "Interests",
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-film": {
          "$ref": "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-film"
        },
        "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-song": {
          "$ref": "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-song"
        },
        "https://blockprotocol.org/@blockprotocol/types/property-type/hobby": {
          "type": "array",
          "items": {
            "$ref": "https://blockprotocol.org/@blockprotocol/types/property-type/hobby"
          }
        }
      }
    }
  ]
}
```

#### Collection of things

A Property Type can also express that it has a list of things as its value.

> ⚠️ It's important to note that in **most circumstances a Property Type should be expressed as a singular item** as this encourages re-usability and allows the parent object to define whether there is a collection or not.
>
> This ability is kept in the type system to allow for nested lists, and other complicated structures of data that might occur in existing data sets. These structures are otherwise not representable, as the data doesn't have keys associated with them and therefore can't be represented as a Property Type.
>
> These are generally not ergonomic to work with in the type system and other ways of structuring the data should likely be explored. When needing to type existing data, it's possible to do some variant of the following:

**Discouraged example**

In the case that it is a requirement to deal with multi-dimensional arrays, it is possible to define them through Property Types.

For example if it is a strong requirement to model a grid of numbers, it can be done as follows

```json
{
  "kind": "propertyType",
  "$id": "https://blockprotocol.org/@alice/property-type/numbers",
  "title": "Numbers",
  "oneOf": [
    {
      "type": "array",
      "items": {
        "oneOf": [
          {
            "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number"
          }
        ]
      }
    }
  ]
}
```

The `Numbers` Property Type models data of the following shape

```json
[1, 2, ...]
```

#### Describing multiple possibilities

A Property Type can also express that its value is _either_ something _or_ something else, where "something" and "something else" are defined as outlined above using Data Types or an object definition.

**Example 1**

The `User ID` Property Type could define its value as being _either_ an instance of the `Text` Data Type _or_ an instance of the `Number` Data Type.

```json
{
  "kind": "propertyType",
  "$id": "https://blockprotocol.org/@alice/property-type/user-id",
  "title": "User ID",
  "oneOf": [
    { "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/text" },
    {
      "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number"
    }
  ]
}
```

Sample data when used in (simplified view of) an Entity

```json
{
  "https://blockprotocol.org/@alice/property-type/user-id": 42088130893
}
```

or

```json
{
  "https://blockprotocol.org/@alice/property-type/user-id": "c09b1839-8084-4a2d-9713-5d074c9c6ce2"
}
```

**Example 2**

The `Contrived Property` Property Type could define its value as being _either_ an instance of the `Number` Data Type, _or_ an object which has a list with a maximum of 4 `Foo` property values

```json
{
  "kind": "propertyType",
  "$id": "https://blockprotocol.org/@alice/property-type/contrived-property",
  "title": "Contrived Property",
  "oneOf": [
    {
      "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number"
    },
    {
      "type": "array",
      "items": {
        "oneOf": [
          {
            "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number"
          }
        ]
      },
      "maxItems": 4
    }
  ]
}
```

Sample data when used in (simplified view of) an Entity

Assuming that `Foo` accepts an instance of the `Text` Data Type

```json
{
  "https://blockprotocol.org/@alice/property-type/contrived-property": 32
}
```

or

```json
{
  "https://blockprotocol.org/@alice/property-type/contrived-property": {
    "https://blockprotocol.org/@alice/property-type/foo": "something here"
  },
  ...
}
```

## Link Types

A **Link Type** is a JSON schema that satisfies the following JSON meta-schema:

```json
{
  "$id": "https://blockprotocol.org/types/modules/graph/0.3/schema/link-type",
  "description": "Specifies the structure of a Link Type",
  "properties": {
    "kind": {
      "const": "linkType"
    },
    "$id": {
      "type": "string",
      "format": "uri"
    },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "relatedKeywords": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "additionalProperties": false,
  "required": ["kind", "$id", "title", "description"]
}
```

> 💭 As the next section (Entity Types) will outline, there's an additional step to quantifying the types of things on either end of the relationship, as such the descriptions **should** be very general and most of the time not contain specific words about types (such as person).

**Example 1** - `Owns`

```json
{
  "kind": "linkType",
  "$id": "https://blockprotocol.org/@alice/link-type/owns",
  "title": "Owns",
  "description": "Have (something) as one's own; possess"
}
```

**Example 2** - `Submitted By`

```json
{
  "kind": "linkType",
  "$id": "https://blockprotocol.org/@alice/link-type/submitted-by",
  "title": "Submitted By",
  "description": "Suggested, proposed, or presented by"
}
```

## Entity Types

An **Entity Type** is a JSON schema that satisfies the following JSON meta-schema:

```json
{
  "$id": "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
  "description": "Specifies the structure of an Entity Type",
  "type": "object",
  "properties": {
    "kind": {
      "const": "entityType"
    },
    "$id": {
      "type": "string",
      "format": "uri"
    },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "default": {
      "$comment": "Default Entity instance",
      "type": "object",
      "propertyNames": {
        "$comment": "Property names must be a valid URL to a Property Type",
        "type": "string",
        "format": "uri"
      }
    },
    "examples": {
      "$comment": "Example Entity instances",
      "type": "array",
      "items": {
        "type": "object",
        "propertyNames": {
          "$comment": "Property names must be a valid URL to a Property Type",
          "type": "string",
          "format": "uri"
        }
      }
    },
    "properties": { "$ref": "#/$defs/propertyTypeObject" },
    "required": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uri"
      }
    },
    "requiredLinks": {
      "$comment": "A list of link-types which are required. This is a separate field to 'required' to avoid breaking standard JSON schema validation",
      "type": "array",
      "items": { "type": "string" }
    },
    "links": {
      "type": "object",
      "propertyNames": {
        "$comment": "Property names must be a valid URL to a link-type",
        "type": "string",
        "format": "uri"
      },
      "patternProperties": {
        ".*": {
          "type": "object",
          "oneOf": [
            {
              "properties": {
                "ordered": { "type": "boolean", "default": false },
                "type": { "const": "array" },
                "minItems": {
                  "type": "integer",
                  "minimum": 0
                },
                "maxItems": {
                  "type": "integer",
                  "minimum": 0
                }
              },
              "required": ["ordered", "type"]
            },
            {}
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "additionalProperties": false,
  "required": ["kind", "$id", "title", "properties"],
  "$defs": {
    "propertyTypeObject": {
      "type": "object",
      "properties": {
        "type": {
          "const": "object"
        },
        "properties": {
          "type": "object",
          "propertyNames": {
            "$comment": "Property names must be a valid URL to a Property Type",
            "type": "string",
            "format": "uri"
          },
          "patternProperties": {
            ".*": {
              "oneOf": [
                {
                  "$ref": "#/$defs/propertyTypeReference"
                },
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "const": "array"
                    },
                    "items": {
                      "$ref": "#/$defs/propertyTypeReference"
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
              ]
            }
          },
          "minimumProperties": 1
        },
        "required": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "uri"
          }
        }
      },
      "required": ["type", "properties"],
      "additionalProperties": false
    },
    "propertyTypeReference": {
      "type": "object",
      "properties": {
        "$ref": {
          "$comment": "Property Object values must be defined through references to the same valid URL to a Property Type",
          "type": "string",
          "format": "uri"
        }
      },
      "required": ["$ref"],
      "additionalProperties": false
    }
  }
}
```

### Defining an Entity Type's Properties

#### Specifying an Entity Type has Property Types

The data _within_ an Entity is described simply through a set of Property Types

**Example 1**

The `Book` Entity Type could contain the Property Types `Name`, a `Published On` and a `Blurb`, where `Name` is **required**.

Assuming that:

- the `Name`, `Published On`, and `Blurb` Property Types all have values that are instances of the `Text` Data Type

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/book",
  "type": "object",
  "title": "Book",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name"
    },
    "https://blockprotocol.org/@alice/property-type/published-on": {
      "$ref": "https://blockprotocol.org/@alice/property-type/published-on"
    },
    "https://blockprotocol.org/@alice/property-type/blurb": {
      "$ref": "https://blockprotocol.org/@alice/property-type/blurb"
    }
  },
  "required": ["https://blockprotocol.org/@alice/property-type/name"]
}
```

This would accept Entity instances with the following shape

```json
{
  "https://blockprotocol.org/@alice/property-type/name": "The Time Machine",
  "https://blockprotocol.org/@alice/property-type/published-on": "1895-05",
  "https://blockprotocol.org/@alice/property-type/blurb": ...
}
```

#### Specifying there is a list of properties

The Entity Type can also define whether or not its properties are lists, where the elements of the list are described by a Property Type, optionally paired with constraints on the _minimum_ and _maximum_ amount of items in the lists

**Example 1**

The `Car` Entity Type could contain the Property Types `Make`, `Model`, `Year`, `Brake Horsepower`, and a list of `Extra Trim`.

Assuming that:

- the `Model`, `Make`, `Spec`, and `Year` Property Types all have values that are instances of the `Text` Data Type
- the `Brake Horsepower` Property Type has values that is an instance of the `Number` Data Type
- the `Extra Trim` Property Type is a list where the values are instances of the `Text` Data Type

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/car",
  "type": "object",
  "title": "Car",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/make": {
      "$ref": "https://blockprotocol.org/@alice/property-type/make"
    },
    "https://blockprotocol.org/@alice/property-type/model": {
      "$ref": "https://blockprotocol.org/@alice/property-type/model"
    },
    "https://blockprotocol.org/@alice/property-type/spec": {
      "$ref": "https://blockprotocol.org/@alice/property-type/spec"
    },
    "https://blockprotocol.org/@alice/property-type/year": {
      "$ref": "https://blockprotocol.org/@alice/property-type/year"
    },
    "https://blockprotocol.org/@alice/property-type/brake-horsepower": {
      "$ref": "https://blockprotocol.org/@alice/property-type/brake-horsepower"
    },
    "https://blockprotocol.org/@alice/property-type/extra-trim": {
      "type": "array",
      "items": {
        "$ref": "https://blockprotocol.org/@alice/property-type/extra-trim"
      }
    }
  }
}
```

This would accept Entity instances with the following shape

```json
{
  "https://blockprotocol.org/@alice/property-type/make": "Mercedes-Benz",
  "https://blockprotocol.org/@alice/property-type/model": "300 SL",
  "https://blockprotocol.org/@alice/property-type/year": "1957",
  "https://blockprotocol.org/@alice/property-type/brake-horsepower": 222,
  "https://blockprotocol.org/@alice/property-type/extra-trim": [
    "Leather Seats",
    "Cream and Red"
  ]
}
```

**Example 2**

The `Product` Entity Type could contain a **required** list of values of the `Tag` Property Type where there's at least 1 and up to 5.

Assuming that:

- the `Tag` Property Type has values that are instances of the `Text` Data Type

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/product",
  "type": "object",
  "title": "Product",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/tag": {
      "type": "array",
      "items": {
        "$ref": "https://blockprotocol.org/@alice/property-type/tag"
      },
      "minItems": 1,
      "maxItems": 5
    },
    ...
  },
  "required": ["https://blockprotocol.org/@alice/property-type/tag"]
}
```

This would accept Entity instances with the following shape

```json
{
  "https://blockprotocol.org/@alice/property-type/tag": [
    "Clothing",
    "Summer",
    "Leisurewear"
  ],
  ...
}
```

### Defining Relationships between Entities

Entity Types can also express the types of relationships they have with other things.

#### Specifying an Entity Type has outgoing Links

The links going _from_ an Entity are described as a set of Link Types

**Example 1**

The `Book` Entity Type could contain the Property Types outlined above, and a `Written By` link.

Assuming that:

- the `Name`, `Published On`, and `Blurb` Property Types all have values that are instances of the `Text` Data Type

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/book",
  "type": "object",
  "title": "Book",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name"
    },
    "https://blockprotocol.org/@alice/property-type/published-on": {
      "$ref": "https://blockprotocol.org/@alice/property-type/published-on"
    },
    "https://blockprotocol.org/@alice/property-type/blurb": {
      "$ref": "https://blockprotocol.org/@alice/property-type/blurb"
    }
  },
  "links": {
    "https://blockprotocol.org/@alice/link-type/written-by": {}
  }
}
```

This would accept Entity instances with the following shape

```json
[
  // Person entity
  {
    "entityId": 111,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Herbert George Wells",
      ...
    }
  },
  // Book Entity
  {
    "entityId": 112,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "The Time Machine",
      "https://blockprotocol.org/@alice/property-type/published-on": "1895-05",
      "https://blockprotocol.org/@alice/property-type/blurb": "brulb"
    },
    "links": {
      "https://blockprotocol.org/@alice/link-type/written-by": 111 // referring to the Person entity ID
    }
  }
]
```

**Example 2**

The `UK Address` Entity Type could contain Property Types `address-line-1`, `postcode`, and `city`, where all of them are **required**.

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/uk-address",
  "type": "object",
  "title": "UK Address",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/address-line-1": {
      "$ref": "https://blockprotocol.org/@alice/property-type/address-line-1"
    },
    "https://blockprotocol.org/@alice/property-type/postcode": {
      "$ref": "https://blockprotocol.org/@alice/property-type/postcode"
    },
    "https://blockprotocol.org/@alice/property-type/city": {
      "$ref": "https://blockprotocol.org/@alice/property-type/city"
    }
  },
  "required": [
    "https://blockprotocol.org/@alice/property-type/address-line-1",
    "https://blockprotocol.org/@alice/property-type/postcode",
    "https://blockprotocol.org/@alice/property-type/city"
  ]
}
```

The `Organization` Entity Type could contain the Property Type `Name`

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/organization",
  "type": "object",
  "title": "Organization",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name"
    }
  }
}
```

The `Building` Entity Type could contain a `Located At` link, and a `Tenant` link

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/building",
  "type": "object",
  "title": "Bulding",
  "properties": {},
  "links": {
    "https://blockprotocol.org/@alice/link-type/located-at": {},
    "https://blockprotocol.org/@alice/link-type/tenant": {}
  }
}
```

This would accept Entity instances with the following shape

```json
[
  // UK Address entity
  {
    "entityId": 113,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/address-line-1": "Buckingham Palace",
      "https://blockprotocol.org/@alice/property-type/postcode": "SW1A 1AA",
      "https://blockprotocol.org/@alice/property-type/city": "London"
    }
  },
  // Organization entity
  {
    "entityId": 114,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "HASH, Ltd."
    }
  }
  // Building entity
  {
    "entityId": 115,
    "links": {
      "https://blockprotocol.org/@alice/link-type/located-at": 113, // referring to the UK Address entity ID
      "https://blockprotocol.org/@alice/link-type/tenant": 114 // referring to the Organization entity ID
    }
  }
]
```

#### Specifying that a Link is required

The Entity Type can also define that some of its links are **required**, _note: as with properties, links are **optional** by default_

**Example 1**

The `Book` Entity Type could contain the Property Types outlined above, and a `Written By` link **which is required**.

Assuming that:

- the `Name`, `Published On`, and `Blurb` Property Types all have values that are instances of the `Text` Data Type

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/book",
  "type": "object",
  "title": "Book",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name"
    },
    "https://blockprotocol.org/@alice/property-type/published-on": {
      "$ref": "https://blockprotocol.org/@alice/property-type/published-on"
    },
    "https://blockprotocol.org/@alice/property-type/blurb": {
      "$ref": "https://blockprotocol.org/@alice/property-type/blurb"
    }
  },
  "links": {
    "https://blockprotocol.org/@alice/link-type/written-by": {}
  },
  "requiredLinks": ["https://blockprotocol.org/@alice/link-type/written-by"]
}
```

This would accept Entity instances with the following shape

```json
[
  // Person entity
  {
    "entityId": 111,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Herbert George Wells",
      ...
    }
  },
  // Book Entity
  {
    "entityId": 112,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "The Time Machine",
      "https://blockprotocol.org/@alice/property-type/published-on": "1895-05",
      "https://blockprotocol.org/@alice/property-type/blurb": ...
    },
    "links": {
      "https://blockprotocol.org/@alice/link-type/written-by": 111 // referring to the Person entity ID
    }
  }
]
```

#### Specifying there is a List of Links

The Entity Type can also express that it can have multiple outgoing links of the same type.
Furthermore list of links can be constrained with `minItems` and `maxItems`.

**Example 1**

The `Person` Entity Type could contain some Property Types, and multiple `Friend Of` links

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/person",
  "type": "object",
  "title": "Person",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name"
    }
  },
  "links": {
    "https://blockprotocol.org/@alice/link-type/friend-of": {
      "type": "array",
      "ordered": false
    }
  }
}
```

This would accept Entity instances with the following shape

```json
[
  // Person entities
  {
    "entityId": 211,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Alice"
    }
  },
  {
    "entityId": 212,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Bob"
    }
  },
  {
    "entityId": 213,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Charlie"
    },
    "links": {
      "https://blockprotocol.org/@alice/link-type/friend-of": [211, 212] // referring to the Person entity IDs, where the array ordering is unstable
    }
  }
]
```

#### Specifying there is an Ordered List of Links

The Entity Type can also express that its outgoing links (of the same type) are ordered

**Example 1**

The `Playlist` Entity Type could contain some Property Types, and an _ordered_ list of `Contains` links

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/playlist",
  "type": "object",
  "title": "Playlist",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name"
    }
  },
  "links": {
    "https://blockprotocol.org/@alice/link-type/contains": {
      "type": "array",
      "ordered": true
    }
  }
}
```

The `Song` Entity Type could contain some Property Types.

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/Song",
  "type": "object",
  "title": "Song",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name"
    }
  }
}
```

This would accept Entity instances with the following shape

```json
[
  // Songs
  {
    "entityId": 312,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Rocket Man"
    }
  },
  {
    "entityId": 313,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Du Hast"
    }
  },
  {
    "entityId": 314,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Valley of the Shadows"
    }
  },
  // Playlist
  {
    "entityId": 315,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Favorite Songs"
    },
    "links": {
      "https://blockprotocol.org/@alice/link-type/contains": [312, 314, 313] // referring to the song entity IDs, ordering is intentional and stable
    }
  }
]
```

**Example 2**

The `Page` Entity Type could contain some Property Types, a `Written By` link, and an _ordered_ list of `Contains` links.

```json
{
  "kind": "entityType",
  "$id": "https://blockprotocol.org/@alice/entity-type/page",
  "type": "object",
  "title": "Page",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/text": {
      "$ref": "https://blockprotocol.org/@alice/property-type/text"
    }
  },
  "links": {
    "https://blockprotocol.org/@alice/link-type/written-by": {},
    "https://blockprotocol.org/@alice/link-type/contains": {
      "type": "array",
      "ordered": true
    }
  }
}
```

Omitted `Paragraph`, `Heading`, `Divider` and `User` entities.

This would accept Entity instances with the following shape

```json
[
  // Paragraph Entity
  {
    "entityId": 316,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit nisl et velit porta, eget cursus nulla fermentum. Aenean in faucibus velit, at cursus quam. Proin scelerisque quam id erat semper egestas."
    }
  },
  // Heading Entity
  {
    "entityId": 317,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Duo Reges: constructio interrete."
    }
  },
  // Divider Entity
  {
    "entityId": 318,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/width": "full"
    }
  },
  // User Entity
  {
    "entityId": 319,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Alice"
    }
  },
  // Page Entity
  {
    "entityId": 320,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "Lorum Ipsum"
    },
    "links": {
      "https://blockprotocol.org/@alice/link-type/written-by": 319, // referring to the User entity ID
      "https://blockprotocol.org/@alice/link-type/contains": [317, 316, 318] // referring to IDs above, ordering is intentional and stable
    }
  }
]
```

## JSON Schema additions

We can define the new JSON Schema keywords that the system uses through JSON Schemas

```json
{
  // Custom JSON Schema keywords
  "kind": {
    "enum": ["entityType", "propertyType", "dataType", "linkType"]
  },
  // Links here the same definition given in the Entity Type meta JSON Schema.
  "links": {
    "type": "object",
    "propertyNames": {
      "$comment": "Property names must be a valid URL to a link-type",
      "type": "string",
      "format": "uri"
    },
    "patternProperties": {
      ".*": {
        "type": "object",
        "oneOf": [
          {
            "properties": {
              "ordered": { "type": "boolean", "default": false },
              "type": { "const": "array" }
            },
            "required": ["ordered", "type"]
          },
          {}
        ],
        "additionalProperties": false
      }
    }
  },
  // requiredLinks specifies what links are required to exist on an Entity
  "requiredLinks": {
    "type": "array",
    "items": {
      "type": "string",
      "format": "uri"
    }
  }
  // Description is repurposed when used with Link Types
  "description": {
    "type": "string"
  },
  // Title is the name of the schema
  "title": {
    "type": "string"
  }
}
```

The `kind` can only take on values that specify the types of the proposed type system.

The `links` keyword specifically allows constraints in the case of having a set of links. Here the link set can be ordered or unordered (default).

The `requiredLinks` keyword specifies what links are to be considered required for instances of an Entity Type.

As mentioned in the Guide-Level explanation, the following JSON Schema keywords are repurposed:

The `description` keyword for Link Types add semantic meaning to a link (which could be encapsulated in a custom vocabulary specification for the meta schemas).

The `title` keyword refers to the name of the Type it is describing.

The `$ref` keyword when used to refer to Property Types, Data Types, and Link Types URLs will always need to be equal to the key of the object which it is defined under (and vice versa). If the `$ref` is within an array's `items` definition, the URL should equal the nearest JSON Schema property name which is a URL. This is so that the property, data, or link type can be identified from an instance conforming to it (which it could not if the key, i.e. the property name, were different from the `$ref`).

This _is_ valid

```json
{
  "http://example.com/uri": {
    "$ref": "http://example.com/uri"
  },
  "http://example.com/uri2": {
    "type": "array",
    "items": {
      "$ref": "http://example.com/uri2"
    }
  }
}
```

This _is not_ valid

```json
{
  "http://example.com/uri": {
    "$ref": "http://example.com/cat" // should be `uri`
  },
  "http://example.com/uri2": {
    "type": "array",
    "items": {
      "$ref": "http://example.com/cats" // should be `uri2`
    }
  }
}
```

For the most part, we're using existing JSON Schema keywords, but it would be preferable to look into defining these additions as Vocabularies or otherwise integrate them into a JSON Schema validator used for the proposed system.

## Using the Types in the Block Protocol

Using the proposed type system for Block Protocol imposes changes on the Graph Module and how Block Schemas are defined.

While the examples so far have shown `properties` and `links` side by side in the Entity instances, the Block Protocol would treat these two concepts separately.

Messages in the Graph Module are currently specified under [this schema](https://github.com/blockprotocol/blockprotocol/blob/main/libs/%40blockprotocol/graph/src/graph-module.json) with additional requirements specified [here](https://blockprotocol.org/spec/graph).

### Interfacing with properties on Entities

A key change for allowing the proposed type system to work is moving away from arbitrary property keys and making use of canonical property URLs. As seen in the examples in earlier sections, properties that use simple keys will now have to point at _Property Type URLs_.

**An example of an [`Entity`](https://blockprotocol.org/types/modules/graph/0.2/schema/entity) instance in the current system:**

```json
{
  "entityId": 111,
  "properties": {
    "name": "Arthur Philip Dent",
    "age": 30,
    "planetOfOrigin": "Earth",
    "occupation": "Intergalactic Traveler"
  }
}
```

**An example of an entity instance in the proposed system:**

```json
{
  "entityId": 111,
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": "Arthur Philip Dent",
    "https://blockprotocol.org/@alice/property-type/age": 30,
    "https://blockprotocol.org/@alice/property-type/planet-of-origin": "Earth",
    "https://blockprotocol.org/@alice/property-type/occupation": "Intergalactic Traveler"
  }
}
```

This change canonicalizes property keys, such that they uniquely identify a Property Type.

**Within blocks** this impacts:

- how entity fields are accessed
- how Block Protocol messages are constructed
- payload size of Block Protocol messages

**For block authors** this impacts:

- how Block Schemas are defined
- the reusability of properties and data types (and the increased need for type discovery to facilitate this)
  - block authors can share and use types through URLs explicitly

> 💡 Notice that `entityId`s are replaced by a Property Type URL that resides in the `/@blockprotocol` namespace. This is an implementation detail, and not something that is strictly dictated by the proposal.

### Interfacing with Linked Entities

#### Receiving Links and Linked Entities

Link groups and Linked entities in the Graph Module are currently supplied outside the entity as separate objects. This behavior will stay the same, but the objects received will be of a different shape.

**An example of a [`LinkGroup`](https://blockprotocol.org/types/modules/graph/0.2/schema/link-group) instance in the current system:**

```json
{
  "sourceEntityId": "user1",
  "path": "company",
  "links": [
    {
      "sourceEntityId": "user1",
      "destinationEntityId": "company1",
      "path": "company"
    }
  ]
}
```

**An example of a `LinkGroup` instance in the proposed system:**

```json
{
  "sourceEntityId": "user1",
  "linkType": "https://blockprotocol.org/@alice/link-type/company",
  "ordered": false,
  "links": [
    {
      "sourceEntityId": "user1",
      "destinationEntityId": "company1",
      "linkType": "https://blockprotocol.org/@alice/link-type/company"
    }
  ]
}
```

> 💡 In the proposed system example instance, the `path` key has been replaced with `linkType`. This is an implementation detail which is not dictated by the proposal. Alternatives could be `linkUrl`, `link`, etc.

Links (which are provided by the `links` field in the items of the `LinkGroups` array) will use Link Type URLs instead of a `path`.
The `LinkGroup` has a new key `ordered` which specifies whether or not the `links` array is ordered. More on this in the [Ordering of links](#ordering-of-links) section.

As for the linked entities returned by `linkedEntities`, the imposed changes to Entities will apply here as well.

**An example of [`linkedEntities`](https://blockprotocol.org/types/modules/graph/0.2/schema/entity) instance in the current system:**

```json
[
  {
    "entityId": 222,
    "properties": {
      "name": "HASH, Ltd."
    }
  }
]
```

**An example of a `linkedEntities` instance in the proposed system:**

```json
[
  {
    "entityId": 222,
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": "HASH, Ltd."
    }
  }
]
```

#### Creating Links

Link creation will not be using arbitrary `path`s, instead Link Types must be used through Link Type URLs.

**An example of a [`createLink`](https://github.com/blockprotocol/blockprotocol/blob/main/libs/%40blockprotocol/graph/src/graph-module.json#L395) instance in the current system:**

```json
{
  "sourceEntityId": 111,
  "destinationEntityId": 222,
  "path": "company"
}
```

**An example of `createLink` instance in the proposed system:**

```json
{
  "sourceEntityId": 111,
  "destinationEntityId": 222,
  "link": "https://blockprotocol.org/@alice/link-type/company"
}
```

Any link will use Link Type URLs instead of a `path`.

### Ordering of links

Links in the proposed system have the notion of cardinality. A link can be one-to-one or one-to-many. The "many" cardinality can further be constrained and set to be ordered or unordered.

Links can be ordered in the current system, and the behavior will stay mostly the same in the proposed system

**An example of an _ordered_ [`createLink`](https://github.com/blockprotocol/blockprotocol/blob/main/libs/%40blockprotocol/graph/src/graph-module.json#L395) instance in the current system:**

```json
{
  "sourceEntityId": 333,
  "destinationEntityId": 444,
  "index": 4,
  "path": "stopsAt"
}
```

**An example of an _ordered_ `createLink` instance in the proposed system:**

```json
{
  "sourceEntityId": 333,
  "destinationEntityId": 444,
  "index": 4,
  "link": "https://blockprotocol.org/@alice/link-type/stops-at"
}
```

The link cardinality specified in source Entity Types dictates how `createLink` requests will be perceived.
If, for example, a block issues the above `createLink` request on an Entity that through its Entity Type does _not_ allow multiple links, setting an `index` on a `createLink` request would be invalid or unnecessary.

The indices of ordered links are transparent to the users, and implicitly given by the order that they appear in the `links` array.

**An example of an ordered `LinkGroup` instance in the proposed system:**

```json
{
  // A list of ordered links
  "sourceEntityId": 111,
  "link": "https://blockprotocol.org/@alice/link-type/stops-at",
  // Elements of this links array are ordered'
  "ordered": true,
  "links": [
    {
      // First link
      "sourceEntityId": 111,
      "destinationEntityId": 222,
      "link": "https://blockprotocol.org/@alice/link-type/stops-at"
    },
    {
      // Second link
      "sourceEntityId": 111,
      "destinationEntityId": 333,
      "link": "https://blockprotocol.org/@alice/link-type/stops-at"
    }
  ]
}
```

> 💡 Having implicit link ordering means that embedding applications can implement their own index-tracking, such as [fractional indices](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/#syncing-trees-of-objects). It would be trivial to augment the `links` elements to contain an `index` key that reassures the order.

### Block Schemas

Block Schemas in the Block Protocol describe the shape of their own properties.
These properties should be stored within the same type system as the one that can be queried through the Graph Module.

In the proposed system, Block Schemas are analogous to Entity Types. A Block Schema would need to be described in terms of Property Types. Links in Block Schemas in the proposed system must be explicit.

**An example of a Block Schema in the current system:**

```json
{
  "type": "object",
  "name": "Person Card",
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string" },
    // "link" here is a URL for ther person's website for example.
    "link": { "type": "string", "format": "uri" },
    "avatar": { "type": "string", "format": "uri" },
    "employer": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "position": { "type": "string" }
      },
      "required": ["name", "position"]
    }
  }
}
```

**An example of a Block Schema in the proposed system:**

```json
{
  "type": "object",
  "kind": "entityType",
  "title": "Person Card",
  "properties": {
    "https://blockprotocol.org/@alice/property-type/name": {
      "$ref": "https://blockprotocol.org/@alice/property-type/name"
    },
    "https://blockprotocol.org/@alice/property-type/email": {
      "$ref": "https://blockprotocol.org/@alice/property-type/email"
    },
    "https://blockprotocol.org/@alice/property-type/website-url": {
      "$ref": "https://blockprotocol.org/@alice/property-type/website-url"
    },
    "https://blockprotocol.org/@alice/property-type/avatar-image": {
      "$ref": "https://blockprotocol.org/@alice/property-type/avatar-image"
    }
  },
  "links": {
    // Employer
    "https://blockprotocol.org/@alice/link-type/company": {}
  }
}
```

> 💡 As the syntax and validations of Block Schemas are closely related to Entity Types, they have the same `kind` for now. We would introduce a distinct `"blockSchema"` kind to make the distinction clear if there were a need for the two kinds of schemas to diverge.

One clear difference in the new system is that properties are no longer named arbitrarily.
Every Block Schema property must be a Property Type URL, which means semantic meaning is attached to every key.

This, as mentioned previously, allows for a greater level of confidence that data passed to blocks is correct and useable as there will be less guesswork for Embedding Applications.

For any Embedding Application that loads a Block Schema defined with the proposed system, it will be clear what _exact_ Property Types and Links to look for when finding applicable Entity Types that satisfy the Block Schema.
In the case of the Property Types not existing in the Embedding Application, the URLs, as they are canonical, can be used to fetch definitions.

### Structure-based Queries

Structure-based Queries, which in the current system are any methods that use `LinkedAggregationOperation`, will have to change to refer to the respective `Property Types` and `Link Types` they must structurally match against.

The idea of having structure-based queries in the type system will be explored in detail in an upcoming Structure-based Query RFC.

### Interfacing with Types

In the current system, we are already able to Create, Read, Update and Delete (CRUD) Entity Types.
With the proposed system, this needs to be expanded such that we can CRUD Property Types and Link Types as well. User-defined Data Types are not a part of this proposal.

The current system also supplies a way to "aggregate" Entity Types, which is a filtering operation on all Entity Types within the embedding application. On a side note, "aggregation" is a place where Structure-based Queries could be used.

**Type-related [CRUD operations](https://github.com/blockprotocol/blockprotocol/blob/main/libs/%40blockprotocol/graph/src/graph-module.json) in the current system:**

- `createEntityType`
- `updateEntityType`
- `deleteEntityType`
- `getEntityType`
- `aggregateEntityTypes`

**Type-related CRUD operations in the proposed system:**

- `createPropertyType`
- `updatePropertyType`
- `deletePropertyType`
- `getPropertyType`
- `aggregatePropertyTypes`

- `createEntityType`
- `updateEntityType`
- `deleteEntityType`
- `getEntityType`
- `aggregateEntityTypes`

- `createLinkType`
- `updateLinkType`
- `deleteLinkType`
- `getLinkType`
- `aggregateLinkTypes`

- `aggregateDataTypes`

The main changes imposed by the proposed system are that Entity Types must be defined as previously outlined - with canonical Property Type URLs and that new messages for managing Property Types and Link Types must be added.

In the proposed system, Entity Types can be created and updated with the same semantics but have to conform to the [Entity Type](#entity-types-1) schema instead of arbitrary JSON schemas.
Property Types will be defined similarly to Entity Types in the proposed system, conforming to the [Property Type](#property-types-1) schemas instead.
Link Types do not contain further structural data, which make them semantically simpler than Entity Types and Property Types.

**Entity Type Create and Update messages in the current system:**

```json
{
  // createEntityType message
  "schema": {
    "type": "object",
    "name": "Person",
    "properties": {
      "name": { "type": "string" },
      "email": { "type": "string" },
      "phoneNumber": { "type": "string" }
    }
  }
}
```

```json
{
  // updateEntityType message
  "entityTypeId": "https://blockprotocol.org/@alice/entity-type/person",
  "schema": {
    "properties": {
      "birthDate": { "type": "string", "format": "date" }
    }
  }
}
```

**Entity Type Create and Update messages in the proposed system:**

```json
{
  // createEntityType message
  "schema": {
    "type": "object",
    "kind": "entityType",
    "title": "Person",
    "properties": {
      "https://blockprotocol.org/@alice/property-type/name": {
        "$ref": "https://blockprotocol.org/@alice/property-type/name"
      },
      "https://blockprotocol.org/@alice/property-type/email": {
        "$ref": "https://blockprotocol.org/@alice/property-type/email"
      },
      "https://blockprotocol.org/@alice/property-type/phone-number": {
        "$ref": "https://blockprotocol.org/@alice/property-type/phone-number"
      }
    }
  }
}
```

```json
{
  // updateEntityType message
  "entityTypeId": "https://blockprotocol.org/@alice/entity-type/person",
  "schema": {
    // The properties here are partially applied to the original Entity Type.
    "properties": {
      "https://blockprotocol.org/@alice/property-type/birth-date": {
        "$ref": "https://blockprotocol.org/@alice/property-type/birth-date"
      }
    }
  }
}
```

The update messages of both the current and new systems make use of partial schemas, merging the schema given in the message contents with the existing Entity Type. This may or may not be the desired semantics of updating, and could lead to undesired behavior. In that case, the semantics can be changed to treat updates as a complete replacement. This is to be decided and can be considered out of scope for this RFC as it touches on inheritance/forking concepts.

**Property Type Create and Update messages in the current system:**

Property Types do not exist.

**Property Type Create and Update messages in the proposed system:**

```json
{
  // createPropertyType message
  "schema": {
    "kind": "propertyType",
    "title": "User ID",
    "oneOf": [
      {
        "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/text"
      }
    ]
  }
}
```

```json
{
  // updatePropertyType message
  "propertyTypeId": "https://blockprotocol.org/@alice/property-type/user-id",
  "schema": {
    "oneOf": [
      {
        "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/text"
      },
      {
        "$ref": "https://blockprotocol.org/@blockprotocol/types/data-type/number"
      }
    ]
  }
}
```

**Link Type Create and Update messages in the current system:**

Link Types do not exist.

**Link Type Create and Update messages in the proposed system:**

```json
{
  // createLinkType message
  "schema": {
    "kind": "LinkType",
    "title": "Friend of",
    "description": "Being friends with"
  }
}
```

```json
{
  // updateLinkType message
  "linkTypeId": "https://blockprotocol.org/@alice/link-type/friend-of",
  "keywords": ["knows"]
}
```

---

For Property Types, having partial update semantics could lead to a lot of confusion because of Property Types with top-level `oneOf`. Here replacing the Property Type in its entirety is to be preferred.

For Entity Types, Property Types, and Link Types, changing anything on the types could be a breaking change. We have not discussed this in this RFC yet, but there're a lot of considerations to be put into the semantics of updating/removing existing types. For the sake of simplicity, these example messages show how the Block Protocol in its current shape could be transformed to make use of this new Type System but in reality, the semantics of working with the types will need to be handled differently.

> 💡 Currently, "schemas" can be defined from the [blockprotocol.org](https://blockprotocol.org/) website. With the proposed system's canonical URLs, types need to be globally identifiable and usable from Embedding Applications. Property Types and Entity Types in the examples are namespaces under the `@alice` user, but we've not specified how these types are defined. This is left out-of-scope for the purposes of this RFC.

# Drawbacks

[drawbacks]: #drawbacks

## Implementation Complexity

This RFC introduces additional barriers for developers who want to **fully** implement the Block Protocol specification. This could be viewed as a barrier-to-entry and potentially dissuade people from trying it out. Ideally the new module-based approach mitigates this in part, and people can continue to implement parts of the specification to gradually utilize the pieces they find useful. In the simple scenarios (for instance manually including a single block) this implementation complexity should be relatively constrained, and can be mitigated by helper methods in the Block Protocol Graph module implementation. In the more complex use-cases the embedding applications will likely need to implement methods to resolve external schemas, as well as functionality to handle, combine, and validate them.

It's worth noting that standard JSON schema validators won't natively support the full Type System (due to some of the new keywords that have been created), however they should be able to do partial validation, where prior to this RFC there were occurrences where misusing JSON schema could break the validators entirely.

## Increased dependency on external parties

A potential negative side-effect of building an open ecosystem is introducing more dependencies on external parties. Although the magnitude of the impact will depend on the accompanying tooling and implementation that comes about as a result of this RFC, generally speaking there will be an increased reliance on external parties hosting and maintaining types. That said, the Block Protocol is focused around front-end components, and generally speaking there is already a high-reliance on external ecosystems (whether it be npm, etc.), so this is a risk that should be familiar for developers. Some of the [Future possibilities](#future-possibilities) outlined later on would also help mitigate this with potential centralized repositories for types to improve confidence in guarantees and consistency, etc.

## Ergonomics of manually writing schemas

This RFC greatly decreases the ergonomics of writing block schemas **by hand**. The verbosity of schemas is significantly increased, as well as the general complexity of their expression due to them being composed of other schemas that need to be referred to, and which need to be addressable at some unique location at the point of production use.

This has the potential to increase the barrier-to-entry, and dissuade people from picking up the Protocol if its capabilities prove to be too complicated for their use cases.

## Ecosystem lock-in

With some of the potential solutions proposed in [Future Possibilities](#future-possibilities) there will be large benefits to participating within the Block Protocol ecosystem and community. This naturally brings the potential downside of the opportunity cost of _not_ participating within the ecosystem.

This type system is designed around reusable types, where people can share and benefit from other people's work, isolating development from the community means that types will not end up being reusable and a lot of the value is lost.

## Versioning Considerations

A version control model will likely be developed in tandem to the implementation of this type system. As such, there are potential complications to how dependencies are managed, how types are addressed, and the ramifications of having a large-connected system. Some of these are explored in detail in the [RFC about constraining Links](https://github.com/blockprotocol/blockprotocol/pull/354). The major drawback here is that this greatly increases cognitive load, and reasoning about changes within the ecosystem will become more involved.

A more immediately apparent concern is if schemas are versioned, but their use isn't pinned to a version, then they might implicitly change if their dependencies are updated. More verbosely, if we have a Property Type `Age` on version `1.1`, and an Entity Type `Person` which simply refers to `Age`, if `Age` is updated then the Entity Type implicitly changes.

# Rationale and alternatives

[rationale-and-alternatives]: #rationale-and-alternatives

## The Big Picture

As outlined in the [Motivation section](#motivation), there are some clear shortcomings to how the Graph module works at the moment in regards to how it expresses data structure. It's also important to mention that there is a tough balance between comprehensive functionality for:

- Complex use-cases (such as those that are able to dynamically load and use a block at run-time)
- Simple use-cases (such as those that include a handful of blocks in the source code at build-time).

**This RFC is heavily weighted towards facilitating useful, complex use-cases, and explicitly recognises that it likely makes the development experience worse for simpler use-cases.**

This decision is guided by the thoughts outlined in the [Motivation section](#motivation), most notably the acknowledgement that a standard being prescriptive can actually lead to new functionalities. Although there are [drawbacks](#drawbacks), the system allows parties on either side of the communication channel to have greater confidence, and to be able to express themselves more comprehensively. The compromise is argued for by first understanding the concept of consensus, and then exploring its practical implications.

### Convergence and divergence of consensus

There is an incredibly diverse number of domains in which the Block Protocol could be utilized. It's also important to recognize that the Protocol is designed to be added to _existing_ systems, and when integrated it must be able to interoperate with whatever surrounds it. Due to this, it can't rely on a prescriptive global definition of how data should be structured, as the vast quantity of the data is pre-existing and has been made according to different systems, and it's highly impractical to expect entire data-stores to be restructured.

Across the domains, data will vary to the point that it's completely infeasible to define one perfect description of it (an _ontology_), there will simply be too much disagreement about what a certain "thing" looks like, i.e. there will be a lack of consensus. It's also worth mentioning that this is not just due to differences in domains, but also in data-quality, where misconfigured data must still be _able_ to be represented in the system, which is a lot less likely with one global view of the world.

As such, the key identified benefit of this type system is that _continues_ to allow for **partial-consensus**, where different domains can create and utilize different subsets of the wider ecosystem. It allows for **divergence** of definitions of "things" (Bob can define "Person" differently to Alice), but _encourages_ **gradual convergence** through reusability, sharing, and further standardization.

#### Reusability

An issue with the current system is that for each block developed, the developer needs to describe its requirements autonomously. They decide what data it needs, and importantly, decide _how to describe that data_. The toolkit they're provided with right now is to embed semantic meaning into the key of the JSON blob. But as shown in the [Motivation section](#motivation), this falls short quickly in the real world as language is imperfect, and words chosen as keys can have synonyms, they can prove ambiguous, etc.

This is rectified through the following:

- Allow people to describe the individual pieces of data _within_ "things"
- Make it possible to reuse those descriptions

The system proposed in the RFC creates another vector of communication, the description of the data is no longer _necessarily_ as autonomous, people describing data can benefit from existing, shared descriptions. This gives a route for **convergence** of descriptions, because as a block developer I can _discover_ an existing Property Type for `Timestamp` and reuse it, mitigating some of the risks of instead describing it as "time". This is less one-sided because a producer of data is also able to discover descriptions that they can use to create their data.

That's not to say this will be perfect or that it will happen most of the time, but it's a possibility that's opened up by the system, and which future tooling and processes can leverage and guide people towards. This is beneficial for a number of reasons, one of which is that reusing shared descriptions of data leads to emergent standardization.

#### Emergent standardization

The interaction of behaviors within a complex system often leads to emergent phenomena (properties that only appear as a result of interaction). In the case of the Block Protocol ecosystem, we want to encourage behaviors that lead to emergent properties that can be beneficially leveraged by participants of the ecosystem. Through the hierarchy of _reusable_ types we hope to encourage **gradual convergence** towards descriptions of data that are common across a lot of domains.

These common descriptions will form **standards** that **emerge** as a result of the community effort as the system evolves. This differs from trying to design a prescriptive ontology to describe all data, and instead allows different views of the world to develop in parallel, tailored to their own domains, which can overlap when it proves useful.

### The practical implications of such a system

The section above describes the general philosophical goals and benefits of the Type System. These benefits materialize in immediate and practical forms however.

#### Complex use-cases

As outlined, the Type System is tailored towards improving complex use cases of the Block Protocol; specifically around enabling dynamic functionalities such as loading unknown blocks at run-time.

In the immediate term, having a more rigorous definition of semantic meaning (e.g. what I actually "mean" when I say the "timestamp" of my entity) improves the experience of embedding applications, block developers, and end-users as outlined in the [Motivating implications](#motivating-implications).

In the longer term, blocks can be developed _within_ emergent standards, discovering related descriptions of data, and having greater confidence that they fit the problems well. Users benefit from an ecosystem with less guesswork, and greater specificity. Embedding applications have greater potential to implement programmatic inference, and have a better specified toolkit to utilize when addressing problems of mapping data.

#### Simple use-cases

Although there are numerous [drawbacks](#drawbacks) that affect the simpler use-cases, there are still large benefits to the proposal. Having better-defined types improves machine comprehension, but also improves human comprehension. A developer trying to manually map their data to the API of a block can better understand what the block needs, and more quickly satisfy its requirements.

A block developer trying to create a block that's specific to their domain for their own application might inadvertently create something that's useful to a wider audience, by participating in the wider ecosystem. The chance of them creating something useful is increased through reusability of descriptions.

## Specific Decisions

There are a number of very specific design decisions that are also encapsulated within this proposal, it's worth capturing some of the noteworthy ones.

### Allowing `oneOf`

Representing the Type System within common structures like a Relation Database is greatly complicated by the inclusion of the boolean operators (`oneOf` is equivalent to an `or` operator). It is required under the constraint of being able to map any existing JSON data, as reasoned above. A simple example of this is trying to represent an object (this case occurs either in an Entity or a Property Type object) that looks like the following:

```json
{
  "someProperty": [2.0, "foo"]
}
```

To be able to represent this object, a Property Type would need to be created that looks like (a simplified view for brevity):

```json
{
  "title": "someProperty",
  "oneOf": [{ "$ref": "data-type/number" }, { "$ref": "data-type/text" }]
}
```

More specifically, it's required to allow `oneOf` with more variants than _just Data Types_ because:

```json
{
  "someProperty": [{ "bar": 2.0 }, "foo"]
}
```

Requires something like

```json
{
  "title": "someProperty",
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "bar": { "$ref": "property-type/bar" }
      }
    },
    { "$ref": "data-type/text" }
  ]
}
```

### Including an `Empty List` Data Type

Similarly, the `Empty List` Data Type is required to be able to programmatically map unknown JSON data into the system without typing it as an unconstrained list. Given an incoming entity like:

```json
{
    "foo": [
        [],
        [2, 6, 10, ...],
        [{...}, {...}, ...]
    ]
}
```

There isn't a good assumption to make about the type of the first array. As such, including `Empty List` makes it possible to treat this as a value without an inner type, and a user will be forced to retype it to be able to modify it.

### Including an `Object` Data Type

The inclusion of the `Object` Data Type is less strongly supported. At the moment it seems like it's easy to include in implementations (as datastores will already need to be able to represent JSON-like structures), so instead the discussion at the moment is around looking for a reason to exclude it.

There's a risk that it could be utilized instead of Property Type objects, which means the inner data won't be accessible through tooling designed around the Type System. However at the moment it seems a convenient inclusion to allow users to prototype and quickly throw in semi-structured data as black boxes, later on transitioning to Data Types. As the type is very constrained in the current proposal, with it not being possible to add further JSON schema keywords, etc. the risk that users will misuse it seems low.

# Prior art

[prior-art]: #prior-art

As mentioned in a few sections, this design basically defines a way for communities to build a compound ontology. As such it's worth mentioning some of the alternative knowledge representation models to provide points of discussion, and to invite members of their communities to give thoughts. There are a few specific technologies that we've taken particular interest in while designing the RFC.

> Note: Some planning has been made around **varying**-levels of compatibility with these technologies, although in-depth designs for their interfacing have not been written up yet.

## Data Description Formats

- [RDF](https://www.w3.org/RDF/)
- [RDFS](https://www.w3.org/TR/rdf-schema/)
- [OWL](https://www.w3.org/OWL/)

## Ontologies

- [Schema.org](https://schema.org/)
- [DBPedia](https://dbpedia.org/)

# Unresolved questions

[unresolved-questions]: #unresolved-questions

1.  Are there further impacts on block schemas?
1.  ~~Do we permit spaces in type titles?~~

    - Yes we do, for now. We are treating the type titles as display names until we find a good reason not to.

1.  Is there a way to specify in JSON schema that the key of a property is equal to the the thing it's a `$ref` to?
    As in can we specify a constraint that you have to have equal URLs in `"someUrl": { "$ref": "someUrl" }`?
    The reason why we want this, is such that our JSON Schemas can be validated through conventional means, without special-casing a custom check with the `$ref` and property name.
1.  Should we further constrain allowed URLs (for example to force the end of the path to be `/property-type/foo`) and if so should we encode that in the JSON schema?
1.  Do we want to allow types to define a separate plural name that can be used when they're set to `"type": "array"`?
1.  How would we define our custom JSON Schema keywords in a JSON Schema Vocabulary? Could our meta schemas be defined as JSON Schema Vocabularies?

# Future possibilities

[future-possibilities]: #future-possibilities

This RFC establishes components that are quite fundamental. As such, there is a lot of potential work that can be made to improve ergonomics, functionality, etc.

## Constraining possible destinations of Links

As alluded to elsewhere in the document, during the writing of this RFC some problems were discovered with Entity Types constraining the destinations of a Link. This has been made into [another RFC](https://github.com/blockprotocol/blockprotocol/pull/354) outlining the issue and a potential solution.

## User-Created Data Types

In this RFC Data Types are limited to a set of primitive ones. There's potential to introduce a system that lets users create new Data Types by constraining and combining the primitives. This is explored in [another RFC](https://github.com/blockprotocol/blockprotocol/pull/355).

## Discoverability

Reusability through sharing has been mentioned as a large benefit of the Type System. These benefits will be limited if types aren't easily discoverable. A potential solution to this would be establishing a standard for a Type Repository. This standard could potentially be written to work like Linux (or npm, pip, etc.) package repositories.

It should therefore be possible to allow for a decentralized system, while also providing centralized ecosystem (or multiple) for those who wish to benefit from it, likely having a blockprotocol.org Type Repository.

Having repositories should make it possible to build tooling around type discoverability, whether it be autocomplete in Schema Editors, or embedding applications being able to create and modify types within a repository.

This is also made a lot easier as the proposed Type System has provisioned that `$id`s of types are unique URLs, which should make it easier to allow for a decentralized system for hosting them, while also enabling the creation of centralized ones for people who want to benefit from a closer-knit system.

## Supplementary tooling

As hinted at in the section above, there's a suite of supplementary tooling that could be created to mitigate some of the negative impact on ergonomics that this RFC creates. These could include Schema Editors designed for the Block Protocol Type System, IDE plugins (that potentially consume from Type Repositories) to aid in writing the schemas.
