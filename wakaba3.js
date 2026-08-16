function get_cookie(name)
{
	with(document.cookie)
	{
		var regexp=new RegExp("(^|;\\s+)"+name+"=(.*?)(;|$)");
		var hit=regexp.exec(document.cookie);
		if(hit&&hit.length>2) return unescape(hit[2]);
		else return '';
	}
};

function set_cookie(name,value,days)
{
	if(days)
	{
		var date=new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires="; expires="+date.toGMTString();
	}
	else expires="";
	document.cookie=name+"="+value+expires+"; path=/";
}

function get_password(name)
{
	var pass=get_cookie(name);
	if(pass) return pass;

	var chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var pass='';

	for(var i=0;i<8;i++)
	{
		var rnd=Math.floor(Math.random()*chars.length);
		pass+=chars.substring(rnd,rnd+1);
	}

	return(pass);
}



function insert(text)
{
	var textarea=document.forms.postform.field4;
	if(textarea)
	{
		if(textarea.createTextRange && textarea.caretPos) // IE
		{
			var caretPos=textarea.caretPos;
			caretPos.text=caretPos.text.charAt(caretPos.text.length-1)==" "?text+" ":text;
		}
		else if(textarea.setSelectionRange) // Firefox
		{
			var start=textarea.selectionStart;
			var end=textarea.selectionEnd;
			textarea.value=textarea.value.substr(0,start)+text+textarea.value.substr(end);
			textarea.setSelectionRange(start+text.length,start+text.length);
		}
		else
		{
			textarea.value+=text+" ";
		}
		textarea.focus();
	}
}

function highlight(post)
{
	var cells=document.getElementsByTagName("td");
	for(var i=0;i<cells.length;i++) if(cells[i].className=="highlight") cells[i].className="reply";

	var reply=document.getElementById("reply"+post);
	if(reply)
	{
		reply.className="highlight";
/*		var match=/^([^#]*)/.exec(document.location.toString());
		document.location=match[1]+"#"+post;*/
		return false;
	}

	return true;
}



function set_stylesheet(styletitle,norefresh)
{
	set_cookie("wakabastyle",styletitle,365);

	var links=document.getElementsByTagName("link");
	var found=false;
	for(var i=0;i<links.length;i++)
	{
		var rel=links[i].getAttribute("rel");
		var title=links[i].getAttribute("title");
		if(rel.indexOf("style")!=-1&&title)
		{
			links[i].disabled=true; // IE needs this to work. IE needs to die.
			if(styletitle==title) { links[i].disabled=false; found=true; }
		}
	}
	if(!found) set_preferred_stylesheet();
}

function set_preferred_stylesheet()
{
	var links=document.getElementsByTagName("link");
	for(var i=0;i<links.length;i++)
	{
		var rel=links[i].getAttribute("rel");
		var title=links[i].getAttribute("title");
		if(rel.indexOf("style")!=-1&&title) links[i].disabled=(rel.indexOf("alt")!=-1);
	}
}

function get_active_stylesheet()
{
	var links=document.getElementsByTagName("link");
	for(var i=0;i<links.length;i++)
	{
		var rel=links[i].getAttribute("rel");
		var title=links[i].getAttribute("title");
		if(rel.indexOf("style")!=-1&&title&&!links[i].disabled) return title;
	}
	return null;
}

function get_preferred_stylesheet()
{
	var links=document.getElementsByTagName("link");
	for(var i=0;i<links.length;i++)
	{
		var rel=links[i].getAttribute("rel");
		var title=links[i].getAttribute("title");
		if(rel.indexOf("style")!=-1&&rel.indexOf("alt")==-1&&title) return title;
	}
	return null;
}

function set_inputs(id) { with(document.getElementById(id)) {if(!field1.value) field1.value=get_cookie("name"); if(!field2.value) field2.value=get_cookie("email"); if(!password.value) password.value=get_password("password"); } }
function set_delpass(id) { with(document.getElementById(id)) password.value=get_cookie("password"); }

