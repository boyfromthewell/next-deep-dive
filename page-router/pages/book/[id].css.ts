import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const coverImgContainer = style({
  display: "flex",
  justifyContent: "center",
  padding: 20,

  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",

  position: "relative",

  "::before": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    content: "",
  },
});

export const coverImg = style({
  zIndex: 1,
  maxHeight: 350,
  height: "100%",
  width: "auto",
});

export const title = style({
  fontSize: "large",
  fontWeight: "bold",
});

export const subTitle = style({
  color: "gray",
});

export const desc = style({
  backgroundColor: "rgb(245, 245, 245)",
  padding: 15,
  lineHeight: 1.3,
  whiteSpace: "pre-line",
  borderRadius: 5,
});
