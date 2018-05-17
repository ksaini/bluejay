type = ['','info','success','warning','danger'];


demo = {
		initPickColor: function(){
			$('.pick-class-label').click(function(){
				var new_class = $(this).attr('new-class');  
				var old_class = $('#display-buttons').attr('data-class');
				var display_div = $('#display-buttons');
				if(display_div.length) {
					var display_buttons = display_div.find('.btn');
					display_buttons.removeClass(old_class);
					display_buttons.addClass(new_class);
					display_div.attr('data-class', new_class);
				}
			});
		},

		initChartist: function(){   

			var series_data = new Array();
			var series_key = new Array();
			for (var key in rwresultChart) {
					series_data.push(rwresultChart[key]);
					series_key.push(key);
			}	
			
			var dataSales = {
					labels: label_keys,
					series: [
								{
								label: series_key[0],
								name: series_key[0],
								data: series_data[0]
								},
								{
								label: series_key[1],
								name: series_key[1],
								data: series_data[1]
								},
								{
								label: series_key[3],
								name: series_key[3],
								data: series_data[3]
								},
								{
								label: series_key[4],
								name: series_key[4],
								data: series_data[4]
								},
								{
								label: series_key[5],
								name: series_key[5],
								data: series_data[5]
								},
								{
								label: series_key[6],
								name: series_key[6],
								data: series_data[6]
								},
								{
								label: series_key[7],
								name: series_key[7],
								data: series_data[7]
								},
								{
								label: series_key[8],
								name: series_key[8],
								data: series_data[8]
								},
								{
								label: series_key[9],
								name: series_key[9],
								data: series_data[9]
								}
								
					         ],
							 
			};

			var optionsSales = {
					lineSmooth: false,
					low: 0,
					high: 1200,
					showArea: false,
					height: "275px",
					
					axisX: {
						showGrid: false,
						
					},
					lineSmooth: Chartist.Interpolation.simple({
						divisor: 3
					}),
					showLine: true,
					showPoint: false,
					tooltips: {
					mode: 'label'
					} 
			};

			var responsiveSales = [
			                       ['screen and (max-width: 640px)', {
			                    	   axisX: {
										   
			                    		   labelInterpolationFnc: function (value) {
			                    			   return value[0];
			                    		   }
			                    	   }
			                       }]
			                       ];

			Chartist.Line('#rwResult', dataSales, optionsSales, responsiveSales);


			  
		},

		showNotification: function(from, align){
			color = Math.floor((Math.random() * 4) + 1);

			$.notify({
				icon: "pe-7s-gift",
				message: "Welcome "

			},{
				type: type[color],
				timer: 4000,
				placement: {
					from: from,
					align: align
				}
			});
		},

		
		
		initChartist1: function(){   

			var series_data = new Array();
			var series_key = new Array();
			for (var key in rwresultChart) {
					series_data.push(rwresultChart[key]);
					series_key.push(key);
			}	
			
			var dataSales = {
					labels: label_keys,
					series: [
								rwresultChart
								
					         ],
							 
			};

			var optionsSales = {
					lineSmooth: false,
					low: 0,
					high: 1200,
					showArea: false,
					height: "275px",
					
					axisX: {
						showGrid: false,
						
					},
					lineSmooth: Chartist.Interpolation.simple({
						divisor: 3
					}),
					showLine: true,
					showPoint: false,
					tooltips: {
					mode: 'label'
					} 
			};

			var responsiveSales = [
			                       ['screen and (max-width: 640px)', {
			                    	   axisX: {
										   
			                    		   labelInterpolationFnc: function (value) {
			                    			   return value[0];
			                    		   }
			                    	   }
			                       }]
			                       ];

			Chartist.Line('#rwResult', dataSales, optionsSales, responsiveSales);


			  
		}

}

