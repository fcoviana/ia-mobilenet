async function onChange(event) {
  const img = document.getElementById('img');
  setPreviewImage(event, img);
  await handle(img);
}

function setPreviewImage(event, img) {
  const selectedFile = event.target.files[0];
  const reader = new FileReader();

  img.title = selectedFile.name;

  reader.onload = (event) => {
    img.src = event.target.result;
  }

  reader.readAsDataURL(selectedFile);
}

async function handle(img) {
  let result = document.getElementsByClassName('result');
  let loading = document.getElementById('loading');
  loading.style.display = 'block';

  const model = await mobilenet.load();
  const predictions = await model.classify(img);

  console.log('predictions', predictions);

  predictions.forEach((prediction) => {
    const { className, probability } = prediction;
    const probabilityFixed = (probability * 100).toFixed(2);

    const div = document.createElement('div');
    div.setAttribute('class', 'result-progress');
    loading.style.display = 'none';
    generateProgress({ div, className, probabilityFixed });

    result[0].appendChild(div);
  });
}

function generateProgress(data) {
  const { div, className, probabilityFixed } = data;
  div.innerHTML = `
    <h6>${className}</h6>
    <div class="progress" 
      style="width: 400px; height: 26px;">
      <div class="progress-bar" 
        role="progressbar" 
        style="width: ${probabilityFixed}%;">
          <b>${probabilityFixed}%</b>
        </div>
     </div>
     `;
}