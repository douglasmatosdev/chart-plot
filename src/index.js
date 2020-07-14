// AUTHOR: Douglas Matos da Silva
// DEVELOPMENT PERIOD: November 2018 and December 2018.
// TIME OF EXPENDITURE: 10 days.
// ***** APP DESCRIPTION ***** //
/* The App is able to plot graphics according to user input.
The data entered by the user must be in JSON. */


import React from 'react'; // React default library
import ReactDOM from 'react-dom'; // React default library

import { Resize, ResizeVertical } from "react-resize-layout"; // this resize library needed to resize window.

import {UnControlled as CodeMirror} from 'react-codemirror2' // Code editor needed to pass command to graphic

import 'codemirror/lib/codemirror.css'; // Code mirror styles.
import 'codemirror/theme/material.css'; // Code mirror styles.

import './index.css'; // CSS do App

import "react-vis/dist/style.css"; // CSS to modify graphic style
import "react-vis/dist/styles/legends.scss"; // Same for graphic. But only graphics legends will be modified.

import ShowPopUp from "./popups/ShowPopUp.js"; //needed to show the popup

import //graphic components
{
	XYPlot, 
	XAxis,
	//YAxis,
	HorizontalGridLines,
	//LineSeries,
	VerticalGridLines,
	DiscreteColorLegend,
	LineMarkSeries
}
from 'react-vis';

require('codemirror/mode/javascript/javascript'); // Javascript style code editor.

//  All variables here
const dmsAuthorName="Douglas Matos";
const dmsAppTitle = dmsAuthorName+"'s Challenge";
const dmsWellcome="//"+dmsAuthorName+ " react @ console.\n//Type data to plot required result.";
const dmsWarningMsg = "Waiting for input data...";

