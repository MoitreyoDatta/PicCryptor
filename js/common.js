document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('imageInput');
    const imageInput2 = document.getElementById('imageInput2');
    const uploadButton = document.getElementById('uploadButton');
    const uploadButton2 = document.getElementById('uploadButton2');
    const originalImagePreview = document.getElementById('originalImagePreview');
    const showOptions = document.getElementById('showOptions');                              
    const decryptedImage = document.getElementById('decryptedImage'); 
    const decryptShow = document.getElementById('decryptShow');                                             
    const downloadDecryptedLink = document.getElementById('downloadDecryptedLink');
    const encryptButton = document.getElementById('encryptButton');
    const decryptButton = document.getElementById('decryptButton');
    const decryptionKeyInput = document.getElementById('decryptionKey');
    
    //Generate Encryption string from timestamp value
    function getEncryptedString(key)
    {
        var str=key.toString();
        var res="";
        
        for(let i=0;i<str.length;i++)
            res+=String.fromCharCode(str.charCodeAt(i)+25);
        return res;
    }

    //Get back timestamp value from Encrypton string
    function decryptEncryptedString(str)
    {
        var res=""

        for(let i=0;i<str.length;i++)
            res+=String.fromCharCode(str.charCodeAt(i)-25);

        var doubleRes=parseFloat(res);
        return doubleRes;
    }
    
    
    // Function to show a preview of the uploaded image
    function showOriginalImagePreview(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            originalImagePreview.src = event.target.result;
            originalImagePreview.style.display = 'block';
            showOptions.style.display = 'flex';
            showOptions.style.flexDirection = 'column';
        };
    reader.readAsDataURL(file);
    }

    if(uploadButton){                                                                                            
        uploadButton.addEventListener('click', function () {
            // Trigger the hidden file input element to allow the user to select an image for encryption
            imageInput.click();
        });
    }
    if(imageInput){                                                                                             
        imageInput.addEventListener('change', function () {
            if (imageInput.files.length > 0) {
                showOriginalImagePreview(imageInput.files[0]);
            } else {
                originalImagePreview.style.display = 'none';
            }
        });
    }

    // Function to encrypt the image using XOR operation
    function encryptImage(imageData, key) {
        let encryptedData = new Uint8Array(imageData.length);                                                    
        for (let i = 0; i < imageData.length; i++) {
            encryptedData[i] = imageData[i] + key;
        }
        return encryptedData;
    }

    // Function to decrypt the image using XOR operation
    function decryptImage(encryptedData, key) {
        return encryptImage(encryptedData, -1*key); // XOR is its own inverse
    }
    if(encryptButton){                                                                                       
        encryptButton.addEventListener('click', function () {
            if (imageInput.files.length === 0) {
                alert('Please select an image to encrypt.');
                return;
            }
    
            const file = imageInput.files[0];
            const reader = new FileReader();
    
            reader.onload = function (event) {
                const imageData = new Uint8Array(event.target.result);

                //Generate the Timestamp in seconds as encryptionKey
                const encryptionKey = new Date().getTime()/1000;
                const encryptionString= getEncryptedString(encryptionKey);
    
                // Display the encryption key
                alert(`Encryption Key: ${encryptionString}`);
                
                const downloadEncryptedLink = document.getElementById('downloadEncryptedLink');             
                const encryptedData = encryptImage(imageData, encryptionKey);
                const encryptedBlob = new Blob([encryptedData], { type: file.type });
                downloadEncryptedLink.href = URL.createObjectURL(encryptedBlob);
                downloadEncryptedLink.style.display = 'block';
            };
    
            reader.readAsArrayBuffer(file);
        });
    }

    if(uploadButton2){                                                                                        
        uploadButton2.addEventListener('click', function () {                                                      
            // Trigger the hidden file input element to allow the user to select an image for decryption
            imageInput2.click();
        });
    }

    if(decryptButton){                                                                                         
        decryptButton.addEventListener('click', function () {
            if (decryptionKeyInput === null) {
                alert('Please encrypt an image first to generate the key.');
                return;
            }
    
            if (imageInput2.files.length === 0) {                                                              
                alert('Please select an image to decrypt.');
                return;
            }
    
            const file = imageInput2.files[0];                                                                 
            const reader = new FileReader();
    
            reader.onload = function (event) {                             
                const imageData = new Uint8Array(event.target.result);

                //const decryptionKey = decryptionKeyInput.value;
                const decryptionKey = decryptEncryptedString(decryptionKeyInput.value);

                const decryptedData = decryptImage(imageData, decryptionKey);
                decryptedImage.src = URL.createObjectURL(new Blob([decryptedData], { type: file.type }));
                decryptedImage.style.display = 'block';
                downloadDecryptedLink.href = URL.createObjectURL(new Blob([decryptedData], { type: file.type }));
                downloadDecryptedLink.href = URL.createObjectURL(new Blob([new Uint8Array(decryptedData.buffer)], { type: file.type }));
                downloadDecryptedLink.style.display = 'block';
                decryptShow.style.display = "block";
            };
    
            reader.readAsArrayBuffer(file);
        });
    }
});
