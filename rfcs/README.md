# Block Protocol RFCs

The "RFC" (request for comments) process is intended to provide a consistent and controlled path for new features to enter the project.

Many changes, including bug fixes and documentation improvements can be implemented and reviewed via the normal GitHub pull request workflow.

Some changes though are "substantial", and we ask that these be put through a bit of a design process and produce a consensus approved by the Block Protocol Core Team.

**Browse RFCs:**

- [Active RFCs](https://github.com/blockprotocol/blockprotocol/discussions/categories/rfc)
- [Proposed RFCs](https://github.com/blockprotocol/blockprotocol/pulls?q=is%3Aopen+is%3Apr+label%3A%22area%3A+rfcs%22)

## Table of Contents

- [When to follow this process]
- [Before creating an RFC]
- [What the process is]
- [The RFC life-cycle]
- [Reviewing RFCs]
- [Implementing an RFC]
- [Inspiration]

## When to follow this process

[when to follow this process]: #when-to-follow-this-process

You should consider using this process if you intend to make "substantial" changes to the Block Protocol or its documentation. Some examples that would benefit from an RFC are:

- The introduction of new modules
- The removal of features that already shipped
- The introduction of new idiomatic usage or conventions, even if they do not include code changes to the Block Protocol itself.

Some changes do not require an RFC:

- Rephrasing, reorganizing or refactoring
- Additions that strictly improve objective, numerical quality criteria (speedup, better browser support, warning removal, etc.)
- Additions only likely to be _noticed by_ other implementors-of-Block-Protocol, invisible to users-of-Block-Protocol.

## Before creating an RFC

[before creating an rfc]: #before-creating-an-rfc

A hastily-proposed RFC can hurt its chances of acceptance. Low quality proposals, proposals for previously-rejected features, or those that don't fit into the near-term roadmap, may be quickly rejected, which can be demotivating for the unprepared contributor. Laying some groundwork ahead of the RFC can make the process smoother.

Although there is no single way to prepare for submitting an RFC, it is generally a good idea to pursue feedback from other project developers beforehand, to ascertain that the RFC may be desirable; having a consistent impact on the project requires concerted effort toward consensus-building.

The most common preparations for writing and submitting an RFC includes talking the idea over on our [discussions forum](https://github.com/blockprotocol/blockprotocol/discussions), or in a relevant issue where one already exists.

As a rule of thumb, receiving encouraging feedback from long-standing project developers, and particularly members of the core team is a good indication that the RFC is worth pursuing.

## What the process is

[what the process is]: #what-the-process-is

In short, to get a major feature added to the Block Protocol, one must first get the RFC merged into the [`/rfcs`](../rfcs) folder as a markdown file. At that point the RFC is "active" and may be implemented with the goal of eventual inclusion into the Block Protocol.

- Fork the Block Protocol repo https://github.com/blockprotocol/blockprotocol
- Copy [`rfcs/0000-template.md`](0000-template.md) to `rfcs/text/0000-my-feature.md` (where 'my-feature' is descriptive. Don't assign an RFC number yet).
- Fill in the RFC. Put care into the details: **RFCs that do not present convincing motivation, demonstrate understanding of the impact of the design, or are disingenuous about the drawbacks or alternatives tend to be poorly-received**.
- Submit a pull request. As a pull request the RFC will receive design feedback from the larger community, and the author should be prepared to revise it in response.
- Now that your RFC has an open pull request, use the issue number of the PR to update your `0000-` prefix to that number
- Build consensus and integrate feedback. RFCs that have broad support are much more likely to make progress than those that don't receive any comments.
- The core team will discuss the RFC pull request, as much as possible in the comment thread of the pull request itself. Offline discussion will be summarized on the pull request comment thread.
- RFCs rarely go through this process unchanged, especially as alternatives and drawbacks are shown. You can make edits, big and small, to the RFC to clarify or change the design, but make changes as new commits to the pull request, and leave a comment on the pull request explaining your changes. Specifically, **do not squash or rebase commits after they are visible on the pull request**.
- An RFC may be rejected by the team after public discussion has settled and comments have been made summarizing the rationale for rejection. A member of the team should then close the RFCs associated pull request.
- An RFC may be accepted by decision of the core team. A team member will merge the RFCs associated pull request, at which point the RFC will become 'active'.

## The RFC life-cycle

[the rfc life-cycle]: #the-rfc-life-cycle

Once an RFC becomes active, then authors may implement it and submit the feature as a pull request to the Block Protocol repo. Becoming 'active' is not a rubber stamp, and in particular still does not mean the feature will ultimately be merged; it does mean that the core team has agreed to it in principle and are amenable to merging it.

Furthermore, the fact that a given RFC has been accepted and is 'active' implies nothing about what priority is assigned to its implementation, nor whether anybody is currently working on it.

Modifications to active RFCs can be done in followup PRs. We strive to write each RFC in a manner that it will reflect the final design of the feature; but the nature of the process means that we cannot expect every merged RFC to actually reflect what the end result will be at the time of the next major release; therefore we try to keep each RFC document somewhat in sync with the language feature as planned, tracking such changes via followup pull requests to the document.

## Reviewing RFCs

[reviewing rfcs]: #reviewing-rfcs

While the RFC pull request is up, the team may schedule meetings with the author and/or relevant stakeholders to discuss the issues in greater detail. In such cases a summary from the meeting will be posted back to the RFC pull request.

The team makes final decisions about RFCs after the benefits and drawbacks are well understood. These decisions can be made at any time, but the team will regularly issue decisions. When a decision is made, the RFC pull request will either be merged or closed. In either case, if the reasoning is not clear from the discussion in thread, the team will add a comment describing the rationale for the decision.

## Implementing an RFC

[implementing an rfc]: #implementing-an-rfc

Some accepted RFCs represent vital features that need to be implemented right away. Other accepted RFCs can represent features that can wait until some arbitrary developer feels like doing the work. Every accepted RFC will have an associated thread on [GitHub Discussions](https://github.com/blockprotocol/blockprotocol/discussions/categories/rfc) tracking its implementation in the Block Protocol repository; thus that associated discussion can be assigned a priority via the triage process that the team uses for all known-issues.

The author of an RFC is not obligated to implement it. Of course, the RFC author (like any other developer) is welcome to post an implementation for review after the RFC has been accepted.

If you are interested in working on the implementation for an "active" RFC, but cannot determine if someone else is already working on it, feel free to ask (e.g. by leaving a comment on the associated GitHub Discussion).

## Inspiration

[inspiration]: #inspiration

The Block Protocols's RFC process strongly owes its inspiration to the [Rust RFC process], and [React RFC process].

[rust rfc process]: https://github.com/rust-lang/rfcs
[react rfc process]: https://github.com/reactjs/rfcs

We're open to changing it as needed in response to feedback.
