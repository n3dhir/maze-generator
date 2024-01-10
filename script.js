let grid = document.querySelector(".wrapper > .grid");

let toggleButton = document.querySelector('#toggleButton');
let generateButton = document.querySelector('#generate');
let clearButton = document.querySelector('#clear');
let dfsButton = document.querySelector('#dfs');
let bfsButton = document.querySelector('#bfs');
let bidirectionalButton = document.querySelector('#bidirectional');
let greedyButton = document.querySelector('#greedy');
let aStarButton = document.querySelector('#aStar');
let sizeSlider = document.querySelector('#number');
let speedSlider = document.querySelector('#speed');
let totalWalls;
let removed;

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
let draggedElementId = null;
let running = false;
// let showWalls = false;

function resetGraph(all = false) {
    if(running) return;
    lastRunAlgo = null;
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
    // console.log("dark");

    // root.style.setProperty("--path", "linear-gradient(241deg, rgb(94 73 199) 0.1px, #3b12b7 0px, rgb(0 99 223 / 42%) 0.5px, #bbf3f3)");
    // root.style.setProperty("--path", "linear-gradient(241deg, rgb(73 199 77) 0.1px, #8af925 0px, rgb(73 199 106) 0.5px, #ff0065)")
    root.style.setProperty("--path", "linear-gradient(241deg, rgb(73 199 77) 0.1px, #8af925 0px, rgb(73 199 106) 0.5px, #ff00ff)")
    root.style.setProperty("--back-color", "#212121");
    root.style.setProperty("--color", "#c39a3b");
    root.style.setProperty("--walls", "#f5bc37");
    root.style.setProperty("--filter1", "invert(1%) sepia(14%) saturate(53%) hue-rotate(314deg) brightness(107%) contrast(76%)");
    root.style.setProperty("--filter2", "invert(60%) sepia(64%) saturate(377%) hue-rotate(4deg) brightness(90%) contrast(101%)");
  }
  else {
    // console.log("light")
    root.style.setProperty("--path", "linear-gradient(241deg, rgb(73 199 136) 0.1px, #25f9d2 0px, rgb(235 214 113 / 42%) 0.5px, #fff707)");

    root.style.setProperty("--back-color", "#fafafa");
    root.style.setProperty("--color", "#6125f9");
    root.style.setProperty("--walls", "#1a0d4d");
    root.style.setProperty("--filter1", "invert(100%) sepia(57%) saturate(1%) hue-rotate(286deg) brightness(110%) contrast(96%)");
    root.style.setProperty("--filter2", "invert(18%) sepia(79%) saturate(6544%) hue-rotate(258deg) brightness(96%) contrast(103%)");
  }
})

sizeSlider.addEventListener("input", function () {
    if(running) return;
    running = true;
    clearGrid();
    // resetGraph(true)
    // showWalls();
    // generateMaze(0, 0)
    // console.log(cells);
    running = false;
})


generateButton.addEventListener("click", async function () {
    if(running) return;
    removed = 0;
    // console.log("here")
    resetGraph(true);
    // running = true;
    showWalls();
    // generateMaze(0, 0);
    await generateMaze(0, 0);
    await removeExtraWalls(0.7);
    // await generateMaze(0, 0);
    // running = false;
    resetGraph();
})

async function aStarFn(startx = start[0], starty = start[1], endx = end[0], endy = end[1], latency = true) {
    if(running) return;
    resetGraph();
    running = true;
    // console.log(latency);
    let found = await aStar(startx, starty, endx, endy, latency);
    // console.log(par)
    if(found) await visualizePath(startx, starty, endx, endy, latency);
    running = false;
}

aStarButton.addEventListener("click", async function() {
    aStarFn();
})

async function greedyFn(startx = start[0], starty = start[1], endx = end[0], endy = end[1], latency = true) {
    if(running) return;
    resetGraph();
    running = true;
    // console.log(latency);
    let found = await greedy(startx, starty, endx, endy, latency);
    // console.log(par)
    if(found) await visualizePath(startx, starty, endx, endy, latency);
    running = false;
}

greedyButton.addEventListener("click", async function() {
    greedyFn();
})

async function dfsFn(startx = start[0], starty = start[1], endx = end[0], endy = end[1], latency = true) {
    if(running) return;
    resetGraph();
    running = true;
    // console.log(latency);
    let found = await dfs(startx, starty, endx, endy, latency);
    // console.log(par)
    if(found) await visualizePath(startx, starty, endx, endy, latency);
    running = false;
}

