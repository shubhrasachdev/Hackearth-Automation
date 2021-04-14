const puppy = require("puppeteer");
const email = "revem42575@shzsedu.com";
const pass = "hello123";
const baseUrl = "https://www.hackerearth.com";

let data = [];

async function registerChall(url, tab){
    await tab.goto(url);
}

async function getDetailsAndRegister(url, tab){
    await tab.goto(url);
    let currData = {};
    await tab.waitForSelector("h1.event-title");
    let challNameBox = await tab.$("h1.event-title");
    currData["Challenge"] = await tab.evaluate(function(ele){
        return ele.textContent;
    }, challNameBox);
    let detailsBox = await tab.$$(".details span");
    let detailsKeys = ["Type", "Role", "Experience", "CTC"];
    for(let i = 0; i < detailsBox.length; i++){
        let detail = await tab.evaluate(function(ele){
            return ele.textContent;
        }, detailsBox[i]);
        let key = detailsKeys[i];
        if(i == 2) detail = detail.replace("Experience", "");
        else if(i == 3) detail = detail.replace("CTC", "");
        currData[key] = detail;
    }
    currData["URL"] = url;
    data.push(currData);
    await registerChall(url + "register", tab);
}


async function main(){
    try{
        let browser = await puppy.launch({
            headless: false,
            defaultViewport: false
        });
        let tabs = await browser.pages();
        let tab = await tabs[0];
        await tab.goto(baseUrl + "/login");
        await tab.type("#id_login", email);
        await tab.type("#id_password", pass);
        await tab.click(".track-login");
        await tab.waitForSelector("img[src='https://s3-ap-southeast-1.amazonaws.com/he-public-data/280x120@3x-8082080e4.jpg']");
        await Promise.all([
            tab.click("#id_is_competitive"), 
            tab.waitForNavigation({waitUntil: 'networkidle0'})
        ]);
        await Promise.all([
            tab.click("#id_is_hackathon"), 
            tab.waitForNavigation({waitUntil: 'networkidle0'})
        ]);
        let challUrls = []; 
        await tab.waitForSelector("div.upcoming.challenge-list a.challenge-card-link", {visible: true});
        let challengeLinkButtons = await tab.$$("div.upcoming.challenge-list a.challenge-card-link");
        for(let i of challengeLinkButtons){
            let url = await tab.evaluate(function(ele){
                return ele.getAttribute("href");
            }, i)
            challUrls.push(url);
        } 
        await registerChall(baseUrl + challUrls[0], tab);
        for(let url of challUrls) await getDetailsAndRegister(baseUrl + url, tab);
        console.log(data);
        await browser.close();
    }catch(err) {
        console.log(err);
    }    
}
main();
