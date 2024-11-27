import { style } from "@vanilla-extract/css";

export const searchbarContainer = style({
  display: "flex",
  gap: 10,
  marginBottom: 20,
});

export const searchInput = style({
  flex: 1,
  borderRadius: 5,
  padding: 15,
  border: "1px solid rgb(220, 220, 220)",
});

export const submitBtn = style({
  width: 80,
  borderRadius: 5,
  border: "none",
  backgroundColor: "rgb(37, 147, 255)",
  color: "#fff",
  cursor: "pointer",
});
