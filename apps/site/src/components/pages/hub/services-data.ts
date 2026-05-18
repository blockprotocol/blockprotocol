/**
 * Static catalogue of third-party services we want to surface on the Hub.
 *
 * These are intentionally **aspirational** — some are wired up to working
 * blocks today, others are listed to give a sense of what we expect to be
 * accessible to blocks over time. Individual entries don't link out to
 * standalone detail pages; the listing exists to paint a picture of the
 * breadth of APIs blocks can (or could) reach.
 *
 * If you add a new provider, give it a brand-ish colour and a one or
 * two-character monogram for the avatar. Single characters render most
 * cleanly inside the 28-pixel circle.
 */

import { ServiceItemDescription } from "./hub";

type ProviderKey =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "mistral"
  | "cohere"
  | "elevenlabs"
  | "replicate"
  | "huggingface"
  | "mapbox"
  | "googlemaps"
  | "stripe"
  | "twilio"
  | "resend"
  | "sendgrid"
  | "linear"
  | "github"
  | "notion"
  | "slack"
  | "discord"
  | "airtable"
  | "algolia"
  | "pinecone"
  | "weaviate"
  | "plaid"
  | "shopify"
  | "spotify"
  | "openweather"
  | "wolfram"
  | "nasa"
  | "wikimedia"
  | "hash"
  | "rapidapi";

type ProviderConfig = {
  name: string;
  /** Background colour for the avatar circle. */
  color: string;
  /** 1-2 character monogram rendered in white over `color`. */
  initial: string;
  /**
   * Optional override for the `@handle` shown beneath each service. Defaults
   * to the provider key. Only set this when two providers represent different
   * product lines of the same company (e.g. Google's Gemini APIs vs. Google
   * Maps both render as `@google`).
   */
  handle?: string;
};

const PROVIDERS: Record<ProviderKey, ProviderConfig> = {
  openai: { name: "OpenAI", color: "#10A37F", initial: "O" },
  anthropic: { name: "Anthropic", color: "#D97757", initial: "A" },
  google: { name: "Google", color: "#4285F4", initial: "G" },
  xai: { name: "xAI", color: "#0B0B0B", initial: "x" },
  mistral: { name: "Mistral", color: "#FA520F", initial: "M" },
  cohere: { name: "Cohere", color: "#FF7759", initial: "C" },
  elevenlabs: { name: "ElevenLabs", color: "#1F1F1F", initial: "11" },
  replicate: { name: "Replicate", color: "#000000", initial: "R" },
  huggingface: { name: "Hugging Face", color: "#FFD21E", initial: "HF" },
  mapbox: { name: "Mapbox", color: "#4264FB", initial: "M" },
  googlemaps: {
    name: "Google Maps",
    color: "#34A853",
    initial: "G",
    handle: "google",
  },
  stripe: { name: "Stripe", color: "#635BFF", initial: "S" },
  twilio: { name: "Twilio", color: "#F22F46", initial: "T" },
  resend: { name: "Resend", color: "#1F1F1F", initial: "R" },
  sendgrid: { name: "SendGrid", color: "#1A82E2", initial: "SG" },
  linear: { name: "Linear", color: "#5E6AD2", initial: "L" },
  github: { name: "GitHub", color: "#181717", initial: "G" },
  notion: { name: "Notion", color: "#1F1F1F", initial: "N" },
  slack: { name: "Slack", color: "#4A154B", initial: "S" },
  discord: { name: "Discord", color: "#5865F2", initial: "D" },
  airtable: { name: "Airtable", color: "#FCB400", initial: "A" },
  algolia: { name: "Algolia", color: "#003DFF", initial: "A" },
  pinecone: { name: "Pinecone", color: "#1C17FF", initial: "P" },
  weaviate: { name: "Weaviate", color: "#22B6E0", initial: "W" },
  plaid: { name: "Plaid", color: "#111111", initial: "P" },
  shopify: { name: "Shopify", color: "#95BF47", initial: "S" },
  spotify: { name: "Spotify", color: "#1DB954", initial: "S" },
  openweather: { name: "OpenWeather", color: "#EB6E4B", initial: "OW" },
  wolfram: { name: "Wolfram", color: "#DD1100", initial: "W" },
  nasa: { name: "NASA", color: "#0B3D91", initial: "N" },
  wikimedia: { name: "Wikimedia", color: "#3366CC", initial: "W" },
  hash: { name: "HASH", color: "#1748E7", initial: "H" },
  rapidapi: { name: "RapidAPI", color: "#003545", initial: "R" },
};

type ServiceInput = {
  provider: ProviderKey;
  /** API name shown as the entry title (without the provider prefix). */
  name: string;
  description: string;
  /** Short category label used in the metadata row beneath the title. */
  category: string;
};

