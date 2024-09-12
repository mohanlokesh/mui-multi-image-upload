import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { arrayMoveImmutable } from "array-move";
import { SortableContainer, SortableContainerProps, SortableElement } from "react-sortable-hoc";
import { useStyles } from "./styles";

export type OnImageUploaderProps = { file: File[]; order: number };


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
  id?: string;
  file?: File;
  url: string;
  placeholder?: boolean;
}

interface SortableImageProps extends SortableContainerProps {
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
  const classes = useStyles();

  const createInitialImages = () => {
    const valid = validImages.map((img) => ({
      id: img.id,
      url: img.url,
    })) as Image[];
    const emptySlots = Math.max(minImages - valid.length, 0);
    const initial = valid.concat(
      Array(emptySlots).fill({ url: "", placeholder: true })
    );

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
        newImages.push({ url: "", placeholder: true });
      }

      setImages(newImages);
    }
  };

  const handleDelete = (index: number) => {
    const imageToDelete = images[index];

    const newImages = [...images];
    newImages.splice(index, 1);

    while (newImages.length < minImages) {
      newImages.push({ url: "", placeholder: true });
    }

    if (newImages.length < maxImages || maxImages === 0) {
      newImages.push({ url: "", placeholder: true });
    }

    setImages(newImages);

    if (imageToDelete.id && onDelete) {
      onDelete(imageToDelete.id);
    }
  };

  const handleSave = () => {
    const imageData = images
      .filter((image) => image && !image.placeholder && image.file)
      .map((image, index) => ({
        order: index + 1,
        file: [image.file as File],
      }));

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
      const { image, readonly, handleDelete, handleFileChange, loading } = props;

      return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Box className={loading ? classes.boxLoading : classes.boxInner}>
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
                <img src={image.url} alt="Uploaded" className={classes.img} />
                {!readonly && !image.placeholder && (
                  <IconButton
                    className={classes.iconButton}
                    onClick={() => handleDelete(images.indexOf(image))}
                  >
                    <Delete color="error" />
                  </IconButton>
                )}
              </>
            ) : !readonly && image.placeholder ? (
              <>
                <Typography variant="body2" className={classes.typography}>
                  Select Image
                </Typography>
                <input
                  type="file"
                  accept={acceptTypes.join(",")}
                  className={classes.input}
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
            loading={loading}
            shouldCancelStart={(e: any) => {
              const target = e.target as HTMLElement;
              return ['input', 'svg', 'button', 'a', 'path', 'span'].includes(target.tagName.toLowerCase()) || target.classList.contains('MuiIconButton-root') || target.classList.contains('MuiButtonBase-root') || target.classList.contains('MuiButton-label');
            }}
          />
        ))}
      </Grid>
    );
  });


  return (
    <Box className={classes.container}>
      <SortableImageGrid
        onSortEnd={onSortEnd}
        axis="xy"
        helperClass={classes.draggedElement}
      />
      {!readonly && !loading && (
        <Box className={classes.buttonContainer}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Files
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader;
