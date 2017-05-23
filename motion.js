//This is the javascript associated with the webpage 'charged-particle-beta.html'.
//Written by David Swarbrick, Manchester Grammar School, Nov 2015
//Continued by David Swarbrick, University of Cambridge, May 2017

var canvas = document.getElementById('canvas1');	//Find the canvas
canvas.width = 700;
canvas.height = 700;
var ctx = canvas.getContext('2d');			//Define the 2d context in the canvas to draw stuff on.
var canvasTenth = canvas.width/10;			//To ensure the field lines and markers are evenly spaced.
var raf;							//Used later for requestAnimationFrame();
var t = 0;						//t for time used later.
//Functions for the Magnetic Field Markers

function mFieldMarker (x,y){					//Defines a shape to represent the field.
	if(document.getElementById("mf-direction").checked){	//If the switch is on "out" then a circle is drawn
		ctx.beginPath();				//to show the field is out of the screen.
		ctx.arc(x,y,2,0,2*Math.PI);
		ctx.stroke();
		ctx.fillStyle= 'black';
		ctx.fill();
	} else {									//If the switch isn't on the field goes into the
		ctx.beginPath();				//screen so a cross is drawn.
		ctx.moveTo(x-3.5,y-3.5);
		ctx.lineTo(x+3.5,y+3.5);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(x+3.5,y-3.5);
		ctx.lineTo(x-3.5,y+3.5);
		ctx.stroke();
	};

}

function mfToggle(){								//Toggles the magnetic field.
	if(document.getElementById("mf-status").checked){			//If switch is "on"
		for (i=canvasTenth;i<canvas.width;i+=canvasTenth){		//Loops through creating mFieldMarkers at i,j
			for (j=canvasTenth;j<canvas.height;j+=canvasTenth){	// i is the row, j is the column
				mFieldMarker(i,j);
			}
		}
	}
}
function mfToggleDirection(){						//Called to toggle in/out of screen.
	mfToggle();							//Redraws them using mfToggle()
}

//Functions for the Electric Field Lines

function eFieldLine(x){							//Draws uniform field lines at x along
	ctx.beginPath();
	ctx.moveTo(x,0);
	ctx.lineTo(x,canvas.height);
	ctx.stroke();

	for (l=canvasTenth/2;l<canvas.height;l+=2*canvasTenth){		//Arrows every second space
		ctx.beginPath();
		ctx.moveTo(x,l);
		if (document.getElementById("ef-direction").checked){	//Reverse the arrows when up/down clicked
			ctx.lineTo(x+3,l-5);				//Down arrow
			ctx.lineTo(x-3,l-5);
			ctx.fillStyle= 'black';
			ctx.fill();
		}else {
			ctx.lineTo(x+3,l+5);				//Up arrow
			ctx.lineTo(x-3,l+5);
			ctx.fillStyle= 'black';
			ctx.fill();
		}
	}
}
function efToggle(){								//Toggle Electric Field
	if(document.getElementById("ef-status").checked){
		for(k=canvasTenth-canvasTenth/2; k<canvas.width;k+=canvasTenth){//Draw field lines if on
			eFieldLine(k);
		}
	}
}
function efToggleDirection() {							//Change Direction of electric field
	for(k=canvasTenth-canvasTenth/2; k<canvas.width;k+=canvasTenth){	//Clear field
		ctx.clearRect(k-4,0,8,canvas.height);
	}
	efToggle();								//Redraw it
}

//Defining a charge to move through the field
var Point = function(x,y) {
	this.startX = x;
	this.startY = y;
};
var charge = {
	x: 10,
	y: canvas.height/2,
	vx:5,
	vy:0,
	radius: 10,
	colour: 'green',
	draw: function(){						//Draw Function making a ball
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fillStyle = this.colour;
		ctx.fill();
	},
	points: [new Point(10,canvas.height/2)],
};

function updateCanvas(){
	if (document.getElementById('charge').value > 0 ){
		charge.colour = 'red';
	} else if (document.getElementById('charge').value <0 ){
		charge.colour = 'blue';
	} else {
		charge.colour = 'green';
	};
	mfToggle();
	efToggle();
	charge.draw();

}

function refresh(){
	updateCanvas();			//Refreshes the ball colour and position
	return false			//Stops the form submitting
}


//Charge Animation

