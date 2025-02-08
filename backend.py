from flask import Flask,request,jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# @app.route('/name', methods=['POST', 'GET','PUT','DELETE'])

# Load Firebasekey JSON file
cred = credentials.Certificate("spark-91799-firebase-adminsdk-fbsvc-988dacf8ee.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore (NoSQL Database)
db = firestore.client()

@app.route('/')
def root():
    return ''

#this function captures the request to save the data to firebase
@app.route('/save-settings', methods=['POST'])
def save_layout():
    data = request.json
    profile_id = data.get('userID')
    
    db.collection("settings").document(profile_id).set(data)

#this gets the layout from the firebase, 
# should be called when rendering profile page
@app.route('/get-settings', methods = ['GET','OPTIONS'])
def get_settings():
    user_id = request.args.get('userID')

    if not user_id:
        return jsonify({'error': 'User ID Required'}),400
    
    doc = db.collection('settings').document(user_id).get()

    return jsonify(doc.to_dict())

#this saves the theme for the user profile
@app.route('/save-theme',methods=['POST'])
def save_theme():
    data = request.json
    profile_id = data.get('userID')
    db.collection("themes").document(profile_id).add(data)
    return jsonify({"message": "Theme saved successfully"})

    
#this gets the theme for the user's profile
@app.route('/get-theme',methods=['GET','OPTIONS'])
def get_theme():
    user_id = request.args.get('userID')

    if not user_id:
        return jsonify({'error': 'User ID Required'}),400
    
    doc = db.collection('themes').document(user_id).get()

    return jsonify(doc.to_dict())

if __name__ == "__main__":
    app.run()
