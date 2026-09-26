"""
Demeter — AgriConnect (SIH 2026)
Standard entrypoint wrapper for Streamlit Community Cloud (app.py)
"""
import runpy

if __name__ == "__main__":
    runpy.run_path("streamlit_app.py", run_name="__main__")