dfsButton.addEventListener("click", async function() {
    dfsFn();
})

async function bfsFn(startx = start[0], starty = start[1], endx = end[0], endy = end[1], latency = true) {
    if(running) return;
    resetGraph();
    running = true;
    let found = await bfs(startx, starty, endx, endy, latency);
    // console.log(par)
    if(found) await visualizePath(startx, starty, endx, endy, latency);
    running = false;
}

bfsButton.addEventListener("click", async function() {
    bfsFn();
})

async function bidirectionalFn(startx = start[0], starty = start[1], endx = end[0], endy = end[1], latency = true) {
    if(running) return;
    resetGraph();
    running = true;
    // console.log(start,end)
    // console.log(vis);
    // console.log(startx, start[0]);
    let found = await bidirectional(startx, starty, endx, endy, latency);
    // console.log(par)
    // console.log(bidirectionalMeet);
    // console.log(startx, starty, bidirectionalMeet[0], bidirectionalMeet[1], latency)
    if(found) await visualizePath(startx, starty, bidirectionalMeet[0], bidirectionalMeet[1], latency);
    if(found) await visualizePathReverse(endx, endy, bidirectionalMeet[0], bidirectionalMeet[1], par1, latency);
    running = false;
}

bidirectionalButton.addEventListener("click", async function() {
    bidirectionalFn();
})

clearButton.addEventListener("click", function () {
    if(running) return;
    running = true;
    clearGrid();
    running = false;
})

function clearGrid() {
    resetGrid();
    for(let i=0;i<rowsNumber;i++) {
        for(let j=0;j<colsNumber;j++) {
            grid.childNodes[i].childNodes[j].classList.add("removeHorizontalBar");
            grid.childNodes[i].childNodes[j].classList.add("removeVerticalBar");
            if(j+1 < colsNumber) {
                g[i][j].push([i, j+1]);
                g[i][j+1].push([i, j]);
            }
            if(i+1 < rowsNumber) {
                g[i][j].push([i+1, j]);
                g[i+1][j].push([i, j]);
            }
        }
    }
}

function showWalls() {
    for(let i=0;i<=rowsNumber;i++) {
        for(let j=0;j<=colsNumber;j++) {
            grid.childNodes[i].childNodes[j].classList.remove("removeVerticalBar", "removeHorizontalBar");
        }
    }
}

function resetGrid() {
    // console.log(grid)
    running = false;
    // if(running) return;
    grid.innerHTML = "";
    let size = 130 - parseInt(sizeSlider.value);
    // console.log(size)
    let root = document.documentElement;
    root.style.setProperty("--cellSize", size + "px");
    root.style.setProperty("--wallHeight", size * 1.3 + "px");
    root.style.setProperty("--wallWidth", size / 3 + "px");
    // console.log(Math.max(20, (parseInt(sizeSlider.value) / 4)) + "px")
    // console.log(parseInt(sizeSlider.value) / 2 + 10 + "px")
    root.style.setProperty("--cellMargin", Math.min(0.5, 0.05 * size) + "px");
    colsNumber = Math.ceil((window.innerWidth - 2*size) / (size+0.5));
    rowsNumber = Math.ceil((window.innerHeight - grid.getBoundingClientRect().top - size) / (size+0.5));
    totalWalls = 2 * (colsNumber) * (rowsNumber) - colsNumber - rowsNumber;
    removed = 0;
    // console.log(colsNumber, rowsNumber, parseInt(sizeSlider.value))
    if(!start || start[0] >= rowsNumber || start[1] >= colsNumber) start = [0, 0];
    if(!end || end[0] >= rowsNumber || end[1] >= colsNumber) end = [Math.max(0, rowsNumber-1), Math.max(0, colsNumber-1)];
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
            // newCell.setAttribute("ondrop", "drop(event)");
            // newCell.setAttribute("ondragover", "allowDrop(event)");

            if(i < rowsNumber && j < colsNumber) newCell.setAttribute("ondragenter", "dragEnter(event)");

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
    clearGrid();
    // enable();
    })
    .catch(() => {
    // wrapper.style.height = `${window.innerHeight - wrapper.getBoundingClientRect().top}px`;
    // generate(number.value);
    clearGrid();
    // enable();
    });
}

