# Music Folder — How to Add Albums

This folder contains all self-hosted music for the Dancing Salamanders website.

## Folder Structure

```
public/music/
└── album-slug/                  ← one folder per album
    ├── cover.jpg                ← album artwork (accepts: .jpg .png .webp)
    ├── 01 - Track Name.mp3
    ├── 02 - Another Track.mp3
    └── ...
```

## Naming Rules

### Album folder name
- Use lowercase, hyphens for spaces: `threads-between-the-stars`
- This slug is used in the URL and converted to a display title automatically
- Example: `the-alchemists-estate` → "The Alchemists Estate"

### Track files
- Prefix each filename with a 2-digit number: `01`, `02`, etc.
- Separate the number from the title with ` - ` (space-dash-space)
- Example: `03 - Winter Garden.mp3`
- Supported formats: `.mp3`, `.flac`, `.wav`, `.ogg`, `.m4a`

### Cover art
- Name it exactly `cover.jpg` (or `cover.png` / `cover.webp`)
- Recommended size: 800×800 px minimum, square aspect ratio
- If missing, a placeholder will be shown

## Example

```
public/music/
├── ordain/
│   ├── cover.jpg
│   ├── 01 - Opening.mp3
│   └── 02 - The Vow.mp3
└── threads-between-the-stars/
    ├── cover.jpg
    ├── 01 - Stardrift.mp3
    ├── 02 - Pale Light.mp3
    └── 03 - The Return.mp3
```

## No Code Changes Needed

The music page auto-discovers all albums and tracks from this folder.
Adding a new album is as simple as dropping a new folder here and restarting
the dev server (or the Docker container in production).
