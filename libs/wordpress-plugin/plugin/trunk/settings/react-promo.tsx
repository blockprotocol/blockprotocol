import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { clsx } from "clsx";
import { HTMLProps, PropsWithChildren, ReactNode } from "react";

import { faArrowUpRight } from "./fa-arrow-up-right";
import { FontAwesomeIcon } from "./font-awesome-icon";
import aiImage from "./images/ai.png";
import blockTrioImage from "./images/block-trio.png";
import blocksImage from "./images/blocks.png";
import styles from "./react-promo.module.scss";

export const PromoCard = ({ children }: PropsWithChildren) => {
  return <div className={styles.PromoCard}>{children}</div>;
};

const PromoCardHeader = ({ children }: PropsWithChildren) => (
  <div className={styles.PromoCardHeader}>{children}</div>
);

const PromoCardSmallTitle = ({ children }: PropsWithChildren) => {
  return <p className={styles.PromoCardSmallTitle}>{children}</p>;
};

const PromoCardBigTitle = ({ children }: PropsWithChildren) => {
  return <h3 className={styles.PromoCardBigTitle}>{children}</h3>;
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

const PromoCardContent = ({ children }: PropsWithChildren) => (
  <div className={styles.PromoCardContent}>{children}</div>
);

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

const PromoCardPurpleText = ({ children }: PropsWithChildren) => (
  <span className={styles.PromoCardPurpleText}>{children}</span>
);

export const ReactPromo = () => {
  return (
    <div className={styles.PromoStack}>
      <h2 className="BPActivateHeading">You can look forward to...</h2>
      <PromoCard>
        <PromoCardHeader>
          <PromoCardSmallTitle>Next Generation</PromoCardSmallTitle>
          <PromoCardBigTitle>
            <PromoCardPurpleText>AI Blocks</PromoCardPurpleText>
          </PromoCardBigTitle>
        </PromoCardHeader>
        <PromoCardItems>
          <PromoCardContent>
            <PromoList>
              <PromoListItem>
                The best <strong>AI text</strong> generation, style, tone,
                grammar and editing blocks for WordPress
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
                chats, publish them on your website, fork prior conversations
                with history intact, set the AI’s response style and more
              </PromoListItem>
              <PromoListItem>
                Switch between AI models and providers at will
              </PromoListItem>
              <PromoListItem>
                <strong>
                  <PromoCardPurpleText>Free credits</PromoCardPurpleText> for
                  all providers
                </strong>
              </PromoListItem>
            </PromoList>
          </PromoCardContent>
        </PromoCardItems>
      </PromoCard>
      <PromoCard>
        <PromoCardHeader>
          <PromoCardSmallTitle>Level up your SEO</PromoCardSmallTitle>
          <PromoCardBigTitle>
            <PromoCardPurpleText>Structured data</PromoCardPurpleText> in
            WordPress
          </PromoCardBigTitle>
        </PromoCardHeader>
        <PromoCardItems>
          <PromoInfoImage src={blockTrioImage} width={331} />
          <PromoCardContent>
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
                graph of entities, all with their own properties and connected
                by links
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
                Use WordPress as an app builder, not just as a site editor and
                CMS
              </PromoListItem>
            </PromoList>
          </PromoCardContent>
        </PromoCardItems>
      </PromoCard>
      <PromoCard>
        <PromoCardHeader>
          <PromoCardSmallTitle>Supercharge Your Website</PromoCardSmallTitle>
          <PromoCardBigTitle>
            <PromoCardPurpleText>Powerful API services</PromoCardPurpleText>{" "}
            without fuss
          </PromoCardBigTitle>
        </PromoCardHeader>
        <PromoCardItems
          className={clsx(
            styles.PromoCardItemsNoPaddingRight,
            styles.PromoCardItemsSmallGap,
          )}
        >
          <PromoCardContent>
            <PromoList>
              <PromoListItem>
                Access OpenAI, Mapbox, and other powerful APIs{" "}
                <strong>
                  directly within WordPress, with zero extra steps
                </strong>
              </PromoListItem>
              <PromoListItem>
                No need to share card details, obtain your own API key, or even
                set up an account with any provider directly.{" "}
                <strong>Everything is handled by the Block Protocol.</strong>
              </PromoListItem>
              <PromoListItem>
                Generous free allowances with all providers let you try out
                blocks and use them in WordPress
              </PromoListItem>
              <PromoListItem comingSoon="Coming Soon">
                <strong>Sync data from external apps into WordPress</strong>{" "}
                through authenticated external service blocks.
              </PromoListItem>
            </PromoList>
          </PromoCardContent>
          <PromoInfoImage src={aiImage} width={459} />
        </PromoCardItems>
      </PromoCard>
      <PromoCard>
        <PromoCardItems className={styles.PromoCardItemsNoPaddingLeft}>
          <PromoInfoImage src={blocksImage} width={328} />
          <PromoCardContent>
            <PromoCardHeader>
              <PromoCardSmallTitle>Tons more benefits</PromoCardSmallTitle>
              <PromoCardBigTitle>
                <PromoCardPurpleText>Instant access</PromoCardPurpleText> to an
                infinite ecosystem
              </PromoCardBigTitle>
            </PromoCardHeader>
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
          </PromoCardContent>
        </PromoCardItems>
      </PromoCard>
    </div>
  );
};
