let jsonData = null; // Variabile per salvare il JSON caricato
let chart = null; // Variabile per il grafico

document.getElementById('fileInput').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        try {
            jsonData = JSON.parse(e.target.result); // Salva il JSON nei dati globali
            let categories = jsonData.categorie || [];

            let selectElement = document.getElementById('category');
            selectElement.innerHTML = '<option>Seleziona una categoria</option>'; // Reset della select

            categories.forEach(category => {
                let option = document.createElement('option');
                option.value = category.nome;
                option.textContent = category.nome;
                selectElement.appendChild(option);
            });
            let anno = jsonData.anno;
            document.getElementById('anno').innerHTML = anno;
            selectElement.addEventListener('change', aggiornaGrafico); // Aggiorna il grafico al cambio di categoria

        } catch (error) {
            console.error("Errore nel parsing del JSON:", error);
        }
    };
    reader.readAsText(file);
});

function aggiornaGrafico() {
    if (!jsonData) return;

    let selectedCategory = document.getElementById('category').value;
    let categoria = jsonData.categorie.find(cat => cat.nome === selectedCategory);

    if (!categoria) return;

    let labels = categoria.sottocategorie.map(sub => sub.nome);
    let values = categoria.sottocategorie.map(sub => sub.spesa_media);
    let colors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145", "#ffcc00"];

    if (chart) {
        chart.destroy(); // Rimuove il grafico precedente
    }

    chart = new Chart("grafico", {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: colors.slice(0, labels.length),
                data: values
            }]
        },
        options: {
            title: {
                display: true,
                text: `Spese per ${selectedCategory}`
            }
        }
    });
}
