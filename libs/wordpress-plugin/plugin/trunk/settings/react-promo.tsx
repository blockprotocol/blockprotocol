import { PropsWithChildren } from "react";
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
      }}
    >
      {children}
    </p>
  );
};

export const PromoList = ({ children }: PropsWithChildren) => {
  return <ul className={styles.promoList}>{children}</ul>;
};

export const ReactPromo = () => {
  return (
    <div>
      <h2>You can look forward to...</h2>
      <PromoCard>
        <PromoSmallTitle>Next Generation</PromoSmallTitle>
        <PromoBigTitle>
          <PromoPurpleText>AI Blocks</PromoPurpleText>
        </PromoBigTitle>
        <PromoList>
          <li>
            The best AI text generation, style, tone, grammar and editing blocks
            for WordPress
          </li>
          <li>
            Powerful AI image generation blocks let you illustrate posts in
            seconds
          </li>
          <li>
            Advanced AI image editing blocks let you remove watermarks from
            photos, or remove/replace the backgrounds of product photos in
            WooCommerce
          </li>
          <li>
            Best-in-class AI chat block lets you persist chats, publish them on
            your website, fork prior conversations with history intact, set the
            AI’s response style and more
          </li>
          <li>Switch between AI models and providers at will</li>
          <li>Free credits for all models and providers</li>
        </PromoList>
      </PromoCard>
    </div>
  );
};
