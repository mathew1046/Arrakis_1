import re
import json
import time
from PyPDF2 import PdfReader
import google.generativeai as genai

# -----------------------------
# CONFIG
# -----------------------------
genai.configure(api_key="AIzaSyCmQaVGoOa-7Pl42GABYQv1g0CqoK0WmNQ")  # Replace with your Gemini API key
model = genai.GenerativeModel("gemini-2.5-flash-lite")  # fast + cheap for hackathons

# -----------------------------
# Extract text from PDF
# -----------------------------
def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

# -----------------------------
# Split script into scenes
# -----------------------------
def split_script_into_scenes(script_text):
    pattern = r"(INT\.|EXT\.).*"  # detect scene headings
    matches = list(re.finditer(pattern, script_text, re.IGNORECASE))
    scenes = []
    for i in range(len(matches)):
        start = matches[i].start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(script_text)
        scenes.append(script_text[start:end].strip())
    return scenes

# -----------------------------
# Analyze each scene
# -----------------------------
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
            print("⚠️ Blocked scene detected!")
            print("Block reason:", response.prompt_feedback)
            return None

        raw_output = response.text.strip()
        raw_output = re.sub(r"```json|```", "", raw_output).strip()
        result = json.loads(raw_output)
        return result
    except Exception as e:
        print(f"⚠️ Error analyzing scene {scene_number}: {e}")
        print("Raw output:\n", response.text if 'response' in locals() else "No response")
        return None

# -----------------------------
# Main Logic (with rate limiting + live saving)
# -----------------------------
if __name__ == "__main__":
    pdf_path = "Batman-Begins-Script.pdf"
    script_text = extract_text_from_pdf(pdf_path)
    scenes_text = split_script_into_scenes(script_text)

    output_path = "script_analysis.json"
    all_scenes = []
    total_runtime = 0
    total_vfx = 0

    print(f"🎬 Found {len(scenes_text)} scenes. Starting analysis...\n")

    # Create or reset the output file
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"scenes": []}, f, indent=2)

    for i, scene_text in enumerate(scenes_text, 1):
        print(f"→ Processing scene {i}/{len(scenes_text)}...")
        result = analyze_scene(scene_text, i)

        if result:
            # handle both dict and list output
            if isinstance(result, list):
                scene_data = result[0] if result else {}
            elif isinstance(result, dict):
                scene_data = result
            else:
                print(f"⚠️ Unexpected result type for scene {i}: {type(result)}")
                continue

            all_scenes.append(scene_data)
            total_runtime += scene_data.get("estimated_runtime_minutes", 0)
            if scene_data.get("vfx_required"):
                total_vfx += 1

            # ✅ Save immediately to file
            with open(output_path, "r+", encoding="utf-8") as f:
                data = json.load(f)
                data["scenes"].append(scene_data)
                f.seek(0)
                json.dump(data, f, indent=2)
                f.truncate()

        # 🕐 Respect Gemini free-tier rate limit
        time.sleep(4)
  # 2.1s × 30 ≈ 63s per 30 calls

    # ✅ Final summary at the end
    final_json = {
        "title": "Hackathon Film",
        "total_scenes": len(all_scenes),
        "total_runtime_minutes": total_runtime,
        "total_vfx_scenes": total_vfx,
        "scenes": all_scenes,
    }

    # overwrite with final summary
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_json, f, indent=2)

    print("\n✅ Analysis complete! All results saved to script_analysis.json.")
