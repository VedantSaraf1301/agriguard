import os
import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image

CLASS_NAMES = ['healthy_leaves', 'panama_wilt', 'potassium_deficiency', 'sigatoka']
LABELS = {
    'healthy_leaves': 'Healthy Leaf',
    'panama_wilt': 'Panama Disease',
    'potassium_deficiency': 'Potassium Deficiency',
    'sigatoka': 'Black Sigatoka',
}
IMG_SIZE = 224


@st.cache_resource
def load_model():
    model_path = './final_model.h5'
    if not os.path.exists(model_path):
        from huggingface_hub import hf_hub_download
        model_path = hf_hub_download(
            repo_id="alcarazchampion/agriguard-model",
            filename="final_model.h5",
            local_dir=".",
        )
    return tf.keras.models.load_model(model_path)


def preprocess_image(image):
    img = image.convert('RGB').resize((IMG_SIZE, IMG_SIZE))
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)


st.set_page_config(page_title="AgriGuard", page_icon="🌿", layout="centered")

st.title("🌿 AgriGuard")
st.subheader("Detect Banana Leaf Diseases Instantly")
st.write(
    "Upload a photo of a banana leaf and get an AI-powered diagnosis for "
    "Panama Disease, Black Sigatoka, Potassium Deficiency, or a Healthy Leaf."
)

tab1, tab2 = st.tabs(["📁 Upload Image", "📷 Use Camera"])

image_file = None
with tab1:
    image_file = st.file_uploader("Choose a leaf image", type=["jpg", "jpeg", "png", "webp"])
with tab2:
    camera_file = st.camera_input("Take a photo of the leaf")
    if camera_file is not None:
        image_file = camera_file

if image_file is not None:
    image = Image.open(image_file)
    st.image(image, caption="Selected Leaf", use_container_width=True)

    if st.button("🔬 Analyze Leaf", type="primary"):
        with st.spinner("Running AI diagnosis..."):
            model = load_model()
            img_array = preprocess_image(image)
            preds = model.predict(img_array)[0]
            class_idx = int(np.argmax(preds))
            confidence = float(np.max(preds)) * 100
            predicted_class = CLASS_NAMES[class_idx]

        if predicted_class == 'healthy_leaves':
            st.success(f"✅ {LABELS[predicted_class]} — {confidence:.2f}% confidence")
        else:
            st.error(f"⚠️ {LABELS[predicted_class]} — {confidence:.2f}% confidence")

        st.write("### Probabilities")
        probabilities = {LABELS[name]: float(prob) * 100 for name, prob in zip(CLASS_NAMES, preds)}
        st.bar_chart(probabilities)
