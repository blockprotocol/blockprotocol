import { MessageCallback } from "@blockprotocol/core";

import {
  AutofillOptions,
  AutofillRetrieveResponse,
  AutofillSuggestion,
  AutofillSuggestionResponse,
  FetchOptions,
  GeocodeOptions,
  GeocodeResponse,
  LngLatBoundsLike,
  LngLatLike,
  PermanentOptions,
  SessionTokenOptions,
} from "./mapbox-types";

export type BlockExternalApiMessageCallbacks = {};

export type EmbedderExternalApiMessages = {};

/**
 * @todo: add definition for external API errors
 * @see TODO
 */
// export type ExternalApiError = ...;

/** Mapbox Geocoding API */

export type MapboxForwardGeocodingData = {
  searchText: string;
  optionsArg?: Partial<FetchOptions & GeocodeOptions & PermanentOptions>;
};

export type MapboxForwardGeocodingResponseData = GeocodeResponse;

export type MapboxReverseGeocodingData = {
  lngLat: string | LngLatLike;
  optionsArg?: Partial<FetchOptions & GeocodeOptions & PermanentOptions>;
};

export type MapboxReverseGeocodingResponseData = GeocodeResponse;

// export type MapboxBatchGeocodingData = {};

// export type MapboxBatchGeocodingResponseData = {};

/** Mapbox Directions API */

type RetrieveDirectionsBaseArgs = {
  coordinates: [number, number][];
  alternatives?: boolean;
  annotations?:
    | "distance"
    | "duration"
    | "speed"
    | "congestion"
    | "congestion_numeric"
    | "maxspeed"
    | "closure"
    | "state_of_charge";
  avoid_maneuver_radius?: number;
  bearings?: number;
  layers?: number;
  continue_straight?: boolean;
  exclude?:
    | "motorway"
    | "toll"
    | "ferry"
    | "unpaved"
    | "cash_only_tolls"
    | string;
  geometries?: string;
  include?: "hov2" | "hov3" | "hot";
  overview?: string;
  radiuses?: number | string;
  approaches?: string;
  steps?: boolean;
  banner_instructions?: boolean;
  language?: string;
  roundabout_exits?: boolean;
  voice_instructions?: boolean;
  voice_units?: string;
  waypoints?: number[];
  waypoints_per_route?: boolean;
  waypoint_names?: string[];
  waypoint_targets?: number[];
};

type RetrieveWalkingDirectionsArgs = {
  profile: "mapbox/walking";
  walking_speed?: number;
  walkway_bias?: number;
} & RetrieveDirectionsBaseArgs;

type RetrieveDrivingTrafficDirectionsArgs = {
  profile: "mapbox/driving-traffic";
  alley_bias?: number;
  arrive_by?: string;
  depart_at?: string;
  use_current_time?: boolean;
  max_height?: number;
  max_width?: number;
  max_weight?: number;
} & RetrieveDirectionsBaseArgs;

type RetrieveDrivingDirectionsArgs = {
  profile: "mapbox/driving";
  depart_at?: string;
  use_current_time?: boolean;
  snapping_include_closures?: boolean;
  snapping_include_static_closures?: boolean;
  max_height?: number;
  max_width?: number;
  max_weight?: number;
} & RetrieveDirectionsBaseArgs;

type RetrieveCyclingDirectionsArgs = {
  profile: "mapbox/cycling";
} & RetrieveDirectionsBaseArgs;

export type MapboxRetrieveDirectionsData =
  | RetrieveWalkingDirectionsArgs
  | RetrieveDrivingTrafficDirectionsArgs
  | RetrieveDrivingDirectionsArgs
  | RetrieveCyclingDirectionsArgs;

export type MapboxRetrieveDirectionsResponseData = {
  code: string;
  /** @todo: type this properly */
  routes: any[];
};

/** Mapbox Isochrone API */

export type MapboxRetrieveIsochronesData = {
  profile: "mapbox/driving" | "mapbox/walking" | "mapbox/cycling";
  coordinates: [number, number][];
  contours_minutes: number;
  contours_meters: number;
  contours_colors?: string;
  polygons?: boolean;
  denoise?: number;
  generalize?: number;
};

