import cv2

camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not camera.isOpened():
    print("Camera open nahi hua")
    exit()

print("Camera successfully open ho gaya")
print("Band karne ke liye Q press karo")

while True:
    ret, frame = camera.read()

    if not ret:
        print("Frame read nahi hua")
        break

    cv2.imshow("Smart Attendance - Camera Test", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()