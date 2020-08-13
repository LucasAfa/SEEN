import React, { Component } from 'react'
import './Graph.css'
import apis from '../../api/index';
import contextMenuFactory from 'd3-context-menu';
let d3contextMenuLib = require('../../..//node_modules/d3-context-menu/js/d3-context-menu')


// Importa o objeto que contem os macs;
const macMap = require('../../mac.json');
const logo = require('../../assets/001-wifi.png')

const _ = require('lodash')
const d3 = require('d3');

const Img =[
    { 
        title: "Not registered",
        i:0,
        url: "https://github.com/favicon.ico",
        id: "url(#ImgPattern0)",
        x: 32,
        y: 32,
        action: function() {}


    }, 
    { 
        title: "AP",
        i:1,
        url: "https://raw.githubusercontent.com/LucasAfa/SEEN/master/seen/src/assets/001-wifi.ico",
        id: "url(#ImgPattern1)",
        x: 30,
        y: 30,
        action: function() {}

    },
    { 
        title: "Lamp",
        i:2,
        url: "data:image/png;base64,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",
        id: "url(#ImgPattern2)",
        x: 30,
        y: 30,
        action: function() {}

    },
    {
        title: "Thermostat",
        i:3,
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9btUUqgnYQcchQnSyISnHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi5Oik6CIl/i8ptIjx4Lgf7+497t4B/kaFqWbXBKBqlpFOJoRsblUIviKEHgwgjqDETH1OFFPwHF/38PH1LsazvM/9OfqUvMkAn0A8y3TDIt4gjm9aOud94ggrSQrxOfG4QRckfuS67PIb56LDfp4ZMTLpeeIIsVDsYLmDWclQiaeJo4qqUb4/67LCeYuzWqmx1j35C8N5bWWZ6zRHkMQiliBCgIwayqjAQoxWjRQTadpPePiHHb9ILplcZTByLKAKFZLjB/+D392ahalJNymcALpfbPtjFAjuAs26bX8f23bzBAg8A1da219tADOfpNfbWvQI6N8GLq7bmrwHXO4AQ0+6ZEiOFKDpLxSA9zP6phwweAv0rrm9tfZx+gBkqKvUDXBwCIwVKXvd492hzt7+PdPq7wdSoHKaGfbB5wAAAAZiS0dEAMAAwADAGp0HVAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+QIBhI5N/2BuIIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAACtUlEQVR42u3dWXLDIBAE0KErB9PROVp+UkllccwySzeyv50AT8NoJCHTbODTe7cTP9d1TX0fdtfPrJSZtcHvHRZcC1ITWCd5rUndcRouS81F1gHBtSN1r8jalJqOLN3g2pdawVL0cpFaxNLy8pLqvbedP76VlJm9vTL6eEw0r390vJSZ4ciL5Aip3TrLKyNISH1g7QQXm1eclE8Fz+MVKvWFtZm5GLyipb5FlnSmT5D6OQ1Fk1eOlPNdB86To2PBCN86M99rv8XxIYNzUhBK/Y21n+lzvJKlHkYW/5kxX+q/acicvEqknuQsTq8qqecJnmo+XtdVKDV0NiSpVNMqz9TSIWKQDFKjWLXJi0RqIrKqvKguoZB2cBaG7ftsJhUr2YtNyvLXOgwSEEqtYCVcOXJKLUZWqBet1Po0DKrsmaWscH3WbxdyKTNrtVczn63zVJ5RkeWVvCSkdiOLp8jOuTsClY4ydABa3a1tGoqdrmoUul3PPzwQHUBJIENxGFUpUu8Ni8KTCbTGU1umQGhU5QUdVOYLwxPM2JzlNUKSZ733fUeaDsvrGpvkgRj4pXi8ICFF4gUVKQYvvTWlhV5QHEmVl2rpUOIl/NJAvhekD3Vyo9CVym/6hPcN0zqA8o66XCS7LGSOxfKS8rqpEO0FkpiS8ALP7OP3AomUhBd4pPi9MNV8zkma1gvJDQ9CcHqBUIrWC5xSnF5PVv4xLIp1DI3AV+hIlg87PjTcHNHDyCJcaF3eJY0n0iQpDHHHkHltyNoAISRV7gUtqVovyEkVejXHt2fyFwYlnx+hK5UfX633LiqVX+I3nsPL79UOkEpLYaf9tnKo12lrSkNT/pm/Bx+Uwo7daSDC6+Q9LNy9Dt8dxfeBxfmbFDl63WKvsOytZG6+8dUE1mv/uVGs186Gx1bwocf+HQ/Oun/7TIFbAAAAAElFTkSuQmCC",
        id: "url(#ImgPattern3)",
        x: 30,
        y: 30,
        action: function() {}
    }
    
]

