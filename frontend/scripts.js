document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const analyzeBtn = document.getElementById('analyze-btn');
    const removeImageBtn = document.getElementById('remove-image');
    const resultsSection = document.getElementById('results-section');
    const newAnalysisBtn = document.getElementById('new-analysis');
    const loadingOverlay = document.getElementById('loading-overlay');
    const browseBtn = document.getElementById('browse-btn');
    const cropSelectionSection = document.getElementById('crop-selection');
    const imageUploadSection = document.getElementById('image-upload');
    const confidenceMeter = document.querySelector('.confidence-meter');
    const confidenceValue = document.getElementById('confidence-value');
    const diseaseResult = document.getElementById('disease-result');
    const treatmentResult = document.getElementById('treatment-result');
    const severityResult = document.getElementById('severity-result');
    const recoveryResult = document.getElementById('recovery-result');
    const videoContainer = document.getElementById('video-container');
    const diseaseInfoSection = document.getElementById('disease-info');
    const cropCards = document.querySelectorAll('.crop-card');
    const saveReportBtn = document.getElementById('save-report');
    const languageSelect = document.getElementById('language-select');

    // App State
    let currentCrop = null;
    let currentDisease = null;
    let currentImage = null;

    // Initialize the application
    function init() {
        
        console.log('Application initialized');
        setupEventListeners();
        updateProgressSteps(1);
    }


    // Set up all event listeners
    function setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop zone
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);

        // File input change
        fileInput.addEventListener('change', handleFileSelect);

        // Browse button click
        browseBtn.addEventListener('click', () => fileInput.click());

        // Remove image button
        removeImageBtn.addEventListener('click', resetImageUpload);

        // Analyze button
        analyzeBtn.addEventListener('click', analyzeImage);

        // New analysis button
        newAnalysisBtn.addEventListener('click', resetAnalysis);

        // Save report button
        saveReportBtn.addEventListener('click', saveReport);

        // Crop selection
        cropCards.forEach(card => {
            card.addEventListener('click', function() {
                selectCrop(this);
            });
        });

        // Language selection
        languageSelect.addEventListener('change', changeLanguage);
    }

    // Prevent default drag behaviors
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop zone
    function highlight() {
        dropZone.classList.add('drag-over');
    }
    // Add this to your existing analysis submission logic


    // Remove highlight from drop zone
    function unhighlight() {
        dropZone.classList.remove('drag-over');
    }

    // Handle dropped files
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle file selection via input
    function handleFileSelect() {
        if (this.files && this.files[0]) {
            handleFiles(this.files);
        }
    }

    // Process selected files
    function handleFiles(files) {
        if (files.length > 1) {
            showAlert('Please upload only one image at a time.', 'error');
            return;
        }

        const file = files[0];
        if (!file.type.match('image.*')) {
            showAlert('Please upload an image file (JPEG, PNG).', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showAlert('Image size should be less than 5MB.', 'error');
            return;
        }

        currentImage = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove('hidden');
            dropZone.classList.add('hidden');
            updateProgressSteps(2);
        };
        reader.readAsDataURL(file);
    }

    // Reset image upload
    function resetImageUpload() {
        fileInput.value = '';
        imagePreview.src = '#';
        previewContainer.classList.add('hidden');
        dropZone.classList.remove('hidden');
        currentImage = null;
    }

    // Select crop type
    function selectCrop(card) {
        console.log('Crop selected:', card.dataset.crop);
        
        // Remove selected class from all cards
        cropCards.forEach(card => card.classList.remove('selected'));
        
        // Add selected class to clicked card
        card.classList.add('selected');
        
        // Set current crop
        currentCrop = card.dataset.crop;
        
        // Show image upload section
        cropSelectionSection.classList.add('hidden');
        imageUploadSection.classList.remove('hidden');
        
        // Update progress steps
        updateProgressSteps(2);
    }

    // Analyze the uploaded image
   // Modify your existing analyzeImage function
