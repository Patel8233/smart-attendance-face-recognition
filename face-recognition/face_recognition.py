import cv2

# Load trained model
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read("face_model.yml")

# Load label mapping
label_map = {}

with open("labels.txt", "r") as file:
    for line in file:
        label, enrollment_number = line.strip().split(",")
        label_map[int(label)] = enrollment_number

# Face detector
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

# Camera
camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not camera.isOpened():
    print("Camera open nahi hua")
    exit()

print("Face Recognition Started")
print("Band karne ke liye Q press karo")

while True:
    ret, frame = camera.read()

    if not ret:
        print("Frame read nahi hua")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(100, 100)
    )

    for (x, y, w, h) in faces:

        face = gray[y:y + h, x:x + w]
        face = cv2.resize(face, (200, 200))

        label, confidence = recognizer.predict(face)

        # LBPH: lower confidence value = better match
        if confidence < 70 and label in label_map:
            name = label_map[label]
            text = f"{name} ({confidence:.1f})"
        else:
            text = "Unknown"

        cv2.rectangle(
            frame,
            (x, y),
            (x + w, y + h),
            (0, 255, 0),
            2
        )

        cv2.putText(
            frame,
            text,
            (x, y - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )

    cv2.imshow("Smart Attendance - Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()
