const puppeteer = require('puppeteer');

// https://www.backmarket.fr/search?q=iphone%2011&ga_search=iphone%2011
// "puppeteer": "^10.4.0",
// "cheerio": "^1.0.0-rc.10",

const puppeteerFunction = async (goToUrl, message) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        const shapeString = goToUrl.query.split(' ').join('-');
    
        console.log(goToUrl, shapeString);
    
        await page.goto(goToUrl.url);
        // h2
        // data-qa="prices"
        const links = await page.$$eval('a', elements => elements.filter(element => !!element)
        .map(element => element.href)
        );
        const shapedLinks = links.filter(link => link.includes(shapeString));
        if(shapedLinks && shapedLinks.length){
            // console.log(JSON.stringify(link));
            shapedLinks.forEach(async link => {
                const itemPage = await browser.newPage();
                await itemPage.goto(link);

                const foundedButton = await findByButton(itemPage, 'Ajouter au panier')
                // itemPage.$$eval('')
                console.log(foundedButton);
                message.reply(`${JSON.stringify(link)}`)
            });
        } else {
            message.reply(`NOK: Empty result`);
        }
    
        await browser.close();
};

// find the link, by going over all links on the page
async function findByLink(page, linkString) {
    const links = await page.$$('a')
    for (var i=0; i < links.length; i++) {
        let valueHandle = await links[i].getProperty('innerText');
        let linkText = await valueHandle.jsonValue();
        const text = getText(linkText);
        if (linkString == text) {
        console.log(linkString);
        console.log(text);
        console.log("Found");
        return links[i];
        }
    }
    return null;
}

// find the link, by going over all links on the page
async function findByButton(page, linkString) {
    const links = await page.$$('button')
    for (var i=0; i < links.length; i++) {
        let valueHandle = await links[i].getProperty('innerText');
        let linkText = await valueHandle.jsonValue();
        const text = getText(linkText);
        if (linkString == text) {
        console.log(linkString);
        console.log(text);
        console.log("Found");
        return links[i];
        }
    }
    return null;
}

module.exports = {
    puppeteerFunction,
    testUrl: (parsedBody, trimedsearchParam) => ({
        query: trimedsearchParam,
        url: `https://www.backmarket.fr/search?q=${ parsedBody }&ga_search=${ parsedBody }`,
    })
}