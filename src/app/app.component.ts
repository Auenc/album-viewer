import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  directoryOpen,
  FileWithDirectoryAndFileHandle,
} from 'browser-fs-access';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  ngOnInit(): void {}
  title = 'defect-viewer';

  files: [] = [];
  directories: { name: string; urls: string[] }[] = [];

  async readDir() {
    const files = await directoryOpen({ recursive: true, mode: 'read' });
    console.log('files', files);

    const directories: { name: string; urls: string[] }[] = [];

    for (const file of files) {
      if (!isFileWithDirectoryHandle(file)) {
        continue;
      }
      const dirName = file.directoryHandle?.name;
      if (!dirName) {
        continue;
      }
      if (!directories.find((dir) => dirName === dir.name)) {
        directories.push({ name: dirName, urls: [] });
      }
      const dir = directories.find((dir) => dirName == dir.name)!;

      const f = await file.handle?.getFile();
      if (!f) {
        continue;
      }
      const url = URL.createObjectURL(f);
      dir.urls.push(url);
    }
    this.directories = directories;
  }
}

function isFileWithDirectoryHandle(
  file: FileWithDirectoryAndFileHandle | FileSystemDirectoryHandle
): file is FileWithDirectoryAndFileHandle {
  return 'directoryHandle' in file;
}
