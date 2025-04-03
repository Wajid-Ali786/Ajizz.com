import time
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class GitAutoCommitHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        # Run git add, commit, and push when a change is detected.
        subprocess.run(["git", "add", "-A"])
        subprocess.run(["git", "commit", "-m", "Auto-update commit"])
        subprocess.run(["git", "push", "origin", "main"])

if __name__ == "__main__":
    path = "."  # current directory
    event_handler = GitAutoCommitHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()

    print("Monitoring for file changes. Press Ctrl+C to exit.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
