import os
from PIL import Image

def optimize_images(directory, max_size=(1920, 1080), quality=85):
    if not os.path.exists(directory):
        print(f"Directory {directory} not found.")
        return

    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(directory, filename)
            
            # Original file size
            orig_size = os.path.getsize(filepath)
            
            with Image.open(filepath) as img:
                # Convert to RGB if it's JPEG
                if filename.lower().endswith(('.jpg', '.jpeg')) and img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize if larger than max_size
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Save optimized
                if filename.lower().endswith(('.jpg', '.jpeg')):
                    img.save(filepath, 'JPEG', quality=quality, optimize=True)
                elif filename.lower().endswith('.png'):
                    # For PNG, we can use optimize=True which tries to make the PNG as small as possible
                    img.save(filepath, 'PNG', optimize=True)
            
            # New file size
            new_size = os.path.getsize(filepath)
            reduction = (orig_size - new_size) / orig_size * 100
            
            print(f"Optimized {filename}: {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({reduction:.1f}% reduction)")

if __name__ == "__main__":
    img_dir = os.path.join(os.getcwd(), 'img')
    print(f"Starting image optimization in {img_dir}...")
    optimize_images(img_dir)
    print("Optimization complete.")
