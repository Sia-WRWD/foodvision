import os

folder_directory = r'../../images_v2/original/putu_mayam/'  # Replace with the actual folder directory
file_prefix = 'putu_mayam_'

# Iterate through the expected digits
for i in range(1, 301):
    file_name = file_prefix + str(i) + '.jpg'
    file_path = os.path.join(folder_directory, file_name)
    
    # Check if the file exists
    if not os.path.exists(file_path):
        missing_digit = i
        break

print("Missing digit:", missing_digit)