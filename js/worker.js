importScripts("https://d3js.org/d3.v6.min.js");

onmessage = (event) => {

    createSimulation = () => {
        // Define scales
        let radiusScale = d3.scalePow()
            .domain([event.data.args.rscaleDomainMin, event.data.args.rscaleDomainMax])
            .range([event.data.args.rscaleRangeMin, event.data.args.rscaleRangeMax]);
        paddingScale = (size) => {return size == 1 ? 0 : event.data.args.paddingScaleR};

        // Create simulation
        let simulation = d3.forceSimulation(event.data.nodes)
            // .force("x", d3.forceX(0).strength(.4))
            .force("y", d3.forceY(0).strength(.3))
            .force("collide", d3.forceCollide().radius(d => radiusScale(d.size) + paddingScale(d.size)))
            .force("link", d3.forceLink().links(event.data.links).id(d => d.conference))
            .stop();

        // Tick messages
        for (
            let i = 0, 
            n = Math.ceil(Math.log(simulation.alphaMin()) 
                / Math.log(1 - simulation.alphaDecay()));
            i < n; 
            ++i
        ) {
            simulation.tick();
        };
    }

    // Create arrays of fetch() and keys
    let fetches = [];
    let keys = [];
    for (let i = 0; i < event.data.nodes.length; i++) {
        for (let j = 0; j < event.data.nodes[i].teams.length; j++) {
            let name = event.data.nodes[i].teams[j].img_name;
            fetches.push(fetch(`../img/teams/${name}.svg`));
            keys.push(name);
        };
    };

    // Fulfill promises and post message
    Promise.all(fetches)
        .then((responses) => {
            return Promise.all(responses.map(res => res.text()))  
        })
        .then((data) => {

            // Run simulation
            createSimulation();

            // Create object that maps name to SVG content
            obj = {};
            keys.forEach((e, i) => {
                obj[e] = data[i];
            })
            
            // Post message back
            postMessage({
                nodes: event.data.nodes, 
                links: event.data.links,
                images: obj,
            });
        });
};