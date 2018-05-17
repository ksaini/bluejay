<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
include_once("./variables.php");

$sid =  $_GET['sid'];
//$sid = 1000123;
$sessiondata = getdata("SELECT * from s_session_tbl ORDER BY start_date DESC LIMIT 1 ;");


$leaves = getdata("SELECT count(status) as leaves FROM s_attend_tbl where sid='$sid' and (status='l' OR status = 'L') ;")[0]['leaves'];
$abs = getdata("SELECT count(*) as absent  FROM s_attend_tbl where sid='$sid' and (status='a' OR status = 'A') ;")[0]['absent'];
$tot = getdata("SELECT count(status) as total FROM s_attend_tbl where sid='$sid' ;")[0]['total'];

$s_start = json_encode($sessiondata[0]['start_date']);
$s_start = toDate(trim($s_start,'"'));

$admn_dt = getdata("SELECT admn_dt  FROM s_student_tbl where admn='$sid' ;")[0]['admn_dt'];
$admn_dt = toDate(trim($admn_dt,'"'));
$now = date('Y/m/d', time());
$now = toDate(trim($now,'"'));

$s_dt = $admn_dt < $s_start? $s_start : $admn_dt;
$e_dt = $now;
//echo $s_dt;

//calculate sundays
$start = new DateTime($s_dt);
$end = new DateTime($e_dt);
$days = $start->diff($end, true)->days;
$sundays = intval($days / 7) + ($start->format('N') + $days % 7 >= 7);
// calculate holidays
$holidays = runQuery("SELECT count(*) as count from s_holiday where  h  > '$s_dt';")[0]['count'];


$s_dt = strtotime($s_dt);
$e_dt = strtotime($e_dt);
$datediff = $e_dt - $s_dt;

$max = floor($datediff / (60 * 60 * 24));

$resultdata['leaves'] = $leaves;
$resultdata['absent'] = $abs;
$resultdata['tot'] = $tot;
$resultdata['max'] = $max-$sundays-$holidays;

echo json_encode($resultdata );

function getdata($q){
include_once("./variables.php");
		$servername = $_SESSION["servername"];
		$username = $_SESSION["username"];
		$password = $_SESSION["password"];
		$dbname = $_SESSION["dbname"];

$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
	$sql = $q;

	$result = $conn->query($sql);
	$data = array();

	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			array_push($data,$row);
		}
	} 
mysqli_close($conn);
return $data;	
}
?>