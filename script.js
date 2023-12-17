let grid = document.querySelector(".wrapper > .grid");

let toggleButton = document.querySelector('#toggleButton');
let generateButton = document.querySelector('#generate');
let clearButton = document.querySelector('#clear');
let dfsButton = document.querySelector('#dfs');
let bfsButton = document.querySelector('#bfs');
let bidirectionalButton = document.querySelector('#bidirectional');

let vis = [];
let g = [];
let colsNumber;
let rowsNumber;
let dx = [0, 0, -1, 1];
let dy = [1, -1, 0, 0];
let par = [];
let par1 = [];
let start = undefined;
let end = undefined;
let bidirectionalMeet = [];
let lastRunAlgo = null;
// let showWalls = false;

function resetGraph(all = false) {
    for(let i=0;i<rowsNumber;i++) {
        vis[i] = [];
        par[i] = [];
        if(all) {
            g[i] = [];
        }
        for(let j=0;j<colsNumber;j++) {
            grid.childNodes[i]?.childNodes[j]?.classList.remove("visited", "path");
            if(all) {
                g[i][j] = [];
            }

        }
    }
}

function inGrid(x, y) {
    // console.log(x, y, !vis[x][y])
    return x > -1 && x < rowsNumber && y > -1 && y < colsNumber && !vis[x][y];
}

toggleButton.addEventListener("click", function () {
  let root = document.documentElement;
  if (toggleButton.checked) {
    root.style.setProperty("--back-color", "#212121");
    root.style.setProperty("--color", "#c39a3b");
    root.style.setProperty("--walls", "#f5bc37");
    root.style.setProperty("--filter1", "invert(1%) sepia(14%) saturate(53%) hue-rotate(314deg) brightness(107%) contrast(76%)");
    root.style.setProperty("--filter2", "invert(60%) sepia(64%) saturate(377%) hue-rotate(4deg) brightness(90%) contrast(101%)");
  }
  else {
    root.style.setProperty("--back-color", "#fafafa");
    root.style.setProperty("--color", "#6125f9");
    root.style.setProperty("--walls", "#1a0d4d");
    root.style.setProperty("--filter1", "invert(100%) sepia(57%) saturate(1%) hue-rotate(286deg) brightness(110%) contrast(96%)");
    root.style.setProperty("--filter2", "invert(18%) sepia(79%) saturate(6544%) hue-rotate(258deg) brightness(96%) contrast(103%)");
  }
})

generateButton.addEventListener("click", async function () {
    resetGraph(true);
    showWalls();
    generateMaze(0, 0);
    await generateMaze(0, 0);
    // await generateMaze(0, 0);
    resetGraph();
})

dfsButton.addEventListener("click", async function () {
    resetGraph();
    let found = await dfs(start[0], start[1], end[0], end[1]);
    // console.log(par)
    if(found) visualizePath(start[0], start[1], end[0], end[1]);
})

bfsButton.addEventListener("click", async function () {
    resetGraph();
    let found = await bfs(start[0], start[1], end[0], end[1]);
    // console.log(par)
    if(found) visualizePath(start[0], start[1], end[0], end[1]);
})

async function bidirectionalFn(startx = start[0], starty = start[1], endx = end[0], endy = end[1], latency = true) {
    resetGraph();
    // console.log(start,end)
    // console.log(vis);
    // console.log(startx, start[0]);
    let found = await bidirectional(startx, starty, endx, endy, latency);
    // console.log(par)
    // console.log(bidirectionalMeet);
    console.log(startx, starty, bidirectionalMeet[0], bidirectionalMeet[1], latency)
    if(found) await visualizePath(startx, starty, bidirectionalMeet[0], bidirectionalMeet[1], latency);
    if(found) await visualizePathReverse(endx, endy, bidirectionalMeet[0], bidirectionalMeet[1], par1, latency);
}

bidirectionalButton.addEventListener("click", async function() {
    bidirectionalFn();
})

clearButton.addEventListener("click", function () {
    resetGrid();
})

function showWalls() {
    for(let i=0;i<=rowsNumber;i++) {
        for(let j=0;j<=colsNumber;j++) {
            grid.childNodes[i].childNodes[j].classList.remove("removeVerticalBar", "removeHorizontalBar");
        }
    }
}

