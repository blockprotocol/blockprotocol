module.exports =
  typeof window === "undefined"
    ? require("@blockprotocol/type-system-node")
    : require("@blockprotocol/type-system-web");
