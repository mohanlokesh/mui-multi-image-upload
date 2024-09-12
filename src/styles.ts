import zIndex from "@mui/material/styles/zIndex";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  draggedElement: {
    zIndex: zIndex.drawer + 1,
    opacity: 0.5,
    boxShadow: "0 0 10px 0 var(--mui-palette-primary-dark)",
    "& button": {
      display: "none",
    },
  },
  container: {
    padding: 3,
    width: "100%",
  },
  boxInner: {
    border: `2px dashed var(--mui-palette-secondary-light)`,
    width: "100%",
    height: "100%",
    paddingTop: "100%", // Keeps the box square
    position: "relative",
    backgroundColor: "var(--mui-palette-secondary-lighterOpacity)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "border 0.2s ease-in-out",
    "&:hover": {
      borderColor: "var(--mui-palette-primary-dark)",
    },
  },
  boxLoading: {
    border: `2px solid var(--mui-palette-secondary-light)`,
    position: "relative",
    width: "100%",
    paddingTop: "100%", // Keeps the box square
    cursor: "not-allowed",
    overflow: "hidden",
  },
  img: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 4,
    cursor: "move",
  },
  iconButton: {
    position: "relative",
    backgroundColor: "var(--mui-palette-secondary-lighterOpacity)",
    cursour: "pointer",
    "&:hover": {
      backgroundColor: "var(--mui-palette-error-main)",
      zIndex: 1,
    },
  },
  typography: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "var(--mui-palette-secondary-dark)",
  },
  input: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  buttonContainer: {
    marginTop: 2,
    display: "flex",
    justifyContent: "flex-start",
    gap: 2,
  },
}));
