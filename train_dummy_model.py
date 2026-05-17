import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers

IMG_HEIGHT = 224
IMG_WIDTH = 224

def get_geoproteonet_model(input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)):
    input_layer = layers.Input(shape=input_shape)
    x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(input_layer)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    x = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    x = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(x)
    x = layers.Conv2DTranspose(128, (2, 2), strides=2, padding='same')(x)
    x = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = layers.Conv2DTranspose(32, (2, 2), strides=2, padding='same')(x)
    x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(x)
    output_layer = layers.Conv2D(1, (1, 1), activation='sigmoid', padding='same')(x)

    model = tf.keras.models.Model(inputs=input_layer, outputs=output_layer)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

print("Generating dummy data since the dataset folder is empty...")
# Generate 10 random images and masks
X_train = np.random.rand(10, IMG_HEIGHT, IMG_WIDTH, 3).astype(np.float32)
Y_train = (np.random.rand(10, IMG_HEIGHT, IMG_WIDTH, 1) > 0.5).astype(np.float32)

model = get_geoproteonet_model()
print("Training dummy model for 1 epoch to initialize weights...")
model.fit(X_train, Y_train, epochs=1, batch_size=2)

weights_path = os.path.join("backend", "geoproteonet.weights.h5")
model.save_weights(weights_path)
print(f"Weights successfully saved to {weights_path}")
