export const LoadingImage = () => {
  const { plugin_url } = window.block_protocol_data;
  return (
    <img
      alt="Loading"
      src={`${plugin_url}images/blocks-loading.gif`}
      height={42}
      width={42}
    />
  );
};
