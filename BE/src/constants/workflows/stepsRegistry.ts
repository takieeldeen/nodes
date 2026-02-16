import { StepType, WorkflowStep } from "../../types/workflows";
import { ClickElementNode } from "./nodesRegistry/clickElementNode";
import { ExtractTextStep } from "./nodesRegistry/extractTextNode";
import { FillInputNode } from "./nodesRegistry/fillInputNode";
import { LaunchBrowserStep } from "./nodesRegistry/launchBrowserNode";
import { PageToHTML } from "./nodesRegistry/pageToHTMLNode";

export const STEPS_REGISTRY: { [K in StepType]: WorkflowStep & { type: K } } = {
  LAUNCH_BROWSER: LaunchBrowserStep,
  PAGE_TO_HTML: PageToHTML,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextStep,
  FILL_INPUT: FillInputNode,
  CLICK_ELEMENT: ClickElementNode,
};
