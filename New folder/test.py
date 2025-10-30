from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import gradio as gd

processor  = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")

model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def captioner(img):
    img_in = Image.fromarray(img)
    inputs = processor(img_in, return_tensors="pt")
    op =  model.generate(**inputs)
    caption = processor.decode(op[0], skip_special_tokens=True)
    return caption 

demo = gd.Interface(fn=captioner, inputs=[gd.Image(label="Demo")], outputs=[gd.Text(label="OPDEMo")])
demo.launch()

