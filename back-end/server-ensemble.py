from flask import Flask, request
from flask_restful import Api, Resource
import tensorflow as tf
import numpy as np
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)

cors = CORS(app)

class Predict(Resource):
    def post(self):
        # Get the image file from the request
        image_file = request.files['image']

        # Load the image using PILLOW
        image = Image.open(image_file)

        # Preprocess the image
        input_size = (224, 224)
        resized_image = image.resize(input_size)

        # Convert the image to a numpy array
        image_array = np.array(resized_image)

        # Expand dimensions to match the input shape of the model
        image_array = np.expand_dims(image_array, axis=0)

        # Make predictions using trained model
        prediction_customized = model_customized.predict(image_array)
        prediction_pretrained = model_pretrained.predict(image_array)
        ensemble_predictions = (prediction_customized + prediction_pretrained) / 2

        # print(prediction_customized)
        # print(prediction_pretrained)
        # print(ensemble_predictions)

        with open('fyp_labels_v2.txt', 'r') as file:
            food_labels = [label.strip() for label in file.readlines()]

        accuracy = (float(np.max(prediction_customized)) + float(np.max(prediction_pretrained))) / 2

        print(accuracy)

        predicted_index = np.argmax(ensemble_predictions)

        predicted_label = food_labels[predicted_index]

        # Convert the predictions to a JSON response
        response = {
            'predicted_label': predicted_label,
            'accuracy': accuracy
        }

        return response

api.add_resource(Predict, '/predict')

if __name__ == '__main__':
    # Load trained model here
    model_customized = tf.keras.models.load_model('foodvision_model_customized')
    model_pretrained = tf.keras.models.load_model('foodvision_model_pretrained')

    # Run the Flask application
    app.run()
