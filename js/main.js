//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// DIMENSIONS ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

// svg dimensions
let width = 1500,
    height = 1000;

// size of icon
let nodeRadius = 30,
    nodeRadiusPadding = 2;

// size of arrow head
let arrowSize = 5;

// size of conference circle
let conferenceCircleMin = nodeRadius * 1.5,
    conferenceCircleMax = height / 12,
    conferenceCirclePadding = nodeRadius * 1.3;

let svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svg");

let visual = svg
    .append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

let linksGroup = visual 
    .append("g")
        .classed("game-links", true);

let conferenceSuck = linksGroup 
    .append("g")
        .classed("circle-of-suck", true);

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// TOOLTIP /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

// size of tooltips
let tooltipRadius = 10, // must match css .tooltip
    tooltipPadding = tooltipRadius,
    tooltipNodeImgHeight = 80,
    tooltipLinkHeightColor = 50;

let tooltipNode = d3.select("#tooltip-team");
let tooltipLink = d3.select("#tooltip-game");

rounded_rect = (w, h, r, tl, tr, bl, br) => {

    var topright = tr ? `a${r},${r} 0 0 1 ${r},${r}` : `h${r} v${r}`,
        bottomright = br ? `a${r},${r} 0 0 1 ${-r},${r}` : `v${r} h${-r}`,
        bottomleft = bl ? `a${r},${r} 0 0 1 ${-r},${-r}` : `h${-r} v${-r}`,
        topleft = tl ? `a${r},${r} 0 0 1 ${r},${-r}` : `v${-r} h${r}`;
    
    return [
        `M${r},0`,
        `h${w - 2*r}`,
        topright,
        `v${h - 2*r}`,
        bottomright,
        `h${2*r - w}`,
        bottomleft,
        `v${2*r - h}`,
        topleft,
        "z",
    ].join(" ")

};

let tooltipLinkWidth = parseFloat(tooltipLink.style("width"));

let tooltipLinkBanner = tooltipLink.select("#tooltip-game-banner")
    .append("svg")
        .attr("width", tooltipLinkWidth)
        .attr("height", tooltipLinkHeightColor);

tooltipLinkBanner
    .append("path")
        .attr("d", rounded_rect(tooltipLinkWidth / 2, tooltipLinkHeightColor, tooltipRadius, true, false, false, false))
        .attr("id", "tooltip-game-away-primary");

tooltipLinkBanner
    .append("path")
        .attr("d", rounded_rect(tooltipLinkWidth / 2, tooltipLinkHeightColor, tooltipRadius, false, true, false, false))
        .attr("transform", `translate(${tooltipLinkWidth / 2},0)`)
        .attr("id", "tooltip-game-home-primary");

tooltipLinkBanner
    .append("path")
        .attr("d", [
            `M${(tooltipLinkWidth - tooltipRadius) / 2},0`,
            `l${tooltipRadius},0`,
            `l${-tooltipRadius},${tooltipLinkHeightColor}`,
            `l${-tooltipRadius},0`,
            "z",
        ].join(" "))
        .attr("id", "tooltip-game-away-secondary");

tooltipLinkBanner
    .append("path")
        .attr("d", [
            `M${(tooltipLinkWidth + tooltipRadius) / 2},0`,
            `l${tooltipRadius},0`,
            `l${-tooltipRadius},${tooltipLinkHeightColor}`,
            `l${-tooltipRadius},0`,
            "z",
        ].join(" "))
        .attr("id", "tooltip-game-home-secondary");

tooltipLinkBanner
    .append("image")
        .attr("x", tooltipPadding)
        .attr("y", tooltipLinkHeightColor*.2)
        .attr("height", tooltipLinkHeightColor * .6)
        .attr("viewBox", `0 0 ${tooltipLinkHeightColor * .6} ${tooltipLinkHeightColor * .6}`)
        .attr("id", "tooltip-game-banner-away-image");
    
tooltipLinkBanner
    .append("text")
        .attr("x", tooltipLinkHeightColor)
        .attr("y", tooltipLinkHeightColor*.5)
        .attr("id", "tooltip-game-banner-away-name");

