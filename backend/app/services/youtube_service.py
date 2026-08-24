import re
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi


def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from various URL formats."""
    regex = r"(?:v=|\/|youtu\.be\/)([a-zA-Z0-9_-]{11})"
    match = re.search(regex, url)
    if match:
        return match.group(1)
    return None


def get_youtube_transcript(url: str) -> tuple[str, str]:
    """
    Extracts title and transcript from a YouTube video URL using YouTubeTranscriptApi.
    Returns (video_title, transcript_text).
    """
    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError("Invalid YouTube URL provided.")

    # Get video metadata (title) via yt-dlp without downloading media
    video_title = f"YouTube Video ({video_id})"
    try:
        ydl_opts = {
            "quiet": True,
            "skip_download": True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if info and "title" in info:
                video_title = info["title"]
    except Exception as e:
        print(f"Metadata fetch warning: {e}")

    # Fetch transcript using YouTubeTranscriptApi instance fetch method
    ytt_api = YouTubeTranscriptApi()
    try:
        # Try fetching default transcript (or english)
        transcript_data = ytt_api.fetch(video_id, languages=['en', 'en-US', 'en-GB'])
        transcript_text = " ".join([getattr(item, 'text', str(item)) for item in transcript_data])
        return video_title, transcript_text
    except Exception as e:
        # Fallback: List available transcripts and fetch the first available one
        try:
            transcript_list = ytt_api.list(video_id)
            for transcript in transcript_list:
                fetched = transcript.fetch()
                transcript_text = " ".join([getattr(item, 'text', str(item)) for item in fetched])
                if transcript_text.strip():
                    return video_title, transcript_text
            raise ValueError("No readable text found in video transcripts.")
        except Exception as fallback_err:
            raise ValueError(
                f"Could not retrieve transcript for YouTube video (ID: {video_id}). "
                "Ensure the video has captions enabled."
            ) from fallback_err