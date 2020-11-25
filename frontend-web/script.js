var tickIcon = document.getElementById("tick");
var crossIcon = document.getElementById("cross");
var tickEdit = document.getElementById("tick-edit");
var crossEdit = document.getElementById("cross-edit");
var size=document.querySelector('#size');
var size_edit=document.querySelector('#size-edit');
var width=document.querySelector('#width');
var width_edit=document.querySelector('#width-edit');
var height=document.querySelector('#height');
var height_edit=document.querySelector('#height-edit');
var color=document.querySelector('#color');
var color_edit=document.querySelector('#color-edit');
var storage2=document.getElementsByClassName("storage2")[0];
var storage3=document.getElementsByClassName("storage3")[0];
var storage4=document.getElementsByClassName("storage4")[0];
var username_input = document.getElementById("username");
var username_label = document.getElementById("userLabel");
var password_input = document.getElementById("password");
var password_label = document.getElementById("passwordLabel");
var login_btn = document.getElementById("login_btn");
var logout_btn = document.getElementById("logout_btn");
var create_btn = document.getElementById("create_btn");
var greeting = document.getElementById("greeting");
var clicked = 0;
var count=0;
var def_size=12;
var def_w=300;
var def_h=250;

var notes_loaded = 0;
function loadSend(key,next){
    var url="http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/api/notes";
    var xhr = new XMLHttpRequest();
    xhr.open("GET",url);
    xhr.setRequestHeader("Authorization", "Bearer "+key);
    
    xhr.send();
    xhr.onreadystatechange = function(){ 
        if(xhr.readyState === 4 && xhr.status === 200){ 
            re=xhr.responseText;
            
            var data=JSON.parse(re);
            console.log(data);
            data.forEach(function (person){
             people.push((({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}) =>
            ({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}))(person));                
            });
            next(data);
        }
    };
            
}
function loginSend(url,next){
    var xhr = new XMLHttpRequest();
    xhr.open("POST",url);
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = `{

  "username": "` + username_input.value + `",
  "password": "` + password_input.value + `"

}`;
    xhr.send(data);
    xhr.onreadystatechange = function(){ 
        if(xhr.readyState === 4){ 
            next(xhr.responseText);
        }
    };
}
function login(){
    
   var note=document.getElementsByClassName("resizable");
   
   var au_url="http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/users/authenticate";
   
   var au=0;
    loginSend(au_url,function(res){
        if(res==="Bad credentials"){
            alert("Wrong Credentials");
   
        }else if(res==="Username/Password is blank."){
            alert("Wrong Credentials");
         
        }else {

            loadSend(JSON.parse(res).jwt,function(e){
                load(e,JSON.parse(res).jwt);
                tickIcon.addEventListener("click",function(){
                    createOne(JSON.parse(res).jwt);
                });
                tickEdit.addEventListener("click",function(){
                    editOne(JSON.parse(res).jwt);   
                });                

            });                
            

            username_input.style.display="none";
            username_label.style.display="none";
            password_input.style.display="none";
            password_label.style.display="none";
            login_btn.style.display="none";
            logout_btn.style.display="block";
            create_btn.style.display="block";

            
        }
            username_input.value = "";
            password_input.value = "";            
        
    });
    
}
crossIcon.addEventListener("click",function(){
    typing();
});
crossEdit.addEventListener("click",function(){
    storage4.style.display = "none";
});      
function newAcc(){
    var url = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/users/create";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = `{

  "username": "` + username_input.value + `",
  "password": "` + password_input.value + `"

}`;
    xhr.send(data);
    xhr.onreadystatechange = function(){ 
        if (xhr.readyState === 4) {
                 console.log(xhr.responseText);
                 if(xhr.responseText==="Username already exists! Please register with a unique username."){
                     alert(xhr.responseText);
                 }else alert("Success");
             }
    };

}
function logout(){
    var note=document.getElementsByClassName("resizable");
    greeting.style.display="none";
    username_input.style.display="block";
    username_label.style.display="block";
    password_input.style.display="block";
    password_label.style.display="block";    
    login_btn.style.display="block";
    logout_btn.style.display="none";
    create_btn.style.display="none";
    console.log(note.length);
    var count=note.length;
    for (i=0;i<count;i++){
        note[0].remove();
    }

}
function typing(){
    
    if(storage3.style.display === "none"){
        
        storage3.style.display ="block";
    }else {
        storage3.style.display = "none";
    }
}
function load(e,key){
    
    for(i=0;i<e.length;i++){
        loadCreate(key,e[i].id,e[i].text,e[i].font_size,e[i].x_coordinate,e[i].y_coordinate,e[i].width,e[i].height,e[i].colour);
    }

}
function loadCreate(key,id_in,text,font,x,y,wid,hei,color_in){
    var node0 = document.createElement("div");
    
    var node1 = document.createElement("h1");
    
    var del = document.createElement("img");
    node0.id = "update"+id_in;
    dragElement(node0,key);
    node1.id = "edit"+id_in;
    
    node0.setAttribute("class","resizable");
    del.setAttribute("src","x-square.svg");
    del.id = id_in;
    del.setAttribute("style","position: absolute;top:20%; left:80%;");
    node0.setAttribute("style","position: absolute;");
    del.addEventListener("click",function(){
        node0.remove();
        DeleteSend(id_in,key);
        
    });
    node1.innerHTML = text;
    node0.insertAdjacentElement("beforeend",del);
    //alert(x+","+y);
    node0.style.left=x+"px";
    node0.style.top=y+"px";
    
    if (font === 0){
        font = def_size;
    }
    if (wid === 0){
        wid = def_w;
    }
    if (hei === 0){
        hei = def_h;
    }    
    size.value=font;
    width.value=wid;
    height.value=hei;
    
    node1.setAttribute("style","width:300px;height:250px;padding:20px;margin-top:10px;overflow:hidden;margin:20px;box-shadow: 10px 10px 24px 0px rgba(0,0,0,0.75);font-size:"+size.value+"px;");
    node1.style.background=color_in;
    node1.style.width=wid;
    node1.style.height=hei;
    node0.appendChild(node1);
    node1.setAttribute("ondblclick","reply_click(this.id)");
    node1.addEventListener("dblclick",function(){
            storage4.style.display ="block";
            document.getElementById("note-edit-text").value = document.getElementById(node1.id).textContent ;
    });
    storage2.insertAdjacentElement("beforeend",node0);
}
function createOne(key){
    
    var textInput = document.getElementById("note-text").value;
    var node0 = document.createElement("div");
    
    var node1 = document.createElement("h1");
    
    var del = document.createElement("img");
    
    dragElement(node0,key);

    node0.setAttribute("class","resizable");
    del.setAttribute("src","x-square.svg");
    
    del.setAttribute("style","position: absolute;top:20%; left:80%;");
    node0.setAttribute("style","position: absolute;");
    

    node1.innerHTML = textInput;
    node0.insertAdjacentElement("beforeend",del);
    
    node0.style.left=randomX();
    node0.style.top=randomY();
    if(size.value===""){
        size.value=def_size;
    }
    if(width.value===""){
        width.value=def_w;
    }
    if(height.value===""){
        height.value=def_h;
    }    
    node1.setAttribute("style","width:300px;height:250px;padding:20px;margin-top:10px;overflow:hidden;margin:20px;box-shadow: 10px 10px 24px 0px rgba(0,0,0,0.75);font-size:"+size.value+"px;");
    node1.style.background=color.value;
    
    node1.style.width=width.value;
    node1.style.height=height.value;
    node0.appendChild(node1);
    var cx=node0.style.left.substring(0,node0.style.left.length-2);
    var cy=node0.style.top.substring(0,node0.style.top.length-2);
    

    Create(key,textInput,color.value,size.value,width.value,height.value,cx,cy,function(e){
        node1.id = "edit"+JSON.parse(e).id+1;
        var person=({id: JSON.parse(e).id+1, name: "NoteName", text:textInput , importance: 5, favourite: false, colour: color.value, font_size: size.value, height: height.value, width: width.value, x_coordinate: cx, y_coordinate: cy});
        people.push((({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}) =>
            ({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}))
            (person));    
            
            console.log(people.length);        
    });
    
        del.addEventListener("click",function(){
        node0.remove();
        DeleteSend(node1.id,key);
    });
    
    
    
    
    node1.setAttribute("ondblclick","reply_click(this.id)");
    node1.addEventListener("dblclick",function(){
            storage4.style.display ="block";
            document.getElementById("note-edit-text").value = document.getElementById(clicked).textContent ;
    });
    storage2.insertAdjacentElement("beforeend",node0);
    storage3.style.display = "none";
}
function editOne(key){

    var textEdit = document.getElementById("note-edit-text").value;
    
    document.getElementById(clicked).textContent = textEdit;
    document.getElementById(clicked).style.background=color_edit.value;
        
    if(size_edit.value===""){
        size_edit.value=def_size;
    }
    if(width_edit.value===""){
        width_edit.value=def_w;
    }
    if(height_edit.value===""){
        height_edit.value=def_h;
    } 
    document.getElementById(clicked).style.fontSize=size_edit.value;
    document.getElementById(clicked).style.width=width_edit.value;
    document.getElementById(clicked).style.height=height_edit.value;
    document.getElementById("note-text").value = document.getElementById("note-edit-text").value;
    var str = clicked.substring(4);
    console.log(str+"ahhhhhhhhh");
    var ch=0;
    for(i=0;i<people.length;i++){
        if(people[i].id === parseInt(str)){
            ch=i;
            
        }
    }
    updateData(key,ch,textEdit,color_edit.value,size_edit.value,width_edit.value,height_edit.value);
    storage4.style.display = "none";
}
function reply_click(clicked_id)
  {
    clicked=clicked_id;
    
    
  }

function randomX(){
    var random_X=["25px","50px","75px","100px","125px","150px"];
    return random_X[Math.floor(Math.random()*random_X.length)];
    
}
function randomY(){
    var random_Y=["25px","50px","75px","100px","125px","150px"];
    return random_Y[Math.floor(Math.random()*random_Y.length)];
    
}
function dragElement(elmnt,key) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {

    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {

    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;

    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {

    document.onmouseup = null;
    document.onmousemove = null;
    
    var str = elmnt.id.substring(6);
    var ch=0;
    for(i=0;i<people.length;i++){
        if(people[i].id === parseInt(str)){
            ch=i;
            console.log(ch);
            var ux=elmnt.style.left.substring(0,elmnt.style.left.length-2);
            var uy=elmnt.style.top.substring(0,elmnt.style.top.length-2);

            updateCoor(key,ch,ux,uy);
        }
    }

  }

}


var people = [];


function DeleteSend(ID,key) {
    ID = ID.toString();
    var url = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/api/notes/" + ID;

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);

    
    xhr.setRequestHeader("Authorization", "Bearer "+key);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };

    xhr.send();
}
function updateData(key,i,text,color,font,width,height){
    Update(key,people[i],text,color,font,people[i].x_coordinate,people[i].y_coordinate,width,height);
}
function updateCoor(key,i,x,y){
    console.log( " i "+ i);
    Update(key,people[i],people[i].text,people[i].colour,people[i].font_size,x,y,people[i].width,people[i].height);
    
}
function Update(key,post,text,color,font,x,y,width,height) {
    ID = post.id;
    var url = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/api/notes/" + ID;

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

    xhr.setRequestHeader("Authorization", "Bearer "+key);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };
    
   
    var data = `{
  "id": ` + post.id + `,
  "name": "` + post.name + `",
  "text": "` + text + `",
  "colour": "` + color + `",
  "font_size": ` + font + `,
  "x_coordinate": ` + x + `,
  "y_coordinate": ` + y + `,
  "width": ` + width + `,
  "height": ` + height + `,
  "importance":` + post.importance + `,
  "favourite": ` + post.favourite + `
}`;
    xhr.send(data);

}

function Create(key,text_in,color,font,width_in,height_in,x,y,next) {

    
    var url = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/api/notes/";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Authorization", "Bearer "+key);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
        var x = xhr.responseText;
        var newID = JSON.parse(x).id;
        }
    };
    
    var data = `{
  "name": "NoteName",
  "text": "` + text_in + `",
  "colour": "` + color + `",
  "font_size": ` + font + `,
  "x_coordinate": ` + x + `,
  "y_coordinate": ` + y + `,
  "width": ` + width_in + `,
  "height": ` + height_in + `,
  "importance":0 ,
  "favourite": false
}`;
    
    xhr.send(data);

    xhr.onreadystatechange = function(){ 
        if(xhr.readyState === 4 && xhr.status === 200){ 
            

            next(xhr.responseText);
        }
    };
}    
