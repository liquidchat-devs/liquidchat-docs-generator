const { fchmodSync } = require("fs-extra")
var fs = require("fs-extra")
var readJSON = path =>
    JSON.parse(fs.readFileSync(path))
var getObjectCode = (obj, i, wrap) => {
    var space = ""
    for(var i0 = i*2; i0 > 0; i0--) { space += "&nbsp;" }

    var html = ""
    for (const [key, value] of Object.entries(obj)) {
        var val = value;
        switch(typeof value) {
            case "string":
                val = `"${value}"`
                break;

            case "object":
                if(Array.isArray(value)) {
                    var codeBody = ""
                    value.forEach(e => {
                        codeBody += getObjectCode(e, i+1, true)
                    })
                    codeBody = codeBody.substring(0, codeBody.length - ",\n  <br />".length)

                    val = `[\n<br />
                    ${codeBody}
                    <br />${space}]`
                } else {
                    var codeBody = getObjectCode(value, i+1)
                    codeBody = codeBody.substring(0, codeBody.length - ",\n  <br />".length)

                    val = `{\n<br />
                    ${codeBody}
                    <br />${space}}`
                }
                break;
        }

        html += `<span class="hljs-attr">${space}${wrap === true ? "{ " : ""}"${key}"</span>: <span class="hljs-string">${val}${wrap === true ? " }" : ""}</span>,\n  <br />`
    }
    return html;
}

