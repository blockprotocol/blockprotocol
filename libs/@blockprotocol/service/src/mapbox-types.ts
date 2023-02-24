/**
 * The value values for the "type" property of GeoJSON Objects.
 * https://tools.ietf.org/html/rfc7946#section-1.4
 */
export type GeoJsonTypes = GeoJSON["type"];

/**
 * Bounding box
 * https://tools.ietf.org/html/rfc7946#section-5
 */
export type BBox =
  | [number, number, number, number]
  | [number, number, number, number, number, number];

/**
 * A Position is an array of coordinates.
 * https://tools.ietf.org/html/rfc7946#section-3.1.1
 * Array should contain between two and three elements.
 * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
 * but the current specification only allows X, Y, and (optionally) Z to be defined.
 */
export type Position = number[]; // [number, number] | [number, number, number];

/**
 * The base GeoJSON object.
 * https://tools.ietf.org/html/rfc7946#section-3
 * The GeoJSON specification also allows foreign members
 * (https://tools.ietf.org/html/rfc7946#section-6.1)
 * Developers should use "&" type in TypeScript or extend the interface
 * to add these foreign members.
 */
export interface GeoJsonObject {
  // Don't include foreign members directly into this type def.
  // in order to preserve type safety.
  // [key: string]: any;
  /**
   * Specifies the type of GeoJSON object.
   */
  type: GeoJsonTypes;
  /**
   * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
   * The value of the bbox member is an array of length 2*n where n is the number of dimensions
   * represented in the contained geometries, with all axes of the most southwesterly point
   * followed by all axes of the more northeasterly point.
   * The axes order of a bbox follows the axes order of geometries.
   * https://tools.ietf.org/html/rfc7946#section-5
   */
  bbox?: BBox | undefined;
}

/**
 * Union of GeoJSON objects.
 */
export type GeoJSON = Geometry | Feature | FeatureCollection;

/**
 * Geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3
 */
export type Geometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon
  | GeometryCollection;
export type GeometryObject = Geometry;

/**
 * Point geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.2
 */
export interface Point extends GeoJsonObject {
  type: "Point";
  coordinates: Position;
}

/**
 * MultiPoint geometry object.
 *  https://tools.ietf.org/html/rfc7946#section-3.1.3
 */
export interface MultiPoint extends GeoJsonObject {
  type: "MultiPoint";
  coordinates: Position[];
}

/**
 * LineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.4
 */
export interface LineString extends GeoJsonObject {
  type: "LineString";
  coordinates: Position[];
}

/**
 * MultiLineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.5
 */
export interface MultiLineString extends GeoJsonObject {
  type: "MultiLineString";
  coordinates: Position[][];
}

/**
 * Polygon geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.6
 */
export interface Polygon extends GeoJsonObject {
  type: "Polygon";
  coordinates: Position[][];
}

/**
 * MultiPolygon geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.7
 */
