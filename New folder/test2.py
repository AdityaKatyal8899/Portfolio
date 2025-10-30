from transformers import LlavaForConditionalGeneration, AutoTokenizer, AutoImageProcessor
from PIL import Image
import torch

model_id = "liuhaotian/llava-v1.5-7b"

# Load model
model = LlavaForConditionalGeneration.from_pretrained(
    model_id, torch_dtype=torch.float16, device_map="auto"
)

# Load tokenizer & image processor explicitly
tokenizer = AutoTokenizer.from_pretrained(model_id)
image_processor = AutoImageProcessor.from_pretrained(model_id)

def analyze_image(image_path, prompt="Describe this image in detail"):
    image = Image.open(image_path).convert("RGB")

    # Preprocess
    pixel_values = image_processor(image, return_tensors="pt").pixel_values
    input_ids = tokenizer(prompt, return_tensors="pt").input_ids

    # Move to model device
    pixel_values = pixel_values.to(model.device)
    input_ids = input_ids.to(model.device)

    # Generate response
    output_ids = model.generate(
        input_ids=input_ids,
        pixel_values=pixel_values,
        max_new_tokens=300
    )

    response = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return response


if __name__ == "__main__":
    print(analyze_image("test.png", prompt="What improvements can be made to this image?"))
