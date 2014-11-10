
// GLOBAL VARS
var _api_base_url = "http://staging.vanesystems.com:81/tablet_service_ims/tablet_service_ims.asmx";
var _appID = "be74977e-3fc8-11e3-84ab-000c295e2bea";
var _trading_medium = 16;
var _terminal_id = -1;
var _booking_from_id = 15;
var _terminal_desc = "MX925";
var timeout_value = 100000;
var dummy;

// FUNCTIONS
function apiRegisterTerminal(data_object, callback) {
    try {
        var soap_request = '<?xml version="1.0" encoding="utf-8"?>\
                            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tab="http://staging.vanesystems.com:81/Tablet_Service_IMS/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                                <soap:Body>\
                                    <tab:Terminal_Registration xmlns="http://staging.vanesystems.com:81/tablet_service/">\
                                        <tab:inXML><terminalRQ appID="'+_appID+'" terminalID="-1" status="OK" booking_from_id="'+_booking_from_id+'" terminal_desc="'+data_object.terminal_desc+'" macnum="'+data_object.macnum_desc+'" gps_coord="'+data_object.gps_coord+'" city_id="'+data_object.city_id+'" venue_id="'+data_object.venue_id+'" location_desc="'+data_object.location_desc+'" trading_medium_id="'+_trading_medium+'"></terminalRQ></tab:inXML>\
                                    </tab:Terminal_Registration>\
                                </soap:Body>\
                            </soap:Envelope>';

        $.ajax({
            url: _api_base_url+"?op=Terminal_Registration",
            type: "POST",
            async: true,
            timeout: timeout_value,
            dataType: "xml",
            processData: false,
            cache: false,
            headers : {"cache-control": "no-cache"},
            data: soap_request,
            contentType: "text/xml; charset=utf-8",
            success: function(soap_response) {
                var status = $(soap_response).find("terminalRS").attr('status');
                if (status == "ERROR") { //error
                    apiError($(soap_response).find("terminalRS").attr('error_desc'), alert_errors);
                    callback("error");
                } else { //success
                    if ($(soap_response).find("terminalRS").attr("terminalID") != "null")
                    	_terminal_id = $(soap_response).find("terminalRS").attr("terminalID");
                    else 
                    	_terminal_id = 126; // default
                    
					_terminal_desc = $(soap_response).find("terminalRS").attr("terminal_desc");
					
                    callback(true, _terminal_id);
                }
            },
            error: function(soap_response, error_type, error_msg) { //ajax error
                if (error_type == "timeout") { //timeout
                    callback("timeout");
                } else { //other error
                    apiError(error_msg, alert_errors);
                    callback("error");
                }
            }
        });
    } catch(err) {
        //apiException(err, alert_errors);
        callback("error");
    }
}

// testing page2.html
function callback_test_page2(){
    callback_get_featured_events(xml_str);
            $("#demo").lightSlider({
                loop:true,
                keyPress:true
        });
    return true; // Skip file read

    $.ajax({
        type: "GET",
        url: "test.xml",
        dataType: "xml",
        async: false,
    success: function(xml) {
        //console.log($(xml).find(response_root).find("event"))
        soap_response = xml;
        console.log(xml);
        dummy = xml;
        callback_get_featured_events(xml);

        $("#demo").lightSlider({
                loop:true,
                keyPress:true
        });
    },
    error: function(a){
        console.log(a);
    }
    });
}

// Testing event_data.html
function callback_test_event_data(event_id){
    callback_event_data(xml_str, event_id);
    return true; // Skip file read

    $.ajax({
        type: "GET",
        url: "test.xml",
        dataType: "xml",
        async: false,
    success: function(xml) {
        //console.log($(xml).find(response_root).find("event"))
        soap_response = xml;
        console.log(xml);
        dummy = xml;
        callback_event_data(xml, event_id);
    },
    error: function(a){
        console.log(a);
    }
    });
}

