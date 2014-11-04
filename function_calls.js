// TERMINAL REGISTRATION CALL

var form_data = new Object;
form_data.terminal_desc = "MX925";
form_data.macnum_desc = ""; // This should be the device MAC Addess
form_data.gps_coord = "";
form_data.city_id = "-1";
form_data.venue_id = "-1";
form_data.location_desc = "";

apiRegisterTerminal(form_data, function(result, terminal_id) {
   if (result == 'error' || result == 'timeout') {
	   //error
	   
   } else { 
	   //success
	   // the terminal_id should be save in the db, but for now you can just use the value
   }
});


// GET EVENTS CALL
apiGetFeaturedEvents("events", function(result) {
	if (result == 'error' || result == 'timeout') {
		//error

	} else {
		//success
		
	}
});

// NOTE : you can use something like this to display the images
$("#event_image_container").html('<div class="img" style="width="100px"; height="100px"; background-image:url(data:image/png;base64,'+event.image+');">');


// DO PROVISIONAL BOOKING
// Price data values are the values of the selected event

var booking_id = "";
var price_data = {
					show_id: _show_id,
					floorplan_id: _floorplan_id,
					discount_id: "-1", 
					disabled: "0", 
					show_name: _show_name,
					price_id: _event_price_id,
					discount_id: _event_discount_id, 
					price_desc: $("#tickets_amount_info").html(),
					quantity: $("#tickets_amount").html(),
					price: _event_price
				 };
				 
apiProvisionalBooking(booking_id, price_data, function(nbs_result) {
	if (nbs_result == 'error' || nbs_result == 'timeout') {	
		//error
	} else {
		//success
		// save the booking_id, it will be used to complete the booking
	}   
}); 



// DO COMPLETE BOOKING
var complete_booking_data = {
							  user_id: "1",
							  auth_code: "",
							  card_number: "", 
							  paymethod_id: "1", //1 for card, 2 is cash
							  total_amount: window.localStorage.getItem("total_amount"),
							  cell_num:""
							};
                

apiCompleteBooking(booking_id, complete_booking_data, function(booking_ref) {
	if (booking_ref == 'error' || booking_ref == 'timeout') {
		//error

	} else {
		//success
	}
});