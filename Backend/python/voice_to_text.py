import pyttsx3 # type: ignore
import speech_recognition as sr # type: ignore


engine = pyttsx3.init()

def text_to_speech(text):
    """Convert text to speech using pyttsx3 (offline)."""
    engine.say(text)
    engine.runAndWait()

def speech_to_text():
    """Convert speech to text using speech_recognition."""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Please speak something...")
        recognizer.adjust_for_ambient_noise(source)  
        audio = recognizer.listen(source)
        try:
            text = recognizer.recognize_google(audio, language="en-US")
            print(f"You said: {text}")
            return text
        except sr.UnknownValueError:
            print("Sorry, I could not understand the audio.")
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")
    return None

def main():
    while True:
        print("\n1. Convert Text to Speech")
        print("2. Convert Speech to Text")
        print("3. Exit")
        choice = input("Choose an option (1/2/3): ")

        if choice == '1':
            text = input("Enter the text to convert to speech: ")
            text_to_speech(text)
        elif choice == '2':
            text = speech_to_text()
            if text:
                print(f"Converted Text: {text}")
        elif choice == '3':
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "_main_":
    main()