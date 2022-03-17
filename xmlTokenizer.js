/*
Index Page Begin
 */


//Import
const {ipcRenderer, app} = require("electron");
const xml2js = require("xml2js");
const electron = require("electron");
const version = document.getElementById('version');

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    version.innerText = '©2022 PackJC v' + arg.version;
});


let xmlDoc;
//Event Listeners

document.getElementById("getFile").addEventListener("click", getFileFunction);
document.getElementById("saveFile").addEventListener("click", sendXML);
document.getElementById("help").addEventListener("click", getHelp);

//IPC
ipcRenderer.on("receiveDataReply", (event, data) => {
    console.log("successful file upload")
    let loopCounter = data.types.type.length
    let table = document.getElementById('myTBody')
    for (let i = 0; i < loopCounter; i++) {
        let row = table.insertRow(0)
        let category = data.types.type[i]?.category?.[0].$?.name ?? "N / A"
        let usage = data.types.type[i]?.usage?.[0].$?.name ?? "N / A"
        let value = data.types.type[i]?.value?.[0].$?.name ?? "N / A"

        let usage1 = data.types.type[i]?.usage?.[1]?.$?.name ?? "N / A"
        let usage2 = data.types.type[i]?.usage?.[2]?.$?.name ?? "N / A"
        let usage3 = data.types.type[i]?.usage?.[3]?.$?.name ?? "N / A"
        let value1 = data.types.type[i]?.value?.[1]?.$?.name ?? "N / A"
        let value2 = data.types.type[i]?.value?.[2]?.$?.name ?? "N / A"

        let tag = data.types.type[i].tag?.[0].$?.name ?? "N / A"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + tag + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + value2 + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + value1 + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + value + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + usage3 + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + usage2 + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + usage1 + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + usage + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].flags[0].$.deloot + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].flags[0].$.crafted + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].flags[0].$.count_in_player + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].flags[0].$.count_in_map + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].flags[0].$.count_in_hoarder + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].flags[0].$.count_in_cargo + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].cost + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + category + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].quantmax + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].quantmin + "</div>" //11
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].min + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].restock + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].lifetime + "</div>"
        row.insertCell(0).innerHTML = "<div contentEditable='true'>" + data.types.type[i].nominal + "</div>"
        row.insertCell(0).innerHTML = "<div>" + data.types.type[i].$.name + "</div>"
    }
    document.querySelector('.save-btn').classList.remove('disabled')
})
ipcRenderer.on("updateImportButton", (event, data) => {
    document.getElementById('getFile').innerHTML = data.toString()
})

//Functions
function getFileFunction() {
    ipcRenderer.send("getFileEvent")
}

function checkJSON() {
    ipcRenderer.send("checkJSON")
}

function sendXML(){
    let sXML = new XMLSerializer().serializeToString(getXMLTable());
    ipcRenderer.send("doc", sXML);
}


