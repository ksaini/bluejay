<?php


function calcTransFee($s,$tilldate){
	
include_once("./variables.php");

$sid = 1000129;
$sid = $s;
$now = date('Y/m/d', time()); // Time of evaluating fee
$now = toDate(trim($tilldate,'"'));
//array to store detailed fee structure
$detailed_fee = array();

// session data
$sessiondata = runQuery("SELECT start_date,end_date,id from s_session_tbl ORDER BY start_date DESC LIMIT 1 ;");
if(count($sessiondata) > 0){
	
	$s_start = json_encode($sessiondata[0]['start_date']);
	$s_end = json_encode($sessiondata[0]['end_date']);
		
	$s_start = toDate(trim($s_start,'"')); //d-m-yyyy
	$s_end = toDate(trim($s_end,'"'));  // d-m-yyyy
		
}
$feedata = runQuery("SELECT * from s_trans_tbl where action_dt <= '$now' AND sid= '$sid' order by action_dt,id;");

$fee = 0;
$lastfee = 0;
$mfee =0;

foreach($feedata as $result){
	$id = $result['id'];
	$stop = $result['stop'];
	$action = $result['action'];
	$action_dt = $result['action_dt'];
	$lastfee= $mfee;
	
	// adding details in an array
	$info = array();
	
	if($stop==0)
		$fee =0;
	else
		$mfee = runQuery("SELECT fee from s_stop_tbl where id = '$stop' ;")[0]['fee'];
	
	
	// There are 3 cases enabled/disabled/senabled(last one represents stop change)
	//whenever stop is changed earlier cycle is disabled, new cycle created AND
	// AND 1 month fee to be adjusted
	if(strcmp($action,'enabled')==0){
		//$s_start = $action_dt;
		$s_dt = dtdiff($action_dt,$s_start) > 0 ? $s_start : $action_dt;
		
	}else if(strcmp($action,'senabled')==0){
		$s_dt = dtdiff($action_dt,$s_start) > 0 ? $s_start : $action_dt;
		// reverse fee of 1 month as it will be charged agan in new cycle
		// lastfee represents fee charged at the time of disabeling cycle 
		$fee = $fee - $lastfee;
		
	}else if(strcmp($action,'disabled')==0){
		if(dtdiff($s_start,$action_dt) > 0){ 
			$e_dt = dtdiff($now ,$action_dt) > 0 ? $now : $action_dt;  
			$one = new DateTime($s_dt);
			$two = new DateTime($e_dt);
			$interval = $one->diff($two);
			$fee +=  ($interval->m+1)*$mfee;
			
			$info['from'] = $s_dt;
			$info['till'] = $e_dt;
			$info['fee'] = ($interval->m+1)*$mfee;
			$info['stop'] = $stop;
			$detailed_fee[$id] = $info;
		}
		else{ // if disabled befire session start date
			//reset dates
			$s_dt = $s_start;
			$e_dt = $s_end;
			$fee += 0;// dont add fee if it is from prev session
		}
		
	}
	//echo "fee->".$fee."  action->".$action."-->stop".$stop."  <br>";
}
// if last action is enabled calculate transport fee till date.
if(count($feedata) > 0){
	if((strcmp($action,'enabled')==0) OR (strcmp($action,'senabled')==0)){
		$e_dt = $now;
		$one = new DateTime($s_dt);
		$two = new DateTime($e_dt);
		$interval = $one->diff($two);
		$fee +=  ($interval->m+1)*$mfee;
		
		$info['from'] = $s_dt;
			$info['till'] = toDate($e_dt);
			$info['fee'] = ($interval->m+1)*$mfee;
			$info['stop'] = $stop;
			$detailed_fee[$id] = $info;
		
	}
}
	//echo "fee->".$fee."  action->".$action."-->stop".$stop."  <br>";	
	$detailed_fee['TransportTotal'] = $fee;
//echo json_encode($detailed_fee );
return $detailed_fee;
}


function dtdiff($s,$e){
	return (strtotime($e)- strtotime($s));
}


?>