const WIDTH = 1920 * 0.95;
const HEIGHT = 1080 * 0.95;

const colorMapping = {
    "Blocked": "red",
    "PBlocked": "salmon",
    "Vulnerable": "yellow",
    "Suspect": "dimgray",
    "Cloned": "darkgreen"
};

// default max opacity = 5min = 300s = 300000ms (JS default result)
// Funcao que diminui a opacidade a partir do relative, que está em segundos;
// O node nao fica opaco se a diferenca do tempo for menor que a metade do relative
// Fica parcialmente opaco se a diferenca estiver entre a metade de relative e relative
function opacityByTime(timestamp, relative=300) {
    let now = new Date();
    let elapsed = now - timestamp;
    elapsed /= 1000; // milliseconds to seconds
    if(elapsed > relative) {
        return 0.3;
    }
    if(elapsed <= relative / 2) {
        return 1;
    } else if(elapsed > relative / 2) {
        return 0.6;
    }
}

// Transform the AP scheme in the DB into D3 force format;
function toData(data) {
    let links = [];
    let nodes = [];
    let i = 0;
    let aux;
    let distlink = 0;
    let wifiop = true;

    data.forEach((Ap) => {
        if (Ap.devices != null) {
            nodes.push({
                id: i,
                isAp: true,
                parent: null,
                mac: Ap.mac,
                radius: 35,
                color: '263238',
                status: 'Normal',
                prevStatus: '',
                underAttack: false,
                img: Img.find(d => d.title === 'AP')

            })
            aux = i;
            i += 1;
            
            Ap.devices.forEach((assoc) => {
            distlink =240;
             if(Math.random()<0.5){
                 distlink = 120;
            }
            wifiop = true
            if(Math.random()<0.5){
                wifiop = false;
           }
            console.log(assoc.dispositiveType === undefined? "Not registered" : assoc.dispositiveType);
            console.log("foi");
                nodes.push({
                    id: i,
                    isAp: false,
                    parent: aux,
                    mac: assoc.mac,
                    radius: 30,
                    color: '001484',
                    status: 'Normal',
                    prevStatus: '',
                    underAttack: false,
                    img: ((Img.find(d => d.title === (assoc.dispositiveType === undefined? "Not registered" : assoc.dispositiveType))) === undefined? Img.find(d => d.title === 'Not registered') : (Img.find(d => d.title === (assoc.dispositiveType === undefined? "Not registered" : assoc.dispositiveType)))),
                    type: assoc.dispositiveType
                })

                links.push({ // Sintaxe utilizada pelo d3 para criar as arestas
                    source: i,
                    target: aux,
                    distance: distlink,
                    wifi : wifiop
                })
                i += 1;
            })
        }
    })

    return { nodes, links };
} 

// Pop-up window for the nodes
var myTool = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", "0")
    .style("display", "none");


class Graph extends Component {

    state = {
        Aps: [],
        Nodes: [],
        Links: [],
        Events: [],
        isFetching: false
    }