// To populate EventData.html
function callback_event_data(soap_response,event_id){
    var request_root = "Event_Data";
    var request_subroot = "event_dataRQ";
    var response_root = "event_dataRS";

    var status = $(soap_response).find(response_root).attr('status');
    if (status == "ERROR") { //error
        apiError($(soap_response).find(response_root).attr('error_desc'), alert_errors);
        callback("error");
    } else { 
        // find event by id
        $(soap_response).find("event[event_id="+ event_id +"]").each(function(){
            $("#data_image").attr("src","data:image/png;base64," + $(this).attr('event_category_image_up'));

            var show = $(this).find("show")[0];
            $("#data_venue").html($(show).attr("venue_desc"));
            $("#data_date").html($(show).attr("show_date_from"));

            var price = $(show).find("price")[0]
            $("#data_price_1").html($(price).attr("amount"));           

        });       
    }
}

// To populate slider page
function callback_get_featured_events(soap_response){
    var request_root = "Event_Data";
    var request_subroot = "event_dataRQ";
    var response_root = "event_dataRS";

    var status = $(soap_response).find(response_root).attr('status');
    if (status == "ERROR") { //error
        apiError($(soap_response).find(response_root).attr('error_desc'), alert_errors);
        callback("error");
    } else { //success
        $(soap_response).find("event").each(function(i){
            // var img_src = $(this).attr("event_category_image_up");
            $(".demo ul").append("<li class='event_slide' event_id='"+ $(this).attr('event_id') +"'><img src='data:image/png;base64,"+ $(this).attr('event_category_image_up') +"'></img><h3>"+ $(this).attr("event_desc") +"</h3></li>");
                if(i==3) return false;
        });       
    }
}

function apiGetFeaturedEvents(type, callback) {
    var request_root = "Event_Data";
    var request_subroot = "event_dataRQ";
    var response_root = "event_dataRS";

    try {

		var soap_request = '<?xml version="1.0" encoding="utf-8"?>\
					<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tab="http://staging.vanesystems.com:81/Tablet_Service_IMS/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
					  <soap:Body>\
						<tab:Event_Data xmlns="http://staging.vanesystems.com:81/tablet_service_ims/">\
						  <tab:inXML><event_dataRQ appID="'+_appID+'" terminalID="'+_terminal_id+'" trading_medium_id="' + _trading_medium + '" show_images="1" status="OK" offset="0"></event_dataRQ></tab:inXML>\
						</tab:Event_Data>\
					  </soap:Body>\
					</soap:Envelope>';

        
        $.ajax({
            url: _api_base_url+"?op=Event_Data",
            type: "GET",
            async: true,
            dataType: "xml",
            timeout: timeout_value,
            processData: false,
            cache: false,
            headers : {"cache-control": "no-cache"},
            data: soap_request,
            contentType: "text/xml; charset=utf-8",
            success: function(soap_response) { //ajax success

                callback(soap_response);

                //callback_get_featured_events(soap_response);

                /* var return_data = []; 
                
                var status = $(soap_response).find(response_root).attr('status');
                if (status == "ERROR") { //error
                    apiError($(soap_response).find(response_root).attr('error_desc'), alert_errors);
                    callback("error");
                } else { //success
                    $(soap_response).find(response_root).find("event").each(function() {
                        if (tmpcount < 5) {
                         
                            var image = $(this).find("image").attr("image_data");

                            $(this).find("show").each(function() {
                                var tmp_obj = {
                                   image: image,
                                   name: $(this).attr("show_desc"),
                                   venue: $(this).attr("venue_desc"),
                                   date: $(this).attr("show_date_from"), 
                                   id: $(this).attr("show_id")
                                };
                                return_data.push(tmp_obj); 
                            });
                        }
                        tmpcount++;
                    });  
                    callback(return_data);
                }   */
            },
            error: function(soap_response, error_type, error_msg) { //ajax error
                console.log(soap_response);
                if (error_type == "timeout") { //timeout
                    callback("timeout");
                } else { //other error
                    apiError(error_msg, alert_errors);
                    callback("error");
                }
            }
        });
    } catch(err) { //exception
        //apiException(err, alert_errors);
        callback("error");
    }
}

