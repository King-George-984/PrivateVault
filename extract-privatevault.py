import zipfile

zip_path = "/tmp/privatevault-dist.zip"
output_path = "/var/www/privatevault"

with zipfile.ZipFile(zip_path, "r") as z:
    z.extractall(output_path)

print("EXTRACTION_COMPLETE")
