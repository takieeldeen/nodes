import { WorkflowStep } from "../../../types/workflows";

export const ClickElementNode = {
  type: "CLICK_ELEMENT",
  isEntryPoint: false,
  titleAr: "الضغط على عنصر",
  titleEn: "Click an Element",
  subtitleAr: "الضغط على عنصر في الصفحة.",
  subtitleEn: "Press on a specific element in the page.",
  cost: 2,
  inputs: [
    {
      nameAr: "صفحة ويب",
      nameEn: "Web Page",
      type: "WEB_PAGE",
      required: true,
      showHandle: true,
    },
    {
      nameAr: "رمز CSS للعنصر",
      nameEn: "Element CSS Selector",
      type: "STRING",
      helperText: "#loginButton",
      required: true,
    },
  ] as const,
  outputs: [
    {
      nameAr: "صفحة ويب",
      nameEn: "Web Page",
      type: "WEB_PAGE",
    },
  ] as const,
} satisfies WorkflowStep;
