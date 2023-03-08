/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */

import { Entity, LinkData } from "@blockprotocol/graph"

import { AvatarPropertyValue, EMailPropertyValue, FoundedByProperties, LinkProperties, MyNewPersonProperties, MyOldPersonProperties, NamePropertyValue, OrganizationProperties, Text, WebsitePropertyValue } from "./shared"

export type { AvatarPropertyValue, EMailPropertyValue, FoundedByProperties, LinkProperties, MyNewPersonProperties, MyOldPersonProperties, NamePropertyValue, OrganizationProperties, Text, WebsitePropertyValue }



export type EmployedBy = Entity<EmployedByProperties> & { linkData: LinkData }


/**
 * In employment of this entity.
 */
export type EmployedByProperties = (EmployedByProperties1 & EmployedByProperties2)
export type EmployedByProperties1 = LinkProperties


export type EmployedByProperties2 = {

}

