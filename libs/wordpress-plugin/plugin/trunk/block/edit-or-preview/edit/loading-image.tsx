export const LoadingImage = ({ height }: { height: string }) => {
  return (
    <>
      <style>{`
        .bp-loading-skeleton {
          display: block;
          background-color: rgba(0, 0, 0, 0.06);
          border-radius: 8;
          opacity: 0.4;
          -webkit-animation: bp-loading-pulse 1.5s ease-in-out 0.5s infinite;
          animation: bp-loading-pulse 1.5s ease-in-out 0.5s infinite;
        }
        
        @-webkit-keyframes bp-loading-pulse {
          0% {
              opacity: 0.4;
          }
      
          50% {
              opacity: 1;
          }
      
          100% {
              opacity: 0.4;
          }
        }

        @keyframes bp-loading-pulse {
          0% {
              opacity: 0.4;
          }
      
          50% {
              opacity: 1;
          }
      
          100% {
              opacity: 0.4;
          }
        }
      `}</style>
      <div className="bp-loading-skeleton" style={{ height }} />
    </>
  );
};
