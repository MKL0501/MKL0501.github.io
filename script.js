//points, xy[0] and xy[3] are fixed...
let x=[0,0,100,100];
let y=[0,-50,-100,0];//crank-rocker.

//used for angle calculations...
let v0;
let v1;

//length, temp values, real values set in setup()...
let len=[100,100,100,100];

//mass of the joints...
let mass=[1,1,1,1];

//click force..
let force=25;

//is force and air resistance used in the rotation...
let forceEnabled=false;
function changeForce(){forceEnabled=!forceEnabled;}
let buttonForce;

//air resistance...
let air=0.125;

//spring bar...
let springBar=0;

//spring enabled...
let spring=false;

//hooke's constant...
let hooke=1;

//vector angles...
let theta=[];

//bar length ratios...
let k=[1.0,1.0,1.0];

//intermediate parameters for quadratic equation...
let A;
let B;
let C;

//open or crossed...
let open=true;

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
    
    whichType();//checks type.
    checkOpen();//checks open or crossed.
}


//determinds type...
function whichType()
{
     //min and max lengths...
    let minlen=Math.min.apply(null,len);
    let maxlen=Math.max.apply(null,len);

    //determine type of 4-bar linkage...
    /*if(len[0]+len[1]==len[2]+len[3])
    {
        type=0;//parallelogram.
        //open=false;
    }
    else */
    if(len[0]+len[1]<len[2]+len[3] && len[0]==minlen && len[1]==maxlen)
    {
        type=1;//crank-rocker.
        //open=true;
    }
    else
    {
        type=2;//invalid points.
    }
}


//determines if it is open or crossed...
function checkOpen()
{
    if((y[1]>0 && y[2]>0) || (y[1]<0 && y[2]<0))
    {
        open=true;//open.
    }
    else
    {
        open=false;//crossed.
    }
}


//move crank with mouse...
function moveCrank()
{
    //can only interact if a valid type...
    if(type!=2)
    {
        //if the mouse is on the drag point...
        if(mouseX < x[1]+15+200 && mouseX > x[1]-15+200 && mouseY < y[1]+15+250 && mouseY > y[1]-15+250)
        {
            //if user is pressing the mouse...
            if(mouseIsPressed)
            {
                //gets the angle theta of the bottom left corner...
                v0=createVector(mouseX-(x[0]+200),mouseY-(y[0]+250));
                v1=createVector(1,0);
                theta[0]=v1.angleBetween(v0);
                
                //determines the bar length ratios...
                k[0]=len[3]/len[0];
                k[1]=len[3]/len[2];
                k[2]=(len[0]*len[0] - len[1]*len[1] + len[2]*len[2] + len[3]*len[3])/(2*len[0]*len[2]);
    
                //determineds the parameters for the quadratic equation...
                A=cos(theta[0]) - k[0] - k[1]*cos(theta[0]) + k[2];
                B=-2*sin(theta[0]);
                C=k[0] - (k[1] + 1)*cos(theta[0]) + k[2];
    
                //determines all the angles...
                //if it's an open configuration...
                if(open)
                {
                    theta[3]=2*atan((-1*B + sqrt(B*B - 4*A*C))/(2*A));
                    theta[1]=asin((-1*len[0]*sin(theta[0]) + len[2]*sin(theta[3]))/(len[1]));
                }
                //if it's a crossed configuration...
                else
                {
                    theta[3]=2*atan((-1*B - sqrt(B*B - 4*A*C))/(2*A));
                    theta[1]=acos((-1*len[0]*cos(theta[0]) + len[2]*cos(theta[3]) + len[3])/(len[1]));
                }
                theta[2]=radians(360) - (radians(180) - theta[3]);
    
                //finds location of (x,y)_1...
                x[1]=(len[0])*cos(theta[0]);
                y[1]=(len[0])*sin(theta[0]);
    
                //x[2]=(len[0]*cos(theta[0]) + (len[1])*cos(theta[1]));
                //y[2]=(len[0]*sin(theta[0]) + (len[1])*sin(theta[1]));
    
                //finds location of (x,y)_3...
                x[3]=len[3];
                y[3]=0;
    
                //finds location of (x,y)_2...
                x[2]=x[3] + len[2]*cos(theta[3]);
                y[2]=(len[2]*sin(theta[3]));
    
                //x[3]=len[0]*cos(theta[0]) + len[1]*cos(theta[1]) + (len[2])*cos(theta[2]);
                //y[3]=len[0]*sin(theta[0]) + len[1]*sin(theta[1]) + (len[2])*sin(theta[2]);
            }
        }
    }
}


