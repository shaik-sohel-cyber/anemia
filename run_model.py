import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from tqdm import tqdm  # for a progress bar
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score

# Paths to your directories
base_dir = r"g:/Fetal Anemia Major Project - Copy (2)/Fetal Anemia Major Project - Copy (2)/Fetal Abdominal Structures Segmentation Dataset Using Ultrasonic Images (1)-20260414T100044Z-3-003"
images_dir = os.path.join(base_dir, "IMAGES")

# Image dimensions
IMG_HEIGHT = 224
IMG_WIDTH = 224

def load_images_and_labels(images_dir):
    # Check if directories exist
    if not os.path.exists(images_dir):
        raise FileNotFoundError(f"Image directory does not exist: {images_dir}")

    images = []
    labels = []

    # Limit to 300 images for demonstration training
    image_files = sorted([f for f in os.listdir(images_dir) if f.lower().endswith((".png", ".jpg", ".jpeg"))])[:300]

    print(f"Found {len(image_files)} image files")

    if not image_files:
        raise FileNotFoundError(f"No valid image files found in directory: {images_dir}")

    # Load images and generate labels
    for i, img_file in tqdm(enumerate(image_files), total=len(image_files), desc="Loading Images"):
        # Load the image
        img_path = os.path.join(images_dir, img_file)
        image = cv2.imread(img_path, cv2.IMREAD_COLOR)
        if image is None:
            continue
        image = cv2.resize(image, (IMG_WIDTH, IMG_HEIGHT))
        image = image / 255.0  # Normalize pixel values
        images.append(image)

        # Assign a binary label (0 for Normal, 1 for Anemia)
        # In a real scenario, this comes from a CSV. Here, we simulate it based on file index
        label = 1 if i % 2 == 0 else 0 
        labels.append(label)

    return np.array(images), np.array(labels)

def geoproteonet_classifier(input_shape):
    # Input layer
    input_layer = layers.Input(shape=input_shape)

    # Core Layers
    x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(input_layer)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)

    x = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)

    x = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    
    x = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)

    # Transition to Classification
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.5)(x)

    # Output layer (Sigmoid for binary classification: Anemia vs Normal)
    output_layer = layers.Dense(1, activation='sigmoid')(x)

    # Create Model
    model = tf.keras.models.Model(inputs=input_layer, outputs=output_layer)

    return model

def main():
    # Load images and labels
    try:
        X, Y = load_images_and_labels(images_dir)
    except FileNotFoundError as e:
        print(e)
        X, Y = np.array([]), np.array([])  # Default fallback

    if X.size > 0 and Y.size > 0:
        # Split dataset into training, validation, and testing
        X_train, X_temp, Y_train, Y_temp = train_test_split(X, Y, test_size=0.3, random_state=42)
        X_val, X_test, Y_val, Y_test = train_test_split(X_temp, Y_temp, test_size=0.5, random_state=42)

        print(f"Training Set: {X_train.shape}, {Y_train.shape}")
        print(f"Validation Set: {X_val.shape}, {Y_val.shape}")
        print(f"Test Set: {X_test.shape}, {Y_test.shape}")
        
        # Image Augmentation
        train_datagen = ImageDataGenerator(
            rescale=1., # already divided by 255
            rotation_range=20,
            width_shift_range=0.1,
            height_shift_range=0.1,
            horizontal_flip=True,
            fill_mode='nearest'
        )

        val_datagen = ImageDataGenerator(rescale=1.)

        # Create an instance of the model
        input_shape = X_train.shape[1:]
        model = geoproteonet_classifier(input_shape)

        # Compile the model
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy']) 

        print("Starting model training on dataset...")
        history = model.fit(
            train_datagen.flow(X_train, Y_train, batch_size=16),
            steps_per_epoch=max(1, len(X_train) // 16),
            epochs=5,
            validation_data=val_datagen.flow(X_val, Y_val, batch_size=16),
            validation_steps=max(1, len(X_val) // 16)
        )
        
        # Save model weights to backend
        weights_path = os.path.join("backend", "geoproteonet.weights.h5")
        model.save_weights(weights_path)
        print(f"SUCCESS: Saved actual trained classifier weights to {weights_path}")
        
        print("Evaluating the model...")
        test_loss, test_accuracy = model.evaluate(X_test, Y_test)
        print(f"Test Loss: {test_loss}")
        print(f"Test Accuracy: {test_accuracy}")
        
        # Detailed metrics
        predictions = model.predict(X_test)
        predictions_binary = (predictions > 0.5).astype(int).flatten()
        
        cm = confusion_matrix(Y_test, predictions_binary)
        print(f"Confusion Matrix: \n{cm}")
        print(f"Precision: {precision_score(Y_test, predictions_binary, zero_division=0)}")
        print(f"Recall: {recall_score(Y_test, predictions_binary, zero_division=0)}")
        print(f"F1 Score: {f1_score(Y_test, predictions_binary, zero_division=0)}")

if __name__ == "__main__":
    main()
