const puppy = require("puppeteer");
const email = "ximone3768@zcai77.com";
const pass = "hello123";
const baseUrl = "https://www.hackerearth.com";

let data = [];
let candidateInformation = {
    name: "Jane Doe",
    gender: "F",
    currentLoc: "Delhi",
    phoneCode: "+91",
    contactNumber: "9999999999",
    institution: "VIT",
    degree: "Bachelor of Technology",
    stream: "Computer Science Engineering" ,
    gradYear: "2021",
    cgpa: "9.1",
    yearsExp: "0",
    interest: "Yes"
}
async function registerChall(url, tab){ 
    await tab.goto(url);
    await tab.waitForSelector("#id_full_name");
    await tab.click("#id_full_name");
    await tab.keyboard.down("Control");
    await tab.keyboard.press("A");
    await tab.keyboard.up("Control");
    await tab.type("#id_full_name", candidateInformation.name);
    await tab.select("#id_gender", candidateInformation.gender);
    await tab.type("#id_city", candidateInformation.currentLoc);
    await tab.type("#id_phone_code", candidateInformation.phoneCode);
    await tab.type("#id_phone_number", candidateInformation.contactNumber);
    await tab.type("#id_institute", candidateInformation.institution);
    await tab.click("#id_degree + div");
    await tab.type("#id_degree + div", candidateInformation.degree);
    await tab.keyboard.press("Enter");
    await tab.click("#id_stream + div");
    await tab.type("#id_stream + div", candidateInformation.stream);
    await tab.keyboard.press("Enter");
    await tab.select("#id_graduation_year", candidateInformation.gradYear);
    await tab.type("#id_cgpa", candidateInformation.cgpa);
    await tab.select("#id_years_of_experience", candidateInformation.yearsExp);
    await tab.select("#dynamic-data-div select", candidateInformation.interest);
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
        await tab.waitForSelector('img[src="https://s3-ap-southeast-1.amazonaws.com/he-public-data/Microsoft%20top%20right%20banner0d61492.png"]');
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
        await getDetailsAndRegister(baseUrl + challUrls[0], tab);
        // for(let url of challUrls) await getDetailsAndRegister(baseUrl + url, tab);
        // console.log(data);
        // await browser.close();
    }catch(err) {
        console.log(err);
    }    
}
main();
