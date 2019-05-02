let screenSize = { w: 580, h: 580 },
    gDots,
    gCountsX,
    gCountsY,
    gHeight = 20,
    gStepDraw = 1,
    gSkewX = 1.0,
    gSkewY = 1.0;

function setup()
{
    createCanvas(screenSize.w, screenSize.h);
    frameRate(960);

    let interface = document.createElement('div');

    interface.innerHTML += '<div><nobr>Height: <div id="heightDiv">' + gHeight + '</div></nobr>' +
        '<input type="range" value="' + gHeight + '" min="10" max="100" step="5" oninput="heightChanged(this);"></div>';

    interface.innerHTML += '<div><nobr>Step draw: <div id="stepDiv">' + gStepDraw + '</div></nobr>' +
        '<input type="range" value="' + gStepDraw + '" min="1" max="10" step="1" oninput="stepChanged(this);"></div>';

    interface.innerHTML += '<div><nobr>Skew X: <div id="skewDivX">' + gSkewX + '</div></nobr>' +
        '<input type="range" value="' + gSkewX + '" min="0.1" max="2" step="0.1" oninput="skewDragedX(this);" onchange="skewChangedX(this)"></div>';

    interface.innerHTML += '<div><nobr>Skew Y: <div id="skewDivY">' + gSkewY + '</div></nobr>' +
        '<input type="range" value="' + gSkewY + '" min="0.1" max="2" step="0.1" oninput="skewDragedY(this);" onchange="skewChangedY(this)"></div>';

    document.getElementsByTagName('body')[0].appendChild(interface);
    
    clearHistory();
}

function draw()
{
    background(255);

// generate new point position
    gDots.push({ x : normalDistRandom(0, 1, gSkewX) * screenSize.w, y : normalDistRandom(0, 1, gSkewY) * screenSize.h})
    
// draw all points
    stroke('purple');
    strokeWeight(2);
    gDots.forEach(d => { point(d.x, d.y);
        gCountsY[Math.floor(d.x)]++; gCountsX[Math.floor(d.y)]++; });

// count points for columns and rows
    let sumX = gCountsX.reduce((total, num) => { return total + num; });
    let sumY = gCountsY.reduce((total, num) => { return total + num; });

    strokeWeight(1);

// draw red(left) distribution
    stroke('red');
    fill('pink');

    beginShape();
    curveVertex(0, 0);
    for(let i = 0; i < gCountsX.length; i += gStepDraw)
    {
        curveVertex(gHeight * screenSize.w * gCountsX[i] / sumX, i);
    }
    curveVertex(0, screenSize.h);
    endShape();

// draw green(upper) distribution
    stroke('green');
    fill('lightGreen');

    beginShape();
    curveVertex(0, 0);
    for(let i = 0; i < gCountsY.length; i += gStepDraw)
    {
        curveVertex(i, gHeight * screenSize.h * gCountsY[i] / sumY);
    }
    curveVertex(screenSize.w, 0);
    endShape();

// black stroke
    stroke(0);
    noFill();
    rect(0, 0, screenSize.w, screenSize.h);
}

function normalDistRandom(min, max, skew)
{
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

function heightChanged(slider)
{
    gHeight = parseInt(slider.value);
    heightDiv.innerHTML = gHeight;
}

function stepChanged(slider)
{
    gStepDraw = parseInt(slider.value);
    stepDiv.innerHTML = gStepDraw;
}

function skewDragedX(slider)
{
    skewDivX.innerHTML = slider.value;
}

function skewChangedX(slider)
{
    gSkewX = parseFloat(slider.value);
    clearHistory();
}

function skewDragedY(slider)
{
    skewDivY.innerHTML = slider.value;
}

function skewChangedY(slider)
{
    gSkewY = parseFloat(slider.value);
    clearHistory();
}

function clearHistory()
{
    gDots = [];
    gCountsX = [];
    gCountsY = [];

    for(let i = 0; i < screenSize.w; i++)
    {
        gCountsY.push(0);
        gCountsX.push(0);
    }
}