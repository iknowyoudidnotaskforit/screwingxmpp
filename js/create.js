
function byId(id){
	return document.getElementById(id);
}
function makelink(){
	var lang = byId('xmpp_lang')[byId('xmpp_lang').selectedIndex].value;
	var host = encodeURIComponent(removeWhitespace(byId('xmpp_host').value));
	var muc = encodeURIComponent(removeWhitespace(byId('xmpp_muc').value));
	var bind = encodeURIComponent(removeWhitespace(byId('xmpp_bind').value));
	var is_anon = removeWhitespace(byId('xmpp_isanon').value);
	var anon = encodeURIComponent(removeWhitespace(byId('xmpp_anon').value));
	var join = encodeURIComponent(removeWhitespace(byId('xmpp_join').value));
	is_anon = ((is_anon!==null) && (is_anon=="1" || is_anon=="yes" || is_anon=="true"));
	
	var link = "?lang="+lang+"&host="+host+"&muc="+muc+"&bind="+bind+"&join="+join;
	if(is_anon){
		link += "&anon=yes&anonymous="+anon;
	}else{
		link += "&anon=no";
	}
	link = (window.location.href).replace('create.html', 'index.html') + link;
	
	var encpass = removeWhitespace(byId('xmpp_enc_pass').value);
	if(encpass.length>0){
		link += '#'+encpass;
	}
	
	byId('xmpp_link').value = link;
}
function removeWhitespace(str){
	try{
		str = str.replace(new RegExp(" ", 'g'), "");
	}catch(e){
		str = null;
	}
	return str;
}
