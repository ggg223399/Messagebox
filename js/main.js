function addLoadEvent(func){  
    var oldonLoad = window.onload;  
    if(typeof window.onload!='function'){  
            window.onload = func;  
    }  
    else{  
        window.onload = function(){  
            oldonload();  
            func();  
        }  
    }  
}

function insertAfter(newElement, targetElement){
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
        parent.appendChild(newElement);
    }
    else {
        parent.insertBefore(newElement, targetElement.nextSibling);
        //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
    }
}


var openRequest = indexedDB.open("test", 1);
var db;

openRequest.onupgradeneeded = function(e) {
    console.log("upgrading...");
    db = e.target.result;
    db.createObjectStore('test', {autoIncrement: true});
}

openRequest.onsuccess = function(e) {
    console.log("Success!");
    db = e.target.result;
    click(db);
    loadData(e);

}

function click(e) {
    //点击后的行为
    var Buttom = document.getElementById('btn');
    Buttom.onclick = function() {
        var t = e.transaction(["test"], "readwrite");
        var store = t.objectStore('test');

        var Name = document.getElementById('name').value
        var Message = document.getElementById('message').value;

        //检测是否没有输入，如果没有输入就不要把数据录入数据库
        if (Name == '' && Message == '') {
            console.log("please enter name");
        } else {
            arr = [{'name': Name, 'message': Message}];
            var request = store.add(arr);
            loadDataNow(e);
            }
        }
}

openRequest.onerror = function(e) {
    console.log("Error");
    console.dir(e);
}

function loadDataNow(e) {
    //删除上次显示的元素
    var parent = document.getElementById("body");
    var child = document.getElementsByName("article");
    var num = child.length;

    for (i=0; i<num; num--) {
        parent.removeChild(child[i]);
    }

    //利用事件去请求挨个显示数据库中的内容
    var t = db.transaction(["test"], "readonly");
    var store = t.objectStore('test');

    var cursor =store.openCursor();
    cursor.onsuccess = function(e) {
        var res = e.target.result;
        if (res) {
            var Name = res.value[0].name;
            var Message = res.value[0].message;
            console.log("alfjghale");
            displayWeb(Name, Message);
            res.continue();
        }
    }

}

function loadData(e) {
    //打开页面的时候显示历史纪录
    var t = db.transaction(["test"], "readonly");
    var store = t.objectStore('test');

    var cursor = store.openCursor();

    var Data;

    cursor.onsuccess = function(e) {
        var res = e.target.result;
        if (res) {
            var Name = res.value[0].name;
            var Message = res.value[0].message;

            displayWeb(Name, Message);

            res.continue();
        }
    }
}

function displayWeb(Name, Message) {
    //用来在页面中显示
    var btn = document.getElementById('btn');

    var newMessage = document.createElement("article");
    newMessage.setAttribute("id", "article");
    newMessage.setAttribute("name", "article");

    var newName = document.createElement("h1");
    var nodName = document.createTextNode(Name);
    newName.appendChild(nodName);

    var newText = document.createElement("p");
    var nodeText = document.createTextNode(Message);
    newText.appendChild(nodeText);

    newMessage.appendChild(newName);
    newMessage.appendChild(newText);

    insertAfter(newMessage, btn);
}

//addLoadEvent(btn);