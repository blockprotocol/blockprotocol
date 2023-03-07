import {
  BlockControls,
  MediaUpload,
  MediaUploadCheck,
} from "@wordpress/block-editor";
import { Button, ToolbarButton, ToolbarGroup } from "@wordpress/components";

const MediaLibraryButton = ({
  mediaId,
  onChange,
  toolbar = false,
}: {
  mediaId: number;
  onChange: (newValue: string) => void;
  toolbar?: boolean;
}) => (
  <MediaUploadCheck>
    <MediaUpload
      onSelect={(media) => onChange(JSON.stringify(media))}
      allowedTypes={["image"]}
      value={mediaId}
      render={({ open }) => {
        const label = mediaId ? "Replace image" : "Select image";
        if (toolbar) {
          return (
            <ToolbarGroup>
              <ToolbarButton onClick={open}>{label}</ToolbarButton>
            </ToolbarGroup>
          );
        }
        return (
          <Button onClick={open} variant="primary">
            {label}
          </Button>
        );
      }}
    />
  </MediaUploadCheck>
);

// @todo add sidebar settings e.g. alt text
export const Image = ({
  mediaMetadataString,
  onChange,
  readonly,
}: {
  mediaMetadataString?: string;
  onChange: (mediaMetadataString: string) => void;
  readonly: boolean;
}) => {
  const mediaMetadata = mediaMetadataString
    ? JSON.parse(mediaMetadataString)
    : undefined;

  const { id: mediaId } = mediaMetadata ?? {};

  return (
    <div style={{ margin: "15px auto" }}>
      {mediaMetadata && (
        <img
          src={mediaMetadata.url}
          alt={mediaMetadata.title}
          style={{ width: "100%", height: "auto" }}
        />
      )}
      {!readonly && (
        <div style={{ marginTop: "5px", textAlign: "center" }}>
          <BlockControls>
            <MediaLibraryButton onChange={onChange} mediaId={mediaId} toolbar />
          </BlockControls>
          {!mediaId && (
            <div
              style={{
                border: "1px dashed black",
                padding: 30,
              }}
            >
              <div
                style={{
                  color: "grey",
                  marginBottom: 20,
                  fontSize: 15,
                }}
              >
                Select an image from your library, or upload a new image
              </div>
              <MediaLibraryButton
                onChange={onChange}
                mediaId={mediaId}
                toolbar
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
