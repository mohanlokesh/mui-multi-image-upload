import React, { useState } from "react";
import { Box, Button, IconButton, Grid, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

const ImageUploader = ({ maxSlots = 20 }) => {
  const [images, setImages] = useState(Array(maxSlots).fill(null));

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = { file, url: URL.createObjectURL(file) };
      setImages(newImages);
    }
  };

  const handleDelete = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleSave = () => {
    const imageData = images
      .filter((image) => image !== null)
      .map((image, index) => ({
        order: index + 1,
        file: image.file,
      }));
    console.log(imageData); // Save this data (to backend or API)
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={2} key={index}>
            <Box
              sx={{
                border: "1px dashed grey",
                width: "100%",
                height: "100px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                overflow: "hidden",
              }}
            >
              {image ? (
                <>
                  <img
                    src={image.url}
                    alt={`Uploaded ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    onClick={() => handleDelete(index)}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <Delete />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography variant="body2">Select File</Typography>
                  <input
                    type="file"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ marginTop: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Save Files
        </Button>
      </Box>
    </Box>
  );
};

export default ImageUploader;
