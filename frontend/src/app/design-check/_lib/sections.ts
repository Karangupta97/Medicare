// Section list shared by the sidebar, the top bar, the page and the scroll-spy.
export const SECTIONS = [
  { id: "overview", number: "01", label: "Overview", group: "Foundations" },
  { id: "palette", number: "02", label: "Palette", group: "Foundations" },
  { id: "semantic-tokens", number: "03", label: "Semantic tokens", group: "Foundations" },
  { id: "contrast-matrix", number: "04", label: "Contrast matrix", group: "Foundations" },
  { id: "typography", number: "05", label: "Typography", group: "Foundations" },
  { id: "components", number: "06", label: "Components", group: "Library" },
  { id: "status", number: "07", label: "Status and emergency", group: "Library" },
  { id: "scales", number: "08", label: "Scales and motion", group: "Library" },
  { id: "compare", number: "09", label: "Compare mode", group: "Tools" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** The one scrolling element of the page. The skip link, the scroll-spy and deep links point at it. */
export const MAIN_ID = "dashboard-main";

/** Target of the "Back to top" link, placed at the very top of the scrolling area. */
export const TOP_ID = "top";
