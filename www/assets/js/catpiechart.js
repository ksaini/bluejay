type = ['','info','success','warning','danger'];


demo1 = {
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

		initChartist1: function(){    

			

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
					},
					legend: {
						display: true,
						position: 'top',
						labels: {
							boxWidth: 80,
							fontColor: 'black'
						}
					}
			};
			
			Chartist.Pie('#chartCategory', dataPreferences, optionsPreferences);

			Chartist.Pie('#chartCategory', {

				labels: [catChartResult.gen.toString()+'%',catChartResult.obc.toString()+'%',catChartResult.sc.toString()+'%',catChartResult.st.toString()+'%'],
				series: [catChartResult.gen,catChartResult.obc,catChartResult.sc,catChartResult.st],
				
				//datasets: [{
					//		label: "Fee Projection",
						//	fillColor: "#79D1CF",
							//strokeColor: "#79D1CF",
						//	data: [catChartResult.gen,catChartResult.obc,catChartResult.sc,catChartResult.st],
					//	}]
				//series: [catChartResult.gen,catChartResult.obc,catChartResult.sc,catChartResult.st],
				//labels: ['10%','30%','60%'],
				//series: [10, 30, 60],
			});   
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
		}

}

