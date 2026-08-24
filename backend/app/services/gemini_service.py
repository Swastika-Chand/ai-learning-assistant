import os

from dotenv import load_dotenv
from google import genai

load_dotenv()



client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def ask_gemini(prompt):

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:

        print("=" * 50)
        print("GEMINI ERROR")
        print(e)
        print("=" * 50)

        return f"""
Unable to generate response.

Error:

{str(e)}
"""