import { tileSpec } from "./tileSpec.js";
import { entitySpec } from "./entitySpec.js";

let DRAW_TILE = 1;

let canvas = document.querySelector("canvas");
let tileDivision = document.querySelector(".tiles");
let tileContainer = document.querySelector(".tile-container");
let tileSelector = document.querySelector(".tile-selector");
let tileImage = document.querySelector("#tile-image");
let tileSelection = [0, 0];

let entityDivision = document.querySelector(".entities");
let entityContainer = document.querySelector(".entity-container");
let entitySelector = document.querySelector(".entity-selector");
let entityImage = document.querySelector("#entity-image");
let entitySelection = [0, 0];

let drawTile = document.querySelector(".draw-tile");
let drawEntity = document.querySelector(".draw-entity");

drawTile.addEventListener("click", () => {
  DRAW_TILE = 1;
  tileDivision.style.display = "block";
  tileSelector.style.display = "block";
  entityDivision.style.display = "none";
  entitySelector.style.display = "none";
});
drawEntity.addEventListener("click", () => {
  DRAW_TILE = 0;
  entityDivision.style.display = "block";
  entitySelector.style.display = "block";
  tileSelector.style.display = "none";
  tileDivision.style.display = "none";
});

let level = {
  backgrounds: [
    { tile: "back", ranges: [] },
    { tile: "ground", ranges: [] },
    { tile: "l-slant", ranges: [] },
    { tile: "r-slant", ranges: [] },
    { tile: "blue-ground", ranges: [] },
    { tile: "water", ranges: [] },
    { tile: "water-l-slant", ranges: [] },
    { tile: "water-r-slant", ranges: [] },
    { tile: "big-ball-maker", ranges: [] },
    { tile: "big-ball-maker-water", ranges: [] },
    { tile: "small-ball-maker", ranges: [] },
    { tile: "small-ball-maker-water", ranges: [] },
    { tile: "small-ball-maker-inverse", ranges: [] },
    { tile: "spike", ranges: [] },
    { tile: "spike-inverse", ranges: [] },
  ],
  entities: [],
  rings: 0,
  ballSize: "small",
  startingPosition: {
    x: 100,
    y: 200,
  },
  nextLevel: "level3",
};

function draw() {
  let context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  level.backgrounds.forEach((background) => {
    tileSpec.tiles.forEach((tile) => {
      if (tile.name == background.tile) {
        background.ranges.forEach(
          ([positionX, positionXplusOne, positionY, positionYplusOne]) => {
            let [tileImageX, tileImageY] = tile.index;
            context.drawImage(
              tileImage,
              tileImageX * 12,
              tileImageY * 12,
              12,
              12,
              positionX * 24,
              positionY * 24,
              24,
              24
            );
          }
        );
      }
    });
  });
  level.entities.forEach((entity) => {
    entitySpec.entities.forEach((entitySp) => {
      if (entity.name == entitySp.name) {
        let entityImageX = entitySp.index[0];
        let entityImageY = entitySp.index[1];

        let entPositionX = entity.position[0] / 36;
        let entPositionY = entity.position[1] / 36;

        context.drawImage(
          entityImage,
          entityImageX * 24,
          entityImageY * 24,
          24,
          24,
          entPositionX * 24,
          entPositionY * 24,
          48,
          48
        );
      }
    });
  });
}

tileContainer.addEventListener("mousedown", (event) => {
  tileSelection = getImageCoords(event);
  tileSelector.style.left = tileSelection[0] * 36 + "px";
  tileSelector.style.top = tileSelection[1] * 36 + "px";
});

entityContainer.addEventListener("mousedown", (event) => {
  entitySelection = getEntityImageCoords(event);
  entitySelector.style.left = entitySelection[0] * 48 + "px";
  entitySelector.style.top = entitySelection[1] * 48 + "px";
});

function getEntityImageCoords(e) {
  const { x, y } = e.target.getBoundingClientRect();
  const mouseX = e.clientX - x;
  const mouseY = e.clientY - y;
  return [Math.floor(mouseX / 48), Math.floor(mouseY / 48)];
}

function getImageCoords(e) {
  const { x, y } = e.target.getBoundingClientRect();
  const mouseX = e.clientX - x;
  const mouseY = e.clientY - y;
  return [Math.floor(mouseX / 36), Math.floor(mouseY / 36)];
}

function getCanvasCoords(e) {
  const { x, y } = e.target.getBoundingClientRect();
  const mouseX = e.clientX - x;
  const mouseY = e.clientY - y;
  return [Math.floor(mouseX / 24), Math.floor(mouseY / 24)];
}

let isMouseDown = false;
canvas.addEventListener("mousedown", () => {
  isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
  isMouseDown = false;
});
canvas.addEventListener("mousedown", (event) => {
  if (isMouseDown) {
    if (DRAW_TILE == 1) {
      addTile(event);
    } else {
      addEntity(event);
    }
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    if (DRAW_TILE == 1) {
      addTile(event);
    }
  }
});

function addEntity(mouseEvent) {
  let [x1, y1] = getCanvasCoords(mouseEvent);
  let position = [x1 * 36, y1 * 36];

  entitySpec.entities.forEach((entitySp) => {
    if (
      entitySp.index[0] == entitySelection[0] &&
      entitySp.index[1] == entitySelection[1]
    ) {
      level.entities.push({
        name: entitySp.name,
        position: position,
      });
    }
  });

  draw();
}

function addTile(mouseEvent) {
  let [x1, y1] = getCanvasCoords(mouseEvent);
  let range = [x1, x1 + 1, y1, y1 + 1];

  tileSpec.tiles.forEach((tile) => {
    if (
      tile.index[0] == tileSelection[0] &&
      tile.index[1] == tileSelection[1]
    ) {
      level.backgrounds.forEach((background) => {
        if (background.tile == tile.name) {
          background.ranges.push(range);
        }
      });
    }
  });

  draw();
}

tileImage.src = "images/tiles.png";
entityImage.src = "images/entities.png";
tileImage.onload = function () {
  entityImage.onload = function () {
    draw();
  };
};

var downloadJSON = document.getElementById("download-json");

downloadJSON.addEventListener("click", () => {
  let dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(level));
  downloadJSON.setAttribute("href", dataStr);
  downloadJSON.setAttribute("download", "level.json");
});

var clearCanvas = document.getElementById("clear-canvas");
clearCanvas.addEventListener("click", () => {
  level.backgrounds.forEach((background) => {
    background.ranges = [];
  });
  level.entities = [];
});

let noRings = document.getElementById("rings");
let ballStartX = document.getElementById("starting-x");
let ballStartY = document.getElementById("starting-y");

noRings.addEventListener("change", () => {
  if (noRings.value === "") {
    level.rings = 0;
  } else {
    level.rings = noRings.value;
  }
});

ballStartX.addEventListener("change", () => {
  if (ballStartX.value === "") {
    level.startingPosition.x = 100;
  } else {
    level.startingPosition.x = ballStartX.value * 36;
  }
});

ballStartY.addEventListener("change", () => {
  if (ballStartY.value === "") {
    level.startingPosition.y = 100;
  } else {
    level.startingPosition.y = ballStartY.value * 36;
  }
});
