import puppeteer from "puppeteer";
import { LocalEnvironment } from "../../../types/workflows";
import { LaunchBrowserStep } from "../nodesRegistry/launchBrowserNode";

export async function LaunchBrowserExecutor(environment:LocalEnvironment<typeof LaunchBrowserStep>){
    try{

        const browser = await puppeteer.launch({headless:false});
        environment.log.info("Browser Lunched Successfuly")
        environment.setBrowser(browser);
        const page = await browser.newPage();
        const websiteLink = environment.getInput('Website URL');
        console.log(websiteLink);
        await page.goto(websiteLink,{waitUntil: 'domcontentloaded'});
        environment.log.info(`Browser opened url: ${websiteLink}`);
        environment.setPage(page);
        return true;
    }catch(err:any){
        environment.log.error(err.message)
        return false
    }
}