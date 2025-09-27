
# Plant Disease Detection: An AI-Powered Agricultural Tool 🌿🔬

## Project Mission

To empower **farmers, students, and agricultural researchers** with an accessible, AI-driven tool for the rapid and accurate identification of plant diseases. Our mission is to leverage technology to support sustainable agriculture, facilitate learning, and encourage data-driven research in plant pathology. By providing instant diagnostics, we aim to help protect crop yields, reduce economic losses, and promote responsible disease management practices.

---

![Application Result Screenshot](./image/result.png)

---

## Why This Project Matters

This tool is designed to be a bridge between advanced technology and practical agriculture, offering distinct benefits for its core users:

-   **For Farmers:** Provides a crucial "first alert" system. Get an immediate, on-the-spot analysis of a suspicious plant leaf, enabling faster decision-making for treatment and quarantine, potentially saving a significant portion of a harvest.

-   **For Students & Educators:** Serves as a dynamic, hands-on learning resource for studies in agronomy, botany, and computer science. It connects theoretical knowledge of plant diseases with practical, visual examples and the real-world application of artificial intelligence.

-   **For Researchers:** Offers a robust, extensible platform for plant pathology research. The existing models can be analyzed, improved, or used as a baseline. The framework can be easily adapted to include new plant species or disease categories, facilitating new avenues of study.

## How It Works: The Technology Pipeline

The application follows a simple yet powerful workflow to provide a diagnosis:

1.  **Image Upload:** The user selects and uploads an image of a plant leaf through the simple web interface.
2.  **Backend API Request:** The frontend sends the image data to the secure, high-performance Python backend built with FastAPI.
3.  **Image Preprocessing:** The backend prepares the image for the model by resizing it to the required input dimensions and converting it into a numerical array (tensor).
4.  **AI Model Prediction:** The processed image is fed into the corresponding pre-trained deep learning model (e.g., the "Tomato" model). The model analyzes the image and outputs a probability score for each possible disease class.
5.  **Result Interpretation:** The backend identifies the disease with the highest confidence score and retrieves associated treatment information from its knowledge base.
6.  **Frontend Display:** The API sends the final result—the predicted disease, confidence level, and treatment advice—back to the user's web browser, where it is displayed in a clear and understandable format.

## Core Features

-   **Multi-Crop Disease Detection:** Specialized models for identifying common diseases in:
    -   Corn (Maize)
    -   Grape
    -   Potato
    -   Tomato
-   **High-Confidence Predictions:** Each diagnosis is accompanied by a confidence score, giving the user insight into the model's certainty.
-   **Integrated Knowledge Base:** Moves beyond simple identification by providing access to a rich library of PDF treatment guides and educational videos.
-   **Fully Offline-Capable Frontend:** The HTML/JavaScript interface is simple, lightweight, and can be easily packaged for use in areas with limited internet connectivity.

## Technology & Architecture

-   **Backend:** Python 3, FastAPI
-   **Machine Learning:** TensorFlow, Keras
-   **Data Handling:** NumPy, Pillow (PIL)
-   **Frontend:** HTML5, CSS3, vanilla JavaScript
-   **Version Control:** Git & **Git LFS (Large File Storage)**

### A Note on the Models

The intelligence of this application comes from a set of **Convolutional Neural Network (CNN)** models. Each model has been trained on thousands of labeled images of healthy and diseased plant leaves, allowing it to learn and recognize the intricate visual patterns associated with specific pathologies.

## ⚠️ Critical Setup Note: Git LFS

This repository contains large files, including the machine learning models (`.h5`), videos (`.mp4`), and PDF documents. These assets are managed using **Git Large File Storage (LFS)**. To properly clone this project, you **must** have Git LFS installed on your system.

## Local Development Setup

Follow these steps to run the project on your own machine.

### 1. Prerequisites

-   Python (version 3.8 or higher is recommended)
-   Git version control
-   Git LFS extension (Download from [git-lfs.com](https://git-lfs.com), then run `git lfs install` once)

### 2. Clone the Repository

This single command will download the project source code and all the large LFS-managed files.

```sh
git clone https://github.com/terry007-cyber/Plant-Disease-Detection.git
```
- If you already cloned without LFS, navigate into the project folder and run `git lfs pull` to download the large files.

### 3. Set Up the Python Backend

Using a virtual environment is strongly recommended to avoid conflicts with other projects.

```sh
# 1. Navigate into the project's root directory
cd Plant-Disease-Detection

# 2. Create and activate the virtual environment
python -m venv backend/venv
# On Windows:
backend\venv\Scripts\activate
# On macOS/Linux:
# source backend/venv/bin/activate

# 3. Install all necessary Python libraries
pip install -r backend/requirements.txt
```

### 4. Run the Application

1.  **Start the API Server:**
    ```sh
    python backend/main.py
    ```
    The terminal will confirm that the server is running and listening for requests.

2.  **Launch the Frontend:**
    Navigate to the `frontend/` directory and open the `index.html` file in any modern web browser.

## 🗺️ Project Roadmap & Future Enhancements

This project is a living endeavor with many opportunities for growth. Future plans include:
-   **Expanding the Dataset:** Incorporating more plant species (e.g., rice, wheat, soy) and a wider variety of diseases.
-   **Improving Model Accuracy:** Experimenting with newer model architectures (e.g., Vision Transformers) and retraining with larger, more diverse datasets.
-   **Mobile Application:** Developing a native mobile app for easier use in the field.
-   **Localization:** Translating the interface and resources into multiple languages to support a global user base.

## 🤝 How to Contribute

Contributions from the community are welcome and encouraged! Whether you are a developer, a researcher, or a domain expert in agriculture, you can help by:
-   Reporting bugs or suggesting new features.
-   Submitting pull requests with code improvements.
-   Contributing new images to expand the training dataset.
-   Helping to translate the application.

## 📜 License & Academic Use

This project is open-source and available under the **MIT License**. You can find the full license details in the `LICENSE.md` file.

In the spirit of collaboration and the advancement of knowledge, this project is also expressly intended for **educational and research purposes**. Students, educators, and researchers are encouraged to:

-   **Use this code as a foundation for academic projects, theses, or dissertations.**
-   **Fork the repository to experiment with new features or model architectures.**
-   **Adapt the methodologies and code for classroom instruction or workshops.**
-   **Publish findings or derivative works, with appropriate citation.**

We believe in the power of open knowledge and hope this tool can contribute to the next generation of agricultural technology and the researchers who will build it. If you use this project in your work, a simple credit or citation linking back to this repository would be greatly appreciated.
Please feel free to open an issue to start a discussion.
