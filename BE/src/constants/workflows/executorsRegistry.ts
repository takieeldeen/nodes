import { ExecutorFn, StepType, WorkflowStep } from "../../types/workflows";
import { ClickElementExecutor } from "./executorsRegistry/clickElementExecutor";
import { ExtractTextExecutor } from "./executorsRegistry/extractTextExecutor";
import { FillInputExecutor } from "./executorsRegistry/fillInputExecutor";
import { LaunchBrowserExecutor } from "./executorsRegistry/launchBrowserExecutor";
import { PageToHTMLExecutor } from "./executorsRegistry/pageToHtmlExecutor";
import { LaunchBrowserStep } from "./nodesRegistry/launchBrowserNode";
import { PageToHTML } from "./nodesRegistry/pageToHTMLNode";

// type ExecutorFn = ;

export const EXECUTOR_REGISTRY: {
  [K in StepType]: ExecutorFn<WorkflowStep & { type: K }>;
} = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHTMLExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
};
