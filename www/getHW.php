<?php


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
include_once("./variables.php");

$sid = $_GET['sid'];
$cid = runQuery("SELECT cid from s_student_tbl where admn=$sid ;")[0]['cid'];

if(!isset($_GET['dt'])){
	$udates =	runQuery("SELECT DISTINCT hwdate from m_hw_tbl where cid=$cid");	
	
}
else{
	$dt = $_GET['dt'];
	//echo "SELECT * from m_hw_tbl where cid=$cid AND hwdt='$dt'";
	$udates = runQuery("SELECT * from m_hw_tbl where cid=$cid AND hwdate='$dt'");
}	

echo json_encode($udates);

?>