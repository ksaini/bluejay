<?php
function calcFee($sid,$now){
$s_start; // session start date
$s_end; // session end date
//$now = date('Y/m/d', time()); // Time of evaluating fee
//$now = toDate(trim($_POST['tilldate'],'"'));


$cid =getdata("SELECT * from s_student_tbl where admn = '$sid' ")[0]['cid'];

//array to store detailed fee structure
$detailed_fee = array();

// session data
$sessiondata = getdata("SELECT start_date,end_date,id from s_session_tbl ORDER BY start_date DESC LIMIT 1 ;");
if(count($sessiondata) > 0){
	
	$s_start = json_encode($sessiondata[0]['start_date']);
	$s_end = json_encode($sessiondata[0]['end_date']);
		
	$s_start = toDate(trim($s_start,'"')); //d-m-yyyy
	$s_end = toDate(trim($s_end,'"'));  // d-m-yyyy
		
}
$feedata = getdata("SELECT * from s_fee_tbl where end_date > '$s_start' AND start_date < '$now' AND cid= '$cid';");
$fee = 0;

foreach($feedata as $result){
	$value = $result['value'];
	$type = $result['cycle'];
	$feeid = $result['feeid'];
	$feerange_start = $result['start_date'];
	$feerange_end = $result['end_date'];
	
	$temp = getdata("SELECT frequency, feename from s_fee_master where id = '$feeid'");
	$frequency = $temp[0]['frequency'];
	$feename = $temp[0]['feename'];
	
	
	//Student admission date
	$admn_dt = getdata("SELECT admn, admn_dt from s_student_tbl where admn = '$sid'")[0]['admn_dt'];
	$admn_dt = toDate(trim($admn_dt,'"')); //d-m-yyyy
	
	$s_dt = $admn_dt > $s_start? $admn_dt : $s_start;
	$s_dt = $feerange_start > $s_start? $feerange_start : $s_start; 
	
	
	if( (strpos($type, 'e+') !== false) || ($frequency !=1)) //if collecting at end take prorata
		{	
			/*  In current approach liable fee upto given date is calculated. i.e if query is run on 10 of a month,
			* then fee also includes these 10 days too. This is important for TC.
			*	If user wants to know dues matures at start of given month.
			* use now = normalize(result[session,frequency,now]);
			*/
			// if a student leaves early and fee to be calculated as prorata
			/*if(!active)
				e_dt = sid.termination_dt < end_dt ? sid.termination_dt : end_dt;
			else*/
			
			// if in current fee cycle
			//e_dt = e_dt > now? now : e_dt;
			$e_dt = $now > $feerange_end ?  $feerange_end : $now;
		}
		else
			$e_dt =  $s_end > $feerange_end ?  $feerange_end : $s_end;
		
		// Onetime charges are charged in full and are not prorated if student joins or leaves early.
		// If student is in that window of onetime charges those charges are aplicable in full.
		// NOTE: Admission charges are onetime charges with wondow of full one year.
			
		$datediff = strtotime($e_dt)- strtotime($s_dt);
		$days = floor($datediff / (60 * 60 * 24))+1; // TODO: change calculation depending on quarter/month or year
		
		$one = new DateTime($s_dt);
		$two = new DateTime($e_dt);
		$two->modify('+1 day');
		$interval = $one->diff($two);
		//echo $interval->y."--".$interval->m."--".$interval->d."<br>";
		// adding details in an array
		$info = array();
		
		
		if($frequency == 1){
			$fee+=$value;
			$info['value'] = floor($value);
			$info['frequency'] = $frequency;
			$info['from'] = $s_dt;
			$info['till'] = $e_dt;
			$info['feename'] = $feename;
			$detailed_fee[$feename] = $info;
			//array_push($detailed_fee,$info);
			//$detailed_fee[$feename] = $info;;
		}
		else{ 
		// yearly or other recurring charges are prorated.
			//$fee += $value * $frequency * ($days)/360;
			//$info['value'] =  floor($value * $frequency * ($days)/360);
			
			// Normalized
			if($frequency ==12){
			$fee += $value * ($interval->y*12 + $interval->m*1 + $interval->d*1/30);
			$info['value'] =  floor($value * ($interval->y*12 + $interval->m*1 + $interval->d*1/30));
			}elseif($frequency ==4){
			$fee += $value * ($interval->y*4 + $interval->m*1 );
			$info['value'] =  floor($value * ($interval->y*4 + $interval->m*1));
			}else{
				$fee += $value * $frequency * ($days)/360;
			$info['value'] =  floor($value * $frequency * ($days)/360);
			}
			
			$info['frequency'] = $frequency;
			$info['from'] = $s_dt;
			$info['till'] = $e_dt;
			$info['feename'] = $feename;
			$detailed_fee[$feename] = $info;
			//array_push($detailed_fee,$info);
			//$detailed_fee[$feename] = $info;;
			//$detailed_fee[$feename] = floor($value * $frequency * ($days)/365);
		}
	//echo $feename."---".$frequency."----".$days."---from---".$s_dt."-----to----".$e_dt."<br>";
}
// add previous dues
$prev_dues = runQuery("SELECT prev_dues from s_student_tbl where  admn = '$sid'")[0]['prev_dues'];
	if($prev_dues > 0){
			$info['value'] = $prev_dues;
			$info['frequency'] = 1;
			$info['from'] = $s_start;
			$info['till'] = $s_end;
			$info['feename'] = 'Previous Dues';
			$detailed_fee['Previous Dues'] = $info;
	}
	
// Add recieved Fee.
$sess_id = $sessiondata[0]['id'];
$rcvd = runQuery("SELECT sum(amount) as recieved from s_account_tbl where  sid = '$sid' ;" )[0]['recieved'];
	if($rcvd > 0){
			$info['value'] = $rcvd*-1;
			$info['frequency'] = 0;
			$info['from'] = $s_start;
			$info['till'] = $s_end;
			$info['feename'] = 'Recieved';
			$detailed_fee['Recieved'] = $info;
	}
	
// Including transport if any
include_once('transFee.php');
$tr = calcTransFee($sid,$now);
$transport = $tr['TransportTotal'];
if($transport==null)
	$transport=0;
	
if($tr['TransportTotal'] > 0){
	$info['value'] = $tr['TransportTotal'];
	$info['frequency'] = 0;
	$info['from'] = '';
	$info['till'] = '';
	$info['feename'] = 'TransportTotal';
	$detailed_fee['TransportTotal'] = $info;
}
	
$detailed_fee['Total'] = floor($fee + $prev_dues +$transport); 	
$detailed_fee['Balance'] = floor($fee + $prev_dues +$transport - $rcvd); 


//echo json_encode($detailed_fee );
return $detailed_fee;
}


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
	} else {
		echo "0 results";
	}
mysqli_close($conn);
return $data;	
}


?>



