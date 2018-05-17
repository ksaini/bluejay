<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
include_once("./variables.php");
include_once("feeGet.php");

//$sid = 1000123;
if(isset($_POST['sid'])){
	$sid = $_POST['sid'];
	$now = toDate(trim($_POST['tilldate'],'"'));
}
else	{
	parse_str($_SERVER['QUERY_STRING']);
	$now = toDate(trim($tilldate,'"'));
}


$detailed_fee=calcFee($sid,$now);
echo json_encode($detailed_fee );

?>