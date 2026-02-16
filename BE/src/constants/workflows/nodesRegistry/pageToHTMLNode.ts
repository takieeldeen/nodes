import { WorkflowStep } from "../../../types/workflows";

export const PageToHTML = {
  type: "PAGE_TO_HTML",
  isEntryPoint: false,
  titleAr: "استخرام HTML من صفحة الويب",
  titleEn: "Extract HTML from a Page",
  subtitleAr: "استخراج HTML من صفحة ويب للتفاعل مع الصفحة.",
  subtitleEn: "Extract HTML from a web page to interact with it",
  cost: 2,
  inputs: [
    {
      nameAr: "صفحة ويب",
      nameEn: "Web Page",
      type: "WEB_PAGE",
      showHandle: true,
      required: true,
    },
  ],
  outputs: [
    {
      nameAr: "نسخة HTML",
      nameEn: "HTML Instance",
      type: "STRING",
    },
  ],
} satisfies WorkflowStep;