//change the bars by moving a point...
function changeBars()
{
    //if the mouse is on bottom left point...
    if(mouseX < x[0]+15+200 && mouseX > x[0]-15+200 && mouseY < y[0]+15+250 && mouseY > y[0]-15+250)
    {
        //if user is pressing the mouse...
        if(mouseIsPressed)
        {
            x[0]=mouseX-200;
        }
    }
    //if the mouse is on top left point...
    else if(mouseX < x[1]+15+200 && mouseX > x[1]-15+200 && mouseY < y[1]+15+250 && mouseY > y[1]-15+250)
    {
        //if user is pressing the mouse...
        if(mouseIsPressed)
        {
            x[1]=mouseX-200;
            //keeps the point above the fixed bar for the trig functions to work...
            if(mouseY <= y[0]+250)
            {
                y[1]=mouseY-250;
            }
        }
    }
    //if the mouse is on top right point...
    else if(mouseX < x[2]+15+200 && mouseX > x[2]-15+200 && mouseY < y[2]+15+250 && mouseY > y[2]-15+250)
    {
        //if user is pressing the mouse...
        if(mouseIsPressed)
        {
            x[2]=mouseX-200;
            y[2]=mouseY-250;
        }
    }
    //if the mouse is on bottom right point...
    else if(mouseX < x[3]+15+200 && mouseX > x[3]-15+200 && mouseY < y[3]+15+250 && mouseY > y[3]-15+250)
    {
        //if user is pressing the mouse...
        if(mouseIsPressed)
        {
            x[3]=mouseX-200;
        }
    }
}


