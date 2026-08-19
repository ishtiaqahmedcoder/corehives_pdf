"""Detect faces with OpenCV's bundled Haar Cascade classifier and blur each one.

Usage: python blur_faces.py <input_path> <output_path>
Prints "faces_blurred=<n>" on success. Classical CV, no external model download.
"""

import sys

import cv2


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: blur_faces.py <input_path> <output_path>", file=sys.stderr)
        return 1

    input_path, output_path = sys.argv[1], sys.argv[2]

    img = cv2.imread(input_path)
    if img is None:
        print("Could not read the input image.", file=sys.stderr)
        return 1

    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(cascade_path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        roi = img[y:y + h, x:x + w]
        blurred = cv2.GaussianBlur(roi, (51, 51), 30)
        img[y:y + h, x:x + w] = blurred

    if not cv2.imwrite(output_path, img):
        print("Could not write the output image.", file=sys.stderr)
        return 1

    print(f"faces_blurred={len(faces)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
