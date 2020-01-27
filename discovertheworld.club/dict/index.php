<!DOCTYPE html>
<html>
<head>
<title>"Dictianary trainer"</title>
<link href="../css/common.css" rel="stylesheet" type="text/css" />
<style>
.error {color: #FF0000;}
.correct {color: #00FF00;}
</style>
</head>
<body>              
<?php

const FIB_NONE=0;
const FIB_ONE=1;
const FIB_TWO=2;
const FIB_THREE=3;
const FIB_FIVE=5;
const FIB_EIGHT=8;

function decFib($score){
    $ret = FIB_ONE;
    switch ($score){
    case FIB_EIGHT:
        $ret = FIB_FIVE;
        break;
    case FIB_FIVE:
        $ret = FIB_THREE;
        break;
    case FIB_THREE:
        $ret = FIB_TWO;
        break;
    case FIB_TWO:
        $ret = FIB_ONE;
        break;
    case FIB_ONE:
        $ret = FIB_NONE;
        break;
    default:
        $ret = FIB_ONE;
    }
    return $ret;

}
function columnNameByType($type){
    $name = "";
    switch ($type){
    case 1:
    case 1001:
        $name = "EN";
        break;
    case 2001:
        $name = "EnglishDefinition";
    case 3001:
        $name = "EnglishAbbreviation";
        break;
    case 2:
    case 1002:
        $name = "RU"; 
        break;
    default:
        $name = "EN";
    }
    return $name;
}

class Stats { 
    public $score = 0;
    public $correct = 0;
    public $wrong = 0;
    //public static $once = true; 
} 
class Cursor { 
    public static $once = true; 
    public $max = 10;
    public $cur = 0; 
    public $round = 0; 
    public $stats;
    public $rows = [];
    public $ansRows = [];
    public $score = [];
    public $nums = [];
    public $dbcnt = 0;
    private $conn;
    public $answer = "";
    public const NONE = 0;
    public const CORRECT = 1;
    public const WRONG = 2;
    public const GIVEUP = 3;
    public const COMPLETE = 4;
    public $gameState = Cursor::NONE;
    
    static public function once(){
      if (!isset(static::$init)){
          static::$init = true;
          return true;
      } 
      return false;
    }
    public function __construct($conn, $max, $dbcnt){
        $this->conn = $conn;
        $this->max = $max;
        $this->stats = new Stats;
        $this->dbcnt = $dbcnt;
        $this->initialize();
    }

    function initialize()
    {
        $this->cur = 0;
        $this->round = 0;
        $this->stats->cnt = 0; 
        $this->stats->score = 0;
        $this->stats->correct = 0;
        $this->stats->wrong = 0;
        
        $this->stats->cnt++;
        for ($i = 0; $i < $this->max; $i++){
            //echo "i = ".$i."<br>";
            $error = 0;
            $row = NULL;
            $ansRows = array();
            do{
                //echo "start of do/while i = ". $i . "<br>";
                $cont = false;
                $num = rand(1, $this->dbcnt);
                for ($j = 0; $j < count($this->rows); $j++) if ($this->rows[$j]['N'] == $num){$cont = true;break;}
                    //echo "row number: " . $num . "<br>";                                                                                                                                                                            j
                if ($cont) {continue;}
                $row = $this->getWordByN($num);
                if (!$row){
                    $error = 1;
                    //echo "ERROR_1";
                    break;
                    }
                $sql = "";
                switch ($row['Type']){
                    case 1:
                    case 0x1001:
                        $sql = "SELECT * FROM binds where EN = $num";
                        break;
                    case 0x2001:
                        $sql = "SELECT * FROM binds where EnglishDefinition = $num";
                        break;
                    case 0x3001:
                        $sql = "SELECT * FROM binds where EnglishAbbreviation = $num";
                        break;
                     case 2:
                     case 0x1002:
                         $sql = "SELECT * FROM binds where RU = $num";
                         break;
                     default:
                          $rows[$i] = NULL; //TODO: handle this properly
                          echo "ERROR!!! Update software, Type = " . $row['Type'] . "<br>";
                          break;
                 }
                 if ($sql == "") {$cont = true; continue;} 
                 $result = $this->conn->query($sql);
                 if (!$result){
                      $error = 1;
                      //echo "ERROR_2:" . $sql ."<br>";
                      break;
                 }
                 /*
                    $cnt = mysqli_num_rows($result);
                    $n = 0;
                    if ($cnt > 1) $n = rand(0, $cnt-1);
                    $j = 0;
                 */
                 $fn = array();
                 while ($bindRow = mysqli_fetch_array($result)){
                    $j = 0;
                    mysqli_field_seek($result, 0);
                    while ($meta = mysqli_fetch_field($result)) {
                        if ($meta->name != "Rank" && $meta->name!="EnglishDefinition" && $bindRow[$meta->name] && $bindRow[$meta->name] != $num){
                            if (count($fn) <= $j ) $fn[$j] = array();
                            array_push($fn[$j], $bindRow[$meta->name]);
                            $j++;
                        }
                    }
                 }
                 mysqli_free_result($result);
                 $cnt = count($fn);
                 if ($cnt < 1) {$cont = true; continue;}
                 //echo "after if cnt <1 <br>";
                 $n = 0;
                 if ($cnt > 1) $n = rand(0, $cnt-1);
                 $ansRows = [];
                 for ($j = 0; $j < count($fn[$n]); $j++){
                     $ansRow = $this->getWordByN($fn[$n][$j]);
                     if (!$ansRow) continue;
                     //"Answer row type ". $ansRow['Type'] . "<br>";
                     array_push($ansRows, $ansRow);
                     //echo "Answer row Type ". $ansRows[0]['Type'] . "<br>";
                     //if (!count($ansRows)) echo "1_!!ERROR!!!_1";
                 }
                 if (!count($ansRows)) {$cont = true;continue;}
                 //if (!count($ansRows)) echo "before_out_ERROR!!!";
                 //else echo "count = " . count($ansRows);
            } while ($cont);
            if ($error){
                echo "break due to error!";
                $this->rows[$i] = NULL; //TODO: handle this properly
                $this->ansRows[$i] = NULL; 
                break;
            }

            $this->rows[$i] = $row; //TODO: handle this properly
            $this->ansRows[$i] = $ansRows;
            $this->score[$i] = FIB_EIGHT;
            $this->nums[$i] = $i+1;
        }
    }    
    function __destruct() {
        //$this->conn->close();
    }

    public function processAnswer() { 
        //echo "proc answer; cnt = ".$this->stats->cnt." <br>";
        
        if(!empty($_POST['txtAnswer'])){
           $this->answer = $_REQUEST["txtAnswer"];
        }
        $ansRows = $this->ansRows[$this->cur];
        $correct = false;
        $name = columnNameByType($ansRows[0]['Type']);
        //echo $name  . "<br>";
        //echo $name  . "<br>";
        //echo $this->answer . "<br>";
        for ($i = 0; $i < count($ansRows); $i++)
            //if ($ansRows[$i][columnNameByType($ansRows[$i]['Type'])] == $this->answer){
            if ($ansRows[$i]['Spelling'] == $this->answer){
            $correct = true;
            break;
        }
        $str = "";
        if ($correct){
            //$this->processCorrect($this->round==0? 3 : ($this->round==1 ? 1 : 0));
            $str = "Correct!";
        }
        else {
            //$this->processWrong();
            $str = "Wrong!";
        }
        return $str; 
    } 

    function processCorrect() { 
        $this->gameState = Cursor::CORRECT;
        $this->stats->score += $this->score[$this->cur];
        //echo "processCorrect". $this->stats->cnt."<br>";
    
        $this->stats->correct++;
           if (count($this->rows)==1){
               echo "<p style = 'color: #00ff00;'> You completed the test with score {$this->stats->score}! Refresh the page to start again. </style>";
               $this->gameState = Cursor::COMPLETE;
           }
            //implement "start again" button
            //$this->initialize()
    } 
    function processWrong() {
        $this->gameState = Cursor::WRONG;
        //echo "processWrong". $this->stats->cnt."<br>";
        $this->score[$this->cur] = decFib($this->score[$this->cur]);
        //$this->inc();
        $this->stats->wrong++;
    }
    function getWordByN($num){ 
      $sql = "SELECT * FROM words where N = $num";
      $result = $this->conn->query($sql);
      if (!$result){
          echo "ERROR!!! Row with N  = " . $num . " is absent". "<br>";
          return NULL;
      }
      $row = mysqli_fetch_array($result);
      mysqli_free_result($result);
      return $row;
    }
    function inc(){
        if ($this->gameState == Cursor::CORRECT){
            \array_splice($this->rows, $this->cur, 1);
            \array_splice($this->ansRows, $this->cur, 1);
            \array_splice($this->score, $this->cur, 1);
            \array_splice($this->nums, $this->cur, 1);
            if (count($this->rows) == $this->cur) $this->cur  = 0;
        } else {
            if ($this->cur < count($this->rows)-1) $this->cur++;
            else $this->cur = 0;
        }
    }

} 
session_start();
$answerErr = "";
$answerCorrect = "";
//$rightAnswer = "";
if ($_SERVER["REQUEST_METHOD"] == "POST"){
  if (isset($_SESSION['cur']) && $_SESSION['cur']->gameState != Cursor::COMPLETE){
    $cur = $_SESSION['cur'];
    $cur->answer = test_input($_POST["answer"]);
    if(isset($_POST["submit"])){
      if (!empty($_POST["answer"])){
      if(isset($cur) && $cur->gameState != Cursor::CORRECT){ 
      if ($cur->processAnswer()=="Correct!"){
         $answerCorrect = "Correct!";
         $cur->processCorrect();
       } else {
         $answerErr = "Wrong!";
         $cur->processWrong();
       }
       }
      } else {
          $answerErr = "Please, provide your answer"; 
      }
     } else if(isset($_POST["giveup"])){
         $cur->gameState = Cursor::GIVEUP;
         if ($cur->score[$cur->cur] > FIB_ONE) $cur->score[$cur->cur] = FIB_ONE;
         else $cur->score[$cur->cur] = FIB_NONE;
         $cur->stats->wrong++;
         //$rightAnswer = $cur->ansRows[$cur->cur][0]['Spelling'];
     } else if(isset($_POST["next"])){
         $cur->inc();
         $cur->answer = "";
         $cur->gameState = Cursor::NONE;
     }
  }
}

if (!isset($cur) ){
ob_start();
require_once 'configuration.php';
ob_end_clean();
$config = new DictConfig;
// Create connection
$conn = new mysqli($config->dbhost, $config->username, $config->password, $config->db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
$sql = "SELECT * FROM words";
$result = $conn->query($sql);
$cnt = mysqli_num_rows($result);
mysqli_free_result($result);
if ($cnt < 10){
      echo "ERROR!!!" . "<br>";
      $conn->close();
      die("Too view data in DB!");
}

$cur = new Cursor($conn, 10, $cnt);
$_SESSION['cur'] = $cur;
$conn->close();
}
if (count($cur->rows)){
generateQuestStr();       
generateAnsStr();
}


function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

function generateQuestStr(){
    global $cur, $questStr;
    
    //statistic fields
    //$qCnt++;

    $row = $cur->rows[$cur->cur];
    switch ($row['Type']){
    case 0x1:
    case 0x1001:
        $questStr = "English:";
        break;
    case 0x2001:
        $questStr = "English definition:";
        break;
    case 0x3001:
        $questStr = "English abbreviation:";
        break;
    case 0x2:
    case 0x1002:
    case 0x2002:
        $questStr = "Russian:";
        break;
    default:
        $questStr = "English:";
    }
    return "";
}

function generateAnsStr(){
    global $cur, $answerStr;
    
    //statistic fields
    //$qCnt++;

    $row = $cur->ansRows[$cur->cur][0];
    //echo $cur->cur;

    switch ($row['Type']){
    case 0x1:
    case 0x1001:
        $answerStr = "Translate to English:";
        break;
    case 0x2001:
        $answerStr = "The best English word that matchs the definition above:";
    case 0x3001:
        $answerStr = "English abbreviation of the phrase above:";
        break;
    case 0x2:
    case 0x1002:
        $answerStr = "Translate to Russian:"; 
        break;
    default:
        $answerStr = "Translate to Russian:";
    }
    return "";
}
?>
<a href="../index.html" class="button-link" style="display:inline;position:relative;"><span><img src="../images/home.png" />Home</span></a>
<br>
    <p>Question #: <?= $cur->nums[$cur->cur] ?></p>
    <p>Score: <?= $cur->stats->score ?></p>
    <p>Correct: <?= $cur->stats->correct ?></p>
    <p>Wrong: <?= $cur->stats->wrong ?></p>
    
    <br>

    <p><?= $questStr ?> <?= $cur->rows[$cur->cur]['Spelling'] ?></p>
    <p style="display:inline">Transcription: <?= $cur->rows[$cur->cur]['Transcription'] ?> &nbsp &nbsp</p>
    <audio controls src="data:audio/mp3;base64,<?=base64_encode($cur->rows[$cur->cur]['Prononciation'])?>" style="display:inline-block;vertical-align: middle;" ></audio>
    <br>
    <br>
    <br>

 <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">  
  <?= $answerStr?> <input type="text" name="answer" value="<?php echo htmlentities($cur->answer);?>" autocomplete="off">
  <input type="submit" name="submit" value="Submit" <?php if ($cur->gameState == Cursor::GIVEUP || $cur->gameState == Cursor::CORRECT || $cur->gameState == Cursor::COMPLETE) echo 'disabled'?>> 
  <button type="submit" name="giveup" value="GiveUp" <?php if ($cur->gameState == Cursor::GIVEUP || $cur->gameState == Cursor::CORRECT || $cur->gameState == Cursor::COMPLETE) echo 'disabled'?>>Show the answer</button>
  <button type="submit" name="next" value="Next" <?php if ($cur->gameState == Cursor::COMPLETE) echo 'disabled'?>>Next</button>
  <span class="error"> <?php echo $answerErr;?></span>
  <span class="correct"> <?php echo $answerCorrect;?></span>
  <?php if($cur->gameState == Cursor::GIVEUP || $cur->gameState == Cursor::CORRECT) for ($gi=0; $gi < count($cur->ansRows[$cur->cur]);$gi++)
       echo "<br><span class='correct'>" . $cur->ansRows[$cur->cur][$gi]['Spelling'] ."</span>"
  ?>
</form>

<br>
<br>
<br>

</body>
</html>