export interface MultiPolygon extends GeoJsonObject {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

/**
 * Geometry Collection
 * https://tools.ietf.org/html/rfc7946#section-3.1.8
 */
export interface GeometryCollection<G extends Geometry = Geometry>
  extends GeoJsonObject {
  type: "GeometryCollection";
  geometries: G[];
}

export type GeoJsonProperties = { [name: string]: any } | null;

/**
 * A feature object which contains a geometry and associated properties.
 * https://tools.ietf.org/html/rfc7946#section-3.2
 */
export interface Feature<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
> extends GeoJsonObject {
  type: "Feature";
  /**
   * The feature's geometry
   */
  geometry: G;
  /**
   * A value that uniquely identifies this feature in a
   * https://tools.ietf.org/html/rfc7946#section-3.2.
   */
  id?: string | number | undefined;
  /**
   * Properties associated with this feature.
   */
  properties: P;
}

/**
 * A collection of feature objects.
 *  https://tools.ietf.org/html/rfc7946#section-3.3
 */
export interface FeatureCollection<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
> extends GeoJsonObject {
  type: "FeatureCollection";
  features: Array<Feature<G, P>>;
}

/**
 * This file contains copied and pasted types from the
 * existing `@mapbox/search-js-core` package, which are
 * used to define the mapbox API methods.
 *
 * Directly importing these types would be preferable,
 * however when doing so a typescript incompatibility error
 * is thrown by the `typescript-json-schema` package when
 * generating the `service-module.json` file.
 *
 * @todo address this so these types become more maintainable
 * @see https://app.asana.com/0/0/1204004000163864/f
 */

/**
 * `MatchCodeConfidence` is defined as a scalar in `@mapbox/search-js-core`,
 * and therefore can't be redefined without causing an incompatibility.
 * Therefore it's assigned to be `any` for now.
 */
type MatchCodeConfidence = any;

/**
 * An object describing the level of confidence that the given response feature matches the address intended by the request query.
 * Includes boolean flags denoting matches for each address sub-component.
 *
 * @typedef MatchCode
 */
export interface MatchCode {
  /**
   * A measure of confidence that the returned feature suggestion matches the intended address, based on the search text provided.
   */
  confidence: MatchCodeConfidence;
  /**
   * True if the confidence value is "exact".
   */
  exact_match: boolean;
  /**
   * True if the house number component was matched.
   */
  house_number: boolean;
  /**
   * True if the street component was matched.
   */
  street: boolean;
  /**
   * True if the postcode was matched.
   */
  postcode: boolean;
  /**
   * True if the place component was matched.
   */
  place: boolean;
  /**
   * True if the region component was matched.
   */
  region?: boolean;
  /**
   * True if the locality component was matched.
   */
  locality?: boolean;
}
/**
 * An `AutofillSuggestion` object represents a suggestion
 * result from the Mapbox Autofill API.
 *
 * Suggestion objects are "part one" of the two-step interactive autofill experience.
 * Suggestion objects do not include geographic coordinates.
 *
 * To get the coordinates of the result, use {@link MapboxAutofill#retrieve}.
 *
 * For tracking purposes, it is useful for any follow-up requests based on this suggestion to include same
 * {@link SessionToken} as the original request.
 *
 * @typedef AutofillSuggestion
 * @example
 * ```typescript
 * const autofill = new MapboxAutofill({ accessToken: 'pk.my-mapbox-access-token' });
 *
 * const sessionToken = new SessionToken();
 * const result = await search.autofill('Washington D.C.', { sessionToken });
 * if (result.suggestions.length === 0) return;
 *
 * const suggestion = result.suggestions[0];
 * const { features } = await autofill.retrieve(suggestion, { sessionToken });
 * doSomethingWithCoordinates(features);
 * ```
 */
export interface AutofillSuggestion {
  /**
   * A point accuracy metric for the returned address feature. Can be one of `rooftop`, `parcel`, `point`, `interpolated`, `intersection`, `street`.
   * @see [Point accuracy for address features](https://docs.mapbox.com/api/search/geocoding/#point-accuracy-for-address-features)
   */
  accuracy?: string;
  /**
   * This is added by {@link MapboxAutofill} and is **not** part of the
   * Autofill API.
   *
   * @ignore
   */
  original_search_text: string;
  /**
   * The name of the feature.
   */
  feature_name: string;
  /**
   * The feature name, as matched by the search algorithm.
   */
  matching_name: string;
  /**
   * Additional details, such as city and state for addresses.
   */
  description: string;
  /**
   * The name of the [Maki](https://labs.mapbox.com/maki-icons/) icon associated with the feature.
   */
  maki?: string;
  /**
   * The [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) of the feature.
   */
  language: string;
  address?: string;
  /**
   * The full address of the suggestion.
   */
  full_address?: string;
  /**
   * Address line 1 from the [WHATWG Autocomplete Specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
   */
  address_line1?: string;
  /**
   * Address line 2 from the [WHATWG Autocomplete Specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
   */
  address_line2?: string;
  /**
   * Address line 3 from the [WHATWG Autocomplete Specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
   */
  address_line3?: string;
  /**
   * Address level 1 from the [WHATWG Autocomplete Specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
   */
  address_level1?: string;
  /**
   * Address level 2 from the [WHATWG Autocomplete Specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
   */
  address_level2?: string;
  /**
   * Address level 3 from the [WHATWG Autocomplete Specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
   */
  address_level3?: string;
  /**
   * Long form country name, for example: "United States"
   */
  country?: string;
  /**
   * The short form country name, for example: "us". This follows the
   * [ISO 3166 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) specification.
   */
  country_code?: string;
  /**
   * Postal code.
   */
  postcode?: string;
  /**
   * Address metadata fields of the feature.
   *
   * Includes the short form country name, for example: "us". This follows the
   * [ISO 3166 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) specification.
   */
  metadata: {
    iso_3166_1: string;
  };
  /**
   * A string representing the feature in the requested language, if specified, and its full result hierarchy.
   */
  place_name?: string;
  /**
   * An object describing the level of confidence that the given response feature matches the address intended by the request query.
   * Includes boolean flags denoting matches for each address sub-component.
   */
  match_code: MatchCode;
  /**
   * Action block of the suggestion result.
   * contains id to execute retrieve
   */
  action: {
    id: string;
  };
}
/**
 * @typedef AutofillSuggestionResponse
 */
export interface AutofillSuggestionResponse {
  /**
   * The attribution data for results.
   */
  attribution?: string;
  /**
   * The returned suggestion objects.
   *
   * @see {@link Suggestion}
   */
  suggestions: AutofillSuggestion[];
}
/**
 * A {@link LngLat} object, an array of two numbers representing longitude and latitude,
 * or an object with `lng` and `lat` or `lon` and `lat` properties.
 *
 * @typedef LngLatLike
 * @type {LngLat | [number, number] | { lng: number, lat: number } | { lon: number, lat: number }}
 * @example
 * ```typescript
 * const v1 = new LngLat(-122.420679, 37.772537);
 * const v2 = [-122.420679, 37.772537];
 * const v3 = {lon: -122.420679, lat: 37.772537};
 * ```
 */
export declare type LngLatLike =
  | {
      lng: number;
      lat: number;
    }
  | {
      lon: number;
      lat: number;
    }
  | [number, number];
/**
 * A {@link LngLatBounds} object, an array of {@link LngLatLike} objects in [sw, ne] order,
 * or an array of numbers in [west, south, east, north] order.
 *
 * @typedef LngLatBoundsLike
 * @type {LngLatBounds | [LngLatLike, LngLatLike] | [number, number, number, number]}
 * @example
 * ```typescript
 * const v1 = new LngLatBounds(
 *   new LngLat(-73.9876, 40.7661),
 *   new LngLat(-73.9397, 40.8002)
 * );
 * const v2 = new LngLatBounds([-73.9876, 40.7661], [-73.9397, 40.8002]);
 * const v3 = [[-73.9876, 40.7661], [-73.9397, 40.8002]];
 * ```
 */

export declare type LngLatBoundsLike =
  /**
   * @todo: figure out how to support `LngLatBounds`
   *
   */
  // | LngLatBounds
  [LngLatLike, LngLatLike] | [number, number, number, number];

/**
 * An `AutofillFeatureSuggestion` object represents [GeoJSON](https://docs.mapbox.com/help/glossary/geojson/)
 * suggestion results from the Mapbox Autofill API.
 *
 * As per the Mapbox Autofill API, this will always be [Point](https://geojson.org/geojson-spec.html#point).
 *
 * @typedef AutofillFeatureSuggestion
 * @example
 * ```typescript
 * const featureSuggestion = {
 *   type: 'Feature',
 *   geometry: {
 *     type: 'Point',
 *     coordinates: [0,0]
 *   },
 *   properties: {
 *     feature_name: 'Washington D.C.',
 *   }
 * };
 * ```
 */

export declare type AutofillFeatureSuggestion = Feature<
  Point,
  Omit<AutofillSuggestion, "original_search_text" | "action">
> & {
  /**
   * A bounding box for the feature. This may be significantly
   * larger than the geometry.
   */
  bbox?: LngLatBoundsLike;
};
/**
 * @typedef AutofillRetrieveResponse
 */
export interface AutofillRetrieveResponse {
  type: "FeatureCollection";
  /**
   * The attribution data for results.
   */
  attribution?: string;
  /**
   * The returned feature objects.
   *
   * @see {@link FeatureSuggestion}
   */
  features: AutofillFeatureSuggestion[];
}

/**
 * A {@link SessionToken} object or string representing a Mapbox Search API session token.
 *
 * It's recommended this value is a [UUIDv4](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)) value.
 *
 * @typedef SessionTokenLike
 * @type {SessionToken | string}
 * @example
 * const v1 = new SessionToken();
 * const v2 = new SessionToken('f06e7531-6373-4d5a-8614-b6f313488050');
 * const v3 = 'f06e7531-6373-4d5a-8614-b6f313488050';
 */
export declare type SessionTokenLike = string;

export interface SessionTokenOptions {
  /**
   * A customer-provided session token value, which groups a series of requests together for [billing purposes](https://docs.mapbox.com/api/search/search/#search-api-pricing).
   *
   * Reference:
   * https://docs.mapbox.com/api/search/search/#session-based-pricing
   */
  sessionToken: SessionTokenLike;
}

export interface FetchOptions {
  /**
   * If specified, the connected {@link AbortController} can be used to
   * abort the current network request(s).
   *
   * This mechanism intentionally works in the same way as the
   * [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#aborting_a_fetch).
   *
   * Reference:
   * https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal#examples
   */
  signal?: AbortSignal;
}

/**
 * @typedef AutofillOptions
 */
export interface AutofillOptions {
  /**
   * The [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) to be returned.
   *
   * If not specified, `en` will be used.
   */
  language: string;
  /**
   * An [ISO 3166 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) to be returned.
   *
   * If not specified, results will not be filtered by country.
   */
  country: string;
  /**
   * Limit results to only those contained within the supplied bounding box.
   */
  bbox: string | LngLatBoundsLike;
  /**
   * The number of results to return, up to `10`.
   */
  limit: string | number;
  /**
   * Bias the response to favor results that are closer to this location.
   *
   * When both {@link AutofillOptions#proximity} and {@link AutofillOptions#origin} are specified, `origin` is interpreted as the
   * target of a route, while `proximity` indicates the current user location.
   */
  proximity: string | LngLatLike;
}
export declare type DataTypes =
  | "country"
  | "region"
  | "postcode"
  | "district"
  | "place"
  | "locality"
  | "neighborhood"
  | "address"
  | "poi";

/**
 * @typedef GeocodeOptions
 */
export interface GeocodeOptions {
  /**
   * When autocomplete is enabled, results will be included that start with the requested string, rather than just responses that match it exactly.
   *
   * Defaults to true.
   */
  autocomplete: boolean;
  /**
   * Limit results to only those contained within the supplied bounding box.
   */
  bbox: string | LngLatBoundsLike;
  /**
   * Limit results to one or more countries. Permitted values are [ISO 3166 alpha 2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country codes separated by commas.
   */
  country: string;
  /**
   * Specify whether the Geocoding API should attempt approximate, as well as exact, matching when performing searches.
   *
   * Defaults to true.
   */
  fuzzyMatch: boolean;
  /**
   * An [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) that controls the language of the text supplied in responses, and also affects result scoring.
   */
  language: string;
  /**
   * The number of results to return, up to `10`.
   *
   * Defaults to 5.
   */
  limit: number;
  /**
   * Bias the response to favor results that are closer to this location.
   *
   * Provided as two comma-separated coordinates in longitude,latitude order, or the string `ip` to bias based on reverse IP lookup.
   */
  proximity: string | LngLatLike;
  /**
   * Specify whether to request additional metadata about the recommended navigation destination corresponding to the feature (`true`) or not (`false`, default). Only applicable for address features.
   */
  routing: boolean;
  /**
   * Filter results to include only a subset (one or more) of the available feature types. Multiple options can be comma-separated.
   */
  types: string | Set<DataTypes>;
  /**
   * Available worldviews are: `cn`, `in`, `jp`, `us`. If a worldview is not set, `us` worldview boundaries will be returned.
   */
  worldview: string;
}

export interface PermanentOptions {
  /**
   * Permanent geocodes are used for use cases that require storing
   * position data. If 'true', the permanent endpoints will be used, which are
   * billed separately.
   *
   * If you're interested in using {@link PermanentOptions#permanent}, contact
   * [Mapbox sales](https://www.mapbox.com/contact/sales/).
   *
   * It's important to speak with an Account Manager on the Sales team prior to making requests
   * with {@link PermanentOptions#permanent} set to `true`, as unsuccessful requests
   * made by an account that does not have access to the endpoint may be billable.
   */
  permanent: boolean;
}
/**
 * Raw [GeoJSON](https://docs.mapbox.com/help/glossary/geojson/) feature properties
 * from the [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/).
 *
 * Reference:
 * https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object
 *
 * @typedef GeocodeFeatureProperties
 */
export interface GeocodeFeatureProperties {
  /**
   * A point accuracy metric for the returned address feature. Can be one of `rooftop`, `parcel`, `point`, `interpolated`, `intersection`, `street`.
   * @see [Point accuracy for address features](https://docs.mapbox.com/api/search/geocoding/#point-accuracy-for-address-features)
   */
  accuracy?: string;
  /**
   * The full street address for the returned `poi` feature.
   */
  address?: string;
  /**
   * Comma-separated categories for the returned `poi` feature.
   */
  category?: string;
  /**
   * The name of a suggested [Maki](https://www.mapbox.com/maki-icons/) icon to visualize a `poi` feature based on its `category`.
   */
  maki?: string;
  /**
   * The [Wikidata](https://wikidata.org/) identifier for the returned feature.
   */
  wikidata?: string;
  /**
   * The [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country and [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) region code for the returned feature.
   */
  short_code?: string;
}
/**
 * Object representing one level of hierarcy among encompassing parent features for a given {@link GeocodeFeature}.
 *
 * @typedef GeocodeFeatureContext
 */
export declare type GeocodeFeatureContext =
  Partial<GeocodeFeatureProperties> & {
    /**
     * A feature ID in the format `{type}.{id}`.
     */
    id: string;
    /**
     * A string representing the feature in the requested language, if specified.
     */
    text: string;
  };
/**
 * A `GeocodeFeature` object represents a [GeoJSON](https://docs.mapbox.com/help/glossary/geojson/) feature result from the [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/).
 *
 * **Legal terms:**
 *
 * Due to legal terms from our data sources, results from the [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/) should come from the `permanentForward` & `permanentReverse`
 * methods if the results are to be cached/stored in a customer database. Otherwise, results should be used ephemerally and not persisted.
 *
 * This permanent policy is consistent with the [Mapbox Terms of Service](https://www.mapbox.com/tos/) and failure to comply
 * may result in modified or discontinued service.
 *
 * Additionally, the [Mapbox Terms of Service](https://www.mapbox.com/tos/) states any rendering of a feature suggestion
 * must be using Mapbox map services (for example, displaying results on Google Maps or MapKit JS is not allowed).
 *
 * **Disclaimer:**
 *
 * The failure of Mapbox to exercise or enforce any right or provision of these Terms will not constitute a waiver of such right or provision.
 *
 * @typedef GeocodeFeature
 * @see [Geocoding response object](https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object)
 */
export declare type GeocodeFeature = Feature<
  Point,
  GeocodeFeatureProperties
> & {
  accuracy?: string;
  /**
   * A feature ID in the format `{type}.{id}` where `{type}` is the lowest hierarchy feature in the `place_type` field.
   */
  id: string;
  /**
   * An array of {@link DataTypes} describing the feature.
   */
  place_type: string[];
  /**
   * Indicates how well the returned feature matches the user's query on a scale from `0` to `1`, with `1` meaning the result fully matches the query text.
   */
  relevance: number;
  /**
   * The house number for the returned `address` feature.
   */
  address?: string;
  /**
   * A string representing the feature in the requested language, if specified.
   */
  text: string;
  /**
   * A string representing the feature in the requested language, if specified, and its full result hierarchy.
   */
  place_name: string;
  /**
   * A string analogous to the text field that more closely matches the query than results in the specified language.
   */
  matching_text?: string;
  /**
   * A string analogous to the `place_name` field that more closely matches the query than results in the specified language.
   */
  matching_place_name?: string;
  /**
   * A string of the [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) of the query’s primary language.
   */
  language?: string;
  /**
   * A bounding box for the feature. This may be significantly
   * larger than the geometry.
   */
  bbox?: LngLatBoundsLike;
  /**
   * The coordinates of the feature’s center in the form `[longitude,latitude]`.
   */
  center: LngLatLike;
  /**
   * An array representing the hierarchy of encompassing parent features. Each parent feature may include any of the above properties.
   */
  context: GeocodeFeatureContext[];
};

/**
 * A `GeocodeResponse` object represents a returned data object from the [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object).
 *
 * @typedef GeocodeResponse
 */
export interface GeocodeResponse {
  /**
   * `"FeatureCollection"`, a GeoJSON type from the [GeoJSON specification](https://tools.ietf.org/html/rfc7946).
   */
  type: "FeatureCollection";
  /**
   * Forward geocodes: An array of space and punctuation-separated strings from the original query.
   *
   * Reverse geocodes: An array containing the coordinates being queried.
   */
  query: string[];
  /**
   * The returned feature objects.
   *
   * @see {@link GeocodeFeature}
   */
  features: GeocodeFeature[];
  /**
   * Attributes the results of the Mapbox Geocoding API to Mapbox.
   */
  attribution: string;
}
