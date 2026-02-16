import { Browser, Page } from "puppeteer";
import { logCollector } from "./logs";

export type UUID = string;

export type StepType =
  | "LAUNCH_BROWSER"
  | "PAGE_TO_HTML"
  | "EXTRACT_TEXT_FROM_ELEMENT"
  | "FILL_INPUT"
  | "CLICK_ELEMENT";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WorkflowNodeData<TInputs = Record<string, unknown>> {
  type: StepType;
  inputs: TInputs;
}

export interface WorkflowEdge {
  id: string;

  source: UUID;
  target: UUID;

  sourceHandle?: string;
  targetHandle?: string;

  type: "Edge";
  animated?: boolean;
}

export interface WorkflowNode<T = Record<string, string>> {
  id: UUID;
  type: "Node"; // UI node type
  position: Position;

  data: { type: StepType; inputs: T };

  measured?: Size;
  selected?: boolean;
}

export type Node = {
  id: string;
  position: { x: number };
};

export interface WorkflowViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: WorkflowViewport;
}

export type StepParameterType = "STRING" | "WEB_PAGE";

export interface StepIO {
  nameAr: string;
  nameEn: string;
  type: StepParameterType;
  showHandle?: boolean;
  helperText?: string;
  required?: boolean;
}

export interface WorkflowStep {
  isEntryPoint: boolean;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  cost: number;
  inputs: StepIO[];
  outputs: StepIO[];
  type: StepType;
}

export interface ExecutionPhase {
  phase: number;
  nodes: WorkflowNode[];
}

export interface AppNodeMissingInputs {
  nodeId: string;
  inputs: string[];
}

export type GlobalEnvironment = {
  browser?: Browser | undefined;
  page?: Page | undefined;
  nodes: {
    [nodeId: string]: {
      outputs: Record<string, string>;
      inputs: Record<string, string>;
    };
  };
};

export type LocalEnvironment<T extends WorkflowStep> = {
  getInput(name: T["inputs"][number]["nameEn"]): string;
  setOutput(name: T["outputs"][number]["nameEn"], value: string): string;
  getBrowser(): Browser | undefined;
  setBrowser(browser: Browser): void;
  getPage(): Page | undefined;
  setPage(page: Page): void;
  log: logCollector;
};

export type ExecutorFn<T extends WorkflowStep> = (
  environment: LocalEnvironment<T>
) => Promise<boolean>;
