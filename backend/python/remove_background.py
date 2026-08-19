"""Remove an image's background using rembg (U2Net, ONNX runtime, CPU).

Usage: python remove_background.py <input_path> <output_path>
The model is downloaded and cached by rembg on first use.
"""

import sys

from PIL import Image
from rembg import new_session, remove

# Pinned to the classic U2Net model (~176MB, MIT-licensed) rather than
# rembg's newer default session, which is a much larger (~1GB+) model with
# more restrictive licensing terms unsuited to a free/commercial product.
_SESSION = new_session("u2net")


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: remove_background.py <input_path> <output_path>", file=sys.stderr)
        return 1

    input_path, output_path = sys.argv[1], sys.argv[2]

    try:
        image = Image.open(input_path)
        result = remove(image, session=_SESSION)
        result.save(output_path)
    except Exception as exc:  # noqa: BLE001 - surface any failure to the caller
        print(f"Could not remove the background: {exc}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
