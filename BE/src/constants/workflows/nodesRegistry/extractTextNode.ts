import { WorkflowStep } from "../../../types/workflows";

export const ExtractTextStep = {
    type: "EXTRACT_TEXT_FROM_ELEMENT",
    isEntryPoint: false,
    titleAr: "استخراج نص",
    titleEn: "Extract Text",
    subtitleAr: "استخراج نص من عنصر معين في الصفحة.",
    subtitleEn: "Extract text from specific element in the page",
    cost: 2,
  inputs: [
    {
        nameAr: "صفحة ويب",
        nameEn: "Web Page",
        type: "WEB_PAGE",
        showHandle:true,
       
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
        nameAr: "النص المستخرج",
        nameEn: "Extracted Text",
        type: "STRING",
     
      },
      {
        nameAr: "صفحة ويب",
        nameEn: "Web Page",
        type: "WEB_PAGE",
       
      },
  ] as const,
} satisfies WorkflowStep;
