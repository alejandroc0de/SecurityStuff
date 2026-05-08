/**
 * connection device js
 */
var connectionDevice = {
		/**
		 * operator
		 */
		paramOperate : {
			/**
			 * business type
			 */
			businessRouterType  : 'router',
			/**
			 * methods
			 */
			method : {
				getAssocList : 'DEVICE.getAssocList',
				getHistoryDevList : 'DEVICE.getHistoryDevList',
				getBlackList : 'DEVICE.getBlackList',
				addBlackList : 'DEVICE.addBlackList',
				deleteBlackList : 'DEVICE.deleteBlackList',
				getPassthroughList : 'DEVICE.getPassthroughList',
				addPassthroughList : 'DEVICE.addPassthroughList',
				deletePassthroughList : 'DEVICE.deletePassthroughList',				
				setHomeCtrl : 'QOS.setParentalControl',
				getHomeCtrl : 'QOS.getParentalControl',
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.langInit();
			this.maskShow = new maskCtrl(4, common.hideMask, common);
			this.getAssocList();
			this.getHistoryDevList();
			this.getBlackList();
			this.getPassthroughList();


			this.eventList.bindOnlineAndBlackListRefreshButton();
			this.eventList.bindOpenHomeCtrl();
			this.homeCtrl = new Array();

			var refreshFunc = function() {
				if ($('#connecting_device').length == 0) {
					clearInterval(refreshId);
					return;
				}

				if ($('input.edit').length == 0){
					connectionDevice.getAssocList();
					connectionDevice.getHistoryDevList();
					connectionDevice.getBlackList();
					connectionDevice.getPassthroughList();
				}
			};

			/*var refreshId = setInterval(refreshFunc, 5000);*/
			var refreshId = setInterval(refreshFunc, 50000);
		},
        langInit : function(){
			$('label[name="lab_online_device"]').html('<icon class="wifiicon"></icon>'+langDevice.onlineDeviceTitle+'<n id="online_count">（0）</n>');
			$('label[name="lab_history_device"]').html('<icon class="whtielist"></icon>'+langDevice.historyDeviceTitle+'<n id="history_count">（0）</n>');
			$('label[name="lab_black_device"]').html('<icon class="blacklist"></icon>'+langDevice.blackDeviceTitle+'<n id="black_count">（0）</n>');
			$('label[name="lab_passthrough_device"]').html('<icon class="whtielist"></icon>'+langDevice.passthroughDeviceTitle+'<n id="passthrough_count">（0）</n>');
			$('label[name="lab_parent_ctl"]').html('<icon class="lybicon"></icon>'+langDevice.parentSetupTitle);
			$('label[name="lab_time_edit"]').html(langDevice.openTimeSetup);

			$('dd[name="dd_od_mac_addr"]').html( langDevice.devMac+':[macaddr]');
			$('dd[name="dd_od_ip_addr"]').html( langDevice.onlineDevIp+':[ipaddr]');
			$('dd[name="dd_od_ipv6_addr"]').html( langDevice.onlineDevIpv6+':[ipv6addr]');
                        $('dd[name="dd_hd_device_name"]').html(langDevice.devName);
			$('dd[name="dd_hd_mac_addr"]').html( langDevice.devMac+':[macaddr]');
			$('dd[name="dd_bd_mac_addr"]').html( langDevice.devMac+':[macaddr]');

			$('a[name="a_open_time"]').text(langDevice.openTimeUint);
			$('a[name="a_close_time"]').text(langDevice.closeTimeUint);

                        $('span[name="span_date"]').text(langDevice.dateLabel);
			$('label[name="lab_every_day"]').html('<icon class="radiocheck" name="everyday"></icon><input name="link" type="radio">'+langDevice.dateEveryDay);
                        $('label[name="lab_day_monday"]').html('<icon class="radiocheck" name="monday"   ></icon><input type="radio">'+langDevice.weekMonday);
			$('label[name="lab_day_tuesday"]').html('<icon class="radiocheck" name="wednesday"></icon><input type="radio">'+langDevice.weekTuesday);
			$('label[name="lab_day_wednesday"]').html('<icon class="radiocheck" name="wednesday"></icon><input type="radio">'+langDevice.weekWednesday);
			$('label[name="lab_day_thursday"]').html('<icon class="radiocheck" name="thursday" ></icon><input type="radio">'+langDevice.weekThursday);
			$('label[name="lab_day_friday"]').html('<icon class="radiocheck" name="friday"   ></icon><input type="radio">'+langDevice.weekFriday);
			$('label[name="lab_day_satday"]').html('<icon class="radiocheck" name="satday"   ></icon><input type="radio">'+langDevice.weekSaturday);
			$('label[name="lab_day_sunday"]').html('<icon class="radiocheck" name="sunday"   ></icon><input type="radio">'+langDevice.weekSunday);

			$('span[name="span_time"]').text(langDevice.timeLabel);
			$('label[name="lab_every_hour"]').html('<icon class="radiocheck" name="wholeday"></icon><input name="link" type="radio"'+langDevice.timeAllDay);

			$('button[name="jiaru"]').text(langDevice.cmdAddToBlack );
			$('button[name="yichu"]').text(langDevice.cmdRemoveFromBlack );

			$('button[name="addpth"]').text(langDevice.cmdAddToPassthrough );
			$('button[name="removepth"]').text(langDevice.cmdRemoveFromPassthrough );

		},
		/**
		 * 事件绑定集合
		 */
		eventList : {
			/**
			 * 绑定加入黑名单按钮事件
			 */
			bindAddBlacklistButton : function() {
				$('.wan_select').find('.enterbut[name="jiaru"]').off().on('click', function(){
					var that = $(this);
					var currMac = that.parent().find('dd[data-name="mac"]').text().replace('MAC地址：','');
					connectionDevice.addBlackList(currMac);
				});
			},
			/**
			 * 绑定移除黑名单按钮事件
			 */
			bindDelBlacklistButton : function() {
				$('.wan_select').find('.enterbut[name="yichu"]').off().on('click', function(){
					var that = $(this);
					var currMac = that.prev().find('dd[data-name="mac"]').text().replace('MAC地址：','');
					connectionDevice.removeBlackList(currMac);
				});

			},
			/**
			 * 绑定加入透传名单按钮事件
			 */
			bindAddPassthroughlistButton : function() {
				$('.wan_select').find('.enterbut[name="addpth"]').off().on('click', function(){
					var that = $(this);
					var currMac = that.parent().find('dd[data-name="mac"]').text().replace('MAC地址：','');
					connectionDevice.addPassthroughList(currMac);
				});
			},
			/**
			 * 绑定移除黑名单按钮事件
			 */
			bindDelPassthroughlistButton : function() {
				$('.wan_select').find('.enterbut[name="removepth"]').off().on('click', function(){
					var that = $(this);
					var currMac = that.prev().find('dd[data-name="mac"]').text().replace('MAC地址：','');
					connectionDevice.removePassthroughList(currMac);
				});

			},
			/**
			 * 绑定在线设备/黑名单刷新按钮事件
			 */
			bindOnlineAndBlackListRefreshButton : function() {
				$('#online_black_button').click(function(){
					connectionDevice.maskShow = new maskCtrl(3, common.hideMask, common);
					connectionDevice.getAssocList();                      //
					connectionDevice.getBlackList();                      //
					connectionDevice.getHistoryDevList();                 //
					connectionDevice.getPassthroughList();                 //
				});
			},

			/**
			 * 绑定家长设置打开按钮
			 */
			bindOpenHomeCtrl: function() {
				$('.wan_select').on("click",".home_but",function(){
					var mac  = $(this).attr("name");
					if($('.home[name="' + mac + '"]').length == 0) {
						var reg  = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
						var html = document.getElementById("homectrl_device").innerHTML;

						html = html.replace(reg, function(node, key) {
							return {"macaddr":mac}[key];
						});
						$(".infor").append(html);

						//添加时间单元添加按钮事件
						$('.home[name="' + mac + '"]').on('click', '.addtimeunit', function(){
							var mac      = $(this).parent().parent().attr("name");
							var unitList = $(this).parent().prev();
							var count    = unitList.find('> div').length;
							var html     = document.getElementById('parent_ctrl').innerHTML;
							unitList.html(unitList.html() + html);
							unitList.find('> div:last span:first').text('时间单元' + (count + 1));
							connectionDevice.bindTimeUnitEvent(unitList);
						});

						//家长控制关闭
						$('.home[name="' + mac + '"]').on("click", '.home_icon', function(){
							var mac = $(this).parent().parent().parent().attr("name");
							common.homeC = false;
							$(".coonent").show();
							$('.home[name="' + mac + '"]').css("position","absolute").animate({left:"100%"},400);
						});

						$('.home[name="' + mac + '"]').on('click', '.savetimeunit', function(){
							var isSet = true;
							var timeUnits = [];
							var length = $(this).parent().prev().find('> div').length;
							var tmac   = $('.home[name="' + mac + '"]').attr('name');

							for (var i = 0; i < length; i++) {
								var timeUnit = new Object();
								var tdays = new Array();
								var unit = $(this).parent().prev().find('> div')[i];

								if ($(unit).find('.select > h3').hasClass('opentimeunit')){
									var days = $(unit).find(':nth-child(4)').find('.radiocheck');
									for (var j = 0; j < days.length; j++) {
										if ($(days[j]).hasClass('selected')) {
											tdays.push(j + 1);
										}
									}

									var startTime;
									var endTime;
									if ($(unit).find('.radiocheck[name=wholeday]').hasClass('selected')){
										startTime = '00:00:00';
										endTime   = '23:59:59';
									} else{
										var times = $(unit).find('div > input');
										startTime = $(times[0]).val() + ':' + $(times[1]).val() + ':' + '00';
										endTime   = $(times[2]).val() + ':' + $(times[3]).val() + ':' + '00';
									}

									if ((tdays.length != 0) && (startTime < endTime)){
										timeUnit.enable    = true;
										timeUnit.macaddr   = tmac;
										timeUnit.weekdays  = tdays;
										timeUnit.starttime = startTime;
										timeUnit.endtime   = endTime;
										timeUnits.push(timeUnit);
									} else{
										isSet = false;
										if (startTime >= endTime){
											$(unit).find('input[type="text"]').css('color','#e01a00');
										}
										if (tdays.length == 0){
											$(unit).find('.radiocheck:not([name="wholeday"])').css('border','1px solid #e01a00');
										}
										continue;
									}
									if ((connectionDevice.homeCtrl[mac][i]) && (connectionDevice.homeCtrl[mac][i] != null)){
										var old = connectionDevice.homeCtrl[mac][i];
										if ((timeUnit.starttime != old.starttime) || (timeUnit.endtime != old.endtime)
										 || (timeUnit.weekdays.sort().toString() != old.weekdays.sort().toString())){
											connectionDevice.homeCtrl[mac][i].enable = false;
											connectionDevice.homeCtrl[mac][i].enabled = undefined;
											timeUnits.push(connectionDevice.homeCtrl[mac][i]);
											lognote(connectionDevice.homeCtrl[mac][i]);
										}
									}
								} else{
									if ((connectionDevice.homeCtrl[mac][i]) && (connectionDevice.homeCtrl[mac][i] != null)){
										connectionDevice.homeCtrl[mac][i].enable = false;
										connectionDevice.homeCtrl[mac][i].enabled = undefined;
										timeUnits.push(connectionDevice.homeCtrl[mac][i]);
									}
								}
							}

							if (isSet == false){
								jAlert(langTip.errorTimeSet , langCmn.capError);
								return;
							}

							var u;
							var l = timeUnits.length;
							for (; u = timeUnits.shift();) {
								lognote("--------- timeUnits.length ----------", timeUnits.length);
								connectionDevice.maskShow = new maskCtrl(l, function(mac) {
									callRpc(rpcUrl + connectionDevice.paramOperate.businessRouterType + token,
										connectionDevice.paramOperate.method.getHomeCtrl, mac, {
											success: function(data, mac) {
												connectionDevice.echoHomeCtrlInfo(data, mac);
												common.hideMask();
											},
											failure: function(data, mac) {
												common.hideMask();
											}

										}, mac);
								}, common, mac);
								callRpc(rpcUrl + connectionDevice.paramOperate.businessRouterType + token,
									connectionDevice.paramOperate.method.setHomeCtrl, u, {
										success: function(data) {
											if ((connectionDevice.maskShow != null) && connectionDevice.maskShow){
												connectionDevice.maskShow.decRef();
											}
										},
										failure: function(data) {
											if ((connectionDevice.maskShow != null) && connectionDevice.maskShow){
												connectionDevice.maskShow.decRef();
											}
										}

								});
							}

						});

						common.showMask(langTip.tipUpdateParentCtl );
						callRpc(rpcUrl + connectionDevice.paramOperate.businessRouterType + token,
								connectionDevice.paramOperate.method.getHomeCtrl, mac, {
									success: function(data, mac) {
										connectionDevice.echoHomeCtrlInfo(data, mac);
										common.hideMask();
									},
									failure: function(data, mac) {
										common.hideMask();
									}

						}, mac);
					}

					common.homeC = true;
					$('.home[name="' + mac + '"]').animate({left:0},400,function(){
						$(".coonent").hide();
						$('.home[name="' + mac + '"]').css("position","static");
					});
				});
			}



		},
		/**
		 * 回显家长控制信息
		 */
		echoHomeCtrlInfo: function(data, mac) {
			var unitList = $('.home[name="' + mac + '"]').find('.wan_select');
			unitList.html("");
			var count    = unitList.find('> div').length;
			var html     = document.getElementById('parent_ctrl').innerHTML;
			connectionDevice.homeCtrl[mac] = new Array();
			lognote(data);

			for (var i = 0; i < data.length; i++) {
				var dayselCount = 0;
				var unitObj  = data[i];
				unitList.html(unitList.html() + html);
				unit = unitList.find('> div:last');
				unit.find('span:first').text(langDevice.timeUnit + (count + 1 + i));
				var weekdays = unit.find('li:nth-child(4)').find('.radiocheck');
				for (var j = 0; j < unitObj.weekdays.length; j++) {
					var w = unitObj.weekdays[j];
					$(weekdays[w - 1]).addClass("selected");
					if (unitObj.weekdays[j]){
						dayselCount ++;
					}
					if (dayselCount == 7){
						unit.find('li:nth-child(3)').find('.radiocheck').addClass("selected");
					}
				}

				if ((unitObj.starttime == '00:00:00') && (unitObj.endtime == '23:59:59')) {
					unit.find('icon[name="wholeday"]').addClass("selected");
					unit.find('input[type="text"]').css('color','#e0dfdf');
				}
				$(unit.find('input[type="text"]')[0]).attr('value', unitObj.starttime.slice(0,2));
				$(unit.find('input[type="text"]')[1]).attr('value', unitObj.starttime.slice(3,5));
				$(unit.find('input[type="text"]')[2]).attr('value', unitObj.endtime.slice(0,2));
				$(unit.find('input[type="text"]')[3]).attr('value', unitObj.endtime.slice(3,5));

				connectionDevice.homeCtrl[mac][i] = unitObj;
				connectionDevice.bindTimeUnitEvent(unitList);
			}

		},

		bindTimeUnitEvent:function(unitList) {
			unitList.find('> div').find('.radiocheck').off().on("click",function(){
				if (($(this).attr('name')) && ($(this).attr('name') != "wholeday")){
					$(this).parent().parent().parent().find('.radiocheck').css('border','1px solid #00c8e0');
				}
				$(this).toggleClass("selected");

				if ($(this).attr('name') == 'everyday'){
					if ($(this).hasClass('selected')){
						$(this).parent().parent().next().find('.radiocheck').addClass("selected");
					}else {

						$(this).parent().parent().next().find('.radiocheck').removeClass("selected");
					}
				}

				if (($(this).attr('name') == 'monday')  || ($(this).attr('name') == 'tuesday')
				|| ($(this).attr('name') == 'wednesday')|| ($(this).attr('name') == 'thursday')
				|| ($(this).attr('name') == 'friday')   || ($(this).attr('name') == 'satday')
				|| ($(this).attr('name') == 'sunday')){
					 ($(this).parent().parent().find('.selected').length == 7) ?
						$(this).parent().parent().prev().find('.radiocheck').addClass("selected") :
						$(this).parent().parent().prev().find('.radiocheck').removeClass("selected");
				}

				if ($(this).attr('name') == 'wholeday'){
					if ($(this).hasClass('selected')) {
						$(this).parent().parent().next().find('input').css('color','#e0dfdf');
					}else {
						$(this).parent().parent().next().find('input').css('color','#656565');
					}
				}

			});

			unitList.find('> div').find('.up').off().on("click",function(){
				if ($(this).parent().parent().find('.radiocheck[name=wholeday]').hasClass('selected') == false){
					$(this).parent().parent().find('input[type="text"]').css('color','#656565');
				}
				var tval = parseInt($(this).prev().val()) + 1;
				if ($(this).hasClass('hours')) {
					tval = (tval == 24) ? 0:tval;
				}else {
					tval = (tval == 60) ? 0:tval;
				}

				if(tval < 10) {
					tval = '0' + tval.toString();
				}else{
					tval = tval.toString();
				}
				$(this).prev().val(tval);
				$(this).prev().attr('value',tval);
			});

			unitList.find('> div').find('.down').off().on("click",function(){
				if ($(this).parent().parent().find('.radiocheck[name=wholeday]').hasClass('selected') == false){
					$(this).parent().parent().find('input[type="text"]').css('color','#656565');
				}
				var tval = parseInt($(this).prev().prev().val()) - 1;
				if ($(this).hasClass('hours')) {
					tval = (tval < 0) ? 23:tval;
				}else {
					tval = (tval < 0) ? 59:tval;
				}

				if(tval < 10) {
					tval = '0' + tval.toString();
				}else{
					tval = tval.toString();
				}
				$(this).prev().prev().val(tval);
				$(this).prev().prev().attr('value',tval);
			});

			unitList.find('.select').off().on("click",function(e){
				e.stopPropagation();
				if(!$(this).hasClass("open")){
					$(common.el.select).removeClass("open");
					$("aside").slideUp(100);
				};
				$(this).toggleClass("open");
				$(this).find("aside").slideToggle(100);
			}).find("a").off().on("click",function(){
				$(this).parent().parent().find("h3").html($(this).html()+"<icon></icon>");
				var unit = $(this).parent().parent().parent().parent();
				if ($(this).hasClass('closetimeunit')){
					$(this).parent().parent().find("h3").addClass('closetimeunit');
					$(this).parent().parent().find("h3").removeClass('opentimeunit');
					unit.find('.radiocheck').css('border','1px solid #e0dfdf');
					unit.find('input[type="text"]').css('color','#e0dfdf');
				}else {
					$(this).parent().parent().find("h3").addClass('opentimeunit');
					$(this).parent().parent().find("h3").removeClass('closetimeunit');
					unit.find('.radiocheck').css('border','1px solid #00c8e0');
					unit.find('input[type="text"]').css('color','#656565');
				}
			});

		},

		/**
		 * 获取关联Station信息列表
		 */
		getAssocList : function() {
			callRpc(rpcUrl + this.paramOperate.businessRouterType + token, this.paramOperate.method.getAssocList, null, this.assocListCallBack);
		},
		/**
		 * 获取关联station信息回调
		 */
		assocListCallBack : function(data) {
			$('#device_0').html("");
			if (data.items.length) {
				var lang = common.getLocalLang();
				var html ;
				if(lang == '1')
				    html = document.getElementById('online_device').innerHTML;
				else
                    html = document.getElementById('online_device_en').innerHTML;
				var onlineDevice = $('#device_0');
				$('#online_count').text('(' + data.items.length + ')');
				for (var i = 0; i < data.items.length; i++) {
					addHtml(onlineDevice, html, data.items[i]);
				}
				connectionDevice.eventList.bindAddBlacklistButton();
				connectionDevice.eventList.bindAddPassthroughlistButton();
			} else {
				$('#online_count').text('(' + 0 + ')');
			}
			if ((connectionDevice.maskShow != null) && connectionDevice.maskShow)  {
					connectionDevice.maskShow.decRef();
			}

		},
		/**
		 * 获取mac访问黑名单
		 */
		getBlackList : function() {
			callRpc(rpcUrl + this.paramOperate.businessRouterType + token, this.paramOperate.method.getBlackList, null, this.blackListCallBack);
		},
		/**
		 * 获取mac访问黑名单回调
		 */
		blackListCallBack : function(data) {
			$('#device_2').html("");
			if (data.items.length) {
				var lang = common.getLocalLang();
				var html ;
				if(lang == '1')
				    html = document.getElementById('black_list').innerHTML;
				else
                                    html = document.getElementById('black_list_en').innerHTML;
				var blackList = $('#device_2');
				$('#black_count').text('(' + data.items.length + ')');
				for (var i = 0; i < data.items.length; i++) {
					addHtml(blackList, html, data.items[i]);
				}
				connectionDevice.eventList.bindDelBlacklistButton();
			}else {
				$('#black_count').text('(' + 0 + ')');
			}

			if ((connectionDevice.maskShow != null) && connectionDevice.maskShow)  {
					connectionDevice.maskShow.decRef();
			}

		},
		/**
		 * 增加mac访问黑名单
		 */
		addBlackList : function(mac) {
			var params=[];
			var macStr=mac;
			params.push({mac:macStr});
			common.showMask(langCmn.setting);
			callRpc(rpcUrl + connectionDevice.paramOperate.businessRouterType + token, connectionDevice.paramOperate.method.addBlackList, params, function(data){
				if (data) {
					connectionDevice.getAssocList();
					connectionDevice.getBlackList();
					common.hideMask();
				}
			});
		},
		/**
		 * 删除mac访问黑名单
		 */
		removeBlackList : function(mac) {
			var params=[];
			var macStr=mac;
			params.push({mac:macStr});
			common.showMask(langCmn.setting);
			callRpc(rpcUrl + connectionDevice.paramOperate.businessRouterType + token, connectionDevice.paramOperate.method.deleteBlackList, params, function(data){
				//lognote(data);
				connectionDevice.getAssocList();
				connectionDevice.getBlackList();
				common.hideMask();
			});
		},
		/**
		 * 获取历史设备数据
		 */
		getHistoryDevList : function() {
			var params=[];
			callRpc(rpcUrl + this.paramOperate.businessRouterType + token, this.paramOperate.method.getHistoryDevList, params, this.historyDevListCallBack);
		},
		/**
		 * 历史设备数据回调
		 */
		historyDevListCallBack : function(data) {
			$('#device_1').html("");
			if (data.items.length) {
				if (data.items.length) {
					var lang = common.getLocalLang();
				        var html ;
				        if(lang == '1')
				            html = document.getElementById('history_device').innerHTML;
				        else
                           html = document.getElementById('history_device_en').innerHTML;
					var historyDevice = $('#device_1');
					$('#history_count').text('(' + data.items.length + ')');
					for (var i = 0; i < data.items.length; i++) {
						addHtml(historyDevice, html, data.items[i]);
					}

					connectionDevice.eventList.bindAddBlacklistButton();
					connectionDevice.eventList.bindAddPassthroughlistButton();
				}
			} else {
				$('#history_count').text('(' + 0 + ')');
			}
			if ((connectionDevice.maskShow != null) && connectionDevice.maskShow)  {
					connectionDevice.maskShow.decRef();
			}
		},
		/**
		 * 获取mac访问透传名单
		 */
		getPassthroughList : function() {
			callRpc(rpcUrl + this.paramOperate.businessRouterType + token, this.paramOperate.method.getPassthroughList, null, this.PassthroughCallBack);
		},
		/**
		 * 获取mac访问透传名单回调
		 */
		PassthroughCallBack : function(data) {
			$('#device_3').html("");
			if (data.items.length) {
				var lang = common.getLocalLang();
				var html ;
				if(lang == '1')
				    html = document.getElementById('passthrough_list').innerHTML;
				else
                                    html = document.getElementById('passthrough_list_en').innerHTML;
				var passthroughList = $('#device_3');
				$('#passthrough_count').text('(' + data.items.length + ')');
				for (var i = 0; i < data.items.length; i++) {
					addHtml(passthroughList, html, data.items[i]);
				}
				connectionDevice.eventList.bindDelPassthroughlistButton();
			}else {
				$('#passthrough_count').text('(' + 0 + ')');
			}

			if ((connectionDevice.maskShow != null) && connectionDevice.maskShow)  {
					connectionDevice.maskShow.decRef();      
			}

		},
		/**
		 * 增加mac访问透传名单
		 */
		addPassthroughList : function(mac) {
			var params=[];
			var macStr=mac;
			params.push({mac:macStr});			
			common.showMask(langCmn.setting);
			callRpc(rpcUrl + connectionDevice.paramOperate.businessRouterType + token, connectionDevice.paramOperate.method.addPassthroughList, params, function(data){
				if (data) {
					connectionDevice.getAssocList();
					connectionDevice.getPassthroughList();
					common.hideMask();
				}
			});
		},
		/**
		 * 删除mac访问透传名单
		 */
		removePassthroughList : function(mac) {
			var params=[];
			var macStr=mac;
			params.push({mac:macStr});
			common.showMask(langCmn.setting);
			callRpc(rpcUrl + connectionDevice.paramOperate.businessRouterType + token, connectionDevice.paramOperate.method.deletePassthroughList, params, function(data){
				//lognote(data);
				connectionDevice.getAssocList();
				connectionDevice.getPassthroughList();
				common.hideMask();
			});
		},				
}

/**
 * 追加html
 * @author renwei
 * @param obj
 * @param html
 */
var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm'); //i g m是指分别用于指定区分大小写的匹配、全局匹配和多行匹配。
function addHtml(obj,html,data){
	var getType = function(){
		switch (parseInt(data.type)){
			case 0:
			    return 'dev_unknown';
			    break;
			case 1:
			    return 'dev_mod';
			    break;
			case 2:
			    return 'dev_pc';
			    break;
			default:
			    return 'dev_unknown';
		};
	}

	switch (obj.attr('id')) {
	case 'device_0':
		obj.html(obj.html() + html.replace(reg, function (node, key) {
			return { 'deviceName': data.deviceName, 'ipaddr': data.ipaddr, 'ipv6addr': data.ipv6addr,'macaddr': data.mac, 'type':getType()}[key];
		}));
		break;
	case 'device_1':
		obj.html(obj.html() + html.replace(reg, function (node, key) {
			return { 'deviceName': data.deviceName, 'ipv6addr': data.ipv6addr, 'macaddr': data.mac, 'type':getType()}[key];
		}));
		break;
	case 'device_2':
		obj.html(obj.html() + html.replace(reg, function (node, key) {
			return { 'deviceName': data.deviceName,'ipv6addr': data.ipv6addr, 'macaddr': data.mac, 'type':getType()}[key];
		}));
		break;
	case 'device_3':
		obj.html(obj.html() + html.replace(reg, function (node, key) { 
			return { 'deviceName': data.deviceName,'ipv6addr': data.ipv6addr, 'macaddr': data.mac, 'type':getType()}[key]; 
		}));
		break;		
	}
}

/**
 * dom加载完成即执行
 */
$(function(){
	connectionDevice.init();
});
