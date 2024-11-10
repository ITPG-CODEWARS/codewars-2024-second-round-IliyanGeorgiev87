<?php

@include 'config.php';

session_start();

if(!isset($_SESSION['user_name'])){
   header('location:login_form.php');
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>User Page</title>

   <!-- css link -->
   <link rel="stylesheet" href="css/style.css">

   <!-- JavaScript -->
   <script src="script.js"></script>

</head>
<body>

<div class="container">
   <div class="content">
   <center>
      <div class="form-container">
      <form method="POST" action="shorten_url.php" id="shortenForm">

            <!-- линк -->
            <label>Въведи линк за съкращаване</label>
            <input type="text" id="urlInput" name="longLink" placeholder="Въведи линк за съкращаване"/>

            <!-- Дължина на URL -->
            <label>Дължина URL</label>
            <input type="number" id="lengthInput" name="lengthInput" placeholder="Въведи дължина (5-20, задължително)" min="5" max="20"/>

            <!-- Въведи псевдоним -->
            <label>Въведи псевдоним</label>
            <input type="text" id="aliasInput" name="aliasInput" placeholder="Въведи псевдоним тук (по избор)"/>

            <!-- Въведи време за изтичане -->
            <label>Време за изтичане (в минути)</label>
            <input type="number" id="expiryInput" name="expiryInput" placeholder="Въведи време за изтичане (по избор)" min="0"/>

            <!-- Въведи макс брой използвания -->
            <label>Максимален брой използвания</label>
            <input type="number" id="maxUsesInput" name="usesInput" placeholder="Въведи брой използвания (0- безкрайност)" min="0"/>

            <!-- QR код -->
            <div id="qrCodeContainer" style="margin-top: 2%; margin-bottom: 5%;">
               <h3>QR Code</h3>
               <img id="qrCodeImage" src="" alt="QR Code" style="max-width: 100%; height: auto;" />
            </div>

               <!-- буттон за съкращение -->
               <button type="button" id="shortenButton">Съкрати</button>
   
               <!-- бутон за запазване на QR код -->
               <button type="button" id="saveButton" style="display:none;">Запази QR Code</button>
   
               <!-- извеждане на резултатите -->
               <div class="output" id="output" style="display: none;">
                  <p>Съкратен link: <a id="shortenedLink" href="#" target="_blank"></a></p>
               </div>
            </form>
         </div>
      </center>
   </div>
</div>

</body>
</html>
