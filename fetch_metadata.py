import json
import subprocess
import sys

urls = [
    "https://www.youtube.com/watch?v=2pGObT6T-XE",
    "https://www.youtube.com/watch?v=9gTf8H3Ya9k",
    "https://www.youtube.com/watch?v=A0mRUTTPt30",
    "https://www.youtube.com/watch?v=BI2jcDcGq6g",
    "https://www.youtube.com/watch?v=cQ1BB0tOMI0",
    "https://www.youtube.com/watch?v=EDCqWK8h5AE",
    "https://www.youtube.com/watch?v=EeKw2kfwFYA",
    "https://www.youtube.com/watch?v=erbqSsUBK0k",
    "https://www.youtube.com/watch?v=Ey4XuixqdKQ",
    "https://www.youtube.com/watch?v=hL0883CI0BQ",
    "https://www.youtube.com/watch?v=J6plxDBnz5A",
    "https://www.youtube.com/watch?v=jCKWiwdpuuY",
    "https://www.youtube.com/watch?v=l1DbR3EQZtI",
    "https://www.youtube.com/watch?v=Ld8dkr_pnGY",
    "https://www.youtube.com/watch?v=mm8bDMegZik",
    "https://www.youtube.com/watch?v=nB0YeCZMg1E",
    "https://www.youtube.com/watch?v=PiEk7zcpL7I",
    "https://www.youtube.com/watch?v=tlGY6s-ZJug",
    "https://www.youtube.com/watch?v=tm2jCUGG-Lo",
    "https://www.youtube.com/watch?v=TmG5OizxSAo",
    "https://www.youtube.com/watch?v=uGrPdngMZ7A",
    "https://www.youtube.com/watch?v=VN6S-csF8Gk",
    "https://www.youtube.com/watch?v=WDH8JoVU6aU",
    "https://www.youtube.com/watch?v=E1wUSUIPYFM",
    "https://www.youtube.com/watch?v=ezmvkG427gc",
    "https://www.youtube.com/watch?v=S_VIF_l4Ulc",
    "https://www.youtube.com/watch?v=TPCLHAtX7e8",
    "https://www.youtube.com/watch?v=wo3Mb0i25YA",
    "https://www.youtube.com/watch?v=yk1gRE1Rv8I",
    "https://www.youtube.com/watch?v=XHOmBV4js_E",
    "https://www.youtube.com/watch?v=CmJzHrg7ceM"
]

results = []

for url in urls:
    try:
        print(f"Fetching metadata for {url}...", file=sys.stderr)
        cmd = ["yt-dlp", "--dump-json", url]
        result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        if result.returncode == 0:
            data = json.loads(result.stdout)
            video_info = {
                "url": url,
                "title": data.get("title", ""),
                "description": data.get("description", ""),
                "upload_date": data.get("upload_date", "")
            }
            results.append(video_info)
        else:
            print(f"Error fetching {url}: {result.stderr}", file=sys.stderr)
    except Exception as e:
        print(f"Exception fetching {url}: {e}", file=sys.stderr)

with open("metadata.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done. Metadata saved to metadata.json", file=sys.stderr)
