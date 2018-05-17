<?php
		session_start();
		$_SESSION["servername"] = "localhost";
		$_SESSION["username"] = "root";
		$_SESSION["password"] = "";
		//$_SESSION["dbname"] = "trackingapp";
		$_SESSION["dbname"] = "mysql";
		$_SESSION["baseurl"] = "http://localhost/pgexample/appSample/www/";
		//$_SESSION["baseurl"] = "http://localhost/bot/";
		//$_SESSION["logged"] = false;
	
		
	
	function runQuery($q){
	$servername = $_SESSION["servername"];
		$username = $_SESSION["username"];
		$password = $_SESSION["password"];
		$dbname = $_SESSION["dbname"];

	$conn = mysqli_connect($servername, $username, $password, $dbname);
	// Check connection
	
	if (!$conn) {
		header('Location: $url');
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
	
	function toDate($ymd){
	
	//Convert it into a timestamp.
	$timestamp = strtotime($ymd);
	
	//Convert it to DD-MM-YYYY
	$dmy = date("Y-m-d", $timestamp);
	
	return $dmy;
}

function getQ($k)
{
	$str = file_get_contents('querymap.json');
	$json = json_decode($str,true);
	
	if (strpos($k, '__!') !== false) {
		$exp = explode(',', $k);
		$k = $exp[0];
		$p1 = $exp[1];
		$p2 = '';
		if(isset($exp[2]))
			$p2 = $exp[2];
		
		if(isset($json[0][$k])){
			$v = str_replace("?",$p1,$json[0][$k]);
			$v = str_replace("@",$p2,$v);
			
		}
		else
			$v = $k;
		
	}
	else{	
		if(isset($json[0][$k]))
			$v = $json[0][$k];
		else
			$v = $k;//return key if value is not there
		
		
		//print_r($json);
		return $v;
	}
	return $v;
}

function insertdata($q)
	{
		include_once("./variables.php");
        $servername = $_SESSION["servername"];
        $username   = $_SESSION["username"];
        $password   = $_SESSION["password"];
        $dbname     = $_SESSION["dbname"];
        
        $conn = mysqli_connect($servername, $username, $password, $dbname);
        // Check connection
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }
        
        if ($conn->multi_query($q) === TRUE) {
            echo "Results stored successfully";
        } else {
            echo "Error: In Inserting data";
			echo "Error: " . $q . "<br>" . $conn->error;
        }
        
        $conn->close();
        
    }

	
?>