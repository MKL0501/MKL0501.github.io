//points, xy[0] and xy[3] are fixed...
let x=[200,200,300,300];
//let y=[250,150,150,250];//parallelogram.
let y=[250,200,150,250];//crank-rocker.

//used for angle calculations...
let v0;
let v1;

//length, temp values, real values set in setup()...
let len=[100,100,100,100];

//trig angles and hypotenuse...
let alpha;
let beta;
let theta;
let hyp;

//type of 4-bar linkage...
let type;

//mode (spin or stretch)...
let mode=true;
function changeMode(){mode=!mode;}
let buttonMode;

//auto rotate...
let auto=false
function changeAuto(){auto=!auto;}
let buttonAuto;

//resets the lengths and checks the type...
function changeSetup()
{
    
    //set distances based on points...
    for(let i=0;i<4;i++)
    {
        len[i]=sqrt(pow(x[(i+1)%4]-x[i],2)+pow(y[(i+1)%4]-y[i],2));
    }
    
    //min and max lengths...
    let minlen=Math.min.apply(null,len);
    let maxlen=Math.max.apply(null,len);

    //determine type of 4-bar linkage...
    if(len[0]+len[1]==len[2]+len[3])
    {
        type=0;//parallelogram.
    }
    else if(len[0]+len[1]<len[2]+len[3] && len[0]==minlen && len[1]==maxlen)
    {
        type=1;//crank-rocker.
    }
    else
    {
        type=2;//invalid points.
    }
}

//move crank with mouse...
function moveCrank()
{
    //can only interact if a valid type...
    if(type!=2)
    {
        //if the mouse is on the drag point...
        if(mouseX < x[1]+15 && mouseX > x[1]-15 && mouseY < y[1]+15 && mouseY > y[1]-15)
        {
            //if user is pressing the mouse...
            if(mouseIsPressed)
            {
                //gets the angle theta of the bottom left corner...
                v0=createVector(mouseX-x[0],mouseY-y[0]);
                v1=createVector(1,0);
                theta=v1.angleBetween(v0);
                
                //gets the point xy[1]...
                x[1]=x[0]+len[0]*cos(theta);
                y[1]=y[0]+len[0]*sin(theta);
            
                //gets the distance between xy[1] and xy[3]...
                hyp=sqrt(pow(x[3]-x[1],2)+pow(y[3]-y[1],2));
                
                //in the case of the parallelogram the xy[1] and xy[3] can be in the same location...
                if(hyp==0)
                {
                    alpha=0;
                    beta=radians(180);
                }
                //when the crank bar is above the grounded bar...
                else if(theta<0)
                {
                    alpha=asin((sin(theta)*len[0])/hyp);
                    beta=-1*acos((pow(hyp,2)+pow(len[2],2)-pow(len[1],2))/(2*hyp*len[2]));
                }
                //when the crank bar is below the grounded bar...
                else
                {
                    alpha=asin((sin(theta)*len[0])/hyp);
                    //if parallelogram...
                    if(type==0)
                    {
                    beta=acos((pow(hyp,2)+pow(len[2],2)-pow(len[1],2))/(2*hyp*len[2]));
                    }
                    //if crank-rocker...
                    else if(type==1)
                    {
                    beta=-1*acos((pow(hyp,2)+pow(len[2],2)-pow(len[1],2))/(2*hyp*len[2]));
                    }
                }
                //gets the point xy[2]...
                x[2]=x[0]+len[3]-len[2]*cos(alpha+beta);
                y[2]=y[0]+len[2]*sin(alpha+beta);
            }
        }
    }
}

//change the bars by moving a point...
function changeBars()
{
    //if the mouse is on bottom left point...
    if(mouseX < x[0]+15 && mouseX > x[0]-15 && mouseY < y[0]+15 && mouseY > y[0]-15)
    {
        //if user is pressing the mouse...
        if(mouseIsPressed)
        {
            x[0]=mouseX;
        }
    }
    //if the mouse is on top left point...
    else if(mouseX < x[1]+15 && mouseX > x[1]-15 && mouseY < y[1]+15 && mouseY > y[1]-15)
    {
        //if user is pressing the mouse...
        if(mouseIsPressed)
        {
            x[1]=mouseX;
            //keeps the points above the fixed bar for the trig functions to work...
            if(mouseY <= y[0])
            {
                y[1]=mouseY;
            }
        }
    }
    //if the mouse is on top right point...
    else if(mouseX < x[2]+15 && mouseX > x[2]-15 && mouseY < y[2]+15 && mouseY > y[2]-15)
    {
        //if user is pressing the mouse...
        if(mouseIsPressed)
        {
            x[2]=mouseX;
            //keeps the points above the fixed bar for the trig functions to work...
            if(mouseY <= y[0])
            {
                y[2]=mouseY;
            }
        }
    }
    //if the mouse is on bottom right point...
    else if(mouseX < x[3]+15 && mouseX > x[3]-15 && mouseY < y[3]+15 && mouseY > y[3]-15)
    {
        //if user is pressing the mouse...
        if(mouseIsPressed)
        {
            x[3]=mouseX;
        }
    }
}


