const https = require("https");
const $ = require("cheerio");
const url = "https://nodejs.org/en/get-involved/code-and-learn/";

const request = async (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let html = "";
        res.on("data", (chunk) => {
          html += chunk;
        });
        res.on("end", () => {
          resolve(html.toString());
        });
      })
      .on("error", (e) => {
        reject(e);
      });
  });
};

async function run(){
  const html=await request(url)
  const items=$('aside a',html)
  const menus=[]
  items.each(function(){
    menus.push($(this).text())
  })
  console.log(menus);
}

run()
