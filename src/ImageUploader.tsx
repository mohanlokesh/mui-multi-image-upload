import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Delete, Opacity } from "@mui/icons-material";
import { arrayMoveImmutable } from "array-move";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import zIndex from "@mui/material/styles/zIndex";

export type OnImageUploaderProps = { file: File[]; order: number };

const useStyles = makeStyles(() => ({
  draggedElement: {
    zIndex: zIndex.drawer + 1,
    opacity: 0.5, // lowercase 'o' in opacity
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
    "& button": {
      display: "none",
    },
  },
}));

interface ImageUploaderProps {
  onUpload: (files: OnImageUploaderProps[]) => void;
  onDelete: (id?: string) => Promise<boolean>;
  minImages?: number;
  maxImages?: number;
  validImages?: { id: string; url: string; order: number }[];
  readonly?: boolean;
  acceptTypes?: string[];
  loading?: boolean;
}

interface Image {
  id?: string; // Optional id for images that are already uploaded
  file?: File;
  url: string;
  placeholder?: boolean;
}

interface SortableImageProps {
  image: Image;
  readonly: boolean;
  handleDelete: (index: number) => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  loading?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  minImages = 3,
  maxImages = 5, // 0 means unlimited
  validImages = [],
  readonly = false,
  acceptTypes = ["image/jpeg", "image/jpg", "image/png"],
  loading = false,
  onUpload,
  onDelete,
}) => {
  const createInitialImages = () => {
    const valid = validImages.map((img) => ({
      id: img.id,
      url: img.url,
    })) as Image[];
    const emptySlots = Math.max(minImages - valid.length, 0);
    const initial = valid.concat(
      Array(emptySlots).fill({ url: "", placeholder: true })
    );

    // Ensure one empty slot if below maxImages (or maxImages is 0)
    if (initial.length < maxImages || maxImages === 0) {
      initial.push({ url: "", placeholder: true });
    }

    return initial;
  };

  const [images, setImages] = useState<Image[]>(createInitialImages);

  useEffect(() => {
    setImages(createInitialImages());
  }, [validImages, minImages]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!acceptTypes.includes(file.type)) {
        alert("Please upload a valid image file.");
        return;
      }

      const newImages = [...images];
      newImages[index] = {
        file,
        url: URL.createObjectURL(file),
        placeholder: false,
      };

      if (
        (newImages.length < maxImages || maxImages === 0) &&
        !newImages.some((img) => img.placeholder)
      ) {
        newImages.push({ url: "", placeholder: true }); // Add a new empty slot if not reached maxImages
      }

      setImages(newImages);
    }
  };

  const handleDelete = (index: number) => {
    const imageToDelete = images[index];

    const newImages = [...images];
    newImages.splice(index, 1);

    // Ensure at least minImages placeholders
    while (newImages.length < minImages) {
      newImages.push({ url: "", placeholder: true });
    }

    // Ensure one empty slot if below maxImages
    if (newImages.length < maxImages || maxImages === 0) {
      newImages.push({ url: "", placeholder: true });
    }

    setImages(newImages);

    // If the image has an id, call onDelete with the id
    if (imageToDelete.id && onDelete) {
      onDelete(imageToDelete.id);
    }
  };

  const handleSave = () => {
    const imageData = images
      .filter((image) => image && !image.placeholder && image.file)
      .map((image, index) => ({
        order: index + 1,
        file: [image.file as File], // Ensure file is an array
      }));

    // Reset images
    setImages(
      Array(minImages)
        .fill({ url: "", placeholder: true })
        .concat(
          validImages.length
            ? validImages.map((img) => ({ id: img.id, url: img.url }))
            : []
        )
    );
    onUpload(imageData);
  };

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    if (!readonly) {
      const newImages = arrayMoveImmutable(images, oldIndex, newIndex);
      setImages(newImages);
    }
  };

  const SortableImage = SortableElement<SortableImageProps>(
    (props: SortableImageProps) => {
      const { image, readonly, handleDelete, handleFileChange, loading } =
        props;

      return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Box
            sx={
              loading
                ? {
                    border: "1px solid grey",
                    position: "relative",
                    width: "100%",
                    paddingTop: "100%",
                    cursor: "not-allowed",
                  }
                : {
                    border: "1px dashed grey",
                    width: "100%",
                    paddingTop: "100%",
                    position: "relative",
                    backgroundColor: "#f5f5f5",
                    overflow: "hidden",
                    cursor: !readonly ? "move" : "default", // Show 'move' cursor on hover for drag
                  }
            }
          >
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
              >
                Loading...
              </Skeleton>
            ) : image.url ? (
              <>
                <img
                  src={image.url}
                  alt="Uploaded"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {!readonly && !image.placeholder && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent drag event
                      handleDelete(images.indexOf(image));
                    }}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      cursor: "pointer", // Ensure delete has pointer cursor
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </>
            ) : !readonly && image.placeholder ? (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  Select Image
                </Typography>
                <input
                  type="file"
                  accept={acceptTypes.join(",")}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                  onChange={(e) => handleFileChange(e, images.indexOf(image))}
                />
              </>
            ) : null}
          </Box>
        </Grid>
      );
    }
  );

  const SortableImageGrid = SortableContainer(() => {
    return (
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <SortableImage
            key={`sortable-${index}`}
            index={index}
            image={image}
            readonly={readonly}
            handleDelete={handleDelete}
            handleFileChange={handleFileChange}
            loading={loading} // Pass loading prop to each image
          />
        ))}
      </Grid>
    );
  });

  const classes = useStyles();

  return (
    <Box sx={{ padding: 3 }}>
      <SortableImageGrid
        onSortEnd={onSortEnd}
        axis="xy"
        pressDelay={100} // Add delay to start dragging
        helperClass={classes.draggedElement}
      />
      {!readonly &&
        !loading && ( // Hide buttons if loading is true
          <Box sx={{ marginTop: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleSave}>
              Save Files
            </Button>
          </Box>
        )}
    </Box>
  );
};

export default ImageUploader;