function resetGrid() {
    // console.log(grid)
    grid.innerHTML = "";
    colsNumber = Math.ceil(window.innerWidth / 50);
    rowsNumber = Math.ceil((window.innerHeight - grid.getBoundingClientRect().top - 100) / 42);
    if(!start || start[0] >= rowsNumber || start[1] >= colsNumber) start = [0, 0];
    if(!end || end[0] >= rowsNumber || end[1] >= colsNumber) end = [rowsNumber-1, colsNumber-1];
    resetGraph(true);
    // console.log(rowsNumber);
    // console.log(colsNumber);
    // console.log(grid.getBoundingClientRect())
    for(let i=0;i<=rowsNumber;i++) {
        vis[i] = []
        let newRow = document.createElement("div");
        // console.log(i);
        for(let j=0;j<=colsNumber;j++) {
            // console.log(j);
            let newCell = document.createElement("span");
            // ondrop="drop(event)" ondragover="allowDrop(event)"
            newCell.setAttribute("ondrop", "drop(event)");
            newCell.setAttribute("ondragover", "allowDrop(event)");

            if(i == start[0] && j == start[1]) {
                let img = document.createElement("img");
                img.id = "right-arrow";
                img.src = "right-arrow.png";
                // img.classList.add("");
                img.setAttribute("draggable", "true");
                img.setAttribute("ondragstart", "drag(event)");
                img.setAttribute("ondragend", "dragEnd(event)");
                newCell.appendChild(img);
            }
            
            if(i == end[0] && j == end[1]) {
                let img = document.createElement("img");
                img.id = "location";
                img.src = "location.png";
                // img.classList.add("");
                img.setAttribute("draggable", "true");
                img.setAttribute("ondragstart", "drag(event)");
                img.setAttribute("ondragend", "dragEnd(event)");
                newCell.appendChild(img);
            }

            if(i < rowsNumber) {
                newCell.classList.add("verticalBar");
            }
            if(j < colsNumber) {
                newCell.classList.add("horizontalBar");
            }
            // if(i && i < rowsNumber) {
                newCell.classList.add("removeHorizontalBar");
            // }
            // if(j && j < colsNumber) {
                newCell.classList.add("removeVerticalBar");
            // }
            if(i == rowsNumber || j == colsNumber) {
                newCell.classList.add("hide");
            }
            newRow.appendChild(newCell);
        }
        grid.appendChild(newRow);
    }
}

function clear() {
    document.fonts.ready
    .then(() => {
    // wrapper.style.height = `${window.innerHeight - wrapper.getBoundingClientRect().top}px`;
    // generate(number.value);
    resetGrid();
    // enable();
    })
    .catch(() => {
    // wrapper.style.height = `${window.innerHeight - wrapper.getBoundingClientRect().top}px`;
    // generate(number.value);
    resetGrid();
    // enable();
    });
}

async function generateMaze(x, y) {
    await new Promise(resolve => setTimeout(resolve, 10));
    // console.log(x, y);
    vis[x][y] = 1;
    // let random = Math.floor(Math.random() * 4);
    let random = [0, 1, 2, 3];
    random.sort((a, b) => 0.5 - Math.random());
    for(let k=0;k<4;k++) {
        // console.log(x, y, x + dx[k], y + dy[k])
        if(inGrid(x + dx[random[k]], y + dy[random[k]])) {
            if(x < x + dx[random[k]]) {
                // console.log("to down");
                grid.childNodes[x + dx[random[k]]].childNodes[y + dy[random[k]]].classList.add("removeHorizontalBar");
            }
            else if(x > x + dx[random[k]]){
                // console.log("to up");
                grid.childNodes[x].childNodes[y].classList.add("removeHorizontalBar");
            }
            else if(y < y + dy[random[k]]) {
                // console.log("to right");
                grid.childNodes[x + dx[random[k]]].childNodes[y + dy[random[k]]].classList.add("removeVerticalBar");
            }
            else if(y > y + dy[random[k]]) {
                // console.log("to left");
                grid.childNodes[x].childNodes[y].classList.add("removeVerticalBar");
            }
            g[x][y].push([x + dx[random[k]], y + dy[random[k]]]);
            g[x + dx[random[k]]][y + dy[random[k]]].push([x, y]);
            await generateMaze(x + dx[random[k]], y + dy[random[k]]);
        }
    }
    // for(let i=0;i<rowsNumber;i++) {
    //     for(let j=0;j<colsNumber;j++) {
    //         grid.childNodes[i].childNodes[j].classList.add("verticalBar", "horizontalBar");
    //     }
    // }
    
}

async function visualizePath(x, y, currx, curry, latency) {
    // console.log(currx, curry, par[currx]);
    if(x != currx || y != curry) {
       await visualizePath(x, y, par[currx][curry][0], par[currx][curry][1], latency);
    }
    if(latency) await new Promise(resolve => setTimeout(resolve, 10));
    // grid.childNodes[x].childNodes[y].style.background = "yellow";
    grid.childNodes[currx].childNodes[curry].classList.add("path");
}

async function visualizePathReverse(x, y, currx, curry, par, latency) {
    if(latency) await new Promise(resolve => setTimeout(resolve, 10));
    grid.childNodes[currx].childNodes[curry].classList.add("path");
    if(x != currx || y != curry) {
       await visualizePathReverse(x, y, par[currx][curry][0], par[currx][curry][1], par, latency);
    }
    // grid.childNodes[x].childNodes[y].style.background = "yellow";
}

