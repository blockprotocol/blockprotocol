/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */

import { Entity, LinkData } from "@blockprotocol/graph"

import { AddressBlock, AddressBlockProperties, DescriptionPropertyValue, FileNamePropertyValue, FileURLPropertyValue, LinkProperties, MIMETypePropertyValue, Number, RemoteFileProperties, Text, TitlePropertyValue } from "./shared"

export type { AddressBlock, AddressBlockProperties, DescriptionPropertyValue, FileNamePropertyValue, FileURLPropertyValue, LinkProperties, MIMETypePropertyValue, Number, RemoteFileProperties, Text, TitlePropertyValue }



export type Address = Entity<AddressProperties>


/**
 * The broadest administrative level in the address, i.e. the province within which the locality is found; for example, in the US, this would be the state; in Switzerland it would be the canton; in the UK, the post town.
 * 
 * Corresponds to the “address-level1” field of the “WHATWG Autocomplete Specification”.
 * 
 * See: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-autocomplete-address-level1
 */
export type AddressLevel1PropertyValue = Text









/**
 * Information required to identify a specific location on the planet associated with a postal address.
 */
export type AddressProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/street-address-line-1/": StreetAddressLine1PropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/address-level-1/": AddressLevel1PropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/postal-code/": PostalCodePropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/alpha-2-country-code/": Alpha2CountryCodePropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/mapbox-full-address/"?: MapboxFullAddressPropertyValue
}


/**
 * The short-form of a country’s name.
 * 
 * Conforms to the ISO 3166 alpha-2 country code specification.
 * 
 * See: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
 */
export type Alpha2CountryCodePropertyValue = Text




export type BlockEntity = AddressBlock



export type HasAddress = Entity<HasAddressProperties> & { linkData: LinkData }


/**
 * Contains an address.
 * 
 * See: https://blockprotocol.org/@hash/types/entity-type/address
 */
export type HasAddressProperties = (HasAddressProperties1 & HasAddressProperties2)
export type HasAddressProperties1 = LinkProperties


export type HasAddressProperties2 = {

}



export type HasMapImage = Entity<HasMapImageProperties> & { linkData: LinkData }


/**
 * Contains an image of a map.
 */
export type HasMapImageProperties = (HasMapImageProperties1 & HasMapImageProperties2)
export type HasMapImageProperties1 = LinkProperties


export type HasMapImageProperties2 = {

}


/**
 * The ID provided by Mapbox used to identify and retrieve an address.
 */
export type MapboxAddressIDPropertyValue = Text



/**
 * A complete address as a string.
 * 
 * Conforms to the “full_address” output of the Mapbox Autofill API.
 * 
 * See: https://docs.mapbox.com/mapbox-search-js/api/core/autofill/#autofillsuggestion#full_address
 */
export type MapboxFullAddressPropertyValue = Text



/**
 * The level that controls how zoomed in or out a Mapbox static image is. Should be an integer between 0 and 22 (inclusive).
 * 
 * See: https://docs.mapbox.com/api/maps/static-images/#retrieve-a-static-map-from-a-style
 */
export type MapboxStaticImageZoomLevelPropertyValue = Number



/**
 * The postal code of an address.
 * 
 * This should conform to the standards of the area the code is from, for example
 * 
 * - a UK postcode might look like: “SW1A 1AA”
 * 
 * - a US ZIP code might look like: “20500”
 */
export type PostalCodePropertyValue = Text



/**
 * The first line of street information of an address. 
 * 
 * Conforms to the “address-line1” field of the “WHATWG Autocomplete Specification”.
 * 
 * See: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-autocomplete-address-level1
 */
export type StreetAddressLine1PropertyValue = Text