//new crank function...
function autoCrank(reset=false)
{
    //can only interact if a valid type...
    if(type!=2)
    {
        //used when redrawing in the current position
        //  after a bar length has been changed...
        if(reset)
        {        
            theta[0]=theta[0];
        }
        //used when rotating...
        else
        {
            //if no force, it just rotates continueously...
            if(!forceEnabled)
            {
                theta[0]=theta[0] + radians(2);
            }
            //with force, it slows down...
            else
            {
                theta[0]=theta[0] + radians(force);
                force=force - air;//lowers the force.
                
                //stops and resets force...
                if(force<=0)
                {
                    changeForce();
                    force=25;
                    changeAuto();
                }
            }
        }
    
        //determines the bar length ratios...
        k[0]=len[3]/len[0];
        k[1]=len[3]/len[2];
        k[2]=(len[0]*len[0] - len[1]*len[1] + len[2]*len[2] + len[3]*len[3])/(2*len[0]*len[2]);
    
        //determineds the parameters for the quadratic equation...
        A=cos(theta[0]) - k[0] - k[1]*cos(theta[0]) + k[2];
        B=-2*sin(theta[0]);
        C=k[0] - (k[1] + 1)*cos(theta[0]) + k[2];
    
        //determines all the angles...
        //if it's an open configuration...
        if(open)
        {
            theta[3]=2*atan((-1*B + sqrt(B*B - 4*A*C))/(2*A));
            theta[1]=asin((-1*len[0]*sin(theta[0]) + len[2]*sin(theta[3]))/(len[1]));
        }
        //if it's a crossed configuration...
        else
        {
            theta[3]=2*atan((-1*B - sqrt(B*B - 4*A*C))/(2*A));
            theta[1]=acos((-1*len[0]*cos(theta[0]) + len[2]*cos(theta[3]) + len[3])/(len[1]));
        }
    
        theta[2]=radians(360) - (radians(180) - theta[3]);
    
        //finds location of (x,y)_1...
        x[1]=(len[0])*cos(theta[0]);
        y[1]=(len[0])*sin(theta[0]);
    
        //x[2]=(len[0]*cos(theta[0]) + (len[1])*cos(theta[1]));
        //y[2]=(len[0]*sin(theta[0]) + (len[1])*sin(theta[1]));
    
        //finds location of (x,y)_3...
        x[3]=len[3];
        y[3]=0;
    
        //finds location of (x,y)_2...
        x[2]=x[3] + len[2]*cos(theta[3]);
        y[2]=(len[2]*sin(theta[3]));
    
        //x[3]=len[0]*cos(theta[0]) + len[1]*cos(theta[1]) + (len[2])*cos(theta[2]);
        //y[3]=len[0]*sin(theta[0]) + len[1]*sin(theta[1]) + (len[2])*sin(theta[2]);
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
    
    //initializing theta, theta[0] is the only correct angle...
    theta=[radians(-90),radians(-90),radians(-90),radians(-90)];

    //declared here just so its already a vector type...
    v0=p5.Vector.fromAngle(theta[0],len[0]);
    v1=p5.Vector.fromAngle(theta[0],len[0]);
    
    //adjusts the configuration...
    changeSetup();
    
    //all three buttons on the right side...
    buttonMode=createButton('Change Mode');
    buttonMode.position(275,17);
    buttonMode.mousePressed(changeMode);
    
    buttonAuto=createButton("Start/Stop");
    buttonAuto.position(300,45);
    buttonAuto.mousePressed(changeAuto);
    
    buttonForce=createButton("Force");
    buttonForce.position(325,73);
    buttonForce.mousePressed(changeForce);
    
    //length inputs...
    let inp0=createInput('');
    inp0.position(10,68);
    inp0.size(15,10);
    inp0.input(function (){
        len[0]=parseFloat(inp0.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    let inp1=createInput('');
    inp1.position(10,88);
    inp1.size(15,10);
    inp1.input(function (){
        len[1]=parseFloat(inp1.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    let inp2=createInput('');
    inp2.position(10,108);
    inp2.size(15,10);
    inp2.input(function (){
        len[2]=parseFloat(inp2.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    let inp3=createInput('');
    inp3.position(10,128);
    inp3.size(15,10);
    inp3.input(function (){
        len[3]=parseFloat(inp3.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    //mass inputs...
    let inp4=createInput('');
    inp4.position(10,68+103);
    inp4.size(15,10);
    inp4.input(function (){
        mass[0]=parseFloat(inp4.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    let inp5=createInput('');
    inp5.position(10,88+103);
    inp5.size(15,10);
    inp5.input(function (){
        mass[1]=parseFloat(inp5.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    let inp6=createInput('');
    inp6.position(10,108+103);
    inp6.size(15,10);
    inp6.input(function (){
        mass[2]=parseFloat(inp6.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    let inp7=createInput('');
    inp7.position(10,128+103);
    inp7.size(15,10);
    inp7.input(function (){
        mass[3]=parseFloat(inp7.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
   
    //force input...
    let inp8=createInput('');
    inp8.position(10,276);
    inp8.size(15,10);
    inp8.input(function (){
        force=parseFloat(inp8.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    let inp9=createInput('');
    inp9.position(10,296);
    inp9.size(15,10);
    inp9.input(function (){
        air=parseFloat(inp9.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    //spring inputs...
    let inp10=createInput('');
    inp10.position(10,375);
    inp10.size(15,10);
    inp10.input(function (){
        hooke=parseFloat(inp10.value());
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    let inp11=createInput('');
    inp11.position(10,355);
    inp11.size(15,10);
    inp11.input(function (){
        temp=parseFloat(inp11.value());
        if(0<=temp && temp<=3)
        {
            springBar=temp; 
        }
        autoCrank(true);
        whichType();
        checkOpen();
    });
    
    let inp12=createInput('');
    inp12.position(10,335);
    inp12.size(15,10);
    inp12.input(function (){
        temp=inp12.value();
        if(temp=='true')
        {
            spring=true; 
        }
        else
        {
            spring=false;
        }
        autoCrank(true);
        whichType();
        checkOpen();
    });
}


//drawing function...
function draw()
{
    background(200);//background color.
    
    //if in spinning mode...
    if(mode)
    {
        //auto rotating...
        if(auto)
        {
            autoCrank();
        }
        //paused for manual movement...
        else
        {
            moveCrank();
        }
    }
    //if in stretch mode...
    else
    {
        changeBars();//move bars.
        changeSetup();//evaluate the new setup.
    }

    //prints the type...
    textSize(32);
    switch(type)
    {
        /*case 0:
            text('Parallelogram', 10, 30);
            break;*/
        case 1:
            text('Crank-Rocker', 10, 30);
            break;
        case 2:
            text('Invalid Points!!!', 10, 30);
            break;
    }
    
    //prints open or crossed...
    textSize(20);
    switch(open)
    {
        case true:
            text('Config : Open', 306, 110);
            break;
        case false:
            text('Config : Crossed', 306, 110);
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
    
    //prints the whether or not force is used...
    switch(forceEnabled)
    {
        case true:
            text(':On', 370, 82);
            break;
        case false:
            text(':Off', 370, 82);
            break;
    }
    
    //prints bar lengths...
    textSize(15);
    text('Lengths:', 30, 55);
    textSize(10);
    for(let i=0;i<4;i++)
    {
        text('bar-'+i.toString()+': '+(len[i]).toString(),30,(i+1)*20+50);
    }
    
    //prints joint mass...
    textSize(15);
    text('Mass:', 30, 160);
    textSize(10);
    for(let i=0;i<4;i++)
    {
        text('joint-'+i.toString()+': '+(mass[i]).toString(),30,(i+1)*20+155);
    }
        
    //prints the click force and air resistance...
    textSize(15);
    text('Force:', 30, 265);
    textSize(10);
    text('click-force: '+force.toString(),30,280);
    text('air-resistance: '+air.toString(),30,299);
    
    //prints the spring options...
    textSize(15);
    text('Spring:', 30, 324);
    textSize(10);
    text('enabled: '+spring.toString(),30,339);
    text('which-bar: '+springBar.toString(),30,358);
    text('hooke\'s\'constant: '+hooke.toString(),30,377);
    
    //draws the picture based on the points...
    push();
    translate(200,250);
    for(let i=0;i<4;i++)
    {
        line(x[i],y[i],x[(i+1)%4],y[(i+1)%4]);
        circle(x[i],y[i],10);
    }
    triangle(x[0],y[0],(x[0]-10),(y[0]+20),(x[0]+10),(y[0]+20));
    triangle(x[3],y[3],(x[3]-10),(y[3]+20),(x[3]+10),(y[3]+20));
    pop();
}