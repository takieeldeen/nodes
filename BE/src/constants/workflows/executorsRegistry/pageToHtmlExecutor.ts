import { LocalEnvironment } from "../../../types/workflows";
import { LaunchBrowserStep } from "../nodesRegistry/launchBrowserNode";
import { PageToHTML } from "../nodesRegistry/pageToHTMLNode";

export async function PageToHTMLExecutor(environment:LocalEnvironment<typeof PageToHTML>){

    return true;
}