// Return an image of the block to use as a preview on hover in the block sidebar
export const Preview = ({
  block,
}: {
  block: {
    image?: string | null;
    displayName?: string | null;
    name: string;
  };
}) => {
  return (
    <img
      alt={`Preview of the ${
        block.displayName || block.name
      } Block Protocol block`}
      src={
        block?.image
          ? block.image
          : "https://blockprotocol.org/assets/default-block-img.svg"
      }
      style={{
        width: "100%",
        height: "auto",
        objectFit: "contain",
      }}
    />
  );
};