//moves the crank automaticly...
function autoCrank()
{
    //can only interact if a valid type...
    if(type!=2)
    {
        //gets the angle theta of the bottom left corner.
        //  rotates with a step of 2 degs...
        v0=createVector(x[1]-x[0],y[1]-y[0]);
        v1=createVector(1,0);
        theta=v1.angleBetween(v0)+radians(2);
                
        //gets the point xy[1]...
        x[1]=x[0]+len[0]*cos(theta);
        y[1]=y[0]+len[0]*sin(theta);
            
        //gets the distance between xy[1] and xy[3]...
        hyp=sqrt(pow(x[3]-x[1],2)+pow(y[3]-y[1],2));
                
        //in the case of the parallelogram the xy[1] and xy[3] can be in the same location...
        if(hyp==0)
        {
            alpha=0;
            beta=radians(180);
        }
        //when the crank bar is above the grounded bar...
        else if(theta<0)
        {
            alpha=asin((sin(theta)*len[0])/hyp);
            beta=-1*acos((pow(hyp,2)+pow(len[2],2)-pow(len[1],2))/(2*hyp*len[2]));
        }
        //when the crank bar is below the grounded bar...
        else
        {
            alpha=asin((sin(theta)*len[0])/hyp);
            //if parallelogram...
            if(type==0)
            {
                beta=acos((pow(hyp,2)+pow(len[2],2)-pow(len[1],2))/(2*hyp*len[2]));
            }
            //if crank-rocker...
            else if(type==1)
            {
                beta=-1*acos((pow(hyp,2)+pow(len[2],2)-pow(len[1],2))/(2*hyp*len[2]));
            }
        }
        //gets the point xy[2]...
        x[2]=x[0]+len[3]-len[2]*cos(alpha+beta);
        y[2]=y[0]+len[2]*sin(alpha+beta);
    }
}


//setup function...
function setup() 
{
    createCanvas(500, 500);
    strokeWeight(4);
    //stroke(0);//outline.
    fill(0);//solid.
    textSize(10);
    frameRate(60);
    
    //declared here just so its already a vector type...
    v0=p5.Vector.fromAngle(theta,len[0]);
    v1=p5.Vector.fromAngle(theta,len[0]);
    
    changeSetup();
    
    buttonMode=createButton('Change Mode');
    buttonMode.position(275,17);
    buttonMode.mousePressed(changeMode);
    
    buttonAuto=createButton("Start/Stop");
    buttonAuto.position(300,45);
    buttonAuto.mousePressed(changeAuto);
}


//drawing function...
function draw()
{
    background(200);//background color.
    
    if(mode)
    {
        if(auto)
        {
            autoCrank();
        }
        else
        {
            moveCrank();
        }
    }
    else
    {
        changeBars();
        changeSetup();
    }

    //prints the type...
    textSize(32);
    switch(type)
    {
        case 0:
            text('Parallelogram', 10, 30);
            break;
        case 1:
            text('Crank-Rocker', 10, 30);
            break;
        case 2:
            text('Invalid Points!!!', 10, 30);
            break;
    }
    
    //prints the mode...
    textSize(20);
    switch(mode)
    {
        case true:
            text(':Spin', 370, 26);
            break;
        case false:
            text(':Stretch', 370, 26);
            break;
    }
    
    //prints the the spinning state...
    switch(auto)
    {
        case true:
            text(':Rotating', 370, 54);
            break;
        case false:
            text(':Paused', 370, 54);
            break;
    }
    
    //draws the picture based on the points and prints bar lengths...
    textSize(15);
    text('Lengths:', 30, 55);
    textSize(10);
    for(let i=0;i<4;i++)
    {
        line(x[i],y[i],x[(i+1)%4],y[(i+1)%4]);
        circle(x[i],y[i],10);
        text('bar-'+i.toString()+': '+(len[i]).toString(),30,(i+1)*20+50);
    }
    triangle(x[0],y[0],(x[0]-10),(y[0]+20),(x[0]+10),(y[0]+20));
    triangle(x[3],y[3],(x[3]-10),(y[3]+20),(x[3]+10),(y[3]+20));
}