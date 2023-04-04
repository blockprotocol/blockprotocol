import { PropsWithChildren } from "react";

export const PromoCard = ({ children }: PropsWithChildren) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: "30px 40px",
        background: "#FFFFFF",
        border: "1px solid #DDE7F0",
        borderRadius: "8px",
        alignItems: "flex-start",
        flex: "none",
        order: "1",
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
        flexGrow: "0",
        gap: "12px",
      }}
    >
      {children}
    </div>
  );
};

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

export const ReactPromo = () => {
  return (
    <div>
      <h2>You can look forward to...</h2>
      <PromoCard>
        <PromoSmallTitle>Next Generation</PromoSmallTitle>
      </PromoCard>
    </div>
  );
};
