$.get('static/dataMocap.json', function(data) {
  console.log(data);
  const fileList = document.getElementById('file-list');
  for (let i = 0; i < data.datas.length; i++) {
    const dict = data.datas[i];
    const li = document.createElement('div');
    li.className = "file-list-elem";
    const button = document.createElement('button');
    button.textContent = dict.name;
    button.className = "file-list-elem-button";
    button.onclick = function() { // set the onclick function
      updateFileName(dict.name); // call updateTitle with the name of the file
    };
    const delButton = document.createElement('button');
    delButton.textContent = "Delet";
    delButton.className = "file-list-del-button";
    delButton.onclick = function() { // set the onclick function
      deleteFile(dict.name); // call updateTitle with the name of the file
    };

    li.appendChild(button);
    li.appendChild(delButton);
    fileList.appendChild(li);
    
  }
});


function updateFileName(value){
  let data = {name:value};
  location.href = "reading.html?data=" + encodeURIComponent(JSON.stringify(data));
}

function deleteFile(filename) {
  fetch('/delete-file', {
    method: 'DELETE',
    body: JSON.stringify({ filename: filename }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      console.log('File deleted successfully');
      location.href = "index.html";
    } else {
      console.error('Error deleting file:', response.status);
    }
  }).catch(error => {
    console.error('Error deleting file:', error);
  });
}

