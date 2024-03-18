- Add favicon
- List projects
- List publications
- Update actual website

# Useful commands

Command for compressing vimage thumbnail

```bash
ffmpeg -y -i vimage.mp4 -filter:v fps=30  -s 250x250 -ss 00:00:00 -to 00:00:03  vimage.webm
```