async function dfs(x, y, distx, disty) {
    vis[x][y] = 1;
    // grid.childNodes[x].childNodes[y].style.background = "#20bf70";//2595f9
    grid.childNodes[x].childNodes[y].classList.add("visited");
    await new Promise(resolve => setTimeout(resolve, 0));
    if(x == distx && y == disty) return true;
    
    for(let i=0;i<g[x][y].length;i++) {
        // console.log(g[x][y][i]);
        if(!vis[g[x][y][i][0]][g[x][y][i][1]]) {
            par[g[x][y][i][0]][g[x][y][i][1]] = [x, y];
            let found = await dfs(g[x][y][i][0], g[x][y][i][1], distx, disty);
            if(found) return true;
        }
    }
    // setTimeout(() => {
        // grid.childNodes[x].childNodes[y].style.background = "red";
    // }, 1000);
    // await new Promise(resolve => setTimeout(resolve, 0));
    return false;
}

async function bfs(x, y, distx, disty) {
    // console.log(x, y, distx, disty);
    vis[x][y] = 1;
    grid.childNodes[x].childNodes[y].classList.add("visited");
    let queue = []
    queue.push([x, y]);
    while(queue.length) {
        let front = queue.splice(0, 1);
        await new Promise(resolve => setTimeout(resolve, 0));
        // console.log(front)
        x = front[0][0];
        y = front[0][1];
        if(x == distx && y == disty) return true;
        // console.log(x, g);
        for(let i=0;i<g[x][y].length;i++) {
            if(!vis[g[x][y][i][0]][g[x][y][i][1]]) {
                vis[g[x][y][i][0]][g[x][y][i][1]] = 1;
                par[g[x][y][i][0]][g[x][y][i][1]] = [x, y];
                grid.childNodes[g[x][y][i][0]].childNodes[g[x][y][i][1]].classList.add("visited");
                queue.push([g[x][y][i][0], g[x][y][i][1]]);
            }
        }
    }
    return false;
    
}

async function bidirectional(x, y, distx, disty, latency = true) {
    lastRunAlgo = bidirectionalFn;
    console.log(lastRunAlgo)
    let vis1 = [];
    par1 = [];
    for(let i=0;i<rowsNumber;i++) {
        vis1[i] = [];
        par1[i] = [];
        // for(let j=0;j<colsNumber;j++) {
        //     vis1[i][j] = [];
        // }
    }
    console.log(start, distx, disty)
    vis[x][y] = 1;
    // console.log(vis1);
    vis1[distx][disty] = 1;
    grid.childNodes[x].childNodes[y].classList.add("visited");
    grid.childNodes[distx].childNodes[disty].classList.add("visited");
    let queue = [];
    queue.push([x, y]);
    let queue1 = [];
    queue1.push([distx, disty]);
    while(queue.length || queue1.length) {
        if(latency) await new Promise(resolve => setTimeout(resolve, 0));
        if(queue.length) {
            let front = queue.splice(0, 1);
            let x1 = front[0][0];
            let y1 = front[0][1];
            if(vis1[x1][y1]) {
                bidirectionalMeet = [x1, y1];
                return true;
            }
            for(let i=0;i<g[x1][y1].length;i++) {
                if(!vis[g[x1][y1][i][0]][g[x1][y1][i][1]]) {
                    vis[g[x1][y1][i][0]][g[x1][y1][i][1]] = 1;
                    par[g[x1][y1][i][0]][g[x1][y1][i][1]] = [x1, y1];
                    grid.childNodes[g[x1][y1][i][0]].childNodes[g[x1][y1][i][1]].classList.add("visited");
                    queue.push([g[x1][y1][i][0], g[x1][y1][i][1]]);
                }
            }
        }
        if(queue1.length) {
            let front = queue1.splice(0, 1);
            let x1 = front[0][0];
            let y1 = front[0][1];
            if(vis[x1][y1]) {
                bidirectionalMeet = [x1, y1];
                return true;
            }
            for(let i=0;i<g[x1][y1].length;i++) {
                if(!vis1[g[x1][y1][i][0]][g[x1][y1][i][1]]) {
                    vis1[g[x1][y1][i][0]][g[x1][y1][i][1]] = 1;
                    par1[g[x1][y1][i][0]][g[x1][y1][i][1]] = [x1, y1];
                    grid.childNodes[g[x1][y1][i][0]].childNodes[g[x1][y1][i][1]].classList.add("visited");
                    queue1.push([g[x1][y1][i][0], g[x1][y1][i][1]]);
                }
            }
        }
    }
    return false;
}

function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragEnd(ev) {
    const draggedElement = document.getElementById(ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
    if (ev.target.childNodes.length === 0 && ev.target.tagName.toLowerCase() !== 'img') {
        ev.target.appendChild(draggedElement);
        console.log(ev.target);
        for(let i=0;i<rowsNumber;i++) {
            for(let j=0;j<colsNumber;j++) {
                if(grid.childNodes[i].childNodes[j] == ev.target) {
                    if(data === "location") {
                        end = [i, j];
                        if(lastRunAlgo) {
                            console.log(start[0], start[1], end[0], end[1], false)
                            lastRunAlgo(start[0], start[1], end[0], end[1], false);
                        }
                    }
                    else {
                        start = [i, j];
                        if(lastRunAlgo) {
                            console.log(start[0], start[1], end[0], end[1], false)
                            lastRunAlgo(start[0], start[1], end[0], end[1], false);
                        }
                    }
                    // resetGraph();
                }
            }
        }
    }
}

clear();
window.onresize = clear;