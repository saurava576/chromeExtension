const scriptCodeCollect =
  `(function() {
      chrome.storage.local.get('savedImages', function(result) {
      			if(result.savedImages)
      				console.log("savedImages null");
				let images = document.querySelectorAll('img');
				let srcArray = Array.from(images).map(function(image) {
					return image.currentSrc;
				});
				result.savedImages = srcArray;
				chrome.storage.local.set(result);
				console.log("local collection setting success");
			});
			console.log("success");
		chrome.storage.local.get('savedImages', function(result) {
			console.log("fetched " + result.savedImages.length + " to download");
		});	
    })();`;

const scriptCodeDownload =
  `(function() {
      chrome.storage.local.get('savedImages', function(result) {
      			imagestodownload = [];
      			for (let src of result.savedImages) {
      				if (src) imagestodownload.push(src); 
      			};
      			if(imagestodownload)
      				console.log("Found:"+imagestodownload.length+" images to download");
				result.savedImages = imagestodownload;
				chrome.storage.local.set(result);
			});
		chrome.storage.local.get('savedImages', function(result) {
			let message = {
				"savedImages" : result.savedImages
			};
			chrome.runtime.sendMessage(message, function(){
				console.log("sending success");
			});
		});
    })();`;

window.onload = function() {
	let collectButton = document.getElementById('collect_images');
	collectButton.onclick = function() {
		chrome.tabs.executeScript({code : scriptCodeCollect});	
		chrome.storage.local.get('savedImages', function(result) {
			if(result.savedImages.length > 0)
				collectButton.innerHTML = "Collected "+ result.savedImages.length + " images";
		});
	};

	let downloadButton = document.getElementById('download_images');
	downloadButton.onclick = function() {
		downloadButton.innerHTML = "Downloaded ";
		chrome.tabs.executeScript({code : scriptCodeDownload});
	};		
};