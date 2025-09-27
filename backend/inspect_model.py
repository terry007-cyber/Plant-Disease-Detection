import tensorflow as tf
import h5py

def inspect_model(model_path):
    # Method 1: Check model summary
    print("\n=== Model Architecture ===")
    model = tf.keras.models.load_model(model_path)
    model.summary()
    
    # Method 2: Check the class indices in the HDF5 file
    print("\n=== HDF5 Metadata ===")
    with h5py.File(model_path, 'r') as f:
        if 'class_indices' in f.attrs:
            print("Class indices:", dict(f.attrs['class_indices']))
        else:
            print("No class indices found in model metadata")

inspect_model("tomato.h5")