from flask import Flask, render_template, request, redirect, url_for, session
from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField, StringField
from wtforms.validators import InputRequired
import cv2
from cvzone.PoseModule import PoseDetector
import json
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = "superSecret"
app.config['UPLOAD_FOLDER'] = "static/files"

class UploadFileForm(FlaskForm):
    title = StringField("Title", [InputRequired()])
    file = FileField("File", [InputRequired()])
    submit = SubmitField("Upload File")


    
@app.route("/", methods=["GET", "POST"])
@app.route("/index.html", methods=["GET", "POST"])
def home():
    form = UploadFileForm()
    if form.validate_on_submit():
        print("submit button pressed")

        vid = form.file.data
        extension = os.path.splitext(vid.filename)[-1]
        if extension not in [".mp4"]:
            return "Erreur"

        json_file_path = os.path.join(os.path.dirname(__file__), 'static', 'dataMocap.json')
        
        with open(json_file_path, "r") as f:
            jsonData = json.load(f)

        title = form.title.data
        existing_titles = [d['name'] for d in jsonData["datas"]]
        if title in existing_titles:
            i = 1
            while f"{title}{i}" in existing_titles:
                i += 1
            title = f"{title}{i}"



        

        
        vid.save(os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'], secure_filename(title+extension)))
        print("file has been downloaded")        

        print(vid.filename)
        cap = cv2.VideoCapture(os.path.join(os.path.dirname(__file__), app.config['UPLOAD_FOLDER'], title+extension))
        posList = []
        detector = PoseDetector()

        print("got here")
        

        while True:
            sucess, img = cap.read()
            if not sucess:  # check if we have reached the end of the video
                break
            
            img = detector.findPose(img)
            lmList,bboxInfo = detector.findPosition(img)

            if bboxInfo:
                lmString = ''
                for lm in lmList:
                    lmString += f'{lm[1]},{img.shape[0]-lm[2]},{lm[3]},'  #unity read the y from bottom to top and not top to bottom, so we need to inverse it
                
                posList.append(lmString)
                #print(posList)

            #cv2.imshow("Image", img)
            


            
        cap.release()
        #cv2.destroyAllWindows()
        if not posList:
            os.remove(os.path.join(os.path.abspath(os.path.dirname(__file__)), app.config['UPLOAD_FOLDER'], secure_filename(title+extension)))
            return ("An error occured")

        entry = {}
        entry["name"] = title
        entry["positions"] = '\n'.join(posList)
        jsonData["datas"].append(entry)

        with open(json_file_path, 'w') as f:
            json.dump(jsonData, f)

    return render_template('index.html', form=form)

@app.route("/reading.html")
def reading():
    return render_template('reading.html')


@app.route('/delete-file', methods=['DELETE'])
def delete_file():
    data = request.get_json()
    filename = os.path.join(os.path.dirname(__file__), app.config['UPLOAD_FOLDER'], data['filename']+".mp4")
    try:
        os.remove(filename)
        json_file_path = os.path.join(os.path.dirname(__file__), 'static', 'dataMocap.json')
        
        with open(json_file_path, "r") as f:
            jsonData = json.load(f)
        for d in jsonData["datas"]:
            if d['name'] == data['filename']:
                jsonData["datas"].remove(d)

        with open(json_file_path, 'w') as f:
            json.dump(jsonData, f)

        return '', 204
    except OSError:
        return '', 404

