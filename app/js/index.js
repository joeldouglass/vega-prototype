import $ from "jquery";
import { View, parse } from "vega";
import R from "ramda";
import csvParse from "csv-parse/lib/sync";
import csvStringify from "csv-stringify";

const tryParseJson = R.tryCatch(JSON.parse, R.always(null));

const $vegaInput = $("#vega-input");
const $dataInput = $("#data-input");

const initialState = loadState();

if(initialState){
  setTextBoxesFromState(initialState);
  drawVega(initialState);
}

function drawVega(state){

  const stateCopy = R.clone(state);
  const {vegaSpec, data} = stateCopy;

  if(!vegaSpec.width){
    vegaSpec.width = $("#viz-container").innerWidth();
  }
  if(!vegaSpec.height){
    vegaSpec.height = $("#viz-container").innerHeight();
  }
  if(!vegaSpec.autosize){
    vegaSpec.autosize = "fit";
  }
  if(data){
    vegaSpec.data = [
      {
        name: "table",
        values: data
      }
    ];
  }
console.log(vegaSpec);
  try{
    const view = new View(parse(vegaSpec))
      .renderer("canvas")
      .initialize("#js-mount")
      .hover()
      .run();
  }
  catch(e){
    console.log(e);
  }
}

function stateChange(){
  const state = parseNewState();
  storeState(state);
  drawVega(state);
  
  // pretty print the json
  setTextBoxesFromState(state);
}

function setTextBoxesFromState(state){
  if(state.vegaSpec){
    $vegaInput.val(JSON.stringify(state.vegaSpec, null, " "));
  }
  if(state.data){
    csvStringify(state.data, {header: true}, function(err, results){
      $dataInput.val(results);
    });
  }
}

function parseNewState(){
  return {
    vegaSpec: tryParseJson($vegaInput.val()),
    data: csvParse($dataInput.val(), {columns: true})
  };
}

function storeState(state){
  if(typeof(Storage) !== "undefined"){
    localStorage.appState = JSON.stringify(state);
  }
}

function loadState(){
  if(typeof(Storage) !== "undefined"){
    return tryParseJson(localStorage.appState);
  }
  return null;
}

$vegaInput.on("blur", stateChange);
$dataInput.on("blur", stateChange);
$(window).resize(stateChange);
