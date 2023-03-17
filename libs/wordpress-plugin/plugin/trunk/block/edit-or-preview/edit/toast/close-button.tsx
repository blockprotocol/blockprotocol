/**
 * Custom close button for toast
 * @param closeToast react-toastify will provide this automatically
 */
export const CloseButton = ({ closeToast }: { closeToast?: () => void }) => (
  <>
    <button
      className="bp-toast-close-button"
      onClick={closeToast}
      type="button"
    >
      CLOSE X
    </button>
    <style>{`
      .bp-toast-close-button {
        border: none;
        cursor: pointer;
        padding: 0;
        position: absolute;
        top: 10px;
        right: 0;
        background: none;
        color: #4d5c6c;
        font-weight: 500;
        font-size: 10px;
        letter-spacing: 0.1px;
        transition: opacity 0.1s ease-in-out;
        width: 70px;
      }

      .bp-toast-close-button:hover {
        opacity: 0.8;
        transition: opacity 0.1s ease-in-out;
      }
    `}</style>
  </>
);
