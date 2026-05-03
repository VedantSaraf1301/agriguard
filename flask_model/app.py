from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# Load model once at startup
MODEL_PATH = './banana_mobilenet_final.h5'
model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = ['healthy_leaves', 'panama_wilt', 'potassium_deficiency', 'sigatoka']
IMG_SIZE = 224

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((IMG_SIZE, IMG_SIZE))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_bytes = request.files['image'].read()
    img_array  = preprocess_image(image_bytes)

    preds       = model.predict(img_array)[0]
    class_idx   = int(np.argmax(preds))
    confidence  = float(np.max(preds))

    return jsonify({
        'class':         CLASS_NAMES[class_idx],
        'confidence':    round(confidence * 100, 2),
        'probabilities': {
            name: round(float(prob) * 100, 2)
            for name, prob in zip(CLASS_NAMES, preds)
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)