function apiProvisionalBooking(booking_id, data_object, callback) {
    try {     
            var soap_request = '<?xml version="1.0" encoding="utf-8"?>\
            				   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tab="http://staging.vanesystems.com:81/tablet_service/">\
                               <soapenv:Header/>\
                               <soapenv:Body>\
                                  <tab:Booking>\
                                     <tab:inXML>\
                                     	<bookingRQ appID="'+_appID+'" terminalID="'+_terminal_id+'" status="OK" booking_id="'+booking_id+'" booking_from_id="' +_booking_from_id +'">\
                                            <item floor_plan_id="'+data_object.floorplan_id+'" price_id="'+data_object.price_id+'" discount_id="'+data_object.discount_id+'" quantity="'+data_object.quantity+'" disabled="'+data_object.disabled+'"></item>\
                                        </bookingRQ>\
                                     </tab:inXML>\
                                  </tab:Booking>\
                               </soapenv:Body>\
                            </soapenv:Envelope>';

        
			$.ajax({
				url: _api_base_url+"?op=Booking",
				type: "POST",
				async: true,
				timeout: timeout_value,
				dataType: "xml",
				processData: false,
				cache: false,
				headers : {"cache-control": "no-cache"},
				data: soap_request,
				contentType: "text/xml; charset=utf-8",
				success: function(soap_response) {
					return_data = new Object;
					var status = $(soap_response).find('bookingRS').attr('status');
					if (status == "ERROR") { //error
						apiError($(soap_response).find('bookingRS').attr('error_desc'), alert_errors);
						callback("error");
					} else { 
						if ($(soap_response).find("bookingRS").text() == "none") {
							callback("none");
						} else {
							$(soap_response).find("bookingRS").find("booked").each(function() {
								return_data.quantity = $(this).find("quantity").text();
								return_data.price = $(this).find("price").text();
								return_data.booking_block_id = $(this).find("booking_block_id").text();
							});
							callback(return_data);
						}
					}
				},
				error: function(soap_response, error_type, error_msg) { //ajax error
					if (error_type == "timeout") { //timeout
						callback("timeout");
					} else { //other error
						apiError(error_msg, alert_errors);
						callback("error");
					}
				}
			});
    } catch(err) {
        //apiException(err, alert_errors);
        callback("error");
    }
}

function apiCompleteBooking(booking_id, data_object, callback) {
    try {     
            var soap_request = '<?xml version="1.0" encoding="utf-8"?>\
            				   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tab="http://staging.vanesystems.com:81/tablet_service/">\
                               <soapenv:Header/>\
                               <soapenv:Body>\
                                  <tab:CompleteBooking>\
                                     <tab:inXML>\
                                     	<CompleteRQ appID="'+_appID+'" terminalID="'+_terminal_id+'" status="OK" cell_number="' + data_object.cell_num + '" change_amount="0" tender_amount="' + data_object.total_amount + '" booking_id="'+booking_id+'" user_id="'+data_object.user_id+'" auth_code="'+data_object.auth_code+'" card_number="'+data_object.card_number+'" paymethod_id="'+data_object.paymethod_id+'" operator_id="0" ></CompleteRQ>\
                                     </tab:inXML>\
                                  </tab:CompleteBooking>\
                               </soapenv:Body>\
                            </soapenv:Envelope>';

			$.ajax({
				url: _api_base_url+"?op=CompleteBooking",
				type: "POST",
				async: true,
				timeout: timeout_value,
				dataType: "xml",
				processData: false,
				cache: false,
				headers : {"cache-control": "no-cache"},
				data: soap_request,
				contentType: "text/xml; charset=utf-8",
				success: function(soap_response) {
					var status = $(soap_response).find('CompleteRS').attr('status');
					if (status == "ERROR") { //error
						apiError($(soap_response).find('CompleteRS').attr('error_desc'), alert_errors);
						callback("error");
					} else { 
						var return_data = $(soap_response).find("CompleteRS").find("ticket_ref").text();
						callback(return_data);
					}
				},
				error: function(soap_response, error_type, error_msg) { //ajax error
					if (error_type == "timeout") { //timeout
						callback("timeout");
					} else { //other error
						apiError(error_msg, alert_errors);
						callback("error");
					}
				}
			});
    } catch(err) {
        //apiException(err, alert_errors);
        callback("error");
    }
}