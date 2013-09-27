var CandyExtend = (function(self) { return self; }(CandyExtend || {}));

CandyExtend.Modules = (function(self, Candy, $) {
	var muc_service = "";
	var aes_password = "";
	self.init = function(muc, pass){
		aes_password = window.location.hash;
		if(typeof aes_password == "string" || typeof aes_password == "String"){
			aes_password = $.trim(aes_password);
			if(aes_password.indexOf('#')==0){ aes_password = aes_password.replace('#', ''); }
		}else{
			aes_password = "";
		}
		muc_service = muc;
		Candy.View.Event.Message.beforeSend = function(message){
			var is_join = ($.trim(message)).indexOf('/join') == 0;
			if(is_join){
				var msg = message.replace(/\s+/g,' ').replace(/^\s+|\s+$/,'');
				var msg_arr = msg.split(' ');
				var room_jid = msg_arr[1];
				var room_pass = msg_arr[2];
				if(typeof room_pass != "undefined"){
					if(room_pass.length < 0){
						room_pass = null;
					}
				}
				if(typeof room_jid != "undefined"){
					if(room_jid.length > 0){
						if(room_jid.indexOf('@')<0){
							var muc_url = muc_service;
							room_jid = room_jid+'@'+muc_url;
						}
					}
				}
				Candy.Core.Action.Jabber.Room.Disco(room_jid);
				Candy.Core.getConnection().muc.join(room_jid, Candy.Core.getUser().getNick(), null, null, room_pass, {"maxchars": '0'});
				return "";
			}else{
				if(aes_password.length>0){
					message = encodeURIComponent(sjcl.encrypt(aes_password, message, {"mode": "ocb2", "ks": 256, "ts": 128}));
				}
				return message;
			}
		};
		Candy.View.Event.Message.beforeShow = function(args){
			if(aes_password.length>0) {
				try{
					args.message = decodeURIComponent(args.message);
					var dec = sjcl.decrypt(aes_password, args.message);
					if(dec.length < args.message.length){
						dec = sjcl.decrypt(aes_password, args.message);
					}
					return dec;
				}catch(e){
					return "";
				}
			}else{
				return args.message;
			}
		};
	};
	return self;
}(CandyExtend.Modules|| {}, Candy, jQuery));
