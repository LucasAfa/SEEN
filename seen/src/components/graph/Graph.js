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
        url: "https://raw.githubusercontent.com/LucasAfa/SEEN/master/seen/src/assets/question.png",
        id: "url(#ImgPattern0)",
        x: 32,
        y: 32,
        action: function(d) {
            apis.editdevice({"dmac":d.mac,"dispositiveType":"Not registered","apmac":d.apmac})
        }


    }, 
    { 
        title: "AP",
        i:1,
        url: "https://raw.githubusercontent.com/LucasAfa/SEEN/master/seen/src/assets/001-wifi.ico",
        id: "url(#ImgPattern1)",
        x: 30,
        y: 30,
        action: function(d) {
            apis.editdevice({"dmac":d.mac,"dispositiveType":"AP","apmac":d.apmac})
        }

    },
    { 
        title: "Lamp",
        i:2,
        url: "https://raw.githubusercontent.com/LucasAfa/SEEN/master/seen/src/assets/lamp.png",
        id: "url(#ImgPattern2)",
        x: 30,
        y: 30,
        action: function(d) {
            apis.editdevice({"dmac":d.mac,"dispositiveType":"Lamp","apmac":d.apmac})
        }

    },
    {
        title: "Thermostat",
        i:3,
        url: "https://raw.githubusercontent.com/LucasAfa/SEEN/master/seen/src/assets/thermostat.png",
        id: "url(#ImgPattern3)",
        x: 30,
        y: 30,
        action: function(d) {
            apis.editdevice({"dmac":d.mac,"dispositiveType":"Thermostat","apmac":d.apmac})
        }
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
            distlink =120;
            // if(Math.random()<0.5){
              //   distlink = 120;
            //}
            //wifiop = true
           // if(Math.random()<0.5){
             //   wifiop = false;
           //}
           // console.log(assoc.dispositiveType === undefined? "Not registered" : assoc.dispositiveType);
            //console.log("foi");
                nodes.push({
                    id: i,
                    isAp: false,
                    parent: aux,
                    apmac: Ap.mac,
                    mac: assoc.mac,
                    radius: 30,
                    color: '001484',
                    status: 'Normal',
                    prevStatus: '',
                    underAttack: false,
                    img: (assoc.userdispositiveType === undefined? ((Img.find(d => d.title === (assoc.dispositiveType === undefined? "Not registered" : assoc.dispositiveType))) === undefined? Img.find(d => d.title === 'Not registered') : (Img.find(d => d.title === (assoc.dispositiveType === undefined? "Not registered" : assoc.dispositiveType)))):
                    ((Img.find(d => d.title === (assoc.userdispositiveType === undefined? "Not registered" : assoc.userdispositiveType))) === undefined? Img.find(d => d.title === 'Not registered') : (Img.find(d => d.title === (assoc.userdispositiveType === undefined? "Not registered" : assoc.userdispositiveType))))
                    ),
                    type: (assoc.userdispositiveType === undefined? assoc.dispositiveType : assoc.userdispositiveType)
                })

                links.push({ // Sintaxe utilizada pelo d3 para criar as arestas
                    source: i,
                    target: aux,
                    distance: distlink,
                    wifi : assoc.wireless === undefined? false : assoc.wireless
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
                //Pattern to image in circle
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

                //context menu
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
                                action: function(d) {
                                    apis.editdevice({"dmac":d.mac,"ban":true,"apmac":d.apmac})
                                }
                            },
                            {
                                title: 'UnBan',
                                action: function(d) {
                                    apis.editdevice({"dmac":d.mac,"ban":false,"apmac":d.apmac})
                                }
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