async function removeExtraWalls(ratio) {
    running = true;
    // console.log(removed ,  totalWalls)
    while(removed < totalWalls * ratio) {
        // removed++;
        let x = Math.floor(Math.random() * rowsNumber);
        let y = Math.floor(Math.random() * colsNumber);
        let dir = Math.floor(Math.random() * 4);
        if(dir == 0) {
            //remove right wall
            const idx = g[x][y].findIndex(element => element[0] === x && element[1] === y+1);
            // console.log(index);
            if(idx === -1 && y+1 < colsNumber) {
                await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
                grid.childNodes[x].childNodes[y + 1].classList.add("removeVerticalBar");
                g[x][y].push([x, y+1]);
                g[x][y+1].push([x, y]);
                removed++;
            }
        }
        else if(dir == 1) {
            //remove down wall
            const idx = g[x][y].findIndex(element => element[0] === x+1 && element[1] === y);
            // console.log(index);
            if(idx === -1 && x+1 < rowsNumber) {
                await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
                grid.childNodes[x+1].childNodes[y].classList.add("removeHorizontalBar");
                g[x][y].push([x + 1, y]);
                g[x + 1][y].push([x, y]);
                removed++;
            }
        }
        else if(dir == 2) {
            //remove left wall
            const idx = g[x][y].findIndex(element => element[0] === x && element[1] === y-1);
            // console.log(index);
            if(idx === -1 && y-1 > -1) {
                await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
                grid.childNodes[x].childNodes[y].classList.add("removeVerticalBar");
                g[x][y].push([x, y-1]);
                g[x][y-1].push([x, y]);
                removed++;
            }
        }
        else {
            // remove up wall
            const idx = g[x][y].findIndex(element => element[0] === x-1 && element[1] === y);
            // console.log(index);
            if(idx === -1 && x-1 > 0) {
                await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
                grid.childNodes[x].childNodes[y].classList.add("removeHorizontalBar");
                g[x][y].push([x - 1, y]);
                g[x - 1][y].push([x, y]);
                removed++;
            }
        }
    }
    running = false;
}

async function generateMaze(x, y) {
    running = true;
    await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
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
                removed++;
            }
            else if(x > x + dx[random[k]]){
                // console.log("to up");
                grid.childNodes[x].childNodes[y].classList.add("removeHorizontalBar");
                removed++;
            }
            else if(y < y + dy[random[k]]) {
                // console.log("to right");
                grid.childNodes[x + dx[random[k]]].childNodes[y + dy[random[k]]].classList.add("removeVerticalBar");
                removed++;
            }
            else if(y > y + dy[random[k]]) {
                // console.log("to left");
                grid.childNodes[x].childNodes[y].classList.add("removeVerticalBar");
                removed++;
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
    running = false;
}

async function visualizePath(x, y, currx, curry, latency = true) {
    // console.log(currx, curry, par[currx]);
    if(x != currx || y != curry) {
       await visualizePath(x, y, par[currx][curry][0], par[currx][curry][1], latency);
    }
    if(latency) await new Promise(resolve => setTimeout(resolve, 0));
    // grid.childNodes[x].childNodes[y].style.background = "yellow";
    grid.childNodes[currx].childNodes[curry].classList.add("path");
}

async function visualizePathReverse(x, y, currx, curry, par, latency) {
    if(latency) await new Promise(resolve => setTimeout(resolve, 0));
    grid.childNodes[currx].childNodes[curry].classList.add("path");
    if(x != currx || y != curry) {
       await visualizePathReverse(x, y, par[currx][curry][0], par[currx][curry][1], par, latency);
    }
    // grid.childNodes[x].childNodes[y].style.background = "yellow";
}


async function aStar(x, y, distx, disty, latency = true) {
    lastRunAlgo = aStarFn;
    // console.log(x, y, distx, disty);
    vis[x][y] = 1;
    grid.childNodes[x].childNodes[y].classList.add("visited");
    let queue = []
    queue.push([x, y, 0]);
    while(queue.length) {
        let idx = 0;
        for(let i=1;i<queue.length;i++) {
            if(Math.abs(queue[i][0] - distx) + Math.abs(queue[i][1] - disty) + queue[i][2] < Math.abs(queue[idx][0] - distx) + Math.abs(queue[idx][1] - disty) + queue[idx][2]) idx = i;
        }
        let node = queue.splice(idx, 1);
        if(latency) await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
        // console.log(front)
        x = node[0][0];
        y = node[0][1];
        let dist = node[0][2];
        if(x == distx && y == disty) return true;
        // console.log(x, g);
        for(let i=0;i<g[x][y].length;i++) {
            if(!vis[g[x][y][i][0]][g[x][y][i][1]]) {
                vis[g[x][y][i][0]][g[x][y][i][1]] = 1;
                par[g[x][y][i][0]][g[x][y][i][1]] = [x, y];
                grid.childNodes[g[x][y][i][0]].childNodes[g[x][y][i][1]].classList.add("visited");
                queue.push([g[x][y][i][0], g[x][y][i][1], dist + 1]);
            }
        }
    }
    return false;
}


