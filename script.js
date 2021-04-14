const puppy = require("puppeteer");
const email = "revem42575@shzsedu.com";
const pass = "hello123";


async function registerChall(url){


}


async function main(){
    try{
        let browser = await puppy.launch({
            headless: false,
            defaultViewport: false
        });
        let tabs = await browser.pages();
        let tab = await tabs[0];
        await tab.goto("https://www.hackerearth.com/login");
        await tab.type("#id_login", email);
        await tab.type("#id_password", pass);
        await tab.click(".track-login");
        await tab.waitForSelector("img[src='https://s3-ap-southeast-1.amazonaws.com/he-public-data/280x120@3x-8082080e4.jpg']");
        await Promise.all([
            tab.click("#id_is_competitive"), 
            tab.waitForNavigation()
        ]);
        await Promise.all([
            tab.click("#id_is_hackathon"), 
            tab.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        let challUrls = [];
        //div.upcoming.challenge-list 
        await tab.waitForSelector("div.upcoming.challenge-list a.challenge-card-link", {visible: true});
        let challengeLinkButtons = await tab.$$("div.upcoming.challenge-list a.challenge-card-link");
        for(let i of challengeLinkButtons){
            let url = await tab.evaluate(function(ele){
                return ele.getAttribute("href");
            }, i)
            challUrls.push(url);
        } 
        for(let i of challUrls) registerChall(i);
    }catch(err) {
        console.log(err);
    }    
}
main();
