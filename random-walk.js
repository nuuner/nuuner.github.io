const canvas = document.getElementById('walk');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

window.requestAnimationFrame(draw);

function agent(x, y, startingLife = 1000) {
  return {
    x: x,
    y: y,
    dead: false,
    life: startingLife,
    color: '0, 0, 0',
    group: null,
    update: function() {
      if (this.dead) return;
      if (this.life < 0) {
        this.dead = true;
        return;
      }
      this.life--;
      let dx = Math.floor(Math.random() * 7) - 3;
      let dy = Math.floor(Math.random() * 7) - 3;
      this.x += dx;
      this.y += dy;
    },
    draw: function() {
      if (this.dead) return;
      ctx.fillStyle = 'rgba(' + this.color + ', ' + (this.life / startingLife) + ')';
      ctx.fillRect(this.x, this.y, 1, 1);
    }
  }
}

let agents = [];

ctx.fillStyle = 'darkred';
ctx.fillRect(0, 0, width, height);

function summonSwarm() {
    for (let i = 0; i < 100; i++) {
      let antiAgent = agent(width / 2, height / 2);
      antiAgent.color = '0, 0, 0';
      agents.push(antiAgent);
    }
}

function drawLinesBetweenGroups(groupCenters) {
  for (let group in groupCenters) {
    for (let otherGroup in groupCenters) {
      if (group === otherGroup) continue;
      // first a wider darkred line
      ctx.strokeStyle = 'darkred';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(groupCenters[group].x, groupCenters[group].y);
      ctx.lineTo(groupCenters[otherGroup].x, groupCenters[otherGroup].y);
      ctx.stroke();
      // then a thinner black line
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(groupCenters[group].x, groupCenters[group].y);
      ctx.lineTo(groupCenters[otherGroup].x, groupCenters[otherGroup].y);
      ctx.stroke();
    }
  }
}

summonSwarm();

function draw() {
  for (let i = 0; i < agents.length; i++) {
    agents[i].update();
    agents[i].draw();
  }
  window.requestAnimationFrame(draw);
}
