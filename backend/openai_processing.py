import openai
import sys
import json
import os

openai.api_key = os.getenv('OPENAI_API_KEY')

def extract_requirements_from_openai(job_description):
    prompt = f"Extract the skills, technologies, experience, and environment from the following job description:\n\n{job_description}\n\nSkills:\nTechnologies:\nExperience:\nEnvironment:\nOthers:"
    
    response = openai.Completion.create(
        engine="davinci-codex",
        prompt=prompt,
        max_tokens=300
    )
    
    return response.choices[0].text.strip()

if __name__ == "__main__":
    job_description = sys.argv[1]
    requirements = extract_requirements_from_openai(job_description)
    print(requirements)
