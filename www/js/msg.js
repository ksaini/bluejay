var base_url = "http://greyboxerp.com/studentapp/";

function getSID(){
	var sid = localStorage.getItem("sid");
	if(sid != null)
		return sid;
	else
		return 0;
}

function getMessageID(){
	var sid = localStorage.getItem("mid");
	
	if(sid >0)
		return sid;
	else
		return 0;
}

function getLocalMsg(mid){
	var msgs = "{}";
	if(mid > 0){
		if(localStorage.getItem("msgs") != null)
			msgs = JSON.parse(localStorage.getItem("msgs"));
	}
	return msgs;	
}

function populateLocalMsg(mid){
	var msgs = getLocalMsg(mid);
	populateMsg(msgs);
}

function getNewMsg(sid,mid){
	chat.innerHTML = localStorage.getItem("chat");
	setTimeout(function(){window.scrollTo(0,document.body.scrollHeight+300);}, 200);
	
	var sql = "sid=" + sid + "&mid=" + mid;
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				//alert(req.responseText);
				var dataArray=JSON.parse(req.responseText);
				populateMsg(dataArray);
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	req.open("GET", base_url + "/getMsg.php?" + sql, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
}

function populateMsg(data){
		var chat = document.getElementById("chat");
		var msgstr = "";
		var tmp = "";
		
		for (var i = 0; i < data.length; i++) {
			 var color ="55C1E7";
			
			if(data[i]['scope']!="cid" && data[i]['scope']!="sid"){
				// Individual msg from Student
				msgstr += getRightMsg(data[i]['msg'],"",data[i]['scopeid'],data[i]['mid'],data[i]['ts']);
			}
			else if(data[i]['scope']=="sid"){
				// Individual repl to student
				msgstr += getLeftMsg(data[i]['msg'],"",data[i]['scopeid'],data[i]['mid'],data[i]['ts']);				
			}	
			else { //if(data[i]['cid']==localStorage.getItem("cid") )
				// Announcements for a given class
				msgstr += getLeftMsg(data[i]['msg'],"<i class='fa fa-volume-up'></i>",data[i]['scopeid'],data[i]['mid'],data[i]['ts']);
			}
			
			tmp = data[i]['mid'];    
            localStorage.setItem("mid", tmp);			
		}
		
		
		localStorage.setItem("chat", manageStoredMsg(100,20) + msgstr);
		chat.innerHTML += msgstr; //localStorage.getItem("chat");
		setTimeout(function(){window.scrollTo(0,document.body.scrollHeight+300);}, 200);
		
}

function manageStoredMsg(limit,last){
	//Keep check on size of storeg messages locally
	//If messages excedes limit(100) remove last(20) messages
	// Else return original stored msg
	
	var el = document.createElement( 'body' );
	el.innerHTML = localStorage.getItem("chat");

	var li = el.getElementsByTagName( 'li' );
	
	if(li.length > limit){
		var t = "";
		while (last--)	{
			t +=li[last].id;
			el.removeChild(li[last]);
		}
		
	}
	return el.innerHTML;
}

function getLeftMsg(m,id,sid,mid,ts){
	var icon = "R";
	
	msg = "<li id='m_"+mid+"' class='left clearfix'><span class='chat-img pull-left'>";
	msg += "<img src='img/r.png' alt='User Avatar' class='img-circle' /></span>";
	//msg += "<div style='border-radius: 50%;width:40px;height:40px;background: #55C1E7;' >"+icon+"</div></span>";
    msg += "<div class='chat-body clearfix'><div class='header'>";
	msg += "<strong class='primary-font'>"+ id +"</strong> <small style='font-size:8px;' class='pull-right text-muted'>";
	msg += "<i class='fa fa-clock-o'></i></span> "+formatDateY(ts)+" </small></div>";
	msg += "<p>" + m ;
	msg += "  </p></div> </li>";
    
	return msg;	
}
function getRightMsg(m,id,sid,mid,ts){
	var icon = "ME";
	
	msg = "<li id='m_"+mid+"' class='right clearfix' style='background-color:#e6fff9;'><span class='chat-img pull-right'>";
	//msg += "<img src='http://placehold.it/45/ff9933/fff&text="+icon+"' alt='User Avatar' class='img-circle' /></span>";
	msg += "<img src='img/me.png' alt='User Avatar' class='img-circle' /></span>";
    msg += "<div class='chat-body clearfix' ><div class=' header'>";
	msg += "<strong class='pull-right primary-font'>"+ id +"</strong> </div>";
	msg += "<p style='text-align:right;padding-top:5px;'>" + m ;
	
	msg += "</p><small style='font-size:8px;' class='pull-right text-muted'>";
	msg += "<i class='fa fa-clock-o'></i></span> "+formatDateY(ts)+"</small></div> </li>";
    
	return msg;	
}
function sendmsg(sid){
	var msg = document.getElementById("btn-input").value;
	document.getElementById("btn-input").value=""
	
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				window.scrollTo(0,document.body.scrollHeight+300);
				//if able to send message clear the tmpmsg
				localStorage.setItem("tmpmsg","");
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	if( (msg.trim().length > 0) || localStorage.getItem("tmpmsg").length > 0){
		//store messages in localstorage so that if client is not connected
		// we can post message later.
		var sql = "";
		var tmpmsg = localStorage.getItem("tmpmsg");
		localStorage.setItem("tmpmsg",tmpmsg + "<br>" + msg);
		
		var chat = document.getElementById("chat");
		
		if(tmpmsg.length > 0){
			sql = "sid=" + sid + "&msg=" + tmpmsg + "<br>" + msg;
			chat.innerHTML += getRightMsg(tmpmsg + "<br>" + msg,"","","");
		}
		else{
			sql = "sid=" + sid + "&msg=" + msg;
			chat.innerHTML += getRightMsg(msg,"","","");
		}
		window.scrollTo(0,document.body.scrollHeight+300);
	
		req.open("GET", base_url + "/setMsg.php?" + sql, true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send();
	}
}

function getHWList(){
	
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4){
			if(req.status == 200){
			 try {
				var hwlist = document.getElementById("notice");
				hwlist.innerHTML = "";
				var data=JSON.parse(req.responseText);
				if(data.length<1)
					hwlist.innerHTML = "<br>Hurray!! No Homework";
				var txt = "<ul class='chat' id='chat'>";
				for(var i=0; i < data.length; i++){
					var d = data[i]['hwdate'];
					txt += "<li id='dt_"+ d +"' class='clearfix text-muted'  onclick='showHW(&apos;"+d+"&apos;)'>";
					txt += "<p style='padding-top:20px;'><label>" + formatDate(d) + "</label></p></li>";
				}
					
				hwlist.innerHTML += txt + "</ul>";
			 } catch (e) {
				console.log("Exception::-"+e.toString());
			 }
			}else {document.getElementById("notice").innerHTML = "<ul class='chat' id='chat'><li class='clearfix text-muted'><label>No Internet Connection!</label></li></ul>"}
		}
	};
	
	req.open("GET", base_url + "/getHW.php?sid=" + localStorage.getItem("sid"), true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
	
}
function showHW(dt){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				var hw = document.getElementById("notice");
				localStorage.setItem("hwlist",hw.innerHTML);  
				hw.innerHTML = "<div id='back'><i class='fa fa-2x fa-arrow-circle-left' onclick='backHW();'></i> &nbsp; Back</div><br>";
				hw.classList.add('notesArea');
				var data=JSON.parse(req.responseText);
	
				for (var i = 0; i < data.length; i++) {		
					hw.innerHTML += "<div  style='height: 60px;font-family:Comic Sans MS;text-transform:capitalize;'><p style='margin-left:10px'><small style='color:orange;'>" + data[i]['hwdate'] + "</small><br>" + "<b> "+data[i]['subject']+" </b> : "  + data[i]['descr'] ;
		
					if(data[i]['imgs'].length>0){
						var imgs = data[i]['imgs'].split(',');
						var im = "";
						for (var x=0; x< imgs.length; x++){
							im +="<br><img src='"+imgs[x]+"' class='img-thumbnail'  alt='HW Image'  />";
						}
						hw.innerHTML += im;
					}
				}	
					
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	req.open("GET", base_url + "/getHW.php?sid=" + localStorage.getItem("sid") + "&dt=" + dt, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
}

function backHW(){
	document.getElementById("notice").classList.remove("notesArea");
	document.getElementById("notice").innerHTML = localStorage.getItem("hwlist");
}

function formatDate(dt){
	try{
		var dateObj = new Date(dt);
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();

		newdate =  getM(month) + " " + day + ", " + year;
		return newdate;
	} catch(e){return dt;}
}
function formatDateY(dt){
	if(dt == null) return "Sending..";
	try{
		var dateObj = new Date(dt);
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var m = dateObj.getMinutes();
		if(m < 10)
			newdate =  getM(month) + " " + day + " " + dateObj.getHours() + ":0" +dateObj.getMinutes() + " " ;
		else
			newdate =  getM(month) + " " + day + " " + dateObj.getHours() + ":" +dateObj.getMinutes() + " " ;
				
		return newdate;
	} catch(e){return dt;}
}

function getM(m){
 if(m==1)
 	return "Jan";
 else if(m==2)
    return "Feb";
 else if(m==3)
    return "Mar"; 
 else if(m==4)
    return "Apr";  
 else if(m==5)
    return "May"; 
 else if(m==6)
    return "Jun";   
 else if(m==7)
    return "Jul"; 
 else if(m==8)
    return "Aug";  
 else if(m==9)
    return "Sep";  
 else if(m==10)
    return "Oct"; 
 else if(m==11)
    return "Nov";
 else if(m==12)
    return "Dec";     

}