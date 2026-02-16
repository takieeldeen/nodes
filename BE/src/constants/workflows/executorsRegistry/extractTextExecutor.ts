import { LocalEnvironment } from "../../../types/workflows";
import { ExtractTextStep } from "../nodesRegistry/extractTextNode";

export async function ExtractTextExecutor(
  environment: LocalEnvironment<typeof ExtractTextStep>
) {
  try {
    const page = environment.getPage();
    const selector = environment.getInput("Element CSS Selector");
    if (!selector) {
      environment.log.error("Selector Not Found");
      return false;
    }
    const textSelector = await page?.locator(selector).waitHandle();
    if (!textSelector) {
      environment.log.error("No Element Found with this selector");
      return false;
    }
    const textContent = await textSelector?.evaluate((el) => el.textContent);
    if (!textContent) {
      environment.log.error("No text content found for this element");
      return false;
    }
    environment.setOutput("Extracted Text", textContent);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
