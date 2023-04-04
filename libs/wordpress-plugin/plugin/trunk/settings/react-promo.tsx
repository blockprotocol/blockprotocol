import {
  faArrowRight,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { HTMLProps, PropsWithChildren, ReactNode } from "react";

import { FontAwesomeIcon } from "./font-awesome-icon";
import styles from "./react-promo.module.scss";
import blockTrio from "./images/block-trio.png";

const faArrowUpRight: IconDefinition = {
  icon: [
    384,
    512,
    [],
    "e09f",
    "M352 128c0-17.7-14.3-32-32-32L96 96c-17.7 0-32 14.3-32 32s14.3 32 32 32l146.7 0L41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L288 205.3 288 352c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224z",
  ],
  prefix: "fas",
  iconName: "arrow-up-right",
};

export const PromoCard = ({ children }: PropsWithChildren) => {
  return <div className={styles.PromoCard}>{children}</div>;
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
        paddingLeft: "var(--promo-x-padding)",
        paddingRight: "var(--promo-x-padding)",
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
        paddingLeft: "var(--promo-x-padding)",
        paddingRight: "var(--promo-x-padding)",
        marginTop: "var(--promo-y-padding)",
      }}
    >
      {children}
    </p>
  );
};

const PromoList = ({ children }: PropsWithChildren) => {
  return <ul className={styles.PromoList}>{children}</ul>;
};

const PromoListItem = ({
  children,
  comingSoon = null,
}: PropsWithChildren<{ comingSoon?: ReactNode }>) => {
  return (
    <li
      className={clsx(
        styles.PromoListItem,
        comingSoon && styles.PromoListItemComingSoon,
      )}
    >
      {comingSoon ? (
        <>
          <FontAwesomeIcon icon={faArrowUpRight} />
          <div className={styles.PromoListItemComingSoonText}>{comingSoon}</div>
        </>
      ) : (
        <FontAwesomeIcon icon={faArrowRight} />
      )}
      {children}
    </li>
  );
};

const PromoInfoText = ({ children }: PropsWithChildren) => (
  <span className={styles.PromoInfoText}>{children}</span>
);

const PromoInfoImage = ({
  src,
  alt,
  width,
}: {
  src: string;
  alt?: string;
  width: number;
}) => {
  return (
    <div style={{ width }} className={styles.PromoInfoImage}>
      <img src={src} alt={alt} />
    </div>
  );
};

const PromoCardItems = ({
  className,
  children,
  ...props
}: HTMLProps<HTMLDivElement>) => (
  <div {...props} className={clsx(styles.PromoCardItems, className)}>
    {children}
  </div>
);

export const ReactPromo = () => {
  return (
    <div className={styles.PromoStack}>
      <h2 className={styles.PromoHeading}>You can look forward to...</h2>
      <PromoCard>
        <PromoSmallTitle>Next Generation</PromoSmallTitle>
        <PromoBigTitle>
          <PromoPurpleText>AI Blocks</PromoPurpleText>
        </PromoBigTitle>
        <PromoCardItems>
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
              watermarks from photos, or remove/replace the backgrounds of
              product photos in WooCommerce
            </PromoListItem>
            <PromoListItem>
              Best-in-class <strong>AI chat</strong> block lets you persist
              chats, publish them on your website, fork prior conversations with
              history intact, set the AI’s response style and more
            </PromoListItem>
            <PromoListItem>
              Switch between AI models and providers at will
            </PromoListItem>
            <PromoListItem>
              <strong>
                <PromoPurpleText>Free credits</PromoPurpleText> for all models
                and providers
              </strong>
            </PromoListItem>
          </PromoList>
        </PromoCardItems>
      </PromoCard>
      <PromoCard>
        <PromoSmallTitle>Level up your SEO</PromoSmallTitle>
        <PromoBigTitle>
          <PromoPurpleText>Structured data</PromoPurpleText> in WordPress
        </PromoBigTitle>
        <PromoCardItems>
          <PromoInfoImage src={blockTrio} width={331} />
          <PromoList>
            <PromoListItem>
              <strong>
                Turn WordPress into a powerful{" "}
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a href="https://blockprotocol.org" target="_blank">
                  entity graph
                </a>{" "}
                and unlock a whole range of new functionality.
              </strong>{" "}
              Go beyond Custom Post Types and Advanced Custom Fields with a
              graph of entities, all with their own properties and connected by
              links
            </PromoListItem>
            <PromoListItem comingSoon="Coming Soon">
              <strong>Improve your search rankings</strong> by leveraging
              structured data (SEO) blocks that take context from their
              surroundings and dynamically generating whole-page JSON-LD based
              on related information{" "}
              <PromoInfoText>
                (e.g. offers in WooCommerce, or tickets for an event)
              </PromoInfoText>
            </PromoListItem>
            <PromoListItem comingSoon="Planned">
              Use WordPress as an app builder, not just as a site editor and CMS
            </PromoListItem>
          </PromoList>
        </PromoCardItems>
      </PromoCard>
      <PromoCard>
        <PromoSmallTitle>Supercharge Your Website</PromoSmallTitle>
        <PromoBigTitle>
          <PromoPurpleText>Powerful API services</PromoPurpleText> without fuss
        </PromoBigTitle>
        <PromoCardItems className={styles.PromoCardItemsNoPaddingRight}>
          <PromoList>
            <PromoListItem>
              Access OpenAI, Mapbox, and other powerful APIs{" "}
              <strong>directly within WordPress, with zero extra steps</strong>
            </PromoListItem>
            <PromoListItem>
              No need to share card details, obtain your own API key, or even
              set up an account with any provider directly.{" "}
              <strong>Everything is handled by the Block Protocol.</strong>
            </PromoListItem>
            <PromoListItem>
              Generous free allowances with all providers let you try out blocks
              and use them in WordPress
            </PromoListItem>
            <PromoListItem comingSoon="Coming Soon">
              <strong>Sync data from external apps into WordPress</strong>{" "}
              through authenticated external service blocks.
            </PromoListItem>
          </PromoList>
        </PromoCardItems>
      </PromoCard>
      <PromoCard>
        <PromoSmallTitle>Tons more benefits</PromoSmallTitle>
        <PromoBigTitle>
          <PromoPurpleText>Instant access</PromoPurpleText> to an infinite
          ecosystem
        </PromoBigTitle>
        <PromoCardItems>
          <PromoList>
            <PromoListItem>
              The Block Protocol is an open-source ecosystem of blocks that
              anybody can contribute to
            </PromoListItem>
            <PromoListItem>
              New blocks are instantly available within WordPress to Block
              Protocol users without having to update the plugin, or install
              additional plugins{" "}
              <PromoInfoText>
                (as is required for Gutenberg blocks)
              </PromoInfoText>
            </PromoListItem>
            <PromoListItem>
              <strong>
                Use Block Protocol blocks in any Þ-enabled environment
              </strong>
              , not just WordPress
            </PromoListItem>
          </PromoList>
        </PromoCardItems>
      </PromoCard>
    </div>
  );
};
