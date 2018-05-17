<?php


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
include_once("./variables.php");

$sid = $_GET['sid'];
$msg = $_GET['msg'];
$date = new DateTime();
$ts = $date->getTimestamp();

$cid = runQuery("SELECT cid from s_student_tbl where admn=$sid ;")[0]['cid'];
$sql = "INSERT into m_msg_tbl (msg,scope,scopeid) VALUES('$msg',$cid,$sid)";
insertdata($sql);


?>