this.inputPath = process.cwd() + "/data/categories.json"
this.outputPath = process.cwd() + "/../index.html"
this.baseDocument = fs.readFileSync(process.cwd() + "/data/base.html").toString()

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
                case "object":
                    objects +=
                    `<h3 class="h3-1nY9uO" id="${category.id}-object">
                        ${object.name}
                        <a class="anchor-3Z-8Bb hyperlink" href="#${category.id}-object">
                            <div name="${category.id}-object">
                            </div>
                        </a>
                    </h3>\n`

                    objects += object.description === undefined ? "" :
                    `<span class="paragraph-mttuxw">
                        ${object.description}
                    </span>\n`
                    break;

                case "structure":
                    var tableBody = "";
                    var containsDescription = object.fields.filter(a => a.description !== undefined).length > 0
                    object.fields.forEach(prop => {
                        tableBody += 
                        `<tr>
                            <td>${prop.id}</td>
                            ${prop.type !== undefined ? `<td>${prop.type}</td>` : ``}
                            ${prop.description !== undefined ? `<td>${prop.description}</td>` : ``}
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
                                ${containsDescription == true ? `<th scope="col">Description</th>` : ``}
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
                    var containsID = object.fields.filter(a => a.id !== undefined).length > 0
                    var containsDescription = object.fields.filter(a => a.description !== undefined).length > 0
                    object.fields.forEach(prop => {
                        tableBody += 
                        `<tr>
                            <td>${prop.type}</td>
                            ${prop.id !== undefined ? `<td>${prop.id}</td>` : ``}
                            ${prop.description !== undefined ? `<td>${prop.description}</td>` : ``}
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
                                <th scope="col">Type</th>
                                ${containsID === true ? `<th scope="col">ID</th>` : ``}
                                ${containsDescription === true ? `<th scope="col">Description</th>` : ``}
                            </tr>
                        </thead>
                        <tbody>
                            /tableBody/
                        </tbody>
                    </table>\n`
                    objects = objects.replace("/tableBody/", tableBody);
                    break;

                case "flags":
                    var tableBody = "";
                    var containsDescription = object.fields.filter(a => a.description !== undefined).length > 0
                    object.fields.forEach(prop => {
                        tableBody += 
                        `<tr>
                            <td>${prop.flag}</td>
                            <td>${prop.value}</td>
                            ${prop.description !== undefined ? `<td>${prop.description}</td>` : ``}
                        </tr>`
                    })

                    objects +=
                    `<h6 class="h6-3ZuB-g" id="${category.id}-object-${category.id}-flags">
                        ${object.name}
                        <a class="anchor-3Z-8Bb hyperlink" href="#${category.id}-object-${category.id}-flags">
                            <div name="${category.id}-object-${category.id}-flags">
                            </div>
                        </a>
                    </h6>\n`

                    objects +=
                    `<table>
                        <thead>
                            <tr>
                                <th scope="col">Flag</th>
                                <th scope="col">Value</th>
                                ${containsDescription == true ? `<th scope="col">Description</th>` : ``}
                            </tr>
                        </thead>
                        <tbody>
                            /tableBody/
                        </tbody>
                    </table>\n`
                    objects = objects.replace("/tableBody/", tableBody);
                    break;

                case "example":
                    var codeBody = getObjectCode(object.object, 1)
                    codeBody = codeBody.substring(0, codeBody.length - ",\n  <br />".length)

                    objects +=
                    `<h6 class="h6-3ZuB-g" id="${category.id}-object-example-${category.id}">
                        ${object.name}
                        <a class="anchor-3Z-8Bb hyperlink" href="#${category.id}-object-example-${category.id}">
                            <div name="${category.id}-object-example-${category.id}">
                            </div>
                        </a>
                    </h6>\n`

                    objects += object.description === undefined ? "" :
                    `<span class="paragraph-mttuxw">
                        ${object.description}
                    </span>\n`

                    objects +=
                    `<code class="hljs scroller json codeBlock-2WGtNR">{\n  <br />
                        /codeBody/
                    <br />}</code>\n`
                    objects = objects.replace("/codeBody/", codeBody);
                    break;

                case "example-text":
                    objects +=
                    `<h6 class="h6-3ZuB-g" id="${category.id}-object-example-text-${category.id}">
                        ${object.name}
                        <a class="anchor-3Z-8Bb hyperlink" href="#${category.id}-object-example-text-${category.id}">
                            <div name="${category.id}-object-example-text-${category.id}">
                            </div>
                        </a>
                    </h6>\n`

                    objects +=
                    `<pre class="pre-1AN_2u">
                        <code class="hljs scroller codeBlock-2WGtNR">${object.content}</code>
                    </pre>\n`
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

                    if(object.fields !== undefined) {
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
                        <svg class="iconPlay-2kgvwV icon-3ZFEtL" aria-hidden="false" width="16" height="16" viewBox="0 0 24 24" style="margin-right: 5px; transform: rotate(90deg);" id="json-params-${object.id}-switch" onClick=switchElement('json-params-${object.id}')><polygon fill="currentColor" points="0 0 0 14 11 7" transform="translate(7 5)"></polygon></svg>
                            ${object.type === "get" ? "Query String Parameters" : "JSON Params"}
                            <a class="anchor-3Z-8Bb hyperlink" href="#${object.id}-json-params">
                                <div name="${object.id}-json-params">
                                </div>
                            </a>
                        </h6>\n`

                        objects +=
                        `<table id="json-params-${object.id}">
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

                    if(object.errorCodes !== undefined) {
                        var tableBody = "";
                        object.errorCodes.forEach(prop => {
                            tableBody += 
                            `<tr>
                                <td>${prop.name}</td>
                                <td>${prop.id}</td>
                                <td>${prop.description}</td>
                            </tr>`
                        })

                        objects +=
                        `<h6 class="h6-3ZuB-g" id="${object.id}-error-codes">
                            <svg class="iconPlay-2kgvwV icon-3ZFEtL" aria-hidden="false" width="16" height="16" viewBox="0 0 24 24" style="margin-right: 5px; transform: rotate(90deg);" id="error-codes-${object.id}-switch" onClick=switchElement('error-codes-${object.id}')><polygon fill="currentColor" points="0 0 0 14 11 7" transform="translate(7 5)"></polygon></svg>
                            Error Codes
                            <a class="anchor-3Z-8Bb hyperlink" href="#${object.id}-error-codes">
                                <div name="${object.id}-error-codes">
                                </div>
                            </a>
                        </h6>\n`

                        objects +=
                        `<table id="error-codes-${object.id}">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">ID</th>
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

    html = this.baseDocument.replace("/content/", html)
    html = html.replace("/buttons/", html2);

    console.log("Done!")
    fs.writeFile(this.outputPath, html, () => {  });
}

generateHTML();
fs.watch(this.inputPath, { interval: 1000 }, (curr, prev) => {
    generateHTML();
});