const SERVICES: ServiceInput[] = [
  // ─── OpenAI ──────────────────────────────────────────────────────────────
  {
    provider: "openai",
    name: "Responses API",
    description:
      "Build agentic experiences with built-in tools, reasoning, and persistent state.",
    category: "Text & reasoning",
  },
  {
    provider: "openai",
    name: "Chat Completions API",
    description:
      "Streamed, structured, and tool-augmented text generation from GPT models.",
    category: "Text & reasoning",
  },
  {
    provider: "openai",
    name: "Audio API",
    description:
      "Speech-to-text, text-to-speech, and translation across dozens of languages.",
    category: "Voice & audio",
  },
  {
    provider: "openai",
    name: "Images API",
    description:
      "Generate, edit, and inpaint images with GPT Image and DALL·E models.",
    category: "Images",
  },
  {
    provider: "openai",
    name: "Video API",
    description:
      "Generate cinematic video from prompts and source frames using Sora.",
    category: "Video",
  },
  {
    provider: "openai",
    name: "Embeddings API",
    description:
      "Convert text and code into dense vector representations for search and RAG.",
    category: "Embeddings",
  },
  {
    provider: "openai",
    name: "Moderation API",
    description:
      "Flag unsafe text and images across categories like violence, self-harm, and hate.",
    category: "Safety",
  },

  // ─── Anthropic ───────────────────────────────────────────────────────────
  {
    provider: "anthropic",
    name: "Messages API",
    description:
      "Multi-turn conversations with Claude, including extended thinking and tool use.",
    category: "Text & reasoning",
  },
  {
    provider: "anthropic",
    name: "Computer Use",
    description:
      "Let Claude operate a virtual desktop, browser, or terminal sandbox.",
    category: "Agents & tools",
  },
  {
    provider: "anthropic",
    name: "Files API",
    description:
      "Attach long documents and reference them across Claude conversations.",
    category: "Documents",
  },

  // ─── Google ──────────────────────────────────────────────────────────────
  {
    provider: "google",
    name: "Gemini API",
    description:
      "Multimodal reasoning across text, images, audio, and video at scale.",
    category: "Text & reasoning",
  },
  {
    provider: "google",
    name: "Imagen API",
    description:
      "Photorealistic image generation from text and reference imagery.",
    category: "Images",
  },
  {
    provider: "google",
    name: "Veo API",
    description: "High-fidelity, prompt-driven video generation.",
    category: "Video",
  },

  // ─── Other LLM providers ─────────────────────────────────────────────────
  {
    provider: "xai",
    name: "Grok API",
    description:
      "Real-time-aware chat completions with native tool use and web search.",
    category: "Text & reasoning",
  },
  {
    provider: "mistral",
    name: "Models API",
    description: "Open-weight and frontier language models hosted in Europe.",
    category: "Text & reasoning",
  },
  {
    provider: "cohere",
    name: "Command API",
    description:
      "Production-tuned chat and tool-use models for enterprise workloads.",
    category: "Text & reasoning",
  },
  {
    provider: "cohere",
    name: "Rerank API",
    description:
      "Boost the relevance of search and RAG pipelines with neural reranking.",
    category: "Embeddings",
  },

  // ─── Voice & audio ───────────────────────────────────────────────────────
  {
    provider: "elevenlabs",
    name: "Text-to-Speech",
    description:
      "Lifelike, multilingual voice synthesis with emotional control.",
    category: "Voice & audio",
  },
  {
    provider: "elevenlabs",
    name: "Voice Conversion",
    description:
      "Transform any voice while preserving emotion, timing, and inflection.",
    category: "Voice & audio",
  },

  // ─── Open model hosting ──────────────────────────────────────────────────
  {
    provider: "replicate",
    name: "Hosted Models",
    description:
      "Run thousands of open-source models — image, audio, text, video — from a single API.",
    category: "Open models",
  },
  {
    provider: "huggingface",
    name: "Inference Providers",
    description:
      "Call open models hosted by Together, Replicate, Fal, and other providers.",
    category: "Open models",
  },

  // ─── Maps & places ───────────────────────────────────────────────────────
  {
    provider: "mapbox",
    name: "Maps API",
    description:
      "Interactive vector maps with custom styling and live data overlays.",
    category: "Maps & places",
  },
  {
    provider: "mapbox",
    name: "Geocoding API",
    description: "Convert addresses to coordinates and back, worldwide.",
    category: "Maps & places",
  },
  {
    provider: "mapbox",
    name: "Directions API",
    description: "Driving, walking, cycling, and traffic-aware routing.",
    category: "Maps & places",
  },
  {
    provider: "mapbox",
    name: "Search Box API",
    description:
      "Place autocomplete with rich category metadata and POI details.",
    category: "Maps & places",
  },
  {
    provider: "mapbox",
    name: "Static Images API",
    description: "On-demand map images for thumbnails, previews, and embeds.",
    category: "Maps & places",
  },
  {
    provider: "googlemaps",
    name: "Places API",
    description:
      "Detail, autocomplete, photos, and reviews for points of interest worldwide.",
    category: "Maps & places",
  },

  // ─── Vector & search ─────────────────────────────────────────────────────
  {
    provider: "algolia",
    name: "Search API",
    description:
      "Hosted instant search with typo tolerance and relevance tuning.",
    category: "Search",
  },
  {
    provider: "pinecone",
    name: "Vector Database",
    description: "Managed vector search for retrieval-augmented generation.",
    category: "Embeddings",
  },
  {
    provider: "weaviate",
    name: "Cloud API",
    description:
      "Open-source vector database with hybrid search and pluggable modules.",
    category: "Embeddings",
  },

  // ─── Payments & commerce ─────────────────────────────────────────────────
  {
    provider: "stripe",
    name: "Payments API",
    description: "Accept card, wallet, bank, and BNPL payments worldwide.",
    category: "Payments",
  },
  {
    provider: "stripe",
    name: "Subscriptions API",
    description: "Recurring billing, trials, proration, and dunning.",
    category: "Payments",
  },
  {
    provider: "plaid",
    name: "Financial Data API",
    description:
      "Connect to bank accounts and read transactions, balances, and identities.",
    category: "Payments",
  },
  {
    provider: "shopify",
    name: "Storefront & Admin API",
    description:
      "Read and write merchant catalogs, orders, and customer records.",
    category: "Commerce",
  },

  // ─── Communications ──────────────────────────────────────────────────────
  {
    provider: "twilio",
    name: "Messaging API",
    description: "Send SMS, MMS, and WhatsApp messages programmatically.",
    category: "Communications",
  },
  {
    provider: "twilio",
    name: "Voice API",
    description: "Make, receive, and record phone calls.",
    category: "Communications",
  },
  {
    provider: "resend",
    name: "Emails API",
    description: "Send transactional and broadcast email from React templates.",
    category: "Communications",
  },
  {
    provider: "sendgrid",
    name: "Mail API",
    description: "High-volume transactional and marketing email.",
    category: "Communications",
  },

  // ─── Productivity & collaboration ────────────────────────────────────────
  {
    provider: "linear",
    name: "GraphQL API",
    description:
      "Read and write issues, projects, cycles, and teams in Linear.",
    category: "Productivity",
  },
  {
    provider: "github",
    name: "REST & GraphQL API",
    description:
      "Access repositories, issues, pull requests, releases, and Actions.",
    category: "Developer tools",
  },
  {
    provider: "notion",
    name: "Pages & Databases API",
    description:
      "Read and write pages, databases, and blocks in any Notion workspace.",
    category: "Productivity",
  },
  {
    provider: "slack",
    name: "Web API",
    description:
      "Post messages, manage channels, and respond to events in Slack.",
    category: "Productivity",
  },
  {
    provider: "discord",
    name: "API",
    description: "Power bots, channels, and rich embedded content in Discord.",
    category: "Communities",
  },
  {
    provider: "airtable",
    name: "Web API",
    description: "Read and write structured records inside any Airtable base.",
    category: "Productivity",
  },

  // ─── Media & lifestyle ───────────────────────────────────────────────────
  {
    provider: "spotify",
    name: "Web API",
    description: "Catalog metadata, playback control, and user listening data.",
    category: "Media",
  },

  // ─── Knowledge & data ────────────────────────────────────────────────────
  {
    provider: "openweather",
    name: "One Call API",
    description:
      "Current weather, forecasts, and historical conditions anywhere on Earth.",
    category: "Weather & data",
  },
  {
    provider: "wolfram",
    name: "LLM API",
    description:
      "Computation, science, math, and curated knowledge for language models.",
    category: "Knowledge",
  },
  {
    provider: "nasa",
    name: "Open APIs",
    description:
      "Imagery, planetary data, Mars rover photos, and APOD pictures of the day.",
    category: "Knowledge",
  },
  {
    provider: "wikimedia",
    name: "Wikipedia & Wikidata APIs",
    description:
      "Free, open-access encyclopedic articles and a structured knowledge graph.",
    category: "Knowledge",
  },

  // ─── HASH ────────────────────────────────────────────────────────────────
  {
    provider: "hash",
    name: "GraphQL API",
    description:
      "Read and write entities, types, and provenance inside a HASH workspace.",
    category: "Knowledge",
  },

  // ─── Marketplaces ────────────────────────────────────────────────────────
  {
    provider: "rapidapi",
    name: "Hub",
    description:
      "Marketplace of thousands of third-party APIs accessible through a single key.",
    category: "Marketplace",
  },
];

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getServiceListing = (): ServiceItemDescription[] =>
  SERVICES.map(({ provider, name, description, category }) => {
    const config = PROVIDERS[provider];
    return {
      kind: "service" as const,
      id: `${provider}-${slugify(name)}`,
      provider: config.name,
      // Use the explicit handle override if set, otherwise fall back to the
      // provider key (which is intentionally lowercase + alphanumeric so it
      // reads as a plausible handle, e.g. `@openai`, `@stripe`).
      providerHandle: config.handle ?? provider,
      providerColor: config.color,
      providerInitial: config.initial,
      name,
      description,
      category,
    };
  });