function getXMLTable() {
    const parser = new DOMParser()
    const table = $('#myTable').tableToJSON()
    const typeArr = {"type": table}
    const typesArray = {"types": typeArr}
    const builder = new xml2js.Builder()
    const xml = builder.buildObject(typesArray)
    xmlDoc = parser.parseFromString(xml.trim(), "application/xml")
    let xmlNodes = xmlDoc.getElementsByTagName("type")
    console.log('i Loops: ' + xmlNodes.length)
    for (let i = 0; i < xmlNodes.length; i++) {
        //Add name attribute to Type
        xmlNodes[i].setAttribute("name", xmlNodes[i].childNodes[1].firstChild.nodeValue)
        //Remove name node since it's added as attribute now
        xmlNodes[i].childNodes[1].remove()
        let newText = xmlDoc.createElement("flags");
        xmlNodes[i].appendChild(newText)
        for(let x = 0; x < xmlNodes.length; x++){
            if(xmlNodes?.[i]?.childNodes[i] === undefined){
                xmlNodes?.[i]?.childNodes?.[i]?.remove()
            }
        }
    }

    let node, childNodes = xmlDoc.documentElement.childNodes;
    console.log('z Loops: ' + childNodes.length)
    for (let z = 0; z < childNodes.length; z++) {

        if (childNodes[z].nodeType !== Node.TEXT_NODE) {
            node = childNodes[z];
            /*
            Sets attribute for XML Nodes
            */
            node.getElementsByTagName('flags')[0]?.setAttribute("count_in_cargo", node.getElementsByTagName('count_in_cargo')[0]?.textContent)
            node.getElementsByTagName('flags')[0]?.setAttribute("count_in_hoarder", node.getElementsByTagName('count_in_hoarder')[0]?.textContent)
            node.getElementsByTagName('flags')[0]?.setAttribute("count_in_map", node.getElementsByTagName('count_in_map')[0]?.textContent)
            node.getElementsByTagName('flags')[0]?.setAttribute("count_in_player", node.getElementsByTagName('count_in_player')[0]?.textContent)
            node.getElementsByTagName('flags')[0]?.setAttribute("crafted", node.getElementsByTagName('crafted')[0]?.textContent)
            node.getElementsByTagName('flags')[0]?.setAttribute("deloot", node.getElementsByTagName('deloot')[0]?.textContent)
            node.getElementsByTagName('tag')[0]?.setAttribute("name", node.getElementsByTagName('tag')[0]?.textContent)
            node.getElementsByTagName('category')[0]?.setAttribute("name", node.getElementsByTagName('category')[0]?.textContent)
            node.getElementsByTagName('usage')[0]?.setAttribute("name", node.getElementsByTagName('usage')[0]?.textContent)

            //Set array to 0
            //When these are used, need to be removed from them after they are made an attribute maybe
            node.getElementsByTagName('usage1')[0]?.setAttribute("name", node.getElementsByTagName('usage1')[0]?.textContent)
            node.getElementsByTagName('usage2')[0]?.setAttribute("name", node.getElementsByTagName('usage2')[0]?.textContent)
            node.getElementsByTagName('usage3')[0]?.setAttribute("name", node.getElementsByTagName('usage3')[0]?.textContent)


            node.getElementsByTagName('value')[0]?.setAttribute("name", node.getElementsByTagName('value')[0]?.textContent)

            //Set array to 0
            //When these are used, need to be removed from them after they are made an attribute maybe
            node.getElementsByTagName('value1')[0]?.setAttribute("name", node.getElementsByTagName('value1')[0]?.textContent)
            node.getElementsByTagName('value2')[0]?.setAttribute("name", node.getElementsByTagName('value2')[0]?.textContent)
            /*
            Removes Undefined XML Nodes
            */
            if (node.getElementsByTagName('category')[0]?.textContent === "undefined" || node.getElementsByTagName('category')[0]?.textContent === "N / A") {
                node.getElementsByTagName('category')[0].remove()
            }
            if (node.getElementsByTagName('tag')[0]?.textContent === "undefined" || node.getElementsByTagName('tag')[0]?.textContent === "N / A") {
                node.getElementsByTagName('tag')[0].remove()
            }
            if (node.getElementsByTagName('usage')[0]?.textContent === "undefined" || node.getElementsByTagName('usage')[0]?.textContent === "N / A") {
                node.getElementsByTagName('usage')[0].remove()
            }
            if (node.getElementsByTagName('value')[0]?.textContent === "undefined" || node.getElementsByTagName('value')[0]?.textContent === "N / A") {
                node.getElementsByTagName('value')[0].remove()
            }
            if (node.getElementsByTagName('usage1')[0]?.textContent === "undefined" || node.getElementsByTagName('usage1')[0]?.textContent === "N / A") {
                node.getElementsByTagName('usage1')[0].remove()
            }
            if (node.getElementsByTagName('usage2')[0]?.textContent === "undefined" || node.getElementsByTagName('usage2')[0]?.textContent === "N / A") {
                node.getElementsByTagName('usage2')[0].remove()
            }
            if (node.getElementsByTagName('usage3')[0]?.textContent === "undefined" || node.getElementsByTagName('usage3')[0]?.textContent === "N / A") {
                node.getElementsByTagName('usage3')[0].remove()
            }
            if (node.getElementsByTagName('value1')[0]?.textContent === "undefined" || node.getElementsByTagName('value1')[0]?.textContent === "N / A") {
                node.getElementsByTagName('value1')[0].remove()
            }
            if (node.getElementsByTagName('value2')[0]?.textContent === "undefined" || node.getElementsByTagName('value2')[0]?.textContent === "N / A") {
                node.getElementsByTagName('value2')[0].remove()
            }
            /*
            Removes XML Node Text
             */

            if (node.getElementsByTagName('tag')[0]?.textContent !== "undefined") {
                let tagNode = node?.getElementsByTagName('tag')[0]
                if (tagNode) {
                    tagNode.textContent = ""
                }
            }
            if (node.getElementsByTagName('category')[0]?.textContent !== "undefined") {
                let categoryNode = node?.getElementsByTagName('category')[0]
                if (categoryNode) {
                    categoryNode.textContent = ""
                }
            }
            if (node.getElementsByTagName('value')[0]?.textContent !== "undefined") {
                let categoryNode = node?.getElementsByTagName('value')[0]
                if (categoryNode) {
                    categoryNode.textContent = ""
                }
            }
            if (node.getElementsByTagName('usage')[0]?.textContent !== "undefined") {
                let categoryNode = node?.getElementsByTagName('usage')[0]
                if (categoryNode) {
                    categoryNode.textContent = ""
                }
            }
        }
    }

    for (let h = 0; h < childNodes.length; h++) {
        if (childNodes[h].nodeType !== Node.TEXT_NODE) {
            node = childNodes[h];
            node.getElementsByTagName('count_in_cargo')[0]?.remove()
            node.getElementsByTagName('count_in_hoarder')[0]?.remove()
            node.getElementsByTagName('count_in_map')[0]?.remove()
            node.getElementsByTagName('count_in_player')[0]?.remove()
            node.getElementsByTagName('crafted')[0]?.remove()
            node.getElementsByTagName('deloot')[0]?.remove()
        }
    }
    return xmlDoc;
}

function getHelp() {
    //Help page redirect
    window.location.href = "settings.html";
}


const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});


function closeNotification() {
    notification.classList.add('hidden');
}
function restartApp() {
    ipcRenderer.send('restart_app');
}

$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});