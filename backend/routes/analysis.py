from flask import Blueprint, request, jsonify, current_app
import os
import re
import json
import time
from PyPDF2 import PdfReader
import google.generativeai as genai
from werkzeug.utils import secure_filename
from utils.data_transformer import transform_script_data
from utils.json_handler import json_handler

analysis_bp = Blueprint('analysis', __name__)

# Configure Gemini
# IMPORTANT: Replace with your actual API key or load from environment variables
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "AIzaSyCmQaVGoOa-7Pl42GABYQv1g0CqoK0WmNQ"))
model = genai.GenerativeModel("gemini-2.5-flash-lite")

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def split_script_into_scenes(script_text):
    pattern = r"(INT\.|EXT\.).*"
    matches = list(re.finditer(pattern, script_text, re.IGNORECASE))
    scenes = []
    for i in range(len(matches)):
        start = matches[i].start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(script_text)
        scenes.append(script_text[start:end].strip())
    return scenes

def analyze_scene(scene_text, scene_number):
    prompt = f"""
    You are a professional **Film Production Script Breakdown Analyst** specializing in pre-production data extraction for scheduling and budgeting.

    Your task is to analyze the provided **movie scene text** and generate a **well-structured, fully populated JSON object** containing an accurate and detailed breakdown of all key production elements.

    ### Core Objective
    Extract, infer, and standardize all relevant details from the scene text — even when implicit — using cinematic conventions and logical reasoning. Maintain consistency across fields.

    ### Output Requirements
    Return **only** a valid JSON object (no markdown, no commentary, no extra text).  
    All arrays must be non-null (use empty arrays `[]` if data is missing).  
    All string fields must be non-empty (use `"N/A"` if undetermined).

    ---

    ### Required JSON Fields

    1. **scene_number** (integer) — the provided scene number.
    2. **title** (string) — full scene heading (e.g., "INT. COFFEE SHOP – DAY").
    3. **int_ext** (string) — one of: `"INT"`, `"EXT"`, `"INT/EXT"`, inferred from the title or context.
    4. **day_night** (string) — one of: `"DAY"`, `"NIGHT"`, `"DUSK"`, `"DAWN"`, etc.
    5. **location** (string) — main setting (e.g., "Coffee Shop", "Downtown Street").
    6. **estimated_runtime_minutes** (integer) — assume 1 page ≈ 1 minute. If text length < 250 words → 1 minute; 250–500 → 2; 500–750 → 3, etc.
    7. **scene_description** (string) — concise (1–2 sentences) summary of key visual or narrative action.
    8. **characters** (array of strings) — all named speaking or featured characters.
    9. **extras** (array of strings) — background or non-speaking individuals.
    10. **props** (array of strings) — notable objects interacted with or visible.
    11. **wardrobe** (array of strings) — specific or unique costume elements.
    12. **makeup_hair** (array of strings) — distinctive styling or effects makeup.
    13. **vehicles_animals_fx** (array of strings) — vehicles, animals, explosions, fire, weather, or SFX cues.
    14. **set_dressing** (array of strings) — furniture, signage, decorations, environmental details.
    15. **special_equipment** (array of strings) — any required camera rigs, drones, cranes, underwater gear, etc.
    16. **stunts_vfx** (array of strings) — stunts, wire work, CGI elements, green screen, compositing needs.
    17. **sound_requirements** (array of strings) — ambient, practical, or diegetic sounds (e.g., “car horns,” “rain,” “gunshot”).
    18. **mood_tone** (string) — emotional or atmospheric tone (e.g., “tense,” “romantic,” “chaotic,” “somber”).
    19. **scene_complexity** (string) — `"Low"`, `"Medium"`, or `"High"` based on number of elements (many props, extras, or VFX → High).
    20. **vfx_required** (boolean) — true if any visual effects or digital compositing are implied.
    21. **vfx_details** (string) — short explanation of VFX if applicable, else `"N/A"`.
    22. **scene_status** (string) — always `"Not Shot"`.

    ---

    ### Inference Guidelines
    - If setting involves both inside and outside, set **int_ext** to `"INT/EXT"`.
    - For **day_night**, infer from context clues like “moonlight,” “lamps,” or “bright sunlight.”
    - Derive **scene_complexity** by counting unique production elements (props + extras + VFX).
    - Use neutral tone and avoid speculative writing.
    - Do not include metadata, explanations, or formatting.

    ---

    ### Input Format
    Scene Number: {scene_number}  
    Scene Text:  
    {scene_text}

    ---

    ### Output Format
    Return **only** this exact JSON structure with all fields present and filled.

    """
    try:
        response = model.generate_content(prompt)
        if not response.candidates:
            return None
        raw_output = response.text.strip()
        raw_output = re.sub(r"```json|```", "", raw_output).strip()
        return json.loads(raw_output)
    except Exception as e:
        current_app.logger.error(f"Error analyzing scene {scene_number}: {e}")
        return None

@analysis_bp.route('/script', methods=['POST'])
def analyze_script_route():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'}), 400

    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        pdf_path = os.path.join(upload_folder, filename)
        file.save(pdf_path)

        try:
            script_text = extract_text_from_pdf(pdf_path)
            scenes_text = split_script_into_scenes(script_text)

            all_scenes = []
            for i, scene_text_item in enumerate(scenes_text, 1):
                result = analyze_scene(scene_text_item, i)
                if result:
                    scene_data = result[0] if isinstance(result, list) else result
                    all_scenes.append(scene_data)
                time.sleep(4) # Rate limiting

            final_json = {
                "title": os.path.splitext(filename)[0],
                "scenes": all_scenes,
            }
            
            transformed_data = transform_script_data(final_json)

            return jsonify({'success': True, 'data': transformed_data})

        except Exception as e:
            current_app.logger.error(f"Script analysis failed: {e}")
            return jsonify({'success': False, 'message': 'Script analysis failed'}), 500
        finally:
            os.remove(pdf_path)
    
    return jsonify({'success': False, 'message': 'Invalid file type, only PDF is accepted'}), 400

@analysis_bp.route('/script/text', methods=['POST'])
def analyze_script_text_route():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'success': False, 'message': 'No text provided'}), 400

    script_text = data['text']
    
    try:
        scenes_text = split_script_into_scenes(script_text)

        all_scenes = []
        for i, scene_text_item in enumerate(scenes_text, 1):
            result = analyze_scene(scene_text_item, i)
            if result:
                scene_data = result[0] if isinstance(result, list) else result
                all_scenes.append(scene_data)
            time.sleep(4) # Rate limiting

        final_json = {
            "title": "Analyzed Script",
            "scenes": all_scenes,
        }
        
        transformed_data = transform_script_data(final_json)

        json_handler.write_json('script.json', transformed_data)

        return jsonify({'success': True, 'data': transformed_data})

    except Exception as e:
        current_app.logger.error(f"Script analysis from text failed: {e}")
        return jsonify({'success': False, 'message': 'Script analysis from text failed'}), 500
