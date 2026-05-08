/**
 * login.js
 */
var loginObj = {
		/**
		 * operator
		 */
		paramOperate : {
			/**
			 * business
			 */
			businessType : 'user',
			/**
			 * method
			 */
			method : {
				login : 'USER.login'
			}
		},
		/**
		 * initialize
		 */
		init : function() {
			this.langInit();
			this.checkSupportHtml5();
			this.eventList.bindLoginButton();
			this.eventList.bindLoginInput();
		},
		langInit : function() {
			$('li[name="li_login_logo"]').html( '<img src="images/'+langCmn.logoMain +'">');
			$('li[name="li_login_name"]').html( '<input placeholder="'+langLogin.loginUser +'" type="text" id="login_name">');
			$('li[name="li_login_passwd"]').html( '<input placeholder="'+langLogin.loginPass+'" type="password" id="login_password">');
			$('button[name="login_cmd"]').html( langCmn.cmdLogin);
		},
		/**
		 * event
		 */
		eventList : {
			/**
			 * login button
			 */
			bindLoginButton : function() {
				$('button').click(function(){
					loginObj.login();
				});
			},

			bindLoginInput : function(){
				$('#login_password').keydown(function(e){
					var curKey = e.which;
					if (curKey == 13){
						$('button').click();	
						return false;
					}
				});
			}
		},
		/**
		 * login
		 */
		login : function() {
//			lognote(1);
			var userName = $('#login_name').val();
			var password = $('#login_password').val();
			//var params = [[userName, password]];
			if ('' == password) {
				alert(langTip.invalidPasswdNull );
				return;
			}
			/*
			var url = rpcUrl + this.paramOperate.businessType;
			var method = this.paramOperate.method.login;
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onreadystatechange = function () {
				if (xhr.readyState != 4) {
					return;
				}
				if (xhr.status != 200) {
					return;
				}
				lognote('result------>' + xhr.responseText);
				loginObj.loginCallBack(JSON.parse(xhr.responseText).result);
			};
			xhr.send('{"method":"' + method + '","params":[{"loginuser":"' + userName + '","pass":"' + password + '"}]}');
			*/
		   			var params=[];
			params.push({loginuser:userName,pass:password}) ;
			lognote(params);
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.login, params, this.loginCallBack);		
		},
		/**
		 * login call back
		 */
		loginCallBack : function(data) {
			if (!data || !data.token ) {
				alert(langTip.errorUser );
				return;
			}
			var pro = window.location.protocol;
		  var domain = window.location.host;		
			//sessionStorage
//			lognote('token------>' + data.token);
			common.localdata.setSiData('token',data.token);
			common.localdata.setSiData('level',data.level);
			common.setLocalLang(0);
			if(data.mainpage)
			{
			    common.localdata.setSiData('mainPage',data.mainpage);
			    window.location.href = pro + '//' + domain +'/'+ data.mainpage + '#routeState';
			}
			else
			{
				  window.location.href = pro + '//' + domain +'/'+ '#routeState';
			}
		},
		/**
		 * html5 support
		 */
				checkSupportHtml5 : function() {
			
			 
if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7.") 
{ 
	var userImg  = $('#Aside ul li:eq(0) img');
	var password = $('input[type="password"]');
	var userName = $('#Aside ul li:eq(1) input');
	var footerText = $('#footerText');
			 	var button = $('button');
            	var passLi = password.parent();
            	var buttonLi = button.parent();
            	userImg.remove();
            	userName.remove();
            	password.remove();
            	button.remove();
            	footerText.remove();
            	passLi.html('<br><br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的浏览器不支持html5');
            	buttonLi.html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请升级或更换浏览器');					
} 
else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8.") 
{ 
	var userImg  = $('#Aside ul li:eq(0) img');
	var password = $('input[type="password"]');
	var userName = $('#Aside ul li:eq(1) input');
	var footerText = $('#footerText');
			 	var button = $('button');
            	var passLi = password.parent();
            	var buttonLi = button.parent();
            	userImg.remove();
            	userName.remove();
            	password.remove();
            	button.remove();
            	footerText.remove();
            	passLi.html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的浏览器不支持html5');
            	buttonLi.html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请升级或更换浏览器');			
} 
else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9.") 
{ 

} 
else if(navigator.appName == "Microsoft Internet Explorer") 
{ } 
	}
		
}

/**
 * execue after dom loaded
 */
$(function(){
	loginObj.init();
});
