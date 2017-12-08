#!/usr/bin/env node
"use strict"
var
  fs=require( "fs"),
  path= require( "path"),
  util= require( "util"),
  readdir= util.promisify( fs.readdir)

var
  inflight= 0,
  outputBuffer= []

function scan( target){
	outputBuffer.push( target)
	function recurse( files){
		--inflight
		for( var file of files){
			scan( path.join( target, file))
		}
	}
	function fail(){
		--inflight
	}
	readdir( target).then( recurse, fail)
	++inflight
}
process.on("unhandledRejection", ()=> null)

setInterval(function(){
	if( outputBuffer.length){
		console.log( outputBuffer.join("\n"))
		outputBuffer= []
	}
	if( inflight=== 0){
		process.exit(0)
	}
}, 500)

var target= process.argv[ 2]|| process.cwd()
scan( target)

