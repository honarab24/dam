import express from "express";
import { spawn } from "child_process";

const app = express();

// Generate episodes map automatically (1–97)
const episodes = {};
for (let i = 1; i <= 97; i++) {
  episodes[i] = `https://cdn-aws9.spicychiliti.com/hls/20053/${i}/${i}_1080p.m3u8`;
}

// Serve frontend files
app.use(express.static("public"));

// Restream .m3u8 → .mp4 with ffmpeg
app.get("/download/:id.mp4", (req, res) => {
  const id = parseInt(req.params.id);
  const url = episodes[id];
  if (!url) return res.status(404).send("Episode not found");

  res.setHeader("Content-Disposition", `attachment; filename="episode${id}.mp4"`);
  res.setHeader("Content-Type", "video/mp4");

  const ffmpeg = spawn("ffmpeg", [
    "-i", url,      // Input HLS
    "-c", "copy",   // Copy codec (fast)
    "-bsf:a", "aac_adtstoasc",
    "-f", "mp4",
    "pipe:1"
  ]);

  ffmpeg.stdout.pipe(res);

  ffmpeg.stderr.on("data", (data) => {
    console.error(`ffmpeg error: ${data}`);
  });

  ffmpeg.on("close", (code) => {
    console.log(`ffmpeg exited with code ${code}`);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
