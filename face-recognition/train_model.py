import cv2
import os
import numpy as np


def train_face_model():

    dataset_path = "registered_faces"

    faces = []
    labels = []

    label_map = {}
    current_label = 0

    for enrollment_number in os.listdir(dataset_path):

        student_folder = os.path.join(
            dataset_path,
            enrollment_number
        )

        if not os.path.isdir(student_folder):
            continue

        label_map[current_label] = enrollment_number

        for image_name in os.listdir(student_folder):

            image_path = os.path.join(
                student_folder,
                image_name
            )

            image = cv2.imread(
                image_path,
                cv2.IMREAD_GRAYSCALE
            )

            if image is None:
                continue

            image = cv2.resize(
                image,
                (200, 200)
            )

            faces.append(image)
            labels.append(current_label)

        current_label += 1

    if len(faces) == 0:
        return {
            "success": False,
            "message": "No registered faces found"
        }

    recognizer = cv2.face.LBPHFaceRecognizer_create()

    recognizer.train(
        faces,
        np.array(labels)
    )

    recognizer.save("face_model.yml")

    with open("labels.txt", "w") as file:
        for label, enrollment_number in label_map.items():
            file.write(
                f"{label},{enrollment_number}\n"
            )

    return {
        "success": True,
        "message": "Face model trained successfully",
        "totalImages": len(faces),
        "totalStudents": len(label_map)
    }


if __name__ == "__main__":
    result = train_face_model()
    print(result)
    