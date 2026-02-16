import { LocalEnvironment } from "../../../types/workflows";
import { ExtractTextStep } from "../nodesRegistry/extractTextNode";
import { FillInputNode } from "../nodesRegistry/fillInputNode";

export async function FillInputExecutor(
  environment: LocalEnvironment<typeof FillInputNode>
) {
  try {
    const page = environment.getPage();
    const selector = environment.getInput("Element CSS Selector");
    if (!selector) {
      environment.log.error("Selector Not Found");
      return false;
    }
    const text = environment.getInput("Filling text");
    if (!text) {
      environment.log.error("Please enter a text to fill the input with");
    }
    await page?.locator(selector).fill(text);

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
