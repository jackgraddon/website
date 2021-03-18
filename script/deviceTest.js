function testMobile() {
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = "mobile.html";
    }
  }
  function testPC() {
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    } else {
       window.location.href = "index.html";
    }
  }