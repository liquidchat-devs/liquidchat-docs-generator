var fs = require("fs-extra")
var readJSON = path =>
    JSON.parse(fs.readFileSync(path))
var getObjectCode = (obj) => {
    var html = ""
    for (const [key, value] of Object.entries(obj)) {
        var val = value;
        switch(typeof value) {
            case "string":
                val = `"${value}"`
                break;

            case "object":
                var codeBody = getObjectCode(value)
                codeBody = codeBody.substring(0, codeBody.length - ",\n  <br />".length)

                val = `{\n  <br />
                &nbsp;&nbsp;${codeBody}
                <br />&nbsp;&nbsp;}`
                break;
        }

        html += `<span class="hljs-attr">&nbsp;&nbsp;"${key}"</span>: <span class="hljs-string">${val}</span>,\n  <br />`
    }
    return html;
}

this.inputPath = process.cwd() + "/categories.json"
this.outputPath1 = process.cwd() + "/../assets/docs.html"
this.outputPath2 = process.cwd() + "/../assets/buttons.html"
var generateHTML = () => {
    console.log("Generating new HTML...")

    var config = readJSON(this.inputPath)
    var html = "";
    var html2 = "";
    config.categories.forEach(category => {
        html +=
        `<div class="markdown-11q6EU hidden" id="category-${category.id}">
            <h1 class="h1-E4giPK" id="${category.id}-resource">
                ${category.name} Resource
                <a class="anchor-3Z-8Bb hyperlink" href="#${category.id}-resource">
                    <div name="${category.id}-resource">
                    </div>
                </a>
            </h1>
            /objects/
        </div>\n`

        html2 += 
        `<li><a id="categoryButton-${category.id}" class="navLink-1Neui4 navLinkSmall-34Tbhm">${category.name}</a></li>`

        var objects = ""
        category.objects.forEach(object => {
            switch(object.type) {
                case "structure":
                    var tableBody = "";
                    object.fields.forEach(prop => {
                        tableBody += 
                        `<tr>
                            <td>${prop.id}</td>
                            <td>${prop.type}</td>
                            <td>${prop.description}</td>
                        </tr>`
                    })

                    objects +=
                    `<h6 class="h6-3ZuB-g" id="${category.id}-object-${category.id}-structure">
                        ${object.name}
                        <a class="anchor-3Z-8Bb hyperlink" href="#${category.id}-object-${category.id}-structure">
                            <div name="${category.id}-object-${category.id}-structure">
                            </div>
                        </a>
                    </h6>\n `

                    objects +=
                    `<table>
                        <thead>
                            <tr>
                                <th scope="col">Field</th>
                                <th scope="col">Type</th>
                                <th scope="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            /tableBody/
                        </tbody>
                    </table>\n`
                    objects = objects.replace("/tableBody/", tableBody);
                    break;

                case "types":
                    var tableBody = "";
                    object.fields.forEach(prop => {
                        tableBody += 
                        `<tr>
                            <td>${prop.type}</td>
                            <td>${prop.id}</td>
                            <td>${prop.description}</td>
                        </tr>`
                    })

                    objects +=
                    `<h6 class="h6-3ZuB-g" id="${category.id}-object-${category.id}-types">
                        ${object.name}
                        <a class="anchor-3Z-8Bb hyperlink" href="#${category.id}-object-${category.id}-types">
                            <div name="${category.id}-object-${category.id}-types">
                            </div>
                        </a>
                    </h6>\n`

                    objects +=
                    `<table>
                        <thead>
                            <tr>
                                <th scope="col">Field</th>
                                <th scope="col">ID</th>
                                <th scope="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            /tableBody/
                        </tbody>
                    </table>\n`
                    objects = objects.replace("/tableBody/", tableBody);
                    break;

                case "example":
                    var codeBody = getObjectCode(object.object)
                    codeBody = codeBody.substring(0, codeBody.length - ",\n  <br />".length)

                    objects +=
                    `<h6 class="h6-3ZuB-g" id="${category.id}-object-example-${category.id}">
                        ${object.name}
                        <a class="anchor-3Z-8Bb hyperlink" href="#${category.id}-object-example-${category.id}">
                            <div name="${category.id}-object-example-${category.id}">
                            </div>
                        </a>
                    </h6>\n`

                    objects +=
                    `<code class="hljs scroller json codeBlock-2WGtNR">{\n  <br />
                        /codeBody/
                    <br />}</code>\n`
                    objects = objects.replace("/codeBody/", codeBody);
                    break;

                case "get":
                case "post":
                    objects +=
                    `<div class="http-req">
                        <h2 class="h2-2MZoq3 http-req-title" id="${object.id}">
                        ${object.name}
                        <a class="anchor-3Z-8Bb hyperlink" href="#${object.id}">
                            <div name="${object.id}"></div>
                        </a>
                        </h2>
                        <span class="http-req-verb">${object.type}</span><span class="http-req-url"><span>${object.endpoint}</span>
                    </div>
                    <span class="paragraph-mttuxw">${object.description}</span>`

                    if(object.type === "post") {
                        var tableBody = "";
                        object.fields.forEach(prop => {
                            tableBody += 
                            `<tr>
                                <td>${prop.field}</td>
                                <td>${prop.type}</td>
                                <td>${prop.description}</td>
                            </tr>`
                        })

                        objects +=
                        `<h6 class="h6-3ZuB-g" id="${object.id}-json-params">
                            JSON Params
                            <a class="anchor-3Z-8Bb hyperlink" href="#${object.id}-json-params">
                                <div name="${object.id}-json-params">
                                </div>
                            </a>
                        </h6>\n`

                        objects +=
                        `<table>
                            <thead>
                                <tr>
                                    <th scope="col">Field</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                /tableBody/
                            </tbody>
                        </table>\n`
                        objects = objects.replace("/tableBody/", tableBody);
                    }
                    break;
            }
        })

        html = html.replace("/objects/", objects)
    });

    console.log("Done!")
    fs.writeFile(this.outputPath1, html, () => {  });
    fs.writeFile(this.outputPath2, html2, () => {  });
}

generateHTML();
fs.watch(this.inputPath, { interval: 1000 }, (curr, prev) => {
    generateHTML();
});