tooltipLinkBanner
    .append("image")
        .attr("x", tooltipLinkWidth - tooltipPadding - tooltipLinkHeightColor * .6)
        .attr("y", tooltipLinkHeightColor*.2)
        .attr("height", tooltipLinkHeightColor * .6)
        .attr("viewBox", `0 0 ${tooltipLinkHeightColor * .6} ${tooltipLinkHeightColor * .6}`)
        .attr("id", "tooltip-game-banner-home-image");
    
tooltipLinkBanner
    .append("text")
        .attr("x", tooltipLinkWidth - tooltipLinkHeightColor)
        .attr("y", tooltipLinkHeightColor*.5)
        .attr("id", "tooltip-game-banner-home-name")
        .style("text-anchor", "end");

updateTooltipPosition = (e) => {
    // Update position
    let xPosition = e.pageX + tooltipPadding,
        yPosition = e.pageY + tooltipPadding;

    tooltipLink
        .style("left", `${xPosition}px`)
        .style("top", `${yPosition}px`);
};

linkMouseover = (e, d) => {

    updateTooltipPosition(e);

    // Update values
    tooltipLink.select("#tooltip-game-away-primary")
        .attr("fill", d.winner_side === "away" ? d.winner_primary_color : d.loser_primary_color);
    tooltipLink.select("#tooltip-game-away-secondary")
        .attr("fill", d.winner_side === "away" ? d.winner_secondary_color : d.loser_secondary_color);
    tooltipLink.select("#tooltip-game-home-primary")
        .attr("fill", d.winner_side === "home" ? d.winner_primary_color : d.loser_primary_color);
    tooltipLink.select("#tooltip-game-home-secondary")
        .attr("fill", d.winner_side === "home" ? d.winner_secondary_color : d.loser_secondary_color);

    tooltipLink.select("#tooltip-game-banner-away-image")
        .attr("xlink:href", `img/tooltip/${d.winner_side === "away" ? d.winner_team : d.loser_team}.svg`);
    tooltipLink.select("#tooltip-game-banner-away-name")
        .text(d.winner_side === "away" ? d.winner_team_clean : d.loser_team_clean);
    tooltipLink.select("#tooltip-game-banner-home-image")
        .attr("xlink:href", `img/tooltip/${d.winner_side === "home" ? d.winner_team : d.loser_team}.svg`);
    tooltipLink.select("#tooltip-game-banner-home-name")
        .text(d.winner_side === "home" ? d.winner_team_clean : d.loser_team_clean);

    tooltipLink.select("#tooltip-game-date")
        .text(d.date);
    tooltipLink.select("#tooltip-game-score-away")
        .text(d.winner_side === "away" ? d.winner_score : d.loser_score);
    tooltipLink.select("#tooltip-game-score-home")
        .text(d.winner_side === "home" ? d.winner_score : d.loser_score);
    
    // Make visible
    tooltipLink
        .classed("hidden", false);
    
};

linkMousemove = (e) => {
    updateTooltipPosition(e);
};

linkMouseout = () => {
    // Make visible
    tooltipLink
        .classed("hidden", true)
};

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// FILTERS /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

let defs = svg 
    .append("defs");

let pencilFilter = defs 
    .append("filter")
    .attr("id", "pencil");

pencilFilter
    .append("feTurbulence")
        .attr("type", "fractalNoise")
        .attr("baseFrequency", 0.5)
        .attr("numOctaves", 5)
        .attr("stitchTiles", "stitch")
        .attr("result", "f1");

pencilFilter
    .append("feColorMatrix")
        .attr("type", "matrix")
        .attr("values", "0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5")
        .attr("result", "f2");

pencilFilter
    .append("feComposite")
        .attr("operator", "in")
        .attr("in2", "f2b")
        .attr("in", "SourceGraphic")
        .attr("result", "f3");

pencilFilter
    .append("feTurbulence")
        .attr("type", "fractalNoise")
        .attr("baseFrequency", 1.2)
        .attr("numOctaves", 3)
        .attr("result", "noise");

pencilFilter
    .append("feDisplacementMap")
        .attr("xChannelSelector", "R")
        .attr("yChannelSelector", "G")
        .attr("scale", 2.5)
        .attr("in", "f3")
        .attr("result", "f4");

