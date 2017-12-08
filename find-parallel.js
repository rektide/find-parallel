#!/usr/bin/env node
"use strict"
var
  fs=require( "fs"),
  path= require( "path")

var
  inflight= 0,
  outputBuffer= [],
  doOutput= process.env.OUTPUT!== "0"

function scan( target){
	++inflight
	doOutput&& outputBuffer.push( target)
	fs.readdir( target, function(err, files){
		--inflight
		if( !files){
			return
		}
		files.forEach(function( file){
			var next= path.join( target, file)
			fs.stat( next, function(err, stats){
				if( stats&& stats.isDirectory()){
					scan( next)
				}else{
					doOutput&& outputBuffer.push( next)
				}
			})
		})
	})
}
process.on("unhandledRejection", ()=> null)

setInterval(function(){
	console.error({inflight})
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

