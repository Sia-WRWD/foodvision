import os

folder_path = r'../../images/512-resize/nasi_lemak/'

def addUnderscore(fpath):

    for filename in os.listdir(fpath):
        if filename.startswith('apam_balik'):
            # Split the filename into name and number parts
            name, number = filename.split('apam_balik')
            
            # Construct the new filename with the desired format
            new_filename = f'apam_balik_{number}'
            
            # Rename the file
            os.rename(os.path.join(fpath, filename), os.path.join(fpath, new_filename))

def lowercase(fpath):
    # Iterate over all files in the folder
    for file_name in os.listdir(fpath):
        # Check if the file is a regular file
        if os.path.isfile(os.path.join(fpath, file_name)):
            # Convert the file name to lowercase
            new_file_name = file_name.lower()
            
            # Rename the file
            os.rename(os.path.join(fpath, file_name), os.path.join(fpath, new_file_name))

lowercase(folder_path)

