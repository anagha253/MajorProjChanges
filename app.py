from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
from PIL import Image, ImageDraw
import tensorflow as tf
import base64
from io import BytesIO

app = Flask(__name__)


eng = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
kan = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯']


model = tf.keras.models.load_model('test.h5')  # Ld model 

width = 500
height = 500
center = height // 2
image_path = "image.png"

# Clr image
def clear_image():
    img = Image.new("RGB", (width, height), (255, 255, 255))
    img.save("image.png")

# img raw_data => png formt
def save_image_from_base64(image_data):
    filename="image.png"
    base64_data = image_data.split(',')[1]
    image_bytes = base64.b64decode(base64_data)
    image = Image.open(BytesIO(image_bytes))
    new_image = Image.new('RGB', image.size, (255, 255, 255))
    new_image.paste(image, (0, 0), image)
    new_image.save(filename, 'PNG')
    

def predict_digit():
    img = cv2.imread("image.png", 0)
    img = cv2.bitwise_not(img)
    img = cv2.resize(img, (28, 28))
    img = img.reshape(1, 28, 28, 1)
    img = img.astype('float32')
    img = img / 255.0
    print(type(img))

    pred = model.predict(img)
    ind = np.argmax(pred[0])
    print(ind)

    return kan[ind], eng[ind]

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/index')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    
    data = request.get_json()
    image_data = data['image']
    
    save_image_from_base64(image_data)
    
    predicted_class, predicted_value = predict_digit()

    return jsonify({
        'predicted_class': predicted_class,
        'predicted_value': predicted_value
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
