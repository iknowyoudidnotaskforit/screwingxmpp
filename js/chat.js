
function chat_home(){

//---START-INIT---------------------------------------------------------

this.init = new Object();
this.init.start = function(){
	var loc = window.location;
	var search = loc.search;
	if(typeof search != "undefined" && search.length > 0){
		search = search.replace('?', '');
		search = $.trim(search);
		search = xmppWebclient.tools.searchToObject();
		if(search.host){
			xmppWebclient.login.connect(search);
			return;
		}
		if(search.lang){
			var lang = search.lang;
			if(lang == "de"){
				xmppWebclient.init.initWithLang(lang);
				return;
			}
		}
	}
	xmppWebclient.init.initDisplay();
	xmppWebclient.init.getData();
	xmppWebclient.init.initBindings();
};
this.init.initWithLang = function(lang){
	$.ajax("./data/"+lang+".xml")
	.done(function(data){
		/*
		 * GET PAGE IN CORRECT LANGUAGE
		 * */
		var div_login = xmppWebclient.tools.xmlToString(data.getElementsByTagName('divlogin')[0]);
		div_login = div_login.replace(new RegExp("</input>;", 'g'), "");
		$('#xmpp_webclient_login_form').html(div_login);
		
		xmppWebclient.init.initDisplay();
		xmppWebclient.init.getData();
		xmppWebclient.init.initBindings();
		
	})
	.fail(function(){
		
	})
	.always(function(){
		
	});
};
this.init.getData = function(){
	/*
	* GET LIST OF SUPPORTED XMPP SERVERS
	* */
	xmppWebclient.login.getServerList();
};
this.init.initDisplay = function(){
	$('.xmpp.webclient.login.optional').css('display', 'none');
};
this.init.initBindings = function(){
	/*
	 * GET ADD BUTTON EVENTS ETC.
	 * */
	$('#xmpp_webclient_login_button').click(function(){
		xmppWebclient.login.connect();
	});
	$('#xmpp_webclient_enter_serverdetails').click(function(){
		$('.xmpp.webclient.login.optional').css('display', 'block');
		$('#xmpp_webclient_login_servers_label').css('display', 'none');
		$('#xmpp_webclient_login_servers').css('display', 'none');
		$('#xmpp_webclient_enter_serverdetails').css('display', 'none');
	});
	$('#xmpp_webclient_login_hide_optional').click(function(){
		$('.xmpp.webclient.login.optional').css('display', 'none');
		$('#xmpp_webclient_login_servers_label').css('display', 'block');
		$('#xmpp_webclient_login_servers').css('display', 'block');
		$('#xmpp_webclient_enter_serverdetails').css('display', 'block');
		$('input.xmpp.webclient.login.optional').attr('value', '');
	});
};

//---END-INIT-----------------------------------------------------------


//---START-LOGIN--------------------------------------------------------
this.login = new Object();
this.login.xmppServers = new Array();
this.login.xmppServer = function(host, bind, muc){
	return {"host": host, "bind": bind, "muc": muc};
};
this.login.candyLanguages = new Array('en', 'de', 'fr', 'es', 'nl', 'cn', 'ja');
this.login.getServerList = function(){
	$.ajax("./data/servers.xml")
	.done(function(data) {
		data = $(data);
		data.find('server').each(function(){
			var host = $(this).find('host').html()+"";
			var bind = $(this).find('bind').html()+"";
			var muc = $(this).find('muc').html()+"";
			var s = new xmppWebclient.login.xmppServer(host, bind, muc);
			xmppWebclient.login.xmppServers.push(s);
		});
		xmppWebclient.login.populateServerList();
		xmppWebclient.login.populateLanguageList();
	})
	.fail(function() {
		
	})
	.always(function() {
		
	});
};
this.login.getServerFromList = function(host){
	var servers = xmppWebclient.login.xmppServers;
	var len = servers.length; var i;
	var server = null;
	for(i=0; i<len; i++){
		server = servers[i];
		if(server.host == host){
			break;
		}
	}
	return server;
};
this.login.populateServerList = function(){
	var servers = xmppWebclient.login.xmppServers;
	var len = servers.length; var i;
	for(i=0; i<len; i++){
		var server = servers[i];
		var option_node = document.createElement('option');
		option_node.value = server["host"];
		option_node.innerHTML = server["host"];
		option_node.className = "xmpp webclient login";
		$('#xmpp_webclient_login_servers').append(option_node);
	}
	return;
};
this.login.populateLanguageList = function(){
	var langs = xmppWebclient.login.candyLanguages;
	var len = langs.length; var i;
	for(i=0; i<len; i++){
		var l = langs[i];
		var option_node = document.createElement('option');
		option_node.value = l;
		option_node.innerHTML = l;
		option_node.className = "xmpp webclient login";
		$('#xmpp_webclient_login_languages').append(option_node);
	}
	return;
};

this.login.connect = function(params){
	if(typeof params != "undefined" && (typeof params == "object" || typeof params == "Object" || typeof params == "Array")){
		var candy_lang = params.lang;
		var candy_host = params.host;
		var candy_muc = params.muc;
		var candy_bind = params.bind;
		var candy_rooms = params.join;
		candy_rooms = candy_rooms.split(',');
		var candy_rooms_len = candy_rooms.length; var i;
		for(i=0; i<candy_rooms_len; i++){
			var candy_room = $.trim(candy_rooms[i]);
			if(candy_room.indexOf('@')<0){
				candy_room += "@"+candy_muc;
			}
			candy_rooms[i] = candy_room;
		}
		var candy_rooms_json = JSON.parse(JSON.stringify(candy_rooms));
		
		$('div').not('#candy').css("display", "none");
		if(params.anon=="yes"){
			console.log(candy_rooms);
			var candy_anon = params.anonymous;
			Candy.init(candy_bind, {
				core: { //debug: true ,
						autojoin: candy_rooms_json
				},
				view: { resources: './candy/res/',
						language: candy_lang
				}
			});
			CandyExtend.Modules.init(candy_muc);
			CandyHistory.Hide.init();
			Candy.Core.connect(candy_anon);
		}else{
			Candy.init(candy_bind, {
				core: { //debug: true ,
						autojoin: candy_rooms_json
				},
				view: { resources: './candy/res/',
						language: candy_lang
				}
			});
			CandyExtend.Modules.init(candy_muc);
			CandyHistory.Hide.init();
			Candy.Core.connect();
		}
	}else{
		var candy_lang = $('#xmpp_webclient_login_languages').find(':selected').text();
		var sel_server = $('#xmpp_webclient_login_servers').find(':selected').text();
		sel_server = xmppWebclient.login.getServerFromList(sel_server);
		var candy_host = $.trim(sel_server.host);
		var candy_bind = $.trim(sel_server.bind);
		var candy_muc = $.trim(sel_server.muc);
		
		if($.trim($('#xmpp_webclient_login_optional_host').attr('value')).length>0){
			candy_host = $.trim($('#xmpp_webclient_login_optional_host').attr('value'));
		}
		if($.trim($('#xmpp_webclient_login_optional_http').attr('value')).length>0){
			candy_bind = $.trim($('#xmpp_webclient_login_optional_http').attr('value'));
		}
		if($.trim($('#xmpp_webclient_login_optional_muc').attr('value')).length>0){
			candy_muc = $.trim($('#xmpp_webclient_login_optional_muc').attr('value'));
		}
		
		var candy_jid = $.trim($('#xmpp_webclient_login_jid').attr('value'));
		if(candy_jid.indexOf('@')<0){
			candy_jid = candy_jid+"@"+candy_host;
		}
		var candy_pass = $.trim($('#xmpp_webclient_login_pass').attr('value'));
		var candy_rooms = $.trim($('#xmpp_webclient_login_rooms').attr('value'));
		candy_rooms = candy_rooms.split(',');
		var candy_rooms_len = candy_rooms.length; var i;
		for(i=0; i<candy_rooms_len; i++){
			var candy_room = $.trim(candy_rooms[i]);
			if(candy_room.indexOf('@')<0){
				candy_room += "@"+candy_muc;
			}
			candy_rooms[i] = candy_room;
		}
		var candy_rooms_json = JSON.parse(JSON.stringify(candy_rooms));
		$('div').not('#candy').css("display", "none");
		Candy.init(candy_bind, {
			core: { //debug: true ,
					autojoin: candy_rooms_json
			},
			view: { resources: './candy/res/',
					language: candy_lang
			}
		});
		CandyExtend.Modules.init(candy_muc);
		CandyHistory.Hide.init();
		Candy.Core.connect(candy_jid, candy_pass);
	}
};
//---END-LOGIN----------------------------------------------------------

//---START-TOOLS--------------------------------------------------------
this.tools = new Object();
this.tools.xmlToString = function(doc){
	if (window.ActiveXObject){
        xmlString = doc.xml;
    }
    else{
        xmlString = (new XMLSerializer()).serializeToString(doc);
    }
    return xmlString;
};
this.tools.searchToObject = function(){
  var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue;

    pair = pairs[i].split("=");
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
  }

  return obj;
};
//---END-TOOLS----------------------------------------------------------

};
var xmppWebclient = new chat_home();
$(document).ready(function(){
	xmppWebclient.init.start();
});