// função para gerar texto aleatório
function dmsgenerateRamdomText(){
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	let text="";
	let i;

	for (i = 0; i < 5; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

// CSS animation loader
class AnimeLoader extends React.Component {
	render() {
		return <div className="loader"></div>
	}
}

// Class responsible for rendering the button to submit or generate popup if necessary.
class DMSFooter extends React.Component {
	constructor(props) {
		super(props);
		this.dmsgenerateGraph=this.dmsgenerateGraph.bind(this);
	}

	// teste

	render() {
		const showPopup = this.props.dmsGraphicCode; // The constant receives the current state of the console.
		let button;

		if(showPopup) { // // If the console is unchanged.
			button = <button className="dms_generateChartBtn" onClick={this.dmsgenerateGraph}>Generate chart</button>;

		}else { // If the console is changed.
			button = <ShowPopUp />;

		}
		return (
			<div> {button} </div>
		); 
	}
	
	/* Method responsible for receiving, handling and passing data
	that was entered by the user on the console. */ 
	dmsgenerateGraph() {
		var x=JSON.parse(this.props.dmsGraphicCode); // assigning the variable the console data
		//console.log(this.props.dmsGraphicCode);

		var x_tmp = { // Object that stores the data in an organized way.
			type: "Untitled",
			os: "Untitled",
			browser: "Untitled",
			min_response_time: "Untitled",
			max_response_time: "Untitled",
			titlex: "Untitled X",
			titley: "Untitled Y",
			gridx: false,
			gridy: false,
			data:[],
		}

		// Assigning each received data to the attributes of the created object.
		if (x.title)
			x_tmp.title=x.title;

		if (x.titlex)
			x_tmp.titlex=x.titlex;

		if (x.titley)
			x_tmp.titley=x.titley;

		if (x.gridx)
			x_tmp.gridx=x.gridx;

		if (x.gridy)
			x_tmp.gridy=x.gridy;

		if (x.data) { // Traversing the array and inserting into the dmsdata variable the data already organized.
			x.data.forEach(dmsdata=>{
				x_tmp.data.push(dmsdata)
			})

			document.dmsApp.setState({
				dmsgraphics: x_tmp, // Assigning the value of the attribute with the received data.
				dmsStart: true // Set to true the rendering of the chart.
			});
		}
	}
}

/* This is the main class, responsible for rendering 
the console, graph and divs resizable */
class DMSApp extends React.Component {
	constructor(props) {
		super(props);
		this.dmsMapLegendData=this.dmsMapLegendData.bind(this);
		this.dmsParseFloat=this.dmsParseFloat.bind(this);
		this.state = { // Initializing class state
			dmsStart:false,
			dmsgraphics:[],
			dmsGraphicCode: null
		}
	}
	
	// Only method to transform into float
	dmsParseFloat(dmsdata){
		if (dmsdata) {
			let K=[];
			dmsdata.forEach(P => {
				K.push({
					x:parseFloat(P.x),
					y:parseFloat(P.y)
				})
			});
			return K;
		}
		return null;
	}

	// Method to generate a lateral legend with the data referring to the graph.
	dmsMapLegendData(dmsdata){
		
		if (dmsdata){
			let K=[];
			dmsdata.forEach( P => { // Getting some data and inserting in object attributes
					K.push({
						title: P.os + " " + P.browser + " min_response_time "  ,
						color: P.color,
						disabled: false
					},
					{
						title: P.os + " " + P.browser + " max_response_time "  ,
						color: P.color,
						disabled: false
					})
				});

			return K;
		}
		return null;
	}

	render() { // Rendering the app view according to the ternary operation.
		return (
			<div className="dmsAppGraphContent">
			
				<div className="dmsGraphTitle"><p>{dmsAppTitle}</p></div>
				<div className="dmsGraphContent">
					<Resize handleWidth="10px" handleColor="#bebebe" onResizeMove={this.teste}>
						<ResizeVertical id="dmscodeHandle" height="200px" minHeight="100px" ref={(dmsHandleCodeMirror) => {document.dmsHandleCodeMirror = dmsHandleCodeMirror}}>
							<CodeMirror id="dmscode" ref={(dmsCodeMirror) => {document.dmsCodeMirror = dmsCodeMirror}}
								value={dmsWellcome}
								options={
									{
										mode: 'javascript',
										theme: 'material',
										lineNumbers: true,
									}
								}
								onChange=
								{
									(editor, data, value) =>
									{
										this.setState(
											{
												dmsGraphicCode: value
											}
										);
									}
								}
							/>

						</ResizeVertical>
						<ResizeVertical height="200px" minHeight="100px">
						{this.state.dmsStart?
							<div className="dmsPlot">
								<XYPlot
									width={window.innerWidth - 300}
									height={200}>
									<XAxis
											title={this.state.dmsgraphics.titlex}
											style={
												{
													line:
													{
														stroke: '#ADDDE1'
													},
													ticks:
													{
														  stroke: '#ADDDE1'
													},
													text: 
													{
														stroke: 'none',
														fill: '#6b6b76',
														fontWeight: 800
													}
												}
											}
									/>
									
									{this.state.dmsgraphics.gridx?<HorizontalGridLines />:null}
									{this.state.dmsgraphics.gridy?<VerticalGridLines />:null}
									{this.state.dmsgraphics.data.map(dmsdata =>{
										return (
											 <LineMarkSeries
												key={dmsgenerateRamdomText()}
												style={{
												strokeWidth: '3px'
												}}
												color={dmsdata.color}
												data={this.dmsParseFloat(dmsdata.dmsvalues)}	
											/>
										);
									})}
								</XYPlot>
								<DiscreteColorLegend
									className="dmsLegend"
									height={200}
									width={300}
									items={this.dmsMapLegendData(this.state.dmsgraphics.data)}
								/>
							</div>:
							<div>
							<p>
								{dmsWarningMsg}
							</p>
								<AnimeLoader ref={(animeLoader) =>document.animeLoader=animeLoader} /></div>}
  						</ResizeVertical>
    				</Resize>
				</div>
				<div className="dmsGraphFooter">
					<DMSFooter dmsGraphicCode={this.state.dmsGraphicCode} />
				</div>
    		</div>
		);
	}
}

ReactDOM.render(
	<DMSApp ref={(dmsApp) => document.dmsApp=dmsApp}/>,
	document.getElementById('dms_graphic')
);