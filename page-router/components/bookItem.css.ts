import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  gap: 15,
  padding: "20px 10px",
  borderBottom: "1px solid rgb(220, 220, 220)",
  color: "black",
  textDecoration: "none",
});

export const title = style({
  fontWeight: "bold",
});

export const subTitle = style({
  wordBreak: "break-all",
});

export const author = style({
  color: "gray",
});
