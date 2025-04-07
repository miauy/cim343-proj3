let mood = "neutral";
let flowers = [];
let butterflies = [];
let clouds = [];

function setup() {
  let canvas = createCanvas(600, 300);
  canvas.parent("garden");
  loop();

  for (let i = 0; i < width; i += 60) {
    flowers.push({ x: i + 30, y: height - 50, size: 20 });
  }

  for (let i = 0; i < 5; i++) {
    butterflies.push({
      x: random(width),
      y: random(height / 2),
      speed: random(0.5, 1),
      dir: random(1) > 0.5 ? 1 : -1
    });
  }

  for (let i = 0; i < 3; i++) {
    clouds.push({
      x: random(width),
      y: random(50, 100),
      speed: random(0.3, 1)
    });
  }
}

function draw() {
  clear();
  background("#d8f9d3");

  if (mood === "positive") {
    drawSun();
    animateButterflies();
    animateFlowers("grow", "#ff69b4");
  } else if (mood === "negative") {
    drawClouds();
    animateFlowers("wilt", "#5a5a5a");
  } else {
    drawClouds();
    animateFlowers("idle", "#cccccc");
  }
}

function animateFlowers(state, color) {
  for (let flower of flowers) {
    if (state === "grow") {
      flower.size = min(flower.size + 0.5, 40);
    } else if (state === "wilt") {
      flower.size = max(flower.size - 0.5, 10);
    } else {
      flower.size = 20;
    }

    fill(color);
    ellipse(flower.x, flower.y, flower.size, flower.size);
    fill("green");
    rect(flower.x - 2, flower.y, 4, 40);
  }
}

function drawSun() {
  fill("yellow");
  noStroke();
  ellipse(100, 60, 80, 80);
}

function drawClouds() {
  for (let c of clouds) {
    fill("gray");
    noStroke();
    ellipse(c.x, c.y, 60, 40);
    ellipse(c.x + 30, c.y, 60, 40);
    ellipse(c.x + 15, c.y - 15, 60, 40);
    c.x += c.speed;
    if (c.x > width + 50) c.x = -50;
  }
}

function animateButterflies() {
  for (let b of butterflies) {
    fill("orange");
    ellipse(b.x, b.y, 10, 10);
    ellipse(b.x + 10 * b.dir, b.y + 5, 10, 10);
    b.x += b.speed * b.dir;
    b.y += sin(frameCount * 0.05) * 0.5;
    if (b.x > width || b.x < 0) b.dir *= -1;
  }
}

function analyzeMood() {
  const text = document.getElementById("moodInput").value;
  if (!text) return;

  console.log("User typed:", text);

  fetch("https://twinword-sentiment-analysis.p.rapidapi.com/analyze/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "191f47bb53msh394312f23244e2dp182155jsn404e11021d17",
      "X-RapidAPI-Host": "twinword-sentiment-analysis.p.rapidapi.com"
    },
    body: new URLSearchParams({ text })
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("API returned:", data);
      if (data.type === "positive") {
        mood = "positive";
      } else if (data.type === "negative") {
        mood = "negative";
      } else {
        mood = "neutral";
      }
    })
    .catch((err) => {
      console.error("API error:", err);
      mood = "neutral";
    });
}

