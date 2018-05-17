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

			var dataSales = {
					labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
					series: [
					         [70, 385, 490, 492, 554, 586, 698, 695, 752, 788, 846, 944],
					         [67, 152, 143, 240, 287, 335, 435, 437, 539, 542, 544, 647],
					         [23, 113, 67, 108, 190, 239, 307, 308, 439, 410, 410, 509]
					         ]
			};

			var optionsSales = {
					lineSmooth: false,
					low: 0,
					high: 800,
					showArea: true,
					height: "245px",
					axisX: {
						showGrid: false,
					},
					lineSmooth: Chartist.Interpolation.simple({
						divisor: 3
					}),
					showLine: false,
					showPoint: false,
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

			Chartist.Line('#stressResult', dataSales, optionsSales, responsiveSales);


			var data = {
					labels: [ keys[0], keys[1], keys[2], keys[3], keys[4], keys[5], keys[6], keys[7], keys[8], keys[9]],
					series: [
					         [ barChartResult[keys[0]][0], barChartResult[keys[1]][0], barChartResult[keys[2]][0]
					         , barChartResult[keys[3]][0], barChartResult[keys[4]][0], barChartResult[keys[5]][0]
					         , barChartResult[keys[6]][0], barChartResult[keys[7]][0], barChartResult[keys[8]][0]
					         , barChartResult[keys[9]][0]
					         ],
					         [ barChartResult[keys[0]][1], barChartResult[keys[1]][1], barChartResult[keys[2]][1]
					         , barChartResult[keys[3]][1], barChartResult[keys[4]][1], barChartResult[keys[5]][1]
					         , barChartResult[keys[6]][1], barChartResult[keys[7]][1], barChartResult[keys[8]][1]
					         , barChartResult[keys[9]][1]
					         ]
					        ]
			};

			var options = {
					seriesBarDistance: 10,
					high: 800,
					axisX: {
						showGrid: false
					},
					
					height: "245px"
			};

			var responsiveOptions = [
			                         ['screen and (max-width: 640px)', {
			                        	 seriesBarDistance: 5,
			                        	 axisX: {
			                        		 labelInterpolationFnc: function (value) {
			                        			 return value[0];
			                        		 }
			                        	 }
			                         }]
			                         ];

			Chartist.Bar('#chartActivity', data, options, responsiveOptions);

			var dataPreferences = {
					series: [
					         [25, 30, 20, 25]
					         ]
			};

			var optionsPreferences = {
					donut: true,
					donutWidth: 40,
					startAngle: 0,
					total: 100,
					showLabel: false,
					axisX: {
						showGrid: false
					}
			};
			
			Chartist.Pie('#chartPreferences', dataPreferences, optionsPreferences);

			Chartist.Pie('#chartPreferences', {

				labels: [pieChartResult.passPer.toString()+'%',pieChartResult.failPer.toString()+'%',pieChartResult.remainsPer.toString()+'%'],
				series: [pieChartResult.passPer, pieChartResult.failPer, pieChartResult.remainsPer],
				//labels: ['10%',+'30%','60%'],
				//series: [10, 30, 60],
			});   
		},

		showNotification: function(from, align){
			color = Math.floor((Math.random() * 4) + 1);

			$.notify({
				icon: "pe-7s-gift",
				message: "Welcome to Adobe FrameMaker Team"

			},{
				type: type[color],
				timer: 4000,
				placement: {
					from: from,
					align: align
				}
			});
		}


}