    componentDidMount() {
        apis.getAllAps()
        .then(res => {
            let data = toData(res.data);

            this.setState({ Aps: res.data, Nodes: data.nodes, Links: data.links });
            this.makeGraph();
        })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }
    
    makeGraph() {
        // var data = toData(this.state.Aps);
        // var nodes = data.nodes;
        // var links = data.links;
        console.log(Math.random);
        var nodes = this.state.Nodes;
        var links = this.state.Links;

        var canvas = d3.select(this.refs.canvas)
            .append('svg')
            .attr('width', '80vw')
            .attr('height', '82vh')
            .call(d3.zoom()
                .extent([[0, 0], [WIDTH, HEIGHT]])
                .scaleExtent([1, 8])
                .on("zoom", function () {
                link.attr("transform", d3.event.transform)
                node.attr("transform", d3.event.transform)
            }))
            .style('border', '1px solid black')

        var simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).links(links).distance(d => d.distance))
            .force("charge", d3.forceManyBody().strength(-1000))
            .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on('tick', ticked);

        var link = d3.select('svg').append('g')
            .attr('class', 'links')
            .selectAll('line');

        var node = d3.select('svg').append('g')
            .attr('class', 'nodes')
            .selectAll('circle');

            
        var defs = d3.select('svg').append("defs")

            /*
            var ImgPattern3  = [
                ImgPattern = defs.append("pattern")
            .attr("id", "ImgPattern1")
            .attr("height", 1)
            .attr("width", 1)
            .attr("x", "0")
            .attr("y", "0"),
            ] */
           
            

        updateGraph(this.state.Nodes, this.state.Links)

        // Função necessaria para inicializar a simulacao
        function ticked() {
            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })

            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
        }

        function updateGraph(Nodes, Links) {
            // let data = toData(Aps);
            // let nodes = data.nodes;
            // let links = data.links;
            // console.log(Aps);
            // console.log(nodes);
            // console.log(links);

            let nodes = Nodes;
            let links = Links;

            node = node.data(nodes, d => d.id);
            node.exit().remove();

            
           

            nodes.forEach(function(d,i){
                var defs1 = d3.select('svg').append("defs");
                var ImgPattern = defs1.append("pattern")
                .attr("id", "ImgPattern"+d.img.i)
                .attr("width", 1)
                .attr("height", 1)
                .attr("x", "0")
                .attr("y", "0");
                
                ImgPattern.append("image")
                .attr("x", d.img.x/2)
                .attr("y",d.img.y/2)
                .attr("width", d.img.x)
                .attr("height", d.img.y)
                .attr("href", d.img.url)
                var menu = [
                    {
                        title: 'Choose type of dispositive',
                        children: [
                            {
                                title: 'Standards Types',
                                children: Img
                                
                            }
                        ]
                    },{
                        title: 'Choose Ban Status',
                        children: [
                            {
                                title: 'Ban',
                                action: function() {}
                            },
                            {
                                title: 'UnBan',
                                action: function() {}
                            },
                        ]
                    },
                ];
                
                node = node.enter()
                   .append('circle')
                    .attr('r', d => d.radius)
                    .style('fill', "grey")
                    .style('fill', d => d.img.id)
                    .style("stroke", d => d.color)
                    .attr('stroke-width', 5)
                    .on("mouseover", function (d) {  
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .style("cursor", "pointer")
                            .attr("width", 60)
                        myTool.transition()
                            .duration(500)
                            .style('opacity', '1')
                            .style('display', 'block');
    
                        myTool
                            .html(
                                "<div id ='teste' >Mac: " + d.mac + 
                                "<br>Manufacturer: " + (macMap[d.mac.substring(0, 8)] === undefined ? "Not found." : macMap[d.mac.substring(0, 8)]) + // Se o MAC por algum motivo nao existir, vai exibir o Not found;
                                "<br>Type: " + (d.type === undefined? "Not registered" : d.type) +
                                "<br>Status: " + d.status + "</div>"
                            )
                            .style("left", (d3.event.pageX - 90) + "px")
                            .style("top", (d3.event.pageY - 90) + "px")
                    })
                    .on("mouseout", function (d) {  //Mouse event
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .style("cursor", "normal")
                            .attr("width", 40)
                        myTool
                            .transition()  //Opacity transition when the tooltip disappears
                            .duration(500)
                            .style("opacity", "0")
                            .style("display", "none")  //The tooltip disappears
                    }).on('contextmenu', d3contextMenuLib(menu)) // attach menu to element
                    .on("click", function(d){
                        // TODO MODIFI IN THE CONEXT MENU
                        apis.editdevice({"_id":"5e8df6e041f17b070e267989","dmac":"C4:6A:B7:88:AA:44","manufacturer":"Xiaomi","dispositiveType":"Thermostatt","mac":"FF:FF:FF:FF:FF:F8"})
                    })                    
                    .merge(node);
    
            }) 
            


            link = link.data(links);
            link.exit().remove();           
                link = link.enter()
                .append('line')
                .attr('stroke-width', 3)
                .style('stroke', '#001484')
                .attr("stroke-dasharray", function(d) { 
                    return (d.wifi===true) ? "6,6" : "1,0"; })
                .merge(link);
            
            

            simulation.nodes(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).links(links).distance(d => d.distance))
                .force("charge", d3.forceManyBody().strength(-1000))
                .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
            
            simulation.alpha(1).restart();


        }

        // Vai ficar verificando os aps a cada 5 segundos. e se for diferente
        // vai reiniciar a pagina. Isso esta sendo feito pois o d3 force bugava se tentasse alterar os nodes diretamente.
        var fetchAps = setInterval(() => {
            this.setState({ ...this.state, isFetching: true });
            apis.getAllAps()
                .then(res => {

                    this.setState({ ...this.state, isFetching: false, })
                    let newData = res.data
                    console.log(newData);
                    if (!_.isEqual(newData, this.state.Aps)) {
                        let data = toData(res.data);
                        this.setState({ ...this.state, Aps: res.data, Nodes: data.nodes, Links: data.links })
                        window.location.reload();
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.setState({ ...this.state, isFetching: false });
                });
        }, 5000)

        // Vai ficar verificando os eventos para alterar a cor de algum no a partir do evento
        var fetchEvents = setInterval(() => {
            this.setState({ ...this.state, isFetching: true });
            apis.getAllEvents()
                .then(res => {

                    this.setState({ ...this.state, isFetching: false, })

                    let newData = res.data
                    if (!_.isEqual(newData, this.state.Events)) {
                        this.setState({ ...this.state, Events: res.data })
                        updateNode(this.state.Events);
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.setState({ ...this.state, isFetching: false });
                });
        }, 1000)

        // Funcao para alterar a cor do node
        // E tambem adicionar opacidade com uma diferenca do tempo
        // A timestamp ainda tem que ser implementada no schema do AP e Device;
        function updateNode(Events) {
            // Updating nodes in d3
            Events.forEach(event => {
                node.filter(d => d.mac === event.targetAddrMac)
                .style('stroke', d => {
                    if(event.eventType === 'Normal') {
                        if(d.isAp) {
                            return '#263238'
                        } else {
                            return 'blue'
                        }
                    } else {
                        let c = d3.color(colorMapping[event.eventType]);
                        // let stubTime = new Date("2020-03-20T20:26:07.592Z");
                        // // let time = d.time;
                        // c.opacity = opacityByTime(stubTime);
                        return c;
                        // return colorMapping[event.eventType]
                    }
                });
                nodes.find(d => d.mac === event.targetAddrMac).status = event.eventType;
            })
        }

    }

    render() {
        return (
            <div className='graphCanvas'>
                <div ref='canvas'></div>
            </div>
        )
    }
}

export default Graph