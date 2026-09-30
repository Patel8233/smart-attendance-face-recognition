import cv2
import os

enrollment_number = input("Student Enrollment Number enter karo: ").strip()

if not enrollment_number:
    print("Enrollment Number required hai")
    exit()

save_folder = os.path.join("registered_faces", enrollment_number)
os.makedirs(save_folder, exist_ok=True)

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not camera.isOpened():
    print("Camera open nahi hua")
    exit()

count = 0
max_images = 10

print("Face Registration Started")
print("Camera ki taraf dekho...")
print("Q press karke cancel kar sakte ho.")

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

        cv2.rectangle(
            frame,
            (x, y),
            (x + w, y + h),
            (0, 255, 0),
            2
        )

        face = gray[y:y + h, x:x + w]

        face = cv2.resize(face, (200, 200))

        count += 1

        file_path = os.path.join(
            save_folder,
            f"face_{count}.jpg"
        )

        cv2.imwrite(file_path, face)

        cv2.putText(
            frame,
            f"Captured: {count}/{max_images}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        cv2.waitKey(250)

    cv2.imshow("Smart Attendance - Face Registration", frame)

    if count >= max_images:
        print("Face Registration Successful")
        break

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("Registration cancelled")
        break

camera.release()
cv2.destroyAllWindows()