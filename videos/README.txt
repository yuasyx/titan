Drop your test videos here. The site expects these filenames (rename your files to match):

  fire-test.mp4       — fire/torch test (button is active on Technology page)
  moisture-test.mp4   — moisture / humidity test (button currently disabled)
  strength-test.mp4   — compressive strength test (button currently disabled)
  climate-test.mp4    — thermal/climate test (button currently disabled)

To activate a placeholder button after dropping in a video:
  1. Open technology.html
  2. Find the line with: <button class="watch-btn" disabled data-video="videos/moisture-test.mp4">
  3. Remove the word: disabled
  4. Change "Video coming soon" → "Watch the test"
  5. Commit and reload.

Recommended: keep each MP4 under 25 MB so GitHub Pages loads fast. Use H.264 codec.