function accelerations(){
	vy = 0;									//Set the initial values of the velocities.
	vx = parseFloat(document.getElementById('initial-speed').value);
	ay = 0;									//Naming (attribute)(direction)
	ax = 0;									//Acceleration 0 unless otherwise
	sy = canvas.height/2;							//Initial displacements
	sx = 10;
	if(document.getElementById("ef-status").checked==true){
		E = parseFloat(document.getElementById('ef-field-strength').value);	//Electric Field
		if(document.getElementById("ef-direction").checked==true){ E = -1* E} 	//Account for opposite direction if needed
	} else {
		E = 0;
	}

	if(document.getElementById("mf-status").checked==true){
		B = parseFloat(document.getElementById('mf-field-strength').value);	//Magnetic Field
		if(document.getElementById("mf-direction").checked==false){ B = -1* B} 	//Account for opposite direction if needed
	} else {
		B = 0;
	}
	q = parseFloat(document.getElementById('charge').value);		//Charge
	m = parseFloat(document.getElementById('mass').value);			//Mass


	if (document.getElementById("ef-status").checked==false &&document.getElementById("mf-status").checked ==false){
		sx += vx*t;		//Suvat
		charge.x = sx;				//Changing charge coordinates to new values.
		charge.y = sy;
		console.log("Suvat applied, x = ",sx," , y = ",sy)
	} else {
		a = B*q/m;
		b = E*q/m;

		cx = sx - ((b+vy)/a);
		cy = sy + (vx/a);

		x = (vx/a)*Math.sin(a*t) + ((b+vy)/a)*Math.cos(a*t) + cx;
		y = ((b+vy)/a)*Math.sin(a*t) - (vx/a)*Math.cos(a*t) + cy;


		console.log(x,y)
		charge.x = x;				//Changing charge coordinates to new values.
		charge.y = y;
	}




	// if (document.getElementById("ef-status").checked){			//If Electric Field on
	// 	//F = Eq = ma
	// 	if (document.getElementById("ef-direction").checked ) ay += E*q/m;
	// 	if (document.getElementById("ef-direction").checked==false  ) ay -= E*q/m;
	// 	sx += vx*t + 0.5*ax*t*t;		//Suvat using current values
	// 	sy += vy*t + 0.5*ay*t*t;
	// }
	//
	//
	// if (document.getElementById("mf-status").checked){			//If Magnetic Field on
	// 	//F = Bqv = ma
	// 	r = Math.abs((m*vx/B*q)) *1e36;						//The radius - this factor is to make it visible
	// 	omega = Math.abs(vx/r);							//omega is the angular velocity
	// 	mdirec = document.getElementById("mf-direction").checked;
	// 	A_mag = Math.abs(omega*omega*r);
	// 	if((mdirec==false && q > 0)||(mdirec && q<0)){
	// 		sy -= r;
	// 		theta = 0; 			//theta is the angle of the trajectory of the particle
	// 		theta += (omega/2*Math.PI)*t;
	// 		//ax -= A_mag*Math.sin(theta);
	// 		//ay -= A_mag*Math.cos(theta);
	// 		sy += r*Math.cos(theta);
	// 		sx += r*Math.sin(theta);
	// 	}
	//
	//
	// if ((mdirec==false && q < 0)||(mdirec && q>0)){
	// 	sy += r;
	// 	theta = 0; 			//theta is the angle of the trajectory of the particle
	// 	theta += (omega/2*Math.PI)*t;
	// 	sy -= r*Math.cos(theta);
	// 	sx += r*Math.sin(theta);
	// }
	// }

}

function drawPath() {
	if (document.getElementById('path').checked && charge.x< canvas.width && charge.x>5 && charge.y<canvas.height && charge.y>5){
		charge.points.push(new Point(charge.x,charge.y));		//If path is on and the charge is on the canvas
		for(i = 1; i<charge.points.length;i++){				//For all of the past points it has been at
			ctx.beginPath();					//Draw a line to the next point
			ctx.moveTo(charge.points[i-1].startX,charge.points[i-1].startY);
			ctx.lineTo(charge.points[i].startX,charge.points[i].startY);
			ctx.stroke();
		}
	}

}


function draw() {							//Function to draw the animated charge
	t+=parseFloat(document.getElementById('timestep').value);	//Time increased by timestep
	ctx.clearRect(0,0,canvas.width,canvas.height);			//Clear everything
	updateCanvas();							//Re add lines and charge
	accelerations();						//Calculate acceleration, change charge posistion
	drawPath();
	if (charge.x > canvas.width || charge.y >canvas.height || charge.y <0 || charge.x<0){	//If charge goes off screen
		window.cancelAnimationFrame(raf)			//Stop Animating
		t=0;							//Reset time
		vx = parseFloat(document.getElementById('initial-speed').value);	//Reset velocities (otherwise continuously increasing)
		vy = 0;
		charge.x = 10;
		charge.y = canvas.height/2;
		charge.points = [new Point(0,canvas.height/2)];		//Empties the array of points
	};
	raf = window.requestAnimationFrame(draw);			//Calls the function again to animate it.
}
document.getElementById('play').addEventListener("click", function(){	//Starts playback with the play button
	window.cancelAnimationFrame(raf);				//Cancels playback then restarts
	raf = window.requestAnimationFrame(draw);

});
document.getElementById('stop').addEventListener("click", function(){	//Stops playback with stop button
	window.cancelAnimationFrame(raf);				//Stops playback
	ctx.clearRect(0,0,canvas.width,canvas.height);			//Clear everything
	updateCanvas();
	drawPath();
});
document.getElementById('refresh-button').addEventListener("click", function(){	//Refresh button clicked
	window.cancelAnimationFrame(raf);				//Stops playback
	charge.x = 10;							//Resets all values
	charge.y = canvas.height/2;
	t = 0;
	vx = parseFloat(document.getElementById('initial-speed').value);
	vy = 0;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	updateCanvas();							//Updates the canvas

});

charge.draw();		//Draws charge on screen when Javascript initialised.
