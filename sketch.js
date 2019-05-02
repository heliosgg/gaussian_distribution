let screenSize = { w: 580, h: 580 };
let gNodeRadius = 15;
let gPartOfSpeed = 0.1;
let gDots = [];
let gCountsY = [];
let gCountsX = [];

function setup()
{
    createCanvas(screenSize.w, screenSize.h);
    frameRate(960);

    for(let i = 0; i < screenSize.w; i++)
    {
        gCountsY.push(0);
        gCountsX.push(0);
    }
}

function draw()
{
    background(255);

    gDots.push({ x : normalDistRandom(0, 1, 1) * screenSize.w, y : normalDistRandom(0, 1, 1) * screenSize.h})
    
    stroke('purple');
    strokeWeight(2);
    gDots.forEach(d => { point(d.x, d.y);
        gCountsY[Math.floor(d.x)]++; gCountsX[Math.floor(d.y)]++; });

    let sumY = gCountsY.reduce((total, num) => { return total + num; });
    let sumX = gCountsX.reduce((total, num) => { return total + num; });

    strokeWeight(1);

    stroke('green');
    fill('lightGreen');
    beginShape();
    vertex(0, 0);
    for(let i = 0; i < gCountsY.length; i+=1)
    {
        vertex(i, 20 * screenSize.h * gCountsY[i] / sumY);
    }
    vertex(screenSize.w, 0);
    endShape();

// **************************************************************

    stroke('red');
    fill('pink');
    beginShape();
    vertex(0, 0);
    for(let i = 0; i < gCountsX.length; i+=1)
    {
        vertex(20 * screenSize.w * gCountsX[i] / sumX, i);
    }
    vertex(0, screenSize.h);
    endShape();

    stroke(0);
    noFill();
    rect(0, 0, screenSize.w, screenSize.h);
}

function normalDistRandom(min, max, skew) {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}