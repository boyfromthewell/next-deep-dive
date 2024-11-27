import { style } from "@vanilla-extract/css";

export const container = style({
  backgroundColor: "white",
  maxWidth: 600,
  minHeight: "100vh",
  margin: "0 auto",
  boxShadow: "rgba(100, 100, 100, 0.2) 0px 0px 29px 0px",
  padding: "0px 15px",
});

export const header = style({
  height: 60,
  fontWeight: "bold",
  fontSize: 18,
  lineHeight: "60px",
});

export const headerLink = style({
  textDecoration: "none",
  color: "black",
});

export const main = style({
  paddingTop: 10,
});

export const footer = style({
  padding: "100px 0px",
  color: "gray",
});