d3.json("data/ncaa.json")
    .then((data) => {

        //////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////// READ DATA ////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////

        validate = () => {

            let conferenceCount = 0;
            const conferencePositions = {
                0: {fx: width * .2, fy: height * .25},
                1: {fx: width * .4, fy: height * .25},
                2: {fx: width * .6, fy: height * .25},
                3: {fx: width * .8, fy: height * .25},
                4: {fx: width * .3, fy: height * .50},
                5: {fx: width * .5, fy: height * .50},
                6: {fx: width * .7, fy: height * .50},
                7: {fx: width * .2, fy: height * .75},
                8: {fx: width * .4, fy: height * .75},
                9: {fx: width * .6, fy: height * .75},
                10: {fx: width * .8, fy: height * .75},
            };

            // Convert data types (string or numeric)
            for(let i = 0; i < data.nodes.length; i++) { 

                data.nodes[i].conference = "" + data.nodes[i].conference;
                data.nodes[i].size = +data.nodes[i].size;
                data.nodes[i].fx = data.nodes[i].size > 1? conferencePositions[conferenceCount]["fx"] - width/2: null;
                data.nodes[i].fy = data.nodes[i].size > 1? conferencePositions[conferenceCount]["fy"] - height/2: null;
                conferenceCount = data.nodes[i].size > 1 ? conferenceCount + 1 : conferenceCount;
                
                for(let j = 0; j < data.nodes[i].teams.length; j++){
                    data.nodes[i].teams[j].conference = "" + data.nodes[i].teams[j].conference; 
                    data.nodes[i].teams[j].conferenceSize = data.nodes[i].size; 
                    data.nodes[i].teams[j].conference_index = data.nodes[i].teams[j].conference_index;
                    data.nodes[i].teams[j].img_name = "" + data.nodes[i].teams[j].img_name; 
                    data.nodes[i].teams[j].primary_color = "" + data.nodes[i].teams[j].primary_color; 
                    data.nodes[i].teams[j].secondary_color = "" + data.nodes[i].teams[j].secondary_color; 
                    data.nodes[i].teams[j].team = "" + data.nodes[i].teams[j].team; 
                }

            };

            for(let i = 0; i < data.links.length; i++) { 
                
                data.links[i].date = "" + data.links[i].date; 
                data.links[i].date_mdy = "" + data.links[i].date_mdy; 
                data.links[i].week = +data.links[i].week;

                data.links[i].loser_team = "" + data.links[i].loser_team; 
                data.links[i].loser_team_clean = "" + data.links[i].loser_team_clean; 
                data.links[i].loser_primary_color = "" + data.links[i].loser_primary_color; 
                data.links[i].loser_secondary_color = "" + data.links[i].loser_secondary_color; 
                data.links[i].loser_rank = +data.links[i].loser_rank; 
                data.links[i].loser_score = +data.links[i].loser_score; 
                data.links[i].loser_side = "" + data.links[i].loser_side; 
                data.links[i].loser_conference = "" + data.links[i].loser_conference; 
                data.links[i].loser_conference_index = +data.links[i].loser_conference_index; 
                data.links[i].loser_conference_size = +data.links[i].loser_conference_size; 
                
                data.links[i].winner_team = "" + data.links[i].winner_team; 
                data.links[i].winner_team_clean = "" + data.links[i].winner_team_clean; 
                data.links[i].winner_primary_color = "" + data.links[i].winner_primary_color; 
                data.links[i].winner_secondary_color = "" + data.links[i].winner_secondary_color; 
                data.links[i].winner_rank = +data.links[i].winner_rank; 
                data.links[i].winner_score = +data.links[i].winner_score; 
                data.links[i].winner_side = "" + data.links[i].winner_side; 
                data.links[i].winner_conference = "" + data.links[i].winner_conference; 
                data.links[i].winner_conference_index = +data.links[i].winner_conference_index; 
                data.links[i].winner_conference_size = +data.links[i].winner_conference_size; 

                data.links[i].source = data.links[i].loser_conference != "Other" ? data.links[i].loser_conference : data.links[i].loser_team_clean; 
                data.links[i].target = data.links[i].winner_conference != "Other" ? data.links[i].winner_conference : data.links[i].winner_team_clean; 

            };

        };

        validate();

        //////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////// SCALES ////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////

        let totalSize = d3.max(data.nodes, d => d.size);

        // radius of conference circle
        let radiusScale = d3.scalePow()
            .domain([1, totalSize])
            .range([conferenceCircleMin, conferenceCircleMax]);

        // padding for conference circle
        paddingScale = (size) => {return size === 1 ? 0 : conferenceCirclePadding};

        // polar to rectangular coordinates
        xOffset = (radius, theta) => { return radius * Math.cos(theta); };
        yOffset = (radius, theta) => { return radius * Math.sin(theta); };

        // polar coordinates for links with icon padding
        linkRadius = (conferenceSize) => Math.sqrt(Math.pow((radiusScale(conferenceSize), 2) - Math.pow((nodeRadius + nodeRadiusPadding) * Math.sqrt(2) / 2), 2))
  
        let args = {
            rscaleDomainMin: 1,
            rscaleDomainMax: totalSize,
            rscaleRangeMin: conferenceCircleMin,
            rscaleRangeMax: conferenceCircleMax,
            paddingScaleR: conferenceCirclePadding,
        };

        //////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////// PLACEMENT ///////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////

        // Use web worker to run simulation to determine placement
        var worker = new Worker("js/worker.js");

        worker.postMessage({
            nodes: data.nodes,
            links: data.links,
            args: args,
        });

        worker.onmessage = (event) => {
            return ended(event.data);
        };
          
        ended = (data) => {

            let curveSuck = d3.line().curve(d3.curveCatmullRom.alpha(1));
            let curveInner = d3.line().curve(d3.curveBasis);

            // Create conference group
            let conferences =  visual
                .append("g")
                    .classed("conferences", true)
                    .selectAll("g")
                    .data(data.nodes)
                    .enter()
                    .append("g")
                        .attr("id", d => d.conference)
                        .attr("transform", d => `translate(${d.x}, ${d.y})`);

            // Draw circle around each conference
            conferences
                .filter(d => d.size > 1)
                .append("g")
                    .classed("conference-circle", true)
                    .append("circle")
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("r", d => radiusScale(d.size) + paddingScale(d.size) * .9)
                        .attr("filter", "url(#pencil)");
            
            // Draw title for each conference
            let conferenceTitles = conferences 
                .filter(d => d.size > 1)
                .append("g")
                .classed("conference-title", true);

            conferenceTitles
                .append("path")
                    .classed("conference-title-path", true)
                    .classed("hidden", true)
                    .attr("d", d => `M${-radiusScale(d.size) - paddingScale(d.size)} 0 A${radiusScale(d.size) + paddingScale(d.size)} ${radiusScale(d.size) + paddingScale(d.size)}, 0, 1, 1,${radiusScale(d.size) + paddingScale(d.size)} 0`)
                    .attr("id", d => `conference-title-path-${d.conference}`);
            
            conferenceTitles
                .append("text")
                    .attr("filter", "url(#pencil)")
                    .classed("conference-title-text", true)
                    .append("textPath")
                        .attr("xlink:href", d => `#conference-title-path-${d.conference}`)
                        .attr("startOffset", "50%")
                        .text(d => d.conference);

            // Draw inner links
            conferenceSuck 
                .append("g")
                    .classed("circle-of-suck-links", true)
                    .selectAll("path")
                    .data(data.links)
                    .enter()
                    .filter(d => {return d.winner_conference != "Other"
                        && d.winner_conference === d.loser_conference
                        && (
                            d.winner_conference_index === d.loser_conference_index + 1
                            || (d.winner_conference_index === 0 && d.loser_conference_index === d.loser_conference_size - 1) 
                        )
                    })
                    .append("path")
                        .attr("filter", "url(#pencil)")
                        .classed("circle-of-suck-links-path", true)
                        .on("mouseover", linkMouseover)
                        .on("mousemove", linkMousemove)
                        .on("mouseout", linkMouseout)
                        .attr("d", d => { 

                            let radius = radiusScale(d.source.size) + paddingScale(d.source.size) * .6,
                                thetaOffset = Math.atan(nodeRadius / 2 / radius),
                                startTheta = 2 * Math.PI * d.loser_conference_index / d.source.size + thetaOffset,
                                midTheta = 2 * Math.PI * (d.loser_conference_index + 0.5) / d.source.size,
                                endTheta = 2 * Math.PI * d.winner_conference_index / d.target.size,
                                startX = d.source.x + xOffset(radius, startTheta),
                                startY = d.source.y + yOffset(radius, startTheta),
                                midX = d.source.x + xOffset(radius, midTheta),
                                midY = d.source.y + yOffset(radius, midTheta),
                                endX = d.target.x + xOffset(radius, endTheta),
                                endY = d.target.y + yOffset(radius, endTheta);

                            return curveSuck([
                                [startX, startY],
                                [midX, midY],
                                [endX, endY],
                            ])

                        });

            // Draw arrows
            conferenceSuck 
                .append("g")
                    .classed("circle-of-suck-arrow", true)
                    .selectAll("path")
                    .data(data.links)
                    .enter()
                    .filter(d => {return d.winner_conference != "Other"
                        && d.winner_conference === d.loser_conference
                        && (
                            d.winner_conference_index === d.loser_conference_index + 1
                            || (d.winner_conference_index === 0 && d.loser_conference_index === d.loser_conference_size - 1) 
                        )
                    })
                    .append("path")
                        .attr("filter", "url(#pencil)")
                        .classed("circle-of-suck-links-path", true)
                        .on("mouseover", linkMouseover)
                        .on("mousemove", linkMousemove)
                        .on("mouseout", linkMouseout)
                        .attr("d", d => { 

                            let radius = radiusScale(d.source.size) + paddingScale(d.source.size) * .6,
                                endTheta = 2 * Math.PI * d.winner_conference_index / d.target.size,
                                endX = d.target.x + xOffset(radius, endTheta),
                                endY = d.target.y + yOffset(radius, endTheta);

                            return ([
                                `M${endX + xOffset(arrowSize, endTheta - Math.PI * 2 / 3)},${endY + yOffset(arrowSize, endTheta - Math.PI * 2 / 3)}`,
                                `L${endX},${endY}`,
                                `L${endX + xOffset(arrowSize, endTheta - Math.PI / 3)},${endY + yOffset(arrowSize, endTheta - Math.PI / 3)}`
                            ]).join(" ")

                        });

            // Draw inner links
            let conferenceInnerLinks = linksGroup
                .append("g")
                    .classed("inner-conference-links", true)
                    .selectAll("path")
                    .data(data.links)
                    .enter()
                    .filter(d => {return d.winner_conference != "Other"
                        && d.winner_conference === d.loser_conference
                    }) 
                    .append("path")
                        .on("mouseover", linkMouseover)
                        .on("mousemove", linkMousemove)
                        .on("mouseout", linkMouseout)
                        .attr("d", d => { 
                            let startX = d.source.x + xOffset(radiusScale(d.source.size), 2 * Math.PI * d.loser_conference_index / d.source.size),
                                startY = d.source.y + yOffset(radiusScale(d.source.size), 2 * Math.PI * d.loser_conference_index / d.source.size),
                                midX = d.source.x + xOffset(radiusScale(d.source.size)*.5, 2 * Math.PI * (d.loser_conference_index + .5) / d.source.size),
                                midY = d.source.y + yOffset(radiusScale(d.source.size)*.5, 2 * Math.PI * (d.loser_conference_index + .5) / d.source.size),
                                endX = d.target.x + xOffset(radiusScale(d.target.size), 2 * Math.PI * d.winner_conference_index / d.target.size),
                                endY = d.target.y + yOffset(radiusScale(d.target.size), 2 * Math.PI * d.winner_conference_index / d.target.size);
                            return curveInner([
                                [startX, startY],
                                [midX, midY],
                                [endX, endY],
                            ])
                        });

            // Draw outer links
            let conferenceOuterLinks = linksGroup
                .append("g")
                    .classed("outer-conference-links", true)
                    .selectAll("path")
                    .data(data.links)
                    .enter()
                    .filter(d => d.winner_conference != d.loser_conference)
                    .append("path")
                        .classed("hidden", true)
                        .on("mouseover", linkMouseover)
                        .on("mousemove", linkMousemove)
                        .on("mouseout", linkMouseout)
                        .attr("d", d => { 
                            let startX = d.source.x + (d.loser_conference === "Other" ? 0 : xOffset(radiusScale(d.source.size), 2 * Math.PI * d.loser_conference_index / d.source.size)),
                                startY = d.source.y + (d.loser_conference === "Other" ? 0 : yOffset(radiusScale(d.source.size), 2 * Math.PI * d.loser_conference_index / d.source.size)),
                                midX = d.source.x + (d.loser_conference === "Other" ? 0 : xOffset(radiusScale(d.source.size)*.5, 2 * Math.PI * (d.loser_conference_index + .5) / d.source.size)),
                                midY = d.source.y + (d.loser_conference === "Other" ? 0 : yOffset(radiusScale(d.source.size)*.5, 2 * Math.PI * (d.loser_conference_index + .5) / d.source.size)),
                                endX = d.target.x + (d.winner_conference === "Other" ? 0 : xOffset(radiusScale(d.target.size), 2 * Math.PI * d.winner_conference_index / d.target.size)),
                                endY = d.target.y + (d.winner_conference === "Other" ? 0 : yOffset(radiusScale(d.target.size), 2 * Math.PI * d.winner_conference_index / d.target.size));
                            return curveInner([
                                [startX, startY],
                                [midX, midY],
                                [endX, endY],
                            ])
                        });

            // Draw nodes
            let conferenceNodes = conferences
                .append("g")
                    .classed("conference-node", true)
                    .attr("filter", "url(#pencil)")
                    .selectAll("g")
                    .data(d => d.teams)
                    .enter()
                    .append("g")  
                            .attr("id", d => `node-${d.img_name.replace(/[^A-Z0-9]/ig, "-")}`)
                            
                            .on("mouseover", (e, d) => {
    
                                // Update values
                                document.getElementById("tooltip-team-img").src = `img/tooltip/${d.img_name}.svg`;
                                tooltipNode.select("#tooltip-team-description-name")
                                    .text(d.team);
                                tooltipNode.select("#tooltip-team-description-conference")
                                    .text(d.conference != "Other" ? d.conference : "");
            
                                // Update position
                                let xPosition = e.pageX + tooltipPadding,
                                    yPosition = e.pageY + tooltipPadding;
            
                                tooltipNode 
                                    .style("left", `${xPosition}px`)
                                    .style("top", `${yPosition}px`)
                                    .style("background-color", d.primary_color);
                                
                                // Make visible
                                tooltipNode
                                    .classed("hidden", false)
                                    .attr("transform", "translate(50%,0)");
            
                                conferenceOuterLinks
                                    .filter(e => e.winner_team_clean === d.team)
                                    .classed("win", true)
                                    .classed("hidden", false);
                                conferenceOuterLinks
                                    .filter(e => e.loser_team_clean === d.team)
                                    .classed("lose", true)
                                    .classed("hidden", false);
                                conferenceInnerLinks
                                    .filter(e => e.winner_team_clean === d.team)
                                    .classed("win", true);
                                conferenceInnerLinks
                                    .filter(e => e.loser_team_clean === d.team)
                                    .classed("lose", true);
                                
                            })
                            .on("mousemove", () => {
                                // Get this bar's x/y values, then augment for the tooltip
                                let xPosition = window.event.pageX + tooltipPadding,
                                    yPosition = window.event.pageY + tooltipPadding;
            
                                // Update tooltip position and value
                                tooltipNode 
                                    .style("left", `${xPosition}px`)
                                    .style("top", `${yPosition}px`);
                            })
                            .on("mouseout", () => {
            
                                // Hide
                                tooltipNode
                                    .classed("hidden", true)
                                conferenceOuterLinks
                                    .classed("hidden", true)
                                conferenceInnerLinks
                                    .classed("win", false)
                                    .classed("lose", false)
                                
                            });

            for (key in data.images) {
                document.getElementById(`node-${key.replace(/[^A-Z0-9]/ig, "-")}`).innerHTML = data.images[key];
                d3.select(`#node-${key.replace(/[^A-Z0-9]/ig, "-")}`).select("svg")
                    .attr("height", nodeRadius)
                    .attr("width", nodeRadius)
                    .attr("x", d => {
                        return d.conference === "Other" ? 
                        - nodeRadius / 2 : 
                        xOffset(radiusScale(d.conferenceSize), 2 * Math.PI * d.conference_index / d.conferenceSize) - nodeRadius / 2
                    })
                    .attr("y", d => {
                        return d.conference === "Other" ? 
                        - nodeRadius / 2 : 
                        yOffset(radiusScale(d.conferenceSize), 2 * Math.PI * d.conference_index / d.conferenceSize) - nodeRadius / 2
                    })
                d3.select(`#node-${key.replace(/[^A-Z0-9]/ig, "-")}`).select("svg").select("title").remove();
            };

            worker.terminate();

        };
    })
    .catch((error) => {
        console.error("Error loading data")
        throw error;
    });
