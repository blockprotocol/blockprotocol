import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { PropsWithChildren } from "react";
import { FontAwesomeIcon } from "./font-awesome-icon";
import styles from "./react-promo.module.scss";

export const PromoCard = ({ children }: PropsWithChildren) => {
  return (
    <div
      style={{
        padding: "30px 40px",
        background: "#FFFFFF",
        border: "1px solid #DDE7F0",
        borderRadius: "8px",
      }}
    >
      {children}
    </div>
  );
};

export const PromoBigTitle = ({ children }: PropsWithChildren) => {
  return (
    <h3
      style={{
        fontFamily: '"colfax-web"',
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: 42,
        lineHeight: 1,
        letterSpacing: "-0.03em",
        marginBottom: 20,
        marginTop: 0,
      }}
    >
      {children}
    </h3>
  );
};

export const PromoPurpleText = ({ children }: PropsWithChildren) => (
  <span
    style={{
      color: "#6048E5",
    }}
  >
    {children}
  </span>
);

export const PromoSmallTitle = ({ children }: PropsWithChildren) => {
  return (
    <p
      style={{
        fontFamily: '"colfax-web"',
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: 14,
        lineHeight: 1.3,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "#0E1114",
        marginBottom: 4,
        marginTop: 0,
      }}
    >
      {children}
    </p>
  );
};

const PromoList = ({ children }: PropsWithChildren) => {
  return <ul className={styles.PromoList}>{children}</ul>;
};

const PromoListItem = ({ children }: PropsWithChildren) => {
  return (
    <li className={styles.PromoListItem}>
      <FontAwesomeIcon icon={faArrowRight} />
      {children}
    </li>
  );
};

export const ReactPromo = () => {
  return (
    <div className={styles.PromoStack}>
      <h2 className={styles.PromoHeading}>You can look forward to...</h2>
      <PromoCard>
        <PromoSmallTitle>Next Generation</PromoSmallTitle>
        <PromoBigTitle>
          <PromoPurpleText>AI Blocks</PromoPurpleText>
        </PromoBigTitle>
        <PromoList>
          <PromoListItem>
            The best <strong>AI text</strong> generation, style, tone, grammar
            and editing blocks for WordPress
          </PromoListItem>
          <PromoListItem>
            Powerful <strong>AI image generation</strong> blocks let you
            illustrate posts in seconds
          </PromoListItem>
          <PromoListItem>
            Advanced <strong>AI image editing</strong> blocks let you remove
            watermarks from photos, or remove/replace the backgrounds of product
            photos in WooCommerce
          </PromoListItem>
          <PromoListItem>
            Best-in-class <strong>AI chat</strong> block lets you persist chats,
            publish them on your website, fork prior conversations with history
            intact, set the AI’s response style and more
          </PromoListItem>
          <PromoListItem>
            Switch between AI models and providers at will
          </PromoListItem>
          <PromoListItem>
            <strong>
              <PromoPurpleText>Free credits</PromoPurpleText> for all models and
              providers
            </strong>
          </PromoListItem>
        </PromoList>
      </PromoCard>
      <PromoCard>
        <PromoSmallTitle>Level up your SEO</PromoSmallTitle>
        <PromoBigTitle>
          <PromoPurpleText>Structured data</PromoPurpleText> in WordPress
        </PromoBigTitle>
        <PromoList>
          <PromoListItem>
            Turn WordPress into a powerful entity graph and unlock a whole range
            of new functionality. Go beyond Custom Post Types and Advanced
            Custom Fields with a graph of entities, all with their own
            properties and connected by links
          </PromoListItem>
          <PromoListItem>
            Improve your search rankings by leveraging structured data (SEO)
            blocks that take context from their surroundings and dynamically
            generating whole-page JSON-LD based on related information (e.g.
            offers in WooCommerce, or tickets for an event)
          </PromoListItem>
          <PromoListItem>
            Use WordPress as an app builder, not just as a site editor and CMS
          </PromoListItem>
        </PromoList>
      </PromoCard>
      <PromoCard>
        <PromoSmallTitle>Supercharge Your Website</PromoSmallTitle>
        <PromoBigTitle>
          <PromoPurpleText>Powerful API services</PromoPurpleText> without fuss
        </PromoBigTitle>
        <PromoList>
          <PromoListItem>
            Access OpenAI, Mapbox, and other powerful APIs directly within
            WordPress, with zero extra steps
          </PromoListItem>
          <PromoListItem>
            No need to share card details, obtain your own API key, or even set
            up an account with any provider directly. Everything is handled by
            the Block Protocol.
          </PromoListItem>
          <PromoListItem>
            Generous free allowances with all providers let you try out blocks
            and use them in WordPress
          </PromoListItem>
          <PromoListItem>
            Sync data from external apps into WordPress through authenticated
            external service blocks.
          </PromoListItem>
        </PromoList>
      </PromoCard>
      <PromoCard>
        <PromoSmallTitle>Tons more benefits</PromoSmallTitle>
        <PromoBigTitle>
          <PromoPurpleText>Instant access</PromoPurpleText> to an infinite
          ecosystem
        </PromoBigTitle>
        <PromoList>
          <PromoListItem>
            The Block Protocol is an open-source ecosystem of blocks that
            anybody can contribute to
          </PromoListItem>
          <PromoListItem>
            New blocks are instantly available within WordPress to Block
            Protocol users without having to update the plugin, or install
            additional plugins (as is required for Gutenberg blocks)
          </PromoListItem>
          <PromoListItem>
            Use Block Protocol blocks in any Þ-enabled environment, not just
            WordPress
          </PromoListItem>
        </PromoList>
      </PromoCard>
    </div>
  );
};
