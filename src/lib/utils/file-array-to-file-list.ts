export function filesArrayToFileList(files: File[]): FileList {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
}

function fileListToArray(fileList: FileList | null): File[] {
  return fileList ? Array.from(fileList) : [];
}