function do_ban(el)
{
	var reason=prompt("Give a reason for this ban:");
	if(reason) document.location=el.href+"&comment="+encodeURIComponent(reason);
	return false;
}

function set_video_mode(num,vsrc,vwidth,vheight,loop)
{
    var el=document.getElementById('thumb'+num);
    if(!el) { return; }

    var wrapper;

    if(el.tagName.toLowerCase()=='img')
    {
        // first expansion - build the wrapper, remember the original thumbnail for collapsing back
        wrapper=document.createElement('span');
        wrapper.id='thumb'+num;
        wrapper.className='thumbwrap';
        wrapper.setAttribute('data-tsrc',el.getAttribute('src'));
        wrapper.setAttribute('data-twidth',el.getAttribute('width'));
        wrapper.setAttribute('data-theight',el.getAttribute('height'));
        wrapper.setAttribute('data-talt',el.getAttribute('alt'));
        wrapper.setAttribute('data-vsrc',vsrc);
        wrapper.setAttribute('data-vwidth',vwidth);
        wrapper.setAttribute('data-vheight',vheight);

        var collapse=document.createElement('a');
        collapse.href='javascript:void(0)';
        collapse.className='collapsevideo';
        collapse.appendChild(document.createTextNode('[-]'));
        collapse.onclick=function() { collapse_video(num); };

        wrapper.appendChild(collapse);
        wrapper.appendChild(document.createElement('br'));

        el.parentNode.replaceChild(wrapper,el);
    }
    else if(el.className=='thumbwrap')
    {
        // already expanded - just swap the loop mode, don't rebuild the whole wrapper
        wrapper=el;
        var oldvideo=wrapper.querySelector('video');
        if(oldvideo) { wrapper.removeChild(oldvideo); }
    }
    else { return; }

    var video=document.createElement('video');
    video.src=vsrc;
    video.width=vwidth;
    video.height=vheight;
    video.controls=true;
    video.autoplay=true;
    video.loop=loop;
    video.className='thumb';
    video.style.maxWidth='100%';
    video.style.height='auto';
    video.style.display='block';

    wrapper.appendChild(video);

    highlight_video_link(num,loop);
}

function collapse_video(num)
{
    var wrapper=document.getElementById('thumb'+num);
    if(!wrapper || wrapper.className!='thumbwrap') { return; }

    var vsrc=wrapper.getAttribute('data-vsrc');
    var vwidth=wrapper.getAttribute('data-vwidth');
    var vheight=wrapper.getAttribute('data-vheight');

    var img=document.createElement('img');
    img.id='thumb'+num;
    img.src=wrapper.getAttribute('data-tsrc');
    img.width=wrapper.getAttribute('data-twidth');
    img.height=wrapper.getAttribute('data-theight');
    img.alt=wrapper.getAttribute('data-talt');
    img.className='thumb';
    img.style.cursor='pointer';
    img.onclick=function() { set_video_mode(num,vsrc,vwidth,vheight,false); };

    wrapper.parentNode.replaceChild(img,wrapper);

    highlight_video_link(num,null);
}

function highlight_video_link(num,activeloop)
{
    var once=document.getElementById('playonce'+num);
    var loop=document.getElementById('loop'+num);
    if(once) { once.style.fontWeight=(activeloop===false)?'bold':'normal'; }
    if(loop) { loop.style.fontWeight=(activeloop===true)?'bold':'normal'; }
}

window.onunload=function(e)
{
	if(style_cookie)
	{
		var title=get_active_stylesheet();
		set_cookie(style_cookie,title,365);
	}
}

window.onload=function(e)
{
	var match;

	if(match=/#i([0-9]+)/.exec(document.location.toString()))
	if(!document.forms.postform.field4.value)
	insert(">>"+match[1]);

	if(match=/#([0-9]+)/.exec(document.location.toString()))
	highlight(match[1]);
}

if(style_cookie)
{
	var cookie=get_cookie(style_cookie);
	var title=cookie?cookie:get_preferred_stylesheet();
	set_stylesheet(title);
}
