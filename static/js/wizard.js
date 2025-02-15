
var finished = false;

// Functions
function scrollTop() {
	window.scroll({
 		top: 0,
 		left: 0,
 		behavior: 'smooth'
	});
}

function scanBluetooth(itemID) {
	const modal = '#bt_' + itemID + '_Modal';
	const modalContent = '#bt_' + itemID + '_Select';
	$(modal).modal('show');
	// Show scanning text while scanning
	$(modalContent).html('<br> \
                <h4>Scanning...</h4> \
                <br> \
                <div class="fa-3x"> \
                    <i class="fa-solid fa-magnifying-glass fa-bounce"></i> \
                </div> \
                <br></br>');
	// Load the bluetooth scan page
	$(modalContent).load("/wizard/bt_scan", {"itemID" : itemID});
}

function selectBluetoothDevice(hw_id, itemID) {
	const modal = '#bt_' + itemID + '_Modal';
	const item = '#' + itemID;
	$(item).val(hw_id);
	// Hide the modal
	$(modal).modal('hide');
}

// On Document Ready
$(document).ready(function() {
	// === Setup Pill Navigation Buttons ===
	$("#platformBtn").click(function() {
		$("#v-pills-platform-tab").trigger('click');
		scrollTop()
	});
	$("#platformBack").click(function() {
		$("#v-pills-start-tab").trigger('click');
		scrollTop()
	});
	$("#probesBtn").click(function() {
		$("#v-pills-probes-tab").trigger('click');
		scrollTop()
	});
	$("#probesBack").click(function() {
		$("#v-pills-platform-tab").trigger('click');
		scrollTop()
	});
	$("#displayBtn").click(function() {
		$("#v-pills-display-tab").trigger('click');
		scrollTop()
	});
	$("#displayBack").click(function() {
		$("#v-pills-probes-tab").trigger('click');
		scrollTop()
	});
	$("#distanceBtn").click(function() {
		$("#v-pills-distance-tab").trigger('click');
		scrollTop()
	});
	$("#distanceBack").click(function() {
		$("#v-pills-display-tab").trigger('click');
		scrollTop()
	});
	$("#finishtabBtn").click(function() {
		$("#v-pills-finish-tab").trigger('click');
		scrollTop()
	});
	$("#finishtabBack").click(function() {
		$("#v-pills-distance-tab").trigger('click');
		scrollTop()
	});
	// Wizard complete button will submit the form
	$("#finishBtn").click(function() {
		finished = true;
		$('#wizardForm').submit();
	});

	// Set the confirmation value on the confirm/finish section
	var selection = $('#grillplatformSelect').val();
	$('#grillplatformConfirm').html(selection);

	var selection = $('#displaySelect').val();
	$('#displayConfirm').html(selection);

	var selection = $('#distanceSelect').val();
	$('#distanceConfirm').html(selection);

	// Setup listeners for selection boxes in each section 
	$('#grillplatformSelect').change(function () {
		var selection = $('#grillplatformSelect').val();
		$('#grillplatformCard').load("/wizard/modulecard", {"section" : "grillplatform", "module" : selection});
		$('#grillplatformConfirm').html(selection);
	});
	
	$('#displaySelect').change(function () {
		var selection = $('#displaySelect').val();
		$('#displayCard').load("/wizard/modulecard", {"section" : "display", "module" : selection});
		$('#displayConfirm').html(selection);
	});

	$('#distanceSelect').change(function () {
		var selection = $('#distanceSelect').val();
		$('#distanceCard').load("/wizard/modulecard", {"section" : "distance", "module" : selection});
		$('#distanceConfirm').html(selection);
	});

	setInterval(function () {
		var selection = $('#probeModuleList').val();
		$('#probesConfirm').html(selection);
	}, 1000);

});