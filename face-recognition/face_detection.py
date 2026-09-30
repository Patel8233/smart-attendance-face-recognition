import cv2

# Open laptop camera using DirectShow
camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# OpenCV built-in face detector
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

if not camera.isOpened():
    print("Camera open nahi hua")
    exit()

print("Face Detection Started")
print("Band karne ke liye Q press karo")

while True:
    ret, frame = camera.read()

    if not ret:
        print("Frame read nahi hua")
        break

    # Convert image to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )

    # Rectangle around detected face
    for (x, y, w, h) in faces:
        cv2.rectangle(
            frame,
            (x, y),
            (x + w, y + h),
            (0, 255, 0),
            2
        )

    cv2.imshow("Smart Attendance - Face Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()