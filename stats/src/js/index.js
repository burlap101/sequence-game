import * as d3 from 'd3';

function myD3 (gamesObj) {
    let cols = Object.keys(gamesObj[0])
        .slice(1);
    cols.splice(cols.indexOf('board'), 1);
    cols.splice(cols.indexOf('finished'), 1);
    cols.splice(cols.indexOf('theWinner'), 1);
    cols.splice(cols.indexOf('winnerFound'), 1);
    let tbl = d3.select("#active-games");
    tbl.select("thead")
        .select("tr")
        .selectAll("th")
        .data(cols)
        .enter()
        .append("th")
        .text(function(d) { 
            let rexp = /([A-Z])/;
            let n = d.match(rexp);
            while (n != null) {
                d = d.slice(0,n.index) + " " + n[0].toLowerCase() + d.slice(n.index+1);
                n = d.match(rexp);
            }
            d = d.split(" ").map((s) => {
                s = s[0].toUpperCase() + s.slice(1);
                return s;
            }).join(" ");
            return d; 
        });
  
    tbl.select("tbody")
        .selectAll("tr")
        .data(gamesObj.filter(function(d) { 
            return (!Object.keys(d).includes("finished")); 
        }))
        .enter()
        .append("tr")
        .selectAll("td")
        .data(function(game) {
            let toPass = [];
            for (let col of cols) {
                if (col == 'players') {
                    let s = '';
                    for (let p of game.players) {
                        s = s + p.name + ', '
                    }
                    toPass.push(s.slice(0, s.length-2));
                } else if (col == "theWinner") {
                    let name = game.theWinner.name
                    if (name == undefined) {
                        toPass.push(' ');
                    } else {
                        toPass.push(game.theWinner.name);
                    }
                } else if ((col == "created") || (col == "finished")) {
                    if (game[col] != undefined) {
                        toPass.push(new Date(game[col]).toLocaleString('en-AU'));
                    } else {
                        toPass.push(" ");
                    }
                } else if (Object.keys(game).includes(col)) {
                    toPass.push(game[col]);
                } else {
                    toPass.push(' ');
                }
            }
            return toPass;
        })
        .enter()
        .append("td")
        .classed("py-2", true)
        .text(function (val) {
            return val;
        });
    let w = d3.select("#my-chart")
    // get the width of div element
        .style('width')
    // take off 'px'
        .slice(0, -2);
  
    let chartDims = {
        margin: 30,
        width: Number(w),
        height: 500
    };


    let myChart = d3.select("#my-chart")
        .append("svg")
        .attr("width", chartDims.width)
        .attr("height", chartDims.height)
        .append("g")
        .attr(
            "transform", 
            "translate(" + chartDims.margin + "," + chartDims.margin + ")"
        );
  
    chartDims.height -= 2*chartDims.margin;
    chartDims.width -= 2*chartDims.margin;
    for (let i =0; i < gamesObj.length; i++) {
        let tempcounts = 1;
        let date1 = new Date(gamesObj[i].created);
        for (let game2 of gamesObj) {
            let date2c = new Date(game2.created);
            let date2f = new Date('1-1-2999');
            if (Object.keys(game2).includes('finished')) {
                date2f = new Date(game2.finished);
            }
            // console.log("date1: " + date1 + " date2c: " + date2c + " date2f: " + date2f);
            if ((date2c < date1) && (date2f > date1)) {
                tempcounts += 1;
            }
        }
        gamesObj[i].activeGames = tempcounts;
    }

  
    let xAxis = d3.scaleTime()
        .domain([d3.min(gamesObj, function (d) { return new Date(d.created); }), new Date()])
        .range([0, chartDims.width]);
  
    myChart.append("g")
        .attr("transform", "translate(0," + chartDims.height + ")")
        .call(d3.axisBottom(xAxis));

    let yAxis = d3.scaleLinear()
        .domain([0, d3.max(gamesObj, function (d) { return d.activeGames; })])
        .range([chartDims.height, 0]);

    myChart.append("g")
        .call(d3.axisLeft(yAxis));
  
    // Add the line
    myChart.append("path")
        .datum(gamesObj)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(function (d) { return xAxis(new Date(d.created)) })
            .y(function (d) { return yAxis(d.activeGames) })
        )
}

const baseUrl = "http://" + window.location.hostname + ":50135";

fetch(baseUrl+"/api/game?gameid=all")
    .then((res) => {
        return res.json();
    })
    .then(function(resj) {
        myD3(resj);
    })


