function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;
        if (!file.type.match(imageType)) {
            alert('error file')
            continue;
        }
        var reader = new FileReader();
        reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);
    }
}

function handleUrl() {
    let url = document.getElementById(ID.url).value;
    img.src = url;
    document.getElementById(ID.url).onkeydown = function(){
        this.style.color = 'black';
    }
}

function useExample1() {
    img.src = '1.jpg';
}

function useExample2() {
    img.src = '2.jpg';
}