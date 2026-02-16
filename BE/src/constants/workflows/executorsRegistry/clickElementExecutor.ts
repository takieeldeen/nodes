import { LocalEnvironment } from "../../../types/workflows";
import { ClickElementNode } from "../nodesRegistry/clickElementNode";
import { ExtractTextStep } from "../nodesRegistry/extractTextNode";
import { FillInputNode } from "../nodesRegistry/fillInputNode";

export async function ClickElementExecutor(
  environment: LocalEnvironment<typeof ClickElementNode>
) {
  try {
    console.log("triggered click executor");
    const page = environment.getPage();
    const selector = environment.getInput("Element CSS Selector");
    if (!selector) {
      environment.log.error("Selector Not Found");
      return false;
    }
    await page?.waitForSelector(selector);
    await page?.locator(selector).click();

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
