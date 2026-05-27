---
Feature Name: "graph-structural-link-constraints"
Start Date: 2022-06-14
First Published: Pending
RFC PR: https://github.com/blockprotocol/blockprotocol/pull/354
RFC Discussion: Pending
---

# Summary

[summary]: #summary

One paragraph explanation of the feature.

# Motivation

[motivation]: #motivation

Why are we doing this? What use cases does it support? What is the expected outcome?

# Guide-level explanation

[guide-level-explanation]: #guide-level-explanation

## Structural Constraints (Name TBD)

A Structural Constraint is effectively a way of programmatically expressing that an Entity Type “_looks like_” something. This is very similar to how the types outlined in this proposal define that data “_looks like_” something, but rather than describing data, Structural Constraints describe Entity Types.

🚧 TODO - a Structural Constraint can define any combination of the following constraints

- Property Types
  - are defined and required on the Entity Type
  - are defined on the Entity Type
  - are possibly defined on the Entity Type
  - all variations of the above + array constraints (+ oneOf, do we need to be able to say, for example, has a ukAddress or a usAddress?)
- Link Types (does this make sense to design at the start, probably not, I think we could add it later)
  - are defined and required on the Entity Type
  - are defined on the Entity Type
  - are possibly defined on the Entity Type
- URI equal to / oneOf
- Name equal to / oneOf ?

- **Specifying an Entity Type has out-going Links** - The links going _from_ an Entity are described a set of Link Types, each combined with a Structural Constraint (see the following section)

  **Example 1**

  The `Book` Entity Type could contain the Property Types outlined above, and a `Written By` link to something that _looks like_ a Person

  - Sample (simplified) Data
    With the same assumptions as outlined above

    ```json
    [
      // Person entity
      {
        "entityId": 111,
        "name": "Herbert George Wells",
        ...
      },
      // Book Entity
      {
        "entityId": 112,
        "name": "The Time Machine",
        "publishedOn": "1895-05",
        "blurb": ...,
        "writtenBy": 111 // referring to the Person entity ID
      }
    ]
    ```

  **Example 2**

  The `Building` Entity Type could contain some Property Types, a `Located At` link to something that _looks like_ an Address, and a `Tenant` link to something that _looks like_ an `Organisation`

  - Sample (simplified) Data
    With the same assumptions as outlined above

    ```json
    [
      // UK Address entity
      {
        "entityId": 113,
        "addressLine1": "Buckingham Palace",
        "postcode": "SW1A 1AA",
        "city": "London",
        ...
      },
      // Organisation entity
      {
        "entityId": 114,
        "name": "HASH, Ltd.",
        ...
      }
      // Building entity
      {
        "entityId": 115,
        "address": 113, // referring to the UK Address entity ID
        "tenant": 114, // referring to the Organisation entity ID
        ...
      }
    ]
    ```

- **Specifying there is a List of Links** - The Entity Type can also express that it can have multiple out-going links of the same type

  **Example 1**

  The `Person` Entity Type could contain some Property Types, and multiple `Friend Of` links to things that _look like_ a Person

  - Sample (simplified) Data

    ```json
    [
      // Person entities
      {
        "entityId": 211,
        "name": "Alice",
      },
      {
        "entityId": 212,
        "name": "Bob",
      }
      {
        "entityId": 213,
        "name": "Charlie",
        "friendsOf": [211, 212] // referring to the Person entity IDs, where the array ordering is unstable
      }
    ]
    ```

- **Specifying there is an Ordered List of Links** - The Entity Type can also express that its out-going links (of the same type) are ordered
  **Example 1**
  The `Playlist` Entity Type could contain some Property Types, and an _ordered_ list of `Contains` links to things that _look like_ Songs

  - Sample (simplified) Data

    ```json
    [
      // Songs
      {
        "entityId": 312,
        "name": "Rocket Man",
        ...
      },
      {
        "entityId": 313,
        "name": "Du Hast",
        ...
      },
      {
        "entityId": 314,
        "name": "Valley of the Shadows",
        ...
      },
      // Playlist
      {
        "entityId": 315,
        "name": "Favorite Songs",
        "contains": [312, 314, 313] // referring to the song entity IDs, ordering is intentional and stable
        ...
      }
    ]
    ```

  **Example 2**
  The `Page` Entity Type could contain some Property Types, a `Written By` link to something that _looks like_ a Person, and an _ordered_ list of `Contains` links to things that _look like_ Page Contents

  - Sample (simplified) Data

    ```json
    [
      // Paragraph Entity
      {
        "entityId": 316,
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit nisl et velit porta, eget cursus nulla fermentum. Aenean in faucibus velit, at cursus quam. Proin scelerisque quam id erat semper egestas.",
        ...
      },
      // Heading Entity
      {
        "entityId": 317,
        "name": "Duo Reges: constructio interrete.",
        ...
      },
      // Divider Entity
      {
        "entityId": 318,
        "width": "full",
        ...
      },
      // User Entity
      {
        "entityId": 319,
        "name": "Alice",
        ...
      }
      // Page Entity
      {
        "entityId": 320,
        "name": "Lorum Ipsum",
        "writtenBy": 319 // referring to the User entity ID
        "contains": [317, 316, 318] // referring to IDs of the various types of page contents above
        ...
      }
    ]
    ```

# Reference-level explanation

[reference-level-explanation]: #reference-level-explanation

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

- What parts of the design do you expect to resolve through the RFC process before this gets merged?
- What parts of the design do you expect to resolve through the implementation of this feature before stabilization?
- What related issues do you consider out of scope for this RFC that could be addressed in the future independently of the solution that comes out of this RFC?

# Future possibilities

[future-possibilities]: #future-possibilities

Think about what the natural extension and evolution of your proposal would be and how it would affect the project and ecosystem as a whole in a holistic way. Try to use this section as a tool to more fully consider all possible interactions with the project and ecosystem in your proposal. Also consider how this all fits into the roadmap for the project and of the relevant sub-team.

This is also a good place to "dump ideas", if they are out of scope for the RFC you are writing but otherwise related.

If you have tried and cannot think of any future possibilities, you may simply state that you cannot think of anything.

Note that having something written down in the future-possibilities section is not a reason to accept the current or a future RFC; such notes should be in the section on motivation or rationale in this or subsequent RFCs. The section merely provides additional information.
