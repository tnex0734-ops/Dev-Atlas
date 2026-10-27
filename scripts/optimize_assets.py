import os
from PIL import Image

image_targets = {
    'dev-ai.png': {'max_dim': 400, 'quality': 88},
    'health.png': {'max_dim': 400, 'quality': 88},
    'done.png': {'max_dim': 400, 'quality': 88},
    'progress.png': {'max_dim': 400, 'quality': 88},
    'blocked.png': {'max_dim': 400, 'quality': 88},
    'devatlas-topnav-logo.png': {'max_dim': 600, 'quality': 90},
    'devatlas-logo.png': {'max_dim': 500, 'quality': 90},
    'favicon.png': {'max_dim': 128, 'quality': 90},
}

public_dir = os.path.join(os.path.dirname(__file__), '..', 'public')

total_orig = 0
total_opt = 0

for name, cfg in image_targets.items():
    src_path = os.path.join(public_dir, name)
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        continue
    
    orig_size = os.path.getsize(src_path)
    total_orig += orig_size
    img = Image.open(src_path).convert('RGBA')
    orig_w, orig_h = img.size
    max_dim = cfg['max_dim']
    scale = min(1.0, max_dim / max(orig_w, orig_h))
    new_w, new_h = int(orig_w * scale), int(orig_h * scale)
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    webp_name = name.replace('.png', '.webp')
    webp_path = os.path.join(public_dir, webp_name)
    resized.save(webp_path, 'WEBP', quality=cfg['quality'], method=6)
    
    # Save optimized PNG as well
    resized.save(src_path, 'PNG', optimize=True)
    new_png_size = os.path.getsize(src_path)
    new_webp_size = os.path.getsize(webp_path)
    total_opt += new_webp_size
    
    print(f"{name:25} {orig_w:4}x{orig_h:<4} -> {new_w:4}x{new_h:<4} | Orig: {orig_size/1024:6.1f} KB -> PNG: {new_png_size/1024:5.1f} KB | WebP: {new_webp_size/1024:5.1f} KB")

print(f"\nTotal asset size: {total_orig/1024/1024:.2f} MB -> WebP: {total_opt/1024:.1f} KB ({(1 - total_opt/total_orig)*100:.1f}% reduction)")
