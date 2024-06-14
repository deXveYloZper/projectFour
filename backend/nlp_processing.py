import warnings
warnings.filterwarnings("ignore", category=FutureWarning, message="`resume_download` is deprecated and will be removed in version 1.0.0")
warnings.filterwarnings("ignore", category=UserWarning, message="Some weights of the model checkpoint")

import sys
import json
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification

# Specify a model and tokenizer explicitly for NER
model_name = "dslim/bert-base-NER"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
nlp_transformer = pipeline("ner", model=model, tokenizer=tokenizer)

def clean_text(text):
    """
    Preprocesses the text for better NER performance.
    
    Args:
    text (str): The job description text.

    Returns:
    str: Cleaned text.
    """
    # Perform any text cleaning here
    return text

def extract_requirements(text):
    """
    Extracts key requirements (skills, technologies, experience, environment) from the given job description text.

    Args:
    text (str): The job description text.

    Returns:
    dict: A dictionary categorizing the extracted requirements.
    """
    requirements = {
        "skills": [],
        "technologies": [],
        "experience": [],
        "environment": []
    }

    # Preprocess the text
    text = clean_text(text)

    # Use the Transformers pipeline directly for NER
    results = nlp_transformer(text)

    # Merge subwords
    current_entity = None
    current_label = None

    for result in results:
        entity = result['entity']
        word = result['word']

        # Handle subword tokens
        if word.startswith('##'):
            if current_entity is not None:
                current_entity += word[2:]
        else:
            if current_entity is not None:
                # Append the completed entity to the corresponding category
                if current_label in ["SKILL", "SOFT_SKILL"]:
                    requirements["skills"].append(current_entity)
                elif current_label in ["TECHNOLOGY", "TOOL"]:
                    requirements["technologies"].append(current_entity)
                elif current_label in ["ORG", "LOC"]:  # Could be relevant to experience or environment
                    requirements["experience"].append(current_entity)
                
                current_entity = None
                current_label = None

            if entity.startswith("B-") or entity.startswith("I-"):
                current_entity = word
                current_label = entity[2:]

    # Append the last entity if present
    if current_entity is not None:
        if current_label in ["SKILL", "SOFT_SKILL"]:
            requirements["skills"].append(current_entity)
        elif current_label in ["TECHNOLOGY", "TOOL"]:
            requirements["technologies"].append(current_entity)
        elif current_label in ["ORG", "LOC"]:
            requirements["experience"].append(current_entity)

    return requirements

if __name__ == "__main__":
    job_description = sys.argv[1]
    requirements = extract_requirements(job_description)
    print(json.dumps(requirements))
