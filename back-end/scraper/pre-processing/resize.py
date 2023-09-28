from PIL import Image
import os

input_folder = r'../../images_v2/original/idli/'
output_folder = r'../../images_v2/128-resize/idli/'
target_size = (128, 128) #(512, 512) (256, 256) (128, 128)

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

for filename in os.listdir(input_folder):
    # Load the image
    image_path = os.path.join(input_folder, filename)
    image = Image.open(image_path)

    # Resize the image while preserving the aspect ratio
    image.thumbnail(target_size, Image.ANTIALIAS)

    # Convert the image to RGB mode
    image = image.convert('RGB')

    # Create a new filename with a prefix indicating the resized dimensions
    resized_filename = f'{filename}'

    # Save the resized image
    output_path = os.path.join(output_folder, resized_filename)
    image.save(output_path)
