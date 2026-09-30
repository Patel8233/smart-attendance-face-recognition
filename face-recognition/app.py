from fastapi import FastAPI, UploadFile, File
import cv2
import numpy as np
import os

from train_model import train_face_model


app = FastAPI(
    title="Smart Attendance Face Recognition API",
    version="1.0"
)


# -----------------------------
# Face Recognition Model
# -----------------------------

recognizer = None
label_map = {}


def load_face_model():
    global recognizer, label_map

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read("face_model.yml")

    label_map = {}

    with open("labels.txt", "r") as file:
        for line in file:
            label, enrollment_number = line.strip().split(",")

            label_map[int(label)] = enrollment_number


# Load model when FastAPI starts
load_face_model()


# -----------------------------
# Face Detector
# -----------------------------

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades
    + "haarcascade_frontalface_default.xml"
)


# -----------------------------
# Home API
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "Face Recognition API is running"
    }


# -----------------------------
# Health API
# -----------------------------

@app.get("/health")
def health():
    return {
        "status": "OK"
    }


# -----------------------------
# Face Registration API
# -----------------------------

@app.post("/register-face/{enrollment_number}")
async def register_face(
    enrollment_number: str,
    file: UploadFile = File(...)
):
    image_bytes = await file.read()

    image_array = np.frombuffer(
        image_bytes,
        np.uint8
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if image is None:
        return {
            "success": False,
            "message": "Invalid image"
        }

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(100, 100)
    )

    if len(faces) == 0:
        return {
            "success": False,
            "message": "No face detected"
        }

    student_folder = os.path.join(
        "registered_faces",
        enrollment_number
    )

    os.makedirs(
        student_folder,
        exist_ok=True
    )

    x, y, w, h = faces[0]

    face = gray[
        y:y + h,
        x:x + w
    ]

    face = cv2.resize(
        face,
        (200, 200)
    )

    existing_images = [
        name
        for name in os.listdir(student_folder)
        if name.lower().endswith(
            (".jpg", ".jpeg", ".png")
        )
    ]

    image_number = len(existing_images) + 1

    image_path = os.path.join(
        student_folder,
        f"face_{image_number}.jpg"
    )

    cv2.imwrite(
        image_path,
        face
    )

    # Train model automatically
    training_result = train_face_model()

    # Reload latest trained model into memory
    if training_result["success"]:
        load_face_model()

    return {
        "success": True,
        "message": "Face registered and model trained successfully",
        "enrollmentNumber": enrollment_number,
        "savedImage": f"face_{image_number}.jpg",
        "totalImages": image_number,
        "training": training_result
    }


# -----------------------------
# Face Recognition API
# -----------------------------

@app.post("/recognize-face")
async def recognize_face(
    file: UploadFile = File(...)
):
    image_bytes = await file.read()

    image_array = np.frombuffer(
        image_bytes,
        np.uint8
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if image is None:
        return {
            "recognized": False,
            "message": "Invalid image"
        }

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(100, 100)
    )

    if len(faces) == 0:
        return {
            "recognized": False,
            "message": "No face detected"
        }

    # Process first detected face
    x, y, w, h = faces[0]

    face = gray[
        y:y + h,
        x:x + w
    ]

    face = cv2.resize(
        face,
        (200, 200)
    )

    label, confidence = recognizer.predict(
        face
    )

    if (
        confidence < 70
        and label in label_map
    ):
        return {
            "recognized": True,
            "enrollmentNumber": label_map[label],
            "confidence": round(
                float(confidence),
                2
            )
        }

    return {
        "recognized": False,
        "message": "Unknown face",
        "confidence": round(
            float(confidence),
            2
        )
    }