export type MapboxRetrieveIsochronesResponseData = {
  /** @todo: type this properly */
  features: any[];
};

/** Mapbox Autofill API */

export type MapboxSuggestAddressData = {
  searchText: string;
  optionsArg: SessionTokenOptions & Partial<FetchOptions & AutofillOptions>;
};

export type MapboxSuggestAddressResponseData = AutofillSuggestionResponse;

export type MapboxRetrieveAddressData = {
  suggestion: AutofillSuggestion;
  optionsArg: SessionTokenOptions & Partial<FetchOptions>;
};

export type MapboxRetrieveAddressResponseData = AutofillRetrieveResponse;

export type MapboxCanRetrieveAddressData = {
  suggestion: AutofillSuggestion;
};

export type MapboxCanRetrieveAddressResponseData = {
  canRetrieveAddress: boolean;
};

/** Mapbox Static Maps API */

export type MapboxRetrieveStaticMapData = {
  username: string;
  style_id: string;
  overlay: string;
  lon: number;
  lat: number;
  zoom: number;
  bbox: LngLatBoundsLike;
  auto: string;
  width: number;
  height: number;
  bearing?: number;
  pitch?: number;
  "@2x"?: string;
  attribution?: boolean;
  logo?: boolean;
  before_layer?: string;
  addlayer?: {
    id: string;
    type:
      | "fill"
      | "line"
      | "symbol"
      | "circle"
      | "heatmap"
      | "fill-extrusion"
      | "raster"
      | "hillshade"
      | "background"
      | "sky";
    fill?: string;
    line?: string;
    symbol?: string;
    circle?: string;
    heatmap?: string;
    "fill-extrusion"?: string;
    raster?: string;
    hillshade?: string;
    background?: string;
    sky?: string;
  };
  setfilter?: string[];
  layer_id?: string;
  padding?: string;
};

/**
 * @todo: figure out if this is the best way of handling a "buffer array"
 */
export type MapboxRetrieveStaticMapResponseData = string;

export type EmbedderExternalApiMessageCallbacks = {
  /** Mapbox Geocoding API */

  mapboxForwardGeocoding: MessageCallback<
    MapboxForwardGeocodingData,
    null,
    MapboxForwardGeocodingResponseData,
    null
  >;

  mapboxReverseGeocoding: MessageCallback<
    MapboxReverseGeocodingData,
    null,
    MapboxReverseGeocodingResponseData,
    null
  >;

  /** Mapbox Directions API */

  mapboxRetrieveDirections: MessageCallback<
    MapboxRetrieveDirectionsData,
    null,
    MapboxRetrieveDirectionsResponseData,
    null
  >;

  /** Mapbox Isochrone API */

  mapboxRetrieveIsochrones: MessageCallback<
    MapboxRetrieveIsochronesData,
    null,
    MapboxRetrieveIsochronesResponseData,
    null
  >;

  /** Mapbox Autofill API */

  mapboxSuggestAddress: MessageCallback<
    MapboxSuggestAddressData,
    null,
    MapboxSuggestAddressResponseData,
    null
  >;

  mapboxRetrieveAddress: MessageCallback<
    MapboxRetrieveAddressData,
    null,
    MapboxRetrieveAddressResponseData,
    null
  >;

  mapboxCanRetrieveAddress: MessageCallback<
    MapboxCanRetrieveAddressData,
    null,
    MapboxCanRetrieveAddressResponseData,
    null
  >;

  /** Mapbox Static Map API */

  mapboxRetrieveStaticMap: MessageCallback<
    MapboxRetrieveStaticMapData,
    null,
    MapboxRetrieveStaticMapResponseData,
    null
  >;
};

export type BlockExternalApiMessages<
  Key extends keyof EmbedderExternalApiMessageCallbacks = keyof EmbedderExternalApiMessageCallbacks,
> = {
  [key in Key]: ({
    data,
    errors,
  }: Parameters<EmbedderExternalApiMessageCallbacks[key]>[0]) => ReturnType<
    EmbedderExternalApiMessageCallbacks[key]
  >;
};