async function analyzeImage() {
    if (!currentImage) {
        showAlert('Please select an image first.', 'error');
        return;
    }

    if (!currentCrop) {
        showAlert('Please select a crop type.', 'error');
        return;
    }

    showLoading(true);

    try {
        const formData = new FormData();
        formData.append('file', currentImage);
        formData.append('crop_type', currentCrop);

        let analysisResult;

        if (!window.backendConnected) {
            // Mock data for testing
            console.log('Using mock data for testing');
            await new Promise(resolve => setTimeout(resolve, 1500));
            analysisResult = {
                crop: currentCrop,
                disease: `${currentCrop}_Early_blight`,
                confidence: 0.85 + Math.random() * 0.1,
                treatment: "Apply copper-based fungicides weekly",
                severity: "Moderate",
                recovery: "3-5 weeks",
                timestamp: new Date().toISOString()
            };
        } else {
            // Real API call
            const response = await fetch(`http://localhost:8000/predict/${currentCrop}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            analysisResult = await response.json();
        }

        // Process and display results
        processAnalysisResults(analysisResult);

        // Save to history
        saveToHistory({
            plantType: currentCrop,
            diagnosis: analysisResult.disease,
            confidence: Math.round(analysisResult.confidence * 100),
            imageData: imagePreview.src, // Base64 image data
            treatment: analysisResult.treatment,
            severity: analysisResult.severity
        });

    } catch (error) {
        console.error('Analysis error:', error);
        showAlert('Analysis failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Add this inside your processAnalysisResults function
function processAnalysisResults(data) {
    console.log('Processing results:', data);
    currentDisease = data.disease;

    // Update UI elements
    diseaseResult.textContent = formatDiseaseName(data.disease);
    treatmentResult.textContent = data.treatment;
    severityResult.textContent = data.severity || 'Moderate';
    recoveryResult.textContent = data.recovery || '2-4 weeks with treatment';

    // Update confidence meter
    const confidencePercent = Math.round(data.confidence * 100);
    confidenceValue.textContent = `${confidencePercent}%`;
    confidenceMeter.style.background = `conic-gradient(var(--primary-color) ${confidencePercent}%, transparent ${confidencePercent}%)`;

    // Show results section
    imageUploadSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    updateProgressSteps(3);

    // Load disease information
    loadDiseaseInfo(data.disease);

    // Load related videos (you'll need to implement this)
    loadTreatmentVideos(data.disease);
}

// Add the saveToHistory function (make sure it's in the scope)
function saveToHistory(analysisData) {
    const history = JSON.parse(localStorage.getItem('plantAnalysisHistory') || '[]');
    
    const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        plantType: analysisData.plantType,
        disease: analysisData.diagnosis,
        confidence: analysisData.confidence,
        image: analysisData.imageData,
        treatment: analysisData.treatment,
        severity: analysisData.severity
    };

    history.unshift(newEntry);
    localStorage.setItem('plantAnalysisHistory', JSON.stringify(history));
    console.log('Analysis saved to history:', newEntry);
}

    // Format disease name for display
    function formatDiseaseName(disease) {
        return disease
            .replace(/_/g, ' ')
            .replace(/(^|\s)\S/g, match => match.toUpperCase());
    }

    // Load disease information
  function loadDiseaseInfo(disease) {
    const lang = document.documentElement.lang || 'en';
    
    // Disease information database (add Amharic and Oromo translations)
    const diseaseData = {
        // Tomato Diseases
        'Tomato_Bacterial_spot': {
            en: {
                description: "Bacterial spot is a common disease causing small, dark lesions on leaves and fruits.",
                symptoms: ["Small water-soaked spots", "Yellow halos around lesions", "Fruit cracking"],
                prevention: "Use disease-free seeds, practice crop rotation, and apply copper-based bactericides."
            },
            am: {
                description: "ባክቴሪያ ስፖት በቅጠሎች እና ፍራፍሬዎች ላይ ትናንሽ ጥቁር ቦታዎችን የሚያስከትል የተለመደ በሽታ ነው።",
                symptoms: ["ትናንሽ በውሃ የተሞሉ ቦታዎች", "በቦታዎች ዙሪያ ቢጫ ክበቦች", "ፍራፍሬ ስለምትቀደድ"],
                prevention: "ነቀምሳ ያልሆኑ ዘሮች ይጠቀሙ፣ የተክል ምርት ይለውጡ እና የሚድግስ ባክቴሪያ መድኃይቂያዎችን ይጠቀሙ።"
            },
            om: {
                description: "Dhukkubni kun baakteeriyaa kan leaves fi fuduraalee irratti mallattoo gurraacha xixiqqoo uumuudha.",
                symptoms: ["Bakka bishaanii xixiqqoo", "Ciircaa diimaa bakka jiru irra", "Fuduraalee ciccimuu"],
                prevention: "Sanyi hin qabne fayyadamaa, ijaarsa biqiltuu jijjiiraa, fi qoricha baakteriyaa irratti hojjedhaa."
            }
        },
        'Tomato_Early_blight': {
            en: {
                description: "Fungal disease causing concentric ring spots on older leaves.",
                symptoms: ["Brown spots with target-like rings", "Yellowing leaves", "Defoliation"],
                prevention: "Remove infected plants, improve air circulation, use fungicides."
            },
            am: {
                description: "በብርቱካን እድሜ ላይ ያሉ ቅጠሎች ላይ ክብ ክብ ቦታዎችን የሚያስከትል የፈንገስ በሽታ።",
                symptoms: ["ከባድ ቀለም ያላቸው ቦታዎች", "ቢጫ የሆኑ ቅጠሎች", "ቅጠሎች መውደቅ"],
                prevention: "በበሽታ የደረሱ ተክሎችን ያስወግዱ፣ አየር ማስተላለፍን ያሻሽሉ፣ ፈንገስ መድኃይቂያዎችን ይጠቀሙ።"
            },
            om: {
                description: "Dhukkubni kun qaamolee gurraachaa fi diimaa baay’ee guddaa uumuudha.",
                symptoms: ["Mallattoo gurraachaa fi diimaa", "Baala diimaa", "Baala dhangala’uu"],
                prevention: "Dhukkubni qabeenyaa baasu, qilleensi fooyya’uu, fungicidii fayyadami."
            }
        },
'Tomato_Late_blight': {
    en: {
        description: "Destructive fungal disease causing rapid plant collapse, often in cool wet weather.",
        symptoms: [
            "Irregular green-black water-soaked lesions",
            "White mold under leaves in humidity",
            "Rapid browning and wilting"
        ],
        prevention: "Destroy infected plants, use drip irrigation, apply chlorothalonil-based fungicides."
    },
    am: {
        description: "በቀዝቃዛ እና እርጥበት ያለበት አየር ሁኔታ ውስጥ ተክሉን በፍጥነት የሚያጠፋ የፈንገስ በሽታ።",
        symptoms: [
            "ያልተለመዱ አረንጓዴ-ጥቁር ቦታዎች",
            "በቅጠሎች ስር ነጭ ፈንገስ",
            "ፈጣን ቡናማነት እና መድከም"
        ],
        prevention: "የተበከሉ ተክሎችን ያስወግዱ፣ የጠባብ ምርት ዘዴ ይጠቀሙ፣ ክሎሮታሎኒል-ባለ ፈንገስ መድኃይቂያዎችን ይጠቀሙ።"
    },
    om: {
        description: "Dhukkubni kun biqiltuu balaa guddaa uumuudha, aadaan qabbanaa'aa fi roobaa keessatti.",
        symptoms: [
            "Mallattoo bishaanii diimaa fi gurraachaa",
            "Adii baala gadiitti",
            "Dafanii diimaa fi dhangala'uu"
        ],
        prevention: "Dhukkubni qabeenyaa baasu, roobsi dhiyaatuun miidhaa, fungicidii chlorothalonil fayyadami."
    }
},
'Tomato_Leaf_Mold': {
    en: {
        description: "Fungal disease thriving in high humidity, causing yellow leaf spots.",
        symptoms: [
            "Pale green/yellow upper leaf spots",
            "Velvety gray mold underneath",
            "Leaf curling and death"
        ],
        prevention: "Reduce humidity, improve air circulation, use copper fungicides."
    },
    am: {
        description: "በከፍተኛ እርጥበት ውስጥ የሚያድግ የቅጠል ፈንገስ በሽታ።",
        symptoms: [
            "ግልጽ ያልሆነ አረንጓዴ/ቢጫ ቦታዎች",
            "በቅጠል ስር ግራጫ ፈንገስ",
            "ቅጠል መጠቅለል እና ሞት"
        ],
        prevention: "እርጥበት ይቀንሱ፣ አየር ማስተላለፍን ያሻሽሉ፣ የሚድግስ መድኃይቂያዎችን ይጠቀሙ።"
    },
    om: {
        description: "Dhukkubni kun qilleensi baay'ee qabuu keessatti guddatu, baala diimaa uumuudha.",
        symptoms: [
            "Mallattoo diimaa fi magariisa baala irratti",
            "Faaruu gurraacha gadiitti",
            "Baala qabsiisuu fi du'uu"
        ],
        prevention: "Qilleensa hir'isiisi, qilleensi fooyya'uu, fungicidii misira fayyadami."
    }
},
'Tomato_Septoria_leaf_spot': {
    en: {
        description: "Fungal disease creating numerous small spots with dark borders.",
        symptoms: [
            "Small circular spots with gray centers",
            "Yellowing of older leaves",
            "Premature defoliation"
        ],
        prevention: "Remove infected leaves, avoid overhead watering, rotate crops."
    },
    am: {
        description: "በቅጠሎች ላይ ብዙ ትናንሽ ጥቁር ድንበር ያላቸው ቦታዎችን የሚፈጥር የፈንገስ በሽታ።",
        symptoms: [
            "ግራጫ ማእከል ያላቸው ትናንሽ ክብ ቦታዎች",
            "የብርቱካን እድሜ ቅጠሎች መባነን",
            "ቅጠሎች ቅድመ ጊዜ መውደቅ"
        ],
        prevention: "የተበከሉ ቅጠሎችን ያስወግዱ፣ ከላይ ውሃ መስጠት ያስቀሩ፣ የተክል ምርት ይለውጡ።"
    },
    om: {
        description: "Dhukkubni kun mallattoo xixiqqoo fi gurraachaa uumuudha.",
        symptoms: [
            "Mallattoo xixiqqoo giddu gurraachaa qaban",
            "Baala beekkomsaa diimaa",
            "Baala yeroo duraa dhangala'uu"
        ],
        prevention: "Baala dhukkubaa baasu, roobsi irraa of eeggannoo godhaa, ijaarsa jijjiiraa."
    }
},
'Tomato_Spider_mites': {
    en: {
        description: "Tiny arachnids causing stippling damage on leaves.",
        symptoms: [
            "Fine yellow stippling on leaves",
            "Webbing on leaf undersides",
            "Bronzed or bleached appearance"
        ],
        prevention: "Use miticides, increase humidity, remove dust from leaves."
    },
    am: {
        description: "በቅጠሎች ላይ ትናንሽ ጉድለቶችን የሚያስከትሉ ትናንሽ ስፒደር ማይትስ።",
        symptoms: [
            "በቅጠሎች ላይ ትናንሽ ቢጫ ምልክቶች",
            "በቅጠል ስር ድብልቅልቅ",
            "ብርቁዐኛ ወይም ነጭ ቀለም"
        ],
        prevention: "ማይትስ መድኃይቂያዎችን ይጠቀሙ፣ እርጥበት ይጨምሩ፣ ከቅጠሎች ላይ አቧራ ያስወግዱ።"
    },
    om: {
        description: "Qurxummilee xixiqqoon baala irratti miidhaa uumuudha.",
        symptoms: [
            "Mallattoo diimaa xixiqqoo baala irratti",
            "Waraanni baala gadiitti",
            "Halluu adii ykn diimaa"
        ],
        prevention: "Miticide fayyadami, qilleensa dhiyeessuu, aduu baala irraa baasu."
    }
},
'Tomato_Target_Spot': {
    en: {
        description: "Fungal disease creating bullseye-patterned lesions.",
        symptoms: [
            "Concentric rings on leaves",
            "Dark brown spots with yellow halos",
            "Premature leaf drop"
        ],
        prevention: "Apply fungicides early, remove plant debris, use resistant varieties."
    },
    am: {
        description: "በቅጠሎች ላይ ክብ ክብ ቦታዎችን የሚፈጥር የፈንገስ በሽታ።",
        symptoms: [
            "በቅጠሎች ላይ ክብ ክብ ቦታዎች",
            "ጥቁር ቡናማ ቦታዎች ቢጫ ክበቦች ያሏቸው",
            "ቅጠሎች ቅድመ ጊዜ መውደቅ"
        ],
        prevention: "ፈንገስ መድኃይቂያዎችን ቀደም ብለው ይጠቀሙ፣ ተክል ቅሪቶችን ያስወግዱ፣ የተከላከሉ ዝርያዎችን ይጠቀሙ።"
    },
    om: {
        description: "Dhukkubni kun mallattoo wal fakkaataa baala irratti uumuudha.",
        symptoms: [
            "Mallattoo wal fakkaataa baala irratti",
            "Mallattoo diimaa fi ciircaa diimaa",
            "Baala yeroo duraa dhangala'uu"
        ],
        prevention: "Fungicidii yeroo duraa fayyadami, baala dhangala'aa baasu, ijaarsa of eeggannoo qabu fayyadami."
    }
},
'Tomato_Yellow_Leaf_Curl_Virus': {
    en: {
        description: "Viral disease transmitted by whiteflies, causing leaf curl.",
        symptoms: [
            "Upward curling of leaves",
            "Yellowing of leaf edges",
            "Stunted plant growth"
        ],
        prevention: "Control whiteflies, use virus-free plants, remove infected plants."
    },
    am: {
        description: "በነጭ ትንኩሳት የሚተላለፍ የቫይረስ በሽታ።",
        symptoms: [
            "ቅጠሎች ወደ ላይ መጠቅለል",
            "በቅጠል ጫፎች ላይ ቢጫነት",
            "የተክሉ እድገት መቆለፍ"
        ],
        prevention: "ነጭ ትንኩሳትን ይቆጣጠሩ፣ ቫይረስ የሌላቸውን ተክሎች ይጠቀሙ፣ የተበከሉ ተክሎችን ያስወግዱ።"
    },
    om: {
        description: "Dhukkubni kun whiteflies irraa darbuudha, baala qabsiisuu.",
        symptoms: [
            "Baala ol ka'uu",
            "Ciircaa diimaa baala irratti",
            "Guddina biqiltii dhabuu"
        ],
        prevention: "Whiteflies qusachuu, biqiltii virus hin qabne fayyadami, dhukkubni qabeenyaa baasu."
    }
},
'Tomato_mosaic_virus': {
    en: {
        description: "Viral disease causing mottled leaves and fruit deformities.",
        symptoms: [
            "Mosaic-like light/dark patterns",
            "Leaf distortion",
            "Reduced fruit production"
        ],
        prevention: "Disinfect tools, control aphids, use certified seeds."
    },
    am: {
        description: "በቅጠሎች ላይ የተለያዩ ቀለሞችን የሚያስከትል የቫይረስ በሽታ።",
        symptoms: [
            "ብርሃን/ጥቁር ቅርጽ ያላቸው ቅርጾች",
            "ቅጠል መበላሸት",
            "የፍራፍሬ ምርት መቀነስ"
        ],
        prevention: "መሣሪያዎችን ማጽዳት፣ አፊዶችን መቆጣጠር፣ የተረጋገጠ ዘር መጠቀም።"
    },
    om: {
        description: "Dhukkubni kun baala fi midhaa jijjiirama uumuudha.",
        symptoms: [
            "Mallattoo ifaa fi gurraachaa",
            "Baala jijjiiramaa",
            "Midhaa xiqqaatuu"
        ],
        prevention: "Qal'ee qulqullaa'uu, aphid qusachuu, sanyi mirkaneessaa fayyadami."
    }
        },
        // Add similar entries for all other diseases...
        
        // Corn Diseases
        'Corn_Common_rust': {
            en: {
                description: "Fungal disease appearing as rusty pustules on leaves.",
                symptoms: ["Small brown pustules", "Yellow streaks", "Premature leaf death"],
                prevention: "Plant resistant varieties, avoid overhead irrigation."
            },
            am: {
                description: "በቅጠሎች ላይ የቀለም ቦታዎችን የሚያስከትል የፈንገስ በሽታ።",
                symptoms: ["ትናንሽ ቡናማ ቦታዎች", "ቢጫ መስመሮች", "ቅጠሎች ቅድመ ጊዜ ሞት"],
                prevention: "በበሽታ የተከላከሉ ዝርያዎችን ይተክሉ፣ ከላይ ውሃ መስጠት ያስቀሩ።"
            },
            om: {
                description: "Dhukkubni kun qaamolee diimaa fi gurraachaa uumuudha.",
                symptoms: ["Mallattoo diimaa xixiqqoo", "Ciircaa diimaa", "Baala du’a yeroo duraa"],
                prevention: "Dhukkubarraa of eeggannoo qabu ijaaru, roobsi irraa of eeggannoo godhaa."
            }
        },
            'corn_Gray_leaf_spot': {
            en: {
                description: "Fungal disease causing gray lesions on leaves.",
                symptoms: ["Grayish-brown spots", "Yellowing of leaf edges", "Leaf blight"],
                prevention: "Rotate crops, improve air circulation, apply fungicides."
            },

            am: {
                description: "በቅጠሎች ላይ ግራጫ ቦታዎችን የሚያስከትል የፈንገስ በሽታ።",
                symptoms: ["ግራጫ ቡናማ ቦታዎች", "ቢጫ መስመሮች", "ቅጠሎች መውደቅ"],
                prevention: "የተክል ምርት ይለውጡ፣ አየር ማስተላለፍን ያሻሻሉ፣ ፈንገስ መድኃይቂያዎችን ይጠቀሙ።"
            },
            om: {
                description: "Dhukkubni kun baala irratti mallattoo gurraachaa uumuudha.",
                symptoms: ["Mallattoo gurraachaa", "Baala diimaa", "Baala dhangala’uu"],
                prevention: "Ijaarsa jijjiiraa, qilleensa fooyya’uu, fungicidii fayyadami."
            },
        },
        'corn_northern_corn_leaf_blight': {
            en: {
                description: "Fungal disease causing long, narrow lesions on leaves.",
                symptoms: ["Long, narrow brown streaks", "Yellowing of leaf edges", "Leaf blight"],
                prevention: "Rotate crops, improve air circulation, apply fungicides."
            },
            am: {
                description: "በቅጠሎች ላይ የረጅም እና የቀጭን ቦታዎችን የሚያስከትል የፈንገስ በሽታ።",
                symptoms: ["የረጅም እና የቀጭን ቡናማ ቦታዎች", "ቢጫ መስመሮች", "ቅጠሎች መውደቅ"],
                prevention: "የተክል ምርት ይለውጡ፣ አየር ማስተላለፍን ያሻሻሉ፣ ፈንገስ መድኃይቂያዎችን ይጠቀሙ።"
            },
            om: {
                description: "Dhukkubni kun baala irratti mallattoo dheeraa fi darbee uumuudha.",
                symptoms: ["Mallattoo dheeraa", "Baala diimaa", "Baala dhangala’uu"],
                prevention: "Ijaarsa jijjiiraa, qilleensa fooyya’uu, fungicidii fayyadami."
            },

        },


         // Grape Diseases
        'Grape_Black_rot': {
            en: {
                description: "Fungal disease causing black rot on berries and leaves.",
                symptoms: ["Brown leaf spots", "Shriveled berries", "Black fruit lesions"],
                prevention: "Prune for air circulation, apply fungicides early."
            },
            am: {
                description: "በቤሩዎች እና በቅጠሎች ላይ ጥቁር ሽንኩርት የሚያስከትል የፈንገስ በሽታ።",
                symptoms: ["ቡናማ ቦታዎች", "የተጠበሩ ቤሩዎች", "ጥቁር ቦታዎች"],
                prevention: "አየር ማስተላለፍን ለማሻሻል ይቆርጡ፣ ፈንገስ መድኃይቂያዎችን ቀደም ብለው ይጠቀሙ።"
            },
            om: {
                description: "Dhukkubni kun midhaan fi baala irratti mallattoo gurraachaa uumuudha.",
                symptoms: ["Mallattoo diimaa baala irratti", "Midhaan dhangala’aa", "Mallattoo gurraachaa midhaa irratti"],
                prevention: "Qilleensi fooyya’uuf baala ciree, fungicidii yeroo duraa fayyadami."
            }
        },

        'grape_Esca': {
            en: {
                description: "Fungal disease causing leaf necrosis and fruit rot.",
                symptoms: ["Leaf necrosis", "Black streaks on wood", "Fruit shriveling"],
                prevention: "Prune infected wood, improve air circulation."
            },
            am: {
                description: "በቅጠሎች ላይ የነቀላ ወይም የተጠበሩ የፈንገስ በሽታ።",
                symptoms: ["የነቀላ ቅጠሎች", "ጥቁር መስመሮች", "የተጠበሩ ቤሩዎች"],
                prevention: "የተበከሉ ዕንጨቶችን ይገድዱ፣ አየር ማስተላለፍን ያሻሻሉ።"
            },
            om: {
                description: "Dhukkubni kun baala irratti mallattoo dhangala’aa fi midhaan dhangala’uu uumuudha.",
                symptoms: ["Baala dhangala'aa", "Mallattoo gurraachaa", "Midhaan dhangala’uu"],
                prevention: "Baala dhangala’aa baasu, qilleensa fooyya’u."
            }
        },
        
        'grape_leaf_blight': {
            en: {
                description: "Fungal disease causing leaf spots and blight.",
                symptoms: ["Brown leaf spots", "Leaf curling", "Premature leaf drop"],
                prevention: "Prune for air circulation, apply fungicides."
            },
            am: {
                description: "በቅጠሎች ላይ የተለያዩ ቀለሞችን የሚያስከትል የፈንገስ በሽታ።",
                symptoms: ["ግራጫ ቦታዎች", "ቅጠል መጠቅለል", "ቅጠሎች መውደቅ"],
                prevention: "አየር ማስተላለፍን ይቆጣጠሩ፣ ፈንገስ መድኃይቂያዎችን ይጠቀሙ።"
            },
            om: {
                description: "Dhukkubni kun baala irratti mallattoo gurraachaa uumuudha.",
                symptoms: ["Mallattoo gurraachaa baala irratti", "Baala qabsiisuu", "Baala dhangala’uu"],
                prevention: "Qilleensa fooyya’uuf baala ciree, fungicidii fayyadami."
            }
        },
        // Potato Diseases
        'Potato_Early_blight': {
            en: {
                description: "Fungal disease causing target-shaped spots on leaves.",
                symptoms: ["Concentric ring spots", "Yellow halos", "Defoliation"],
                prevention: "Rotate crops, remove plant debris, use resistant varieties."
            },
            am: {
                description: "በቅጠሎች ላይ ክብ ክብ ቦታዎችን የሚያስከትል የፈንገስ በሽታ።",
                symptoms: ["ክብ ክብ ቦታዎች", "ቢጫ ክበቦች", "ቅጠሎች መውደቅ"],
                prevention: "የተክል ምርት ይለውጡ፣ የተክል ቅሪቶችን ያስወግዱ፣ የተከላከሉ ዝርያዎችን ይጠቀሙ።"
            },
            om: {
                description: "Dhukkubni kun baala irratti mallattoo wal fakkaatu uumuudha.",
                symptoms: ["Mallattoo wal fakkaataa", "Ciircaa diimaa", "Baala dhangala’uu"],
                prevention: "Ijaarsa jijjiiraa, baala dhangala’aa baasu, ijaarsa of eeggannoo qabu fayyadami."
            }
        },
        'Potato_Late_blight': {
            en: {
                description: "Fungal disease causing dark, water-soaked lesions.",
                symptoms: ["Dark, water-soaked spots", "Leaf wilting", "Fruit rot"],
                prevention: "Avoid overhead watering, apply fungicides."
            },
            am: {
                description: "በቅጠሎች ላይ ጥቁር ወይም ውሃ የተጠበሩ ቦታዎችን የሚያስከትል የፈንገስ በሽታ።",
                symptoms: ["ጥቁር ወይም ውሃ ቦታዎች", "ቅጠል መጠቅለል", "የፍራፍሬ መውደቅ"],
                prevention: "ከላይ ውሃ መስጠት ያስቀሩ፣ ፈንገስ መድኃይቂያዎችን ይጠቀሙ።"
            },
            om: {
                description: "Dhukkubni kun baala irratti mallattoo gurraachaa uumuudha.",
                symptoms: ["Mallattoo gurraachaa baala irratti", "Baala qabsiisuu", "Midhaan dhangala’uu"],
                prevention: "Qilleensa fooyya’uuf baala ciree, fungicidii fayyadami."
            }
        },
        
        // Add remaining diseases following the same pattern...
        
        // Healthy Plant Default
        '_healthy': {
            en: {
                description: "No signs of disease detected. Your plant appears healthy!",
                symptoms: ["Normal coloration", "Proper growth patterns", "No visible lesions"],
                prevention: "Continue good agricultural practices to maintain plant health."
            },
            am: {
                description: "ምንም የበሽታ ምልክቶች አልተገኙም። ተክልዎ ጤናማ ይመስላል!",
                symptoms: ["መደበኛ ቀለም", "ትክክለኛ የእድገት ንድፍ", "ምንም የታዩ ቦታዎች የሉም"],
                prevention: "የተክል ጤናን ለመጠበቅ ጥሩ የስርሻ ልምዶችን ይቀጥሉ።"
            },
            om: {
                description: "Dhukkubni hin argamne. Biqiltiin kee fayyaa dha!",
                symptoms: ["Halluu sirrii qaba", "Guddina sirrii", "Mallattoo hin argamne"],
                prevention: "Haala qilleensaa sirriin fayyaa biqiltii itti fufsiisi."
            }
        }
    };

    // Get disease info or fallback to healthy status
    const info = diseaseData[disease] || diseaseData['_healthy'];
    
    // Get current language translations
    const localizedInfo = {
        description: info[lang]?.description || info.en.description,
        symptoms: info[lang]?.symptoms || info.en.symptoms,
        prevention: info[lang]?.prevention || info.en.prevention
    };

    // Build HTML content
    diseaseInfoSection.innerHTML = `
        <div class="disease-details">
            <h4>${lang === 'am' ? 'ስለ' : lang === 'om' ? 'Waa\'ee' : 'About'} ${disease.replace(/_/g, ' ')}</h4>
            <p>${localizedInfo.description}</p>
            
            <div class="symptoms">
                <h5>${lang === 'am' ? 'ምልክቶች' : lang === 'om' ? 'Mallattoolee' : 'Symptoms'}</h5>
                <ul>${localizedInfo.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
            
            <div class="prevention">
                <h5>${lang === 'am' ? 'የመከላከል ምክሮች' : lang === 'om' ? 'Gorsa Dhukkubaa' : 'Prevention Tips'}</h5>
                <p>${localizedInfo.prevention}</p>
            </div>
        </div>
    `;
}
    // Reset analysis
    function resetAnalysis() {
        console.log('Resetting analysis');
        // Reset file input
        fileInput.value = '';
        
        // Reset preview
        imagePreview.src = '#';
        
        // Reset crop selection
        cropCards.forEach(card => card.classList.remove('selected'));
        currentCrop = null;
        
        // Reset results
        diseaseResult.textContent = '-';
        treatmentResult.textContent = '-';
        severityResult.textContent = '-';
        recoveryResult.textContent = '-';
        
        // Reset UI state
        resultsSection.classList.add('hidden');
        imageUploadSection.classList.add('hidden');
        cropSelectionSection.classList.remove('hidden');
        dropZone.classList.remove('hidden');
        previewContainer.classList.add('hidden');
        
        // Reset progress
        updateProgressSteps(1);
    }

    // Save report
function saveReport() {
    if (typeof window.jspdf === 'undefined') {
        showAlert('PDF generation library not loaded', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const lang = document.documentElement.lang || 'en';
    const t = TRANSLATIONS[lang];
    
    // Set document direction for RTL languages
    if (lang === 'am') {
        doc.setDirection('rtl');
    }

    // Report Header
    doc.setFontSize(22);
    doc.setTextColor(46, 125, 50);
    doc.text(t.appTitle, 14, 20);
    
    // Report Metadata
    doc.setFontSize(12);
    doc.setTextColor(33, 33, 33);
    doc.text(`${t.date}: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`${t.crop}: ${currentCrop || '-'}`, 14, 36);
    doc.text(`${t.disease}: ${diseaseResult.textContent || '-'}`, 14, 42);

    // Add Image Preview
    if (imagePreview.src && imagePreview.src !== '#') {
        try {
            const imgWidth = 60;
            const imgHeight = 60;
            doc.addImage(imagePreview.src, 'JPEG', 14, 50, imgWidth, imgHeight);
        } catch (e) {
            console.error('Error adding image:', e);
        }
    }

    // Analysis Results
    let yPosition = 120;
    doc.setFontSize(16);
    doc.setTextColor(46, 125, 50);
    doc.text(t.analysisResults, 14, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Confidence
    doc.text(`${t.confidence}: ${confidenceValue.textContent || '-'}`, 14, yPosition);
    yPosition += 8;
    
    // Severity
    doc.text(`${t.severity}: ${severityResult.textContent || '-'}`, 14, yPosition);
    yPosition += 8;
    
    // Recovery Time
    doc.text(`${t.recovery}: ${recoveryResult.textContent || '-'}`, 14, yPosition);
    yPosition += 15;

    // Treatment Recommendations
    doc.setFontSize(16);
    doc.setTextColor(46, 125, 50);
    doc.text(t.preventionTips, 14, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const splitText = doc.splitTextToSize(treatmentResult.textContent || t.analysisError, 180);
    doc.text(splitText, 14, yPosition);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(t.copyright, 14, doc.internal.pageSize.height - 10);

    // Save PDF
    doc.save(`plant-report-${Date.now()}.pdf`);
}
    const TRANSLATIONS = {
    en: {
        // App Header
        appTitle: "Plant Disease Detection",
        appSubtitle: "Upload images to diagnose plant diseases",
        
        // Navigation
        home: "Home",
        history: "History",
        encyclopedia: "Encyclopedia",
        settings: "Settings",
        
        // Crop Selection
        selectCrop: "Select Plant Type",
        tomato: "Tomato",
        potato: "Potato",
        grape: "Grape",
        corn: "Corn",
        
        // Image Upload
        uploadImage: "Upload Plant Image",
        dragDrop: "Drag & Drop your image here",
        supportedFormats: "Supports JPG, PNG (Max 5MB)",
        or: "OR",
        browseFiles: "Browse Files",
        
        // Analysis
        analyzeImage: "Analyze Image",
        analyzing: "Analyzing your plant image...",
        
        // Results
        analysisResults: "Analysis Results",
        disease: "Detected Disease",
        confidence: "Confidence Level",
        treatment: "Recommended Treatment",
        severity: "Severity",
        recovery: "Recovery Time",
        none: "None",
        unknown: "Unknown",
        
        // Treatment Videos
        treatmentVideos: "Recommended Treatment Videos",
        videoUnavailable: "Video recommendations currently unavailable",
        
        // Actions
        saveReport: "Save Report",
        newAnalysis: "New Analysis",
        removeImage: "Remove Image",
        
        // Disease Info
        aboutDisease: "About",
        symptoms: "Symptoms",
        preventionTips: "Prevention Tips",
        
        // Status Messages
        selectImageFirst: "Please select an image first",
        selectCropFirst: "Please select a crop type",
        imageTooLarge: "Image size should be less than 5MB",
        invalidImageType: "Please upload an image file (JPEG, PNG)",
        analysisError: "An error occurred during analysis",
        
        // Footer
        copyright: "Plant Disease Detection System © 2025"
    },
    am: {
        // App Header
        appTitle: "የተክል በሽታ መለያ",
        appSubtitle: "የተክል በሽታዎችን ለመለየት ምስል ይጫኑ",
        
        // Navigation
        home: "መነሻ",
        history: "ታሪክ",
        encyclopedia: "ኢንሳይክሎፒዲያ",
        settings: "ማስተካከያዎች",
        
        // Crop Selection
        selectCrop: "የተክል አይነት ይምረጡ",
        tomato: "ቲማቲም",
        potato: "ድንች",
        grape: "ወይን",
        corn: "በቆሎ",
        // Image Upload
        uploadImage: "ምስል ይጫኑ",
        dragDrop: "ምስልዎን እዚህ ጎትት ይጣሉ",
        supportedFormats: "JPG፣ PNG (ከ5MB በታች)",
        or: "ወይም",
        browseFiles: "ፋይሎችን ይምረጡ",
        
        // Analysis
        analyzeImage: "ምስልን ይተነብዩ",
        analyzing: "የተክል ምስልዎን እየተነበየ ነው...",
        
        // Results
        analysisResults: "የትንታኔ ውጤቶች",
        disease: "የተገኘ በሽታ",
        confidence: "የመተማመን ደረጃ",
        treatment: "የሚመከር ሕክምና",
        severity: "ከባድነት",
        recovery: "የመልሶ ማገገም ጊዜ",
        none: "የለም",
        unknown: "የማይታወቅ",
        
        // Treatment Videos
        treatmentVideos: "የሚመከሩ የሕክምና ቪዲዮች",
        videoUnavailable: "የቪዲዮ ምክር አሁን የለም",
        
        // Actions
        saveReport: "ሪፖርት አስቀምጥ",
        newAnalysis: "አዲስ ትንታኔ",
        removeImage: "ምስል አስወግድ",
        
        // Disease Info
        aboutDisease: "ስለ",
        symptoms: "ምልክቶች",
        preventionTips: "የመከላከል ምክሮች",
        
        // Status Messages
        selectImageFirst: "እባክዎ መጀመሪያ ምስል ይምረጡ",
        selectCropFirst: "እባክዎ የተክል አይነት ይምረጡ",
        imageTooLarge: "የምስሉ መጠን ከ5MB በታች መሆን አለበት",
        invalidImageType: "እባክዎ የምስል ፋይል (JPEG፣ PNG) ይጫኑ",
        analysisError: "በትንታኔው ጊዜ ስህተት ተከስቷል",
        
        // Footer
        copyright: "የተክል በሽታ መለያ ስርዓት © 2025"
    },
    om: {
        // App Header
        appTitle: "Dhukkuba Biqiltuu Agarsisuu",
        appSubtitle: "Dhukkuba biqiltuu mirkaneessuuf suuraa baasaa",
        
        // Navigation
        home: "Mana",
        history: "Seenaa",
        encyclopedia: "Ensaayikilooppiiyaa",
        settings: "Sirreeffama",
        
        // Crop Selection
        selectCrop: "Gosa Biqiltuu Filadhu",
        tomato: "Timaatimii",
        potato: "Dinnicha",
        grape: "weeyinii",
        corn: "Boqoloo",
        
        // Image Upload
        uploadImage: "Suuraa Baasuu",
        dragDrop: "Suuraa keessan asii draagii dhiisaa",
        supportedFormats: "JPG, PNG (Max 5MB)",
        or: "Yookiin",
        browseFiles: "Fayyilee Filadhu",
        
        // Analysis
        analyzeImage: "Suuraa Xiinxaluu",
        analyzing: "Suuraa biqiltuu keessan xiinxaluu jira...",
        
        // Results
        analysisResults: "Deebii Xiinxalaa",
        disease: "Dhukkuba Argame",
        confidence: "Sadarkaa Igguu",
        treatment: "Qorannoo Dhiyeessuu",
        severity: "Cimina",
        recovery: "Yeroo Fuudhii",
        none: "Hin jiru",
        unknown: "Kan hin beekamne",
        
        // Treatment Videos
        treatmentVideos: "Videoowwan Qorannoo Dhiyeessuu",
        videoUnavailable: "Yaad-rimee videoo ammaan hin jiru",
        
        // Actions
        saveReport: "Ripoortii Qusachuu",
        newAnalysis: "Xiinxala Haaraa",
        removeImage: "Suuraa Haquu",
        
        // Disease Info
        aboutDisease: "Waa'ee",
        symptoms: "Mallattoolee",
        preventionTips: "Gorsa Dhukkubaa",
        
        // Status Messages
        selectImageFirst: "Mee dura suuraa filadhaa",
        selectCropFirst: "Mee dura gosa biqiltuu filadhaa",
        imageTooLarge: "Suuraan baay'ee guddaa miti (5MB ala)",
        invalidImageType: "Mee fayyila suuraa (JPEG, PNG) baasaa",
        analysisError: "Xiinxala keessatti dogoggora dhufee jira",
        
        // Footer
        copyright: "Sirna Dhukkuba Biqiltuu Agarsisuu © 2025"
    }
};
    // Change language
function changeLanguage() {
    const lang = this.value;
    document.documentElement.lang = lang;
    
    // Save language preference
    localStorage.setItem('appLanguage', lang);
    
    // Update all UI elements
    updateUIText(lang);
    
    // For RTL support (Amharic)
    if (lang === 'am') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }
    
    // Show feedback
    const feedback = {
        en: 'Language changed to English',
        am: 'ቋንቋ ወደ አማርኛ ተቀይሯል',
        om: 'Afaan gara Afaan Oromootti jijjirame'
    };
    showAlert(feedback[lang]);
}

function updateUIText(lang) {
    const t = TRANSLATIONS[lang]; // Shortcut to current language translations
    
    // Header
    document.querySelector('.main-header h1').textContent = t.appTitle;
    document.querySelector('.main-header p').textContent = t.appSubtitle;
    
    // Navigation
    document.querySelectorAll('.nav-menu a span').forEach((span, index) => {
        const keys = ['home', 'history', 'encyclopedia', 'settings'];
        span.textContent = t[keys[index]];
    });
    
    // Crop Selection
    document.querySelector('#crop-selection h3').textContent = t.selectCrop;
    document.querySelector('[data-crop="tomato"] span').textContent = t.tomato;
    document.querySelector('[data-crop="potato"] span').textContent = t.potato;
    document.querySelector('[data-crop="grape"] span').textContent = t.grape;
    document.querySelector('[data-crop="corn"] span').textContent = t.corn;
    
    // Image Upload
    document.querySelector('.upload-box h4').textContent = t.dragDrop;
    document.querySelector('.upload-box p').textContent = t.supportedFormats;
    document.querySelector('.divider').textContent = t.or;
    document.getElementById('browse-btn').textContent = t.browseFiles;
    document.getElementById('analyze-btn').textContent = t.analyzeImage;
    document.getElementById('remove-image').textContent = t.removeImage;
    
    // Results Section
    document.querySelector('.results-header h3').textContent = t.analysisResults;
    const labels = document.querySelectorAll('.result-item .label');
    labels[0].textContent = t.disease + ":";
    labels[1].textContent = t.confidence + ":";
    labels[2].textContent = t.treatment + ":";
    labels[3].textContent = t.severity + ":";
    labels[4].textContent = t.recovery + ":";
    
    // Videos Section
    document.querySelector('.video-section h4').textContent = t.treatmentVideos;
    
    // Buttons
    document.getElementById('save-report').textContent = t.saveReport;
    document.getElementById('new-analysis').textContent = t.newAnalysis;
    
    // Footer
    document.querySelector('footer p').textContent = t.copyright;
}
    // Show loading overlay
    function showLoading(show) {
        if (show) {
            loadingOverlay.classList.remove('hidden');
        } else {
            loadingOverlay.classList.add('hidden');
        }
    }

    // Update progress steps
    function updateProgressSteps(activeStep) {
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index < activeStep);
        });
    }

    // Show alert message
    function showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    // Initialize the application
    init();

    // For testing without backend
    window.backendConnected = true; // Set to false for testing UI without backend
});