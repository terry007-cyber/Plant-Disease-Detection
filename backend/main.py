from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
from datetime import datetime
from typing import Dict

app = FastAPI(title="Plant Disease Detection API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model and Class Configuration
CROP_CONFIG = {
    "tomato": {
        "model_path": "tomato.h5",
        "classes": [
            "Tomato_Bacterial_spot",
            "Tomato_Early_blight",
            "Tomato_Late_blight",
            "Tomato_Leaf_Mold",
            "Tomato_Septoria_leaf_spot",
            "Tomato_Spider_mites",
            "Tomato_Target_Spot",
            "Tomato_Yellow_Leaf_Curl_Virus",
            "Tomato_mosaic_virus",
            "Tomato_healthy"
        ]
    },
    "corn": {
        "model_path": "corn.h5",
        "classes": [
            "Corn_Common_rust",
            "Corn_Gray_leaf_spot",
            "Corn_Northern_Leaf_Blight",
            "Corn_healthy"
        ]
    },
    "grape": {
        "model_path": "grape.h5",
        "classes": [
            "Grape_Black_rot",
            "Grape_Esca",
            "Grape_Leaf_blight",
            "Grape_healthy"
        ]
    },
    "potato": {
        "model_path": "potato.h5",
        "classes": [
            "Potato_Early_blight",
            "Potato_Late_blight",
            "Potato_healthy"
        ]
    },
    "apple": {
        "model_path": "apple.h5",
        "classes": [
            "Apple_Black_rot",
            "Apple_Cedar_rust",
            "Apple_Scab",
            "Apple_healthy"
        ]
    }
}

# Treatment Database
with open("treatments.json") as f:
    TREATMENTS = json.load(f)

class ModelManager:
    def __init__(self):
        self.models: Dict[str, tf.keras.Model] = {}
        self.load_all_models()

    def load_all_models(self):
        for crop, config in CROP_CONFIG.items():
            try:
                self.models[crop] = tf.keras.models.load_model(config["model_path"])
                print(f"✅ {crop} model loaded successfully")
            except Exception as e:
                print(f"❌ Failed to load {crop} model: {str(e)}")
                self.models[crop] = None

model_manager = ModelManager()

@app.get("/ping")
def health_check():
    return {
        "status": "active",
        "timestamp": datetime.now().isoformat(),
        "loaded_models": [crop for crop, model in model_manager.models.items() if model is not None]
    }

@app.get("/crop-info/{crop_type}")
def crop_info(crop_type: str):
    if crop_type not in CROP_CONFIG:
        raise HTTPException(404, detail="Crop not supported")
    return {
        "crop": crop_type,
        "possible_diseases": CROP_CONFIG[crop_type]["classes"],
        "model_status": "loaded" if model_manager.models.get(crop_type) else "not loaded"
    }

@app.post("/predict/{crop_type}")
async def predict(crop_type: str, file: UploadFile = File(...)):
    if crop_type not in model_manager.models or not model_manager.models[crop_type]:
        raise HTTPException(400, detail=f"Model not available. Supported crops: {list(model_manager.models.keys())}")

    try:
        # Validate and process image
        if not file.content_type.startswith('image/'):
            raise HTTPException(400, detail="File must be an image")
        
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        img = img.resize((256, 256))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Make prediction
        preds = model_manager.models[crop_type].predict(img_array)
        class_idx = np.argmax(preds[0])
        confidence = float(preds[0][class_idx])
        disease = CROP_CONFIG[crop_type]["classes"][class_idx]

        return {
            "crop": crop_type,
            "disease": disease,
            "confidence": confidence,
            "treatment": TREATMENTS.get(crop_type, {}).get(disease, "General care recommended"),
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        raise HTTPException(500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)