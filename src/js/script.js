// Declarações dos Elementos usando DOM(Document Object Model)
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");


// Função assíncrona para habilitar a câmera
async function configurarCamera(){

    try{

        const midia = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: "environment"
            },

            audio: false
        });

        videoElemento.srcObject = midia;

        videoElemento.play();

    }catch(erro){

        resultado.innerText = "Erro ao acessar a câmera";
        console.log(erro);

    }

}

configurarCamera();


// Função para capturar o texto da câmera
botaoScanear.onclick = async () => {

    botaoScanear.disabled = true;

    resultado.innerText = "Fazendo a leitura do texto... aguarde";

    const contexto = canvas.getContext("2d");

    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    contexto.filter = 'contrast(1.2) grayscale(1)';

    contexto.drawImage(videoElemento, 0, 0, canvas.width, canvas.height);

    try{

        const { data: { text } } = await Tesseract.recognize(
            canvas,
            'por'
        );

        const textoFinal = text.trim();

        resultado.innerText = textoFinal.length > 0
            ? textoFinal
            : "Não foi possível identificar o texto";

    }catch(erro){

        resultado.innerText = "Erro no processamento";
        console.log(erro);

    }finally{

        botaoScanear.disabled = false;

    }

};