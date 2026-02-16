import { WorkflowStep } from "../../../types/workflows";

export const FillInputNode = {
  type: "FILL_INPUT",
  isEntryPoint: false,
  titleAr: "الكتابة في حقل",
  titleEn: "Filling Input",
  subtitleAr: "كتابة نص محدد داخل حقل.",
  subtitleEn: "Write specific text withing a text input.",
  cost: 2,
  inputs: [
    {
      nameAr: "صفحة ويب",
      nameEn: "Web Page",
      type: "WEB_PAGE",
      showHandle: true,
    },
    {
      nameAr: "رمز CSS للعنصر",
      nameEn: "Element CSS Selector",
      type: "STRING",
      helperText: "#loginButton",
      required: true,
    },
    {
      nameAr: "النص المراد كتاباته",
      nameEn: "Filling text",
      type: "STRING",
      helperText: "mail@gmail.com",
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
