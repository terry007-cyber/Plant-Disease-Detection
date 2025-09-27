document.addEventListener('DOMContentLoaded', function() {
    const encyclopediaData = [
        // Tomato diseases
        {
            title: "Tomato - Late Blight",
            plant: "tomato",
            description: "Late blight is a devastating disease of tomatoes caused by the water mold Phytophthora infestans. It can rapidly destroy foliage, stems, and fruit, especially in cool, wet conditions.",
            symptoms: ["Dark lesions", "White fungal growth", "Fruit rot"],
            treatment: "Remove and destroy infected plants. Apply fungicides containing chlorothalonil or copper. Practice crop rotation and avoid overhead watering."
        },
        {
            title: "Tomato - Septoria Leaf Spot",
            plant: "tomato",
            description: "Septoria leaf spot is a fungal disease caused by Septoria lycopersici. It primarily affects leaves, leading to premature defoliation and reduced yield.",
            symptoms: ["Small circular spots", "Yellowing leaves", "Leaf drop"],
            treatment: "Remove affected leaves. Apply fungicides such as chlorothalonil. Practice crop rotation and avoid overhead watering."
        },
        {
            title: "Tomato - Bacterial Speck",
            plant: "tomato",
            description: "Bacterial speck is caused by Pseudomonas syringae pv. tomato. It affects leaves, stems, and fruit, especially under cool, moist conditions.",
            symptoms: ["Small dark spots on leaves", "Specks on fruit", "Leaf yellowing"],
            treatment: "Use certified disease-free seed. Apply copper-based bactericides. Avoid working with wet plants."
        },
        {
            title: "Tomato - Fusarium Wilt",
            plant: "tomato",
            description: "Fusarium wilt is a soil-borne fungal disease caused by Fusarium oxysporum f. sp. lycopersici. It causes wilting and yellowing of leaves, often on one side of the plant.",
            symptoms: ["Yellowing leaves", "Wilting", "Brown vascular tissue"],
            treatment: "Plant resistant varieties. Rotate crops. Remove and destroy infected plants."
        },

        // Potato diseases
        {
            title: "Potato - Early Blight",
            plant: "potato",
            description: "Early blight is a common fungal disease of potatoes caused by Alternaria solani. It leads to leaf spots and can reduce tuber yield and quality.",
            symptoms: ["Brown spots with rings", "Yellow halos", "Leaf drop"],
            treatment: "Use resistant varieties. Remove infected leaves. Apply fungicides early in the season. Rotate crops and avoid wetting foliage."
        },
        {
            title: "Potato - Blackleg",
            plant: "potato",
            description: "Blackleg is a bacterial disease of potatoes caused by Pectobacterium species. It results in blackened stems and soft rot, especially in wet soils.",
            symptoms: ["Blackened stems", "Soft rot", "Wilting"],
            treatment: "Use certified disease-free seed. Remove and destroy infected plants. Improve soil drainage."
        },
        {
            title: "Potato - Late Blight",
            plant: "potato",
            description: "Late blight, caused by Phytophthora infestans, is a serious disease of potatoes. It can destroy foliage and tubers rapidly under cool, moist conditions.",
            symptoms: ["Water-soaked lesions", "White mold on undersides", "Tuber rot"],
            treatment: "Apply fungicides preventively. Remove infected plants. Practice crop rotation and proper field sanitation."
        },
        {
            title: "Potato - Common Scab",
            plant: "potato",
            description: "Common scab is caused by Streptomyces bacteria and affects potato tubers, resulting in rough, corky lesions on the surface.",
            symptoms: ["Corky lesions on tubers", "Pitted spots", "Reduced marketability"],
            treatment: "Maintain soil moisture during tuber formation. Use resistant varieties. Rotate crops with non-host plants."
        },

        // Corn diseases
        {
            title: "Corn - Northern Corn Leaf Blight",
            plant: "corn",
            description: "Northern corn leaf blight is a fungal disease caused by Exserohilum turcicum. It produces long, gray-green lesions on leaves, reducing photosynthesis and yield.",
            symptoms: ["Long, elliptical lesions", "Leaf yellowing", "Reduced yield"],
            treatment: "Plant resistant hybrids. Rotate crops. Apply fungicides if disease pressure is high."
        },
        {
            title: "Corn - Southern Rust",
            plant: "corn",
            description: "Southern rust is a fungal disease of corn caused by Puccinia polysora. It develops orange pustules on leaves and can significantly reduce yield.",
            symptoms: ["Orange pustules", "Leaf discoloration", "Reduced photosynthesis"],
            treatment: "Plant resistant varieties. Apply fungicides if detected early. Rotate crops."
        },
        {
            title: "Corn - Gray Leaf Spot",
            plant: "corn",
            description: "Gray leaf spot is caused by the fungus Cercospora zeae-maydis. It produces rectangular lesions on leaves, which can coalesce and kill large areas of tissue.",
            symptoms: ["Rectangular gray lesions", "Leaf blight", "Yield loss"],
            treatment: "Use resistant hybrids. Rotate crops. Apply fungicides if necessary."
        },
        {
            title: "Corn - Anthracnose Stalk Rot",
            plant: "corn",
            description: "Anthracnose stalk rot is caused by Colletotrichum graminicola. It leads to stalk discoloration, lodging, and yield loss.",
            symptoms: ["Black streaks on stalks", "Stalk lodging", "Premature plant death"],
            treatment: "Plant resistant hybrids. Rotate crops. Manage crop residue."
        },

        // Grape diseases
        {
            title: "Grape - Downy Mildew",
            plant: "grape",
            description: "Downy mildew is a fungal disease affecting grapevines caused by Plasmopara viticola. It thrives in humid conditions and can damage leaves and fruit.",
            symptoms: ["Yellow spots on leaves", "White mold on undersides", "Fruit shriveling"],
            treatment: "Apply copper-based fungicides. Remove infected leaves. Ensure good air circulation and avoid overhead irrigation."
        },
        {
            title: "Grape - Powdery Mildew",
            plant: "grape",
            description: "Powdery mildew, caused by Erysiphe necator, is a common fungal disease of grapes. It affects all green parts of the vine and reduces fruit quality.",
            symptoms: ["White powdery coating", "Leaf curling", "Poor fruit set"],
            treatment: "Apply sulfur-based fungicides. Use resistant varieties. Prune for better air flow."
        },
        {
            title: "Grape - Black Rot",
            plant: "grape",
            description: "Black rot is a fungal disease caused by Guignardia bidwellii. It affects leaves, shoots, and fruit, causing black lesions and fruit rot.",
            symptoms: ["Brown leaf spots", "Black fruit rot", "Shoot lesions"],
            treatment: "Remove and destroy infected plant parts. Apply fungicides. Maintain good vineyard sanitation."
        },
        {
            title: "Grape - Botrytis Bunch Rot",
            plant: "grape",
            description: "Botrytis bunch rot, or gray mold, is caused by Botrytis cinerea. It infects grape clusters, especially in wet weather, leading to fruit decay.",
            symptoms: ["Gray mold on fruit", "Berry shriveling", "Cluster rot"],
            treatment: "Remove infected clusters. Improve air circulation. Apply fungicides as needed."
        }
    ];
    // Add more entries here

    const grid = document.querySelector('.encyclopedia-grid');
    const searchInput = document.getElementById('encyclopedia-search');
    const filterSelect = document.getElementById('encyclopedia-filter');

    // Initial render
    renderCards(encyclopediaData);

    // Event listeners
    searchInput.addEventListener('input', filterCards);
    filterSelect.addEventListener('change', filterCards);

    function renderCards(data) {
        grid.innerHTML = data.map(item => `
            <div class="encyclopedia-card">
                <div class="encyclopedia-header">
                    <h3>${item.title}</h3>
                </div>
                <div class="encyclopedia-content">
                    <div class="disease-description">${item.description}</div>
                    <div class="disease-symptoms">
                        <h4>Symptoms:</h4>
                        <ul>${item.symptoms.filter(s => s && s.trim()).map(s => `<li>${s}</li>`).join('')}</ul>
                    </div>
                    <div class="disease-treatment">
                        <h4>Treatment:</h4>
                        <div>${item.treatment}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function filterCards() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value.toLowerCase();

        const filtered = encyclopediaData.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                                 item.description.toLowerCase().includes(searchTerm) ||
                                 item.symptoms.some(s => s.toLowerCase().includes(searchTerm));
            
            const matchesFilter = filterValue === 'all' || 
                                item.plant.toLowerCase() === filterValue;

            return matchesSearch && matchesFilter;
        });

        renderCards(filtered);
    }
});