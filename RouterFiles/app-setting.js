/**
 * app-setting js
 */
var appObj = {
		/**
		 * operations
		 */
		paramOperate : {
			/**
			 * business type
			 */
			businessAppType : 'app',
			/**
			 * methods
			 */
			method : {
				getBase    	: 'APP.getBase',
				setBase    	: 'APP.setBase',
				getTr069    : 'APP.getTr069',
				setTr069    : 'APP.setTr069',
				getRipv2    : 'APP.getRipv2',
				setRipv2    : 'APP.setRipv2',
			}
		},
		/**
		 * initialise
		 */
		init : function() {
			this.langInit();
			this.maskShow = new maskCtrl(3, common.hideMask, common);			
			this.getBaseInfo();		
			this.getTr069Info();	
			this.getRipv2Info();
			this.eventList.bindBaseSaveButton();	
			this.eventList.bindTr069SaveButton();
			this.eventList.bindRipv2SaveButton();	
			this.eventList.bindRefreshAppInfo();		
		},
		
		langInit : function(){
			$('label[name="app_setup_title"]').html('<icon class="usbicon"></icon>'+langApp.serviceTitle);	
			$('label[name="tr069_title"]').html('<icon class="routeicon"></icon>'+langApp.tr069Title);
			$('label[name="ripv2_title"]').html('<icon class="lybicon"></icon>'+langApp.ripv2Title);

                        $('span[name="span_upnp"]').text(langApp.serviceUpnp);
			$('span[name="span_ssh"]').text(langApp.serviceSsh);
			$('span[name="span_igmp_proxy"]').text(langApp.serviceIgmp);
			$('span[name="span_mld_proxy"]').text(langApp.serviceMld);
			$('span[name="span_pptp_passthrough"]').text(langApp.pptppassthrough);
			$('span[name="span_l2tp_passthrough"]').text(langApp.l2tppassthrough);
			$('span[name="span_ipsec_passthrough"]').text(langApp.ipsecpassthrough);

			$('span[name="span_tr069_enable"]').text(langApp.tr069Title);
			$('span[name="span_tr069_acs_url"]').text(langApp.tr069AcsUrl);
			$('span[name="span_acs_user_name"]').text(langApp.tr069AcsUserName);
			$('span[name="span_acs_passwd"]').text(langApp.tr069AcsPasswd);
			$('span[name="span_inform_period"]').text(langApp.tr069InformPeriodTime);
			$('span[name="span_proxy_server"]').text(langApp.tr069ProxyIp);
			$('span[name="span_proxy_port"]').text(langApp.tr069ProxyPort);
			$('span[name="span_request_user_name"]').text(langApp.tr069RequestUserName);
			$('span[name="span_request_passwd"]').text(langApp.tr069RequestPasswd);
			$('span[name="span_base_port"]').text(langApp.tr069BasePort);

			$('span[name="span_ripv2_enable"]').text(langApp.ripv2Title);
			$('span[name="span_ripv2_update_time"]').text(langApp.ripv2UpdateTime);
			$('span[name="span_ripv2_timeout"]').text(langApp.ripv2RequestTimeout);
			$('span[name="span_ripv2_garbage_collect_time"]').text(langApp.ripv2GarbageCollectTime);
			$('span[name="span_ripv2_auth_mode"]').text(langApp.ripv2AuthModeName);
			$('span[name="span_ripv2_auth_passwd"]').text(langApp.ripv2AuthKey);
			$('span[name="span_ripv2_ipv6_enable"]').text(langApp.ripv2Ipv6Support);
			$('n[name="span_seconds"]').text(langCmn.second );

			$('a[name="a_ripv2_auth_open"]').text(langApp.ripv2AuthModeOpen);
			$('a[name="a_ripv2_auth_md5"]').text(langApp.ripv2AuthModeMd5);
			$('a[name="a_ripv2_auth_plaintext"]').text(langApp.ripv2AuthModePlainText);

			$('button#app_save_base').text(langCmn.cmdSaveSetting );
			$('button#app_save_tr069').text(langCmn.cmdSaveSetting );			
			$('button#app_save_ripv2').text(langCmn.cmdSaveSetting );
			
		},
		/**
		 * event list
		 */
		eventList : {
			bindRefreshAppInfo : function() {
				$('#app_refresh_button').click(function(){
					appObj.maskShow = new maskCtrl(3, common.hideMask, common);
					appObj.getBaseInfo();
					appObj.getTr069Info();
					appObj.getRipv2Info();					
				});
			},
			/**
			 * bind save function
			 */
			bindBaseSaveButton : function() {
				$('#app_save_base').click(function(){					
						appObj.saveBaseInfo();						
					});
			},	
			bindTr069SaveButton : function() {
				$('#app_save_tr069').click(function(){					
						appObj.saveTr069Info();						
					});
			},	
			bindRipv2SaveButton : function() {
				$('#app_save_ripv2').click(function(){					
						appObj.saveRipv2Info();						
					});
			},			
		},
		/**
		 *  get app base info
		 */
		getBaseInfo : function() {
			var paras=[];
			
			callRpc(rpcUrl + this.paramOperate.businessAppType + token, this.paramOperate.method.getBase, paras, this.baseInfoCallBack);
		},
		/**
		 * get base info call back
		 */
		baseInfoCallBack : function(data) {
			lognote("baseInfoCallBack");
			lognote(data);
						
			appObj.baseInfoProcess(data);			
			
			if ((appObj.maskShow != null) && appObj.maskShow)  {
				appObj.maskShow.decRef();      
			}
		},
		/**
		 * process app base info
		 */
		baseInfoProcess : function(data) {			
			var upnpObj = $('icon[name="upnp_enable"]');
			if (data.upnpenable) {
				upnpObj.removeClass('selected');
			}else {
				upnpObj.addClass('selected');
			}
			
			var sshObj = $('icon[name="ssh_enable"]');
			if (data.sshserverenable) {
				sshObj.removeClass('selected');
			}else {
				sshObj.addClass('selected');
			}
			
			var igmpObj = $('icon[name="igmp_proxy_enable"]');
			if (data.igmpproxyenable) {
				igmpObj.removeClass('selected');
			}else {
				igmpObj.addClass('selected');
			}
			
			var mldObj = $('icon[name="mld_proxy_enable"]');
			if (data.mldproxy) {
				mldObj.removeClass('selected');
			}else {
				mldObj.addClass('selected');
			}

			var mldObj = $('icon[name="pptp_passthrough_enable"]');
			if (data.pptpenable) {
				mldObj.removeClass('selected');
			}else {
				mldObj.addClass('selected');
			}

			var mldObj = $('icon[name="l2tp_passthrough_enable"]');
			if (data.l2tpenable) {
				mldObj.removeClass('selected');
			}else {
				mldObj.addClass('selected');
			}

			var mldObj = $('icon[name="ipsec_passthrough_enable"]');
			if (data.ipsecenable) {
				mldObj.removeClass('selected');
			}else {
				mldObj.addClass('selected');
			}
		},

		
		/**
		 * save app base setting
		 */
		saveBaseInfo : function() {
			common.showMask(langCmn.saveSetting);
			var baseInfo   = this.getBaseSetting();                           			                      
      lognote(baseInfo);
			callRpc(rpcUrl + this.paramOperate.businessAppType + token, this.paramOperate.method.setBase, baseInfo, function(data){lognote('Dslite--->' + data); common.hideMask();});
		},
		/**
		 * collect app base setting  
		 * @return params Array
		 */
		getBaseSetting : function() {
			var params = [];
			var upnpVal;
			var sshVal;
			var igmpVal;
			var mldVal;
			var pptpVal;
			var l2tpVal;
			var ipsecVal;
      
			upnpVal = $('icon[name=upnp_enable]').hasClass('selected') ? false : true;   						                       
			sshVal = $('icon[name=ssh_enable]').hasClass('selected') ? false : true; 					
		    
			igmpVal   = $('icon[name=igmp_proxy_enable]').hasClass('selected') ? false : true;                                                             
			mldVal   = $('icon[name=mld_proxy_enable]').hasClass('selected') ? false : true;   

			pptpVal   = $('icon[name=pptp_passthrough_enable]').hasClass('selected') ? false : true;   
			l2tpVal   = $('icon[name=l2tp_passthrough_enable]').hasClass('selected') ? false : true;   
			ipsecVal   = $('icon[name=ipsec_passthrough_enable]').hasClass('selected') ? false : true;   

			params.push({upnpenable:upnpVal,sshserverenable:sshVal,igmpproxyenable:igmpVal,mldproxy:mldVal,pptpenable:pptpVal,l2tpenable:l2tpVal,ipsecenable:ipsecVal});
			return params;
		},
		
		/**/
		/**
		 *  get app tr069 info
		 */
		getTr069Info : function() {
			var paras=[];
			
			callRpc(rpcUrl + this.paramOperate.businessAppType + token, this.paramOperate.method.getTr069, paras, this.tr069InfoCallBack);
		},
		/**
		 * get tr069 info call back
		 */
		tr069InfoCallBack : function(data) {
			lognote("tr069InfoCallBack");
			lognote(data);
						
			appObj.tr069InfoProcess(data);			
			
			if ((appObj.maskShow != null) && appObj.maskShow)  {
				appObj.maskShow.decRef();      
			}
		},
		/**
		 * process tr069 info
		 */
		tr069InfoProcess : function(data) {			
			var tr069EnableObj = $('icon[name="tr069_enable"]');
			if (data.tr069enable) {
				tr069EnableObj.removeClass('selected');
			}else {
				tr069EnableObj.addClass('selected');
			}
			$('input[name=acs_url]').val(data.acsurl);
			$('input[name=acs_username]').val(data.acsusername);
			$('input[name=acs_passwd]').val(data.acspassword);
			$('input[name=notification_time]').val(data.notificationtime);
			
			var proxySrvAddrArray = data.proxyipaddr.split('.');
			for (var z = 0; z < proxySrvAddrArray.length; z++) {
				$('#proxy_srv_ip' + z).val(proxySrvAddrArray[z]);
			}
			$('input[name=proxy_srv_port]').val(data.proxyport);			
			$('input[name=request_username]').val(data.requestusername);			
			$('input[name=request_passwd]').val(data.requestpassword);
			
			$('input[name=base_port]').val(data.baseport);
		},

		
		/**
		 * save app tr069 setting
		 */
		saveTr069Info : function() {
			common.showMask(langCmn.saveSetting);
			var tr069Info   = this.getTr069Setting();                           			                      
      lognote(tr069Info);
			callRpc(rpcUrl + this.paramOperate.businessAppType + token, this.paramOperate.method.setTr069, tr069Info, function(data){lognote('Tr069--->' + data); common.hideMask();});
		},
		/**
		 * collect app tr069 setting  
		 * @return params Array
		 */
		getTr069Setting : function() {
			var params = [];
			var enableVal;
			var acsUrlStr;
			var acsUserNameStr;
			var acsPasswdStr;
			var notifyTime;
			var proxySrcIpVal;
			var proxyPort;
			var reqUserNameStr;
			var reqPasswdStr;
			var basePort;
      
			enableVal = $('icon[name=tr069_enable]').hasClass('selected') ? false : true;   						                       
			acsUrlStr = $('input[name=acs_url]').val();  
			acsUserNameStr=$('input[name=acs_username]').val();
			acsPasswdStr=$('input[name=acs_passwd]').val();
			notifyTime=parseInt($('input[name=notification_time]').val(),10); 	
			
			var ipInputArray = $('#proxy_srv_li').find('input');
			var ipArray=[];	
			for (var i = 0; i < ipInputArray.length; i++) {
					ipArray.push($(ipInputArray[i]).val().trim());					
			}
			proxySrcIpVal = ipArray.join('.');				
		  proxyPort=$('input[name=proxy_srv_port]').val();			
			reqUserNameStr=$('input[name=request_username]').val();			
			reqPasswdStr=$('input[name=request_passwd]').val();
			
			basePort=parseInt($('input[name=base_port]').val(),10);			   

			params.push({tr069enable:enableVal,acsurl:acsUrlStr,acsusername:acsUserNameStr,acspassword:acsPasswdStr,notificationtime:notifyTime,proxyipaddr:proxySrcIpVal,proxyport:proxyPort,requestusername:reqUserNameStr,requestpassword:reqPasswdStr,baseport:basePort});
			return params;
		},
		
		/**/
		/**
		 *  get app ripv2 info
		 */
		getRipv2Info : function() {
			var paras=[];
			
			callRpc(rpcUrl + this.paramOperate.businessAppType + token, this.paramOperate.method.getRipv2, paras, this.ripv2InfoCallBack);
		},
		/**
		 * get ripv2 info call back
		 */
		ripv2InfoCallBack : function(data) {
			lognote("ripv2InfoCallBack");
			lognote(data);
						
			appObj.ripv2InfoProcess(data);			
			
			if ((appObj.maskShow != null) && appObj.maskShow)  {
				appObj.maskShow.decRef();      
			}
		},
		/**
		 * process ripv2 info
		 */
		ripv2InfoProcess : function(data) {			
			var ripv2EnableObj = $('icon[name="ripv2_enable"]');
			if (data.ripv2enable) {
				ripv2EnableObj.removeClass('selected');
			}else {
				ripv2EnableObj.addClass('selected');
			}
			$('input[name=update_time]').val(data.updatetime);
			$('input[name=timeout_time]').val(data.timeout);
			$('input[name=garbage_time]').val(data.garbagecollecttime);
			$('#auth_mode').find('h3').html($('#auth_mode' + ' a[value='+data.authencationmode+']').text() + '<icon></icon>');
      $('#auth_mode').find('h3').attr('value', data.authencationmode);
      
			$('input[name=auth_passwd]').val(data.authencationkey);
			var ipv6EnableObj = $('icon[name="ipv6_enable"]');
			if (data.ipv6enable) {
				ipv6EnableObj.removeClass('selected');
			}else {
				ipv6EnableObj.addClass('selected');
			}
			
		},

		
		/**
		 * save app ripv2 setting
		 */
		saveRipv2Info : function() {
			common.showMask(langCmn.saveSetting);
			var ripv2Info   = this.getRipv2Setting();                           			                      
      lognote(ripv2Info);
			callRpc(rpcUrl + this.paramOperate.businessAppType + token, this.paramOperate.method.setRipv2, ripv2Info, function(data){lognote('Set Ripv2 Reply--->' + data); common.hideMask();});
		},
		/**
		 * collect app ripv2 setting  
		 * @return params Array
		 */
		getRipv2Setting : function() {
			var params = [];
			var enableVal;
			var updateTime;
			var timeoutVal;
			var garbageCollectTime;
			var authModeStr;
			var authencationkeyStr;
			var ipv6Val;

      
			enableVal = $('icon[name=ripv2_enable]').hasClass('selected') ? false : true;   						                       
			updateTime=parseInt($('input[name=update_time]').val(),10);
			timeoutVal=parseInt($('input[name=timeout_time]').val(),10);
			garbageCollectTime=parseInt($('input[name=garbage_time]').val(),10);
			authModeStr = $('#auth_mode').find('h3').attr('value');				
			authencationkeyStr=$('input[name=auth_passwd]').val();	
			ipv6Val = $('icon[name=ipv6_enable]').hasClass('selected') ? false : true;	   

			params.push({ripv2enable:enableVal,updatetime:updateTime,timeout:timeoutVal,garbagecollecttime:garbageCollectTime,authencationmode:authModeStr,authencationkey:authencationkeyStr,ipv6enable:ipv6Val});
			return params;
		},
		
}


/**
 * after dom finished 
 */
$(function(){
	appObj.init();
});
