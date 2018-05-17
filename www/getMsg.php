<?php


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
include_once("./variables.php");

$sid = $_GET['sid'];
$mid = $_GET['mid'];

$cid = runQuery("SELECT cid from s_student_tbl where admn=$sid ;")[0]['cid'];
$msgs =	runQuery("SELECT * from m_msg_tbl where (scope='cid' AND scopeid=$cid) OR (scope='sid' AND scopeid=$sid) OR (scope!='cid' AND scope!='sid' AND scopeid=$sid) ORDER BY mid;");	
echo json_encode($msgs);


?>