async function greedy(x, y, distx, disty, latency = true) {
    lastRunAlgo = greedyFn;
    // console.log(x, y, distx, disty);
    vis[x][y] = 1;
    grid.childNodes[x].childNodes[y].classList.add("visited");
    let queue = []
    queue.push([x, y]);
    while(queue.length) {
        let idx = 0;
        for(let i=1;i<queue.length;i++) {
            if(Math.abs(queue[i][0] - distx) + Math.abs(queue[i][1] - disty) < Math.abs(queue[idx][0] - distx) + Math.abs(queue[idx][1] - disty)) idx = i;
        }
        let node = queue.splice(idx, 1);
        if(latency) await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
        // console.log(front)
        x = node[0][0];
        y = node[0][1];
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

async function dfs(x, y, distx, disty, latency = true) {
    lastRunAlgo = dfsFn;
    vis[x][y] = 1;
    // grid.childNodes[x].childNodes[y].style.background = "#20bf70";//2595f9
    grid.childNodes[x].childNodes[y].classList.add("visited");
    // console.log(latency);
    if(latency) await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
    if(x == distx && y == disty) return true;
    
    for(let i=0;i<g[x][y].length;i++) {
        // console.log(g[x][y][i]);
        if(!vis[g[x][y][i][0]][g[x][y][i][1]]) {
            par[g[x][y][i][0]][g[x][y][i][1]] = [x, y];
            let found = await dfs(g[x][y][i][0], g[x][y][i][1], distx, disty, latency);
            if(found) return true;
        }
    }
    // setTimeout(() => {
        // grid.childNodes[x].childNodes[y].style.background = "red";
    // }, 1000);
    // await new Promise(resolve => setTimeout(resolve, 0));
    return false;
}

async function bfs(x, y, distx, disty, latency = true) {
    lastRunAlgo = bfsFn;
    // console.log(x, y, distx, disty);
    vis[x][y] = 1;
    grid.childNodes[x].childNodes[y].classList.add("visited");
    let queue = []
    queue.push([x, y]);
    while(queue.length) {
        let front = queue.splice(0, 1);
        if(latency) await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
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
    // console.log(lastRunAlgo)
    let vis1 = [];
    par1 = [];
    for(let i=0;i<rowsNumber;i++) {
        vis1[i] = [];
        par1[i] = [];
        // for(let j=0;j<colsNumber;j++) {
        //     vis1[i][j] = [];
        // }
    }
    // console.log(start, distx, disty)
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
        if(latency) await new Promise(resolve => setTimeout(resolve, 500 - speedSlider.value));
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
    if(ev.target.id) draggedElementId = ev.target.id;
    // console.log(draggedElementId);
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragEnd(ev) {
    const draggedElement = document.getElementById(ev.target.id);
}


function dragEnter(ev) {
    // allowDrop(ev);
    ev.preventDefault();
    drag(ev);
    // const data = ev.dataTransfer.getData("text/plain");
    const data = ev.target;
    // console.log(ev.target);
    // const draggedElement = document.getElementById(data);
    // console.log(draggedElementId);
    const draggedElement = document.getElementById(draggedElementId);
    // console.log(draggedElement)
    if (ev.target.childNodes.length === 0 && ev.target.tagName.toLowerCase() !== 'img') {
        // console.log(ev.target);
        // console.log(draggedElement)
        // console.log(draggedElementId);
        // console.log(ev.target)
        ev.target.appendChild(draggedElement);
        for(let i=0;i<rowsNumber;i++) {
            for(let j=0;j<colsNumber;j++) {
                if(grid.childNodes[i].childNodes[j] == ev.target) {
                    if(draggedElementId === "location") {
                        end = [i, j];
                        if(lastRunAlgo) {
                            // console.log(start[0], start[1], end[0], end[1], false)
                            lastRunAlgo(start[0], start[1], end[0], end[1], false);
                        }
                    }
                    else {
                        start = [i, j];
                        if(lastRunAlgo) {
                            // console.log(start[0], start[1], end[0], end[1], false)
                            lastRunAlgo(start[0], start[1], end[0], end[1], false);
                        }
                    }
                    // resetGraph();
                }
            }
        }
    }
    // console.log(start, end)
  }

clear();
window.onresize = clear;