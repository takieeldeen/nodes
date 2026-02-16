import { WorkflowStep } from "../../../types/workflows";

export const LaunchBrowserStep = {
  type: "LAUNCH_BROWSER",
  isEntryPoint: true,
  titleAr: "تشغيل المتصفح",
  titleEn: "Launch Browser",
  subtitleAr: "تشغيل المتصفح لبدء المسار الخاص بك.",
  subtitleEn: "Launch Browser to start your workflow.",
  cost: 10,
  inputs: [
    {
      nameAr: "رابط الموقع",
      nameEn: "Website URL",
      type: "STRING",
      helperText: "https://www.google.com",
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
