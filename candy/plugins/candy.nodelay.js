var CandyHistory = (function(self) { return self; }(CandyHistory || {}));

CandyHistory.Hide = (function(self, Candy, $) {
	var originalOnMessage = Candy.Core.Event.Jabber.Room.Message;
	self.init = function() {
		Candy.Core.Action.Jabber.Room.Join = function(room_jid, room_pass){
			Candy.Core.Action.Jabber.Room.Disco(room_jid);
			// dear servers, get it or leave it...
			// http://www.tigase.org/content/muc-managing-discussion-history-does-not-work *sign*
			Candy.Core.getConnection().muc.join(room_jid, Candy.Core.getUser().getNick(), null, null, room_pass, {"maxchars": '0'});
		};
		Candy.Core.Event.Jabber.Room.Message = function(msg){
			// some servers still show return all the history, even if maxchars='0'.
			// strophe bug? server bug? sometimes this, sometimes that...
			var delay = msg.children('delay') ? msg.children('delay') : msg.children('x[xmlns="' + Strophe.NS.DELAY +'"]'),
					timestamp = delay !== undefined ? delay.attr('stamp') : null;
			var is_groupchat = !((msg.attr('type') == "chat") || (msg.attr('type') == "error"));
			var is_delayed_message = (delay.length > 0);
			if(is_groupchat && is_delayed_message){
				return true;
			}else{
				originalOnMessage(msg);
				return true;
			}
		};
	};
	return self;
}(CandyHistory.Hide || {}, Candy, jQuery));




